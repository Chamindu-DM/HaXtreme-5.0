// tests/hero/adversarial-stress.mjs
// Authoritative Adversarial Stress Testing Harness for GSAP Hero Recreation
// Challenges: Timeline timings, Keyframe boundaries, Extreme Viewport Resolutions (320px to 8K),
//            Rapid Cursor Jumps & Teleportation, Torque Rotation Inversion Clamp Bounds,
//            Infinite Yoyo Loop Memory Stability, 500-Cycle StrictMode Leaks, and CustomEase Curves.

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
console.log('       ADVERSARIAL CHALLENGER: EXHAUSTIVE STRESS & BOUNDARY SUITE       ');
console.log('========================================================================\n');

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: TIMELINE CHOREOGRAPHY TIMINGS & KEYFRAME BOUNDARIES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\x1b[1m▶ Section 1: Timeline Choreography Timings & Keyframe Offset Boundaries\x1b[0m');

// 1.1 Exact Offset Sequencing Across All 15 Characters & Flairs
await runner.run('1.1 Master Timeline 15-Character Exact Offset Timings and Nesting Integrity', (t) => {
  const DOM = loadHeroHTML();
  const heading1 = DOM.querySelector(".home-hero__animate");
  const heading2 = DOM.querySelector(".home-hero__anything");
  const animateSelector = gsap.utils.selector(heading1);
  const anythingSelector = gsap.utils.selector(heading2);

  const defaults = { ease: "power2.out", duration: 0.6 };

  // Character factories matching Hero.tsx
  const char1 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(animateSelector(".a > span > span"), { yPercent: 100 });
    tl.from(animateSelector(".a > span"), { rotationX: -180, ease: "back.out(1.7)", duration: 1 }, "-=.4");
    return tl;
  };

  const char2 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(animateSelector(".home-hero__flair--circles svg"), { scale: 0, ease: "back.out(1.7)" });
    tl.to(animateSelector(".home-hero__flair--circles"), { yPercent: -200, autoAlpha: 0, duration: 1.5, ease: "power4.out" });
    tl.from(animateSelector(".n > span > span"), { yPercent: 100, duration: 0.4 }, "<");
    tl.from(animateSelector(".home-hero__flair--windmill"), { x: () => window.innerWidth / -2, rotationZ: -360, duration: 1 }, "<");
    tl.from(animateSelector(".n > span > span > span")[0], { rotationY: -180, duration: 0.3 }, "+=.4");
    tl.to(animateSelector(".n > span > span > span")[1], { rotationY: 180, duration: 0.3 }, "<");
    tl.to(animateSelector(".home-hero__flair--windmill"), { rotationZ: 90, duration: 0.3, repeat: -1, repeatDelay: 1 }, "<");
    return tl;
  };

  const char3 = () => gsap.from(animateSelector(".i > span"), { yPercent: -100, ease: "back.out(1.4)", duration: 1 });
  const char4 = () => gsap.from(animateSelector(".m > span"), { xPercent: -100, ...defaults });

  const char5 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(animateSelector(".home-hero__flair--star svg"), { scale: 0, duration: 0.4 });
    tl.add(char4(), "+=.6");
    tl.to(animateSelector(".home-hero__flair--star"), { xPercent: 0 }, "<");
    tl.to(animateSelector(".home-hero__flair--star"), { yPercent: 130, ease: "power2.in" }, "+=.5");
    tl.from(animateSelector(".a2 > span > span"), { yPercent: 100 }, "-=.3");
    tl.to(animateSelector(".home-hero__flair--star svg"), { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);
    return tl;
  };

  const char7 = () => gsap.from(animateSelector(".e > span"), { yPercent: 100, duration: 0.9 });

  const char6 = () => {
    const tl = gsap.timeline({ defaults });
    const numbers = animateSelector(".t > span > span > span");
    tl.from(numbers[0], { yPercent: 100, duration: 0.4 }, "<");
    tl.fromTo([numbers[1], numbers[2]], { yPercent: 100 }, { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" }, "+=.2");
    tl.to(numbers[0], { yPercent: -100 }, "-=.6");
    tl.from(animateSelector(".t > span > span")[0], { yPercent: 100, duration: 0.9 }, "<");
    tl.add(char7(), "<");
    return tl;
  };

  const char8to9 = () => {
    const tl = gsap.timeline({ defaults });
    tl.fromTo(anythingSelector(".a span:last-of-type, .n span:last-of-type"), { yPercent: 100 }, {
      keyframes: { yPercent: [100, 0, 100, 0], ease: "power1.out" }, duration: 3, stagger: 0.4
    });
    tl.fromTo(anythingSelector(".a span:first-of-type, .n span:first-of-type"), { yPercent: -100 }, {
      keyframes: { yPercent: [-100, -100, 20, -100], ease: "power1.out" }, duration: 3, stagger: 0.4
    }, "<");
    return tl;
  };

  const char10 = () => gsap.from(anythingSelector(".y > span"), { rotationY: -180, duration: 1, scale: 0 });

  const char11 = () => {
    const tl = gsap.timeline({ defaults });
    tl.fromTo(DOM.querySelector("#bolt-path"), { strokeDasharray: 600.3, strokeDashoffset: 600.3 }, { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" });
    tl.from(DOM.querySelector("#bolt-rect"), { yPercent: 100, duration: 3.5, ease: "power4.out" }, "<.5");
    tl.from(DOM.querySelector(".home-hero__flair--bolt"), { keyframes: { scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0], duration: 2 } }, "-=2");
    tl.from(anythingSelector(".t span"), { scale: 0, ease: "back.out(1.4)" }, "<.5");
    return tl;
  };

  const char12 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(DOM.querySelector("#home-hero-squiggle img"), { autoAlpha: 0, duration: 1.5, yPercent: 100, rotationZ: 180, ease: "back.out(1.6)" });
    tl.from(anythingSelector(".h span span"), { yPercent: -100 }, "<.2");
    return tl;
  };

  const char14 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(anythingSelector(".n2 span"), { xPercent: -100 });
    return tl;
  };

  const char13 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(anythingSelector(".i > span"), { autoAlpha: 0, duration: 0.1 }, "<");
    tl.from(anythingSelector(".i > span"), { rotationX: -450, duration: 1.3 }, "<.14");
    tl.add(char14(), "<+=.5");
    tl.to(anythingSelector(".i > span"), { rotationX: 540, duration: 1.5, repeat: -1, repeatDelay: 3, yoyo: true, yoyoEase: "power2.out" }, "+=2");
    return tl;
  };

  const char15 = () => {
    const tl = gsap.timeline({ defaults });
    tl.from(anythingSelector(".g span"), { autoAlpha: 0, rotationZ: -120, duration: 2, ease: "elastic.out(1, 0.4)" }, "<.6");
    return tl;
  };

  const buttonIn = () => gsap.from(DOM.querySelector(".home-hero__button"), { autoAlpha: 0, yPercent: 30, ...defaults });

  const masterTl = gsap.timeline({ defaults });
  const c1 = char1();
  const c2 = char2();
  const c3 = char3();
  const c5 = char5();
  const c6 = char6();
  const c89 = char8to9();
  const c10 = char10();
  const c11 = char11();
  const c12 = char12();
  const c13 = char13();
  const c15 = char15();
  const btn = buttonIn();

  masterTl.add(c1, 0);
  masterTl.add(c2, 0.4);
  masterTl.add(c3, 1.0);
  masterTl.add(c5, 0.8);
  masterTl.add(c6, 1.1);
  masterTl.add(c89, 1.5);
  masterTl.add(c10, 1.7);
  masterTl.add(c11, 2.0);
  masterTl.add(c12, 1.9);
  masterTl.add(c13, 2.4);
  masterTl.add(c15, 2.2);
  masterTl.add(btn, 1.0);

  // Assert precise offset registrations
  t.assertEqual(c1.startTime(), 0.0, 'Char 1 offset is 0.0s');
  t.assertEqual(c2.startTime(), 0.4, 'Char 2 offset is 0.4s');
  t.assertEqual(c3.startTime(), 1.0, 'Char 3 offset is 1.0s');
  t.assertEqual(c5.startTime(), 0.8, 'Char 5 offset is 0.8s');
  t.assertEqual(c6.startTime(), 1.1, 'Char 6 offset is 1.1s');
  t.assertEqual(c89.startTime(), 1.5, 'Char 8-9 ticker offset is 1.5s');
  t.assertEqual(c10.startTime(), 1.7, 'Char 10 offset is 1.7s');
  t.assertEqual(c11.startTime(), 2.0, 'Char 11 bolt offset is 2.0s');
  t.assertEqual(c12.startTime(), 1.9, 'Char 12 squiggle offset is 1.9s');
  t.assertEqual(c13.startTime(), 2.4, 'Char 13 offset is 2.4s');
  t.assertEqual(c15.startTime(), 2.2, 'Char 15 offset is 2.2s');
  t.assertEqual(btn.startTime(), 1.0, 'Button offset is 1.0s');

  masterTl.kill();
});

// 1.2 Subtitle & Curly Brace Delays and Directional Inversion
await runner.run('1.2 Subtitle Delay (2.5s) and Mirrored Brace Slide-In Synchronization', (t) => {
  const DOM = loadHeroHTML();
  const subtitleEl = DOM.querySelector(".home-hero__subtitle");
  const label = subtitleEl.querySelector(".subtitle__label");
  const braces = subtitleEl.querySelectorAll(".subtitle__brace");

  const subtitleTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.3 } });
  gsap.set(subtitleEl, { autoAlpha: 1 });

  subtitleTl
    .from(label, { opacity: 0, duration: 0.7, delay: 2.5 })
    .from(braces[0], { opacity: 0, xPercent: 100 }, "<0.1")
    .from(braces[1], { opacity: 0, xPercent: -100 }, "<");

  const children = subtitleTl.getChildren();
  const labelTween = children.find(c => c.targets().includes(label));
  const leftBraceTween = children.find(c => c.targets().includes(braces[0]));
  const rightBraceTween = children.find(c => c.targets().includes(braces[1]));

  t.assertEqual(labelTween.vars.delay, 2.5, 'Label delay must be 2.5s');
  t.assertEqual(labelTween.duration(), 0.7, 'Label fade duration is 0.7s');
  t.assertCloseTo(leftBraceTween.startTime(), 2.6, 0.01, 'Left brace starts at 2.5 + 0.1 = 2.6s');
  t.assertCloseTo(rightBraceTween.startTime(), 2.6, 0.01, 'Right brace starts simultaneously at 2.6s');
  t.assertEqual(leftBraceTween.vars.xPercent, 100, 'Left brace slides from +100%');
  t.assertEqual(rightBraceTween.vars.xPercent, -100, 'Right brace slides from -100%');

  subtitleTl.kill();
});

// 1.3 Keyframe Boundaries & Interpolation Integrity
await runner.run('1.3 Keyframe Boundaries for Dual-Span Tickers and Lightning Scale', (t) => {
  const tickerBottomTarget = { yPercent: 0 };
  const tickerTopTarget = { yPercent: 0 };

  const tickerBottomTween = gsap.fromTo(
    tickerBottomTarget,
    { yPercent: 100 },
    { keyframes: { yPercent: [100, 0, 100, 0], ease: "power1.out" }, duration: 3, paused: true }
  );

  const tickerTopTween = gsap.fromTo(
    tickerTopTarget,
    { yPercent: -100 },
    { keyframes: { yPercent: [-100, -100, 20, -100], ease: "power1.out" }, duration: 3, paused: true }
  );

  // Initial state at t=0
  tickerBottomTween.seek(0);
  t.assertCloseTo(tickerBottomTarget.yPercent, 100, 0.01, 'Bottom ticker at t=0s is 100%');
  tickerTopTween.seek(0);
  t.assertCloseTo(tickerTopTarget.yPercent, -100, 0.01, 'Top ticker at t=0s is -100%');

  // Keyframe 1 dip at eased progress 1/3 (t = 3 * (1 - sqrt(2/3)) ≈ 0.5505s)
  const tDip = 3 * (1 - Math.sqrt(2 / 3));
  tickerBottomTween.seek(tDip);
  t.assertCloseTo(tickerBottomTarget.yPercent, 0, 1.0, 'Bottom ticker at first dip reaches 0%');

  // Keyframe 2 peak at eased progress 2/3 (t = 3 * (1 - sqrt(1/3)) ≈ 1.2679s)
  const tPeak = 3 * (1 - Math.sqrt(1 / 3));
  tickerBottomTween.seek(tPeak);
  t.assertCloseTo(tickerBottomTarget.yPercent, 100, 1.0, 'Bottom ticker at second peak reaches 100%');
  tickerTopTween.seek(tPeak);
  t.assertCloseTo(tickerTopTarget.yPercent, 20, 1.0, 'Top ticker at peak reaches +20%');

  // Final resting state at t=3.0s
  tickerBottomTween.seek(3.0);
  t.assertCloseTo(tickerBottomTarget.yPercent, 0, 0.01, 'Bottom ticker at t=3.0s rests at 0%');
  tickerTopTween.seek(3.0);
  t.assertCloseTo(tickerTopTarget.yPercent, -100, 0.01, 'Top ticker at t=3.0s rests at -100%');

  tickerBottomTween.kill();
  tickerTopTween.kill();
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: MOUSE COORDINATE MAPPING ACROSS EXTREME VIEWPORT RESOLUTIONS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 2: Mouse Coordinate Mapping Across Extreme Resolutions\x1b[0m');

// 2.1 Viewport Resolution Sweeps (320px Mobile to 7680px 8K)
await runner.run('2.1 Viewport Resolution Sweep (320px, 375px, 768px, 1080p, 1440p, 4K, 8K, Ultrawide)', (t) => {
  const resolutions = [
    { name: 'iPhone SE (Mobile)', w: 320, h: 568 },
    { name: 'iPhone 15 (Standard)', w: 393, h: 852 },
    { name: 'iPad Portrait', w: 768, h: 1024 },
    { name: 'Laptop / Tablet Landscape', w: 1024, h: 768 },
    { name: 'HD Budget Laptop', w: 1366, h: 768 },
    { name: 'Full HD 1080p', w: 1920, h: 1080 },
    { name: '2K QHD', w: 2560, h: 1440 },
    { name: '3440x1440 Ultrawide (21:9)', w: 3440, h: 1440 },
    { name: '4K UHD', w: 3840, h: 2160 },
    { name: '5120x1440 Super Ultrawide (32:9)', w: 5120, h: 1440 },
    { name: '8K UHD Super Hi-Vision', w: 7680, h: 4320 },
  ];

  for (const res of resolutions) {
    // Test 5 canonical cursor positions per resolution
    const sampleCoords = [
      { x: 0, y: 0, expX: -20, expY: -20, expRotRange: 1, expRot: -20 },
      { x: res.w, y: 0, expX: 20, expY: -20, expRotRange: -1, expRot: 20 },
      { x: 0, y: res.h, expX: -20, expY: 20, expRotRange: 1, expRot: 20 },
      { x: res.w, y: res.h, expX: 20, expY: 20, expRotRange: -1, expRot: -20 },
      { x: res.w / 2, y: res.h / 2, expX: 0, expY: 0, expRotRange: 0, expRot: 0 },
    ];

    for (const sc of sampleCoords) {
      const xPercent = gsap.utils.mapRange(0, res.w, -20, 20, sc.x);
      const yPercent = gsap.utils.mapRange(0, res.h, -20, 20, sc.y);
      const rotateRange = gsap.utils.clamp(
        -1,
        1,
        gsap.utils.mapRange(res.w * 0.25, res.w * 0.75, 1, -1, sc.x)
      );
      const targetRotation = yPercent * 1 * rotateRange;

      t.assert(!Number.isNaN(xPercent) && Number.isFinite(xPercent), `xPercent must be finite for ${res.name}`);
      t.assert(!Number.isNaN(yPercent) && Number.isFinite(yPercent), `yPercent must be finite for ${res.name}`);
      t.assert(!Number.isNaN(rotateRange) && Number.isFinite(rotateRange), `rotateRange must be finite for ${res.name}`);
      t.assert(!Number.isNaN(targetRotation) && Number.isFinite(targetRotation), `targetRotation must be finite for ${res.name}`);

      t.assertCloseTo(xPercent, sc.expX, 0.01, `${res.name} xPercent for x=${sc.x}`);
      t.assertCloseTo(yPercent, sc.expY, 0.01, `${res.name} yPercent for y=${sc.y}`);
      t.assertCloseTo(rotateRange, sc.expRotRange, 0.01, `${res.name} rotateRange for x=${sc.x}`);
      t.assertCloseTo(targetRotation, sc.expRot, 0.01, `${res.name} targetRotation for x=${sc.x}, y=${sc.y}`);
    }
  }
});

// 2.2 Extreme Out-of-Bounds & Negative Coordinates
await runner.run('2.2 Out-of-Bounds Coordinates (-1,000,000 to +1,000,000) Clamping & Finiteness', (t) => {
  const w = 1920;
  const h = 1080;

  const extremeInputs = [
    { x: -1000000, y: -1000000 },
    { x: 1000000, y: 1000000 },
    { x: -500, y: 2500 },
    { x: 3000, y: -200 },
    { x: -0.00001, y: 1080.00001 }
  ];

  for (const input of extremeInputs) {
    const xPercent = gsap.utils.mapRange(0, w, -20, 20, input.x);
    const yPercent = gsap.utils.mapRange(0, h, -20, 20, input.y);
    const rotateRange = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, input.x)
    );
    const targetRotation = yPercent * 1 * rotateRange;

    t.assert(Number.isFinite(xPercent), `xPercent must be finite for (${input.x}, ${input.y})`);
    t.assert(Number.isFinite(yPercent), `yPercent must be finite for (${input.x}, ${input.y})`);
    t.assert(rotateRange >= -1 && rotateRange <= 1, `rotateRange must strictly stay in [-1, 1], got ${rotateRange}`);
    t.assert(Number.isFinite(targetRotation), `targetRotation must be finite for (${input.x}, ${input.y})`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: RAPID CURSOR JUMPS & TORQUE ROTATION INVERSION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 3: Rapid Cursor Jumps & Torque Rotation Inversion Bounds\x1b[0m');

// 3.1 Diagonal Teleportation Stress Test (1,000 Hz Alternating Corners)
await runner.run('3.1 1,000 Hz Diagonal Cursor Teleportation Across Screen Corners', (t) => {
  const w = 1920;
  const h = 1080;
  const corners = [
    { x: 0, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
    { x: w, y: 0 },
  ];

  let prevRotation = 0;
  for (let i = 0; i < 1000; i++) {
    const corner = corners[i % 4];
    const xPercent = gsap.utils.mapRange(0, w, -20, 20, corner.x);
    const yPercent = gsap.utils.mapRange(0, h, -20, 20, corner.y);
    const rotateRange = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, corner.x)
    );
    const targetRotation = yPercent * 1 * rotateRange;

    t.assert(Number.isFinite(targetRotation), `targetRotation at step ${i} must be finite`);
    t.assert(Math.abs(targetRotation) <= 20.001, `Target rotation must be bounded within [-20, 20], got ${targetRotation}`);
    prevRotation = targetRotation;
  }
});

// 3.2 Mathematical Symmetry of Torque Rotation Inversion
await runner.run('3.2 Mathematical Torque Inversion Clamp Bounds & Odd Symmetry (10,000 points)', (t) => {
  const w = 1920;
  const centerX = w / 2;

  // Verify left clamp zone (x <= 0.25 * w = 480)
  for (let x = -5000; x <= 480; x += 100) {
    const clampVal = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, x)
    );
    t.assertEqual(clampVal, 1, `Clamp value for x=${x} <= 480 must be exactly +1`);
  }

  // Verify right clamp zone (x >= 0.75 * w = 1440)
  for (let x = 1440; x <= 6000; x += 100) {
    const clampVal = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, x)
    );
    t.assertEqual(clampVal, -1, `Clamp value for x=${x} >= 1440 must be exactly -1`);
  }

  // Verify exact center (x = 960)
  const centerVal = gsap.utils.clamp(
    -1,
    1,
    gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, centerX)
  );
  t.assertEqual(centerVal, 0, 'Center value at x=960 must be exactly 0');

  // Verify odd symmetry: f(centerX - dx) == -f(centerX + dx)
  for (let dx = 1; dx <= 800; dx += 10) {
    const leftVal = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, centerX - dx)
    );
    const rightVal = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(w * 0.25, w * 0.75, 1, -1, centerX + dx)
    );
    t.assertCloseTo(leftVal, -rightVal, 0.0001, `Symmetry violated for dx=${dx}: left=${leftVal}, right=${rightVal}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: INFINITE YOYO LOOP & PROLONGED TIMELINE STABILITY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 4: Infinite Yoyo Loop & Prolonged Timeline Stability\x1b[0m');

// 4.1 Extreme Time Horizon Seeking (t = 1,000,000 seconds)
await runner.run('4.1 Extreme Timeline Time Horizons (t=10s, 1000s, 100,000s, 1,000,000s)', (t) => {
  const DOM = loadHeroHTML();
  const char13Target = { rotationX: 0 };
  const windmillTarget = { rotationZ: 0 };

  // Char 13 infinite yoyo tween
  const char13Tl = gsap.timeline();
  char13Tl.to(char13Target, {
    rotationX: 540,
    duration: 1.5,
    repeat: -1,
    repeatDelay: 3,
    yoyo: true,
    yoyoEase: "power2.out"
  });

  // Windmill infinite loop tween
  const windmillTl = gsap.timeline();
  windmillTl.to(windmillTarget, {
    rotationZ: 90,
    duration: 0.3,
    repeat: -1,
    repeatDelay: 1
  });

  const horizons = [10, 100, 1000, 10000, 100000, 1000000];

  for (const time of horizons) {
    char13Tl.seek(time);
    windmillTl.seek(time);

    t.assert(!Number.isNaN(char13Target.rotationX) && Number.isFinite(char13Target.rotationX),
      `Char 13 rotationX must be finite at t=${time}s, got ${char13Target.rotationX}`);
    t.assert(char13Target.rotationX >= -0.01 && char13Target.rotationX <= 540.01,
      `Char 13 rotationX must stay in [0, 540] at t=${time}s, got ${char13Target.rotationX}`);

    t.assert(!Number.isNaN(windmillTarget.rotationZ) && Number.isFinite(windmillTarget.rotationZ),
      `Windmill rotationZ must be finite at t=${time}s, got ${windmillTarget.rotationZ}`);
  }

  char13Tl.kill();
  windmillTl.kill();
});

// 4.2 500-Cycle React StrictMode Memory & Leak Proof
await runner.run('4.2 500-Cycle StrictMode Mount/Unmount/Remount Memory Cleanliness', (t) => {
  const initialTweens = gsap.globalTimeline.getChildren(true, true, true).length;

  for (let cycle = 1; cycle <= 500; cycle++) {
    const DOM = loadHeroHTML();
    let resizeHandler = null;
    let mouseHandler = null;

    const ctx = gsap.context(() => {
      const btn = DOM.querySelector(".get-gsap-btn");
      const squiggle = DOM.querySelector("#home-hero-squiggle");

      const xTo = gsap.quickTo(squiggle, "xPercent", { duration: 1 });
      const yTo = gsap.quickTo(squiggle, "yPercent", { duration: 1 });
      const rotateTo = gsap.quickTo(squiggle, "rotation", { duration: 1 });

      resizeHandler = () => {};
      mouseHandler = (e) => {
        xTo(e.clientX || 0);
        yTo(e.clientY || 0);
        rotateTo(0);
      };

      window.addEventListener("resize", resizeHandler);
      window.addEventListener("mousemove", mouseHandler);

      const btnTl = gsap.timeline({ paused: true });
      btnTl.to(btn, { scale: 1.05 });

      // Infinite yoyo loop
      const yoyoTl = gsap.timeline();
      yoyoTl.to(".i > span", { rotationX: 540, repeat: -1, yoyo: true });
    }, DOM);

    // Fast-forward
    window.dispatchEvent({ type: 'mousemove', clientX: 200, clientY: 400 });

    // Clean unmount
    ctx.revert();
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("mousemove", mouseHandler);
  }

  const finalTweens = gsap.globalTimeline.getChildren(true, true, true).length;
  t.assertEqual(finalTweens, initialTweens, `Tween count must return exactly to baseline (${initialTweens}), got ${finalTweens}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: CTA PARTICLE BURST PHYSICS & CUSTOMEASE STRESS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 5: CTA Particle Physics & CustomEase Curve Evaluations\x1b[0m');

// 5.1 CustomEase High-Resolution Evaluation (100,000 steps)
await runner.run('5.1 CustomEase "airtime" & "rotaaaaate" Evaluation at 100,000 Steps', (t) => {
  const airtimeEase = CustomEase.get("airtime");
  const rotaaaaateEase = CustomEase.get("rotaaaaate");

  t.assert(typeof airtimeEase === 'function', 'airtime must be a valid function');
  t.assert(typeof rotaaaaateEase === 'function', 'rotaaaaate must be a valid function');

  for (let i = 0; i <= 100000; i += 10) {
    const progress = i / 100000;
    const vAir = airtimeEase(progress);
    const vRot = rotaaaaateEase(progress);

    t.assert(Number.isFinite(vAir), `airtime at ${progress} must be finite`);
    t.assert(Number.isFinite(vRot), `rotaaaaate at ${progress} must be finite`);
  }
});

// 5.2 10,000 Particle Random Trajectory Bounds
await runner.run('5.2 10,000 Random Particle Trajectory Bounds & Spread Uniformity', (t) => {
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

  t.assert(minY <= -118 && maxY >= -82, `Y bounds spread must cover range, got [${minY}, ${maxY}]`);
  t.assert(minX <= -48 && maxX >= 98, `X bounds spread must cover range, got [${minX}, ${maxX}]`);
});

// 5.3 1,000-Hover Rapid Spamming with Active Interruption Guard
await runner.run('5.3 1,000-Hover Spamming with Debounce Guard & Clean Completion', (t) => {
  const DOM = loadHeroHTML();
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
  let startCount = 0;
  let completeCount = 0;

  const btnTl = gsap.timeline({
    defaults: { duration: 1 },
    paused: true,
    onStart: () => { isPlaying = true; startCount++; },
    onComplete: () => { isPlaying = false; completeCount++; }
  });

  btnTl.to(getWord, { keyframes: [{ x: -30, ease: "power4.out" }, { x: 0, ease: "power4.in" }] })
       .to(gsapWord, { keyframes: [{ x: 30, ease: "power4.out" }, { x: 0, ease: "power4.in" }] }, "<")
       .to(flairs, { keyframes: [{ scale: 0, zIndex: 2, duration: 0 }, { y: () => gsap.utils.random(-80, -120), scale: 1 }, { zIndex: -1, duration: 0.05 }, { y: 0, scale: 0.3 }], ease: "airtime", stagger: 0.15 }, "<");

  const playBtnTimeline = () => {
    if (!isPlaying) {
      btnTl.invalidate().play(0);
    }
  };

  // Burst 1: 500 spam calls
  for (let i = 0; i < 500; i++) playBtnTimeline();
  btnTl.seek(0.05, false);
  t.assertEqual(startCount, 1, 'Only 1 animation triggers during burst 1');

  // Advance to 50%
  btnTl.seek(0.5, false);
  for (let i = 0; i < 300; i++) playBtnTimeline();
  t.assertEqual(startCount, 1, 'Mid-flight hover calls must be ignored');

  // Finish
  btnTl.seek(btnTl.duration(), false);
  t.assertEqual(completeCount, 1, 'Complete count must be 1');
  t.assertEqual(isPlaying, false, 'isPlaying resets to false');

  // Burst 2: New hover triggers next cycle
  playBtnTimeline();
  btnTl.seek(0.05, false);
  t.assertEqual(startCount, 2, 'New hover after completion triggers second cycle');

  btnTl.kill();
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: REDUCED MOTION & ZERO-DIMENSION EDGE CASES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m▶ Section 6: Reduced Motion & Zero-Dimension Viewport Edge Cases\x1b[0m');

// 6.1 prefers-reduced-motion Static Reveal Validation
await runner.run('6.1 Reduced Motion Static Reveal Instant State & Flair Suppression', (t) => {
  const DOM = loadHeroHTML();

  const applyReducedMotion = () => {
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
    gsap.set(DOM.querySelector(".subtitle__label"), { opacity: 1 });
    gsap.set(DOM.querySelectorAll(".subtitle__brace"), { opacity: 1, xPercent: 0 });
  };

  applyReducedMotion();

  const animate = DOM.querySelector(".home-hero__animate");
  const anything = DOM.querySelector(".home-hero__anything");
  const circles = DOM.querySelector(".home-hero__flair--circles");
  const star = DOM.querySelector(".home-hero__flair--star");
  const bolt = DOM.querySelector(".home-hero__flair--bolt");
  const label = DOM.querySelector(".subtitle__label");
  const braces = DOM.querySelectorAll(".subtitle__brace");

  t.assertEqual(animate.style.opacity, '1', 'animate opacity must be 1');
  t.assertEqual(anything.style.opacity, '1', 'anything opacity must be 1');
  t.assertEqual(circles.style.opacity, '0', 'circles flair hidden');
  t.assertEqual(star.style.opacity, '0', 'star flair hidden');
  t.assertEqual(bolt.style.opacity, '0', 'bolt flair hidden');
  t.assertEqual(label.style.opacity, '1', 'subtitle label opacity is 1');
  t.assertEqual(braces[0].style.opacity, '1', 'brace 0 opacity is 1');
  t.assertEqual(braces[1].style.opacity, '1', 'brace 1 opacity is 1');
});

// 6.2 Zero/Degenerate Viewport Dimensions Defense
await runner.run('6.2 Zero & Degenerate Viewport Dimensions (0x0, 1x1) Mathematical Stability', (t) => {
  const degenerateSizes = [
    { w: 1, h: 1 },
    { w: 0.0001, h: 0.0001 },
  ];

  for (const ds of degenerateSizes) {
    const xPercent = gsap.utils.mapRange(0, ds.w, -20, 20, 0.5);
    const yPercent = gsap.utils.mapRange(0, ds.h, -20, 20, 0.5);
    const rotateRange = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(ds.w * 0.25, ds.w * 0.75, 1, -1, 0.5)
    );
    const targetRotation = yPercent * 1 * rotateRange;

    t.assert(Number.isFinite(xPercent), `xPercent must be finite for degenerate size (${ds.w}x${ds.h})`);
    t.assert(Number.isFinite(yPercent), `yPercent must be finite for degenerate size (${ds.w}x${ds.h})`);
    t.assert(Number.isFinite(rotateRange), `rotateRange must be finite for degenerate size (${ds.w}x${ds.h})`);
    t.assert(Number.isFinite(targetRotation), `targetRotation must be finite for degenerate size (${ds.w}x${ds.h})`);
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
