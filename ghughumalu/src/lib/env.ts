"use client";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isCompact(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 900px)").matches;
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** 0 outside [a, b], eased 0→1 inside. */
export function window01(p: number, a: number, b: number): number {
  const t = clamp((p - a) / Math.max(1e-6, b - a));
  return t * t * (3 - 2 * t);
}

/** Fade in over [a, b] and out over [c, d]. */
export function windowInOut(p: number, a: number, b: number, c: number, d: number): number {
  return window01(p, a, b) * (1 - window01(p, c, d));
}
