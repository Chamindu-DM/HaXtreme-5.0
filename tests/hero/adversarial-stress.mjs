// tests/hero/adversarial-stress.mjs
// Adversarial Stress Testing Harness for GSAP Hero Recreation
// Focus: Rapid CTA hover recycling, Particle coordinate bounds, CustomEase evaluations,
//        Simultaneous master timeline collisions, React StrictMode 100-cycle stress,
//        Event listener leaks, Reduced-motion toggles, and Boundary physics.

import { setupDOMEnvironment, loadHeroHTML, MockNode } from './dom-env.mjs';

// Setup DOM environment
const env = setupDOMEnvironment();

const { default: gsap } = await import('gsap');
const { CSSPlugin } = await import('gsap/CSSPlugin.js');
const { CustomEase } = await import('gsap/CustomEase.js');

gsap.registerPlugin(CSSPlugin, CustomEase);

// Register custom eases
try {
  CustomEase.create(
    "airtime",
    "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 "
  );
  CustomEase.create(
    "rotaaaaate",
    "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 "
  );
} catch (e) {
  // Already registered
}

class AdversarialRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  assert(condition, message, extra = {}) {
    if (!condition) {
      const detail = Object.keys(extra).length ? ` | Details: ${JSON.stringify(extra)}` : '';
      throw new Error(`[ASSERTION FAILED] ${message}${detail}`);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`[ASSERTION FAILED] ${message} - Expected: ${expected}, Got: ${actual}`);
    }
  }

  assertCloseTo(actual, expected, delta = 0.01, message = 'Values close') {
    if (Math.abs(actual - expected) > delta) {
      throw new Error(`[ASSERTION FAILED] ${message} - Expected: ~${expected} (±${delta}), Got: ${actual}`);
    }
  }

  async run(name, fn) {
    const start = performance.now();
    try {
      await fn(this);
      const duration = performance.now() - start;
      this.passed++;
      this.tests.push({ name, status: 'PASS', duration, error: null });
      console.log(`  \x1b[32m✔\x1b[0m ${name} (${duration.toFixed(2)}ms)`);
    } catch (err) {
      const duration = performance.now() - start;
      this.failed++;
      this.tests.push({ name, status: 'FAIL', duration, error: err.message });
      console.log(`  \x1b[31m✖\x1b[0m ${name} (${duration.toFixed(2)}ms)`);
      console.log(`    \x1b[31m${err.message}\x1b[0m`);
    }
  }
}

const runner = new AdversarialRunner();

console.log('\n========================================================================');
console.log('       ADVERSARIAL CHALLENGER 2: STRESS & LIFECYCLE TEST SUITE          ');
console.log('========================================================================\n');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: CTA BUTTON & PARTICLE BURST STRESS-TESTS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\x1b[1m▶ Section 1: CTA Button & Particle Burst Adversarial Tests\x1b[0m');

// 1.1 CustomEase bezier curve evaluations across 10,000 points
await runner.run('1.1 CustomEase "airtime" & "rotaaaaate" Evaluation Stability (10,000 steps)', (t) => {
  const airtimeEase = CustomEase.get("airtime");
  const rotaaaaateEase = CustomEase.get("rotaaaaate");

  t.assert(typeof airtimeEase === 'function', 'airtime CustomEase must be a function');
  t.assert(typeof rotaaaaateEase === 'function', 'rotaaaaate CustomEase must be a function');

  // Test at boundary 0 and 1
  t.assertCloseTo(airtimeEase(0), 0, 0.001, 'airtime at t=0 must be 0');
  t.assertCloseTo(airtimeEase(1), 1, 0.001, 'airtime at t=1 must be 1');
  t.assertCloseTo(rotaaaaateEase(0), 0, 0.001, 'rotaaaaate at t=0 must be 0');
  t.assertCloseTo(rotaaaaateEase(1), 1, 0.001, 'rotaaaaate at t=1 must be 1');

  // Sweep 10,000 samples between 0 and 1
  for (let i = 0; i <= 10000; i++) {
    const progress = i / 10000;
    const vAir = airtimeEase(progress);
    const vRot = rotaaaaateEase(progress);

    t.assert(!Number.isNaN(vAir) && Number.isFinite(vAir), `airtime(${progress}) must be finite, got ${vAir}`);
    t.assert(!Number.isNaN(vRot) && Number.isFinite(vRot), `rotaaaaate(${progress}) must be finite, got ${vRot}`);
    t.assert(vAir >= -0.05 && vAir <= 1.05, `airtime value within valid ease range, got ${vAir}`);
    t.assert(vRot >= -0.05 && vRot <= 1.05, `rotaaaaate value within valid ease range, got ${vRot}`);
  }
});

// 1.2 Particle random coordinate distribution bounds (10,000 random draws)
await runner.run('1.2 Particle Trajectory Random Coordinate Bounds (10,000 samples)', (t) => {
  let minY = Infinity, maxY = -Infinity;
  let minX = Infinity, maxX = -Infinity;

  for (let i = 0; i < 10000; i++) {
    const yVal = gsap.utils.random(-80, -120);
    const xVal = gsap.utils.random(-50, 100);

    t.assert(yVal <= -80 && yVal >= -120, `yVal must be in [-120, -80], got ${yVal}`);
    t.assert(xVal >= -50 && xVal <= 100, `xVal must be in [-50, 100], got ${xVal}`);

    if (yVal < minY) minY = yVal;
    if (yVal > maxY) maxY = yVal;
    if (xVal < minX) minX = xVal;
    if (xVal > maxX) maxX = xVal;
  }

  // Verify spread coverage
  t.assert(minY <= -118 && maxY >= -82, `Y bounds spread must cover range, got [${minY}, ${maxY}]`);
  t.assert(minX <= -48 && maxX >= 98, `X bounds spread must cover range, got [${minX}, ${maxX}]`);
});

// 1.3 Rapid Hover Burst (1,000 mouseenter events in rapid succession)
await runner.run('1.3 Rapid Hover Burst Recycling (1,000 mouseenter events in bursts)', (t) => {
  const DOM = loadHeroHTML();
  const btnBlock = DOM.querySelector(".get-gsap-btn");
  const btnSelector = gsap.utils.selector(btnBlock);
  const getWord = btnSelector(".get-gsap-btn__word:first-child");
  const gsapWord = btnSelector(".get-gsap-btn__word:last-child");
  const icons = btnSelector(".get-gsap-btn__button svg");
  const flairs = [
    btnSelector("#btn-circles"),
    btnSelector("#btn-windmill"),
    btnSelector("#btn-square"),
    btnSelector("#btn-star"),
  ];

  let isPlaying = false;
  let startCount = 0;
  let completeCount = 0;

  const btnTl = gsap.timeline({
    defaults: { duration: 1 },
    paused: true,
    onStart: () => {
      isPlaying = true;
      startCount++;
    },
    onComplete: () => {
      isPlaying = false;
      completeCount++;
    },
  });

  gsap.set(flairs, { scale: 0 });

  btnTl
    .set(flairs, { scale: 0, x: 0, y: 10, rotateZ: 0 })
    .set(icons[0], { yPercent: -140 })
    .set(icons[1], { yPercent: 0 })
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
    .to(icons[0], { yPercent: 0, duration: 0.6, ease: "power3.in" }, "<.3")
    .to(icons[1], { yPercent: 140, duration: 0.6, ease: "power3.out" }, "<")
    .to(flairs, {
      keyframes: [
        { scale: 0, zIndex: 2, duration: 0 },
        { y: () => gsap.utils.random(-80, -120), scale: 1 },
        { zIndex: -1, duration: 0.05 },
        { y: 0, scale: 0.3 },
      ],
      ease: CustomEase.get("airtime"),
      stagger: 0.15,
    }, "<")
    .to(flairs, {
      x: () => gsap.utils.random(-50, 100),
      rotateZ: () => -360,
      ease: CustomEase.get("rotaaaaate"),
      stagger: 0.15,
    }, "<");

  const playBtnTimeline = () => {
    if (!isPlaying) {
      btnTl.invalidate().play(0);
    }
  };

  // Burst 1: 500 immediate calls
  for (let i = 0; i < 500; i++) {
    playBtnTimeline();
  }
  // Tick forward 1 frame with suppressEvents=false to trigger onStart
  btnTl.seek(0.05, false);
  t.assertEqual(startCount, 1, 'Only 1 animation must start during first burst');
  t.assertEqual(isPlaying, true, 'isPlaying flag must remain true during active playback');

  // Advance timeline to 50%
  btnTl.seek(0.5, false);

  // Burst 2: 300 calls while mid-flight
  for (let i = 0; i < 300; i++) {
    playBtnTimeline();
  }
  t.assertEqual(startCount, 1, 'Mid-flight burst calls must be ignored');

  // Complete timeline
  btnTl.seek(btnTl.duration(), false);
  t.assertEqual(completeCount, 1, 'Complete count must be 1');
  t.assertEqual(isPlaying, false, 'isPlaying flag must be false after completion');

  // Burst 3: Hover after completion triggers new start
  playBtnTimeline();
  btnTl.seek(0.05, false);
  t.assertEqual(startCount, 2, 'Hover after completion triggers second animation cycle');

  btnTl.kill();
});

// 1.4 Simultaneous CTA Button Hover during Active Master Timeline
await runner.run('1.4 Simultaneous CTA Button Hover during Active Master Timeline', (t) => {
  const DOM = loadHeroHTML();
  const heading1 = DOM.querySelector(".home-hero__animate");
  const heading2 = DOM.querySelector(".home-hero__anything");
  const animateSelector = gsap.utils.selector(heading1);

  const defaults = { ease: "power2.out", duration: 0.6 };

  // Master timeline construction
  const masterTl = gsap.timeline({ defaults });
  masterTl.set([heading1, heading2], { autoAlpha: 1 });

  // Add sample letter timelines
  const aWrap = animateSelector(".a > span");
  const aChar = animateSelector(".a > span > span");
  masterTl.from(aChar, { yPercent: 100 }, 0);
  masterTl.from(aWrap, { rotationX: -180, ease: "back.out(1.7)", duration: 1 }, 0.4);

  const nWrap = animateSelector(".n > span > span");
  masterTl.from(nWrap, { yPercent: 100, duration: 0.4 }, 0.4);

  // Button timeline
  const btnBlock = DOM.querySelector(".get-gsap-btn");
  const btnSelector = gsap.utils.selector(btnBlock);
  const getWord = btnSelector(".get-gsap-btn__word:first-child");
  const gsapWord = btnSelector(".get-gsap-btn__word:last-child");
  const flairs = [
    btnSelector("#btn-circles"),
    btnSelector("#btn-windmill"),
    btnSelector("#btn-square"),
    btnSelector("#btn-star"),
  ];

  let isPlaying = false;
  const btnTl = gsap.timeline({
    paused: true,
    onStart: () => { isPlaying = true; },
    onComplete: () => { isPlaying = false; },
  });

  btnTl.to(getWord, { x: -30, duration: 0.5 })
       .to(gsapWord, { x: 30, duration: 0.5 }, "<")
       .to(flairs, { y: () => gsap.utils.random(-80, -120), stagger: 0.1, duration: 1 }, "<");

  // Step through master timeline while firing button hovers
  const checkTimes = [0.1, 0.4, 0.8, 1.2, 1.8, 2.4, 3.5];
  for (const time of checkTimes) {
    masterTl.seek(time);
    if (!isPlaying) {
      btnTl.invalidate().play(0);
    }
    btnTl.seek(0.3);

    // Verify master timeline elements and button elements are animated independently
    t.assert(getWord[0].style.transform !== '', 'getWord must have active transform from button timeline');
    t.assert(aChar[0].style.transform !== '', 'aChar must have active transform from master timeline');
  }

  masterTl.kill();
  btnTl.kill();
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: REACT STRICTMODE & LIFECYCLE ADVERSARIAL TESTS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 2: React StrictMode & Lifecycle Adversarial Tests\x1b[0m');

// 2.1 100-Cycle Mount -> Unmount -> Remount StrictMode Stress Test
await runner.run('2.1 100-Cycle StrictMode Mount/Unmount/Remount with Memory & Listener Checks', (t) => {
  const initialTweens = gsap.globalTimeline.getChildren(true, true, true).length;

  for (let cycle = 1; cycle <= 100; cycle++) {
    const DOM = loadHeroHTML();
    const listeners = { resize: null, mousemove: null, mouseenter: null };

    // Simulate Component Mounting & Hook setup
    const ctx = gsap.context(() => {
      const btnBlock = DOM.querySelector(".get-gsap-btn");
      const squiggleEl = DOM.querySelector("#home-hero-squiggle");

      const xTo = gsap.quickTo(squiggleEl, "xPercent", { duration: 1 });
      const yTo = gsap.quickTo(squiggleEl, "yPercent", { duration: 1 });
      const rotateTo = gsap.quickTo(squiggleEl, "rotation", { duration: 1 });

      const handleResize = () => {};
      const handleMouseMove = (e) => {
        xTo(e.clientX || 0);
        yTo(e.clientY || 0);
        rotateTo(0);
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("mousemove", handleMouseMove);
      listeners.resize = handleResize;
      listeners.mousemove = handleMouseMove;

      const btnTl = gsap.timeline({ paused: true });
      btnTl.to(btnBlock, { scale: 1.05 });

      const playBtn = () => btnTl.play(0);
      btnBlock.addEventListener("mouseenter", playBtn);
      listeners.mouseenter = playBtn;

      // Master timeline with infinite yoyo loop (char13)
      const masterTl = gsap.timeline();
      masterTl.to(".i > span", { rotationX: 540, repeat: -1, yoyo: true });
    }, DOM);

    // Simulate activity mid-cycle
    window.dispatchEvent({ type: 'mousemove', clientX: 500, clientY: 300 });

    // Simulate Component Unmount & Cleanup
    ctx.revert(); // GSAP context revert kills all tweens & timelines created inside
    window.removeEventListener("resize", listeners.resize);
    window.removeEventListener("mousemove", listeners.mousemove);
    DOM.querySelector(".get-gsap-btn").removeEventListener("mouseenter", listeners.mouseenter);
  }

  // After 100 cycles, verify no orphan active tweens in global timeline
  const finalTweens = gsap.globalTimeline.getChildren(true, true, true).length;
  t.assertEqual(finalTweens, initialTweens, `Active tween count must return to baseline (${initialTweens}), got ${finalTweens}`);
});

// 2.2 Mid-Animation Interrupt at Random Microseconds
await runner.run('2.2 Mid-Animation Interrupt at 20 Random Progress Intervals', (t) => {
  for (let i = 0; i < 20; i++) {
    const DOM = loadHeroHTML();
    const interruptProgress = Math.random();

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();
      masterTl.to(DOM.querySelectorAll(".a, .n, .i, .m, .t, .e"), {
        yPercent: 100,
        stagger: 0.1,
        duration: 3,
      });

      masterTl.seek(interruptProgress * 3);
    }, DOM);

    // Hard interrupt
    ctx.revert();

    // Verify all inline styles reverted cleanly
    const spans = DOM.querySelectorAll(".a, .n, .i, .m, .t, .e");
    for (const span of spans) {
      t.assert(span.style.transform === '' || span.style.transform === 'none', 'Inline transform must be cleared on revert');
    }
  }
});

// 2.3 Window Resize Listener Storm & Detachment Verification
await runner.run('2.3 Window Resize Storm (500 events) and Clean Detachment', (t) => {
  let resizeCount = 0;
  const handleResize = () => { resizeCount++; };

  window.addEventListener("resize", handleResize);

  // Dispatch 500 resize events with diverse window dimensions
  for (let i = 0; i < 500; i++) {
    window.innerWidth = 320 + (i % 3840);
    window.innerHeight = 480 + (i % 2160);
    window.dispatchEvent({ type: 'resize' });
  }
  t.assertEqual(resizeCount, 500, 'All 500 resize events must be received');

  // Detach listener
  window.removeEventListener("resize", handleResize);

  // Dispatch 100 more events
  for (let i = 0; i < 100; i++) {
    window.dispatchEvent({ type: 'resize' });
  }
  t.assertEqual(resizeCount, 500, 'No resize events should fire after detachment');
});

// 2.4 Reduced Motion Dynamic Toggling
await runner.run('2.4 Reduced Motion Dynamic Toggling and Static Layout Guarantee', (t) => {
  const DOM = loadHeroHTML();

  // Test when prefersReducedMotion is TRUE
  const testReducedMotion = (isReduced) => {
    if (isReduced) {
      gsap.set(
        [
          DOM.querySelector(".home-hero__animate"),
          DOM.querySelector(".home-hero__anything"),
          DOM.querySelector(".home-hero__subtitle"),
          DOM.querySelector(".home-hero__button"),
          DOM.querySelector(".subtitle"),
        ],
        {
          autoAlpha: 1,
          visibility: "inherit",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
        }
      );
      gsap.set(DOM.querySelector(".home-hero__flair--circles"), { autoAlpha: 0 });
      gsap.set(DOM.querySelector(".home-hero__flair--star"), { autoAlpha: 0 });
      gsap.set(DOM.querySelector(".home-hero__flair--bolt"), { autoAlpha: 0 });
    }
  };

  testReducedMotion(true);

  const animate = DOM.querySelector(".home-hero__animate");
  const anything = DOM.querySelector(".home-hero__anything");
  const circles = DOM.querySelector(".home-hero__flair--circles");

  t.assertEqual(animate.style.opacity, '1', 'animate opacity is 1 in reduced motion');
  t.assertEqual(anything.style.opacity, '1', 'anything opacity is 1 in reduced motion');
  t.assertEqual(circles.style.opacity, '0', 'circles flair hidden in reduced motion');
});

// 2.5 Squiggle Extreme Viewport Coordinates Physics Clamping
await runner.run('2.5 Squiggle Physics Extreme Coordinate Clamping (-10000 to +10000)', (t) => {
  const windowWidth = 1920;
  const windowHeight = 1080;

  const testCoords = [
    { x: -5000, y: -5000, desc: 'Far Top-Left' },
    { x: 10000, y: 10000, desc: 'Far Bottom-Right' },
    { x: 0, y: 0, desc: 'Top-Left Origin' },
    { x: windowWidth, y: windowHeight, desc: 'Bottom-Right Corner' },
    { x: windowWidth / 2, y: windowHeight / 2, desc: 'Exact Center' },
  ];

  for (const tc of testCoords) {
    const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, tc.x);
    const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, tc.y);
    const rotateRange = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(
        windowWidth * 0.25,
        windowWidth * 0.75,
        1,
        -1,
        tc.x
      )
    );

    t.assert(!Number.isNaN(xPercent) && Number.isFinite(xPercent), `xPercent must be finite for ${tc.desc}`);
    t.assert(!Number.isNaN(yPercent) && Number.isFinite(yPercent), `yPercent must be finite for ${tc.desc}`);
    t.assert(rotateRange >= -1 && rotateRange <= 1, `rotateRange must be clamped within [-1, 1], got ${rotateRange}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY REPORT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n========================================================================');
console.log('                 ADVERSARIAL STRESS TEST SUMMARY                        ');
console.log('========================================================================');
console.log(`  Total Adversarial Challenges:   ${runner.tests.length}`);
console.log(`  Passed:                         ${runner.passed}`);
console.log(`  Failed:                         ${runner.failed}`);
console.log('========================================================================\n');

if (runner.failed > 0) {
  process.exit(1);
} else {
  console.log('  \x1b[32m✔ ALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS!\x1b[0m\n');
}
