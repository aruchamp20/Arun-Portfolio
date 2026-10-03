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
        .illus{position:relative;border-radius:18px;background:var(--paper);box-shadow:var(--shadow-hair);overflow:hidden;clip-path:inset(0 100% 0 0 round 18px);transition:clip-path 1s var(--ease) .35s;min-height:300px}
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
        .is-stack .illus{min-height:300px}
        @media (max-width: 1100px){.body{grid-template-columns:1fr;min-width:420px}.illus{display:none}.is-stack .illus{display:block}}
      `}</style>
    </section>
  );
}

/** Pure CSS/JSX grayscale mini-UI built from the résumé's own facts for each project. */
function Illustration({ kind }: { kind: Project["illustration"] }) {
  return (
    <div className={`ui ui-${kind}`}>
      {kind === "agents" && (
        <>
          <div className="ui-row">
            <span className="ui-pill">07:00 · daily</span>
            <span className="ui-txt">Next event day: crew chat</span>
          </div>
          {[
            ["Salesforce", "read pipeline state"],
            ["monday.com", "apply board rules"],
            ["Microsoft Teams", "post the digest"],
          ].map(([src, act], i) => (
            <div className="ui-card" key={src} style={{ "--i": i } as React.CSSProperties}>
              <span className="ui-dot" />
              <span className="ui-k">{src}</span>
              <span className="ui-v">{act}</span>
              <span className="ui-tick">✓</span>
            </div>
          ))}
          <div className="ui-chat">
            <b>~7 scheduled agents</b>
            <span>Every action visible to the team: a chat, a digest, a board update.</span>
          </div>
        </>
      )}
      {kind === "pipeline" && (
        <div className="ui-flow">
          {[
            ["HubSpot deal", "stage changed"],
            ["Signed webhook", "ack < 1 s, deferred processing"],
            ["Idempotent upsert", "external-ID key, no duplicate orders"],
            ["Salesforce order", "created in seconds"],
          ].map(([t, d], i) => (
            <div className="ui-step" key={t} style={{ "--i": i } as React.CSSProperties}>
              <span className="ui-node">
                <b>{t}</b>
                <small>{d}</small>
              </span>
              {i < 3 && <span className="ui-arrow" />}
            </div>
          ))}
          <span className="ui-pill ui-ack">3 pipelines</span>
        </div>
      )}
      {kind === "dupes" && (
        <div className="ui-table">
          <div className="ui-tr ui-th">
            <span>Record set</span>
            <span>Scored</span>
            <span>Result</span>
          </div>
          <div className="ui-tr">
            <span>Contacts</span>
            <span>~198,000</span>
            <span>one rule set</span>
          </div>
          <div className="ui-tr">
            <span>Companies</span>
            <span>~64,000</span>
            <span>one rule set</span>
          </div>
          <div className="ui-tr is-dupe">
            <span>Duplicate groups</span>
            <span>1,289</span>
            <span>fixed at source</span>
          </div>
          <div className="ui-tr">
            <span>Field mirror</span>
            <span>2-way</span>
            <span>last human edit wins</span>
          </div>
        </div>
      )}
      {kind === "migration" && (
        <div className="ui-mig">
          <div className="ui-stack">
            <span className="ui-pill">Salesforce</span>
            <span className="ui-line"><b>40,547</b><small>contacts created</small></span>
            <span className="ui-line"><b>21,097</b><small>opportunities moved</small></span>
            <span className="ui-line"><b>6,682</b><small>associations repaired</small></span>
          </div>
          <div className="ui-sync">
            <span className="ui-arrow" />
            <small>Bulk API 2.0</small>
            <span className="ui-arrow back" />
          </div>
          <div className="ui-stack">
            <span className="ui-pill">HubSpot</span>
            <span className="ui-line"><b>0</b><small>failures</small></span>
            <span className="ui-line"><b>0</b><small>duplicates</small></span>
            <span className="ui-line"><b>250,000+</b><small>records reconciled</small></span>
          </div>
        </div>
      )}
      {kind === "sso" && (
        <div className="ui-sso">
          <div className="ui-row">
            <div className="ui-lock">
              <span />
            </div>
            <span className="ui-txt">Entra ID OIDC / PKCE · signed JWT session · server-side access list</span>
          </div>
          <div className="ui-grid">
            {["Directory", "Dashboards", "Reports", "CRM cards", "Admin tools", "Runbooks"].map((a, i) => (
              <span className="ui-app" key={a} style={{ "--i": i } as React.CSSProperties}>
                {a}
              </span>
            ))}
          </div>
          <span className="ui-foot">60+ tools in production · 37 catalogued in one directory</span>
        </div>
      )}
      {kind === "report" && (
        <div className="ui-report">
          <div className="ui-kpis">
            {[
              ["24,000", "rows per week, before"],
              ["1", "live dashboard, after"],
              ["253 / 253", "values validated"],
            ].map(([n, l]) => (
              <span className="ui-kpi" key={l}>
                <b>{n}</b>
                <span>{l}</span>
              </span>
            ))}
          </div>
          <div className="ui-chart">
            {[40, 70, 55, 90, 65, 80, 50, 95].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
          <span className="ui-foot">Delegate performance, weekly</span>
        </div>
      )}
      {kind === "triage" && (
        <div className="ui-triage">
          <div className="ui-msg">
            <b>Rep</b>
            <span>Which deals in my pipeline need attention this week?</span>
          </div>
          <div className="ui-topics">
            {["Topic", "Apex invocable action", "Test utterance"].map((t) => (
              <span className="ui-pill" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="ui-msg right">
            <b>Agentforce triage agent</b>
            <span>Designed and specified. Not yet deployed.</span>
          </div>
        </div>
      )}
      <style>{`
        .ui{position:absolute;inset:0;padding:30px 20px 18px;display:flex;flex-direction:column;gap:10px;color:var(--ink);font-family:var(--font-mono);font-size:10.5px;line-height:1.3}
        .ui-txt{color:var(--ink-2);font-size:10px}
        .ui-pill{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:var(--ink);color:#fff;font-size:9px;letter-spacing:.06em;white-space:nowrap}
        .ui-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .ui-card{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:10px;background:#fff;border-radius:10px;padding:9px 10px;box-shadow:var(--shadow-hair);animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*120ms)}
        .ui-dot{width:9px;height:9px;border-radius:50%;background:var(--ink)}
        .ui-k{font-weight:700}
        .ui-v{color:var(--mute);text-align:right}
        .ui-tick{font-size:11px}
        .ui-chat{margin-top:auto;background:#fff;border-radius:12px 12px 12px 2px;padding:10px 12px;display:grid;gap:4px;box-shadow:var(--shadow-hair)}
        .ui-chat span{color:var(--ink-2)}
        .ui-flow{display:flex;flex-direction:column;gap:6px;justify-content:center;height:100%;position:relative}
        .ui-step{display:flex;flex-direction:column;align-items:flex-start;gap:4px;animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*140ms)}
        .ui-node{background:#fff;border-radius:8px;padding:6px 12px;box-shadow:var(--shadow-hair);display:grid;gap:2px}
        .ui-node small{color:var(--mute);font-size:9px}
        .ui-arrow{display:block;width:1px;height:10px;background:var(--ink);margin-left:16px;position:relative}
        .ui-arrow::after{content:"";position:absolute;bottom:-1px;left:-3px;border:3.5px solid transparent;border-top-color:var(--ink)}
        .ui-ack{position:absolute;right:0;top:0}
        .ui-table{display:grid;gap:5px;height:100%;align-content:center}
        .ui-tr{display:grid;grid-template-columns:1.2fr .9fr 1.2fr;gap:8px;align-items:center;background:#fff;border-radius:8px;padding:7px 10px;box-shadow:var(--shadow-hair)}
        .ui-tr span:nth-child(2){font-weight:700;text-align:right}
        .ui-tr span:last-child{color:var(--mute);text-align:right;font-size:9.5px}
        .ui-th{background:transparent;box-shadow:none;color:var(--mute);font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding-top:0;padding-bottom:0}
        .ui-th span{font-weight:400!important;color:var(--mute)!important}
        .ui-tr.is-dupe{background:var(--ink);color:#fff}
        .ui-tr.is-dupe span{color:#fff!important}
        .ui-mig{display:grid;grid-template-columns:1fr 44px 1fr;gap:6px;height:100%;align-items:center}
        .ui-stack{display:grid;gap:7px;background:#fff;border-radius:10px;padding:10px;box-shadow:var(--shadow-hair);min-width:0}
        .ui-stack .ui-pill{justify-self:start}
        .ui-line{display:grid;gap:1px;min-width:0}
        .ui-line b{color:var(--ink);font-size:12px}
        .ui-line small{color:var(--mute);font-size:8.5px;line-height:1.2}
        .ui-sync{display:flex;flex-direction:column;align-items:center;gap:6px}
        .ui-sync small{font-size:8px;color:var(--mute);text-align:center}
        .ui-sync .ui-arrow{height:1px;width:28px;margin:0}
        .ui-sync .ui-arrow::after{bottom:-3px;left:auto;right:-2px;border:3.5px solid transparent;border-left-color:var(--ink)}
        .ui-sync .ui-arrow.back::after{right:auto;left:-2px;border-left-color:transparent;border-right-color:var(--ink)}
        .ui-sso{display:flex;flex-direction:column;gap:12px;justify-content:center;height:100%}
        .ui-sso .ui-row{flex-wrap:nowrap}
        .ui-lock{flex:none;width:26px;height:21px;border-radius:5px;background:var(--ink);position:relative;margin-top:8px}
        .ui-lock::before{content:"";position:absolute;left:6px;right:6px;top:-9px;height:12px;border:2.5px solid var(--ink);border-bottom:0;border-radius:8px 8px 0 0}
        .ui-lock span{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#fff;transform:translate(-50%,-50%)}
        .ui-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .ui-app{height:40px;border-radius:10px;background:#fff;box-shadow:var(--shadow-hair);display:grid;place-items:center;font-weight:700;font-size:9.5px;animation:ui-in .8s var(--ease) both;animation-delay:calc(.4s + var(--i)*60ms)}
        .ui-foot{color:var(--mute);font-size:9px}
        .ui-report{display:flex;flex-direction:column;gap:10px;height:100%}
        .ui-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .ui-kpi{background:#fff;border-radius:10px;padding:9px 10px;display:grid;gap:4px;box-shadow:var(--shadow-hair);min-width:0}
        .ui-kpi b{font-size:15px;letter-spacing:-.04em;white-space:nowrap}
        .ui-kpi span{color:var(--mute);font-size:9px}
        .ui-chart{flex:1;display:flex;align-items:flex-end;gap:6px;background:#fff;border-radius:10px;padding:12px;box-shadow:var(--shadow-hair);min-height:60px}
        .ui-chart span{flex:1;background:var(--ink);border-radius:3px 3px 0 0;transform-origin:bottom;animation:ui-grow .9s var(--ease) both;animation-delay:calc(.5s + var(--i)*60ms)}
        .ui-triage{display:flex;flex-direction:column;gap:12px;justify-content:center;height:100%}
        .ui-msg{background:#fff;border-radius:12px 12px 12px 2px;padding:10px 12px;display:grid;gap:3px;box-shadow:var(--shadow-hair);width:84%}
        .ui-msg b{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .ui-msg.right{align-self:flex-end;border-radius:12px 12px 2px 12px;background:var(--ink);color:#fff}
        .ui-msg.right b{color:rgba(255,255,255,.7)}
        .ui-topics{display:flex;gap:6px;flex-wrap:wrap}
        @keyframes ui-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes ui-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
      `}</style>
    </div>
  );
}
