"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isFinePointer, prefersReducedMotion } from "@/lib/env";
import Loader from "./Loader";
import Cursor from "./Cursor";

type Ctx = {
  /** true once the loader has left and the hero may play its entrance */
  ready: boolean;
  reduce: boolean;
  scrollTo: (target: string | number) => void;
};

const ExperienceContext = createContext<Ctx>({ ready: false, reduce: false, scrollTo: () => {} });
export const useExperience = () => useContext(ExperienceContext);

let lenis: Lenis | null = null;

/**
 * Client shell. Mounts Lenis and binds it to GSAP's ticker so ScrollTrigger,
 * video scrubbing and smooth scroll all share one requestAnimationFrame.
 */
export default function Experience({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [cursor, setCursor] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    const r = prefersReducedMotion();
    setReduce(r);
    setCursor(isFinePointer() && !r);
    if (r) return;

    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.3, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!readyRef.current) lenis.stop();

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-cursor", cursor);
    return () => document.body.classList.remove("has-cursor");
  }, [cursor]);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      reduce,
      scrollTo: (target) => {
        if (lenis) lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
        else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
        else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      },
    }),
    [ready, reduce],
  );

  return (
    <ExperienceContext.Provider value={value}>
      <Loader
        onDone={() => {
          readyRef.current = true;
          setReady(true);
          lenis?.start();
          ScrollTrigger.refresh();
        }}
      />
      {children}
      {cursor && <Cursor />}
    </ExperienceContext.Provider>
  );
}
