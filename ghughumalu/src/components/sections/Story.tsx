"use client";

import { IMAGE_ALT, MEDIA, STORY } from "@/lib/content";
import MaskImage from "../MaskImage";
import SplitText from "../SplitText";

/**
 * Section 2. Split editorial layout. Image 1 opens through a bottom-up mask
 * with soft parallax; the title's words rise inside masked lines; the body
 * reveals line by line as the reader reaches it.
 */
export default function Story() {
  return (
    <section id="story" className="story" aria-labelledby="story-title">
      <div className="wrap grid-12 story-grid">
        <figure className="story-fig">
          <MaskImage src={MEDIA.image(1)} alt={IMAGE_ALT[1]} from="bottom" ratio="4 / 5" parallax={26} cursor="View" priority />
          <figcaption className="story-cap">{STORY.caption}</figcaption>
        </figure>
        <div className="story-copy">
          <div className="story-head">
            <span className="index">{STORY.index}</span>
            <span className="eyebrow">{STORY.eyebrow}</span>
          </div>
          <h2 id="story-title" className="h2 story-title">
            <SplitText text={STORY.title} as="span" by="words" start="top 82%" end="top 38%" />
          </h2>
          <div className="story-body">
            {STORY.paragraphs.map((p) => (
              <SplitText key={p} text={p} as="p" by="lines" className="body-copy" start="top 90%" end="top 60%" />
            ))}
          </div>
          <p className="story-quote italic">
            <SplitText text={STORY.quote} as="span" by="words" start="top 92%" end="top 70%" />
          </p>
        </div>
      </div>
      <style>{`
        .story{padding-block:var(--section-y);position:relative;z-index:1;background:var(--canvas)}
        .story-grid{align-items:start}
        .story-fig{grid-column:1 / span 5;margin:0;position:sticky;top:clamp(80px,12vh,140px)}
        .story-cap{margin-top:14px;font-size:13px;color:var(--mute)}
        .story-copy{grid-column:7 / span 6;display:grid;gap:clamp(32px,4vw,56px);padding-top:clamp(0px,4vh,48px)}
        .story-head{display:flex;gap:18px;align-items:baseline}
        .story-title{max-width:18ch}
        .story-body{display:grid;gap:clamp(20px,2vw,28px);max-width:52ch}
        .story-quote{font-family:var(--font-serif);font-size:clamp(30px,3.2vw,52px);line-height:1.05;letter-spacing:-.02em;max-width:14ch;color:var(--ink)}
        @media (max-width:900px){
          .story-fig{grid-column:1 / -1;position:relative;top:auto;margin-bottom:40px}
          .story-copy{grid-column:1 / -1}
        }
      `}</style>
    </section>
  );
}
