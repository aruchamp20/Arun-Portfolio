"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { gsap } from "@/lib/gsap";
import { HERO, IMAGE_ALT, MEDIA } from "@/lib/content";
import { isFinePointer } from "@/lib/env";
import { usePointer } from "@/lib/pointer";
import { useExperience } from "../Experience";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";
import Magnetic from "../Magnetic";

const Particles = dynamic(() => import("../three/Particles"), { ssr: false });

/**
 * Section 1. A sticky viewport over a 340vh track. Video 1 (the thali
 * separating) is scrubbed across the whole track. The copy rises at a third
 * of the scroll speed and fades before the video ends, so the last frames
 * belong to the food alone. The pointer nudges copy and film in opposite
 * directions for a little depth.
 */
export default function Hero() {
  const { ready, reduce, scrollTo } = useExperience();
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = usePointer();
  const [webgl, setWebgl] = useState(false);
  const { ref: inViewRef, inView } = useInView({ rootMargin: "20% 0px" });

  useEffect(() => {
    setWebgl(!reduce && isFinePointer());
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const s = section.current!;
    const ctx = gsap.context(() => {
      gsap.to(copy.current, { yPercent: -36, ease: "none", scrollTrigger: { trigger: s, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      gsap.to(copy.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: s, start: "45% bottom", end: "70% bottom", scrub: 0.6 } });
      gsap.fromTo(film.current, { scale: 1 }, { scale: 1.07, ease: "none", scrollTrigger: { trigger: s, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      gsap.to(hint.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: s, start: "top top", end: "12% top", scrub: true } });
    }, s);

    // pointer depth: copy and film drift in opposite directions
    let cleanup = () => {};
    if (isFinePointer()) {
      const cx = gsap.quickTo(copy.current, "x", { duration: 1.2, ease: "power2.out" });
      const cy = gsap.quickTo(copy.current, "y", { duration: 1.2, ease: "power2.out" });
      const fx = gsap.quickTo(film.current, "x", { duration: 1.6, ease: "power2.out" });
      const fy = gsap.quickTo(film.current, "y", { duration: 1.6, ease: "power2.out" });
      const move = (e: PointerEvent) => {
        const nx = (e.clientX / innerWidth) * 2 - 1;
        const ny = (e.clientY / innerHeight) * 2 - 1;
        cx(nx * 10);
        cy(ny * 8);
        fx(-nx * 6);
        fy(-ny * 5);
      };
      window.addEventListener("pointermove", move, { passive: true });
      cleanup = () => window.removeEventListener("pointermove", move);
    }
    return () => {
      ctx.revert();
      cleanup();
    };
  }, [reduce]);

  useEffect(() => {
    if (!ready || reduce) return;
    const s = section.current!;
    const items = s.querySelectorAll<HTMLElement>(".hero-in");
    gsap.fromTo(items, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.12, ease: "expo.out", delay: 0.9 });
  }, [ready, reduce]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <section
      id="top"
      ref={(el) => {
        section.current = el;
        inViewRef(el);
      }}
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero-stage">
        <div ref={film} className="hero-film">
          <ScrubVideo src={MEDIA.video(1)} poster={MEDIA.image(1)} alt={IMAGE_ALT[1]} trigger={section} priority scrub={0.7} onProgress={(p) => (progress.current = p)} />
        </div>
        {webgl && <Particles preset="hero" active={inView && ready} progress={progress} pointer={pointer} />}

        <div ref={copy} className="hero-copy wrap">
          <p className="eyebrow hero-in">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="display hero-title">
            <SplitText text={HERO.title} as="span" by="chars" mode="enter" play={ready} delay={0.5} />
          </h1>
          <p className="lede hero-lede hero-in">{HERO.lede}</p>
          <div className="hero-cta hero-in">
            <Magnetic>
              <a href={HERO.primary.href} className="btn btn-ink" onClick={(e) => go(e, HERO.primary.href)}>
                <span>{HERO.primary.label}</span>
                <span className="ic" aria-hidden="true">
                  <Arrow />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={HERO.secondary.href} className="btn btn-line" onClick={(e) => go(e, HERO.secondary.href)}>
                <span>{HERO.secondary.label}</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div ref={hint} className="hero-hint hero-in" aria-hidden="true">
          <span className="hero-hint-line" />
          <span>{HERO.scrollHint}</span>
        </div>
      </div>
      <style>{`
        .hero{position:relative;height:340vh}
        .hero-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
        .hero-film{position:absolute;inset:0;will-change:transform;transform-origin:center}
        .hero-copy{position:absolute;left:0;right:0;bottom:clamp(56px,10vh,120px);z-index:2;display:grid;gap:clamp(18px,2.4vh,28px);max-width:min(100%,1680px);will-change:transform,opacity}
        .hero-copy .hero-in{opacity:0}
        .hero-title{max-width:11ch;font-variation-settings:"opsz" 144,"SOFT" 30}
        .hero-lede{max-width:40ch}
        .hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
        .hero-hint{position:absolute;right:var(--gutter);bottom:clamp(28px,5vh,56px);z-index:2;display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
        .hero-hint-line{width:48px;height:1px;background:var(--line);position:relative;overflow:hidden}
        .hero-hint-line::after{content:"";position:absolute;inset:0;background:var(--ink);transform-origin:left;animation:hint 2.4s var(--ease-in-out) infinite}
        @keyframes hint{0%{transform:scaleX(0);transform-origin:left}45%{transform:scaleX(1);transform-origin:left}55%{transform:scaleX(1);transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}
        @media (max-width:900px){
          .hero{height:240vh}
          .hero-copy{bottom:clamp(72px,12vh,120px)}
          .hero-hint{left:var(--gutter);right:auto}
          .hero-title{font-size:clamp(46px,13vw,90px)}
        }
        @media (prefers-reduced-motion:reduce){.hero{height:auto}.hero-stage{position:relative}.hero-copy .hero-in{opacity:1}.hero-hint-line::after{animation:none;transform:none}}
      `}</style>
    </section>
  );
}

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
