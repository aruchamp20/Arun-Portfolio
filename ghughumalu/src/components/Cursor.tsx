"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Custom cursor: a small ink dot that follows tightly and a ring that lags.
 * Over interactive elements the ring grows; over food media it becomes a
 * label ("View" / "Taste") read from data-cursor. Mounted only for fine
 * pointers without reduced motion (see Experience).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const d = dot.current!;
    const r = ring.current!;
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.4 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, select, label");
      if (!t) {
        gsap.to(r, { scale: 1, backgroundColor: "rgba(43,35,32,0)", duration: 0.45, ease: "power3.out" });
        gsap.to(d, { scale: 1, duration: 0.3 });
        if (label.current) label.current.textContent = "";
        return;
      }
      const text = t.dataset.cursor;
      if (text) {
        if (label.current) label.current.textContent = text;
        gsap.to(r, { scale: 3.2, backgroundColor: "rgba(43,35,32,0.92)", duration: 0.5, ease: "power3.out" });
        gsap.to(d, { scale: 0, duration: 0.3 });
      } else {
        if (label.current) label.current.textContent = "";
        gsap.to(r, { scale: 1.9, backgroundColor: "rgba(43,35,32,0.06)", duration: 0.45, ease: "power3.out" });
        gsap.to(d, { scale: 0.6, duration: 0.3 });
      }
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
      <div ref={ring} className="cur-ring" aria-hidden="true">
        <span ref={label} className="cur-label" />
      </div>
      <style>{`
        .cur-dot,.cur-ring{position:fixed;top:0;left:0;z-index:180;pointer-events:none;opacity:0;border-radius:50%;will-change:transform}
        .cur-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:var(--ink)}
        .cur-ring{width:34px;height:34px;margin:-17px 0 0 -17px;box-shadow:inset 0 0 0 1px rgba(43,35,32,.5);display:grid;place-items:center;transition:box-shadow .3s}
        .cur-label{font-size:4px;letter-spacing:.14em;text-transform:uppercase;color:var(--canvas);font-weight:500;white-space:nowrap}
      `}</style>
    </>
  );
}
