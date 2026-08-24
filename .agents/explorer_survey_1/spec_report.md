# GSAP.com Hero Recreation — Authoritative Specification Report

**Document Status**: Complete & Authoritative  
**Source Files Analyzed**:
- `src/components/GSAP_Hero/hero.html`
- `src/components/GSAP_Hero/index.js`
- `src/components/GSAP_Hero/index-036dc494.js`
- `src/components/GSAP_Hero/index-e4482d9c.js`
- `src/components/GSAP_Hero/flair_bolt.svg`
- `src/components/GSAP_Hero/claude_component.tsx`

---

## 1. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Typography & Layout | Master Heading DOM Structure | Exact nested span DOM architecture with `.clip` and char containers for "Animate anything" | HTML markup | 2 main row spans: `.home-hero__animate` and `.home-hero__anything` with 15 individual character wrappers | Missing DOM node halts scoped selector | `hero.html:7-133` |
| 2 | Letter Animation | char1: "A" Flip-in | 3D flip-in of capital letter "A" around bottom origin | `transformOrigin: "50% 100%"`, `yPercent: 100`, `rotationX: -180` | `char1()` timeline (duration: 1s, ease: `back.out(1.7)`) | Degrades cleanly if 3D transforms unsupported | `index.js:75-89` |
| 3 | Letter Animation | char2: "n" + Windmill & Circles Flair | Rotating windmill flies from screen-left (`-window.innerWidth / 2`), circles flair scales and rises to `yPercent: -200`, dual-span flips "n" in and ghost "a" out | `circlesSvg.scale: 0`, `windmill.x: -innerWidth/2`, `windmill.rotationZ: -360 -> 90` repeat, `chars[0].rotationY: -180`, `chars[1].rotationY: 180` | `char2()` timeline (master offset: 0.4s) | Window resize dynamically recalculates windmill start X | `index.js:91-135` |
| 4 | Letter Animation | char3: "i" Drop-down | Drop-down entrance of lowercase "i" from top | `yPercent: -100`, `duration: 1`, `ease: "back.out(1.4)"` | Tween (master offset: 1.0s) | Hidden by parent `.clip` overflow | `index.js:137-144` |
| 5 | Letter Animation | char4: "m" Slide-in | Horizontal slide-in of lowercase "m" from left | `xPercent: -100`, `duration: 0.6`, `ease: "power2.out"` | Tween (nested inside char5 at `+=.6`) | Hidden by parent `.clip` overflow | `index.js:146-153` |
| 6 | Letter Animation | char5: "a" + Star Flair | Spinning 8-point gradient star scales in, moves horizontally, drops down through `overflow: hidden`, revealing second "a" | `star.xPercent: -150 -> 0 -> yPercent: 130`, `starSvg.rotationZ: 360` (repeat: 2), `char.yPercent: 100` | `char5()` timeline (master offset: 0.8s) | Wraps char4 within itself | `index.js:154-171` |
| 7 | Letter Animation | char6: "t" + Odometer Digits "100" | Digital counter digits "1", "0", "0" roll vertically through clip mask before letter "t" rises and settles | `digits[0].yPercent: 100 -> -100`, `digits[1,2].yPercent: 100 -> -100` (stagger: 0.1s), `char.yPercent: 100` | `char6()` timeline (master offset: 1.1s) | Triggers char7 ("e") synchronously at `<` | `index.js:173-192` |
| 8 | Letter Animation | char7: "e" Rise-up | Vertical rise of lowercase "e" from bottom | `yPercent: 100`, `duration: 0.9`, `ease: "power2.out"` | Tween (called nested inside char6 at `<`) | Hidden by parent `.clip` overflow | `index.js:194-200` |
| 9 | Letter Animation | char8to9: "a" & "n" Dual-span Ticker | Jittery mechanical odometer ticker-roll for "a" and "n" in "anything" with staggered keyframes | `bottomChars.yPercent: [100, 0, 100, 0]`, `topChars.yPercent: [-100, -100, 20, -100]`, `stagger: 0.4s`, `duration: 3s` | `char8to9()` timeline (master offset: 1.5s) | Requires identical span counts for stagger pairing | `index.js:202-241` |
| 10 | Letter Animation | char10: "y" 3D Spin & Scale | Lowercase "y" flips into place with 3D Y-axis rotation and scale expansion | `rotationY: -180`, `scale: 0`, `duration: 1s` | Tween (master offset: 1.7s) | Requires 3D perspective on parent | `index.js:243-250` |
| 11 | Letter Animation | char11: "t" + Lightning Bolt Stroke & Fill | Green lightning bolt draws outline via stroke-dash/DrawSVG, fill reveals via masked rect, bolt pulses and shrinks while letter "t" pops | `bolt.autoAlpha: 1`, `path.drawSVG: "0"`, `rect.yPercent: 100` (duration: 3.5s), `bolt.scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0]`, `char.scale: 0` (`back.out(1.4)`) | `char11()` timeline (master offset: 2.0s) | Fallback to strokeDasharray/strokeDashoffset if DrawSVG plugin unavailable | `index.js:252-284` |
| 12 | Letter Animation | char12: "h" + Squiggle Entrance | Green worm squiggle flair drops in with rotation and bounce while letter "h" drops from top | `worm.yPercent: 100`, `rotationZ: 180`, `autoAlpha: 0`, `ease: "back.out(1.6)"`, `char.yPercent: -100` | `char12()` timeline (master offset: 1.9s) | Squiggle becomes interactive after master entrance | `index.js:286-301` |
| 13 | Letter Animation | char13 & char14: "i" Infinite Wobble & "n" Slide | Lowercase "i" flips on X-axis (`rotationX: -450`), reveals "n2" (`xPercent: -100`), then loops idle 3D wobble (`rotationX: 540`, `yoyo: true`, `repeatDelay: 3`) | `char13.rotationX: -450 -> 540 (loop)`, `char14.xPercent: -100` | `char13()` timeline (master offset: 2.4s) | Loop runs infinitely with yoyo | `index.js:303-333` |
| 14 | Letter Animation | char15: "g" Elastic Rotation | Lowercase "g" twists in with heavy elastic overshoot rotation | `rotationZ: -120`, `autoAlpha: 0`, `duration: 2`, `ease: "elastic.out(1, 0.4)"` | `char15()` timeline (master offset: 2.2s) | Clean transform-origin center | `index.js:335-352` |
| 15 | Interactive Physics | Worm Squiggle Mouse-Tracking | Viewport mouse tracking applying smooth physics to worm squiggle using `gsap.quickTo` on `xPercent`, `yPercent`, and `rotation` | `mousemove` coordinates `(e.x, e.y)` mapped via `gsap.utils.mapRange` (0 to width/height -> -20 to 20), rotation via `gsap.utils.clamp` | 60fps damped cursor reaction on `#home-hero-squiggle` | Graceful resize listener updates viewport dimensions | `index.js:32-73` |
| 16 | Subtitle Animation | Curly Braces & Subtitle Reveal | Dual curly braces (`.subtitle__brace`) slide inward from left/right (`xPercent: 100` / `-100`) while description text fades in | `label.opacity: 0` (delay: 2.5s, duration: 0.7s), `brace[0].xPercent: 100`, `brace[1].xPercent: -100` (`<0.1`, duration: 0.3s) | `H0` timeline triggered on mount / ScrollTrigger | Reverse brace is rotated 180deg via CSS | `index-e4482d9c.js:11778-11820` |
| 17 | Interactive CTA Button | "Get GSAP" Button Particle Hover | Button splits words ("Get" -30px, "GSAP" +30px), arrow icon scrolls down/in, and 4 particle flairs (circles, windmill, square, star) burst into the air with custom bezier curves | Hover `mouseenter` (desktop min-width: 1240px); `CustomEase` curves: `airtime`, `rotaaaaate` | `K0` timeline (duration: 1s, paused, invalidated on hover) | Suppressed when `prefers-reduced-motion: reduce` | `index-e4482d9c.js:12072-12180` |
| 18 | Accessibility & Motion | Reduced Motion Fallback | `prefers-reduced-motion` detection ensures all letters, flairs, and buttons immediately display with `autoAlpha: 1`, `transform: none` | `(prefers-reduced-motion: reduce)` media query | Instant static layout without animations | Prevents motion sickness / accessibility violations | `index.js:369`, `Hero.tsx` |

---

## 2. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Mouse-Following Squiggle | Fast cursor swipe off-screen | `gsap.quickTo` with `power3` smoothly interpolates to the mapped edge limit (-20% to 20%) without abrupt snapping or NaN errors |
| 2 | Mouse-Following Squiggle | Window resize | `resize` event updates `windowWidth` and `windowHeight` cached values, keeping mapping coordinates 100% accurate |
| 3 | CTA Button Hover | Rapid repeated cursor hovering | `this.playing` guard prevents restart while in progress, or `tl.invalidate().play(0)` cleanly recalculates randomized particle trajectories (`random(-80, -120)` and `random(-50, 100)`) |
| 4 | Odometer Digits Counter | Screen resize during counter roll | Nested `.clip` with `overflow: hidden` cleanly masks digit translation outside the character bounding box |
| 5 | Lightning Bolt DrawSVG | Missing commercial DrawSVG plugin in open-source environment | Replaced with standard SVG `strokeDasharray` and `strokeDashoffset` tween (`path.getTotalLength()`), delivering 100% visual parity |
| 6 | Ghost "a" in char2 | Font loading delay / layout shift | Both "n" and "a" spans use `inline-block` with absolute/relative positioning within `.clip` so 3D rotation flip does not cause line wrapping |
| 7 | Infinite 3D Wobble on "i" | Component unmount in React StrictMode | Clean teardown via `useGSAP` or `gsap.context().revert()` kills the infinite `repeat: -1` tween, preventing memory leaks |
| 8 | Reduced Motion Mode | User OS has `prefers-reduced-motion: reduce` enabled | All elements render statically in their final resting states (`autoAlpha: 1`, `scale: 1`, `x/y/rotations: 0`) |

---

## 3. Letter-by-Letter DOM Hierarchy & CSS Architecture

### Master Layout Structure
```html
<div class="home-hero__inner relative w-full flex flex-col items-center justify-between overflow-hidden">
  <div class="home-hero__heading select-none">
    <h1 class="sr-only">Animate Anything</h1>
    <div id="home-hero-heading" class="home-hero__heading-text heading-xl text-[clamp(2.5rem,7.5vw,7.5rem)] font-bold leading-[1.05] tracking-tight text-[#fffce1]" aria-hidden="true">
      <!-- Line 1: "Animate" -->
      <span class="home-hero__animate inline-flex items-baseline flex-wrap"> ... </span>
      <!-- Line 2: "anything" -->
      <span class="home-hero__anything inline-flex items-baseline flex-wrap"> ... </span>
    </div>
  </div>

  <!-- Subtitle with Braces -->
  <div class="home-hero__subtitle mt-8"> ... </div>

  <!-- CTA Button with Particles -->
  <div class="home-hero__button mt-10"> ... </div>
</div>
```

### Detailed Character DOM Specification

#### Line 1: "Animate" (`.home-hero__animate`)
1. **Letter 'A' (`char1`)**:
   ```html
   <span class="a relative inline-block">
     <span class="clip inline-block overflow-hidden" style="transform-origin: 50% 100%;">
       <span class="inline-block">A</span>
     </span>
   </span>
   ```

2. **Letter 'n' + Flairs (`char2`)**:
   ```html
   <span class="n relative inline-block">
     <!-- Windmill Flair -->
     <div class="home-hero__flair home-hero__flair--windmill absolute pointer-events-none w-[1.3em] h-[1.3em] -top-[0.55em] -left-[0.85em] z-20">
       <svg viewBox="0 0 137 135" fill="none" class="w-full h-full"> ... </svg>
     </div>
     <!-- Circles Flair -->
     <div class="home-hero__flair home-hero__flair--circles absolute pointer-events-none w-[1.4em] h-[1.4em] -top-[0.4em] -left-[0.3em] z-10 opacity-0 invisible">
       <svg viewBox="0 0 156 156" fill="none" class="w-full h-full"> ... </svg>
     </div>
     <!-- Letters Container (n and ghost a) -->
     <span class="clip inline-block overflow-hidden">
       <span class="inline-block">
         <span class="inline-block">n</span>
         <span class="inline-block opacity-0 invisible" style="transform: rotateY(180deg);">a</span>
       </span>
     </span>
   </span>
   ```

3. **Letter 'i' (`char3`)**:
   ```html
   <span class="i clip relative inline-block overflow-hidden">
     <span class="inline-block">i</span>
   </span>
   ```

4. **Letter 'm' (`char4`)**:
   ```html
   <span class="m clip relative inline-block overflow-hidden">
     <span class="inline-block">m</span>
   </span>
   ```

5. **Letter 'a' + Star Flair (`char5` / second "a")**:
   ```html
   <span class="a2 relative inline-block" style="overflow: hidden;">
     <!-- Star Flair -->
     <div class="home-hero__flair home-hero__flair--star absolute pointer-events-none w-[1.4em] h-[1.4em] -top-[0.7em] -right-[0.7em] z-20">
       <svg viewBox="0 0 157 156" fill="none" class="w-full h-full"> ... </svg>
     </div>
     <span class="clip inline-block overflow-hidden">
       <span class="inline-block">a</span>
     </span>
   </span>
   ```

6. **Letter 't' + Odometer Counter (`char6`)**:
   ```html
   <span class="t relative inline-block">
     <span class="clip inline-block overflow-hidden">
       <span class="inline-block">t</span>
       <span class="inline-block opacity-0 invisible">
         <span class="inline-block">1</span>
         <span class="inline-block">0</span>
         <span class="inline-block">0</span>
       </span>
     </span>
   </span>
   ```

7. **Letter 'e' (`char7`)**:
   ```html
   <span class="e clip relative inline-block overflow-hidden">
     <span class="inline-block">e</span>
   </span>
   ```

---

#### Line 2: "anything" (`.home-hero__anything`)
8. **Letter 'a' (`char8`)**:
   ```html
   <span class="a clip relative inline-block overflow-hidden">
     <span class="inline-block">a</span>
     <span class="inline-block">a</span>
   </span>
   ```

9. **Letter 'n' (`char9`)**:
   ```html
   <span class="n clip relative inline-block overflow-hidden">
     <span class="inline-block">n</span>
     <span class="inline-block">n</span>
   </span>
   ```

10. **Letter 'y' (`char10`)**:
    ```html
    <span class="y relative inline-block">
      <span class="inline-block">y</span>
    </span>
    ```

11. **Letter 't' + Bolt Flair (`char11`)**:
    ```html
    <span class="t relative inline-block">
      <!-- Bolt Flair -->
      <div class="home-hero__flair home-hero__flair--bolt absolute pointer-events-none w-[1.2em] h-[2.0em] -top-[0.7em] -right-[1.1em] z-20 opacity-0">
        <svg viewBox="0 0 134 229" fill="none" class="w-full h-full">
          <path id="bolt-path" d="M101.08 11C102.439 11 103.402 12.3264 102.982 13.6187L78.6746 88.3335C78.2542 89.6259 79.2175 90.9522 80.5765 90.9522H108.983C110.634 90.9522 111.574 92.8401 110.579 94.1577L10.2304 227L39.4408 125.708C39.8095 124.429 38.8499 123.154 37.5191 123.154H7.82733C6.44727 123.154 5.48193 121.789 5.94147 120.488L44.1353 12.334C44.4176 11.5346 45.1733 11 46.0211 11H101.08Z" stroke="#0AE448" stroke-width="4" />
          <mask id="mask0_bolt" maskUnits="userSpaceOnUse" x="0" y="0" width="134" height="227">
            <rect id="bolt-rect" width="134" height="227" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_bolt)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M102.08 10C103.439 10 104.402 11.3264 103.982 12.6187L79.6746 87.3335C79.2542 88.6259 80.2175 89.9522 81.5765 89.9522H109.983C111.634 89.9522 112.574 91.8401 111.579 93.1577L11.2304 226L40.4408 124.708C40.8095 123.429 39.8499 122.154 38.5191 122.154H8.82733C7.44727 122.154 6.48193 120.789 6.94147 119.488L45.1353 11.334C45.4176 10.5346 46.1733 10 47.0211 10H102.08Z" fill="#0AE448" />
          </g>
        </svg>
      </div>
      <span class="inline-block">t</span>
    </span>
    ```

12. **Letter 'h' + Worm Squiggle Flair (`char12`)**:
    ```html
    <span class="h relative inline-block">
      <!-- Worm Squiggle Flair -->
      <div id="home-hero-squiggle" class="home-hero__flair home-hero__flair--worm absolute pointer-events-none w-[2.2em] h-[1.2em] -top-[0.4em] -left-[0.2em] z-20">
        <img src="/flair-images/flair-20.webp" alt="" class="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(10,228,72,0.35)]" />
      </div>
      <span class="clip inline-block overflow-hidden">
        <span class="inline-block">h</span>
      </span>
    </span>
    ```

13. **Letter 'i' (`char13`)**:
    ```html
    <span class="i relative inline-block">
      <span class="inline-block" style="transform-style: preserve-3d;">i</span>
    </span>
    ```

14. **Letter 'n' (`char14` / second "n")**:
    ```html
    <span class="n2 clip relative inline-block overflow-hidden">
      <span class="inline-block">n</span>
    </span>
    ```

15. **Letter 'g' (`char15`)**:
    ```html
    <span class="g relative inline-block">
      <span class="inline-block origin-center">g</span>
    </span>
    ```

---

## 4. Exact GSAP Timeline Choreography Specification

### Global Defaults & Configuration
```javascript
const defaults = {
  ease: "power2.out",
  duration: 0.6,
};
```

### Master Timeline Sequencing Chart
```
Time (s)  0.0       0.4       0.8   1.0 1.1     1.5   1.7 1.9 2.0 2.2 2.4
Master:   ├─────────┼─────────┼─────┼───┼───────┼─────┼───┼───┼───┼───┼────►
Events:   char1(A)  char2(n)  char5 char3 char6 char8 char10 char12 char11 char15 char13
                               (a2)  (i)   (t)   to9   (y)    (h)    (bolt) (g)    (i2)
                                └char4(m)   └char7(e)                       └char14(n2)
                              buttonIn
```

### Complete Code Specifications for All Sub-Timelines

#### 1. `char1()` — "A"
```javascript
const tl = gsap.timeline({ defaults });
tl.set(".a > span", { transformOrigin: "50% 100%" });
tl.from(".a > span > span", { yPercent: 100 });
tl.from(".a > span", { rotationX: -180, ease: "back.out(1.7)", duration: 1 }, "-=.4");
```

#### 2. `char2()` — "n" + Windmill + Circles
```javascript
const tl = gsap.timeline({ defaults });
const circles = ".home-hero__flair--circles";
const circlesSvg = ".home-hero__flair--circles svg";
const windmill = ".home-hero__flair--windmill";
const wrap = ".n > span > span";
const chars = document.querySelectorAll(".n > span > span > span"); // [0]: n, [1]: a

tl.set(chars[1], { autoAlpha: 1 });
tl.set(circles, { autoAlpha: 1, yPercent: 100 });
tl.from(circlesSvg, { scale: 0, ease: "back.out(1.7)" });
tl.to(circles, { yPercent: -200, autoAlpha: 0, duration: 1.5, ease: "power4.out" });
tl.from(wrap, { yPercent: 100, duration: 0.4 }, "<");
tl.from(windmill, {
  x: () => window.innerWidth / -2,
  rotationZ: -360,
  duration: 1,
}, "<");
tl.from(chars[0], { rotationY: -180, duration: 0.3 }, "+=.4");
tl.to(chars[1], { rotationY: 180, duration: 0.3 }, "<");
tl.to(windmill, {
  rotationZ: 90,
  duration: 0.3,
  repeat: -1,
  repeatDelay: 1,
}, "<");
```

#### 3. `char3()` — "i"
```javascript
gsap.from(".i > span", {
  yPercent: -100,
  ease: "back.out(1.4)",
  duration: 1,
});
```

#### 4. `char4()` — "m"
```javascript
gsap.from(".m > span", {
  xPercent: -100,
  ...defaults,
});
```

#### 5. `char5()` — "a" + Star Flair (nests `char4()`)
```javascript
const tl = gsap.timeline({ defaults });
const star = ".home-hero__flair--star";
const starSvg = ".home-hero__flair--star svg";
const wrap = ".a2";
const char = ".a2 > span > span";

tl.set(star, { xPercent: -150, autoAlpha: 1 });
tl.from(starSvg, { scale: 0, duration: 0.4 });
tl.add(char4(), "+=.6");
tl.to(star, { xPercent: 0 }, "<");
tl.set(wrap, { overflow: "hidden" });
tl.to(star, { yPercent: 130, ease: "power2.in" }, "+=.5");
tl.from(char, { yPercent: 100 }, "-=.3");
tl.to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);
```

#### 6. `char6()` — "t" + "100" Odometer (nests `char7()`)
```javascript
const tl = gsap.timeline({ defaults });
const letter = document.querySelectorAll(".t > span > span")[0];
const numbersWrap = document.querySelectorAll(".t > span > span")[1];
const numbers = document.querySelectorAll(".t > span > span > span"); // [0]: 1, [1]: 0, [2]: 0

tl.set(numbersWrap, { autoAlpha: 1 });
tl.from(numbers[0], { yPercent: 100, duration: 0.4 }, "<");
tl.fromTo(
  [numbers[1], numbers[2]],
  { yPercent: 100 },
  { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" },
  "+=.2"
);
tl.to(numbers[0], { yPercent: -100 }, "-=.6");
tl.from(letter, { yPercent: 100, duration: 0.9 }, "<");
tl.add(char7(), "<");
```

#### 7. `char7()` — "e"
```javascript
gsap.from(".e > span", {
  yPercent: 100,
  duration: 0.9,
});
```

#### 8. `char8to9()` — "a" & "n" Dual-span Ticker
```javascript
const tl = gsap.timeline({ defaults });
const topChars = ".a span:first-of-type, .n span:first-of-type";
const bottomChars = ".a span:last-of-type, .n span:last-of-type";

tl.fromTo(
  bottomChars,
  { yPercent: 100 },
  {
    keyframes: {
      yPercent: [100, 0, 100, 0],
      ease: "power1.out",
    },
    duration: 3,
    stagger: 0.4,
  }
);
tl.fromTo(
  topChars,
  { yPercent: -100 },
  {
    keyframes: {
      yPercent: [-100, -100, 20, -100],
      ease: "power1.out",
    },
    duration: 3,
    stagger: 0.4,
  },
  "<"
);
```

#### 9. `char10()` — "y"
```javascript
gsap.from(".y > span", {
  rotationY: -180,
  duration: 1,
  scale: 0,
});
```

#### 10. `char11()` — "t" + Lightning Bolt
```javascript
const tl = gsap.timeline({ defaults });
const bolt = ".home-hero__flair--bolt";
const path = document.querySelector("#bolt-path");
const rect = document.querySelector("#bolt-rect");
const char = ".t span";

tl.set(bolt, { autoAlpha: 1 });
if (path) {
  const len = path.getTotalLength() || 600.3;
  tl.fromTo(
    path,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" }
  );
}
tl.from(
  rect,
  {
    yPercent: 100,
    transformOrigin: "50% 100%",
    duration: 3.5,
    ease: "power4.out",
  },
  "<.5"
);
tl.from(
  bolt,
  {
    keyframes: {
      scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0],
      duration: 2,
    },
  },
  "-=2"
);
tl.from(char, { scale: 0, ease: "back.out(1.4)" }, "<.5");
```

#### 11. `char12()` — "h" + Squiggle
```javascript
const tl = gsap.timeline({ defaults });
const worm = ".home-hero__flair--worm img";
const char = ".h span span";

tl.from(worm, {
  autoAlpha: 0,
  duration: 1.5,
  yPercent: 100,
  rotationZ: 180,
  ease: "back.out(1.6)",
});
tl.from(char, { yPercent: -100 }, "<.2");
```

#### 12. `char13()` & `char14()` — "i" Infinite Loop & "n" Slide
```javascript
const tl = gsap.timeline({ defaults });
const char = ".i > span";
const n2Char = ".n2 span";

tl.from(char, { autoAlpha: 0, duration: 0.1 }, "<");
tl.from(char, { rotationX: -450, duration: 1.3 }, "<.14");
tl.add(gsap.from(n2Char, { xPercent: -100 }), "<+=.5"); // char14
tl.to(
  char,
  {
    rotationX: 540,
    duration: 1.5,
    repeat: -1,
    repeatDelay: 3,
    yoyo: true,
    yoyoEase: "power2.out",
  },
  "+=2"
);
```

#### 13. `char15()` — "g"
```javascript
const tl = gsap.timeline({ defaults });
tl.from(
  ".g span",
  {
    autoAlpha: 0,
    rotationZ: -120,
    duration: 2,
    ease: "elastic.out(1, 0.4)",
  },
  "<.6"
);
```

#### 14. `buttonIn()` — CTA Container Entrance
```javascript
gsap.from(".home-hero__button", {
  autoAlpha: 0,
  yPercent: 30,
  ...defaults,
});
```

---

## 5. Subtitle & Interactive CTA Specifications

### Subtitle with Curly Braces (`H0`)
- **Left Brace SVG**: `<path fill="#FFFCE1" d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z" />`
- **Right Brace**: Identical SVG styled with `transform: rotate(180deg) skew(360deg, 0deg);`
- **Timeline**:
  ```javascript
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.3 },
  });
  tl.from(".subtitle__label", {
    opacity: 0,
    duration: 0.7,
    delay: 2.5,
  })
  .from(".subtitle__brace:first-child", {
    opacity: 0,
    xPercent: 100,
  }, "<0.1")
  .from(".subtitle__brace:last-child", {
    opacity: 0,
    xPercent: -100,
  }, "<");
  ```

### "Get GSAP" CTA Button Particle Burst (`K0`)
- **Bezier Eases**:
  - `airtime`: `CustomEase.create("airtime", "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 ")`
  - `rotaaaaate`: `CustomEase.create("rotaaaaate", "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 ")`
- **Hover Particle Choreography**:
  ```javascript
  const tl = gsap.timeline({ defaults: { duration: 1 }, paused: true });
  const flairs = ["#btn-circles", "#btn-windmill", "#btn-square", "#btn-star"];
  const icons = document.querySelectorAll(".get-gsap-btn__button svg");

  tl.set(flairs, { scale: 0, x: 0, y: 10, rotateZ: 0 })
    .set(icons[0], { yPercent: -140 })
    .set(icons[1], { yPercent: 0 })
    .to(".get-gsap-btn__word:first-child", {
      keyframes: [{ x: -30, ease: "power4.out" }, { x: 0, ease: "power4.in" }]
    })
    .to(".get-gsap-btn__word:last-child", {
      keyframes: [{ x: 30, ease: "power4.out" }, { x: 0, ease: "power4.in" }]
    }, "<")
    .to(icons[0], { yPercent: 0, duration: 0.6, ease: "power3.in" }, "<.3")
    .to(icons[1], { yPercent: 140, duration: 0.6, ease: "power3.out" }, "<")
    .to(flairs, {
      keyframes: [
        { scale: 0, zIndex: 2, duration: 0 },
        { y: () => gsap.utils.random(-80, -120), scale: 1 },
        { zIndex: -1, duration: 0.05 },
        { y: 0, scale: 0.3 }
      ],
      ease: "airtime",
      stagger: 0.15
    }, "<")
    .to(flairs, {
      x: () => gsap.utils.random(-50, 100),
      rotateZ: () => -360,
      ease: "rotaaaaate",
      stagger: 0.15
    }, "<");
  ```

---

## 6. Verification & Implementation Guidance

1. **Strict DOM Conformance**: The nested spans (`.clip > span > span`) must match exactly for standard GSAP transforms (`rotationX`, `rotationY`, `xPercent`, `yPercent`) to clip properly without layout breaking.
2. **React StrictMode Safety**: Wrap all master and nested timeline initializations in `useGSAP({ scope: containerRef })` from `@gsap/react` or `gsap.context()` inside `useLayoutEffect` to guarantee complete cleanup and teardown on unmount.
3. **DrawSVG Fallback**: Use `strokeDasharray` and `strokeDashoffset` on `#bolt-path` so that commercial plugin licenses are not a hard dependency.
4. **Tailwind / CSS Integration**: Match font hierarchy with `font-['Helvetica_Neue','Inter',sans-serif]` and `clamp(2.5rem, 7.5vw, 7.5rem)` with tracking-tight and leading-[1.05].
