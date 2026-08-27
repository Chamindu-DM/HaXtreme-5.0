# 5-Component Handoff Report — explorer_survey_1 (Spec Miner)

## 1. Observation
- Inspected authoritative source files:
  - `src/components/GSAP_Hero/hero.html` (lines 1-234): Full markup containing `home-hero__animate`, `home-hero__anything`, all nested clip spans, inline SVG definitions for windmill, circles, star, bolt, and button particles (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`).
  - `src/components/GSAP_Hero/index.js` (lines 1-391): Master timeline definition `createTimeline()` sequencing 15 character animations (`char1` to `char15`), interactive squiggle mouse physics `initSquiggleMouseMovement()` with `gsap.quickTo` and `gsap.utils.mapRange`/`clamp`, and button entrance `buttonIn()`.
  - `src/components/GSAP_Hero/index-036dc494.js` (lines 1-386): Minified/compiled bundle confirming exact letter timeline functions `char1()` through `char15()`, default eases (`power2.out`, duration `0.6`), offsets `[0, 0.4, 1, 0.8, 1.1, 1.5, 1.7, 2, 1.9, 2.4, 2.2, 1]`, and nested callbacks.
  - `src/components/GSAP_Hero/index-e4482d9c.js` (lines 11778-11820 & 12072-12180): Authoritative implementation of subtitle brace animation (`H0`) and "Get GSAP" CTA particle burst animation (`K0`) including custom ease beziers `airtime` and `rotaaaaate`.
  - `src/components/GSAP_Hero/flair_bolt.svg`: Vector geometry and mask dimensions for the lightning bolt flair.

## 2. Logic Chain
1. **DOM Hierarchy Match**: `hero.html` demonstrates that character clipping and 3D transforms rely on specific nested hierarchy (e.g. `.a > span.clip > span` for char1, `.n > span.clip > span > span` with 2 inner spans for char2). Without this exact nesting, GSAP's `overflow: hidden` and `transformOrigin` will fail or distort during animation.
2. **Timeline Synchronization**: In `index.js`, `char4` ("m") is deliberately not added directly to the master timeline at top level; instead, it is nested inside `char5` ("a2") at `"+=.6"`. Similarly, `char7` ("e") is nested inside `char6` ("t") at `"<"`, and `char14` ("n2") is nested inside `char13` ("i") at `"<+=.5"`.
3. **Flairs & Particles Math**: `index-e4482d9c.js` defines button flairs with randomized vertical bursts `y: () => gsap.utils.random(-80, -120)` and horizontal spread `x: () => gsap.utils.random(-50, 100)`, with `stagger: 0.15` and `scale: [0, 1, 0.3]` using bezier ease `airtime` (`M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 `).
4. **Mouse Physics**: The mouse movement on `#home-hero-squiggle` maps viewport `(e.x, e.y)` to `(-20, 20)` percent translation and clamps rotation between -1 and 1 via `mapRange(windowWidth * 0.25, windowWidth * 0.75, 1, -1, e.x)`, driven by three `gsap.quickTo` instances with `duration: 1, ease: "power3"`.

## 3. Caveats
- The original site used the proprietary `DrawSVGPlugin` for drawing the lightning bolt path. In open-source GSAP, this can be seamlessly implemented using SVG `strokeDasharray` and `strokeDashoffset` (`path.getTotalLength()`) without visual difference.
- The worm squiggle in `hero.html` used an image `/tf-assets/worm-e8f0c8f6.png`. The local repository provides equivalent webp assets in `/public/flair-images/flair-20.webp`.

## 4. Conclusion
The entire animation specification, DOM hierarchy, SVG paths, timeline schedules, easings, transforms, and interactive physics have been mined and documented in full detail in `.agents/explorer_survey_1/spec_report.md`. The design and implementation agents have an exact, unambiguous blueprint for recreating the GSAP.com Hero component in React/Next.js.

## 5. Verification Method
- Inspect `.agents/explorer_survey_1/spec_report.md` to verify all 18 discovered features and 8 edge cases.
- Compare timeline definitions against `src/components/GSAP_Hero/index.js` and `src/components/GSAP_Hero/index-036dc494.js`.
