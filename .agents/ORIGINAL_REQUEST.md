# Original User Request

## Initial Request — 2026-08-24T10:50:15+05:30

Recreate the exact GSAP.com "Animate anything" hero section in React / Next.js with TypeScript and Tailwind CSS, faithfully implementing the exact character-by-character GSAP timelines, SVG flairs (windmill, circles, star, bolt with stroke-drawing, interactive mouse-following squiggle), animated subtitle with curly braces, and interactive multi-element particle button animation, integrating it directly into `src/components/Hero.tsx`.

## Reference Materials
- `src/components/GSAP_Hero/hero.html`: Complete source DOM structure, inline SVG paths, and SVG defs / noise gradients.
- `src/components/GSAP_Hero/index.js` & `src/components/GSAP_Hero/index-036dc494.js`: Complete timeline sequences, timings, easings, keyframes, transforms, and mouse-following math.
- `src/components/GSAP_Hero/index-e4482d9c.js`: Subtitle timing & brace animation, "Get GSAP" CTA hover particle bursts (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`).
- `public/flair-images/`: Local webp flair image assets.

## Requirements
### R1. Exact Hero Letter Animation Timelines
- Implement the exact master timeline sequenced letter animations for "Animate" (`char1` to `char7`) and "anything" (`char8to9` to `char15`).
- Animate "A" flipping in on `rotationX: -180` (`ease: "back.out(1.7)"`).
- Animate "n" with rotating windmill flying in from left, circles flair scaling and sweeping up/away, and the letter "n" flipping into view while ghost "a" flips away.
- Animate "i" dropping from top (`yPercent: -100`, `ease: "back.out(1.4)"`).
- Animate "m" sliding from left (`xPercent: -100`).
- Animate "a2" with star flair scaling, moving horizontally, spinning `rotationZ: 360`, and dropping downward through `overflow: hidden`.
- Animate "t" with rolling odometer digits "1", "0", "0" moving vertically before settling on "t".
- Animate "e" rising up (`yPercent: 100`).
- Animate "a" & "n" of "anything" with vertical dual-span ticker rolls (`keyframes: [100, 0, 100, 0]` and `[-100, -100, 20, -100]`).
- Animate "y" spinning on `rotationY: -180` with `scale: 0`.
- Animate "t" with lightning bolt drawing (`strokeDasharray`/`strokeDashoffset` or clip mask) and scale bounce keyframes.
- Animate "h" with worm/squiggle entrance (`yPercent: 100`, `rotationZ: 180`, `ease: "back.out(1.6)"`).
- Animate bottom "i" with `rotationX: -450` entrance and infinite yoyo wobble loop (`rotationX: 540`, `repeatDelay: 3`).
- Animate "n2" sliding from left (`xPercent: -100`).
- Animate "g" with elastic rotation entrance (`rotationZ: -120`, `ease: "elastic.out(1, 0.4)"`).

### R2. Interactive Mouse-Following Squiggle Physics
- Implement viewport mouse tracking on the worm squiggle using `gsap.quickTo` on `xPercent`, `yPercent`, and `rotation`.
- Map coordinates using `gsap.utils.mapRange` (e.g. -20 to 20 for x/y) and `gsap.utils.clamp` with dynamic window resize handlers.

### R3. Subtitle with Braces & Interactive CTA Button
- Implement subtitle with animated curly braces (`.subtitle__brace`) sliding in from opposite sides and label text fading in after delay.
- Implement the "Get GSAP" button with word separation (`Get` -30px, `GSAP` +30px), arrow icon sliding, and 4 particle flairs (circles, windmill, square, star) bursting outward with random angles and custom eases on hover.

### R4. React / Next.js Integration & Clean Lifecycle
- Integrate seamlessly into `src/components/Hero.tsx` using `useGSAP` hook from `@gsap/react` or `gsap.context` with proper cleanup to prevent memory leaks, duplicate animations in React StrictMode, or SSR hydration issues.
- Support `prefers-reduced-motion` media query fallback.

## Acceptance Criteria
- [ ] Heading "Animate anything" renders with the exact DOM structure, fonts, and inline SVG gradients/patterns matching `hero.html`.
- [ ] Master timeline triggers sequentially on mount matching all delays, durations, and easings specified in `index.js`.
- [ ] Moving the mouse across the hero section rotates and moves the worm squiggle smoothly without stutter.
- [ ] Subtitle with curly braces animates cleanly into position.
- [ ] Hovering over "Get GSAP" CTA button triggers the particle burst and word expansion effects.
- [ ] Next.js build (`npm run build`) completes with zero TypeScript or lint errors.

## Follow-up — 2026-08-24T10:53:42+05:30

Update from user: The exact CSS stylesheet from the original gsap.com homepage has been provided and saved to `src/components/GSAP_Hero/hero.css`. It contains the complete styling for `.home-hero`, `.heading-xl`, all `.home-hero__flair--*` positioning and sizes, `.subtitle`, `.subtitle__brace`, `.get-gsap-btn`, and CSS variable definitions. Please make sure this is incorporated into the implementation plan and execution.
