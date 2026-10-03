"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RESERVE } from "@/lib/content";
import Magnetic from "../Magnetic";
import SplitText from "../SplitText";
import { Arrow } from "./Hero";

/**
 * Section 8. Huge whitespace, a two-line title, a form with underline fields.
 * There is no booking backend yet; a submitted request shows the confirmation
 * copy in place. Wire `onSubmit` to a booking provider when one is chosen.
 */
export default function Reserve() {
  const [sent, setSent] = useState(false);
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);

  return (
    <section id="reserve" className="rs" aria-labelledby="rs-title">
      <div className="wrap grid-12 rs-grid">
        <div className="rs-head">
          <div className="rs-eyebrow">
            <span className="index">{RESERVE.index}</span>
            <span className="eyebrow">{RESERVE.eyebrow}</span>
          </div>
          <h2 id="rs-title" className="display rs-title">
            <SplitText text={RESERVE.title} as="span" by="chars" start="top 85%" end="top 35%" stagger={0.02} />
          </h2>
          <p className="lede rs-body">{RESERVE.body}</p>
        </div>

        <div className="rs-form-wrap">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.p key="ok" className="rs-ok" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                {RESERVE.success}
              </motion.p>
            ) : (
              <motion.form
                key="form"
                className="rs-form"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="field rs-span">
                  <label htmlFor="rs-name">{RESERVE.fields.name}</label>
                  <input id="rs-name" name="name" autoComplete="name" required placeholder="Asha Rao" />
                </div>
                <div className="field rs-span">
                  <label htmlFor="rs-email">{RESERVE.fields.email}</label>
                  <input id="rs-email" name="email" type="email" autoComplete="email" required placeholder="asha@example.com" />
                </div>
                <div className="field">
                  <label htmlFor="rs-date">{RESERVE.fields.date}</label>
                  <input id="rs-date" name="date" type="date" min={today || undefined} required />
                </div>
                <div className="field">
                  <label htmlFor="rs-time">{RESERVE.fields.time}</label>
                  <select id="rs-time" name="time" defaultValue="19:30">
                    {["12:00", "12:30", "13:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="rs-guests">{RESERVE.fields.guests}</label>
                  <select id="rs-guests" name="guests" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value="9+">More than 8</option>
                  </select>
                </div>
                <div className="rs-submit rs-span">
                  <Magnetic>
                    <button type="submit" className="btn btn-ink">
                      <span>{RESERVE.submit}</span>
                      <span className="ic" aria-hidden="true">
                        <Arrow />
                      </span>
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          <ul className="rs-aside" role="list">
            {RESERVE.aside.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        .rs{position:relative;padding-block:calc(var(--section-y) * 1.4) var(--section-y);background:var(--canvas)}
        .rs-grid{row-gap:clamp(56px,10vh,120px);align-items:start}
        .rs-head{grid-column:1 / span 7;display:grid;gap:28px}
        .rs-eyebrow{display:flex;gap:18px;align-items:baseline}
        .rs-title{font-size:clamp(56px,9vw,160px)}
        .rs-body{max-width:40ch}
        .rs-form-wrap{grid-column:8 / span 5;display:grid;gap:40px;padding-top:clamp(0px,6vh,80px)}
        .rs-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 24px}
        .rs-span{grid-column:1 / -1}
        .rs-submit{padding-top:12px}
        .rs-ok{font-family:var(--font-serif);font-size:clamp(26px,2.4vw,36px);line-height:1.15;letter-spacing:-.02em;font-variation-settings:"opsz" 144,"SOFT" 80}
        .rs-aside{list-style:none;margin:0;padding:0;display:grid;gap:8px;font-size:13px;color:var(--mute)}
        .rs-aside li{padding-left:16px;position:relative}
        .rs-aside li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:1px;background:var(--faint)}
        @media (max-width:900px){.rs-head,.rs-form-wrap{grid-column:1 / -1}.rs-form{grid-template-columns:1fr 1fr}.rs-title{font-size:clamp(52px,14vw,110px)}}
        @media (max-width:520px){.rs-form{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
