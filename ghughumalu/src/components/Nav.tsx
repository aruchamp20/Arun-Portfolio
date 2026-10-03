"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/content";
import { useExperience } from "./Experience";
import Magnetic from "./Magnetic";
import { gsap } from "@/lib/gsap";

export default function Nav() {
  const { ready, scrollTo } = useExperience();
  const [tone, setTone] = useState<"hero" | "page">("hero");
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => setTone(window.scrollY > innerHeight * 0.6 ? "page" : "hero");
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!ready || !bar.current) return;
    gsap.fromTo(bar.current.children, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.3 });
  }, [ready]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
    history.replaceState(null, "", href);
  };

  return (
    <header ref={bar} className={`nav nav-${tone}`}>
      <a href="#top" onClick={(e) => go(e, "#top")} className="nav-mark" aria-label={`${SITE.name}, back to top`}>
        <span className="nav-dot" aria-hidden="true" />
        <span>{SITE.name}</span>
      </a>
      <nav aria-label="Primary" className="nav-links">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className="u">
            {n.label}
          </a>
        ))}
      </nav>
      <Magnetic strength={0.2}>
        <a href="#reserve" onClick={(e) => go(e, "#reserve")} className="btn btn-line nav-cta">
          <span>Reserve</span>
        </a>
      </Magnetic>
      <style>{`
        .nav{position:fixed;inset:0 0 auto 0;z-index:110;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px var(--gutter);mix-blend-mode:multiply}
        .nav>*{opacity:0}
        .nav-mark{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-serif);font-size:22px;letter-spacing:-.02em;font-variation-settings:"opsz" 48,"SOFT" 40}
        .nav-dot{width:9px;height:9px;border-radius:50%;background:var(--turmeric);transition:transform .6s var(--ease-out)}
        .nav-mark:hover .nav-dot{transform:scale(1.5)}
        .nav-links{display:flex;gap:28px;font-size:14px;font-weight:500;letter-spacing:-.005em}
        .nav-cta{height:44px;padding:0 20px;font-size:14px}
        @media (max-width:900px){
          .nav{padding:16px var(--gutter)}
          .nav-links{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);gap:0;background:#fff;border-radius:999px;box-shadow:var(--shadow-card);padding:4px}
          .nav-links a{padding:10px 14px;border-radius:999px;font-size:13px}
          .nav-links a::after{display:none}
          .nav-links a:active{background:var(--paper)}
        }
      `}</style>
    </header>
  );
}
