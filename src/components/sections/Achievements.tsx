"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import TechLogo, { isBrand } from "@/components/ui/TechLogo";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";

const CARD_COLORS = ["#5b4bff", "#00A1E0", "#FF7A59", "#0ea5a4", "#7c3aed", "#f5a700", "#ec4899", "#16a34a"];

export default function Achievements() {
  const { ref, progress } = useScrollProgress<HTMLElement>("pinned");
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [nearest, setNearest] = useState(0);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      const vw = window.innerWidth;
      setTravel(Math.max(0, t.scrollWidth - vw + 2 * parseFloat(getComputedStyle(t).paddingLeft || "0")));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = -progress * travel;

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const centre = window.innerWidth / 2;
    let best = 0;
    let bestD = Infinity;
    Array.from(t.children).forEach((c, i) => {
      const r = (c as HTMLElement).getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centre);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setNearest(best);
  }, [x]);

  return (
    <section
      id="achievements"
      className="ach"
      ref={ref}
      aria-labelledby="ach-h"
      style={{ height: `calc(100svh + ${travel}px)` }}
    >
      <div className="pin">
        <div className="wrap head">
          <div>
            <p className="tag rv">
              06 <span>/ Achievements</span>
            </p>
            <h2 id="ach-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
              Proud <em>moments.</em>
            </h2>
          </div>
          <div className="bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>

        <div className="track" ref={trackRef} style={{ transform: `translate3d(${x}px,0,0)` }}>
          {ACHIEVEMENTS.map((a, i) => (
            <Card key={a.id} a={a} i={i} total={ACHIEVEMENTS.length} active={i === nearest} color={CARD_COLORS[i % CARD_COLORS.length]} />
          ))}
          <div className="end mono" aria-hidden="true">
            and counting →
          </div>
        </div>
      </div>

      <style>{`
        .ach{position:relative}
        .pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(24px,5vh,56px);overflow:hidden}
        .head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
        .bar{width:min(240px,30vw);height:2px;background:var(--line);border-radius:2px;overflow:hidden;margin-bottom:10px}
        .bar span{display:block;height:100%;background:var(--grad);transform-origin:left;transition:transform .15s linear}
        .track{display:flex;gap:22px;align-items:center;padding-left:max(var(--gutter),calc((100vw - 1320px)/2 + var(--gutter)));padding-right:var(--gutter);will-change:transform;width:max-content}
        .end{flex:none;font-size:14px;color:var(--accent-ink);font-weight:700;padding:0 24px}
      `}</style>
    </section>
  );
}

function Card({ a, i, total, active, color }: { a: Achievement; i: number; total: number; active: boolean; color: string }) {
  const [seen, setSeen] = useState(false);
  const [n, setN] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setN(a.value);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setN(Math.round(a.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, a.value]);

  return (
    <article ref={ref} className={`ach-card ${active ? "is-active" : ""}`} style={{ "--cc": color } as React.CSSProperties} aria-label={`${a.label}: ${a.prefix ?? ""}${a.value.toLocaleString("en-GB")}${a.suffix ?? ""}`}>
      <div className="ach-top">
        <div className="ach-tile">
          <TechLogo name={a.logo} size={40} glow={isBrand(a.logo)} />
        </div>
        <span className="mono ach-idx">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="ach-bottom">
        <div className="txt">
          <p className="label">{a.label}</p>
          <p className="cap">{a.caption}</p>
          <p className="det mono">{a.detail}</p>
        </div>
        <p className="ach-num" aria-hidden="true">
          {a.prefix}
          {n.toLocaleString("en-GB")}
          {a.suffix}
        </p>
      </div>
      <style>{`
        .ach-card{flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);background:linear-gradient(160deg,#fff 55%,color-mix(in srgb,var(--cc) 14%,#fff));border-radius:28px;padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 0 rgba(13,13,13,.04),0 10px 30px -22px rgba(13,13,13,.25);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
        .ach-card.is-active{transform:translateY(-12px);box-shadow:0 40px 70px -30px color-mix(in srgb,var(--cc) 60%,transparent),0 2px 6px -2px rgba(13,13,13,.06)}
        .ach-top{display:flex;justify-content:space-between;align-items:flex-start}
        .ach-tile{width:72px;height:72px;border-radius:20px;background:color-mix(in srgb,var(--cc) 12%,#fff);display:grid;place-items:center;box-shadow:var(--shadow-hair);transition:box-shadow .7s var(--ease)}
        .ach-card.is-active .ach-tile{box-shadow:var(--shadow-hair),0 12px 30px -14px rgba(13,13,13,.3)}
        .ach-card.is-active .tl[data-glow]::before{opacity:.3}
        .ach-idx{font-size:11px;color:var(--cc);font-weight:700}
        .ach-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
        .txt{min-width:0}
        .label{font-weight:600;font-size:17px;letter-spacing:-.02em}
        .cap{font-size:13px;color:var(--mute);margin-top:3px}
        .det{font-size:10px;color:var(--mute);margin-top:8px;letter-spacing:.02em}
        .ach-num{font-size:clamp(44px,5.4vw,76px);font-weight:700;letter-spacing:-.06em;line-height:.9;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--cc)}
      `}</style>
    </article>
  );
}
