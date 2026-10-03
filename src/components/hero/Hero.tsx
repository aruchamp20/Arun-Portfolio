"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

type Props = { hasVideo: boolean };

export default function Hero({ hasVideo }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);

  /** Try to play with sound; fall back to muted if the browser blocks it. */
  const tryPlay = useCallback(async (withSound: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !withSound;
    try {
      await v.play();
      setSoundOn(!v.muted);
      setBlocked(false);
    } catch {
      if (withSound) {
        v.muted = true;
        setSoundOn(false);
        setBlocked(true);
        try {
          await v.play();
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!hasVideo) return;
    tryPlay(true);

    // Unlock sound on the first interaction if autoplay with sound was blocked.
    const unlock = () => {
      const v = videoRef.current;
      if (!v || !v.muted || !visible.current) return;
      v.muted = false;
      v.play()
        .then(() => {
          setSoundOn(true);
          setBlocked(false);
        })
        .catch(() => {
          v.muted = true;
        });
    };
    const opts = { once: true, passive: true } as AddEventListenerOptions;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("touchend", unlock, opts);

    // Pause the voice as soon as less than 35 % of the hero is visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        visible.current = entry.intersectionRatio >= 0.35;
        if (visible.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.35, 1] },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      io.disconnect();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchend", unlock);
    };
  }, [hasVideo, tryPlay]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted) tryPlay(true);
    else {
      v.muted = true;
      setSoundOn(false);
    }
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id, -24);
  };

  return (
    <section id="top" className="hero" ref={sectionRef} aria-label="Introduction">
      <div className="hero-stage">
        <span className="ghost" aria-hidden="true">
          {PROFILE.firstName.toUpperCase()}
        </span>

        <div className="frame">
          {hasVideo ? (
            <video
              ref={videoRef}
              className="media"
              muted
              loop
              playsInline
              preload="auto"
              poster="hero/hero-still.webp"
              aria-label={`${PROFILE.name} introducing themself: ${PROFILE.role}.`}
            >
              <source src="hero/hero.webm" type="video/webm" />
              <source src="hero/hero.mp4" type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="media still"
              src="hero/hero-still.webp"
              width={768}
              height={960}
              alt={`${PROFILE.name}, ${PROFILE.role}, standing and smiling.`}
              fetchPriority="high"
            />
          )}
          <span className="ground" aria-hidden="true" />
        </div>

        {hasVideo && (
          <button
            type="button"
            className={`sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Pause the introduction" : "Play the introduction with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M6 3.5v13l11-6.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="wrap hero-copy">
        <p className="tag rv">
          <span>{PROFILE.location}</span>
        </p>
        <h1 className="rv" style={{ "--i": 1 } as React.CSSProperties}>
          {PROFILE.role}
          <em className="accent">.</em>
        </h1>
        <p className="lead rv" style={{ "--i": 2 } as React.CSSProperties}>
          {PROFILE.tagline}
        </p>
        <div className="ctas rv" style={{ "--i": 3 } as React.CSSProperties}>
          <a href="#work" className="btn btn-primary" onClick={go("work")}>
            Explore work
          </a>
          <a href="#contact" className="btn btn-ghost" onClick={go("contact")}>
            Let&rsquo;s talk
          </a>
          <a href={PROFILE.resume} className="btn btn-ghost" download={PROFILE.resumeFileName}>
            Resume <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <style>{`
        .hero{position:relative;height:100svh;min-height:680px;max-height:1200px;overflow:hidden}
        .hero-stage{position:absolute;inset:0;display:flex;justify-content:center;align-items:flex-end;padding-top:72px}
        .ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);font-weight:800;font-size:clamp(120px,24vw,420px);letter-spacing:-.06em;line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(91,75,255,.28);user-select:none;white-space:nowrap;pointer-events:none}
        .frame{position:relative;height:min(90svh,1040px);aspect-ratio:768/960;max-width:100%}
        .frame::before{content:"";position:absolute;left:50%;top:38%;width:140%;height:70%;transform:translate(-50%,-50%);background:radial-gradient(ellipse at center,rgba(91,75,255,.22),rgba(255,107,74,.14) 45%,transparent 70%);filter:blur(30px);z-index:0;pointer-events:none}
        .media{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;position:relative;z-index:1}
        .still{animation:breathe 6s ease-in-out infinite;transform-origin:50% 100%;-webkit-mask-image:linear-gradient(to bottom,#000 84%,transparent 100%);mask-image:linear-gradient(to bottom,#000 84%,transparent 100%)}
        .ground{position:absolute;left:50%;bottom:4%;width:46%;height:5%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at center,rgba(13,13,13,.16),rgba(13,13,13,0) 70%);z-index:0}
        .sound{position:absolute;right:calc(50% - min(45svh,520px) + 8px);bottom:28px;width:46px;height:46px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;z-index:3;transition:transform .5s var(--ease),background .4s var(--ease)}
        .sound:hover{transform:translateY(-2px)}
        .sound.is-blocked::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid var(--accent);animation:ping 1.6s var(--ease) infinite}
        .hero-copy{position:absolute;left:0;right:0;bottom:0;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end;gap:18px;padding-bottom:clamp(28px,5vh,56px);pointer-events:none}
        .hero-copy > *{pointer-events:auto}
        .hero h1{font-size:clamp(40px,6.2vw,92px);max-width:8ch;grid-column:1}
        .hero .tag{grid-column:1;grid-row:1;margin-bottom:12px}
        .hero h1{grid-row:2}
        .hero .lead{grid-column:2;grid-row:1;justify-self:end;text-align:right;max-width:30ch;margin-bottom:12px}
        .ctas{display:flex;flex-wrap:wrap;gap:10px;grid-column:2;grid-row:2;justify-self:end;justify-content:flex-end}
        @keyframes ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.9);opacity:0}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.012)}}
        @media (max-width: 900px){
          .hero{height:auto;min-height:0;max-height:none;display:flex;flex-direction:column}
          .hero-stage{position:relative;inset:auto;height:62svh;padding-top:84px;flex:none}
          .frame{height:100%}
          .sound{right:calc(50% - 31svh + 8px)}
          .hero-copy{position:relative;grid-template-columns:1fr;gap:12px;padding-top:12px;padding-bottom:40px}
          .hero .tag,.hero h1,.hero .lead,.ctas{grid-column:1;grid-row:auto;justify-self:start;text-align:left;justify-content:flex-start;margin-bottom:0}
          .hero h1{font-size:clamp(40px,11vw,64px);max-width:none}
        }
        @media (max-width: 480px){.sound{right:var(--gutter)}}
        @media (prefers-reduced-motion: reduce){.still{animation:none}.sound.is-blocked::after{animation:none}}
      `}</style>
    </section>
  );
}
