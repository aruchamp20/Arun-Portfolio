"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { gsap } from "@/lib/gsap";
import { IMAGE_ALT, INGREDIENTS, MEDIA } from "@/lib/content";
import { isFinePointer } from "@/lib/env";
import { usePointer } from "@/lib/pointer";
import { useExperience } from "../Experience";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";

const Particles = dynamic(() => import("../three/Particles"), { ssr: false });

/**
 * Section 4. The pantry as a constellation. Video 3 (spices lifting into a
 * cloud) scrubs as the section's background. Over it, a WebGL field of dust
 * and herbs with depth and pointer parallax, then eight ingredient nodes
 * joined by a hairline that draws itself with scroll. Hover or focus a node
 * and it turns gently toward you while an editorial card appears.
 */
export default function Ingredients() {
  const { reduce } = useExperience();
  const section = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const progress = useRef(0);
  const pointer = usePointer();
  const [active, setActive] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(false);
  const [fine, setFine] = useState(false);
  const { ref: inViewRef, inView } = useInView({ rootMargin: "10% 0px" });

  useEffect(() => {
    setWebgl(!reduce && isFinePointer());
    setFine(isFinePointer());
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const p = path.current;
    const s = section.current;
    if (!p || !s) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    const ctx = gsap.context(() => {
      gsap.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: s, start: "top 60%", end: "bottom 80%", scrub: 0.8 } });
      gsap.from(".ing-node", { scale: 0, opacity: 0, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: s, start: "top 55%", end: "top 10%", scrub: 0.8 } });
    }, s);
    return () => ctx.revert();
  }, [reduce]);

  const items = INGREDIENTS.items;
  const d = items.map((it, i) => `${i === 0 ? "M" : "L"} ${it.x} ${it.y}`).join(" ");
  const current = items.find((i) => i.id === active) ?? null;

  return (
    <section
      id="pantry"
      ref={(el) => {
        section.current = el;
        inViewRef(el);
      }}
      className="ing"
      aria-labelledby="ing-title"
    >
      <div className="ing-bg" aria-hidden="true">
        <ScrubVideo src={MEDIA.video(3)} poster={MEDIA.image(3)} alt={IMAGE_ALT[3]} trigger={section} start="top bottom" end="bottom top" scrub={0.8} onProgress={(p) => (progress.current = p)} />
        <div className="ing-veil" />
      </div>
      {webgl && <Particles preset="pantry" active={inView} progress={progress} pointer={pointer} />}

      <div className="wrap ing-inner">
        <header className="ing-head grid-12">
          <div className="ing-head-l">
            <span className="index">{INGREDIENTS.index}</span>
            <span className="eyebrow">{INGREDIENTS.eyebrow}</span>
          </div>
          <h2 id="ing-title" className="h2 ing-title">
            <SplitText text={INGREDIENTS.title} as="span" by="words" />
          </h2>
          <p className="lede ing-lede">{INGREDIENTS.lede}</p>
        </header>

        <div className="ing-map">
          <svg className="ing-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path ref={path} d={d} vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className="ing-nodes" role="list">
            {items.map((it, i) => (
              <li key={it.id} style={{ left: `${it.x}%`, top: `${it.y}%` }}>
                <motion.button
                  type="button"
                  className="ing-node"
                  data-cursor="Taste"
                  aria-pressed={active === it.id}
                  aria-describedby={active === it.id ? "ing-card" : undefined}
                  onMouseEnter={() => setActive(it.id)}
                  onFocus={() => setActive(it.id)}
                  onClick={() => setActive((a) => (a === it.id ? null : it.id))}
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.6 }}
                  style={{ width: 44 * it.size, height: 44 * it.size }}
                >
                  <span className="ing-dot" style={{ background: it.hue }} aria-hidden="true" />
                  <span className="ing-ring" aria-hidden="true" />
                  <span className="ing-name">
                    <span className="ing-n">{String(i + 1).padStart(2, "0")}</span>
                    {it.name}
                  </span>
                </motion.button>
              </li>
            ))}
          </ul>

          <div className="ing-card-slot">
            <AnimatePresence mode="wait">
              {current && (
                <motion.article
                  key={current.id}
                  id="ing-card"
                  className="ing-card"
                  initial={{ opacity: 0, y: 14, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="eyebrow">{current.origin}</span>
                  <h3 className="h3">{current.name}</h3>
                  <p className="body-copy">{current.note}</p>
                  <span className="ing-swatch" style={{ background: current.hue }} aria-hidden="true" />
                </motion.article>
              )}
            </AnimatePresence>
            {!current && <p className="ing-empty">{fine ? "Hover a point." : "Tap a point."}</p>}
          </div>
        </div>
      </div>
      <style>{`
        .ing{position:relative;padding-block:var(--section-y);min-height:100vh;overflow:hidden;background:var(--canvas)}
        .ing-bg{position:absolute;inset:0}
        .ing-veil{position:absolute;inset:0;background:rgba(250,250,248,.45)}
        .ing-inner{position:relative;z-index:2;display:grid;gap:clamp(48px,7vh,96px)}
        .ing-head{row-gap:20px;align-items:end}
        .ing-head-l{grid-column:1 / span 12;display:flex;gap:18px;align-items:baseline}
        .ing-title{grid-column:1 / span 8;max-width:16ch}
        .ing-lede{grid-column:9 / span 4;max-width:36ch;padding-bottom:6px}
        .ing-map{position:relative;display:grid;grid-template-columns:1fr minmax(260px,340px);gap:clamp(24px,4vw,64px);align-items:end}
        .ing-lines{position:absolute;inset:0;width:calc(100% - 340px - clamp(24px,4vw,64px));height:100%;overflow:visible}
        .ing-lines path{fill:none;stroke:var(--ink);stroke-opacity:.35;stroke-width:1}
        .ing-nodes{list-style:none;margin:0;padding:0;position:relative;aspect-ratio:16/9;min-height:360px}
        .ing-nodes li{position:absolute;transform:translate(-50%,-50%)}
        .ing-node{position:relative;display:grid;place-items:center;border-radius:50%;will-change:transform}
        .ing-dot{width:38%;height:38%;border-radius:50%;box-shadow:0 8px 18px -8px rgba(43,35,32,.45)}
        .ing-ring{position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .5s var(--ease-out),transform .6s var(--ease-out)}
        .ing-node:hover .ing-ring,.ing-node:focus-visible .ing-ring,.ing-node[aria-pressed="true"] .ing-ring{box-shadow:inset 0 0 0 1px var(--ink);transform:scale(1.25)}
        .ing-name{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);white-space:nowrap;font-size:12px;letter-spacing:.02em;color:var(--ink-2);display:flex;gap:6px;align-items:baseline}
        .ing-n{font-family:var(--font-serif);font-style:italic;color:var(--faint);font-size:11px}
        .ing-card-slot{position:relative;min-height:220px}
        .ing-card{position:relative;background:#fff;border-radius:6px;padding:28px 28px 32px;display:grid;gap:12px;box-shadow:var(--shadow-card)}
        .ing-swatch{position:absolute;top:28px;right:28px;width:12px;height:12px;border-radius:50%}
        .ing-empty{font-size:13px;color:var(--faint);font-style:italic;font-family:var(--font-serif);font-size:18px}
        @media (max-width:900px){
          .ing-title{grid-column:1 / -1}
          .ing-lede{grid-column:1 / -1}
          .ing-map{grid-template-columns:1fr}
          .ing-lines{width:100%;height:auto;aspect-ratio:16/9}
          .ing-nodes{aspect-ratio:4/5;min-height:0}
          .ing-lines{aspect-ratio:4/5}
          .ing-name{display:none}
          .ing-node[aria-pressed="true"] .ing-name{display:flex}
        }
      `}</style>
    </section>
  );
}
