# Handoff Report: Explorer Survey 3 (GSAP.com Hero Recreation)

**Agent**: `explorer_survey_3`  
**Date**: 2026-08-24  
**Handoff Type**: Hard (Task complete)

---

## 1. Observation

1. **Framework & Dependencies** (`package.json`):
   - Next.js `16.3.2`, React `19.2.8`, React DOM `19.2.8`.
   - GSAP core: `^3.12.5`.
   - Official React hook: `@gsap/react: ^2.1.1`.
   - Tailwind CSS: `^3.4.17` (v3 with PostCSS).
   - TypeScript: `^5.7.3`.
   - ESLint: `^9.20.1` with `eslint-config-next: 15.1.7`.

2. **Current `src/components/Hero.tsx` State**:
   - Total lines: 447.
   - Contains an earlier experimental timeline for words "Code. Compete. Conquer." rather than the required "Animate anything" master sequence.
   - Uses `@gsap/react` `useGSAP` hook with `containerRef` scope and `gsap.matchMedia`.
   - Has a partial mouse-follow implementation for a single squiggle element.

3. **Ground Truth Reference Assets (`src/components/GSAP_Hero/`)**:
   - `hero.html` (234 lines): Verbatim DOM tree for `.home-hero__animate` ("Animate", 7 character spans) and `.home-hero__anything` ("anything", 8 character spans), inline SVG vectors (windmill, circles, star, lightning bolt, curly braces, particle flairs), SVG noise patterns (`#svg-noise`), and gradient defs.
   - `index.js` (391 lines): Complete character timeline definitions (`char1` to `char15`), exact timeline position offsets (0s, 0.4s, 0.8s, 1.0s, 1.1s, 1.5s, 1.7s, 1.9s, 2.0s, 2.2s, 2.4s), easing curves (`back.out(1.7)`, `power4.out`, `elastic.out(1, 0.4)`, etc.), keyframes, and mouse tracking math (`quickTo`, `mapRange`, `clamp`).
   - `index-e4482d9c.js` (lines 11779–12175):
     - Class `H0`: Subtitle brace slide-in (`xPercent: 100` / `-100`, ease `power3.out`, duration `0.3s`) with label fade-in (`opacity: 0`, duration `0.7s`, startDelay `2.5s`).
     - Class `K0`: "Get GSAP" CTA button hover timeline: Word split expansion (`get` `x: -30`, `gsap` `x: 30`), double arrow slide (`yPercent: -140` -> `0`, `0` -> `140`), and 4 particle flairs (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`) bursting with random offsets (`y: gsap.utils.random(-80, -120)`, `x: gsap.utils.random(-50, 100)`, `rotateZ: -360`).
   - `public/flair-images/`: 22 local `.webp` flair assets including `flair-20.webp` (worm squiggle asset).

4. **Build & Typecheck Diagnostics**:
   - Next.js build (`next build --webpack`) compiles cleanly.
   - Root-level `types/validator.ts` generated during dev has a relative path issue (`../../src/app/page.js`) when `npx tsc --noEmit` runs directly against workspace root.

---

## 2. Logic Chain

1. *From Observation 1 & 2*: The project possesses all necessary dependencies (`gsap`, `@gsap/react`, Tailwind CSS) and uses React 19 in Next.js App Router.
2. *From Observation 3*: The entire DOM structure, SVG flairs, animations, eases, and interactive behaviors are fully documented in `src/components/GSAP_Hero/hero.html`, `index.js`, and `index-e4482d9c.js`.
3. *From GSAP React Best Practices (`gsap-react` skill)*:
   - Use `useGSAP(() => { ... }, { scope: containerRef })` rather than manual `useEffect`/`useLayoutEffect` to automatically manage context and cleanup across React 19 StrictMode mounts.
   - For CTA button hover interaction and mouse physics, use `contextSafe` to bind event handlers.
   - For accessibility, embed `gsap.matchMedia(containerRef)` with `(prefers-reduced-motion: reduce)` to display an instant static reveal without looping tweens.
   - For DrawSVGPlugin replacement, use native SVG `strokeDasharray` and `strokeDashoffset` tweening for the lightning bolt flair (`char11`), achieving 100% visual parity with zero paid plugin dependencies.

---

## 3. Caveats

- **DrawSVGPlugin Dependency**: The original bundle references Club GreenSock `DrawSVGPlugin`. A standard SVG `strokeDasharray`/`strokeDashoffset` tween should be used instead.
- **Worm Flair Asset**: The original site used `/tf-assets/worm-e8f0c8f6.png`. The local workspace has `/flair-images/flair-20.webp` or inline SVG fallback.
- **Turbopack in Sandboxed Environments**: When compiling in sandbox environments without sub-process spawning rights, `--webpack` flag or standard Next.js build flags can be utilized.

---

## 4. Conclusion

The workspace is fully prepared for implementing the authentic GSAP.com Hero Recreation in `src/components/Hero.tsx`. The implementation can be structured cleanly with modular subcomponents for the SVG flairs, Subtitle, and CTA Button, orchestrated through a master `Hero.tsx` using `@gsap/react` `useGSAP` with scoped DOM selection, full responsive math, and accessibility fallbacks.

All detailed findings, code architecture diagrams, timeline parameters, and implementation checklists have been recorded in:
`/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_3/analysis.md`

---

## 5. Verification Method

To independently verify the survey and findings:
1. Inspect the technical survey report:
   ```bash
   view_file /Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_3/analysis.md
   ```
2. Verify package dependencies in `package.json`:
   ```bash
   view_file /Users/chamindu/Documents/GitHub/HaXtreme-5.0/package.json
   ```
3. Inspect ground-truth reference files:
   ```bash
   view_file /Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/hero.html
   view_file /Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index.js
   ```
4. Verify build execution:
   ```bash
   npx next build --webpack
   ```
