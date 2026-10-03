"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Mounts Lenis smooth scrolling (disabled when the visitor prefers reduced motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4 });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}

/** Smoothly scrolls to an element id (through Lenis when active). */
export function scrollToTarget(id: string, offset = 0) {
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else if (typeof el === "number") window.scrollTo({ top: 0, behavior: "smooth" });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
