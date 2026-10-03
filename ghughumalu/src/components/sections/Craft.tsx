"use client";

import { useCallback, useEffect, useRef } from "react";
import { CRAFT, IMAGE_ALT, MEDIA } from "@/lib/content";
import { windowInOut } from "@/lib/env";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";
import MaskImage from "../MaskImage";

/**
 * Section 5. A timeline. Video 4 (ingredients assembling) is scrubbed on the
 * left while four steps cross-fade in place on the right, each owning a
 * quarter of the track. A hairline progress bar with four ticks runs across
 * the top. A small still of the spice board unmasks during the grinding step.
 */
export default function Craft() {
  const section = useRef<HTMLElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const inset = useRef<HTMLDivElement>(null);
  const compact = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const on = () => (compact.current = mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const n = CRAFT.steps.length;
  const onProgress = useCallback(
    (p: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      ticks.current.forEach((t, i) => t && (t.dataset.on = p >= i / n + 0.02 ? "1" : "0"));
      if (inset.current) {
        const a = windowInOut(p, 0.28, 0.4, 0.74, 0.86);
        inset.current.style.clipPath = `inset(0 0 ${(1 - a) * 100}% 0)`;
      }
      if (compact.current) return;
      steps.current.forEach((el, i) => {
        if (!el) return;
        const a = i / n;
        const b = (i + 1) / n;
        // each step owns a quarter of the track; fades never overlap, so one step is on screen at a time
        const vis = i === 0 ? 1 - windowInOut(p, b - 0.05, b, 2, 3) : i === n - 1 ? windowInOut(p, a, a + 0.05, 2, 3) : windowInOut(p, a, a + 0.05, b - 0.05, b);
        el.style.opacity = String(vis);
        el.style.transform = `translate3d(0,${(1 - vis) * 18 * (p < (a + b) / 2 ? 1 : -1)}px,0)`;
        el.style.pointerEvents = vis > 0.5 ? "auto" : "none";
        el.setAttribute("aria-current", vis > 0.5 ? "step" : "false");
      });
    },
    [n],
  );

  return (
    <section id="craft" ref={section} className="cf" aria-labelledby="cf-title">
      <div className="cf-stage">
        <div className="wrap cf-top">
          <div className="cf-eyebrow">
            <span className="index">{CRAFT.index}</span>
            <span className="eyebrow">{CRAFT.eyebrow}</span>
          </div>
          <h2 id="cf-title" className="h3 cf-title">
            <SplitText text={CRAFT.title} as="span" by="words" start="top 95%" end="top 60%" />
          </h2>
          <div className="cf-bar" aria-hidden="true">
            <span ref={bar} className="cf-fill" />
            {CRAFT.steps.map((s, i) => (
              <span
                key={s.time}
                ref={(el) => {
                  ticks.current[i] = el;
                }}
                className="cf-tick"
                style={{ left: `${(i / n) * 100}%` }}
                data-on="0"
              >
                <i />
                <b>{s.time}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="wrap cf-body grid-12">
          <div className="cf-film">
            <ScrubVideo src={MEDIA.video(4)} poster={MEDIA.image(4)} alt={IMAGE_ALT[4]} trigger={section} fit="cover" scrub={0.5} onProgress={onProgress} />
          </div>
          <div className="cf-steps-wrap">
            <ol className="cf-steps">
              {CRAFT.steps.map((s, i) => (
                <li
                  key={s.time}
                  ref={(el) => {
                    steps.current[i] = el;
                  }}
                  className="cf-step"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <span className="cf-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body-copy">{s.body}</p>
                  <span className="cf-time">{s.time}</span>
                </li>
              ))}
            </ol>
            <div ref={inset} className="cf-inset" style={{ clipPath: "inset(0 0 100% 0)" }} aria-hidden="true">
              <MaskImage src={MEDIA.image(3)} alt="" ratio="4 / 3" start="top 120%" end="top 119%" />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .cf{position:relative;height:340vh;background:var(--canvas)}
        .cf-stage{position:sticky;top:0;height:100vh;height:100svh;display:grid;grid-template-rows:auto 1fr;overflow:hidden}
        .cf-top{padding-top:clamp(80px,12vh,120px);display:grid;gap:20px}
        .cf-eyebrow{display:flex;gap:18px;align-items:baseline}
        .cf-title{max-width:22ch}
        .cf-bar{position:relative;height:1px;background:var(--line-soft);margin-top:18px;margin-bottom:30px}
        .cf-fill{position:absolute;inset:0;background:var(--ink);transform-origin:left;transform:scaleX(0);will-change:transform}
        .cf-tick{position:absolute;top:0;display:grid;gap:10px;justify-items:start}
        .cf-tick i{display:block;width:7px;height:7px;border-radius:50%;background:var(--canvas);box-shadow:inset 0 0 0 1px var(--faint);transform:translate(-3px,-3px);transition:background .4s,box-shadow .4s}
        .cf-tick b{font-weight:500;font-size:11px;letter-spacing:.16em;color:var(--faint);transition:color .4s}
        .cf-tick[data-on="1"] i{background:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
        .cf-tick[data-on="1"] b{color:var(--ink)}
        .cf-body{align-items:center;padding-bottom:clamp(24px,6vh,64px);min-height:0}
        .cf-film{grid-column:1 / span 7;aspect-ratio:16/10;max-height:calc(100svh - 300px);border-radius:6px;overflow:hidden}
        .cf-steps-wrap{grid-column:8 / span 5;position:relative;display:grid;gap:28px;align-self:center}
        .cf-steps{list-style:none;margin:0;padding:0;position:relative;min-height:330px}
        .cf-step{position:absolute;inset:0;display:grid;gap:14px;align-content:start;will-change:opacity,transform}
        .cf-num{font-family:var(--font-serif);font-style:italic;color:var(--faint);font-size:18px}
        .cf-time{font-size:11px;letter-spacing:.2em;color:var(--mute)}
        .cf-inset{width:min(100%,220px);will-change:clip-path}
        @media (max-width:900px){
          .cf{height:auto}
          .cf-stage{position:relative;height:auto;overflow:visible}
          .cf-top{padding-top:clamp(72px,10vh,96px)}
          .cf-body{display:grid;grid-template-columns:1fr;gap:28px;padding-top:12px}
          .cf-film{grid-column:1 / -1;position:sticky;top:0;max-height:52svh;aspect-ratio:16/11;z-index:1}
          .cf-steps-wrap{grid-column:1 / -1}
          .cf-steps{min-height:0;display:grid;gap:48px}
          .cf-step{position:relative;opacity:1!important;transform:none!important;pointer-events:auto!important}
          .cf-tick b{display:none}
        }
        @media (prefers-reduced-motion:reduce){.cf{height:auto}.cf-stage{position:relative;height:auto}.cf-steps{display:grid;gap:40px;min-height:0}.cf-step{position:relative;opacity:1!important;transform:none!important}.cf-inset{clip-path:none!important}}
      `}</style>
    </section>
  );
}
