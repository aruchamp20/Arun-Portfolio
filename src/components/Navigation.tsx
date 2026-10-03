"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { useActiveSection, useScrolled } from "@/lib/hooks";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const IDS = NAV.map((n) => n.id);

export default function Navigation() {
  const scrolled = useScrolled(40);
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const pillRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, visible: false });

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const link = pill.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    const pr = pill.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    setIndicator({ x: lr.left - pr.left, w: lr.width, visible: true });
  }, [active, scrolled]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay close first so Lenis is unlocked
    requestAnimationFrame(() => scrollToTarget(id, -24));
  };

  return (
    <>
      <div className="progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="brand" onClick={go("top")}>
          <span className="mark">
            <span>{PROFILE.initials}</span>
          </span>
          <span className="brand-name">{PROFILE.name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          <div className="pill" ref={pillRef}>
            <span
              className="indicator"
              aria-hidden="true"
              style={{
                transform: `translateX(${indicator.x}px)`,
                width: indicator.w,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                data-id={n.id}
                className={active === n.id ? "is-active" : ""}
                aria-current={active === n.id ? "location" : undefined}
                onClick={go(n.id)}
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>

        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="mobile-menu" className={`overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Sections (mobile)">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>
                  <span className="mono">0{i + 1}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="overlay-foot mono">{PROFILE.email}</p>
      </div>

      <style>{`
        .progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--grad);transform-origin:0 50%;z-index:60;pointer-events:none}
        .nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:16px var(--gutter);pointer-events:none}
        .nav > *{pointer-events:auto}
        .brand{display:inline-flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.02em}
        .mark{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1.5px var(--accent);color:var(--accent-ink);font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:-.02em;transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .brand:hover .mark{transform:rotate(360deg)}
        .is-scrolled .mark{background:var(--grad);color:#fff;box-shadow:0 8px 18px -8px rgba(91,75,255,.7)}
        .brand-name{transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .is-scrolled .brand-name{opacity:0;transform:translateX(-6px);pointer-events:none}
        .nav-links{display:none}
        .pill{position:relative;display:flex;gap:2px;padding:4px;border-radius:999px;transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s var(--ease)}
        .is-scrolled .pill{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(13,13,13,.08),0 10px 30px -18px rgba(13,13,13,.3)}
        .pill a{position:relative;z-index:1;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
        .pill a:hover{color:var(--ink)}
        .pill a.is-active{color:#fff}
        .indicator{position:absolute;top:4px;bottom:4px;left:0;border-radius:999px;background:var(--grad);transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
        .menu-btn{height:40px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(13,13,13,.1);font-size:14px;font-weight:600}
        .overlay{position:fixed;inset:0;z-index:45;background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:var(--gutter);clip-path:circle(0 at calc(100% - 48px) 36px);transition:clip-path .9s var(--ease);visibility:hidden}
        .overlay.is-open{clip-path:circle(150% at calc(100% - 48px) 36px);visibility:visible}
        .overlay ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}
        .overlay li{opacity:0;transform:translateY(18px);transition:opacity .7s var(--ease),transform .7s var(--ease);transition-delay:calc(120ms + var(--i)*60ms)}
        .overlay.is-open li{opacity:1;transform:none}
        .overlay a{display:flex;align-items:baseline;gap:18px;font-size:clamp(34px,9vw,56px);font-weight:700;letter-spacing:-.045em;line-height:1.1}
        .overlay a .mono{font-size:13px;color:var(--accent)}
        .overlay-foot{margin-top:40px;font-size:12px;color:var(--mute)}
        @media (min-width: 900px){.nav-links{display:block}.menu-btn{display:none}.overlay{display:none}}
      `}</style>
    </>
  );
}
