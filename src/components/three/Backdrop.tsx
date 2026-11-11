"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * Fixed full-page WebGL layer behind all content. three.js is loaded in its own chunk once the
 * browser is idle, so it never touches first paint. Without WebGL the page is unchanged.
 */
export default function Backdrop() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let dead = false;
    const run = async () => {
      try {
        const { mount, silhouette } = await import("./scene");
        if (dead || !host.current) return;
        const cut = document.querySelector<HTMLElement>(".hero .cut");
        if (cut) {
          const mask = `url(${await silhouette("hero/hero-still.webp")})`;
          cut.style.maskImage = cut.style.webkitMaskImage = mask;
          cut.classList.add("on");
        }
        const stop = await mount(host.current, prefersReducedMotion());
        if (dead) stop();
        else dispose = stop;
        host.current.classList.add("on");
      } catch {
        /* no WebGL: keep the flat page */
      }
    };
    const hasIdle = "requestIdleCallback" in window; // Safari has no idle callbacks
    const id = hasIdle ? requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 400);
    return () => {
      dead = true;
      if (hasIdle) cancelIdleCallback(id);
      else clearTimeout(id);
      dispose?.();
    };
  }, []);

  return (
    <div ref={host} className="backdrop" aria-hidden="true">
      <style>{`
        .backdrop{position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity 1.2s var(--ease)}
        .backdrop.on{opacity:1}
        .backdrop canvas{width:100%!important;height:100%!important;display:block}
      `}</style>
    </div>
  );
}
