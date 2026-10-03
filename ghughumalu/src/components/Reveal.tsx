"use client";

import { createElement, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "./Experience";

/**
 * Scroll-scrubbed stagger for a list of children marked data-rv. Used by
 * server-rendered lists (the menu) so the markup stays on the server and only
 * this tiny wrapper ships to the client.
 */
export default function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ul" | "section" }) {
  const { reduce } = useExperience();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-rv]");
      gsap.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 88%", end: "top 40%", scrub: 0.7 } });
    }, el);
    return () => ctx.revert();
  }, [reduce]);
  return createElement(Tag, { ref, className }, children);
}
