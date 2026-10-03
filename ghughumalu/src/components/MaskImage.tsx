"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { asset } from "@/lib/paths";
import { useExperience } from "./Experience";

type Props = {
  src: string;
  alt: string;
  /** which edge the mask opens from */
  from?: "bottom" | "top" | "left" | "right";
  ratio?: string; // CSS aspect-ratio
  className?: string;
  /** scroll progress range of the reveal: start/end ScrollTrigger strings */
  start?: string;
  end?: string;
  /** parallax travel in px, applied to the inner image with scrub */
  parallax?: number;
  sizes?: string;
  priority?: boolean;
  cursor?: string;
};

const INSET = {
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/** An image that is revealed through a clip mask as the page scrolls, with a soft inner scale and optional parallax. */
export default function MaskImage({
  src,
  alt,
  from = "bottom",
  ratio = "16 / 10",
  className = "",
  start = "top 88%",
  end = "top 42%",
  parallax = 0,
  sizes = "(max-width: 900px) 100vw, 50vw",
  priority,
  cursor,
}: Props) {
  const { reduce } = useExperience();
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const f = frame.current;
    const i = inner.current;
    if (!f || !i) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(f, { clipPath: INSET[from] }, { clipPath: "inset(0 0 0 0)", ease: "none", scrollTrigger: { trigger: f, start, end, scrub: 0.6 } });
      gsap.fromTo(i, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: f, start, end, scrub: 0.6 } });
      if (parallax) {
        gsap.fromTo(i, { y: -parallax }, { y: parallax, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce, from, start, end, parallax]);

  return (
    <div ref={frame} className={`frame mi ${className}`} style={{ aspectRatio: ratio, willChange: "clip-path" }} data-cursor={cursor}>
      <div ref={inner} className="mi-inner" style={{ willChange: "transform" }}>
        {!missing && (
          <Image src={asset(src)} alt={alt} fill sizes={sizes} priority={priority} unoptimized onError={() => setMissing(true)} style={{ objectFit: "cover" }} />
        )}
        {missing && <div className="ph">{alt}</div>}
      </div>
      <style>{`
        .mi{width:100%}
        .mi-inner{position:absolute;inset:0;transform-origin:center}
      `}</style>
    </div>
  );
}
