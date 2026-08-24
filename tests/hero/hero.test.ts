// tests/hero/hero.test.ts
// TypeScript Test Suite Interface & Runner Export for GSAP Hero

export interface TestResult {
  tier: string;
  feature: string;
  id: string;
  description: string;
  status: 'PASS' | 'FAIL';
  duration: number;
  error: string | null;
}

export { runAllHeroTests, TestRunner } from './hero.test.mjs';
