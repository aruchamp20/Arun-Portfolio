"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once the element has entered the viewport (fires once by default). */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2 },
  once = true,
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);
  return { ref, inView };
}

/**
 * Scroll progress (0..1) of an element through the viewport.
 * progress = 0 when the element's top reaches the viewport bottom,
 * 1 when its bottom leaves the viewport top. Cheap: one rAF per scroll frame.
 */
export function useScrollProgress<T extends HTMLElement>(mode: "through" | "pinned" = "through") {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    let p: number;
    if (mode === "pinned") {
      // element is taller than the viewport and contains a sticky child:
      // progress is how far its top has travelled above the viewport top.
      const travel = rect.height - vh;
      p = travel > 0 ? -rect.top / travel : 0;
    } else {
      p = (vh - rect.top) / (vh + rect.height);
    }
    setProgress(Math.min(1, Math.max(0, p)));
  }, [mode]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  return { ref, progress };
}

/** Adds .is-in to every .rv / .rv-mask element the first time it enters the viewport. */
export function useRevealObserver(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root.current ?? document.body;
    const reduce = prefersReducedMotion();
    const targets = scope.querySelectorAll<HTMLElement>(".rv, .rv-mask");
    if (reduce) {
      targets.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}

/** Tracks which section id is active, using rootMargin -45% / -50%. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Whether the page has scrolled past `offset` px. */
export function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [offset]);
  return scrolled;
}
