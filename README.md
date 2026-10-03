# Arun Bondalapati — portfolio

A single-page, "talking-video" personal portfolio. An indigo, coral, teal, amber and pink palette on warm paper; one continuous scroll; every section its own component with its own animation. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis. No three.js, no GSAP, no external scripts at runtime, self-hosted fonts.

Every word on the site comes from the resume in `public/Arun-Bondalapati-CV.pdf`, transcribed into `src/lib/data.ts`. Components only read from that file.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-check + lint)
npm run start      # serve the production build
npm run lint
```

Requires Node 20+.

## Sections

| # | Section | Component | Animation |
|---|---------|-----------|-----------|
| — | Hero | `components/hero/Hero.tsx` | Looping intro video (or still) multiplied into the paper; sound unlock; pauses when <35 % visible |
| 01 | About | `sections/About.tsx` + `ui/IDCard.tsx` | Lanyard ID card with damped pendulum swing, idle sway and 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | Periodic table of every resume skill; diagonal wave reveal; family filters; sticky inspector with brand logo |
| 03 | Work | `sections/Work.tsx` | Expanding accordion gallery; grayscale illustrative mini-UIs with clip-path wipe; vertical accordion on mobile |
| 04 | Certifications | `sections/Certifications.tsx` | Ink-flood index rows on a white band |
| 05 | Experience | `sections/Experience.tsx` | Education + experience on one timeline; spine draws with scroll progress |
| 06 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery; count-up numbers (easeOutQuart, 1.4 s); nearest card lifts |
| 07 | Contact | `sections/Contact.tsx` | Letter-hop heading, copy-email chip (aria-live), spinning "say hello" badge, footer |

Navigation: round initials mark (outline → solid after 40 px, spins on hover), frosted pill with a sliding ink indicator (IntersectionObserver, `rootMargin: -45% 0px -50% 0px`), 2 px scroll-progress bar, full-screen clip-path menu on mobile (Esc closes, scroll locked).

## The hero video

The hero plays `public/hero/hero.webm` / `hero.mp4` when they exist. They are produced from an intro video by `scripts/build-hero-assets.py` (ffmpeg + numpy). Until then the hero shows `public/hero/hero-still.webp`, produced from a photo by the same script, and the ▶/❚❚ sound button is not rendered.

```bash
pip install numpy pillow            # plus: pip install "rembg[cpu]" for clean photo cut-outs
python scripts/build-hero-assets.py --video intro.mp4              # auto-detects the crop
python scripts/build-hero-assets.py --video intro.mp4 --crop 800:1000:560:80 --seconds 10
python scripts/build-hero-assets.py --photo me.jpg                 # hero still + ID-card portrait + OG image
```

What the video pipeline does:

1. Crops tightly around the person (auto-detected from the whitened background, or `--crop W:H:X:Y`), centred, and scales to 768 px wide.
2. Whitens the backdrop with `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98` so it disappears into the page under `mix-blend-mode: multiply`.
3. Takes the first ~10 s and cross-fades the last 0.5 s into the first 0.5 s: `xfade` for the picture, a sample-accurate linear cross-fade in numpy for the audio. Nothing is retimed, so lips stay in sync and the loop has no visible jump or audible click.
4. Exports `hero.mp4` (H.264 yuv420p, CRF 24, slow, AAC 96 kbps, faststart) and `hero.webm` (VP9 CRF 36, Opus 80 kbps). The `<video>` lists webm first.
5. Exports `portrait-bust.webp` (480×600, head-to-shirt) and `og.jpg` (1200×630).

Then `npm run build` again: `src/app/page.tsx` checks for `public/hero/hero.mp4` at build time and switches the hero to the video.

## Deploying

- **GitHub Pages**: `.github/workflows/deploy-pages.yml` builds a static export on every push to `main` and publishes it to `https://<owner>.github.io/<repo>/`. It enables Pages on first run; the Pages source must stay set to "GitHub Actions" in the repository settings.
- **Anywhere static**: `STATIC_EXPORT=1 npm run build` writes `./out`; add `BASE_PATH=/sub-path` when the site is not served from the domain root.
- **Vercel / Netlify**: import the repo; the default `npm run build` is a normal Next.js build.

## Folder structure

```
src/app/            layout.tsx (metadata, OG, fonts, themeColor), page.tsx, globals.css
src/components/     App.tsx, Navigation.tsx, hero/Hero.tsx, sections/*.tsx, ui/IDCard.tsx, ui/TechLogo.tsx
src/lib/            data.ts (all content), hooks.ts (useInView, useScrollProgress, prefersReducedMotion…), scroll.tsx (Lenis + scrollToTarget)
src/fonts/          Inter Tight (variable), Instrument Serif (regular + italic), JetBrains Mono (variable) — woff2
public/hero/        hero-still.webp (+ hero.mp4 / hero.webm when generated)
public/logos/       brand SVGs + licence files
public/             Arun-Bondalapati-CV.pdf, portrait-bust.webp, og.jpg, icon.svg
scripts/            build-hero-assets.py
```

## Credits and licences

- **Brand logos** in `public/logos/`:
  - Salesforce, Node.js, TypeScript, JavaScript, React, Vercel, GitHub — "original" SVGs from [devicon](https://github.com/devicons/devicon), MIT licence (`public/logos/LICENSE-devicon.txt`).
  - HubSpot, Zapier, Claude, Model Context Protocol, JSON Web Tokens — paths from [simple-icons](https://simpleicons.org), CC0 1.0 (`public/logos/LICENSE-simple-icons.md`), filled with each brand's official hex.
  - All trademarks belong to their owners. They are the only colour on the page; everything else is white, black and gray.
- Concept skills (APIs, LLM agents, data migration…) use custom thin-line icons in `src/components/ui/TechLogo.tsx`.
- **Fonts**: [Inter Tight](https://github.com/rsms/inter) and [Instrument Serif](https://github.com/Instrument/instrument-serif) (SIL Open Font License 1.1), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) (SIL OFL 1.1), self-hosted via `next/font/local`.
- Smooth scrolling: [Lenis](https://github.com/darkroomengineering/lenis), MIT.

## Quality checks

With `npm run build && npm run start` running on port 3000:

```bash
node scripts/qa/shots.mjs          # screenshots at 1440×900 and 390×844, horizontal-overflow and console-error check
node scripts/qa/interactions.mjs   # ID card flip (click / Enter / tap), skill filters, accordion, count-ups, copy chip, mobile menu
CHROME_PATH=$(which chromium) npx lighthouse http://localhost:3000 --preset=desktop
```

Last measured: Lighthouse Performance 100, Accessibility 100, Best Practices 100 (desktop preset); first-load JS 129 kB.

## Accessibility and motion

Semantic sections with a correct heading order, visible keyboard focus everywhere, text equivalents for every visual, and `prefers-reduced-motion` disables Lenis, reveals, the pendulum, the count-ups and all decorative animation.

## Ghughumalu

`ghughumalu/` is a separate Next.js project: an editorial, scroll-driven site for the Ghughumalu dining room. It has its own `package.json` and README, and the Pages workflow builds it under `/ghughumalu/` next to the portfolio.
