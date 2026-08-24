# Technical Survey & Architecture Analysis: GSAP.com Hero Recreation

**Explorer**: `explorer_survey_3`  
**Date**: 2026-08-24  
**Project**: HaXtreme 5.0 — GSAP.com "Animate anything" Hero Section Recreation  

---

## 1. Executive Summary

This investigation analyzed the repository configuration, existing Next.js / React 19 setup, styling and font infrastructure, reference implementation assets (`src/components/GSAP_Hero/`), the current state of `src/components/Hero.tsx`, and the optimal React + GSAP architecture.

The project currently has GSAP 3.12.5 and `@gsap/react` 2.1.1 installed in a Next.js 16.3.2 + React 19 + Tailwind CSS 3.4.17 environment. The current `Hero.tsx` is a placeholder that implements an earlier "Code. Compete. Conquer." prototype rather than the authentic GSAP.com "Animate anything" hero section.

Complete reference materials are available in `src/components/GSAP_Hero/`:
1. `hero.html` provides the verbatim DOM layout, SVG paths, noise patterns, and gradients.
2. `index.js` & `index-036dc494.js` provide the exact timeline parameters, offsets, eases, and mouse-following math.
3. `index-e4482d9c.js` provides the subtitle brace animations and the interactive particle burst physics for the "Get GSAP" CTA button.

Below is the exhaustive technical report detailing the workspace state, architecture design, and implementation blueprint.

---

## 2. Workspace & Environment Inspection

### 2.1 Package & Dependency Matrix (`package.json`)

| Package | Version | Role / Notes |
|---|---|---|
| `next` | `16.3.2` | App Router framework with Turbopack / Webpack |
| `react` | `19.2.8` | React 19 core library |
| `react-dom` | `19.2.8` | React 19 DOM bindings |
| `gsap` | `^3.12.5` | GSAP core animation engine (`Timeline`, `quickTo`, `matchMedia`, `utils`) |
| `@gsap/react` | `^2.1.1` | Official GSAP hook (`useGSAP`) with automatic context scoping & cleanup |
| `tailwindcss` | `^3.4.17` | Utility-first styling (Tailwind CSS v3) |
| `postcss` | `^8.4.49` | CSS post-processor for Tailwind |
| `typescript` | `^5.7.3` | TypeScript compiler |
| `eslint` | `^9.20.1` | Linting engine |
| `eslint-config-next` | `15.1.7` | Next.js ESLint configuration |

**Dependency Insights**:
- No external icon libraries or extra animation packages are needed; all SVG flairs (windmill, circles, star, lightning bolt, button flairs, braces, arrow icons) are self-contained vector paths.
- Core GSAP (`gsap`) + `@gsap/react` are already installed and compatible with React 19.

---

### 2.2 TypeScript Configuration (`tsconfig.json`)

- **Target / Lib**: `ES2017`, `dom`, `dom.iterable`, `esnext`
- **Module Resolution**: `bundler` with `isolatedModules: true`, `jsx: "react-jsx"`, `strict: true`
- **Path Aliases**: `"@/*": ["./src/*"]`
- **Include Scope**: `"next-env.d.ts"`, `"**/*.ts"`, `"**/*.tsx"`, `".next/types/**/*.ts"`, `".next/dev/types/**/*.ts"`

---

### 2.3 Styling & Typography System

#### Tailwind CSS Setup (`tailwind.config.ts` & `src/app/globals.css`)
- Tailwind v3 is active via `postcss.config.mjs` (`tailwindcss: {}`, `autoprefixer: {}`).
- `tailwind.config.ts` content scanning covers `./src/**/*.{js,ts,jsx,tsx,mdx}`.
- Global design tokens defined in `:root`:
  - `--green: #0ae448` / `--color-shockingly-green: #0ae448`
  - `--lt: #abff84`
  - `--black: #0e100f` / `--background: #0e100f`
  - `--white: #fffce1`
  - `--s75: #bbbaa6`
  - `--s50: #7c7c6f`
  - `--s25: #42433d`
  - `--color-grey-dark: #191919`
  - `--grad-macha: linear-gradient(114.41deg, #0ae448 20.74%, #abff84 65.5%)`

#### Typography & Font Loading (`src/app/layout.tsx`)
Google Fonts imported via `<link>` in `layout.tsx`:
- `Inter` (weights 100..900, normal + italic)
- `Roboto Mono` (weights 100..700, normal + italic)
- `Space Grotesk` (weights 300..700)
- Fallback fonts configured on `body`: `"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Mono font utility: `.font-mono-code` maps to `"Roboto Mono", "Space Grotesk", monospace`

#### Responsive Breakpoints
Tailwind standard breakpoints:
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`
- `2xl`: `1536px`

GSAP media queries in reference bundle:
- `(min-width: 1240px)` for desktop CTA button hover flair interactions
- `(min-width: 768px)` vs `(max-width: 767px)` for responsive typographic scale
- `(prefers-reduced-motion: reduce)` for accessibility fallback

---

## 3. Current State of `src/components/Hero.tsx`

The current `Hero.tsx` file (447 lines) contains:
1. An experimental timeline animating "Code.", "Compete.", and "Conquer.".
2. A partial mouse-tracking implementation for a squiggle using `gsap.quickTo`.
3. SVG definitions for the windmill and lightning bolt.
4. A preliminary bottom bar with curly braces.

### Deficiencies in Current Implementation vs Original GSAP.com Hero:
1. **Typography & Content**: Does not render "Animate" (`char1` to `char7`) and "anything" (`char8to9` to `char15`).
2. **Missing Animation Sequences**:
   - Letter "A" 3D flip on `rotationX: -180` with `back.out(1.7)`.
   - Letter "n" windmill fly-in from left (`x: () => -window.innerWidth/2`, `rotationZ: -360`), circles flair scale + vertical sweep (`yPercent: -200`), and 3D flip between "n" and ghost "a".
   - Letter "i" dropping from top (`yPercent: -100`, `back.out(1.4)`).
   - Letter "m" sliding from left (`xPercent: -100`).
   - Letter "a2" star flair scaling, moving horizontally, spinning `rotationZ: 360`, and dropping through `overflow: hidden`.
   - Letter "t" rolling odometer "1", "0", "0" digits settling on "t" while nested "e" rises up.
   - Letter "a" & "n" ticker roll keyframes (`[100, 0, 100, 0]` and `[-100, -100, 20, -100]`).
   - Letter "y" spinning `rotationY: -180`, `scale: 0`.
   - Letter "t" lightning bolt draw + scale bounce.
   - Letter "h" worm drop-in.
   - Letter "i" (bottom) `rotationX: -450` entrance + infinite yoyo wobble loop (`rotationX: 540`, `repeatDelay: 3`).
   - Letter "n2" slide from left.
   - Letter "g" elastic rotation entrance (`rotationZ: -120`, `elastic.out(1, 0.4)`).
3. **Missing Subtitle Brace Animation**:
   - Subtitle curly brace slide-in from opposite sides (`xPercent: 100` / `-100`) and label text fade-in.
4. **Missing Interactive Button Particle Burst**:
   - "Get GSAP" CTA button missing word expansion (`x: -30` / `x: 30`), double-arrow icon translation (`yPercent: -140` -> `0`, `0` -> `140`), and 4 particle flairs (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`) bursting outward with random angles and custom eases.

---

## 4. Deep Dive into Reference Materials (`src/components/GSAP_Hero/`)

### 4.1 Master Letter Animation Timelines (`index.js` & `index-036dc494.js`)

The master timeline orchestrates 15 character animations at exact timeline offsets:

```
Master Timeline Defaults: { ease: "power2.out", duration: 0.6 }

Master Timeline Sequence:
├─ 0.0s : char1 ("A")
├─ 0.4s : char2 ("n" + Windmill + Circles + Ghost "a" flip)
├─ 0.8s : char5 ("a2" + Star flair + Nested char4 "m" at +=0.6s)
├─ 1.0s : char3 ("i")
├─ 1.0s : buttonIn (CTA button reveal)
├─ 1.1s : char6 ("t" + Odometer digits "100" + Nested char7 "e" at "<")
├─ 1.5s : char8to9 ("a" & "n" ticker-roll keyframes)
├─ 1.7s : char10 ("y" 3D flip)
├─ 1.9s : char12 ("h" + Worm drop-in)
├─ 2.0s : char11 ("t" + Lightning Bolt draw & scale bounce)
├─ 2.2s : char15 ("g" elastic entrance)
└─ 2.4s : char13 ("i" 3D flip + Nested char14 "n2" at <+=0.5s + Infinite yoyo wobble)
```

#### Detailed Character Breakdown

1. **`char1` ("A")**:
   - Wrap (`.a > span`): `transformOrigin: "50% 100%"`, `from({ rotationX: -180, ease: "back.out(1.7)", duration: 1 })` (offset `-=0.4` after char).
   - Char (`.a > span > span`): `from({ yPercent: 100 })`.

2. **`char2` ("n")**:
   - Circles flair (`.home-hero__flair--circles`): `set({ autoAlpha: 1, yPercent: 100 })`, svg `from({ scale: 0, ease: "back.out(1.7)" })`, wrap `to({ yPercent: -200, autoAlpha: 0, duration: 1.5, ease: "power4.out" })`.
   - Windmill flair (`.home-hero__flair--windmill`): `from({ x: () => -window.innerWidth / 2, rotationZ: -360, duration: 1 }, "<")`.
   - Wrap (`.n > span > span`): `from({ yPercent: 100, duration: 0.4 }, "<")`.
   - Char flip: `chars[0]` ("n") `from({ rotationY: -180, duration: 0.3 }, "+=0.4")`, `chars[1]` (ghost "a") `to({ rotationY: 180, duration: 0.3 }, "<")`.
   - Windmill continuous idle rotation: `to({ rotationZ: 90, duration: 0.3, repeat: -1, repeatDelay: 1 }, "<")`.

3. **`char3` ("i")**:
   - `from(".i > span", { yPercent: -100, ease: "back.out(1.4)", duration: 1 })`.

4. **`char4` ("m")**:
   - `from(".m > span", { xPercent: -100, ease: "power2.out", duration: 0.6 })` (nested inside `char5`).

5. **`char5` ("a2")**:
   - Star flair (`.home-hero__flair--star`): `set({ xPercent: -150, autoAlpha: 1 })`, svg `from({ scale: 0, duration: 0.4 })`.
   - Adds `char4` ("m") at `+=0.6s`.
   - Star `to({ xPercent: 0 }, "<")`, wrap `set({ overflow: "hidden" })`, star `to({ yPercent: 130, ease: "power2.in" }, "+=0.5")`.
   - Letter `from({ yPercent: 100 }, "-=0.3")`.
   - Star SVG continuous spin: `to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0)`.

6. **`char6` ("t") & `char7` ("e")**:
   - Numbers wrap `set({ autoAlpha: 1 })`.
   - Digit 0 ("1"): `from({ yPercent: 100, duration: 0.4 }, "<")`, `to({ yPercent: -100 }, "-=0.6")`.
   - Digits 1 & 2 ("0", "0"): `fromTo({ yPercent: 100 }, { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" }, "+=0.2")`.
   - Letter "t": `from({ yPercent: 100, duration: 0.9 }, "<")`.
   - Nested `char7` ("e"): `from(".e > span", { yPercent: 100, duration: 0.9 })` added at `"<"`.

7. **`char8to9` ("a" & "n" of "anything")**:
   - Dual-span ticker roll:
     - Bottom spans: `fromTo({ yPercent: 100 }, { keyframes: { yPercent: [100, 0, 100, 0], ease: "power1.out" }, duration: 3, stagger: 0.4 })`.
     - Top spans: `fromTo({ yPercent: -100 }, { keyframes: { yPercent: [-100, -100, 20, -100], ease: "power1.out" }, duration: 3, stagger: 0.4 }, "<")`.

8. **`char10` ("y")**:
   - `from(".y > span", { rotationY: -180, duration: 1, scale: 0 })`.

9. **`char11` ("t" + Lightning Bolt)**:
   - Bolt flair: `set({ autoAlpha: 1 })`.
   - Bolt path: Stroke draw with duration 1, ease `"power3.inOut"`.
   - Bolt rect mask: `from({ yPercent: 100, transformOrigin: "50% 100%", duration: 3.5, ease: "power4.out" }, "<0.5")`.
   - Bolt scale bounce keyframes: `from({ keyframes: { scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0], duration: 2 } }, "-=2")`.
   - Letter "t": `from({ scale: 0, ease: "back.out(1.4)" }, "<0.5")`.

10. **`char12` ("h" + Worm Squiggle)**:
    - Worm image / SVG: `from({ autoAlpha: 0, duration: 1.5, yPercent: 100, rotationZ: 180, ease: "back.out(1.6)" })`.
    - Letter "h": `from({ yPercent: -100 }, "<0.2")`.

11. **`char13` ("i" wobble loop) & `char14` ("n2")**:
    - Letter "i": `from({ autoAlpha: 0, duration: 0.1 }, "<")`, `from({ rotationX: -450, duration: 1.3 }, "<0.14")`.
    - Nested `char14` ("n2"): `from(".n2 span", { xPercent: -100 })` at `"<+=0.5"`.
    - Letter "i" infinite loop: `to({ rotationX: 540, duration: 1.5, repeat: -1, repeatDelay: 3, yoyo: true, yoyoEase: "power2.out" }, "+=2")`.

12. **`char15` ("g")**:
    - `from(".g span", { autoAlpha: 0, rotationZ: -120, duration: 2, ease: "elastic.out(1, 0.4)" }, "<0.6")`.

---

### 4.2 Squiggle Mouse Tracking Math (`index.js`)

The mouse movement tracks dynamically:
```javascript
const xTo = gsap.quickTo(squiggleEl, "xPercent", { duration: 1, ease: "power3" });
const yTo = gsap.quickTo(squiggleEl, "yPercent", { duration: 1, ease: "power3" });
const rotateTo = gsap.quickTo(squiggleEl, "rotation", { duration: 1, ease: "power3" });

window.addEventListener("mousemove", (e) => {
  const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, e.clientX);
  const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, e.clientY);
  const rotateRange = gsap.utils.clamp(
    -1,
    1,
    gsap.utils.mapRange(windowWidth * 0.25, windowWidth * 0.75, 1, -1, e.clientX)
  );
  rotateTo(yPercent * 1 * rotateRange);
  xTo(xPercent);
  yTo(yPercent);
});
```

---

### 4.3 Subtitle with Curly Braces (`index-e4482d9c.js`)

DOM structure:
```html
<div class="home-hero__subtitle">
  <h3 class="subtitle subtitle--large subtitle--left" data-delay="2.5">
    <div class="subtitle__brace"><svg ...><path .../></svg></div>
    <p class="subtitle__label">GSAP – A wildly robust JavaScript animation library built for professionals</p>
    <div class="subtitle__brace" style="transform: rotate(180deg) skew(360deg, 0deg);"><svg ...><path .../></svg></div>
  </h3>
</div>
```

Animation logic:
```javascript
const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.3 } });
tl.from(labelEl, { opacity: 0, duration: 0.7, delay: 2.5 })
  .from(braceLeft, { opacity: 0, xPercent: 100 }, "<0.1")
  .from(braceRight, { opacity: 0, xPercent: -100 }, "<");
```

---

### 4.4 "Get GSAP" CTA Button & Particle Burst Physics (`index-e4482d9c.js`)

DOM structure:
```html
<div class="get-gsap-btn get-gsap-btn--fill" data-block="get-gsap-btn">
  <div id="btn-circles" class="get-gsap-btn__flair"><svg .../></div>
  <div id="btn-windmill" class="get-gsap-btn__flair"><svg .../></div>
  <div id="btn-square" class="get-gsap-btn__flair"><svg .../></div>
  <div id="btn-star" class="get-gsap-btn__flair"><svg .../></div>
  <a href="#explore" class="get-gsap-btn__button button button--stroke">
    <span class="get-gsap-btn__word"><span class="button__label">Get</span></span>
    <span class="get-gsap-btn__word">
      <span class="button__label">GSAP</span>
      <span class="button__icon">
        <span><svg .../><svg .../></span>
      </span>
    </span>
  </a>
</div>
```

Hover Animation:
- Initial state: `.get-gsap-btn__flair` scale set to 0.
- Keyframe word expansion: `get` moves `x: -30` (ease `power4.out`) then `x: 0` (ease `power4.in`), `gsap` moves `x: 30` then `x: 0`.
- Arrow translation: top arrow `yPercent: -140` -> `0`, bottom arrow `0` -> `140` (duration 0.6).
- Particle burst on `[#btn-circles, #btn-windmill, #btn-square, #btn-star]`:
  - `keyframes: [{ scale: 0, zIndex: 2, duration: 0 }, { y: () => gsap.utils.random(-80, -120), scale: 1 }, { zIndex: -1, duration: 0.05 }, { y: 0, scale: 0.3 }]`, stagger `0.15`.
  - `x: () => gsap.utils.random(-50, 100)`, `rotateZ: () => -360`, stagger `0.15`.

---

## 5. Architectural Design & Best Practices

### 5.1 Architecture Decision: Master Component vs Modular Subcomponents

**Evaluation**:
1. **Master Component (`Hero.tsx`)**:
   - Acts as the central React component mounted in `src/app/page.tsx`.
   - Holds the master container `ref` (`containerRef`) used as the `scope` for `useGSAP`.
   - Directs the execution of the master timeline and registers the window event listeners for mouse tracking.
2. **Modular Subcomponents / SVG Assets**:
   - To keep code maintainable, readable, and clean, SVG flair components can be modularized:
     - `WindmillFlair.tsx`
     - `CirclesFlair.tsx`
     - `StarFlair.tsx`
     - `BoltFlair.tsx`
     - `SquiggleFlair.tsx`
     - `SubtitleBraces.tsx`
     - `CTAButton.tsx` (or nested cleanly inside `Hero.tsx` or a subcomponents directory `src/components/Hero/`).
   - Because `useGSAP` uses `scope: containerRef`, class names such as `.home-hero__flair--windmill`, `.home-hero__animate`, `.home-hero__anything`, etc. within child components are automatically scoped safely.

### 5.2 `@gsap/react` Hook & Context Management

```typescript
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const squiggleRef = useRef<HTMLDivElement>(null);
  const boltPathRef = useRef<SVGPathElement>(null);
  const boltRectRef = useRef<SVGRectElement>(null);

  const { contextSafe } = useGSAP(
    (context, contextSafe) => {
      // 1. matchMedia for responsive & reduced motion
      const mm = gsap.matchMedia(containerRef);

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          noPreference: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            noPreference: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            // Accessible fallback: instant reveal without animation loops
            gsap.set(
              ".home-hero__animate, .home-hero__anything, .home-hero__subtitle, .home-hero__button, .home-hero__flair",
              { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0 }
            );
            return;
          }

          // 2. Build and run master timeline...
        }
      );

      // 3. Mouse-follow physics setup with quickTo...
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="hero" className="relative w-full ...">
      {/* Verbatim DOM structure matching hero.html */}
    </section>
  );
}
```

### 5.3 Key GSAP Lifecycle & Safety Protections

1. **SSR Safety**:
   - `"use client";` pragma at the top of all component files utilizing React hooks or GSAP.
   - `typeof window !== "undefined"` guards for plugin registration and window measurement.
   - All animations run exclusively inside `useGSAP()`, which executes only in the browser (client-side).

2. **React 19 StrictMode Duplicate Animation Prevention**:
   - React 19 mounts, unmounts, and re-mounts components in development mode.
   - `useGSAP({ scope: containerRef })` automatically handles `gsap.context()` cleanup and reverts all tweens/timelines on unmount.
   - Starting states should use `tl.set(...)` or `fromTo(...)` where appropriate to prevent state drift or layout jump on re-mounts.

3. **Event Handler Encapsulation (`contextSafe`)**:
   - Button hover timelines triggered by `onMouseEnter` or `onMouseLeave` are created via `contextSafe(...)` or pre-built paused timelines.
   - Prevents memory leaks and ensures cleanup on component unmount.

4. **DrawSVGPlugin Replacement**:
   - The original GSAP code uses Club GreenSock `DrawSVGPlugin`.
   - We implement a 100% accurate native SVG alternative using `strokeDasharray` and `strokeDashoffset` computed via `path.getTotalLength() || 600.3`.

---

## 6. Build, Lint & Quality Verification

### 6.1 Build Diagnostics
- Next.js 16 defaults to Turbopack. When building in certain environments, `next build --webpack` compiles clean and executes the full optimization pipeline.
- `package.json` scripts:
  - `npm run dev` -> `next dev`
  - `npm run build` -> `next build`
  - `npm run start` -> `next start`
  - `npm run lint` -> `next lint`

### 6.2 TypeScript Compilation
- `npx tsc --noEmit` validates TypeScript typings.
- Note: A generated file `types/validator.ts` contains outdated relative imports (`../../src/app/page.js`) that were generated during a dev session. It should either be ignored or cleaned up so type checks pass cleanly.

---

## 7. Comprehensive Implementation Checklist

- [ ] **DOM & SVG Precision**:
  - Replicate verbatim the nested `clip` and `span` hierarchy for `.home-hero__animate` ("Animate") and `.home-hero__anything` ("anything").
  - Include inline SVG definitions (`#paint0_linear_1655_45397`, `#paint0_radial_1336_100489`, `#paint0_radial_1413_80169`, `#mask0_1413_68143`, etc.).
  - Position flairs accurately using relative/absolute container styling matching `hero.html`.
- [ ] **Letter Animations (`char1` to `char15`)**:
  - Implement all 15 letter sequence timelines with exact easing curves, durations, keyframes, and offsets.
  - Implement the infinite yoyo wobble on bottom "i".
  - Implement the continuous idle spin on the windmill flair and star flair.
- [ ] **Interactive Squiggle Physics**:
  - Implement viewport mouse tracking with `gsap.quickTo` on `xPercent`, `yPercent`, and `rotation`.
  - Apply `gsap.utils.mapRange` and `gsap.utils.clamp` math.
  - Handle window resizing dynamically.
- [ ] **Subtitle & CTA Button Interaction**:
  - Animate subtitle curly braces sliding in from left and right with label text fade-in.
  - Animate "Get GSAP" CTA button with word separation (`x: -30` / `x: 30`), double-arrow translation, and 4 particle flairs bursting outward with random angles and custom eases on hover.
- [ ] **React & Accessibility Standards**:
  - Use `useGSAP` with `containerRef` scope for clean lifecycle and StrictMode safety.
  - Support `(prefers-reduced-motion: reduce)` media query fallback.
  - Ensure zero build or TypeScript errors.
