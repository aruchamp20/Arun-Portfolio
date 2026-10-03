"use client";

import { useRef } from "react";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import { SmoothScroll } from "@/lib/scroll";
import { useRevealObserver } from "@/lib/hooks";

export default function App({ hasVideo }: { hasVideo: boolean }) {
  const main = useRef<HTMLElement>(null);
  useRevealObserver(main);

  return (
    <>
      <SmoothScroll />
      <a href="#about" className="skip">
        Skip to content
      </a>
      <Navigation />
      <main ref={main}>
        <Hero hasVideo={hasVideo} />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <style>{`
        .skip{position:fixed;top:12px;left:12px;z-index:100;padding:10px 16px;border-radius:999px;background:var(--ink);color:#fff;font-weight:600;transform:translateY(-200%);transition:transform .3s var(--ease)}
        .skip:focus{transform:none}
      `}</style>
    </>
  );
}
