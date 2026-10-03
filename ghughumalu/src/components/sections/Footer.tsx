import { NAV, SITE } from "@/lib/content";

/** Server component. Address, hours, links. The arrow icons spring on hover with a single CSS transition. */
export default function Footer() {
  return (
    <footer className="ft" aria-label="Footer">
      <div className="wrap grid-12 ft-grid">
        <div className="ft-brand">
          <span className="ft-mark">{SITE.name}</span>
          <p className="ft-tag">{SITE.tagline}</p>
        </div>
        <div className="ft-col">
          <span className="eyebrow">Find us</span>
          <address className="ft-addr">
            {SITE.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="u">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="u">
            {SITE.email}
          </a>
        </div>
        <div className="ft-col">
          <span className="eyebrow">Hours</span>
          <dl className="ft-hours">
            {SITE.hours.map((h) => (
              <div key={h.days}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="ft-col">
          <span className="eyebrow">Elsewhere</span>
          {[...NAV, ...SITE.social].map((l) => (
            <a key={l.label} href={l.href} className="ft-link" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span className="u">{l.label}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
        <p className="ft-foot">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span>{SITE.city}</span>
        </p>
      </div>
      <style>{`
        .ft{padding:clamp(56px,8vh,96px) 0 32px;border-top:1px solid var(--line-soft);background:var(--canvas);position:relative;z-index:1}
        .ft-grid{row-gap:48px}
        .ft-brand{grid-column:1 / span 5;display:grid;gap:14px;align-content:start}
        .ft-mark{font-family:var(--font-serif);font-size:clamp(34px,4vw,56px);letter-spacing:-.03em;line-height:1;font-variation-settings:"opsz" 144,"SOFT" 40}
        .ft-tag{color:var(--mute);max-width:30ch;font-size:15px}
        .ft-col{grid-column:span 2;display:grid;gap:12px;align-content:start;font-size:15px}
        .ft-col > .eyebrow{margin-bottom:6px}
        .ft-addr{font-style:normal;display:grid}
        .ft-hours{margin:0;display:grid;gap:8px}
        .ft-hours div{display:grid;gap:2px}
        .ft-hours dt{color:var(--mute);font-size:13px}
        .ft-hours dd{margin:0}
        .ft-link{display:inline-flex;align-items:center;gap:8px;width:max-content}
        .ft-link svg{transition:transform .5s cubic-bezier(.34,1.56,.64,1);color:var(--mute)}
        .ft-link:hover svg{transform:translate(2px,-2px)}
        .ft-foot{grid-column:1 / -1;display:flex;justify-content:space-between;padding-top:32px;border-top:1px solid var(--line-soft);font-size:13px;color:var(--mute)}
        @media (max-width:900px){.ft-brand{grid-column:1 / -1}.ft-col{grid-column:span 6}}
        @media (max-width:520px){.ft-col{grid-column:1 / -1}}
      `}</style>
    </footer>
  );
}
