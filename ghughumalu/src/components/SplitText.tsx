"use client";

import SplitType from "split-type";
import { createElement, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useExperience } from "./Experience";

type Props = {
  text: string | string[];
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** what moves: words (default) rise inside masked lines; chars animate independently */
  by?: "words" | "chars" | "lines";
  /** scroll: scrubbed to viewport position; enter: plays once when `play` becomes true */
  mode?: "scroll" | "enter";
  play?: boolean;
  start?: string;
  end?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Editorial text reveal driven by SplitType. Lines are masked; words or
 * letters rise into place. Scroll mode is scrubbed, so a reader who stops
 * mid-sentence sees the sentence half written. Screen readers get the plain
 * string; the split markup is aria-hidden. Re-splits on resize.
 */
export default function SplitText({
  text,
  as = "p",
  className = "",
  by = "words",
  mode = "scroll",
  play = false,
  start = "top 85%",
  end = "top 50%",
  delay = 0,
  stagger,
}: Props) {
  const { reduce } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const plain = Array.isArray(text) ? text.join(" ") : text;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;
    let playedOnce = false;

    const build = () => {
      ctx?.revert();
      split?.revert();
      split = new SplitType(el, { types: by === "chars" ? "lines,words,chars" : "lines,words", tagName: "span" });
      const targets = by === "chars" ? split.chars : by === "lines" ? split.lines : split.words;
      if (!targets?.length) return;
      ctx = gsap.context(() => {
        const from = { yPercent: by === "lines" ? 100 : 110, opacity: by === "chars" ? 0 : 1, rotate: by === "chars" ? 4 : 0 };
        const to = { yPercent: 0, opacity: 1, rotate: 0, ease: "expo.out", stagger: stagger ?? (by === "chars" ? 0.025 : by === "lines" ? 0.12 : 0.03) };
        if (mode === "scroll") {
          gsap.fromTo(targets, from, { ...to, ease: "power3.out", duration: 1, scrollTrigger: { trigger: el, start, end, scrub: 0.8 } });
        } else {
          gsap.set(targets, from);
          if (play || playedOnce) {
            playedOnce = true;
            gsap.to(targets, { ...to, duration: 1.4, delay });
          }
        }
      });
    };
    build();

    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 150);
    });
    ro.observe(document.documentElement);
    return () => {
      ro.disconnect();
      clearTimeout(t);
      ctx?.revert();
      split?.revert();
    };
  }, [reduce, by, mode, play, start, end, delay, stagger, plain]);

  return (
    <>
      <span className="sr-only">{plain}</span>
      {createElement(
        as,
        { ref, className: `split ${className}`, "aria-hidden": true, style: { willChange: reduce ? undefined : "transform" } },
        Array.isArray(text)
          ? text.map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))
          : text,
      )}
    </>
  );
}
