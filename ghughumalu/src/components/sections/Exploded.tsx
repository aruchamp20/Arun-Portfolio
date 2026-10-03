"use client";

import { useCallback, useRef } from "react";
import { EXPLODED, IMAGE_ALT, MEDIA } from "@/lib/content";
import { windowInOut } from "@/lib/env";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";

/**
 * Section 3. Apple-style exploded view. Video 2 is scrubbed inside a sticky
 * frame; each label has its own scroll window, a dot on the ingredient, a
 * connector that draws out and a caption that settles. On narrow screens the
 * labels become an index strip under the film, lit by the same progress.
 */
export default function Exploded() {
  const section = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const chips = useRef<(HTMLLIElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback((p: number) => {
    EXPLODED.labels.forEach((l, i) => {
      const a = windowInOut(p, l.from, l.from + 0.1, l.to - 0.1, l.to);
      const el = labels.current[i];
      if (el) {
        el.style.opacity = String(a);
        const line = el.querySelector<HTMLElement>(".xl-line");
        const text = el.querySelector<HTMLElement>(".xl-text");
        if (line) line.style.transform = `scaleX(${a})`;
        if (text) text.style.transform = `translate3d(${(1 - a) * (l.side === "left" ? -10 : 10)}px,0,0)`;
      }
      const chip = chips.current[i];
      if (chip) chip.dataset.on = a > 0.5 ? "1" : "0";
    });
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  }, []);

  return (
    <section id="anatomy" ref={section} className="xp" aria-labelledby="xp-title">
      <div className="xp-stage">
        <header className="xp-head wrap">
          <div className="xp-eyebrow">
            <span className="index">{EXPLODED.index}</span>
            <span className="eyebrow">{EXPLODED.eyebrow}</span>
          </div>
          <h2 id="xp-title" className="h3 xp-title">
            <SplitText text={EXPLODED.title} as="span" by="words" start="top 95%" end="top 60%" />
          </h2>
        </header>

        <div className="xp-frame">
          <ScrubVideo src={MEDIA.video(2)} poster={MEDIA.image(2)} alt={IMAGE_ALT[2]} trigger={section} fit="contain" scrub={0.45} onProgress={onProgress} />
          <ul className="xp-labels" aria-hidden="true">
            {EXPLODED.labels.map((l, i) => (
              <li key={l.text}>
                <div
                  ref={(el) => {
                    labels.current[i] = el;
                  }}
                  className={`xl xl-${l.side}`}
                  style={{ left: `${l.x}%`, top: `${l.y}%`, opacity: 0 }}
                >
                  <span className="xl-dot" />
                  <span className="xl-line" />
                  <span className="xl-text">
                    <strong>{l.text}</strong>
                    <span>{l.note}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="xp-foot wrap">
          <ol className="xp-chips">
            {EXPLODED.labels.map((l, i) => (
              <li
                key={l.text}
                ref={(el) => {
                  chips.current[i] = el;
                }}
                data-on="0"
              >
                <strong>{l.text}</strong>
                <span>{l.note}</span>
              </li>
            ))}
          </ol>
          <div className="xp-bar" aria-hidden="true">
            <span ref={bar} />
          </div>
        </div>
      </div>
      <style>{`
        .xp{position:relative;height:320vh;background:var(--canvas)}
        .xp-stage{position:sticky;top:0;height:100vh;height:100svh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden}
        .xp-head{padding-top:clamp(80px,12vh,120px);padding-bottom:18px;display:grid;gap:14px}
        .xp-eyebrow{display:flex;gap:18px;align-items:baseline}
        .xp-title{max-width:26ch}
        .xp-frame{position:relative;height:100%;max-width:min(100% - var(--gutter) * 2,1500px);aspect-ratio:16/9;margin:auto;min-height:0;justify-self:center}
        .xp-labels{list-style:none;margin:0;padding:0;position:absolute;inset:0}
        .xl{position:absolute;display:flex;align-items:center;gap:0;will-change:opacity;transform:translate(-50%,-50%)}
        .xl-right{flex-direction:row}
        .xl-left{flex-direction:row-reverse;transform:translate(-50%,-50%)}
        .xl-dot{width:8px;height:8px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px rgba(250,250,248,.9);flex:none}
        .xl-line{width:clamp(48px,8vw,120px);height:1px;background:var(--ink);transform-origin:left center;transform:scaleX(0);will-change:transform}
        .xl-left .xl-line{transform-origin:right center}
        .xl-text{display:grid;gap:2px;padding:0 14px;font-size:13px;line-height:1.3;white-space:nowrap;will-change:transform}
        .xl-left .xl-text{text-align:right}
        .xl-text strong{font-weight:500;color:var(--ink)}
        .xl-text span{color:var(--mute);font-size:12px}
        .xp-foot{padding-bottom:clamp(24px,5vh,48px);display:grid;gap:14px}
        .xp-chips{list-style:none;margin:0;padding:0;display:none;gap:18px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .xp-chips::-webkit-scrollbar{display:none}
        .xp-chips li{flex:none;display:grid;gap:2px;font-size:13px;color:var(--faint);transition:color .4s}
        .xp-chips li strong{font-weight:500}
        .xp-chips li span{font-size:12px}
        .xp-chips li[data-on="1"]{color:var(--ink)}
        .xp-chips li[data-on="1"] span{color:var(--mute)}
        .xp-bar{height:1px;background:var(--line-soft)}
        .xp-bar span{display:block;height:100%;background:var(--ink);transform-origin:left;transform:scaleX(0);will-change:transform}
        @media (max-width:900px){
          .xp{height:260vh}
          .xp-head{padding-top:clamp(72px,10vh,96px)}
          .xp-labels{display:none}
          .xp-chips{display:flex}
          .xp-frame{width:100%;height:auto;max-width:100%}
        }
        @media (prefers-reduced-motion:reduce){.xp{height:auto}.xp-stage{position:relative;height:auto;gap:24px;padding-bottom:40px}.xl{opacity:1!important}.xl-line{transform:none!important}.xp-chips li{color:var(--ink)}}
      `}</style>
    </section>
  );
}
