"use client";

import { useEffect, useRef, useState } from "react";
import { ID_CARD_BACK, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * A lanyard ID card: damped pendulum swing driven by pointer velocity,
 * idle sway when nothing happens, and a 3D flip on hover / tap / Enter.
 */
export default function IDCard() {
  const rigRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const touch = useRef(false);

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    if (prefersReducedMotion()) return;

    let angle = 0; // degrees
    let velocity = 0; // deg / frame
    let lastX = 0;
    let lastT = performance.now();
    let raf = 0;
    const stiffness = 0.015;
    const damping = 0.965;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      lastT = now;
      // only react when the pointer is near the card column
      const r = rig.getBoundingClientRect();
      const near = e.clientX > r.left - 240 && e.clientX < r.right + 240 && e.clientY > r.top - 120 && e.clientY < r.bottom + 120;
      if (!near) return;
      velocity += Math.max(-1.6, Math.min(1.6, (dx / dt) * 1.2));
    };

    const tick = (t: number) => {
      // spring back to centre, plus a slow idle sway
      const idle = Math.sin(t / 1400) * 0.9;
      const target = idle;
      velocity += (target - angle) * stiffness;
      velocity *= damping;
      angle += velocity;
      rig.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isFlipped = flipped || hover;

  return (
    <div className="lanyard" aria-label="Developer ID card">
      <div className="rig" ref={rigRef}>
        <div className="strap" aria-hidden="true">
          <div className="strap-text">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>
                {PROFILE.name} / {PROFILE.role} /&nbsp;
              </span>
            ))}
          </div>
        </div>
        <div className="clip" aria-hidden="true">
          <span />
        </div>

        <button
          type="button"
          className={`idcard ${isFlipped ? "is-flipped" : ""}`}
          onMouseEnter={() => !touch.current && setHover(true)}
          onMouseLeave={() => !touch.current && setHover(false)}
          onTouchStart={() => (touch.current = true)}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          aria-pressed={isFlipped}
        >
          <span className="sr-only">{isFlipped ? "ID card, back. Press to show the front." : "ID card, front. Press to flip and read more."}</span>
          <div className="face front">
            <div className="band mono">DEVELOPER ID</div>
            <div className="photo-wrap">
              <span className="halo" aria-hidden="true" />
              <div className="photo-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} loading="lazy" />
              </div>
            </div>
            <p className="name">{PROFILE.name}</p>
            <p className="role">{PROFILE.role}</p>
            <dl className="rows mono">
              <div>
                <dt>Dept.</dt>
                <dd>{PROFILE.department}</dd>
              </div>
              <div>
                <dt>Since</dt>
                <dd>{PROFILE.since}</dd>
              </div>
              <div>
                <dt>MSc</dt>
                <dd>{PROFILE.gradYear}</dd>
              </div>
            </dl>
            <div className="foot">
              <span className="barcode" aria-hidden="true" />
              <span className="holo" aria-hidden="true" />
            </div>
          </div>

          <div className="face back">
            <div className="band mono">PROFILE</div>
            <ul>
              {ID_CARD_BACK.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="sig">
              <span className="sig-line" aria-hidden="true">
                {PROFILE.firstName}
              </span>
              <span className="mono">signature</span>
            </div>
            <p className="found mono">If found: {PROFILE.email}</p>
          </div>
        </button>
      </div>

      <style>{`
        .lanyard{position:relative;display:flex;justify-content:center;width:100%;margin-top:calc(-1 * var(--section-y));padding-top:0}
        .rig{transform-origin:50% 0;will-change:transform;perspective:1200px;display:flex;flex-direction:column;align-items:center}
        .strap{width:30px;height:56px;background:var(--grad);overflow:hidden;position:relative;border-radius:0 0 3px 3px}
        .strap-text{position:absolute;left:50%;top:0;transform:translateX(-50%);writing-mode:vertical-rl;color:rgba(255,255,255,.75);font-family:var(--font-mono);font-size:7px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;animation:strap 14s linear infinite}
        .clip{width:22px;height:18px;border-radius:4px;background:linear-gradient(180deg,#d9d7d2,#9c9a95);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 2px 4px rgba(0,0,0,.25);display:grid;place-items:center;margin-top:-2px}
        .clip span{width:8px;height:4px;border-radius:2px;background:#5d5b57}
        .idcard{position:relative;width:300px;height:404px;margin-top:6px;border-radius:18px;transform-style:preserve-3d;transition:transform 1s var(--ease);text-align:left;cursor:pointer}
        .idcard.is-flipped{transform:rotateY(180deg)}
        .idcard:focus-visible{outline-offset:6px}
        .face{position:absolute;inset:0;border-radius:18px;background:var(--card);box-shadow:var(--shadow-hair),0 30px 60px -28px rgba(13,13,13,.35);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column;align-items:center}
        .back{transform:rotateY(180deg)}
        .band{width:100%;background:var(--grad);color:#fff;text-align:center;font-size:11px;letter-spacing:.24em;padding:10px 0}
        .photo-wrap{position:relative;margin-top:22px}
        .halo{position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(circle,rgba(91,75,255,.22),rgba(255,107,74,0) 70%)}
        .photo-ring{position:relative;width:128px;height:156px;border-radius:14px;padding:3px;background:var(--grad);box-shadow:0 10px 24px -14px rgba(13,13,13,.5)}
        .photo-ring img{width:100%;height:100%;object-fit:cover;border-radius:11px;background:#fff;transition:transform .8s var(--ease)}
        .idcard:hover .photo-ring img{transform:scale(1.06)}
        .name{margin-top:16px;font-weight:700;font-size:19px;letter-spacing:-.03em}
        .role{font-size:13px;color:var(--mute);margin-top:2px}
        .rows{margin:16px 0 0;width:100%;padding:0 22px;display:grid;gap:5px;font-size:11px}
        .rows div{display:flex;justify-content:space-between;border-top:1px dashed var(--line);padding-top:5px}
        .rows dt{color:var(--accent-ink);letter-spacing:.06em;text-transform:uppercase}
        .rows dd{margin:0}
        .foot{margin-top:auto;width:100%;padding:0 22px 18px;display:flex;align-items:flex-end;justify-content:space-between}
        .barcode{width:150px;height:30px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 5px,transparent 5px 8px,var(--ink) 8px 11px,transparent 11px 13px)}
        .holo{width:38px;height:38px;border-radius:50%;background:conic-gradient(from 0deg,#5b4bff,#0ea5a4,#f5a700,#ff6b4a,#ec4899,#5b4bff);opacity:.85;box-shadow:inset 0 0 0 1px rgba(13,13,13,.15);animation:holo 6s linear infinite}
        .back ul{list-style:none;margin:24px 0 0;padding:0 24px;display:grid;gap:12px;width:100%}
        .back li{font-size:14px;line-height:1.35;padding-left:16px;position:relative;letter-spacing:-.01em}
        .back li::before{content:"";position:absolute;left:0;top:.5em;width:7px;height:7px;border-radius:50%;background:var(--grad)}
        .sig{margin-top:auto;width:100%;padding:0 24px;display:flex;flex-direction:column;gap:2px}
        .sig-line{font-family:var(--font-serif);font-style:italic;font-size:30px;border-bottom:1px solid var(--line);line-height:1.1;padding-bottom:4px}
        .sig .mono{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
        .found{width:100%;padding:12px 24px 16px;font-size:10px;color:var(--mute);overflow-wrap:anywhere}
        @keyframes strap{from{transform:translate(-50%,0)}to{transform:translate(-50%,-50%)}}
        @keyframes holo{to{transform:rotate(360deg)}}
        @media (max-width: 760px){.lanyard{margin-top:0}}
        @media (prefers-reduced-motion: reduce){.strap-text,.holo{animation:none}}
      `}</style>
    </div>
  );
}
