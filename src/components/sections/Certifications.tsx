import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="section certs hairline-y" aria-labelledby="certs-h">
      <div className="wrap certs-grid">
        <div className="sticky">
          <p className="tag rv">
            04 <span>/ Certifications</span>
          </p>
          <h2 id="certs-h" className="h2 rv" style={{ "--i": 1 } as React.CSSProperties}>
            Always <em>learning.</em>
          </h2>
          <p className="count mono rv" style={{ "--i": 2 } as React.CSSProperties}>
            {String(CERTIFICATIONS.length).padStart(2, "0")} certifications · Salesforce
          </p>
        </div>

        <ol className="list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="cert-row rv" style={{ "--i": i } as React.CSSProperties}>
              <a href="#certifications" className="cert-row-link" onClick={(e) => e.preventDefault()} tabIndex={0}>
                <span className="cert-idx mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="title">{c.title}</span>
                <span className="issuer mono">
                  {c.issuer}
                  {c.year ? ` · ${c.year}` : ""}
                </span>
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .certs{background:var(--card);padding-block:clamp(72px,10vh,120px)}
        .certs-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:clamp(28px,5vw,80px);align-items:start}
        .sticky{position:sticky;top:110px}
        .count{margin-top:22px;font-size:12px;color:var(--mute);letter-spacing:.06em}
        .list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .cert-row{border-bottom:1px solid var(--line)}
        .cert-row-link{position:relative;display:grid;grid-template-columns:44px 1fr auto 28px;align-items:center;gap:18px;padding:26px 12px;overflow:hidden;isolation:isolate;color:var(--ink);transition:color .5s var(--ease)}
        .cert-row-link::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .7s var(--ease);z-index:-1}
        .cert-row-link:hover::before,.cert-row-link:focus-visible::before{transform:scaleX(1)}
        .cert-row-link:hover,.cert-row-link:focus-visible{color:#fff}
        .cert-row-link:focus-visible{outline-offset:-2px}
        .cert-idx{font-size:12px;color:var(--mute);transition:color .5s}
        .cert-row-link:hover .cert-idx,.cert-row-link:focus-visible .cert-idx,.cert-row-link:hover .issuer,.cert-row-link:focus-visible .issuer{color:rgba(255,255,255,.7)}
        .title{font-size:clamp(18px,2vw,26px);font-weight:600;letter-spacing:-.03em;line-height:1.15}
        .issuer{font-size:12px;color:var(--mute);white-space:nowrap}
        .arrow{opacity:0;transform:translate(-8px,8px);transition:opacity .5s var(--ease),transform .5s var(--ease);font-size:18px}
        .cert-row-link:hover .arrow,.cert-row-link:focus-visible .arrow{opacity:1;transform:none}
        @media (max-width: 900px){.certs-grid{grid-template-columns:1fr}.sticky{position:relative;top:0}.cert-row-link{grid-template-columns:36px 1fr 24px;gap:12px;padding:20px 8px}.issuer{grid-column:2;grid-row:2;white-space:normal}}
      `}</style>
    </section>
  );
}
