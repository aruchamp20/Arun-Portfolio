"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { IMAGE_ALT, MEDIA, SAUCES } from "@/lib/content";
import { isFinePointer } from "@/lib/env";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";

/**
 * Section 6. Video 5 (chutney ribbons) scrubs full-bleed behind three cards
 * that drift at different speeds as the pour advances. Each card tilts a few
 * degrees toward the pointer and lifts on hover. On touch the cards become a
 * snap strip along the bottom of the film.
 */
export default function Sauces() {
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  const onProgress = useCallback((p: number) => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    SAUCES.cards.forEach((c, i) => {
      const el = cards.current[i];
      if (el) el.style.transform = `translate3d(0,${(0.5 - p) * c.speed * 220}px,0)`;
    });
  }, []);

  return (
    <section id="sauces" ref={section} className="sc" aria-labelledby="sc-title">
      <div className="sc-stage">
        <div className="sc-film">
          <ScrubVideo src={MEDIA.video(5)} poster={MEDIA.image(1)} alt={IMAGE_ALT[1]} trigger={section} scrub={0.6} onProgress={onProgress} />
        </div>
        <header className="wrap sc-head">
          <div className="sc-eyebrow">
            <span className="index">{SAUCES.index}</span>
            <span className="eyebrow">{SAUCES.eyebrow}</span>
          </div>
          <h2 id="sc-title" className="h2 sc-title">
            <SplitText text={SAUCES.title} as="span" by="words" start="top 95%" end="top 60%" />
          </h2>
        </header>
        <ul className="sc-cards wrap" role="list">
          {SAUCES.cards.map((c, i) => (
            <li
              key={c.name}
              className="sc-slot"
              ref={(el) => {
                cards.current[i] = el as HTMLDivElement | null;
              }}
            >
              <TiltCard index={i} {...c} />
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        .sc{position:relative;height:280vh;background:var(--canvas)}
        .sc-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
        .sc-film{position:absolute;inset:0}
        .sc-head{position:absolute;top:clamp(80px,12vh,120px);left:0;right:0;display:grid;gap:14px;z-index:2}
        .sc-eyebrow{display:flex;gap:18px;align-items:baseline}
        .sc-title{max-width:14ch}
        .sc-cards{list-style:none;margin:0;padding:0;position:absolute;inset:0;z-index:2;pointer-events:none}
        .sc-slot{position:absolute;width:min(320px,34vw);will-change:transform;pointer-events:auto}
        .sc-slot:nth-child(1){left:var(--gutter);top:46%}
        .sc-slot:nth-child(2){left:50%;top:30%;transform:translateX(-50%)}
        .sc-slot:nth-child(3){right:var(--gutter);top:52%}
        .sc-card{position:relative;background:#fff;border-radius:6px;padding:26px 26px 28px;display:grid;gap:12px;box-shadow:var(--shadow-card);transform-style:preserve-3d;will-change:transform}
        .sc-card-top{display:flex;justify-content:space-between;align-items:center}
        .sc-dot{width:12px;height:12px;border-radius:50%}
        .sc-num{font-family:var(--font-serif);font-style:italic;color:var(--faint);font-size:16px}
        .sc-name{font-size:clamp(26px,2.4vw,34px)}
        .sc-pair{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);padding-top:6px;border-top:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center}
        .sc-pair svg{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
        .sc-card:hover .sc-pair svg{transform:translateX(4px)}
        @media (max-width:900px){
          .sc{height:220vh}
          .sc-cards{top:auto;bottom:clamp(24px,5vh,40px);display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px;scrollbar-width:none;left:0;right:0;height:auto}
          .sc-cards::-webkit-scrollbar{display:none}
          .sc-slot{position:static;width:min(300px,78vw);flex:none;scroll-snap-align:start;transform:none!important}
          .sc-head{top:clamp(72px,10vh,96px)}
          .sc-title{max-width:10ch}
        }
        @media (prefers-reduced-motion:reduce){.sc{height:auto}.sc-stage{position:relative;height:auto;display:grid;gap:24px;padding-bottom:40px}.sc-film{position:relative;aspect-ratio:16/9}.sc-head{position:relative;top:auto}.sc-cards{position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.sc-slot{position:static;width:auto;transform:none!important}}
      `}</style>
    </section>
  );
}

function TiltCard({ index, name, body, pair, colour }: { index: number; name: string; body: string; pair: string; colour: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 16, mass: 0.5 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!isFinePointer()) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      className="sc-card"
      style={{ rotateX, rotateY, perspective: 900 }}
      onPointerMove={move}
      onPointerLeave={leave}
      whileHover={{ y: -8, boxShadow: "0 32px 70px -28px rgba(43,35,32,.4), 0 1px 2px rgba(43,35,32,.05)" }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      data-cursor="Taste"
    >
      <div className="sc-card-top">
        <span className="sc-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="sc-dot" style={{ background: colour }} aria-hidden="true" />
      </div>
      <h3 className="sc-name">{name}</h3>
      <p className="body-copy">{body}</p>
      <span className="sc-pair">
        {pair}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.article>
  );
}
