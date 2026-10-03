"use client";

import { useMemo, useState } from "react";
import { PROJECTS, SKILL_GROUPS, type Skill } from "@/lib/data";
import TechLogo, { isBrand, logoName } from "@/components/ui/TechLogo";
import { useInView } from "@/lib/hooks";

type Element = Skill & { number: number; family: string };

const ELEMENTS: Element[] = SKILL_GROUPS.flatMap((g) =>
  g.skills.map((s) => ({ ...s, family: g.family, number: 0 })),
).map((e, i) => ({ ...e, number: i + 1 }));

const FAMILIES = SKILL_GROUPS.map((g) => g.family);
const COLS_DESKTOP = 8;
const FAMILY_COLOR: Record<string, string> = {
  Salesforce: "#00A1E0",
  HubSpot: "#FF7A59",
  "AI & automation": "#7c3aed",
  Engineering: "#16a34a",
  "Integration & data": "#f59e0b",
};
const fc = (f: string) => FAMILY_COLOR[f] ?? "#5b4bff";

export default function Skills() {
  const [filter, setFilter] = useState<string | null>(null);
  const [current, setCurrent] = useState<Element>(ELEMENTS[0]);
  const { ref, inView } = useInView<HTMLUListElement>({ threshold: 0.1 });

  const projectsFor = useMemo(
    () => PROJECTS.filter((p) => current.projects.includes(p.id)),
    [current],
  );

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-h">
      <div className="wrap">
        <p className="tag rv">
          02 <span>/ Skills</span>
        </p>
        <h2 id="skills-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
          The periodic table of <em>my stack.</em>
        </h2>

        <div className="fchips rv" role="group" aria-label="Filter skills by family" style={{ "--i": 2 } as React.CSSProperties}>
          <button className={`fchip ${filter === null ? "is-on" : ""}`} onClick={() => setFilter(null)} aria-pressed={filter === null}>
            All <span className="mono">{ELEMENTS.length}</span>
          </button>
          {FAMILIES.map((f) => (
            <button key={f} className={`fchip ${filter === f ? "is-on" : ""}`} style={{ "--fc": fc(f) } as React.CSSProperties} onClick={() => setFilter(filter === f ? null : f)} aria-pressed={filter === f}>
              <span className="sw" aria-hidden="true" />
              {f}
            </button>
          ))}
        </div>

        <div className="layout">
          <ul className={`grid ${inView ? "is-in" : ""}`} ref={ref}>
            {ELEMENTS.map((el, i) => {
              const row = Math.floor(i / COLS_DESKTOP);
              const col = i % COLS_DESKTOP;
              const dim = filter !== null && el.family !== filter;
              return (
                <li key={el.name}>
                <button
                  className={`el ${dim ? "is-dim" : ""} ${current.name === el.name ? "is-current" : ""}`}
                  style={{ "--d": `${(row + col) * 40}ms`, "--fc": fc(el.family) } as React.CSSProperties}
                  onMouseEnter={() => setCurrent(el)}
                  onFocus={() => setCurrent(el)}
                  onClick={() => setCurrent(el)}
                  aria-label={`${el.name}, ${el.family}`}
                >
                  <span className="el-num mono">{el.number}</span>
                  <span className="sym">{el.symbol}</span>
                  <span className="nm">{el.name}</span>
                </button>
                </li>
              );
            })}
          </ul>

          <aside className="inspector card is-active" aria-live="polite">
            <div className="logo-box" key={current.name}>
              <TechLogo name={current.logo} size={150} glow={isBrand(current.logo)} />
            </div>
            <p className="mono fam" style={{ color: fc(current.family) }}>
              {String(current.number).padStart(2, "0")} · {current.family}
            </p>
            <h3 className="ins-name">{current.name}</h3>
            {!isBrand(current.logo) || logoName(current.logo) !== current.name ? (
              <p className="via mono">{isBrand(current.logo) ? `on ${logoName(current.logo)}` : "concept"}</p>
            ) : null}
            <div className="uses">
              <p className="mono uses-h">Used in</p>
              {projectsFor.length ? (
                <ul>
                  {projectsFor.map((p) => (
                    <li key={p.id}>
                      <span className="mono">{p.index}</span> {p.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="none">Platform work across the CRM org.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .fchips{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}
        .fchip{height:36px;padding:0 14px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:8px;transition:background .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease)}
        .fchip .mono{font-size:11px;color:var(--mute)}
        .fchip .sw{width:10px;height:10px;border-radius:50%;background:var(--fc,var(--accent))}
        .fchip:hover{box-shadow:inset 0 0 0 1.5px var(--fc,var(--accent))}
        .fchip.is-on{background:var(--fc,var(--accent));color:#fff;box-shadow:inset 0 0 0 1px var(--fc,var(--accent))}
        .fchip.is-on .sw{background:#fff}
        .fchip.is-on .mono{color:rgba(255,255,255,.7)}
        .layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;margin-top:36px;align-items:start}
        .grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
        .grid li{display:contents}
        .el{width:100%}
        .el{position:relative;aspect-ratio:1;border-radius:14px;background:var(--card);box-shadow:var(--shadow-hair),inset 0 3px 0 var(--fc);padding:9px 10px;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;text-align:left;opacity:0;transform:translateY(16px) scale(.96);transition:opacity .7s var(--ease) var(--d),transform .7s var(--ease) var(--d),box-shadow .4s var(--ease),filter .4s var(--ease),background .4s var(--ease),color .4s var(--ease)}
        .grid.is-in .el{opacity:1;transform:none}
        .grid.is-in .el.is-dim{opacity:.25;filter:grayscale(1)}
        .el:hover,.el.is-current{background:var(--fc);color:#fff;box-shadow:0 18px 36px -18px var(--fc)}
        .el:hover .el-num,.el.is-current .el-num,.el:hover .nm,.el.is-current .nm{color:rgba(255,255,255,.7)}
        .el-num{position:absolute;top:10px;left:10px;font-size:10px;color:var(--fc);font-weight:700}
        .sym{font-size:clamp(20px,2.4vw,30px);font-weight:700;letter-spacing:-.04em;line-height:1}
        .nm{font-size:10px;color:var(--mute);line-height:1.2;margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .inspector{position:sticky;top:96px;padding:28px 26px;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:460px}
        .logo-box{width:150px;height:150px;display:grid;place-items:center;animation:pop .7s var(--ease)}
        .fam{margin-top:18px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700}
        .ins-name{font-size:22px;margin-top:6px;letter-spacing:-.03em}
        .via{font-size:11px;color:var(--mute);margin-top:4px}
        .uses{margin-top:22px;width:100%;text-align:left;border-top:1px solid var(--line);padding-top:16px}
        .uses-h{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
        .uses ul{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px}
        .uses li{font-size:13px;line-height:1.3;display:flex;gap:10px}
        .uses li .mono{color:var(--accent);font-size:11px;padding-top:2px;font-weight:700}
        .none{font-size:13px;color:var(--mute);margin-top:10px}
        @keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @media (max-width: 1000px){.layout{grid-template-columns:1fr}.inspector{position:relative;top:0;min-height:0}}
        @media (max-width: 700px){.grid{grid-template-columns:repeat(4,minmax(0,1fr))}.sym{font-size:22px}}
      `}</style>
    </section>
  );
}
