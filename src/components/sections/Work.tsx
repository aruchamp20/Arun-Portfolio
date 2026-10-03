"use client";

import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import TechLogo, { logoName } from "@/components/ui/TechLogo";

export default function Work() {
  const [open, setOpen] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section id="work" className="section work" aria-labelledby="work-h">
      <div className="wrap">
        <p className="tag rv">
          03 <span>/ Selected work</span>
        </p>
        <h2 id="work-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
          Things I&rsquo;ve <em>built.</em>
        </h2>
        <p className="lead sub rv" style={{ "--i": 2 } as React.CSSProperties}>
          {PROJECTS.length} projects from the resume. Hover, tap or focus a panel to open it.
        </p>

        <div className={`gallery rv ${isMobile ? "is-stack" : ""}`} style={{ "--i": 3 } as React.CSSProperties}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`panel ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => !isMobile && setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-labelledby={`p-${p.id}`}
              >
                <button
                  type="button"
                  className="wk-spine"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${p.id}`}
                  tabIndex={isOpen ? -1 : 0}
                >
                  <span className="mono sp-num">{p.index}</span>
                  <span className="sp-title">{p.title}</span>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div className="body" id={`panel-${p.id}`} hidden={!isOpen && isMobile}>
                  <div className="text">
                    <p className="mono kicker">
                      {p.index} / {p.kicker}
                    </p>
                    <h3 id={`p-${p.id}`}>{p.title}</h3>
                    <p className="desc">{p.description}</p>
                    <ul className="features">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="tech-chips" aria-label="Technologies">
                      {p.tech.map((t) => (
                        <li key={t}>
                          <TechLogo name={t} size={14} />
                          {logoName(t)}
                        </li>
                      ))}
                    </ul>
                    {p.github && (
                      <a href={p.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                        View on GitHub ↗
                      </a>
                    )}
                  </div>
                  <div className="illus" aria-hidden="true">
                    <span className="illus-label mono">Illustrative UI</span>
                    <Illustration kind={p.illustration} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .sub{margin-top:18px;max-width:52ch}
        .gallery{display:flex;gap:10px;margin-top:40px;height:min(78svh,600px)}
        .panel{position:relative;flex:1;min-width:0;border-radius:var(--radius);background:var(--card);box-shadow:var(--shadow-hair);overflow:hidden;transition:flex .9s var(--ease),box-shadow .6s var(--ease)}
        .panel.is-open{flex:8;box-shadow:var(--shadow-hair),var(--shadow-soft)}
        .wk-spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;opacity:1;transition:opacity .5s var(--ease)}
        .panel.is-open .wk-spine{opacity:0;pointer-events:none}
        .sp-num{font-size:12px;color:var(--mute)}
        .sp-title{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;letter-spacing:-.02em;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:60%}
        .plus{width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;font-size:20px;line-height:1;transition:transform .6s var(--ease),background .4s,color .4s}
        .wk-spine:hover .plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .body{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:24px;padding:clamp(22px,3vw,40px);opacity:0;transform:translateY(10px);transition:opacity .6s var(--ease) .25s,transform .6s var(--ease) .25s;min-width:560px}
        .panel.is-open .body{opacity:1;transform:none}
        .text{display:flex;flex-direction:column;gap:12px;min-width:0;overflow:auto}
        .kicker{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
        .text h3{font-size:clamp(22px,2.4vw,34px)}
        .desc{color:var(--ink-2);font-size:15px;line-height:1.55}
        .features{list-style:none;margin:4px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 14px}
        .features li{font-size:13px;color:var(--ink-2);padding-left:14px;position:relative;line-height:1.35}
        .features li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:50%;background:var(--ink)}
        .tech-chips{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
        .tech-chips li{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:12px;font-weight:500}
        .text .btn{align-self:flex-start;margin-top:6px}
        .illus{position:relative;border-radius:18px;background:var(--paper);box-shadow:var(--shadow-hair);overflow:hidden;clip-path:inset(0 100% 0 0 round 18px);transition:clip-path 1s var(--ease) .35s;min-height:220px}
        .panel.is-open .illus{clip-path:inset(0 0 0 0 round 18px)}
        .illus-label{position:absolute;top:10px;right:12px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);z-index:2}
        /* mobile: vertical accordion */
        .gallery.is-stack{flex-direction:column;height:auto}
        .is-stack .panel{flex:none;min-height:64px}
        .is-stack .wk-spine{position:relative;flex-direction:row;padding:18px 20px;justify-content:flex-start;gap:14px}
        .is-stack .sp-title{writing-mode:horizontal-tb;transform:none;max-height:none;flex:1;white-space:normal}
        .is-stack .panel.is-open .wk-spine{opacity:1;pointer-events:auto}
        .is-stack .panel.is-open .plus{transform:rotate(45deg)}
        .is-stack .body{position:relative;grid-template-columns:1fr;min-width:0;padding:0 20px 22px;transform:none}
        .is-stack .illus{min-height:200px}
        @media (max-width: 1100px){.body{grid-template-columns:1fr;min-width:420px}.illus{display:none}.is-stack .illus{display:block}}
      `}</style>
    </section>
  );
}

/** Pure CSS/JSX grayscale mini-UI hinting at what each product does. */
function Illustration({ kind }: { kind: Project["illustration"] }) {
  return (
    <div className={`ui ui-${kind}`}>
      {kind === "agents" && (
        <>
          <div className="ui-row">
            <span className="ui-pill">07:00</span>
            <span className="ui-bar w60" />
          </div>
          {[0, 1, 2].map((i) => (
            <div className="ui-card" key={i} style={{ "--i": i } as React.CSSProperties}>
              <span className="ui-dot" />
              <span className="ui-bar w70" />
              <span className="ui-tick">✓</span>
            </div>
          ))}
          <div className="ui-chat">
            <span className="ui-bar w40" />
            <span className="ui-bar w80" />
            <span className="ui-bar w55" />
          </div>
        </>
      )}
      {kind === "pipeline" && (
        <div className="ui-flow">
          {["Deal", "Webhook", "Upsert", "Order"].map((s, i) => (
            <div className="ui-step" key={s} style={{ "--i": i } as React.CSSProperties}>
              <span className="ui-node">{s}</span>
              {i < 3 && <span className="ui-arrow" />}
            </div>
          ))}
          <span className="ui-pill ui-ack">ack &lt; 1 s</span>
        </div>
      )}
      {kind === "dupes" && (
        <div className="ui-table">
          {[0, 1, 2, 3, 4].map((i) => (
            <div className={`ui-tr ${i === 1 || i === 2 ? "is-dupe" : ""}`} key={i}>
              <span className="ui-bar w30" />
              <span className="ui-bar w40" />
              <span className="ui-score">{i === 1 || i === 2 ? "0.92" : "0.0" + (i + 1)}</span>
            </div>
          ))}
        </div>
      )}
      {kind === "migration" && (
        <div className="ui-mig">
          <div className="ui-stack">
            <span className="ui-pill">CRM A</span>
            {[0, 1, 2, 3].map((i) => (
              <span className="ui-bar w100" key={i} />
            ))}
          </div>
          <div className="ui-sync">
            <span className="ui-arrow" />
            <span className="ui-arrow back" />
          </div>
          <div className="ui-stack">
            <span className="ui-pill">CRM B</span>
            {[0, 1, 2, 3].map((i) => (
              <span className="ui-bar w100" key={i} />
            ))}
          </div>
        </div>
      )}
      {kind === "sso" && (
        <div className="ui-sso">
          <div className="ui-lock">
            <span />
          </div>
          <div className="ui-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <span className="ui-app" key={i} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
      {kind === "report" && (
        <div className="ui-report">
          <div className="ui-kpis">
            {[0, 1, 2].map((i) => (
              <span className="ui-kpi" key={i}>
                <span className="ui-bar w40" />
                <b>{["253", "253", "✓"][i]}</b>
              </span>
            ))}
          </div>
          <div className="ui-chart">
            {[40, 70, 55, 90, 65, 80, 50, 95].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
      {kind === "triage" && (
        <div className="ui-triage">
          <div className="ui-msg">
            <span className="ui-bar w80" />
            <span className="ui-bar w60" />
          </div>
          <div className="ui-topics">
            {["Topic", "Action", "Test"].map((t) => (
              <span className="ui-pill" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="ui-msg right">
            <span className="ui-bar w70" />
          </div>
        </div>
      )}
      <style>{`
        .ui{position:absolute;inset:0;padding:28px 22px 22px;display:flex;flex-direction:column;gap:10px;color:var(--ink);font-family:var(--font-mono);font-size:10px}
        .ui-bar{display:block;height:8px;border-radius:4px;background:var(--soft)}
        .w30{width:30%}.w40{width:40%}.w55{width:55%}.w60{width:60%}.w70{width:70%}.w80{width:80%}.w100{width:100%}
        .ui-pill{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:var(--ink);color:#fff;font-size:9px;letter-spacing:.06em}
        .ui-row{display:flex;align-items:center;gap:10px}
        .ui-card{display:flex;align-items:center;gap:10px;background:#fff;border-radius:10px;padding:10px;box-shadow:var(--shadow-hair);animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*120ms)}
        .ui-dot{width:10px;height:10px;border-radius:50%;background:var(--ink)}
        .ui-tick{margin-left:auto;font-size:11px}
        .ui-chat{margin-top:auto;background:#fff;border-radius:12px 12px 12px 2px;padding:12px;display:grid;gap:6px;box-shadow:var(--shadow-hair)}
        .ui-flow{display:flex;flex-direction:column;gap:8px;justify-content:center;height:100%;position:relative}
        .ui-step{display:flex;flex-direction:column;align-items:flex-start;gap:6px;animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*140ms)}
        .ui-node{background:#fff;border-radius:8px;padding:6px 12px;box-shadow:var(--shadow-hair);font-weight:600}
        .ui-arrow{display:block;width:1px;height:12px;background:var(--ink);margin-left:16px;position:relative}
        .ui-arrow::after{content:"";position:absolute;bottom:-1px;left:-3px;border:3.5px solid transparent;border-top-color:var(--ink)}
        .ui-ack{position:absolute;right:0;top:0}
        .ui-table{display:grid;gap:6px;height:100%;align-content:center}
        .ui-tr{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:center;background:#fff;border-radius:8px;padding:8px 10px;box-shadow:var(--shadow-hair)}
        .ui-tr.is-dupe{background:var(--ink)}
        .ui-tr.is-dupe .ui-bar{background:rgba(255,255,255,.35)}
        .ui-tr.is-dupe .ui-score{color:#fff}
        .ui-mig{display:grid;grid-template-columns:1fr 36px 1fr;gap:10px;height:100%;align-items:center}
        .ui-stack{display:grid;gap:8px;background:#fff;border-radius:10px;padding:10px;box-shadow:var(--shadow-hair)}
        .ui-sync{display:flex;flex-direction:column;align-items:center;gap:10px}
        .ui-sync .ui-arrow{height:1px;width:28px;margin:0}
        .ui-sync .ui-arrow::after{bottom:-3px;left:auto;right:-2px;border:3.5px solid transparent;border-left-color:var(--ink)}
        .ui-sync .ui-arrow.back::after{right:auto;left:-2px;border-left-color:transparent;border-right-color:var(--ink)}
        .ui-sso{display:flex;flex-direction:column;align-items:center;gap:14px;justify-content:center;height:100%}
        .ui-lock{width:34px;height:28px;border-radius:6px;background:var(--ink);position:relative;margin-top:10px}
        .ui-lock::before{content:"";position:absolute;left:8px;right:8px;top:-12px;height:16px;border:3px solid var(--ink);border-bottom:0;border-radius:10px 10px 0 0}
        .ui-lock span{position:absolute;left:50%;top:50%;width:6px;height:6px;border-radius:50%;background:#fff;transform:translate(-50%,-50%)}
        .ui-grid{display:grid;grid-template-columns:repeat(3,44px);gap:8px}
        .ui-app{height:44px;border-radius:10px;background:#fff;box-shadow:var(--shadow-hair);animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*60ms)}
        .ui-report{display:flex;flex-direction:column;gap:12px;height:100%}
        .ui-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .ui-kpi{background:#fff;border-radius:10px;padding:10px;display:grid;gap:8px;box-shadow:var(--shadow-hair)}
        .ui-kpi b{font-size:16px;letter-spacing:-.04em}
        .ui-chart{flex:1;display:flex;align-items:flex-end;gap:6px;background:#fff;border-radius:10px;padding:12px;box-shadow:var(--shadow-hair)}
        .ui-chart span{flex:1;background:var(--ink);border-radius:3px 3px 0 0;transform-origin:bottom;animation:ui-grow .9s var(--ease) both;animation-delay:calc(.5s + var(--i)*60ms)}
        .ui-triage{display:flex;flex-direction:column;gap:12px;justify-content:center;height:100%}
        .ui-msg{background:#fff;border-radius:12px 12px 12px 2px;padding:12px;display:grid;gap:6px;box-shadow:var(--shadow-hair);width:80%}
        .ui-msg.right{align-self:flex-end;border-radius:12px 12px 2px 12px;background:var(--ink)}
        .ui-msg.right .ui-bar{background:rgba(255,255,255,.35)}
        .ui-topics{display:flex;gap:6px}
        @keyframes ui-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes ui-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
      `}</style>
    </div>
  );
}
