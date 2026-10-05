"use client";

import { EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";

const ITEMS = [...EXPERIENCE].sort((a, b) => a.start.localeCompare(b.start));

export default function Experience() {
  const { ref, progress } = useScrollProgress<HTMLOListElement>("through");
  // map the "through" progress so the spine completes ~80% of the way through
  const drawn = Math.min(1, Math.max(0, (progress - 0.12) / 0.62));

  return (
    <section id="experience" className="section exp" aria-labelledby="exp-h">
      <div className="wrap">
        <h2 id="exp-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
          Experience and <em>education.</em>
        </h2>

        <ol className="timeline" ref={ref} style={{ "--p": drawn } as React.CSSProperties}>
          <span className="tl-spine" aria-hidden="true">
            <span className="tl-spine-fill" />
          </span>
          {ITEMS.map((it, i) => {
            const at = (i + 0.5) / (ITEMS.length + 1);
            const lit = drawn >= at;
            return (
              <li key={it.id} className={`stop ${lit ? "is-lit" : ""} ${it.kind}`}>
                <span className="dot" aria-hidden="true" />
                <div className="stop-head">
                  <span className="year mono">{it.year}</span>
                  <span className="kind mono">{it.kind === "education" ? "Education" : "Experience"}</span>
                </div>
                <div className="stop-card card">
                  <h3>{it.title}</h3>
                  <p className="place">
                    {it.place}, {it.location}
                  </p>
                  <p className="detail">{it.detail}</p>
                  {it.bullets && (
                    <ul className="bullets">
                      {it.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          <li className={`stop next ${drawn > 0.95 ? "is-lit" : ""}`}>
            <span className="dot" aria-hidden="true" />
            <div className="stop-head">
              <span className="year mono">Next</span>
            </div>
            <div className="stop-card dashed">
              <h3>What I&rsquo;m looking for</h3>
              <p className="detail">AI automation, integration, RevOps or solutions engineering roles.</p>
            </div>
          </li>
        </ol>
      </div>

      <style>{`
        .timeline{position:relative;list-style:none;margin:48px 0 0;padding:0 0 0 clamp(28px,5vw,64px);display:grid;gap:28px}
        .tl-spine{position:absolute;left:8px;top:0;bottom:0;width:2px;background:var(--line);border-radius:2px}
        .tl-spine-fill{position:absolute;inset:0;background:linear-gradient(180deg,#5b4bff,#ec4899,#ff6b4a);transform:scaleY(var(--p,0));transform-origin:top;transition:transform .2s linear}
        .stop{position:relative;display:grid;grid-template-columns:200px minmax(0,1fr);gap:20px;align-items:start}
        .dot{position:absolute;left:calc(-1 * clamp(28px,5vw,64px) + 3px);top:14px;width:12px;height:12px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .5s var(--ease),transform .5s var(--ease),background .5s}
        .is-lit .dot{background:var(--accent);box-shadow:inset 0 0 0 2px var(--accent),0 0 0 6px rgba(91,75,255,.18);transform:scale(1.15)}
        .is-lit.education .dot{background:var(--accent-3);box-shadow:inset 0 0 0 2px var(--accent-3),0 0 0 6px rgba(14,165,164,.18)}
        .stop-head{display:flex;flex-direction:column;gap:6px;padding-top:12px}
        .year{font-size:13px;font-weight:700;color:var(--accent-ink)}
        .education .year{color:var(--accent-3)}
        .kind{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
        .stop-card{border-left:4px solid var(--accent)}
        .education .stop-card{border-left-color:var(--accent-3)}
        .stop-card{padding:24px 26px;opacity:1;transform:translateY(8px);transition:opacity .7s var(--ease),transform .7s var(--ease),box-shadow .6s var(--ease)}
        .is-lit .stop-card{opacity:1;transform:none}
        .stop-card h3{font-size:clamp(19px,2vw,24px)}
        .place{margin-top:6px;font-size:13px;color:var(--ink-2)}
        .detail{margin-top:12px;color:var(--ink-2);font-size:15px;line-height:1.55}
        .bullets{margin:12px 0 0;padding:0 0 0 16px;display:grid;gap:6px;color:var(--ink-2);font-size:14px;line-height:1.5}
        .dashed{border-radius:var(--radius);border:1.5px dashed var(--accent-2)!important;background:var(--tint-2)}
        @media (max-width: 760px){.stop{grid-template-columns:1fr;gap:8px}.stop-head{flex-direction:row;align-items:baseline;gap:14px;padding-top:6px}}
      `}</style>
    </section>
  );
}
