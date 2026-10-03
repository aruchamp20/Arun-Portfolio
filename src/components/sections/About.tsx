"use client";

import { PROFILE, QUICK_FACTS } from "@/lib/data";
import IDCard from "@/components/ui/IDCard";

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <div className="about-grid">
          <div className="col intro">
            <p className="tag rv">
              01 <span>/ About</span>
            </p>
            <h2 id="about-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
              Hi, I&rsquo;m <em>{PROFILE.firstName}.</em>
            </h2>
            <p className="lead rv" style={{ "--i": 2 } as React.CSSProperties}>
              {PROFILE.resumeSummary}
            </p>
            <p className="extra rv" style={{ "--i": 3 } as React.CSSProperties}>
              {PROFILE.extraLine}
            </p>
            <div className="btns rv" style={{ "--i": 4 } as React.CSSProperties}>
              <a href={PROFILE.resume} className="btn btn-primary" download={PROFILE.resumeFileName}>
                Resume <span aria-hidden="true">↓</span>
              </a>
              {PROFILE.github && (
                <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
              {PROFILE.linkedin && (
                <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>

          <div className="col card-col">
            <IDCard />
          </div>

          <div className="col facts">
            <h3 className="facts-h rv">Quick facts</h3>
            <dl>
              {QUICK_FACTS.map((f, i) => (
                <div key={f.label} className="fact-row rv" style={{ "--i": i + 1 } as React.CSSProperties}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.href ? <a href={f.href}>{f.value}</a> : f.value}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="quote rv" style={{ "--i": 6 } as React.CSSProperties}>
              <p>
                <span className="accent">&ldquo;</span>
                {PROFILE.quote}
                <span className="accent">&rdquo;</span>
              </p>
              <cite className="mono">from the resume</cite>
            </blockquote>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:stretch}
        .col{display:flex;flex-direction:column;min-width:0}
        .intro{gap:18px}
        .intro .h2{max-width:none}
        .extra{color:var(--mute);font-size:15px;line-height:1.6;padding-left:16px;border-left:1px solid var(--line)}
        .btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
        .card-col{align-items:center;justify-content:flex-start;min-height:560px}
        .facts{justify-content:center;gap:10px}
        .facts-h{font-size:13px;font-family:var(--font-mono);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
        .facts dl{margin:0;display:grid}
        .fact-row{display:grid;grid-template-columns:100px 1fr;gap:12px;padding:14px 0;border-top:1px solid var(--line);align-items:baseline}
        .fact-row:last-child{border-bottom:1px solid var(--line)}
        .fact-row dt{font-size:12px;color:var(--mute);letter-spacing:.04em}
        .fact-row dd{margin:0;font-weight:500;overflow-wrap:anywhere}
        .fact-row dd a{border-bottom:1px solid var(--line);transition:border-color .3s}
        .fact-row dd a:hover{border-color:var(--ink)}
        .quote{margin:28px 0 0;padding:22px 24px;background:var(--card);border-radius:22px;box-shadow:var(--shadow-hair)}
        .quote p{font-size:18px;line-height:1.45;letter-spacing:-.01em}
        .quote .accent{font-size:26px;line-height:0}
        .quote cite{display:block;margin-top:10px;font-style:normal;font-size:11px;color:var(--mute);letter-spacing:.06em;text-transform:uppercase}
        @media (max-width: 1100px){.about-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.card-col{grid-row:1;grid-column:2}.intro{grid-column:1}.facts{grid-column:1/-1}}
        @media (max-width: 760px){.about-grid{grid-template-columns:1fr}.card-col{grid-row:auto;grid-column:auto;min-height:520px}.intro,.facts{grid-column:auto}}
      `}</style>
    </section>
  );
}
