"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DINING, IMAGE_ALT, MEDIA } from "@/lib/content";
import { useExperience } from "../Experience";
import ScrubVideo from "../ScrubVideo";
import SplitText from "../SplitText";
import MaskImage from "../MaskImage";

/**
 * Section 7. The ending. Video 6 (the table descending into place) is
 * scrubbed behind two enormous lines of type that arrive one after the
 * other. Below, three stills overlap on a 12-column grid, each travelling at
 * its own speed and easing from a soft scale, against a slow background word.
 */
export default function Dining() {
  const { reduce } = useExperience();
  const section = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const g = gallery.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(".dn-word", { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".dn-item").forEach((el) => {
        const speed = Number(el.dataset.speed || 1);
        gsap.fromTo(el, { y: 80 * speed }, { y: -80 * speed, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, g);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="room" ref={section} className="dn" aria-labelledby="dn-title">
      <div className="dn-track">
        <div className="dn-stage">
          <div className="dn-film">
            <ScrubVideo src={MEDIA.video(6)} poster={MEDIA.image(4)} alt={IMAGE_ALT[4]} trigger={section} start="top top" end="bottom bottom" scrub={0.7} />
          </div>
          <div className="wrap dn-copy">
            <div className="dn-eyebrow">
              <span className="index">{DINING.index}</span>
              <span className="eyebrow">{DINING.eyebrow}</span>
            </div>
            <h2 id="dn-title" className="display dn-title">
              <SplitText text={DINING.lines} as="span" by="chars" start="top 70%" end="top 10%" stagger={0.02} />
            </h2>
            <p className="lede dn-body">
              <SplitText text={DINING.body} as="span" by="lines" start="top 90%" end="top 55%" />
            </p>
          </div>
        </div>
      </div>

      <div ref={gallery} className="dn-gallery wrap">
        <span className="dn-word" aria-hidden="true">
          Ghughumalu
        </span>
        <div className="grid-12 dn-grid">
          {DINING.gallery.map((g, i) => (
            <figure key={g.image} className={`dn-item dn-item-${i + 1}`} data-speed={[0.6, 1.2, 0.9][i]}>
              <MaskImage src={MEDIA.image(g.image)} alt={IMAGE_ALT[g.image]} from={i === 1 ? "top" : "bottom"} ratio={i === 1 ? "4 / 5" : "16 / 11"} cursor="View" sizes="(max-width: 900px) 90vw, 40vw" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <style>{`
        .dn{position:relative;background:var(--canvas)}
        .dn-track{height:260vh;position:relative}
        .dn-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
        .dn-film{position:absolute;inset:0}
        .dn-film::after{content:"";position:absolute;inset:0;background:linear-gradient(to top, rgba(250,250,248,.75), rgba(250,250,248,0) 55%)}
        .dn-copy{position:absolute;left:0;right:0;bottom:clamp(56px,10vh,120px);display:grid;gap:22px;z-index:2}
        .dn-eyebrow{display:flex;gap:18px;align-items:baseline}
        .dn-title{font-size:clamp(56px,10vw,180px)}
        .dn-body{max-width:44ch}
        .dn-gallery{position:relative;padding-block:var(--section-y) calc(var(--section-y) * .6);overflow:clip}
        .dn-word{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:var(--font-serif);font-size:clamp(120px,24vw,420px);letter-spacing:-.04em;color:transparent;-webkit-text-stroke:1px var(--line);white-space:nowrap;pointer-events:none;will-change:transform;font-variation-settings:"opsz" 144,"SOFT" 60}
        .dn-grid{position:relative;row-gap:clamp(40px,8vh,120px)}
        .dn-item{margin:0;will-change:transform}
        .dn-item figcaption{margin-top:12px;font-size:13px;color:var(--mute)}
        .dn-item-1{grid-column:1 / span 6;margin-top:0}
        .dn-item-2{grid-column:8 / span 4;margin-top:clamp(80px,16vh,220px)}
        .dn-item-3{grid-column:4 / span 6;margin-top:calc(-1 * clamp(20px,6vh,80px))}
        @media (max-width:900px){
          .dn-track{height:200vh}
          .dn-title{font-size:clamp(52px,14vw,120px)}
          .dn-item-1{grid-column:1 / span 10}
          .dn-item-2{grid-column:5 / span 8;margin-top:0}
          .dn-item-3{grid-column:1 / span 9;margin-top:0}
        }
        @media (prefers-reduced-motion:reduce){.dn-track{height:auto}.dn-stage{position:relative;height:auto;display:grid;gap:20px}.dn-film{position:relative;aspect-ratio:16/9}.dn-copy{position:relative;bottom:auto;padding-block:40px}}
      `}</style>
    </section>
  );
}
