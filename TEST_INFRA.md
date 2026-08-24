# E2E Test Infra: GSAP.com Hero Recreation

## Test Philosophy
- Opaque-box, requirement-driven. Derives from ORIGINAL_REQUEST and user specifications.
- Systematic 4-tier methodology: Category-Partition + Boundary Value Analysis + Pairwise Interactions + Real-World Scenarios.
- Automated testing via Node.js test runner / Jest / Vitest / Playwright / Next.js build verification.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---------|---------------------|:-----------------:|:-----------------:|:----------------------:|:-----------------:|
| 1 | Master Timeline Orchestration | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Word "Animate" - Char 1 ('A') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 3 | Word "Animate" - Char 2 ('n') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 4 | Word "Animate" - Char 3 ('i') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 5 | Word "Animate" - Char 4 ('m') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 6 | Word "Animate" - Char 5 ('a2') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 7 | Word "Animate" - Char 6 ('t') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 8 | Word "Animate" - Char 7 ('e') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 9 | Word "anything" - Char 8 & 9 ('a' & 'n') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 10 | Word "anything" - Char 10 ('y') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 11 | Word "anything" - Char 11 ('t') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 12 | Word "anything" - Char 12 ('h') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 13 | Word "anything" - Char 13 ('i') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 14 | Word "anything" - Char 14 ('n2') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 15 | Word "anything" - Char 15 ('g') | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 16 | Interactive Mouse Squiggle Physics | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 17 | Subtitle with Animated Curly Braces | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 18 | Interactive "Get GSAP" CTA Button | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 19 | Complete CSS Styling Integration | ORIGINAL_REQUEST Follow-up | 5 | 5 | ✓ | ✓ |
| 20 | React 19 / Next.js Lifecycle & Accessibility | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: Automated Node/TS test script executing full DOM structure checks, SVG path verification, timeline math, event dispatchers, and Next.js build compilation (`npm run build`).
- Directory layout: `tests/hero/`
- Output: Pass/Fail report with exit code 0 on complete pass.

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total ≥ 100 tests)
- Tier 2: ≥5 per feature (Total ≥ 100 tests)
- Tier 3: Pairwise feature interactions (Total ≥ 20 tests)
- Tier 4: Real-world user and animation workloads (Total ≥ 10 tests)
- Total tests: ≥ 230 tests
