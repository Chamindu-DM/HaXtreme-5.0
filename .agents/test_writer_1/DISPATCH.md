## 2026-08-24T05:24:29Z
You are test_writer_1 (Test Writer) for the GSAP.com Hero Recreation project.
Your working directory: /Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/test_writer_1

Read:
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/ORIGINAL_REQUEST.md
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/PROJECT.md
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/TEST_INFRA.md
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/hero.html
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index.js
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/src/components/GSAP_Hero/index-e4482d9c.js
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_1/spec_report.md
- /Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/explorer_survey_2/spec_report.md

Task:
Design and implement a comprehensive, opaque-box E2E and unit test suite for the GSAP Hero component covering all 20 features in PROJECT.md across Tiers 1-4:
- Tier 1: Feature Coverage (>=5 test cases per feature, >=100 tests total) verifying DOM structure, character spans, inline SVGs, timelines, offsets, easings, mouse physics, subtitle braces, particle CTA button, CSS class styling, and Next.js build.
- Tier 2: Boundary & Corner Cases (>=5 test cases per feature, >=100 tests total) covering empty/rapid mouse movements, window resize boundary math, repeat loop handling, reduced-motion media query, StrictMode double-mounting cleanup, unmount ref nullification, long-press/rapid hover on CTA button.
- Tier 3: Cross-Feature Combinations (>=20 test cases) verifying concurrent master timeline + mouse tracking, subtitle brace expansion during character animations, CTA hover during active master timeline.
- Tier 4: Real-World Scenarios (>=10 test cases) simulating realistic user viewing, resizing window, mouse roaming across hero, clicking/hovering CTA button, switching reduced-motion preference, and complete Next.js compilation (`npx next build --webpack` or `npm run build`).

Create:
- Test scripts / test runner in `tests/hero/hero.test.ts` (or `.js` / `.mjs` runnable via Node / ts-node or custom runner)
- Standalone runner script e.g. `tests/hero/run-tests.mjs` that can execute and report structured pass/fail results with exit code 0 on success.
- Test runner execution command in `TEST_READY.md` at project root (`/Users/chamindu/Documents/GitHub/HaXtreme-5.0/TEST_READY.md`).
- Output your report and handoff to `/Users/chamindu/Documents/GitHub/HaXtreme-5.0/.agents/test_writer_1/handoff.md`.

Send a message back when complete.
