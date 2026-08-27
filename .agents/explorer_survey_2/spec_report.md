# GSAP Hero Specification Report: Interactive Squiggle, Subtitle & CTA Button

**Author**: explorer_survey_2 (Specification Miner)  
**Date**: 2026-08-24  
**Authoritative Sources**:
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index-e4482d9c.js`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/hero.html`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index-036dc494.js`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index.js`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/public/flair-images/`

---

## 1. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Squiggle Physics | `quickTo` Pipelines | High-performance interpolation pipelines for `xPercent`, `yPercent`, and `rotation` | Target element (`#home-hero-squiggle`), property name, `{ duration: 1, ease: "power3" }` | Setter functions `xTo`, `yTo`, `rotateTo` | Gracefully handles off-screen coordinates via continuous clamping | `index.js:43-54`, `index-036dc494.js:32-43` |
| 2 | Squiggle Physics | Viewport Coordinate Mapping | Maps cursor coordinates across viewport to relative percentage offsets | `e.clientX` / `e.x`, `e.clientY` / `e.y`, `window.innerWidth`, `window.innerHeight` | `xPercent`: [-20, 20], `yPercent`: [-20, 20] | Updates on dynamic resize without jumping | `index.js:61-62`, `index-036dc494.js:49-50` |
| 3 | Squiggle Physics | Dynamic Rotation Clamping | Multi-stage mapped rotation applying inverted quadrant torque | `e.clientX`, `window.innerWidth` (range `[0.25*w, 0.75*w]`), clamped `[-1, 1]` | `rotateRange`: [-1, 1], multiplied by `yPercent * 1` | Clamped to ±1 outside the central 50% viewport width | `index.js:63-69`, `index-036dc494.js:51-52` |
| 4 | Squiggle Physics | Window Resize Synchronization | Updates viewport dimensions on resize | `window.resize` event | Updated internal `windowWidth`, `windowHeight` state | Must be unbound during unmount / cleanup | `index.js:36-41, 56-58` |
| 5 | Subtitle | Curly Braces Structure | Pair of framing curly brace SVGs framing the subtitle description text | DOM `.subtitle__brace` (left upright, right `rotate(180deg)`), SVG path `M26.52 77.21...` | Styled inline vector braces (#FFFCE1) | SVG viewBox `0 0 27 78` ensures aspect-ratio stability | `hero.html:137-145` |
| 6 | Subtitle | Subtitle Build-on Animation | Timed sequence sliding braces outward while fading in label | `data-delay="2.5"`, ScrollTrigger `top 90%` | Label `opacity: 0 -> 1` (0.7s), Brace 0 `xPercent: 100 -> 0`, Brace 1 `xPercent: -100 -> 0` | Fallback displays instantly when reduced motion is preferred | `index-e4482d9c.js:11780-11819` |
| 7 | CTA Button | Custom Bezier Eases | Two specialized bezier easings via `CustomEase` for float and spin mechanics | SVG path strings `"M0,0 C0.05,0.356 0.377,0.435 0.5,0.5..."` and `"M0,0 C0.148,0.346..."` | Easing curves `airtime` and `rotaaaaate` | Validated by GSAP CustomEase plugin | `index-e4482d9c.js:12088-12089` |
| 8 | CTA Button | Split Word Expansion | Word pair "Get" and "GSAP" separates outward and bounces back on hover | Hover `mouseenter` on `.get-gsap-btn` (media query `min-width: 1240px`) | `get`: `x: [ -30, 0 ]`, `gsap`: `x: [ 30, 0 ]` with `power4.out / power4.in` | Debounced via `this.playing` boolean flag | `index-e4482d9c.js:12128-12144` |
| 9 | CTA Button | Sliding Dual-Arrow Reel | Upper arrow drops from `-140%` to `0%` while lower arrow exits to `140%` | Array of 2 SVG arrows in `.button__icon` | Icon 0: `yPercent: -140 -> 0` (`power3.in`), Icon 1: `yPercent: 0 -> 140` (`power3.out`) | Synchronized at offset `<0.3` after word separation | `index-e4482d9c.js:12124-12151` |
| 10 | CTA Button | 4-Particle Flair Burst | 4 mini SVG flairs (`circles`, `windmill`, `square`, `star`) shooting upward with random trajectories | Dynamic random generator `gsap.utils.random(-80, -120)` (y), `gsap.utils.random(-50, 100)` (x) | Vertical arc (`airtime`), horizontal drift + rotation (`rotaaaaate`), `stagger: 0.15` | `tl.invalidate().play(0)` re-computes randoms on every hover | `index-e4482d9c.js:12152-12174` |
| 11 | CTA Button | Particle z-Index Switching | Particle starts in front (`zIndex: 2`), shoots up, then flips behind button (`zIndex: -1`) on descent | Keyframe array with `zIndex` property | `scale: 0 -> 1 -> 0.3`, `zIndex: 2 -> -1` | Prevents overlapping button label when falling back | `index-e4482d9c.js:12153-12166` |

---

## 2. Edge Cases & Observed Behavior

| # | Feature | Input / Condition | Observed Behavior |
|---|---------|-------------------|-------------------|
| 1 | Squiggle Physics | Cursor moved beyond viewport boundaries (e.g. multi-monitor or rapid exit) | `mapRange` outputs extrapolate smoothly; `rotateRange` remains strictly bounded in `[-1, 1]` due to outer `clamp(-1, 1, ...)` |
| 2 | Squiggle Physics | Viewport width is resized while mouse is static | The next mouse event recalculates using newly updated `windowWidth`/`windowHeight`, preventing stale coordinate calculations |
| 3 | Subtitle | `prefers-reduced-motion: reduce` is enabled | `watchPreferredMotion` bypasses the timeline tweens; subtitle wrapper, braces, and label are set to `autoAlpha: 1`, `opacity: 1`, `xPercent: 0` immediately |
| 4 | CTA Button | Rapid repeated hover triggers (`mouseenter` spamming) | `if (!this.playing)` guard prevents timeline interruption during playback; on timeline completion, `this.playing = false` allows next hover |
| 5 | CTA Button | Consecutive hover triggers across different sessions | `tl.invalidate().play(0)` clears cached function-based values, forcing `gsap.utils.random` to produce completely fresh particle arcs on every hover |
| 6 | CTA Button | Viewport width `< 1240px` (mobile / tablet / smaller laptop) | `gsap.matchMedia("(min-width: 1240px) and (prefers-reduced-motion: no-preference)")` detaches hover listeners, preventing accidental touch triggers |

---

## 3. Deep Architectural Breakdown

### 3.1. Interactive Mouse-Following Squiggle Physics

#### DOM Location & Markup
```html
<!-- Inside heading row 2 (".home-hero__anything"), attached to letter "h" -->
<span class="h">
  <div id="home-hero-squiggle" class="home-hero__flair home-hero__flair--worm">
    <img src="/flair-images/flair-20.webp" alt="" />
  </div>
  <span class="clip">
    <span>h</span>
  </span>
</span>
```

#### Mathematical Formulas & Algorithms
1. **`quickTo` Smooth Setters**:
   - `xTo = gsap.quickTo(squiggleEl, "xPercent", { duration: 1, ease: "power3" });`
   - `yTo = gsap.quickTo(squiggleEl, "yPercent", { duration: 1, ease: "power3" });`
   - `rotateTo = gsap.quickTo(squiggleEl, "rotation", { duration: 1, ease: "power3" });`
   *(All 3 setters use 1.0s duration and power3 damping for fluid inertia)*.

2. **Coordinate Linear Transformations**:
   - **X Translation (% of target width)**:
     $$\text{xPercent} = \text{mapRange}(0, W, -20, 20, \text{clientX}) = -20 + \left(\frac{\text{clientX}}{W}\right) \times 40$$
   - **Y Translation (% of target height)**:
     $$\text{yPercent} = \text{mapRange}(0, H, -20, 20, \text{clientY}) = -20 + \left(\frac{\text{clientY}}{H}\right) \times 40$$
   - **Torque / Rotation Range Multiplier**:
     $$\text{rawRot} = \text{mapRange}(0.25 \times W, 0.75 \times W, 1, -1, \text{clientX})$$
     $$\text{rotateRange} = \text{clamp}(-1, 1, \text{rawRot})$$
   - **Target Rotation (Degrees)**:
     $$\theta = \text{yPercent} \times 1 \times \text{rotateRange}$$

#### Angular Analysis Across Screen Quadrants
| Quadrant | Cursor Position | `xPercent` | `yPercent` | `rotateRange` | Target Rotation ($\theta$) |
|---|---|---|---|---|---|
| Top-Left | `x = 0, y = 0` | -20% | -20% | +1.0 | **-20°** |
| Top-Right | `x = W, y = 0` | +20% | -20% | -1.0 | **+20°** |
| Bottom-Left | `x = 0, y = H` | -20% | +20% | +1.0 | **+20°** |
| Bottom-Right | `x = W, y = H` | +20% | +20% | -1.0 | **-20°** |
| Center | `x = W/2, y = H/2` | 0% | 0% | 0.0 | **0°** |

---

### 3.2. Animated Subtitle with Curly Braces

#### DOM Structure & Class Hierarchy
```html
<div class="home-hero__subtitle">
  <h3 class="subtitle subtitle--large subtitle--left" data-block="subtitle" data-delay="2.5">
    <!-- Left Brace -->
    <div class="subtitle__brace">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" aria-hidden="true">
        <path fill="#FFFCE1" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />
      </svg>
    </div>

    <!-- Center Label -->
    <p class="subtitle__label">
      GSAP – A wildly robust JavaScript animation library built for professionals
    </p>

    <!-- Right Brace (Flipped 180deg) -->
    <div class="subtitle__brace" style="transform: rotate(180deg) skew(360deg, 0deg);">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" aria-hidden="true">
        <path fill="#FFFCE1" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />
      </svg>
    </div>
  </h3>
</div>
```

#### Animation Timings & Tween Parameters
```javascript
const tl = gsap.timeline({
  defaults: {
    ease: "power3.out",
    duration: 0.3,
  },
  scrollTrigger: {
    trigger: blockRef,
    start: "top 90%",
    once: true,
  },
});

gsap.set(wrap, { autoAlpha: 1 });

tl.from(label, {
  opacity: 0,
  duration: 0.7,
  delay: 2.5, // matches data-delay="2.5"
})
.from(braces[0], {
  opacity: 0,
  xPercent: 100, // Starts shifted right towards label, slides left into place
  duration: 0.3,
  ease: "power3.out",
}, "<0.1") // Offset: 0.1s after label begins fading in (timeline position 2.6s)
.from(braces[1], {
  opacity: 0,
  xPercent: -100, // Starts shifted left towards label, slides right into place
  duration: 0.3,
  ease: "power3.out",
}, "<"); // Aligned exactly with left brace start
```

---

### 3.3. Interactive "Get GSAP" CTA Button

#### Complete DOM Structure
```html
<div class="home-hero__button">
  <div class="get-gsap-btn get-gsap-btn--fill" data-block="get-gsap-btn">
    
    <!-- 4 Absolute Particle Flairs (hidden at scale 0 by default) -->
    <div id="btn-circles" class="get-gsap-btn__flair">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="23" height="23" viewBox="0 0 23 23" aria-hidden="true">
        <path fill="url(#paint0_radial_btn_circles)" fill-rule="evenodd" clip-rule="evenodd" d="M7.959 10.053a4.368 4.368 0 0 1-.889-.17c-2.327-.7-3.64-3.174-2.933-5.527C4.845 2.002 7.305.662 9.632 1.36c2.327.7 3.64 3.174 2.933 5.528-.06.197-.131.387-.214.57l.46.138c.032-.198.078-.396.137-.593.707-2.353 3.167-3.694 5.494-2.995 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995a4.377 4.377 0 0 1-.745-.3l-.1.333c.261.029.525.082.786.16 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995-2.327-.7-3.64-3.175-2.933-5.528a4.51 4.51 0 0 1 .35-.845l-.54-.163c-.03.265-.085.531-.164.796-.708 2.353-3.168 3.694-5.495 2.994-2.327-.7-3.64-3.174-2.933-5.527.708-2.354 3.168-3.694 5.495-2.995.295.089.574.206.835.349l.083-.276Z" />
        <defs>
          <radialGradient id="paint0_radial_btn_circles" cx="0" cy="0" r="1" gradientTransform="rotate(-31.559 22.628 3.049) scale(17.064 11.3981)" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFD9B0" />
            <stop offset=".807" stop-color="#FD9F3B" />
            <stop offset="1" stop-color="#FF8709" />
          </radialGradient>
        </defs>
      </svg>
    </div>

    <div id="btn-windmill" class="get-gsap-btn__flair">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="62" height="63" viewBox="0 0 62 63" aria-hidden="true">
        <path fill="url(#paint0_radial_btn_windmill)" d="m34.246 27.525 10.197-13.201a.26.26 0 0 1 .362-.047L61.76 27.372a.26.26 0 0 1 .046.366c-7.386 9.336-20.882 11.074-30.391 3.919l16.975 13.112c.112.087.133.25.046.362L35.34 62.085a.26.26 0 0 1-.365.046c-9.41-7.444-11.1-21.093-3.746-30.616l-13.255 17.16a.259.259 0 0 1-.362.046L.658 35.626a.26.26 0 0 1-.046-.365c7.386-9.337 20.881-11.074 30.391-3.92l-16.935-13.08a.259.259 0 0 1-.047-.363L27.117.944a.26.26 0 0 1 .365-.046c8.08 6.393 10.469 17.361 6.326 26.362-.129.278.25.508.439.264l-.001.001Z" />
        <defs>
          <radialGradient id="paint0_radial_btn_windmill" cx="0" cy="0" r="1" gradientTransform="rotate(-142.317 24.316 16.274) scale(34.5669)" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F0FCFF" />
            <stop offset=".672" stop-color="#9BEDFF" />
            <stop offset=".76" stop-color="#98ECFF" />
            <stop offset=".849" stop-color="#5BE1FF" />
            <stop offset=".948" stop-color="#00BAE2" />
          </radialGradient>
        </defs>
      </svg>
    </div>

    <div id="btn-square" class="get-gsap-btn__flair">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="19" height="19" viewBox="0 0 19 19" aria-hidden="true">
        <path fill="url(#paint0_linear_btn_square)" d="M.27 7.683a1 1 0 0 1 .372-1.364L10.995.409a1 1 0 0 1 1.364.373l5.91 10.352a1 1 0 0 1-.373 1.365l-10.353 5.91a1 1 0 0 1-1.364-.373L.27 7.683Z" />
        <defs>
          <linearGradient id="paint0_linear_btn_square" x1="24.297" x2="3.329" y1="7.113" y2="17.933" gradientUnits="userSpaceOnUse">
            <stop offset=".144" stop-color="#FFE9FE" />
            <stop offset="1" stop-color="#FF96F9" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div id="btn-star" class="get-gsap-btn__flair">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="url(#paint0_linear_btn_star)" fill-rule="evenodd" clip-rule="evenodd" d="m6.324 7.326-4.936-.849a1.078 1.078 0 0 0-.374 2.124l4.93.887-4.091 2.89a1.078 1.078 0 0 0 1.238 1.766l4.112-2.858-.849 4.936a1.078 1.078 0 0 0 2.124.374l.887-4.93 2.89 4.09a1.078 1.078 0 0 0 1.766-1.238l-2.858-4.111 4.936.848a1.078 1.078 0 0 0 .374-2.124l-4.93-.887 4.09-2.89a1.078 1.078 0 0 0-1.238-1.766l-4.111 2.858.848-4.935a1.078 1.078 0 0 0-2.124-.374l-.886 4.93-2.89-4.091a1.078 1.078 0 0 0-1.766 1.238l2.858 4.112Z" />
        <defs>
          <linearGradient id="paint0_linear_btn_star" x1="24.729" x2="25.351" y1="8.665" y2="20.075" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0AE448" />
            <stop offset="1" stop-color="#0085D0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- The Split Button Link -->
    <a href="/docs/v3/Installation" class="get-gsap-btn__button button button--stroke">
      <span class="get-gsap-btn__word">
        <span class="button__label">Get</span>
      </span>

      <span class="get-gsap-btn__word">
        <span class="button__label">GSAP</span>
        <span class="button__icon">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 11" aria-hidden="true">
              <path fill="#fffce1" d="M4.055 0v7.71l-3-3L0 5.79l4.805 4.804 4.804-4.805-1.054-1.078-3 3V0h-1.5Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 11" aria-hidden="true">
              <path fill="#fffce1" d="M4.055 0v7.71l-3-3L0 5.79l4.805 4.804 4.804-4.805-1.054-1.078-3 3V0h-1.5Z" />
            </svg>
          </span>
        </span>
      </span>
    </a>

  </div>
</div>
```

#### CustomEase Curves
```javascript
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

const eases = {
  airtime: CustomEase.create(
    "airtime",
    "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 "
  ),
  rotaaaaate: CustomEase.create(
    "rotaaaaate",
    "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 "
  ),
};
```

#### Timeline Constructor & Step Sequencing
```javascript
const tl = gsap.timeline({
  defaults: { duration: 1 },
  paused: true,
  onStart: () => { isPlaying = true; },
  onComplete: () => { isPlaying = false; },
});

// 1. Initial State Resets
tl.set([circles, windmill, square, star], {
  scale: 0,
  x: 0,
  y: 10,
  rotateZ: 0,
})
.set(icons[0], { yPercent: -140 })
.set(icons[1], { yPercent: 0 })

// 2. Word Separation & Return
.to(getWord, {
  keyframes: [
    { x: -30, ease: "power4.out" },
    { x: 0, ease: "power4.in" },
  ],
})
.to(gsapWord, {
  keyframes: [
    { x: 30, ease: "power4.out" },
    { x: 0, ease: "power4.in" },
  ],
}, "<")

// 3. Arrow Reel (Slide Down & Replace)
.to(icons[0], {
  yPercent: 0,
  duration: 0.6,
  ease: "power3.in",
}, "<0.3")
.to(icons[1], {
  yPercent: 140,
  duration: 0.6,
  ease: "power3.out",
}, "<")

// 4. Particle Flairs: Vertical Arc & Scale & z-Index
.to([circles, windmill, square, star], {
  keyframes: [
    { scale: 0, zIndex: 2, duration: 0 },
    { y: () => gsap.utils.random(-80, -120), scale: 1 },
    { zIndex: -1, duration: 0.05 },
    { y: 0, scale: 0.3 },
  ],
  ease: eases.airtime,
  stagger: 0.15,
}, "<")

// 5. Particle Flairs: Horizontal Drift & Full Rotation
.to([circles, windmill, square, star], {
  x: () => gsap.utils.random(-50, 100),
  rotateZ: () => -360,
  ease: eases.rotaaaaate,
  stagger: 0.15,
}, "<");
```

---

## 4. Master Timeline Integration & React Guidelines

1. **Master Timeline Orchestration**:
   - Master timeline entrance adds `buttonIn()` at `1.0s`:
     `gsap.from(".home-hero__button", { autoAlpha: 0, yPercent: 30, duration: 0.6, ease: "power2.out" })`
   - Subtitle timeline starts at `2.5s` (or on scrollTrigger `top 90%`).
   - Squiggle mouse tracker activates upon mount and registers `mousemove` and `resize` listeners.

2. **React 19 / Next.js StrictMode Safety**:
   - All `quickTo` instances, timelines, and event listeners must be created inside `useGSAP` or `gsap.context(..., containerRef)`.
   - The returned cleanup function MUST remove `window.removeEventListener("mousemove", ...)` and `window.removeEventListener("resize", ...)`.
   - `CustomEase` registration must check `typeof window !== "undefined"` to prevent SSR compilation errors.
