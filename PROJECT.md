# Project: GSAP.com Hero Recreation in React / Next.js

## Architecture
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Animation Engine**: GSAP 3.12.5 with `@gsap/react` 2.1.1 (`useGSAP` hook with container scope)
- **Component Architecture**:
  - `src/components/Hero.tsx`: Main Hero component orchestrating master GSAP timeline, responsive layout, mouse tracking, subtitle, and CTA button.
  - `src/components/GSAP_Hero/hero.css`: Exact original CSS styling, variables, flair positioning, and typography.
  - Inline SVG flairs & Particle defs matching `src/components/GSAP_Hero/hero.html`.
- **Styling & Assets**:
  - Dedicated hero stylesheet imported or integrated seamlessly with Tailwind CSS.
  - Local flair webp assets in `/public/flair-images/` and vector paths.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Master Timeline Orchestration | Sequences 15 character timelines at exact offsets `[0, 0.4, 0.8, 1.0, 1.1, 1.5, 1.7, 1.9, 2.0, 2.2, 2.4s]` | M2 | index.js / hero.html |
| 2 | Word "Animate" - Char 1 ('A') | 3D flip-in (`rotationX: -180`, `ease: "back.out(1.7)"`) | M2 | index.js |
| 3 | Word "Animate" - Char 2 ('n') | Rotating windmill fly-in, circles flair scaling/sweep, letter 'n' flip, ghost 'a' flip away | M2 | index.js / hero.html |
| 4 | Word "Animate" - Char 3 ('i') | Drop from top (`yPercent: -100`, `ease: "back.out(1.4)"`) | M2 | index.js |
| 5 | Word "Animate" - Char 4 ('m') | Slide from left (`xPercent: -100`), nested inside Char 5 | M2 | index.js |
| 6 | Word "Animate" - Char 5 ('a2') | Star flair scaling, horizontal translation, spinning `rotationZ: 360`, dropping downward through `overflow: hidden` | M2 | index.js / hero.html |
| 7 | Word "Animate" - Char 6 ('t') | Rolling odometer digits '1', '0', '0' vertical ticker roll settling on 't' | M2 | index.js / hero.html |
| 8 | Word "Animate" - Char 7 ('e') | Rise up (`yPercent: 100`), nested inside Char 6 | M2 | index.js |
| 9 | Word "anything" - Char 8 & 9 ('a' & 'n') | Vertical dual-span ticker rolls (`keyframes: [100, 0, 100, 0]` and `[-100, -100, 20, -100]`) | M2 | index.js |
| 10 | Word "anything" - Char 10 ('y') | 3D spin on `rotationY: -180` with `scale: 0` | M2 | index.js |
| 11 | Word "anything" - Char 11 ('t') | Lightning bolt drawing (`strokeDasharray`/`strokeDashoffset`) and scale bounce keyframes | M2 | index.js / flair_bolt.svg |
| 12 | Word "anything" - Char 12 ('h') | Worm/squiggle entrance (`yPercent: 100`, `rotationZ: 180`, `ease: "back.out(1.6)"`) | M2 | index.js |
| 13 | Word "anything" - Char 13 ('i') | Bottom 'i' with `rotationX: -450` entrance and infinite yoyo wobble loop (`rotationX: 540`, `repeatDelay: 3`) | M2 | index.js |
| 14 | Word "anything" - Char 14 ('n2') | Slide from left (`xPercent: -100`), nested inside Char 13 | M2 | index.js |
| 15 | Word "anything" - Char 15 ('g') | Elastic rotation entrance (`rotationZ: -120`, `ease: "elastic.out(1, 0.4)"`) | M2 | index.js |
| 16 | Interactive Mouse Squiggle Physics | `gsap.quickTo` on `xPercent`, `yPercent`, `rotation`, `mapRange`, `clamp`, window resize handling | M3 | index.js / index-e4482d9c.js |
| 17 | Subtitle with Animated Curly Braces | Vector SVG braces (`viewBox="0 0 27 78"`), mirrored right brace (`rotate(180deg)`), slide-in animation (`xPercent: 100`/`-100`), label fade-in | M3 | index-e4482d9c.js |
| 18 | Interactive "Get GSAP" CTA Button | Word split expansion, double arrow slide, 4 particle flairs (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`) burst with random offsets, `airtime`/`rotaaaaate` eases, hover re-randomization | M3 | index-e4482d9c.js |
| 19 | Complete CSS Styling Integration | Integration of `src/components/GSAP_Hero/hero.css` (`.home-hero`, `.heading-xl`, flairs, subtitle, CTA button, variables) | M1 | hero.css / hero.html |
| 20 | React 19 / Next.js Lifecycle & Accessibility | `@gsap/react` `useGSAP` with scoped ref, SSR-safe, React StrictMode double-mount protection, `prefers-reduced-motion` fallback, clean Next.js build | M4 | React/Next.js architecture |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Suite | Multi-tier test harness and verification tests for all 20 features | none | DONE |
| M1 | DOM Structure, CSS & Flairs | Exact HTML/CSS layout from `hero.html` & `hero.css`, vector SVGs, gradients, defs | none | DONE |
| M2 | Master Letter Timelines | Exact 15 character timelines, master sequencing, easings, stroke-drawing, odometer, infinite yoyo | M1 | DONE |
| M3 | Interactive Squiggle, Subtitle & CTA Button | Mouse-following physics (`quickTo`), animated subtitle braces, and particle burst button | M1, M2 | DONE |
| M4 | Lifecycle, Reduced Motion & Final Build | React 19 StrictMode cleanup, SSR safety, `prefers-reduced-motion` fallback, `npm run build` verification | M2, M3 | DONE |
| M_FINAL | 100% E2E Verification & Adversarial Hardening | Pass 100% of E2E test suite (Tiers 1-4) followed by Tier 5 adversarial gap coverage | E2E, M4 | DONE |

## Code Layout
- `src/components/Hero.tsx`: Main React component exporting the GSAP Hero section
- `src/components/GSAP_Hero/hero.css`: Authoritative styles, imported in Hero or globals
- `src/components/GSAP_Hero/`: Reference materials and assets
- `public/flair-images/`: Static image flairs
- `tests/e2e/` or `tests/hero/`: Automated test suite for hero section

## Interface Contracts
### Hero Component ↔ Next.js App
- `src/components/Hero.tsx` exports default `Hero: React.FC` or `function Hero()`.
- Client component marked with `'use client';`.
- Zero external runtime script tags required; all animations driven by GSAP npm packages.
- Accessibility: responds to `window.matchMedia('(prefers-reduced-motion: reduce)')`.
