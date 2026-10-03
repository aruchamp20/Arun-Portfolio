"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/env";
import { LOADER, MEDIA } from "@/lib/content";
import { asset } from "@/lib/paths";

const PARTICLE_COLOURS = ["#D9A441", "#B5412E", "#6E7F4B", "#A8673E", "#C9B9A6"];

/**
 * Premium loading screen: editorial wordmark, a percentage that tracks the
 * hero poster and video metadata, tiny 2D spice particles, then a mask that
 * lifts to reveal the hero. No spinner. Skipped under reduced motion.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem("gm-loaded")) {
      setGone(true);
      onDone();
      return;
    }
    const el = root.current!;
    const letters = el.querySelectorAll<HTMLSpanElement>(".ld-char");
    const lines = el.querySelectorAll<HTMLSpanElement>(".ld-line");
    const state = { p: 0 };
    let real = 0; // 0..1 progress of actual assets
    const assets = 2;
    let loaded = 0;
    const bump = () => (real = ++loaded / assets);

    const img = new Image();
    img.onload = bump;
    img.onerror = bump;
    img.src = asset(MEDIA.image(1));
    const v = document.createElement("video");
    v.muted = true;
    v.preload = "metadata";
    v.onloadedmetadata = bump;
    v.onerror = bump;
    v.src = asset(MEDIA.video(1));

    // particles (2D, cheap)
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const resize = () => {
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
    };
    resize();
    const N = 46;
    const ps = Array.from({ length: N }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.2,
      s: 0.00006 + Math.random() * 0.00016,
      ph: Math.random() * 6.28,
      col: PARTICLE_COLOURS[i % PARTICLE_COLOURS.length],
      a: 0.25 + Math.random() * 0.45,
    }));
    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of ps) {
        p.y -= p.s * 16;
        if (p.y < -0.05) p.y = 1.05;
        const x = (p.x + Math.sin(t * 0.0004 + p.ph) * 0.012) * c.width;
        const y = p.y * c.height;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(x, y, p.r * dpr, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    const tl = gsap.timeline();
    tl.fromTo(letters, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.035, ease: "expo.out" }, 0.1);
    tl.fromTo(lines, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.55, ease: "power2.out" }, 0.5);

    // counter: eases toward max(timeline floor, real asset progress)
    const start = performance.now();
    const tickCounter = () => {
      const elapsed = (performance.now() - start) / 1000;
      const floor = Math.min(0.92, elapsed / 2.2); // never stalls below the eye's patience
      const target = Math.max(floor, real) * 100;
      state.p += (target - state.p) * 0.08;
      if (real >= 1 && elapsed > 2.3) state.p += (100 - state.p) * 0.2;
      if (counter.current) counter.current.textContent = String(Math.round(state.p)).padStart(3, "0");
      if (state.p > 99.4 && real >= 1 && !done.current) {
        done.current = true;
        if (counter.current) counter.current.textContent = "100";
        finish();
      }
    };
    gsap.ticker.add(tickCounter);

    const finish = () => {
      gsap.ticker.remove(tickCounter);
      const out = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("gm-loaded", "1");
          setGone(true);
          onDone();
        },
      });
      out.to([letters, lines, counter.current], { opacity: 0, y: -10, duration: 0.5, stagger: 0.01, ease: "power2.in" }, 0);
      out.to(c, { opacity: 0, duration: 0.5 }, 0);
      // the panel lifts like a page turning, revealing the hero beneath
      out.to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "expo.inOut" }, 0.25);
    };

    // safety: if assets fail silently, finish anyway
    const safety = setTimeout(() => {
      real = 1;
    }, 6000);

    return () => {
      clearTimeout(safety);
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tickCounter);
      window.removeEventListener("resize", resize);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="ld"
      role="status"
      aria-live="polite"
      aria-label="Loading Ghughumalu"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <canvas ref={canvas} className="ld-canvas" aria-hidden="true" />
      <div className="ld-inner wrap">
        <div className="ld-word" aria-hidden="true">
          {LOADER.word.split("").map((ch, i) => (
            <span key={i} className="ld-mask">
              <span className="ld-char">{ch}</span>
            </span>
          ))}
        </div>
        <div className="ld-foot">
          <div className="ld-lines" aria-hidden="true">
            {LOADER.lines.map((l) => (
              <span key={l} className="ld-line">
                {l}
              </span>
            ))}
          </div>
          <span ref={counter} className="ld-count">
            000
          </span>
        </div>
      </div>
      <style>{`
        .ld{position:fixed;inset:0;z-index:150;background:var(--canvas);color:var(--ink);will-change:clip-path}
        .ld::before{content:"";position:absolute;inset:0;opacity:.6;background:radial-gradient(1000px 600px at 30% 10%, rgba(43,35,32,.04), transparent 60%)}
        .ld-canvas{position:absolute;inset:0;width:100%;height:100%}
        .ld-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding-top:clamp(28px,6vh,64px);padding-bottom:clamp(28px,6vh,64px)}
        .ld-word{font-family:var(--font-serif);font-size:clamp(48px,11vw,190px);line-height:1;letter-spacing:-.035em;font-variation-settings:"opsz" 144,"SOFT" 40;display:flex;margin-top:auto;margin-bottom:auto}
        .ld-mask{display:inline-block;overflow:hidden;padding-bottom:.12em;margin-bottom:-.12em}
        .ld-char{display:inline-block;will-change:transform,opacity}
        .ld-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
        .ld-lines{display:grid;gap:4px;font-size:13px;color:var(--mute);letter-spacing:.02em}
        .ld-count{font-family:var(--font-serif);font-variation-settings:"opsz" 144,"SOFT" 0;font-size:clamp(40px,6vw,96px);line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
      `}</style>
    </div>
  );
}
