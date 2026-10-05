"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const LINES = ["Open to", "new roles."];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      ok = true;
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <>
      <section id="contact" className="section contact" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 id="contact-h" className="big rv" style={{ "--i": 1 } as React.CSSProperties} aria-label={LINES.join(" ")}>
            {LINES.map((line, li) => (
              <span className="line" key={li} aria-hidden="true">
                {Array.from(line).map((ch, ci) => (
                  <span className={`ch ${ch === " " ? "sp" : ""}`} key={ci} style={{ "--i": ci } as React.CSSProperties}>
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <div className="email-row rv" style={{ "--i": 2 } as React.CSSProperties}>
            <a href={`mailto:${PROFILE.email}`} className="email">
              {PROFILE.email}
            </a>
            <button type="button" className={`copy ${copied ? "is-copied" : ""}`} onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>

          <div className="c-links rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.phoneHref} className="btn btn-ghost">
              {PROFILE.phone}
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {PROFILE.linkedin && (
              <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            <span className="loc mono">{PROFILE.location}</span>
          </div>

          <div className="badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <defs>
                <path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text fontSize="11.5" letterSpacing="2.4" fill="currentColor" fontFamily="var(--font-mono)" textLength="272" lengthAdjust="spacingAndGlyphs">
                <textPath href="#circ">get in touch / get in touch /</textPath>
              </text>
            </svg>
            <span className="badge-dot" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap foot-row">
          <p className="mono">
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <a
            href="#top"
            className="mono to-top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("top");
            }}
          >
            Back to top
          </a>
          <p className="mono">Built with Next.js</p>
        </div>
      </footer>

      <style>{`
        .contact{padding-bottom:clamp(64px,10vh,120px)}
        .big{margin-top:0;font-size:clamp(44px,9.4vw,140px);line-height:.95;max-width:none}
        .line{display:block;white-space:nowrap}
        .ch{display:inline-block;transition:transform .5s var(--ease)}
        .ch:hover{transform:translateY(-14%);transition-duration:.18s}
        .line:last-child .ch{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.01em;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
        .email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:clamp(28px,5vh,48px)}
        .email{font-size:clamp(20px,3.2vw,40px);font-weight:600;letter-spacing:-.03em;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:8px;text-decoration-color:var(--accent);transition:text-decoration-color .4s;overflow-wrap:anywhere}
        .email:hover{text-decoration-color:var(--accent-2)}
        .copy{height:34px;padding:0 14px;border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--accent);color:var(--accent-ink);font-size:13px;font-weight:600;transition:background .4s var(--ease),color .4s var(--ease)}
        .copy:hover,.copy.is-copied{background:var(--accent);color:#fff}
        .c-links{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:28px}
        .loc{font-size:12px;color:var(--mute);margin-left:6px}
        .badge{position:absolute;right:var(--gutter);bottom:clamp(24px,6vh,64px);width:120px;height:120px;display:grid;place-items:center;color:var(--accent-ink);animation:spin 18s linear infinite}
        .badge svg{position:absolute;inset:0}
        .badge-dot{width:14px;height:14px;border-radius:50%;background:var(--grad)}
        .footer{border-top:1px solid var(--line);padding:22px 0}
        .foot-row{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:12px;color:var(--mute);flex-wrap:wrap}
        .to-top{color:var(--accent-ink);font-weight:700}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media (max-width: 760px){.badge{position:relative;right:auto;bottom:auto;margin:40px 0 0}}
        @media (prefers-reduced-motion: reduce){.badge{animation:none}}
      `}</style>
    </>
  );
}
