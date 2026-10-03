import { MENU } from "@/lib/content";
import Reveal from "../Reveal";

/**
 * Section 7b. The carte. Server-rendered typographic index: four groups on
 * a two-column grid, hairline rows, prices set in the serif. The only client
 * code is the scroll-scrubbed stagger wrapper.
 */
export default function Menu() {
  return (
    <section id="menu" className="mn" aria-labelledby="mn-title">
      <div className="wrap">
        <header className="mn-head grid-12">
          <div className="mn-eyebrow">
            <span className="index">{MENU.index}</span>
            <span className="eyebrow">{MENU.eyebrow}</span>
          </div>
          <h2 id="mn-title" className="h2 mn-title">
            {MENU.title}
          </h2>
        </header>
        <div className="mn-groups">
          {MENU.groups.map((g) => (
            <Reveal key={g.title} as="section" className="mn-group">
              <h3 className="mn-group-title" data-rv>
                <span>{g.title}</span>
                {g.note && <small>{g.note}</small>}
              </h3>
              <ul className="mn-list" role="list">
                {g.items.map((it) => (
                  <li key={it.name} className="mn-row" data-rv data-cursor="Taste">
                    <div className="mn-row-main">
                      <span className="mn-name">
                        <span className="u">{it.name}</span>
                        {it.tag && <em className="mn-tag">{it.tag}</em>}
                      </span>
                      <span className="mn-price" aria-label={`${it.price} pounds`}>
                        <span className="mn-cur">£</span>
                        {it.price}
                      </span>
                    </div>
                    <p className="mn-desc">{it.desc}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        .mn{position:relative;padding-block:var(--section-y);background:var(--canvas)}
        .mn-head{row-gap:18px;margin-bottom:clamp(48px,8vh,96px)}
        .mn-eyebrow{grid-column:1 / -1;display:flex;gap:18px;align-items:baseline}
        .mn-title{grid-column:1 / span 9;max-width:18ch}
        .mn-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(40px,6vw,120px);row-gap:clamp(56px,8vh,96px)}
        .mn-group{display:grid;gap:22px;align-content:start}
        .mn-group-title{display:flex;align-items:baseline;gap:16px;font-size:clamp(22px,2vw,30px);padding-bottom:14px;border-bottom:1px solid var(--ink)}
        .mn-group-title small{font-family:var(--font-sans);font-size:13px;color:var(--mute);font-weight:400}
        .mn-list{list-style:none;margin:0;padding:0}
        .mn-row{padding:18px 0;border-bottom:1px solid var(--line-soft);display:grid;gap:6px;transition:padding-left .5s var(--ease-out)}
        .mn-row:hover{padding-left:6px}
        .mn-row-main{display:flex;justify-content:space-between;align-items:baseline;gap:18px}
        .mn-name{font-size:clamp(17px,1.2vw,20px);font-weight:500;display:inline-flex;gap:12px;align-items:baseline}
        .mn-row:hover .u::after{transform:scaleX(1)}
        .mn-tag{font-style:italic;font-family:var(--font-serif);font-weight:400;color:var(--turmeric);font-size:15px}
        .mn-price{font-family:var(--font-serif);font-size:20px;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}
        .mn-cur{font-size:13px;color:var(--mute);margin-right:2px;vertical-align:top}
        .mn-desc{color:var(--mute);font-size:15px;max-width:48ch}
        @media (max-width:900px){.mn-groups{grid-template-columns:1fr}.mn-title{grid-column:1 / -1}}
      `}</style>
    </section>
  );
}
