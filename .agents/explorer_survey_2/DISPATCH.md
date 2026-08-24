## 2026-08-24T05:20:44Z

**Role**: explorer_survey_2 (Spec Miner)
**Assignment**:
Investigate the authoritative source files:
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index-e4482d9c.js`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/hero.html`
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index.js` & `index-036dc494.js` (for context & mouse-following math if referenced)
- `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/public/flair-images/` (and any related image assets)

Mine and document with extreme precision:
1. Interactive mouse-following squiggle physics: exact viewport tracking logic, `gsap.quickTo` setup (`xPercent`, `yPercent`, `rotation`), `gsap.utils.mapRange`, `gsap.utils.clamp`, resize handling, and interaction listeners.
2. Animated subtitle with curly braces: DOM structure, `.subtitle__brace` animation (timings, distances, easings), text fade-in, and timeline placement.
3. Interactive "Get GSAP" CTA Button: DOM structure, word separation animation (`Get` -30px, `GSAP` +30px), arrow icon sliding, and 4 particle flair elements (`#btn-circles`, `#btn-windmill`, `#btn-square`, `#btn-star`), particle burst generation, random angles, distances, rotations, scales, custom easings, and mouseenter/mouseleave hover behaviors.
4. Output your detailed findings and specification report to `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_2/spec_report.md` and write a handoff summary to `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_2/handoff.md`.
Send a message back when complete.
