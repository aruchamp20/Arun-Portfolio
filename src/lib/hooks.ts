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

/**
 * Mouse-driven 3D tilt for every element matching `selector`. Uses the `rotate`/`translate` properties,
 * which stack on top of each element's own `transform` animations instead of replacing them.
 * The parent gets a perspective so the tilt reads as depth. Off for touch and reduced motion.
 */
export function useTilt(selector: string, maxDeg = 7) {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const live = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number; k: number }>();
    const prepped = new WeakSet<HTMLElement>();
    let current: HTMLElement | null = null;
    let raf = 0;

    const tick = () => {
      raf = 0;
      live.forEach((s, el) => {
        s.x += (s.tx - s.x) * 0.16;
        s.y += (s.ty - s.y) * 0.16;
        if (el !== current && Math.abs(s.x) < 0.005 && Math.abs(s.y) < 0.005) {
          el.style.rotate = el.style.translate = "";
          live.delete(el);
          return;
        }
        const amt = Math.hypot(s.x, s.y);
        el.style.rotate = amt ? `${-s.y} ${s.x} 0 ${amt * maxDeg * s.k}deg` : "";
        el.style.translate = `0 0 ${Math.min(1, amt * 2) * 14}px`;
      });
      if (live.size) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const release = () => {
      if (current) {
        const s = live.get(current);
        if (s) s.tx = s.ty = 0;
      }
      current = null;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(selector) ?? null;
      if (el !== current) release();
      if (!el) return;
      current = el;
      if (!prepped.has(el)) {
        prepped.add(el);
        let parent = el.parentElement; // skip display:contents wrappers, they have no box to hold a perspective
        while (parent && getComputedStyle(parent).display === "contents") parent = parent.parentElement;
        if (parent && getComputedStyle(parent).perspective === "none") parent.style.perspective = "1000px";
      }
      const r = el.getBoundingClientRect();
      const s = live.get(el) ?? { x: 0, y: 0, tx: 0, ty: 0, k: 1 };
      s.k = Math.min(1, 360 / Math.max(r.width, r.height)); // big panels tilt less so their edges don't swing far
      s.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      s.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      live.set(el, s);
      kick();
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      cancelAnimationFrame(raf);
      live.forEach((_, el) => (el.style.rotate = el.style.translate = ""));
    };
  }, [selector, maxDeg]);
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
