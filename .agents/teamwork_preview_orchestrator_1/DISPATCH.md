## 2026-08-24T05:20:15Z

# Task Summary
Recreate the exact GSAP.com "Animate anything" hero section in React / Next.js with TypeScript and Tailwind CSS, faithfully implementing the exact character-by-character GSAP timelines, SVG flairs (windmill, circles, star, bolt with stroke-drawing, interactive mouse-following squiggle), animated subtitle with curly braces, and interactive multi-element particle button animation, integrating it directly into `src/components/Hero.tsx`.

## Reference Materials
- `src/components/GSAP_Hero/hero.html`: Complete source DOM structure, inline SVG paths, and SVG defs / noise gradients.
- `src/components/GSAP_Hero/hero.css`: Complete styling for `.home-hero`, `.heading-xl`, flairs, subtitle, braces, buttons, and variables.
- `src/components/GSAP_Hero/index.js` & `src/components/GSAP_Hero/index-036dc494.js`: Complete timeline sequences, timings, easings, keyframes, transforms, and mouse-following math.
- `src/components/GSAP_Hero/index-e4482d9c.js`: Subtitle timing & brace animation, "Get GSAP" CTA hover particle bursts (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`).
- `public/flair-images/`: Local webp flair image assets.

## 2026-08-24T05:23:42Z
Update from user: The exact CSS stylesheet from the original gsap.com homepage has been provided and saved to `src/components/GSAP_Hero/hero.css`. It contains the complete styling for `.home-hero`, `.heading-xl`, all `.home-hero__flair--*` positioning and sizes, `.subtitle`, `.subtitle__brace`, `.get-gsap-btn`, and CSS variable definitions. Please make sure this is incorporated into the implementation plan and execution.
