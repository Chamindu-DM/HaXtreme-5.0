# Handoff Report: GSAP Hero Recreation Specification Mining

**Agent**: explorer_survey_2 (Specification Miner)  
**Date**: 2026-08-24  
**Target Output**: `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_2/spec_report.md`

---

## 1. Observation

Direct observations from authoritative source files:

1. **Squiggle Mouse-Following Physics**:
   - `src/components/GSAP_Hero/index.js` lines 32–73 and `src/components/GSAP_Hero/index-036dc494.js` lines 24–57 define `initSquiggleMouseMovement()`:
     - Target: `#home-hero-squiggle` (`.home-hero__flair.home-hero__flair--worm`)
     - Three `gsap.quickTo` instances:
       ```javascript
       const xTo = gsap.quickTo(this.DOM.squiggle, "xPercent", { duration: 1, ease: "power3" });
       const yTo = gsap.quickTo(this.DOM.squiggle, "yPercent", { duration: 1, ease: "power3" });
       const rotateTo = gsap.quickTo(this.DOM.squiggle, "rotation", { duration: 1, ease: "power3" });
       ```
     - Mousemove coordinate mapping logic:
       ```javascript
       const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, e.x);
       const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, e.y);
       const rotateRange = gsap.utils.clamp(-1, 1, gsap.utils.mapRange(windowWidth * 0.25, windowWidth * 0.75, 1, -1, e.x));
       rotateTo(yPercent * 1 * rotateRange);
       xTo(xPercent);
       yTo(yPercent);
       ```
     - Resize event handler updating `windowWidth` and `windowHeight`.

2. **Animated Subtitle with Curly Braces**:
   - `src/components/GSAP_Hero/hero.html` lines 135–147:
     ```html
     <div class="home-hero__subtitle">
       <h3 class="subtitle subtitle--large subtitle--left" data-block="subtitle" data-delay="2.5">
         <div class="subtitle__brace"><svg ...><path fill="#FFFCE1" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"/></svg></div>
         <p class="subtitle__label">GSAP – A wildly robust JavaScript animation library built for professionals</p>
         <div class="subtitle__brace" style="transform: rotate(180deg) skew(360deg, 0deg);"><svg ...><path .../></svg></div>
       </h3>
     </div>
     ```
   - `src/components/GSAP_Hero/index-e4482d9c.js` lines 11778–11820 (Class `H0`):
     ```javascript
     const e = oe.timeline({ defaults: { ease: "power3.out", duration: 0.3 }, scrollTrigger: { trigger: this.block, start: "top 90%", once: true } });
     oe.set(this.DOM.wrap, { autoAlpha: 1 });
     gu(() => {
         e.from(this.DOM.label, { opacity: 0, duration: 0.7, delay: this.startDelay })
          .from(this.DOM.braces[0], { opacity: 0, xPercent: 100 }, "<0.1")
          .from(this.DOM.braces[1], { opacity: 0, xPercent: -100 }, "<");
     });
     ```

3. **Interactive "Get GSAP" CTA Button**:
   - `src/components/GSAP_Hero/hero.html` lines 148–233 defines `.home-hero__button` containing:
     - 4 Particle Flairs: `#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`
     - Button `a.get-gsap-btn__button.button.button--stroke` with two `.get-gsap-btn__word` wrappers ("Get" and "GSAP") and a dual-arrow `.button__icon` container.
   - `src/components/GSAP_Hero/index-e4482d9c.js` lines 12072–12180 (Class `K0`):
     - Custom eases:
       - `airtime`: `CustomEase.create("custom", "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 ")`
       - `rotaaaaate`: `CustomEase.create("custom", "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 ")`
     - Trigger: `mouseenter` under `(min-width: 1240px) and (prefers-reduced-motion: no-preference)`.
     - Handler: `if (!this.playing) this.tl.invalidate().play(0);`
     - Keyframe sequence:
       - Word separation: `get` moves `x: [-30, 0]`, `gsap` moves `x: [30, 0]` (`power4.out` to `power4.in`).
       - Dual arrow slide: `icons[0]` (`yPercent: -140 -> 0`, `power3.in`), `icons[1]` (`yPercent: 0 -> 140`, `power3.out`) at `<0.3`.
       - Particle flairs vertical burst: `y: () => random(-80, -120)`, `scale: 0 -> 1 -> 0.3`, `zIndex: 2 -> -1`, `ease: airtime`, `stagger: 0.15` at `<`.
       - Particle flairs horizontal drift & spin: `x: () => random(-50, 100)`, `rotateZ: -360`, `ease: rotaaaaate`, `stagger: 0.15` at `<`.

---

## 2. Logic Chain

1. From **Observation 1**, the squiggle physics implementation relies on 3 decoupled `gsap.quickTo` instances with damping (`duration: 1, ease: "power3"`). The mapping mathematics normalizes screen coordinates to `[-20%, +20%]` translations and applies torque inversion through clamped center-weighted linear interpolation. This guarantees jitter-free responsive motion without expensive DOM layout re-queries.
2. From **Observation 2**, the subtitle entrance is synchronized with a `2.5s` master delay (or ScrollTrigger trigger). The two curly braces are identical SVGs where the right brace is rotated 180°. During animation, both braces slide outward from the center (`xPercent: 100` and `xPercent: -100`) while the label fades in, creating a balanced framing reveal.
3. From **Observation 3**, the CTA button is a multi-layered reactive component. Using `tl.invalidate().play(0)` on hover enables dynamic re-evaluation of GSAP random functions (`random(-80, -120)` and `random(-50, 100)`) so that every hover generates unique particle physics. The `zIndex: 2 -> -1` keyframe shift ensures particles pop out in front of the button and fall behind it.

---

## 3. Caveats

- DrawSVGPlugin is a Club GSAP plugin; where not installed, stroke animation can be identically realized using standard SVG `strokeDasharray` and `strokeDashoffset` tweens.
- CustomEase must be imported and registered inside client-only lifecycle (`typeof window !== "undefined"` or `useGSAP`) to prevent SSR hydration errors in Next.js.
- No other caveats.

---

## 4. Conclusion

The authoritative specifications for the interactive mouse physics, animated subtitle with curly braces, and CTA button particle physics have been mined with complete mathematical, architectural, and timing fidelity. All details are fully documented in `spec_report.md`.

---

## 5. Verification Method

To verify these findings:
1. Inspect `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_2/spec_report.md`.
2. Compare the extracted easing strings and keyframe arrays against `src/components/GSAP_Hero/index-e4482d9c.js` lines 11778–12180.
3. Compare the squiggle tracking equations against `src/components/GSAP_Hero/index.js` lines 32–73.
