# Ghughumalu

An editorial, scroll-driven dining experience. Warm off-white canvas (#FAFAF8), warm charcoal type (#2B2320), Fraunces for headings, Inter for body. Six Google Flow films are scrubbed by scroll; four stills open through masks. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, Framer Motion, Three.js via React Three Fiber, SplitType and react-intersection-observer. Fonts are self-hosted through `next/font/local`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-check + lint)
npm run start
npm run lint
```

Static export for a sub-path host (this is what the portfolio's GitHub Pages workflow does):

```bash
STATIC_EXPORT=1 BASE_PATH=/Arun-Portfolio/ghughumalu npm run build   # writes ./out
```

## Assets

Put the Flow renders in `public/media/` as `video-1.mp4` to `video-6.mp4` and `image-1.webp` to `image-4.webp`. `public/media/README.md` says which film goes where and repeats the prompts. Run `scripts/optimize-media.sh <folder>` first: it re-encodes each film with a keyframe on every frame, which is what makes `currentTime` scrubbing smooth. The site degrades to the poster image where a film is missing, and to a labelled plate where a still is missing.

## How it moves

| | Section | File | Motion |
|---|---|---|---|
| — | Loader | `components/Loader.tsx` | Wordmark letters rise, counter tracks the hero poster and film metadata, 2D spice particles, then the panel lifts like a page to reveal the hero. Skipped for the rest of the session and under reduced motion. |
| 1 | Hero | `sections/Hero.tsx` | 340vh track, sticky viewport. Film 1 scrubbed across the whole track. Headline letters enter after the loader; copy rises at a third of scroll speed and fades before the film ends. Pointer nudges copy and film in opposite directions. WebGL dust, herbs and steam behind. |
| 2 | Story | `sections/Story.tsx` | Image 1 opens through a bottom mask with parallax; title words rise inside masked lines; body reveals line by line, all scrubbed. |
| 3 | Anatomy | `sections/Exploded.tsx` | Film 2 scrubbed in a locked frame; five labels, each with its own scroll window, a dot, a connector that draws out and a caption. Index strip with the same windows on small screens. |
| 4 | Pantry | `sections/Ingredients.tsx` | Film 3 scrubbed as background; a second WebGL field with depth of field and pointer parallax; eight nodes on a hairline that draws itself; hover or focus turns a node and opens an editorial card. |
| 5 | Craft | `sections/Craft.tsx` | Film 4 scrubbed beside four steps that cross-fade in place, a four-tick progress bar, and a still that unmasks mid-timeline. Flows naturally on small screens with a sticky film. |
| 6 | Chutneys | `sections/Sauces.tsx` | Film 5 full-bleed; three cards drift at different speeds with the pour, tilt toward the pointer and lift. Snap strip on touch. |
| 7 | The room | `sections/Dining.tsx` | Film 6 scrubbed behind two huge lines of type; then three overlapping stills on a 12-column grid at different speeds against a slow background word. |
| 7b | Menu | `sections/Menu.tsx` | Server-rendered typographic carte; the only client code is a scrubbed stagger wrapper. |
| 8 | Reserve | `sections/Reserve.tsx` | Whitespace, underline fields, magnetic submit. No booking backend yet: the request shows the confirmation copy in place. |

Shared pieces: `ScrubVideo` (currentTime mapped to scroll on GSAP's ticker, attached only near the viewport, paused off-screen, poster fallback), `MaskImage`, `SplitText`, `Magnetic`, `Cursor`, `three/Particles`. Lenis and GSAP share one requestAnimationFrame (`components/Experience.tsx`).

Reduced motion: no smooth scroll, no loader, films replaced by their posters, every pinned stage flows as a normal section, all text visible. Custom cursor only for fine pointers.

Copy, menu, prices, address and hours live in `src/lib/content.ts`.

## QA

`node scripts/qa.mjs` screenshots every section at desktop and phone widths against `http://localhost:3100` and reports overflow and console errors (Playwright; the bundled Chromium plays VP9, not H.264, so test with VP9 files locally).
