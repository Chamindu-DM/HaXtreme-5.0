#!/usr/bin/env node
// tests/hero/run-tests.mjs
// Standalone Test Runner for GSAP Hero Recreation Test Suite

import { runAllHeroTests } from './hero.test.mjs';

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgRed: "\x1b[41m\x1b[37m",
  gray: "\x1b[90m"
};

async function main() {
  const startTime = performance.now();

  console.log(`\n${ANSI.bold}${ANSI.cyan}========================================================================${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}   GSAP.com Hero Recreation — Multi-Tier E2E & Unit Test Suite          ${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}========================================================================${ANSI.reset}\n`);

  let results = [];
  try {
    results = await runAllHeroTests();
  } catch (err) {
    console.error(`${ANSI.red}${ANSI.bold}Fatal Test Suite Error:${ANSI.reset}`, err);
    process.exit(1);
  }

  // Group by Tier
  const tiers = {
    'Tier 1': results.filter(r => r.tier === 'Tier 1'),
    'Tier 2': results.filter(r => r.tier === 'Tier 2'),
    'Tier 3': results.filter(r => r.tier === 'Tier 3'),
    'Tier 4': results.filter(r => r.tier === 'Tier 4'),
  };

  for (const [tierName, tierResults] of Object.entries(tiers)) {
    const tierPassed = tierResults.filter(r => r.status === 'PASS').length;
    const tierFailed = tierResults.filter(r => r.status === 'FAIL').length;
    const tierStatusColor = tierFailed === 0 ? ANSI.green : ANSI.red;

    console.log(`\n${ANSI.bold}${ANSI.blue}▶ ${tierName} Results:${ANSI.reset} ${tierStatusColor}${tierPassed}/${tierResults.length} Passed${ANSI.reset}`);
    console.log(`${ANSI.dim}────────────────────────────────────────────────────────────────────────${ANSI.reset}`);

    // Group by Feature within Tier
    const featureMap = new Map();
    for (const res of tierResults) {
      if (!featureMap.has(res.feature)) featureMap.set(res.feature, []);
      featureMap.get(res.feature).push(res);
    }

    for (const [featureName, fResults] of featureMap.entries()) {
      const allPassed = fResults.every(r => r.status === 'PASS');
      const icon = allPassed ? `${ANSI.green}✔${ANSI.reset}` : `${ANSI.red}✖${ANSI.reset}`;
      console.log(`  ${icon} ${ANSI.bold}${featureName}${ANSI.reset} ${ANSI.gray}(${fResults.length} tests)${ANSI.reset}`);

      for (const t of fResults) {
        if (t.status === 'PASS') {
          console.log(`     ${ANSI.green}✓${ANSI.reset} ${ANSI.dim}[${t.id}]${ANSI.reset} ${t.description} ${ANSI.gray}(${t.duration.toFixed(2)}ms)${ANSI.reset}`);
        } else {
          console.log(`     ${ANSI.red}✗ [${t.id}] ${t.description}${ANSI.reset}`);
          console.log(`       ${ANSI.red}Error: ${t.error}${ANSI.reset}`);
        }
      }
    }
  }

  // Summary Metrics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.status === 'PASS').length;
  const failedTests = results.filter(r => r.status === 'FAIL').length;
  const totalDuration = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${ANSI.bold}${ANSI.cyan}========================================================================${ANSI.reset}`);
  console.log(`${ANSI.bold}                         TEST SUITE SUMMARY                             ${ANSI.reset}`);
  console.log(`${ANSI.cyan}========================================================================${ANSI.reset}`);
  console.log(`  ${ANSI.bold}Tier 1 (Feature Coverage):${ANSI.reset}       ${tiers['Tier 1'].filter(r => r.status === 'PASS').length}/${tiers['Tier 1'].length} passing`);
  console.log(`  ${ANSI.bold}Tier 2 (Boundary & Corner):${ANSI.reset}      ${tiers['Tier 2'].filter(r => r.status === 'PASS').length}/${tiers['Tier 2'].length} passing`);
  console.log(`  ${ANSI.bold}Tier 3 (Cross-Feature):${ANSI.reset}          ${tiers['Tier 3'].filter(r => r.status === 'PASS').length}/${tiers['Tier 3'].length} passing`);
  console.log(`  ${ANSI.bold}Tier 4 (Real-World Scenarios):${ANSI.reset}   ${tiers['Tier 4'].filter(r => r.status === 'PASS').length}/${tiers['Tier 4'].length} passing`);
  console.log(`${ANSI.dim}────────────────────────────────────────────────────────────────────────${ANSI.reset}`);
  console.log(`  ${ANSI.bold}Total Test Cases:${ANSI.reset}                ${totalTests}`);
  console.log(`  ${ANSI.bold}Passed:${ANSI.reset}                          ${ANSI.green}${passedTests}${ANSI.reset}`);
  console.log(`  ${ANSI.bold}Failed:${ANSI.reset}                          ${failedTests === 0 ? ANSI.green : ANSI.red}${failedTests}${ANSI.reset}`);
  console.log(`  ${ANSI.bold}Execution Duration:${ANSI.reset}              ${totalDuration}s`);
  console.log(`${ANSI.cyan}========================================================================${ANSI.reset}`);

  if (failedTests === 0) {
    console.log(`\n${ANSI.bgGreen}  SUCCESS: All ${totalTests} test cases passed perfectly!  ${ANSI.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${ANSI.bgRed}  FAILURE: ${failedTests} out of ${totalTests} test cases failed.  ${ANSI.reset}\n`);
    process.exit(1);
  }
}

main();
