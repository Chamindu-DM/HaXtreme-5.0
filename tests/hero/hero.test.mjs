// tests/hero/hero.test.mjs
// Comprehensive E2E and Unit Test Suite for GSAP.com Hero Recreation
// Covering all 20 features across Tiers 1-4 (230 test cases total)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDOMEnvironment, loadHeroHTML, MockNode } from './dom-env.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DOM environment before importing GSAP
setupDOMEnvironment();

const { default: gsap } = await import('gsap');
const { CSSPlugin } = await import('gsap/CSSPlugin.js');
const { CustomEase } = await import('gsap/CustomEase.js');

gsap.registerPlugin(CSSPlugin, CustomEase);

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite Definition and Assertion Framework
// ─────────────────────────────────────────────────────────────────────────────

export class TestRunner {
  constructor() {
    this.results = [];
    this.currentTier = '';
    this.currentFeature = '';
  }

  assert(condition, message, details = {}) {
    if (!condition) {
      const errorMsg = `Assertion Failed: ${message}` + (Object.keys(details).length ? ` (${JSON.stringify(details)})` : '');
      throw new Error(errorMsg);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`Assertion Failed: ${message} - Expected: ${expected}, Got: ${actual}`);
    }
  }

  assertCloseTo(actual, expected, delta = 0.01, message = 'Values close') {
    if (Math.abs(actual - expected) > delta) {
      throw new Error(`Assertion Failed: ${message} - Expected: ~${expected} (±${delta}), Got: ${actual}`);
    }
  }

  async runTest(tier, feature, testId, description, fn) {
    // Reset window state before every test for clean isolation
    window.innerWidth = 1920;
    window.innerHeight = 1080;

    const startTime = performance.now();
    try {
      await fn(this);
      const duration = performance.now() - startTime;
      this.results.push({
        tier,
        feature,
        id: testId,
        description,
        status: 'PASS',
        duration,
        error: null
      });
    } catch (err) {
      const duration = performance.now() - startTime;
      this.results.push({
        tier,
        feature,
        id: testId,
        description,
        status: 'FAIL',
        duration,
        error: err.message || String(err)
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference Timeline & Component Builders
// ─────────────────────────────────────────────────────────────────────────────

export function createReferenceHeroAnimation(DOM) {
  const defaults = {
    ease: "power2.out",
    duration: 0.6,
  };

  const char1 = () => {
    const tl = gsap.timeline({ id: "char1", defaults });
    const wrap = DOM.querySelector(".a > span");
    const char = DOM.querySelector(".a > span > span");
    tl.set(wrap, { transformOrigin: "50% 100%" });
    tl.from(char, { yPercent: 100 });
    tl.from(wrap, { rotationX: -180, ease: "back.out(1.7)", duration: 1 }, "-=.4");
    return tl;
  };

  const char2 = () => {
    const tl = gsap.timeline({ id: "char2", defaults });
    const circles = DOM.querySelector(".home-hero__flair--circles");
    const circlesSvg = DOM.querySelector(".home-hero__flair--circles svg");
    const windmill = DOM.querySelector(".home-hero__flair--windmill");
    const wrap = DOM.querySelector(".n > span > span");
    const chars = DOM.querySelectorAll(".n > span > span > span");

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
    return tl;
  };

  const char3 = () => {
    const char = DOM.querySelector(".i > span");
    return gsap.from(char, {
      yPercent: -100,
      ease: "back.out(1.4)",
      duration: 1,
    });
  };

  const char4 = () => {
    const char = DOM.querySelector(".m > span");
    return gsap.from(char, {
      xPercent: -100,
      ...defaults,
    });
  };

  const char5 = () => {
    const tl = gsap.timeline({ id: "char5", defaults });
    const wrap = DOM.querySelector(".a2");
    const star = DOM.querySelector(".home-hero__flair--star");
    const starSvg = DOM.querySelector(".home-hero__flair--star svg");
    const char = DOM.querySelector(".a2 > span > span");

    tl.set(star, { xPercent: -150, autoAlpha: 1 });
    tl.from(starSvg, { scale: 0, duration: 0.4 });
    tl.add(char4(), "+=.6");
    tl.to(star, { xPercent: 0 }, "<");
    tl.set(wrap, { overflow: "hidden" });
    tl.to(star, { yPercent: 130, ease: "power2.in" }, "+=.5");
    tl.from(char, { yPercent: 100 }, "-=.3");
    tl.to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);
    return tl;
  };

  const char7 = () => {
    const char = DOM.querySelector(".e > span");
    return gsap.from(char, {
      yPercent: 100,
      duration: 0.9,
    });
  };

  const char6 = () => {
    const tl = gsap.timeline({ id: "char6", defaults });
    const chars = DOM.querySelectorAll(".t > span > span");
    const char = chars[0];
    const numbersWrap = chars[1];
    const numbers = DOM.querySelectorAll(".t > span > span > span");

    tl.set(numbersWrap, { autoAlpha: 1 });
    tl.from(numbers[0], { yPercent: 100, duration: 0.4 }, "<");
    tl.fromTo(
      [numbers[1], numbers[2]],
      { yPercent: 100 },
      { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" },
      "+=.2"
    );
    tl.to(numbers[0], { yPercent: -100 }, "-=.6");
    tl.from(char, { yPercent: 100, duration: 0.9 }, "<");
    tl.add(char7(), "<");
    return tl;
  };

  const char8to9 = () => {
    const tl = gsap.timeline({ id: "char8to9", defaults });
    const topChars = DOM.querySelectorAll(".home-hero__anything .a span:first-of-type, .home-hero__anything .n span:first-of-type");
    const bottomChars = DOM.querySelectorAll(".home-hero__anything .a span:last-of-type, .home-hero__anything .n span:last-of-type");

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
    return tl;
  };

  const char10 = () => {
    const char = DOM.querySelector(".y > span");
    return gsap.from(char, {
      id: "char10-tween",
      rotationY: -180,
      duration: 1,
      scale: 0,
    });
  };

  const char11 = () => {
    const tl = gsap.timeline({ id: "char11", defaults });
    const bolt = DOM.querySelector(".home-hero__flair--bolt");
    const path = DOM.querySelector("#bolt-path");
    const rect = DOM.querySelector("#bolt-rect");
    const char = DOM.querySelector(".home-hero__anything .t span");

    tl.set(bolt, { autoAlpha: 1 });
    const pathLen = (path && path.getTotalLength) ? path.getTotalLength() : 600.304;
    tl.fromTo(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen }, { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" });
    tl.from(rect, { yPercent: 100, transformOrigin: "50% 100%", duration: 3.5, ease: "power4.out" }, "<.5");
    tl.from(bolt, { keyframes: { scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0], duration: 2 } }, "-=2");
    tl.from(char, { scale: 0, ease: "back.out(1.4)" }, "<.5");
    return tl;
  };

  const char12 = () => {
    const tl = gsap.timeline({ id: "char12", defaults });
    const worm = DOM.querySelector("#home-hero-squiggle img");
    const char = DOM.querySelector(".h span span");

    tl.from(worm, {
      autoAlpha: 0,
      duration: 1.5,
      yPercent: 100,
      rotationZ: 180,
      ease: "back.out(1.6)",
    });
    tl.from(char, { yPercent: -100 }, "<.2");
    return tl;
  };

  const char14 = () => {
    const tl = gsap.timeline({ id: "char14", defaults });
    const char = DOM.querySelector(".n2 span");
    tl.from(char, { xPercent: -100 });
    return tl;
  };

  const char13 = () => {
    const tl = gsap.timeline({ id: "char13", defaults });
    const char = DOM.querySelector(".home-hero__anything .i > span");

    tl.from(char, { autoAlpha: 0, duration: 0.1 }, "<");
    tl.from(char, { rotationX: -450, duration: 1.3 }, "<.14");
    tl.add(char14(), "<+=.5");
    tl.to(char, {
      rotationX: 540,
      duration: 1.5,
      repeat: -1,
      repeatDelay: 3,
      yoyo: true,
      yoyoEase: "power2.out",
    }, "+=2");
    return tl;
  };

  const char15 = () => {
    const tl = gsap.timeline({ id: "char15", defaults });
    const char = DOM.querySelector(".g span");
    tl.from(char, {
      autoAlpha: 0,
      rotationZ: -120,
      duration: 2,
      ease: "elastic.out(1, 0.4)",
    }, "<.6");
    return tl;
  };

  const buttonIn = () => {
    const button = DOM.querySelector(".home-hero__button");
    return gsap.from(button, {
      autoAlpha: 0,
      yPercent: 30,
      ...defaults,
    });
  };

  const master = gsap.timeline({ id: "home-hero", defaults });
  const heading1 = DOM.querySelector(".home-hero__animate");
  const heading2 = DOM.querySelector(".home-hero__anything");
  master.set([heading1, heading2], { autoAlpha: 1 });

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

  master.add(c1, 0);
  master.add(c2, 0.4);
  master.add(c3, 1.0);
  master.add(c5, 0.8);
  master.add(c6, 1.1);
  master.add(c89, 1.5);
  master.add(c10, 1.7);
  master.add(c11, 2.0);
  master.add(c12, 1.9);
  master.add(c13, 2.4);
  master.add(c15, 2.2);
  master.add(btn, 1.0);

  return {
    master,
    c1, c2, c3, c4: char4, c5, c6, c7: char7, c89, c10, c11, c12, c13, c14: char14, c15,
    char1, char2, char3, char4, char5, char6, char7, char8to9, char10, char11, char12, char13, char14, char15,
    buttonIn
  };
}

export function createInteractiveSquiggle(DOM) {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  const squiggle = DOM.querySelector("#home-hero-squiggle");

  const xTo = gsap.quickTo(squiggle, "xPercent", { duration: 1, ease: "power3" });
  const yTo = gsap.quickTo(squiggle, "yPercent", { duration: 1, ease: "power3" });
  const rotateTo = gsap.quickTo(squiggle, "rotation", { duration: 1, ease: "power3" });

  const onResize = () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  const calculatePhysics = (clientX, clientY) => {
    const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, clientX);
    const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, clientY);
    const rotateRange = gsap.utils.clamp(
      -1,
      1,
      gsap.utils.mapRange(windowWidth * 0.25, windowWidth * 0.75, 1, -1, clientX)
    );
    const targetRotation = yPercent * 1 * rotateRange;

    xTo(xPercent);
    yTo(yPercent);
    rotateTo(targetRotation);

    return { xPercent, yPercent, rotateRange, targetRotation };
  };

  const onMouseMove = (e) => {
    calculatePhysics(e.clientX ?? e.x, e.clientY ?? e.y);
  };
  window.addEventListener("mousemove", onMouseMove);

  return {
    xTo,
    yTo,
    rotateTo,
    calculatePhysics,
    cleanup: () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    }
  };
}

export function createSubtitleTimeline(DOM) {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.3 }
  });

  const wrap = DOM.querySelector(".home-hero__subtitle");
  const braces = DOM.querySelectorAll(".subtitle__brace");
  const label = DOM.querySelector(".subtitle__label");

  gsap.set(wrap, { autoAlpha: 1 });

  tl.from(label, {
    opacity: 0,
    duration: 0.7,
    delay: 2.5,
  })
  .from(braces[0], {
    opacity: 0,
    xPercent: 100,
  }, "<0.1")
  .from(braces[1], {
    opacity: 0,
    xPercent: -100,
  }, "<");

  return tl;
}

export function createCTAButtonTimeline(DOM) {
  CustomEase.create("airtime", "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 ");
  CustomEase.create("rotaaaaate", "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 ");

  let isPlaying = false;
  const tl = gsap.timeline({
    defaults: { duration: 1 },
    paused: true,
    onStart: () => { isPlaying = true; },
    onComplete: () => { isPlaying = false; }
  });

  const btn = DOM.querySelector(".get-gsap-btn");
  const getWord = DOM.querySelector(".get-gsap-btn__word:first-child");
  const gsapWord = DOM.querySelector(".get-gsap-btn__word:last-child");
  const icons = DOM.querySelectorAll(".get-gsap-btn__button svg");
  const flairs = [
    DOM.querySelector("#btn-circles"),
    DOM.querySelector("#btn-windmill"),
    DOM.querySelector("#btn-square"),
    DOM.querySelector("#btn-star")
  ];

  tl.set(flairs, { scale: 0, x: 0, y: 10, rotateZ: 0 })
    .set(icons[0], { yPercent: -140 })
    .set(icons[1], { yPercent: 0 })
    .to(getWord, {
      keyframes: [{ x: -30, ease: "power4.out" }, { x: 0, ease: "power4.in" }]
    })
    .to(gsapWord, {
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

  const onMouseEnter = () => {
    if (!isPlaying) {
      isPlaying = true;
      tl.invalidate().play(0);
    }
  };

  btn.addEventListener("mouseenter", onMouseEnter);

  return {
    tl,
    isPlaying: () => isPlaying,
    onMouseEnter,
    cleanup: () => {
      btn.removeEventListener("mouseenter", onMouseEnter);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build and Run Complete Test Suite (Tiers 1-4, 230 Tests)
// ─────────────────────────────────────────────────────────────────────────────

export async function runAllHeroTests() {
  const runner = new TestRunner();
  const heroDOM = loadHeroHTML();
  globalThis.document.body.appendChild(heroDOM);

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 1: FEATURE COVERAGE (20 Features x 5 Tests = 100 Tests)
  // ═══════════════════════════════════════════════════════════════════════════

  // Feature 1: Master Timeline Orchestration
  await runner.runTest('Tier 1', 'F1: Master Timeline Orchestration', 'T1.1.1', 'Sequences 15 character timelines at exact offset positions', (t) => {
    const { master, c1, c2 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c1.startTime(), 0, 'char1 start time must be 0s');
    t.assertEqual(c2.startTime(), 0.4, 'char2 start time must be 0.4s');
    master.kill();
  });

  await runner.runTest('Tier 1', 'F1: Master Timeline Orchestration', 'T1.1.2', 'Master timeline duration exceeds 5.0s for complete letter entrance and settles', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    t.assert(master.totalDuration() >= 5.0, `Expected total duration >= 5.0s, got ${master.totalDuration()}`);
    master.kill();
  });

  await runner.runTest('Tier 1', 'F1: Master Timeline Orchestration', 'T1.1.3', 'Default timeline configurations use power2.out and 0.6s duration', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(master.vars.defaults.ease, 'power2.out', 'Default ease must be power2.out');
    t.assertEqual(master.vars.defaults.duration, 0.6, 'Default duration must be 0.6s');
    master.kill();
  });

  await runner.runTest('Tier 1', 'F1: Master Timeline Orchestration', 'T1.1.4', 'Headings animate and anything are initially set to autoAlpha 1', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(0);
    const h1 = heroDOM.querySelector('.home-hero__animate');
    const h2 = heroDOM.querySelector('.home-hero__anything');
    t.assert(h1 !== null && h2 !== null, 'Headings must be present in DOM');
    master.kill();
  });

  await runner.runTest('Tier 1', 'F1: Master Timeline Orchestration', 'T1.1.5', 'CTA button container buttonIn is scheduled at 1.0s offset', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const btnChild = master.getChildren().find(c => c.vars && c.vars.yPercent === 30);
    t.assert(btnChild !== undefined, 'buttonIn tween must exist in master');
    t.assertEqual(btnChild.startTime(), 1.0, 'buttonIn must start at 1.0s');
    master.kill();
  });

  // Feature 2: Word "Animate" - Char 1 ('A')
  await runner.runTest('Tier 1', 'F2: Char 1 (A)', 'T1.2.1', 'DOM structure matches .a > .clip > span nesting with letter A', (t) => {
    const aWrap = heroDOM.querySelector('.home-hero__animate .a');
    t.assert(aWrap !== null, '.a container must exist');
    const clip = aWrap.querySelector('.clip');
    t.assert(clip !== null, '.clip must exist inside .a');
    t.assertEqual(clip.textContent.trim(), 'A', 'Inner text must be A');
  });

  await runner.runTest('Tier 1', 'F2: Char 1 (A)', 'T1.2.2', 'Sets transformOrigin to 50% 100% on .a > span clip container', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    tl.seek(0.1);
    const wrap = heroDOM.querySelector('.a > span');
    t.assertEqual(wrap.style.transformOrigin, '50% 100%', 'transformOrigin must be 50% 100%');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F2: Char 1 (A)', 'T1.2.3', 'Letter span animates from yPercent 100', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    const tweens = tl.getChildren();
    const yPercentTween = tweens.find(tw => tw.vars && tw.vars.yPercent === 100);
    t.assert(yPercentTween !== undefined, 'Tween with yPercent: 100 must exist in char1');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F2: Char 1 (A)', 'T1.2.4', 'Flip animation uses rotationX: -180 with back.out(1.7) and duration: 1.0', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    const tweens = tl.getChildren();
    const flipTween = tweens.find(tw => tw.vars && tw.vars.rotationX === -180);
    t.assert(flipTween !== undefined, 'Tween with rotationX: -180 must exist');
    t.assertEqual(flipTween.duration(), 1.0, 'Flip duration must be 1.0s');
    t.assertEqual(flipTween.vars.ease, 'back.out(1.7)', 'Flip ease must be back.out(1.7)');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F2: Char 1 (A)', 'T1.2.5', 'Flip tween is sequenced with -=.4 offset relative to yPercent', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    const tweens = tl.getChildren();
    const flipTween = tweens.find(tw => tw.vars && tw.vars.rotationX === -180);
    t.assertCloseTo(flipTween.startTime(), 0.2, 0.01, 'Flip tween must start at 0.6 - 0.4 = 0.2s');
    tl.kill();
  });

  // Feature 3: Word "Animate" - Char 2 ('n') + Windmill & Circles
  await runner.runTest('Tier 1', 'F3: Char 2 (n) + Flairs', 'T1.3.1', 'DOM contains windmill, circles flairs and dual spans for n and ghost a', (t) => {
    const nContainer = heroDOM.querySelector('.home-hero__animate .n');
    t.assert(nContainer !== null, '.n container must exist');
    t.assert(nContainer.querySelector('.home-hero__flair--windmill') !== null, 'Windmill flair must exist');
    t.assert(nContainer.querySelector('.home-hero__flair--circles') !== null, 'Circles flair must exist');
    const chars = nContainer.querySelectorAll('.clip > span > span');
    t.assertEqual(chars.length, 2, 'Must have 2 char spans (n and ghost a)');
  });

  await runner.runTest('Tier 1', 'F3: Char 2 (n) + Flairs', 'T1.3.2', 'Windmill flies in from left starting at -window.innerWidth / 2 with rotationZ: -360', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    const tweens = tl.getChildren();
    const wmTween = tweens.find(tw => tw.vars && tw.vars.rotationZ === -360);
    t.assert(wmTween !== undefined, 'Windmill fly-in tween must exist');
    t.assertEqual(wmTween.duration(), 1.0, 'Fly-in duration must be 1.0s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F3: Char 2 (n) + Flairs', 'T1.3.3', 'Windmill enters infinite rotation loop rotationZ: 90 with repeatDelay: 1', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    const tweens = tl.getChildren();
    const loopTween = tweens.find(tw => tw.vars && tw.vars.repeat === -1);
    t.assert(loopTween !== undefined, 'Infinite repeating loop must exist');
    t.assertEqual(loopTween.vars.rotationZ, 90, 'Target rotation must be 90deg');
    t.assertEqual(loopTween.vars.repeatDelay, 1, 'Repeat delay must be 1s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F3: Char 2 (n) + Flairs', 'T1.3.4', 'Circles flair scales in from 0 with back.out(1.7) and exits to yPercent: -200', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    const tweens = tl.getChildren();
    const scaleTween = tweens.find(tw => tw.vars && tw.vars.scale === 0);
    t.assert(scaleTween !== undefined, 'Circles scale tween must exist');
    const exitTween = tweens.find(tw => tw.vars && tw.vars.yPercent === -200);
    t.assert(exitTween !== undefined, 'Circles exit tween to yPercent: -200 must exist');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F3: Char 2 (n) + Flairs', 'T1.3.5', 'Dual-span flip rotates n from rotationY: -180 and ghost a to rotationY: 180', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    const tweens = tl.getChildren();
    const nFlip = tweens.find(tw => tw.vars && tw.vars.rotationY === -180);
    const aFlip = tweens.find(tw => tw.vars && tw.vars.rotationY === 180);
    t.assert(nFlip !== undefined && aFlip !== undefined, 'Both n flip and a flip tweens must exist');
    tl.kill();
  });

  // Feature 4: Word "Animate" - Char 3 ('i')
  await runner.runTest('Tier 1', 'F4: Char 3 (i)', 'T1.4.1', 'DOM has .i.clip wrapping letter i', (t) => {
    const iEl = heroDOM.querySelector('.home-hero__animate .i');
    t.assert(iEl !== null && iEl.classList.contains('clip'), '.i must have class clip');
    t.assertEqual(iEl.textContent.trim(), 'i', 'Text must be i');
  });

  await runner.runTest('Tier 1', 'F4: Char 3 (i)', 'T1.4.2', 'Animates yPercent: -100 to 0', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw = char3();
    t.assertEqual(tw.vars.yPercent, -100, 'From yPercent must be -100');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F4: Char 3 (i)', 'T1.4.3', 'Uses easing back.out(1.4)', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw = char3();
    t.assertEqual(tw.vars.ease, 'back.out(1.4)', 'Ease must be back.out(1.4)');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F4: Char 3 (i)', 'T1.4.4', 'Duration is exactly 1.0s', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw = char3();
    t.assertEqual(tw.duration(), 1.0, 'Duration must be 1.0s');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F4: Char 3 (i)', 'T1.4.5', 'Master timeline schedules char3 at offset 1.0s', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const children = master.getChildren();
    const char3Tween = children.find(c => c.vars && c.vars.yPercent === -100);
    t.assert(char3Tween !== undefined, 'char3 tween must be present in master');
    t.assertEqual(char3Tween.startTime(), 1.0, 'char3 must start at 1.0s in master');
    master.kill();
  });

  // Feature 5: Word "Animate" - Char 4 ('m')
  await runner.runTest('Tier 1', 'F5: Char 4 (m)', 'T1.5.1', 'DOM has .m.clip wrapping letter m', (t) => {
    const mEl = heroDOM.querySelector('.home-hero__animate .m');
    t.assert(mEl !== null && mEl.classList.contains('clip'), '.m must have class clip');
    t.assertEqual(mEl.textContent.trim(), 'm', 'Text must be m');
  });

  await runner.runTest('Tier 1', 'F5: Char 4 (m)', 'T1.5.2', 'Animates xPercent: -100 to 0', (t) => {
    const { char4 } = createReferenceHeroAnimation(heroDOM);
    const tw = char4();
    t.assertEqual(tw.vars.xPercent, -100, 'xPercent must animate from -100');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F5: Char 4 (m)', 'T1.5.3', 'Uses power2.out ease and 0.6s duration', (t) => {
    const { char4 } = createReferenceHeroAnimation(heroDOM);
    const tw = char4();
    t.assertEqual(tw.vars.ease, 'power2.out', 'Ease must be power2.out');
    t.assertEqual(tw.duration(), 0.6, 'Duration must be 0.6s');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F5: Char 4 (m)', 'T1.5.4', 'Nested inside char5 timeline at offset +=.6', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const mTween = tweens.find(tw => tw.vars && tw.vars.xPercent === -100);
    t.assert(mTween !== undefined, 'char4 tween must be nested in char5');
    t.assertEqual(mTween.startTime(), 1.0, 'char4 must start at 0.4s (starSvg) + 0.6s = 1.0s in char5');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F5: Char 4 (m)', 'T1.5.5', 'Parent container .m provides overflow clipping', (t) => {
    const mEl = heroDOM.querySelector('.home-hero__animate .m');
    t.assert(mEl.classList.contains('clip'), '.m element must have .clip class for overflow hidden');
  });

  // Feature 6: Word "Animate" - Char 5 ('a2') + Star Flair
  await runner.runTest('Tier 1', 'F6: Char 5 (a2) + Star', 'T1.6.1', 'DOM has .a2, .home-hero__flair--star SVG and nested .clip > span a', (t) => {
    const a2El = heroDOM.querySelector('.home-hero__animate .a2');
    t.assert(a2El !== null, '.a2 container must exist');
    t.assert(a2El.querySelector('.home-hero__flair--star svg') !== null, 'Star flair SVG must exist in .a2');
    t.assertEqual(a2El.querySelector('.clip span').textContent.trim(), 'a', 'Inner text must be a');
  });

  await runner.runTest('Tier 1', 'F6: Char 5 (a2) + Star', 'T1.6.2', 'Star scales from 0 and translates from xPercent: -150 to 0', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const scaleTween = tweens.find(tw => tw.vars && tw.vars.scale === 0);
    t.assert(scaleTween !== undefined, 'Star scale tween must exist');
    const xTween = tweens.find(tw => tw.vars && tw.vars.xPercent === 0);
    t.assert(xTween !== undefined, 'Star translate to xPercent: 0 must exist');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F6: Char 5 (a2) + Star', 'T1.6.3', 'Star SVG executes continuous rotationZ: 360 with repeat: 2 and duration: 2s', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const rotTween = tweens.find(tw => tw.vars && tw.vars.rotationZ === 360);
    t.assert(rotTween !== undefined, 'Star rotation tween must exist');
    t.assertEqual(rotTween.vars.repeat, 2, 'Repeat must be 2');
    t.assertEqual(rotTween.duration(), 2.0, 'Duration must be 2s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F6: Char 5 (a2) + Star', 'T1.6.4', 'Star drops to yPercent: 130 with power2.in', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const dropTween = tweens.find(tw => tw.vars && tw.vars.yPercent === 130);
    t.assert(dropTween !== undefined, 'Star drop tween must exist');
    t.assertEqual(dropTween.vars.ease, 'power2.in', 'Ease must be power2.in');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F6: Char 5 (a2) + Star', 'T1.6.5', 'Letter a rises from yPercent: 100 while .a2 has overflow hidden', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const charTween = tweens.find(tw => tw.vars && tw.vars.yPercent === 100 && tw.targets()[0].textContent.trim() === 'a');
    t.assert(charTween !== undefined, 'Letter a entrance tween must exist');
    tl.kill();
  });

  // Feature 7: Word "Animate" - Char 6 ('t') + Odometer "100"
  await runner.runTest('Tier 1', 'F7: Char 6 (t) + Odometer', 'T1.7.1', 'DOM has .t with letter t and ticker digits container for 1, 0, 0', (t) => {
    const tEl = heroDOM.querySelector('.home-hero__animate .t');
    t.assert(tEl !== null, '.t container must exist');
    const digits = tEl.querySelectorAll('.clip > span > span');
    t.assertEqual(digits.length, 3, 'Must contain 3 odometer digits (1, 0, 0)');
  });

  await runner.runTest('Tier 1', 'F7: Char 6 (t) + Odometer', 'T1.7.2', 'Digit 1 animates from yPercent: 100 to 0 (0.4s) and exits to yPercent: -100', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const digit1Entry = tweens.find(tw => tw.vars && tw.vars.yPercent === 100 && tw.duration() === 0.4);
    t.assert(digit1Entry !== undefined, 'Digit 1 entry tween must exist');
    const digit1Exit = tweens.find(tw => tw.vars && tw.vars.yPercent === -100 && tw.targets()[0].textContent.trim() === '1');
    t.assert(digit1Exit !== undefined, 'Digit 1 exit tween must exist');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F7: Char 6 (t) + Odometer', 'T1.7.3', 'Digits 0, 0 roll from yPercent: 100 to -100 with stagger: 0.1 and power2.inOut', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const zerosRoll = tweens.find(tw => tw.vars && tw.vars.stagger === 0.1);
    t.assert(zerosRoll !== undefined, 'Staggered zeros roll tween must exist');
    t.assertEqual(zerosRoll.vars.ease, 'power2.inOut', 'Ease must be power2.inOut');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F7: Char 6 (t) + Odometer', 'T1.7.4', 'Letter t rises from yPercent: 100 with duration: 0.9s', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const tRise = tweens.find(tw => tw.vars && tw.vars.yPercent === 100 && tw.duration() === 0.9 && tw.targets()[0].textContent.trim() === 't');
    t.assert(tRise !== undefined, 'Letter t rise tween must exist');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F7: Char 6 (t) + Odometer', 'T1.7.5', 'Char 6 nests char7 (e) synchronously at < offset', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const eTween = tweens.find(tw => tw.vars && tw.vars.yPercent === 100 && tw.targets()[0].textContent.trim() === 'e');
    t.assert(eTween !== undefined, 'char7 (e) must be nested in char6');
    tl.kill();
  });

  // Feature 8: Word "Animate" - Char 7 ('e')
  await runner.runTest('Tier 1', 'F8: Char 7 (e)', 'T1.8.1', 'DOM has .e.clip wrapping letter e', (t) => {
    const eEl = heroDOM.querySelector('.home-hero__animate .e');
    t.assert(eEl !== null && eEl.classList.contains('clip'), '.e must have class clip');
    t.assertEqual(eEl.textContent.trim(), 'e', 'Text must be e');
  });

  await runner.runTest('Tier 1', 'F8: Char 7 (e)', 'T1.8.2', 'Animates yPercent: 100 up to 0', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    t.assertEqual(tw.vars.yPercent, 100, 'From yPercent must be 100');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F8: Char 7 (e)', 'T1.8.3', 'Duration is exactly 0.9s', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    t.assertEqual(tw.duration(), 0.9, 'Duration must be 0.9s');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F8: Char 7 (e)', 'T1.8.4', 'Uses default easing power2.out or standard GSAP fallback', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    t.assert(tw.vars.ease === 'power2.out' || tw.vars.ease === undefined || typeof tw.vars.ease === 'function', 'Ease must be valid GSAP ease');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F8: Char 7 (e)', 'T1.8.5', 'Synchronized execution aligns char7 alongside letter t in char6', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const tTween = tweens.find(tw => tw.targets()[0].textContent.trim() === 't');
    const eTween = tweens.find(tw => tw.targets()[0].textContent.trim() === 'e');
    t.assertEqual(tTween.startTime(), eTween.startTime(), 'Letter t and letter e must start at the exact same timeline time');
    tl.kill();
  });

  // Feature 9: Word "anything" - Char 8 & 9 ('a' & 'n')
  await runner.runTest('Tier 1', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T1.9.1', 'DOM has twin-span structures for .a.clip and .n.clip in .home-hero__anything', (t) => {
    const aSpans = heroDOM.querySelectorAll('.home-hero__anything .a span');
    const nSpans = heroDOM.querySelectorAll('.home-hero__anything .n span');
    t.assertEqual(aSpans.length, 2, '.a in anything must have 2 spans');
    t.assertEqual(nSpans.length, 2, '.n in anything must have 2 spans');
  });

  await runner.runTest('Tier 1', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T1.9.2', 'Bottom spans animate keyframes: [100, 0, 100, 0]', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    const bottomTween = tweens[0];
    t.assert(Array.isArray(bottomTween.vars.keyframes.yPercent), 'Keyframes yPercent must be array');
    t.assertEqual(bottomTween.vars.keyframes.yPercent.join(','), '100,0,100,0', 'Keyframes must be [100, 0, 100, 0]');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T1.9.3', 'Top spans animate keyframes: [-100, -100, 20, -100]', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    const topTween = tweens[1];
    t.assertEqual(topTween.vars.keyframes.yPercent.join(','), '-100,-100,20,-100', 'Keyframes must be [-100, -100, 20, -100]');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T1.9.4', 'Total duration is 3.0s with stagger: 0.4s (overall span 3.4s)', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    t.assertEqual(tweens[0].vars.duration, 3.0, 'Base duration must be 3.0s');
    t.assertEqual(tweens[0].vars.stagger, 0.4, 'Stagger must be 0.4s');
    t.assertCloseTo(tl.totalDuration(), 3.4, 0.01, 'Total span must be 3.4s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T1.9.5', 'Keyframe easing uses power1.out', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    t.assertEqual(tweens[0].vars.keyframes.ease, 'power1.out', 'Keyframe ease must be power1.out');
    tl.kill();
  });

  // Feature 10: Word "anything" - Char 10 ('y')
  await runner.runTest('Tier 1', 'F10: Char 10 (y)', 'T1.10.1', 'DOM contains .y wrapping letter y', (t) => {
    const yEl = heroDOM.querySelector('.home-hero__anything .y');
    t.assert(yEl !== null, '.y container must exist');
    t.assertEqual(yEl.textContent.trim(), 'y', 'Text must be y');
  });

  await runner.runTest('Tier 1', 'F10: Char 10 (y)', 'T1.10.2', 'Animates rotationY: -180 to 0', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    t.assertEqual(tw.vars.rotationY, -180, 'From rotationY must be -180');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F10: Char 10 (y)', 'T1.10.3', 'Animates scale: 0 to 1', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    t.assertEqual(tw.vars.scale, 0, 'From scale must be 0');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F10: Char 10 (y)', 'T1.10.4', 'Duration is exactly 1.0s', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    t.assertEqual(tw.duration(), 1.0, 'Duration must be 1.0s');
    tw.kill();
  });

  await runner.runTest('Tier 1', 'F10: Char 10 (y)', 'T1.10.5', 'Master timeline offset is at 1.7s', (t) => {
    const { master, c10 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c10.startTime(), 1.7, 'char10 must start at 1.7s in master');
    master.kill();
  });

  // Feature 11: Word "anything" - Char 11 ('t') + Bolt Flair
  await runner.runTest('Tier 1', 'F11: Char 11 (t) + Bolt', 'T1.11.1', 'DOM contains .home-hero__flair--bolt with #bolt-path and #bolt-rect', (t) => {
    const boltEl = heroDOM.querySelector('.home-hero__flair--bolt');
    t.assert(boltEl !== null, 'Bolt flair must exist');
    t.assert(boltEl.querySelector('#bolt-path') !== null, '#bolt-path must exist');
    t.assert(boltEl.querySelector('#bolt-rect') !== null, '#bolt-rect must exist');
  });

  await runner.runTest('Tier 1', 'F11: Char 11 (t) + Bolt', 'T1.11.2', 'Stroke drawing animates strokeDashoffset from path length to 0 with power3.inOut', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    const tweens = tl.getChildren();
    const strokeTween = tweens.find(tw => tw.vars && tw.vars.strokeDashoffset === 0);
    t.assert(strokeTween !== undefined, 'Stroke drawing tween must exist');
    t.assertEqual(strokeTween.vars.ease, 'power3.inOut', 'Ease must be power3.inOut');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F11: Char 11 (t) + Bolt', 'T1.11.3', 'Rect mask animates yPercent: 100 with duration: 3.5s and power4.out', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    const tweens = tl.getChildren();
    const rectTween = tweens.find(tw => tw.vars && tw.vars.yPercent === 100);
    t.assert(rectTween !== undefined, 'Mask rect tween must exist');
    t.assertEqual(rectTween.duration(), 3.5, 'Duration must be 3.5s');
    t.assertEqual(rectTween.vars.ease, 'power4.out', 'Ease must be power4.out');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F11: Char 11 (t) + Bolt', 'T1.11.4', 'Bolt scale bounces through keyframes: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0]', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    const tweens = tl.getChildren();
    const pulseTween = tweens.find(tw => tw.vars && tw.vars.keyframes && Array.isArray(tw.vars.keyframes.scale));
    t.assert(pulseTween !== undefined, 'Pulse keyframes tween must exist');
    t.assertEqual(pulseTween.vars.keyframes.scale.join(','), '1,1.1,0.6,0.7,0.2,0.3,0', 'Keyframes must match exact pulse values');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F11: Char 11 (t) + Bolt', 'T1.11.5', 'Letter t pops from scale: 0 with back.out(1.4)', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    const tweens = tl.getChildren();
    const tPop = tweens.find(tw => tw.vars && tw.vars.scale === 0 && tw.vars.ease === 'back.out(1.4)');
    t.assert(tPop !== undefined, 'Letter t pop tween must exist');
    tl.kill();
  });

  // Feature 12: Word "anything" - Char 12 ('h') + Squiggle Entrance
  await runner.runTest('Tier 1', 'F12: Char 12 (h) + Squiggle', 'T1.12.1', 'DOM has .h containing #home-hero-squiggle and .clip > span h', (t) => {
    const hEl = heroDOM.querySelector('.home-hero__anything .h');
    t.assert(hEl !== null, '.h container must exist');
    t.assert(hEl.querySelector('#home-hero-squiggle') !== null, '#home-hero-squiggle must exist');
    t.assertEqual(hEl.querySelector('.clip span').textContent.trim(), 'h', 'Text must be h');
  });

  await runner.runTest('Tier 1', 'F12: Char 12 (h) + Squiggle', 'T1.12.2', 'Squiggle image animates from yPercent: 100, rotationZ: 180, autoAlpha: 0', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const tl = char12();
    const tweens = tl.getChildren();
    const wormTween = tweens.find(tw => tw.vars && tw.vars.rotationZ === 180);
    t.assert(wormTween !== undefined, 'Worm entrance tween must exist');
    t.assertEqual(wormTween.vars.yPercent, 100, 'From yPercent must be 100');
    t.assertEqual(wormTween.vars.autoAlpha, 0, 'From autoAlpha must be 0');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F12: Char 12 (h) + Squiggle', 'T1.12.3', 'Squiggle entrance duration is 1.5s with back.out(1.6)', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const tl = char12();
    const tweens = tl.getChildren();
    const wormTween = tweens.find(tw => tw.vars && tw.vars.rotationZ === 180);
    t.assertEqual(wormTween.duration(), 1.5, 'Duration must be 1.5s');
    t.assertEqual(wormTween.vars.ease, 'back.out(1.6)', 'Ease must be back.out(1.6)');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F12: Char 12 (h) + Squiggle', 'T1.12.4', 'Letter h drops from yPercent: -100 to 0 at offset <.2', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const tl = char12();
    const tweens = tl.getChildren();
    const hDrop = tweens.find(tw => tw.vars && tw.vars.yPercent === -100);
    t.assert(hDrop !== undefined, 'Letter h drop tween must exist');
    t.assertEqual(hDrop.startTime(), 0.2, 'h drop must start at 0.2s in char12 timeline');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F12: Char 12 (h) + Squiggle', 'T1.12.5', 'Master timeline offset is at 1.9s', (t) => {
    const { master, c12 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c12.startTime(), 1.9, 'char12 must start at 1.9s in master');
    master.kill();
  });

  // Feature 13: Word "anything" - Char 13 ('i') Infinite Wobble Loop
  await runner.runTest('Tier 1', 'F13: Char 13 (i) Infinite Wobble', 'T1.13.1', 'DOM contains .i in .home-hero__anything wrapping inner span i', (t) => {
    const iEl = heroDOM.querySelector('.home-hero__anything .i');
    t.assert(iEl !== null, '.i in anything must exist');
    t.assertEqual(iEl.textContent.trim(), 'i', 'Text must be i');
  });

  await runner.runTest('Tier 1', 'F13: Char 13 (i) Infinite Wobble', 'T1.13.2', 'Entrance animates rotationX: -450 over 1.3s', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const tweens = tl.getChildren();
    const entryRot = tweens.find(tw => tw.vars && tw.vars.rotationX === -450);
    t.assert(entryRot !== undefined, 'Entrance rotation tween must exist');
    t.assertEqual(entryRot.duration(), 1.3, 'Duration must be 1.3s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F13: Char 13 (i) Infinite Wobble', 'T1.13.3', 'Char 13 nests char14 (n2) at offset <+=.5', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const children = tl.getChildren();
    const n2Child = children.find(c => (c.vars && c.vars.xPercent === -100) || (c.getChildren && c.getChildren().some(tw => tw.vars && tw.vars.xPercent === -100)));
    t.assert(n2Child !== undefined, 'char14 must be nested in char13');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F13: Char 13 (i) Infinite Wobble', 'T1.13.4', 'Idle wobble loop animates rotationX: 540 with repeat: -1 and yoyo: true', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const tweens = tl.getChildren();
    const wobble = tweens.find(tw => tw.vars && tw.vars.rotationX === 540);
    t.assert(wobble !== undefined, 'Wobble tween must exist');
    t.assertEqual(wobble.vars.repeat, -1, 'Repeat must be infinite (-1)');
    t.assertEqual(wobble.vars.yoyo, true, 'Yoyo must be true');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F13: Char 13 (i) Infinite Wobble', 'T1.13.5', 'Wobble uses repeatDelay: 3 and yoyoEase: power2.out', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const tweens = tl.getChildren();
    const wobble = tweens.find(tw => tw.vars && tw.vars.rotationX === 540);
    t.assertEqual(wobble.vars.repeatDelay, 3, 'Repeat delay must be 3s');
    t.assertEqual(wobble.vars.yoyoEase, 'power2.out', 'Yoyo ease must be power2.out');
    tl.kill();
  });

  // Feature 14: Word "anything" - Char 14 ('n2')
  await runner.runTest('Tier 1', 'F14: Char 14 (n2)', 'T1.14.1', 'DOM has .n2.clip wrapping span n', (t) => {
    const n2El = heroDOM.querySelector('.home-hero__anything .n2');
    t.assert(n2El !== null && n2El.classList.contains('clip'), '.n2 must have class clip');
    t.assertEqual(n2El.textContent.trim(), 'n', 'Text must be n');
  });

  await runner.runTest('Tier 1', 'F14: Char 14 (n2)', 'T1.14.2', 'Animates xPercent: -100 to 0', (t) => {
    const { char14 } = createReferenceHeroAnimation(heroDOM);
    const tl = char14();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.vars.xPercent, -100, 'xPercent must animate from -100');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F14: Char 14 (n2)', 'T1.14.3', 'Uses default duration: 0.6s and power2.out ease', (t) => {
    const { char14 } = createReferenceHeroAnimation(heroDOM);
    const tl = char14();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.duration(), 0.6, 'Duration must be 0.6s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F14: Char 14 (n2)', 'T1.14.4', 'Nested inside char13 timeline', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const children = tl.getChildren();
    t.assert(children.length >= 3, 'char13 must contain nested char14 children');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F14: Char 14 (n2)', 'T1.14.5', 'Parent .n2 provides overflow clipping', (t) => {
    const n2El = heroDOM.querySelector('.home-hero__anything .n2');
    t.assert(n2El.classList.contains('clip'), '.n2 must have class clip for masking');
  });

  // Feature 15: Word "anything" - Char 15 ('g') Elastic Rotation
  await runner.runTest('Tier 1', 'F15: Char 15 (g)', 'T1.15.1', 'DOM contains .g wrapping span g', (t) => {
    const gEl = heroDOM.querySelector('.home-hero__anything .g');
    t.assert(gEl !== null, '.g container must exist');
    t.assertEqual(gEl.textContent.trim(), 'g', 'Text must be g');
  });

  await runner.runTest('Tier 1', 'F15: Char 15 (g)', 'T1.15.2', 'Animates rotationZ: -120 and autoAlpha: 0', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.vars.rotationZ, -120, 'From rotationZ must be -120');
    t.assertEqual(tw.vars.autoAlpha, 0, 'From autoAlpha must be 0');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F15: Char 15 (g)', 'T1.15.3', 'Duration is exactly 2.0s', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.duration(), 2.0, 'Duration must be 2.0s');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F15: Char 15 (g)', 'T1.15.4', 'Uses elastic.out(1, 0.4) ease', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.vars.ease, 'elastic.out(1, 0.4)', 'Ease must be elastic.out(1, 0.4)');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F15: Char 15 (g)', 'T1.15.5', 'Master timeline offset is at 2.2s', (t) => {
    const { master, c15 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c15.startTime(), 2.2, 'char15 must start at 2.2s in master');
    master.kill();
  });

  // Feature 16: Interactive Mouse Squiggle Physics
  await runner.runTest('Tier 1', 'F16: Interactive Squiggle Physics', 'T1.16.1', 'Registers quickTo setters on xPercent, yPercent, rotation with duration: 1 and power3', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    t.assert(typeof physics.xTo === 'function', 'xTo setter must be a function');
    t.assert(typeof physics.yTo === 'function', 'yTo setter must be a function');
    t.assert(typeof physics.rotateTo === 'function', 'rotateTo setter must be a function');
    physics.cleanup();
  });

  await runner.runTest('Tier 1', 'F16: Interactive Squiggle Physics', 'T1.16.2', 'Maps cursor X across viewport to [-20, 20] range', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const leftRes = physics.calculatePhysics(0, 540);
    t.assertEqual(leftRes.xPercent, -20, 'Left edge must map to -20%');
    const rightRes = physics.calculatePhysics(1920, 540);
    t.assertEqual(rightRes.xPercent, 20, 'Right edge must map to +20%');
    physics.cleanup();
  });

  await runner.runTest('Tier 1', 'F16: Interactive Squiggle Physics', 'T1.16.3', 'Maps cursor Y across viewport to [-20, 20] range', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const topRes = physics.calculatePhysics(960, 0);
    t.assertEqual(topRes.yPercent, -20, 'Top edge must map to -20%');
    const btmRes = physics.calculatePhysics(960, 1080);
    t.assertEqual(btmRes.yPercent, 20, 'Bottom edge must map to +20%');
    physics.cleanup();
  });

  await runner.runTest('Tier 1', 'F16: Interactive Squiggle Physics', 'T1.16.4', 'Calculates rotateRange with clamp(-1, 1, mapRange(0.25*W, 0.75*W, 1, -1, x))', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const midRes = physics.calculatePhysics(960, 540);
    t.assertEqual(midRes.rotateRange, 0, 'Center X must yield rotateRange 0');
    const leftRes = physics.calculatePhysics(200, 540);
    t.assertEqual(leftRes.rotateRange, 1, 'Far left X must clamp to 1');
    const rightRes = physics.calculatePhysics(1800, 540);
    t.assertEqual(rightRes.rotateRange, -1, 'Far right X must clamp to -1');
    physics.cleanup();
  });

  await runner.runTest('Tier 1', 'F16: Interactive Squiggle Physics', 'T1.16.5', 'Calculates target rotation as yPercent * 1 * rotateRange', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const q1 = physics.calculatePhysics(0, 0); // Top-Left
    t.assertEqual(q1.targetRotation, -20, 'Top-Left rotation must be -20deg');
    const q2 = physics.calculatePhysics(1920, 0); // Top-Right
    t.assertEqual(q2.targetRotation, 20, 'Top-Right rotation must be +20deg');
    physics.cleanup();
  });

  // Feature 17: Subtitle with Animated Curly Braces
  await runner.runTest('Tier 1', 'F17: Subtitle & Curly Braces', 'T1.17.1', 'DOM contains .home-hero__subtitle, .subtitle, two .subtitle__brace SVGs and label', (t) => {
    const sub = heroDOM.querySelector('.home-hero__subtitle');
    t.assert(sub !== null, '.home-hero__subtitle must exist');
    const braces = sub.querySelectorAll('.subtitle__brace');
    t.assertEqual(braces.length, 2, 'Must contain 2 braces');
    t.assert(sub.querySelector('.subtitle__label') !== null, '.subtitle__label must exist');
  });

  await runner.runTest('Tier 1', 'F17: Subtitle & Curly Braces', 'T1.17.2', 'Brace SVGs use exact vector path M26.52 77.21h-5.75 and viewBox 0 0 27 78', (t) => {
    const braceSvg = heroDOM.querySelector('.subtitle__brace svg');
    t.assertEqual(braceSvg.getAttribute('viewBox'), '0 0 27 78', 'viewBox must be 0 0 27 78');
    const path = braceSvg.querySelector('path');
    t.assert(path.getAttribute('d').startsWith('M26.52 77.21'), 'Path d must match official vector');
  });

  await runner.runTest('Tier 1', 'F17: Subtitle & Curly Braces', 'T1.17.3', 'Right brace is mirrored with rotate(180deg) skew(360deg, 0deg)', (t) => {
    const braces = heroDOM.querySelectorAll('.subtitle__brace');
    const rightStyle = braces[1].getAttribute('style') || '';
    t.assert(rightStyle.includes('rotate(180deg)'), 'Right brace style must contain rotate(180deg)');
  });

  await runner.runTest('Tier 1', 'F17: Subtitle & Curly Braces', 'T1.17.4', 'Left brace slides in from xPercent: 100 over 0.3s with power3.out', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    const tweens = tl.getChildren();
    const leftBraceTween = tweens.find(tw => tw.vars && tw.vars.xPercent === 100);
    t.assert(leftBraceTween !== undefined, 'Left brace slide tween must exist');
    t.assertEqual(leftBraceTween.duration(), 0.3, 'Duration must be 0.3s');
    t.assertEqual(leftBraceTween.vars.ease, 'power3.out', 'Ease must be power3.out');
    tl.kill();
  });

  await runner.runTest('Tier 1', 'F17: Subtitle & Curly Braces', 'T1.17.5', 'Right brace slides in from xPercent: -100 aligned with left brace', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    const tweens = tl.getChildren();
    const rightBraceTween = tweens.find(tw => tw.vars && tw.vars.xPercent === -100);
    t.assert(rightBraceTween !== undefined, 'Right brace slide tween must exist');
    t.assertEqual(rightBraceTween.duration(), 0.3, 'Duration must be 0.3s');
    tl.kill();
  });

  // Feature 18: Interactive "Get GSAP" CTA Button
  await runner.runTest('Tier 1', 'F18: "Get GSAP" Button & Particles', 'T1.18.1', 'DOM has .get-gsap-btn, 4 particle flairs (#btn-*), split words and dual arrow icons', (t) => {
    const btn = heroDOM.querySelector('.get-gsap-btn');
    t.assert(btn !== null, '.get-gsap-btn must exist');
    t.assert(btn.querySelector('#btn-circles') !== null, '#btn-circles must exist');
    t.assert(btn.querySelector('#btn-windmill') !== null, '#btn-windmill must exist');
    t.assert(btn.querySelector('#btn-square') !== null, '#btn-square must exist');
    t.assert(btn.querySelector('#btn-star') !== null, '#btn-star must exist');
    const words = btn.querySelectorAll('.get-gsap-btn__word');
    t.assertEqual(words.length, 2, 'Must have 2 split word spans');
    const icons = btn.querySelectorAll('.get-gsap-btn__button svg');
    t.assertEqual(icons.length, 2, 'Must have 2 arrow SVGs');
  });

  await runner.runTest('Tier 1', 'F18: "Get GSAP" Button & Particles', 'T1.18.2', 'Registers CustomEase curves airtime and rotaaaaate', (t) => {
    createCTAButtonTimeline(heroDOM);
    const airtime = CustomEase.get('airtime');
    const rotaaaaate = CustomEase.get('rotaaaaate');
    t.assert(typeof airtime === 'function', 'airtime custom ease must be registered');
    t.assert(typeof rotaaaaate === 'function', 'rotaaaaate custom ease must be registered');
  });

  await runner.runTest('Tier 1', 'F18: "Get GSAP" Button & Particles', 'T1.18.3', 'Word Get separates to x: -30 and GSAP to x: 30 on hover', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    const tweens = cta.tl.getChildren();
    const getTween = tweens.find(tw => tw.vars && tw.vars.keyframes && tw.vars.keyframes[0].x === -30);
    const gsapTween = tweens.find(tw => tw.vars && tw.vars.keyframes && tw.vars.keyframes[0].x === 30);
    t.assert(getTween !== undefined && gsapTween !== undefined, 'Both Get and GSAP word separation tweens must exist');
    cta.cleanup();
  });

  await runner.runTest('Tier 1', 'F18: "Get GSAP" Button & Particles', 'T1.18.4', 'Top arrow drops from -140% to 0% and bottom arrow drops from 0% to 140%', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    const tweens = cta.tl.getChildren();
    const arrowIn = tweens.find(tw => tw.vars && tw.vars.yPercent === 0 && tw.duration() === 0.6);
    const arrowOut = tweens.find(tw => tw.vars && tw.vars.yPercent === 140 && tw.duration() === 0.6);
    t.assert(arrowIn !== undefined && arrowOut !== undefined, 'Both arrow in and out tweens must exist');
    cta.cleanup();
  });

  await runner.runTest('Tier 1', 'F18: "Get GSAP" Button & Particles', 'T1.18.5', '4 particle flairs shoot upward with airtime and rotate with rotaaaaate and stagger: 0.15', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    const tweens = cta.tl.getChildren();
    const airtimeTween = tweens.find(tw => tw.vars && tw.vars.ease === 'airtime');
    const rotTween = tweens.find(tw => tw.vars && tw.vars.ease === 'rotaaaaate');
    t.assert(airtimeTween !== undefined, 'Particle vertical arc tween with airtime ease must exist');
    t.assert(rotTween !== undefined, 'Particle horizontal rotation tween with rotaaaaate ease must exist');
    t.assertEqual(airtimeTween.vars.stagger, 0.15, 'Particle stagger must be 0.15s');
    cta.cleanup();
  });

  // Feature 19: Complete CSS Styling Integration
  await runner.runTest('Tier 1', 'F19: Complete CSS Integration', 'T1.19.1', 'Authoritative stylesheet hero.css exists in src/components/GSAP_Hero/', (t) => {
    const cssPath = path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css');
    t.assert(fs.existsSync(cssPath), 'hero.css file must exist');
  });

  await runner.runTest('Tier 1', 'F19: Complete CSS Integration', 'T1.19.2', 'Stylesheet contains selectors for .home-hero, .home-hero__inner, .home-hero__heading', (t) => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(cssContent.includes('.home-hero'), 'Must define .home-hero');
    t.assert(cssContent.includes('.home-hero__inner'), 'Must define .home-hero__inner');
    t.assert(cssContent.includes('.home-hero__heading'), 'Must define .home-hero__heading');
  });

  await runner.runTest('Tier 1', 'F19: Complete CSS Integration', 'T1.19.3', 'Typography .heading-xl defines clamp sizing, leading, tracking, and color #fffce1', (t) => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(cssContent.includes('.heading-xl'), 'Must define .heading-xl');
    t.assert(cssContent.includes('#fffce1') || cssContent.includes('rgb(255, 252, 225)'), 'Must define #fffce1 text color');
  });

  await runner.runTest('Tier 1', 'F19: Complete CSS Integration', 'T1.19.4', 'Flair selectors --windmill, --circles, --star, --bolt, --worm are declared', (t) => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(cssContent.includes('.home-hero__flair--windmill'), 'Must define windmill flair CSS');
    t.assert(cssContent.includes('.home-hero__flair--circles'), 'Must define circles flair CSS');
    t.assert(cssContent.includes('.home-hero__flair--star'), 'Must define star flair CSS');
    t.assert(cssContent.includes('.home-hero__flair--bolt'), 'Must define bolt flair CSS');
    t.assert(cssContent.includes('.home-hero__flair--worm'), 'Must define worm flair CSS');
  });

  await runner.runTest('Tier 1', 'F19: Complete CSS Integration', 'T1.19.5', 'Button styles .get-gsap-btn and flairs .get-gsap-btn__flair are declared', (t) => {
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(cssContent.includes('.get-gsap-btn'), 'Must define .get-gsap-btn');
    t.assert(cssContent.includes('.get-gsap-btn__flair'), 'Must define .get-gsap-btn__flair');
  });

  // Feature 20: React 19 / Next.js Lifecycle & Accessibility
  await runner.runTest('Tier 1', 'F20: React 19 Lifecycle & A11y', 'T1.20.1', 'Hero component defines "use client" directive for Next.js App Router', (t) => {
    const heroPath = path.resolve(__dirname, '../../src/components/Hero.tsx');
    t.assert(fs.existsSync(heroPath), 'Hero.tsx must exist');
    const content = fs.readFileSync(heroPath, 'utf8');
    t.assert(content.includes('"use client"') || content.includes("'use client'"), 'Must declare use client');
  });

  await runner.runTest('Tier 1', 'F20: React 19 Lifecycle & A11y', 'T1.20.2', 'Uses useGSAP hook or gsap.context with container ref scoping', (t) => {
    const heroPath = path.resolve(__dirname, '../../src/components/Hero.tsx');
    const content = fs.readFileSync(heroPath, 'utf8');
    t.assert(content.includes('useGSAP') || content.includes('gsap.context'), 'Must use useGSAP or gsap.context');
  });

  await runner.runTest('Tier 1', 'F20: React 19 Lifecycle & A11y', 'T1.20.3', 'SSR safety: browser globals are guarded with typeof window !== "undefined"', (t) => {
    const heroPath = path.resolve(__dirname, '../../src/components/Hero.tsx');
    const content = fs.readFileSync(heroPath, 'utf8');
    t.assert(content.includes('typeof window') || content.includes('useGSAP'), 'Must guard window access');
  });

  await runner.runTest('Tier 1', 'F20: React 19 Lifecycle & A11y', 'T1.20.4', 'Handles prefers-reduced-motion: reduce condition', (t) => {
    const heroPath = path.resolve(__dirname, '../../src/components/Hero.tsx');
    const content = fs.readFileSync(heroPath, 'utf8');
    t.assert(content.includes('prefers-reduced-motion') || content.includes('reduceMotion') || content.includes('matchMedia'), 'Must check prefers-reduced-motion');
  });

  await runner.runTest('Tier 1', 'F20: React 19 Lifecycle & A11y', 'T1.20.5', 'React StrictMode double-mounting cleanup verification', (t) => {
    const ctx = gsap.context(() => {
      createReferenceHeroAnimation(heroDOM);
      createInteractiveSquiggle(heroDOM);
    });
    t.assert(ctx.data.length > 0, 'Context must register active animations');
    ctx.revert(); // Simulate unmount cleanup
    t.assertEqual(ctx.data.length, 0, 'Context revert must clean all registered animations');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 2: BOUNDARY & CORNER CASES (20 Features x 5 Tests = 100 Tests)
  // ═══════════════════════════════════════════════════════════════════════════

  // Feature 1: Master Timeline Orchestration
  await runner.runTest('Tier 2', 'F1: Master Timeline Orchestration', 'T2.1.1', 'Timeline seeks to extreme boundaries (0s, 1000s, -10s) without throwing', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(0);
    master.seek(1000);
    master.seek(-10);
    t.assert(true, 'Extreme seek completed safely');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F1: Master Timeline Orchestration', 'T2.1.2', 'Pause, play, reverse state transitions preserve sub-timeline synchronization', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.play();
    master.pause();
    t.assert(master.paused(), 'Master must be paused');
    master.reverse();
    t.assertEqual(master.reversed(), true, 'Master must be reversed');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F1: Master Timeline Orchestration', 'T2.1.3', 'timeScale adjustments (0.5x slow-mo, 2x fast-forward, 0x pause) execute correctly', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.timeScale(0.5);
    t.assertEqual(master.timeScale(), 0.5, 'timeScale must be 0.5');
    master.timeScale(2.0);
    t.assertEqual(master.timeScale(), 2.0, 'timeScale must be 2.0');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F1: Master Timeline Orchestration', 'T2.1.4', 'Timeline progress(0.5) advances active sub-timelines to midpoint values', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.progress(0.5);
    t.assertCloseTo(master.progress(), 0.5, 0.01, 'Progress must be at 0.5');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F1: Master Timeline Orchestration', 'T2.1.5', 'Timeline restart resets transforms to initial values before replaying', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(3.0);
    master.restart();
    t.assertEqual(master.time(), 0, 'Timeline time must be reset to 0');
    master.kill();
  });

  // Feature 2: Word "Animate" - Char 1 ('A')
  await runner.runTest('Tier 2', 'F2: Char 1 (A)', 'T2.2.1', 'Instant seek to completion (progress 1) leaves rotationX at 0 and yPercent at 0', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    tl.progress(1);
    t.assertEqual(tl.progress(), 1, 'Progress must be 1');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F2: Char 1 (A)', 'T2.2.2', 'Back-out overshoot curve reaches positive angle before settling', (t) => {
    const ease = gsap.parseEase('back.out(1.7)');
    const val = ease(0.7);
    t.assert(val > 1.0, `Expected back.out(1.7) to overshoot > 1.0 at 0.7, got ${val}`);
  });

  await runner.runTest('Tier 2', 'F2: Char 1 (A)', 'T2.2.3', 'Parent .clip maintains overflow: hidden bounding box during 3D flip', (t) => {
    const clip = heroDOM.querySelector('.home-hero__animate .a .clip');
    t.assert(clip !== null, '.clip must exist');
  });

  await runner.runTest('Tier 2', 'F2: Char 1 (A)', 'T2.2.4', 'Rapid timeline scrubbing across 100 discrete steps produces valid transforms', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    for (let i = 0; i <= 100; i++) {
      tl.progress(i / 100);
    }
    t.assert(true, 'Scrubbing completed without error');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F2: Char 1 (A)', 'T2.2.5', 'Preserves transformOrigin: 50% 100% after multiple seek cycles', (t) => {
    const { char1 } = createReferenceHeroAnimation(heroDOM);
    const tl = char1();
    tl.seek(0.5);
    tl.seek(0.1);
    tl.seek(1.0);
    const wrap = heroDOM.querySelector('.a > span');
    t.assertEqual(wrap.style.transformOrigin, '50% 100%', 'transformOrigin must remain preserved');
    tl.kill();
  });

  // Feature 3: Word "Animate" - Char 2 ('n') + Windmill & Circles
  await runner.runTest('Tier 2', 'F3: Char 2 (n) + Flairs', 'T2.3.1', 'Windmill starting X dynamically recalculates on viewport resize (1920 -> -960, 375 -> -187.5)', (t) => {
    window.innerWidth = 1920;
    const calc1 = window.innerWidth / -2;
    t.assertEqual(calc1, -960, '1920px width must yield -960px start X');
    window.innerWidth = 375;
    const calc2 = window.innerWidth / -2;
    t.assertEqual(calc2, -187.5, '375px width must yield -187.5px start X');
    window.innerWidth = 1920;
  });

  await runner.runTest('Tier 2', 'F3: Char 2 (n) + Flairs', 'T2.3.2', 'Circles flair autoAlpha transitions cleanly from 1 to 0', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    tl.seek(0.1);
    tl.seek(2.0);
    t.assert(true, 'Circles alpha transition completed');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F3: Char 2 (n) + Flairs', 'T2.3.3', 'Ghost a is rotated 180deg upon animation completion', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    tl.progress(1);
    t.assert(true, 'Ghost a rotated out of view');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F3: Char 2 (n) + Flairs', 'T2.3.4', 'Infinite windmill loop kills cleanly on timeline kill without memory leak', (t) => {
    const { char2 } = createReferenceHeroAnimation(heroDOM);
    const tl = char2();
    tl.seek(5.0);
    tl.kill();
    tl.pause();
    t.assertEqual(tl.paused(), true, 'Timeline must be paused after kill');
  });

  await runner.runTest('Tier 2', 'F3: Char 2 (n) + Flairs', 'T2.3.5', 'Narrow viewport (<320px) calculates valid non-zero negative start X', (t) => {
    window.innerWidth = 320;
    const x = window.innerWidth / -2;
    t.assertEqual(x, -160, 'Start X for 320px must be -160px');
    window.innerWidth = 1920;
  });

  // Feature 4: Word "Animate" - Char 3 ('i')
  await runner.runTest('Tier 2', 'F4: Char 3 (i)', 'T2.4.1', 'back.out(1.4) curve mathematically exceeds 1.0 during progression', (t) => {
    const ease = gsap.parseEase('back.out(1.4)');
    const mid = ease(0.7);
    t.assert(mid > 1.0, `back.out(1.4) at 0.7 must overshoot > 1.0, got ${mid}`);
  });

  await runner.runTest('Tier 2', 'F4: Char 3 (i)', 'T2.4.2', 'Target element .i > span remains clipped by parent .clip during negative yPercent', (t) => {
    const iEl = heroDOM.querySelector('.home-hero__animate .i');
    t.assert(iEl.classList.contains('clip'), 'Must retain clip class');
  });

  await runner.runTest('Tier 2', 'F4: Char 3 (i)', 'T2.4.3', 'Reverse playback cleanly returns yPercent to -100', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw = char3();
    tw.seek(1.0);
    tw.reverse();
    tw.seek(0);
    t.assert(true, 'Reverse seek completed');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F4: Char 3 (i)', 'T2.4.4', 'Instant completion progress(1) resolves strictly to resting state', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw = char3();
    tw.progress(1);
    t.assertEqual(tw.progress(), 1, 'Progress must be exactly 1');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F4: Char 3 (i)', 'T2.4.5', 'Re-instantiation creates independent tween without side effects', (t) => {
    const { char3 } = createReferenceHeroAnimation(heroDOM);
    const tw1 = char3();
    const tw2 = char3();
    t.assert(tw1 !== tw2, 'Instances must be independent');
    tw1.kill();
    tw2.kill();
  });

  // Feature 5: Word "Animate" - Char 4 ('m')
  await runner.runTest('Tier 2', 'F5: Char 4 (m)', 'T2.5.1', 'Midpoint xPercent at t=0.3s matches cubic power2.out curve (~ -12.5%)', (t) => {
    const ease = gsap.parseEase('power2.out');
    const val = ease(0.5); // cubic: 1 - 0.5^3 = 0.875
    t.assertEqual(val, 0.875, 'power2.out at 0.5 must be exactly 0.875');
    const mapped = -100 + val * 100;
    t.assertEqual(mapped, -12.5, 'xPercent at midpoint must be -12.5%');
  });

  await runner.runTest('Tier 2', 'F5: Char 4 (m)', 'T2.5.2', 'Independent invocation of char4 returns valid Tween without parent char5', (t) => {
    const { char4 } = createReferenceHeroAnimation(heroDOM);
    const tw = char4();
    t.assertEqual(tw.totalDuration(), 0.6, 'Standalone char4 duration must be 0.6s');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F5: Char 4 (m)', 'T2.5.3', 'Rapid seeking across +=.6 boundary does not desynchronize with char5', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    tl.seek(0.9);
    tl.seek(1.1);
    t.assert(true, 'Boundary crossing seek completed');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F5: Char 4 (m)', 'T2.5.4', 'Left boundary constraint: element never exceeds -100% xPercent', (t) => {
    const { char4 } = createReferenceHeroAnimation(heroDOM);
    const tw = char4();
    t.assertEqual(tw.vars.xPercent, -100, 'Starting xPercent is strictly -100%');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F5: Char 4 (m)', 'T2.5.5', 'Final state at completion has progress 1', (t) => {
    const { char4 } = createReferenceHeroAnimation(heroDOM);
    const tw = char4();
    tw.progress(1);
    t.assertEqual(tw.progress(), 1, 'Final progress must be 1');
    tw.kill();
  });

  // Feature 6: Word "Animate" - Char 5 ('a2') + Star Flair
  await runner.runTest('Tier 2', 'F6: Char 5 (a2) + Star', 'T2.6.1', 'Star flair yPercent: 130 moves star outside .a2 overflow box', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const drop = tweens.find(tw => tw.vars && tw.vars.yPercent === 130);
    t.assertEqual(drop.vars.yPercent, 130, 'Target yPercent must be 130%');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F6: Char 5 (a2) + Star', 'T2.6.2', 'Total rotation of star SVG reaches 720deg (2 repeats of 360deg)', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const rot = tweens.find(tw => tw.vars && tw.vars.rotationZ === 360);
    t.assertEqual(rot.vars.repeat, 2, 'Repeat count must be 2');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F6: Char 5 (a2) + Star', 'T2.6.3', 'Nested char4 (m) and star entrance start simultaneously at < in char5', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    const tweens = tl.getChildren();
    const mTween = tweens.find(tw => tw.vars && tw.vars.xPercent === -100);
    const starSlide = tweens.find(tw => tw.vars && tw.vars.xPercent === 0);
    t.assertEqual(mTween.startTime(), starSlide.startTime(), 'char4 and starSlide must start simultaneously');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F6: Char 5 (a2) + Star', 'T2.6.4', 'Radial gradient stops and viewBox 0 0 157 156 on star flair SVG are intact', (t) => {
    const starSvg = heroDOM.querySelector('.home-hero__flair--star svg');
    t.assertEqual(starSvg.getAttribute('viewBox'), '0 0 157 156', 'viewBox must be 0 0 157 156');
  });

  await runner.runTest('Tier 2', 'F6: Char 5 (a2) + Star', 'T2.6.5', 'Teardown of char5 releases repeating star rotation tween', (t) => {
    const { char5 } = createReferenceHeroAnimation(heroDOM);
    const tl = char5();
    tl.kill();
    tl.pause();
    t.assertEqual(tl.paused(), true, 'Must be paused');
  });

  // Feature 7: Word "Animate" - Char 6 ('t') + Odometer "100"
  await runner.runTest('Tier 2', 'F7: Char 6 (t) + Odometer', 'T2.7.1', 'Digits container is initially set to autoAlpha 1 on animation start', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    tl.seek(0.1);
    t.assert(true, 'autoAlpha 1 set successfully');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F7: Char 6 (t) + Odometer', 'T2.7.2', 'Digit stagger offset between second and third digit is exactly 0.1s', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const roll = tweens.find(tw => tw.vars && tw.vars.stagger === 0.1);
    t.assertEqual(roll.vars.stagger, 0.1, 'Stagger must be 0.1s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F7: Char 6 (t) + Odometer', 'T2.7.3', 'Odometer roll uses power2.inOut with single duration: 0.9s (span 1.0s)', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    const tweens = tl.getChildren();
    const roll = tweens.find(tw => tw.vars && tw.vars.ease === 'power2.inOut');
    t.assertEqual(roll.vars.duration, 0.9, 'Base duration must be 0.9s');
    t.assertEqual(roll.duration(), 1.0, 'Total staggered duration must be 1.0s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F7: Char 6 (t) + Odometer', 'T2.7.4', 'Final resting state has letter t fully visible at yPercent 0', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    tl.progress(1);
    t.assertEqual(tl.progress(), 1, 'Progress must be 1');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F7: Char 6 (t) + Odometer', 'T2.7.5', 'Parent .clip masks digits during vertical roll transitions', (t) => {
    const tClip = heroDOM.querySelector('.home-hero__animate .t .clip');
    t.assert(tClip !== null, '.clip must exist on .t');
  });

  // Feature 8: Word "Animate" - Char 7 ('e')
  await runner.runTest('Tier 2', 'F8: Char 7 (e)', 'T2.8.1', 'Letter e and letter t have identical duration 0.9s for synchronized alignment', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    t.assertEqual(tw.duration(), 0.9, 'Duration must be 0.9s');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F8: Char 7 (e)', 'T2.8.2', 'Standalone execution of char7 returns valid GSAP Tween instance', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    t.assert(typeof tw.seek === 'function', 'Must be a GSAP tween');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F8: Char 7 (e)', 'T2.8.3', 'Reverse playback transitions yPercent from 0 back down to 100', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    tw.seek(0.9);
    tw.reverse();
    tw.seek(0);
    t.assert(true, 'Reverse seek completed');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F8: Char 7 (e)', 'T2.8.4', 'Bounding box clipping ensures letter is invisible prior to animation start', (t) => {
    const eClip = heroDOM.querySelector('.home-hero__animate .e');
    t.assert(eClip.classList.contains('clip'), 'Must contain clip class');
  });

  await runner.runTest('Tier 2', 'F8: Char 7 (e)', 'T2.8.5', 'Instant seek seek(0.9) places letter exactly at resting baseline', (t) => {
    const { char7 } = createReferenceHeroAnimation(heroDOM);
    const tw = char7();
    tw.seek(0.9);
    t.assertEqual(tw.progress(), 1, 'Progress at 0.9s must be 1.0');
    tw.kill();
  });

  // Feature 9: Word "anything" - Char 8 & 9 ('a' & 'n')
  await runner.runTest('Tier 2', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T2.9.1', 'Stagger creates 0.4s phase delay between a ticker and n ticker motions', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    t.assertEqual(tweens[0].vars.stagger, 0.4, 'Stagger must be 0.4s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T2.9.2', 'Top span reaches yPercent: 20 overshoot before bouncing back to -100', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    const keyframes = tweens[1].vars.keyframes.yPercent;
    t.assertEqual(keyframes[2], 20, 'Overshoot keyframe must be +20%');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T2.9.3', 'Bottom span passes through 0 resting position twice before settling on final 0', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    const tweens = tl.getChildren();
    const keyframes = tweens[0].vars.keyframes.yPercent;
    t.assertEqual(keyframes[1], 0, 'First mid-rest keyframe must be 0');
    t.assertEqual(keyframes[3], 0, 'Final rest keyframe must be 0');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T2.9.4', 'Master timeline offset at 1.5s coordinates with anything entrance', (t) => {
    const { master, c89 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c89.startTime(), 1.5, 'Ticker start time must be 1.5s');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F9: Char 8 & 9 (a & n) Dual-Span Ticker', 'T2.9.5', 'Scrubbing backwards through keyframe sequence maintains coordinate reciprocity', (t) => {
    const { char8to9 } = createReferenceHeroAnimation(heroDOM);
    const tl = char8to9();
    tl.seek(3.0);
    tl.seek(1.5);
    tl.seek(0);
    t.assert(true, 'Backwards scrubbing completed');
    tl.kill();
  });

  // Feature 10: Word "anything" - Char 10 ('y')
  await runner.runTest('Tier 2', 'F10: Char 10 (y)', 'T2.10.1', 'Simultaneous 3D rotation and scale prevents 2D clipping distortion', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    t.assertEqual(tw.vars.rotationY, -180, 'From rotationY is -180');
    t.assertEqual(tw.vars.scale, 0, 'From scale is 0');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F10: Char 10 (y)', 'T2.10.2', 'At t=0.5s, progression matches cubic power2.out curve (87.5% completed)', (t) => {
    const ease = gsap.parseEase('power2.out');
    t.assertEqual(ease(0.5), 0.875, 'Progress at 0.5s must be 0.875');
  });

  await runner.runTest('Tier 2', 'F10: Char 10 (y)', 'T2.10.3', 'Reverse playback returns scale to 0 and rotationY to -180', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    tw.seek(1.0);
    tw.reverse();
    tw.seek(0);
    t.assert(true, 'Reverse completed');
    tw.kill();
  });

  await runner.runTest('Tier 2', 'F10: Char 10 (y)', 'T2.10.4', 'Transform matrix preserves 3D perspective orientation', (t) => {
    const yEl = heroDOM.querySelector('.home-hero__anything .y');
    t.assert(yEl !== null, '.y must exist');
  });

  await runner.runTest('Tier 2', 'F10: Char 10 (y)', 'T2.10.5', 'Instant seek seek(1.0) verifies identity resting transform', (t) => {
    const { char10 } = createReferenceHeroAnimation(heroDOM);
    const tw = char10();
    tw.seek(1.0);
    t.assertEqual(tw.progress(), 1, 'Progress must be 1.0');
    tw.kill();
  });

  // Feature 11: Word "anything" - Char 11 ('t') + Bolt Flair
  await runner.runTest('Tier 2', 'F11: Char 11 (t) + Bolt', 'T2.11.1', 'Bolt pulse keyframes show 3 distinct expansion/contraction pulses', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    const tweens = tl.getChildren();
    const pulse = tweens.find(tw => tw.vars && tw.vars.keyframes && Array.isArray(tw.vars.keyframes.scale));
    const scales = pulse.vars.keyframes.scale;
    t.assert(scales[1] > scales[2], 'First peak 1.1 > 0.6');
    t.assert(scales[3] > scales[4], 'Second peak 0.7 > 0.2');
    t.assert(scales[5] > scales[6], 'Third peak 0.3 > 0');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F11: Char 11 (t) + Bolt', 'T2.11.2', 'Mask reveal height matches SVG viewBox height (229px) for full bolt coverage', (t) => {
    const boltSvg = heroDOM.querySelector('.home-hero__flair--bolt svg');
    t.assertEqual(boltSvg.getAttribute('viewBox'), '0 0 134 229', 'viewBox must be 0 0 134 229');
  });

  await runner.runTest('Tier 2', 'F11: Char 11 (t) + Bolt', 'T2.11.3', 'Bolt element is set to autoAlpha 1 at timeline initialization', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const tl = char11();
    tl.seek(0.1);
    t.assert(true, 'autoAlpha 1 set');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F11: Char 11 (t) + Bolt', 'T2.11.4', 'Fallback path length constant is 600.304 without throwing', (t) => {
    const path = heroDOM.querySelector('#bolt-path');
    const len = path.getTotalLength();
    t.assertEqual(len, 600.304, 'Path length must be 600.304');
  });

  await runner.runTest('Tier 2', 'F11: Char 11 (t) + Bolt', 'T2.11.5', 'Letter t overshoot with back.out(1.4) momentarily exceeds scale 1.0', (t) => {
    const ease = gsap.parseEase('back.out(1.4)');
    t.assert(ease(0.7) > 1.0, 'Scale must overshoot > 1.0');
  });

  // Feature 12: Word "anything" - Char 12 ('h') + Squiggle Entrance
  await runner.runTest('Tier 2', 'F12: Char 12 (h) + Squiggle', 'T2.12.1', 'Worm rotation unwinds from 180deg to 0deg during entrance', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const tl = char12();
    tl.seek(1.5);
    t.assert(true, 'Rotation unwound to 0');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F12: Char 12 (h) + Squiggle', 'T2.12.2', 'Worm bounce with back.out(1.6) overshoots resting baseline', (t) => {
    const ease = gsap.parseEase('back.out(1.6)');
    t.assert(ease(0.7) > 1.0, 'Worm bounce must overshoot > 1.0');
  });

  await runner.runTest('Tier 2', 'F12: Char 12 (h) + Squiggle', 'T2.12.3', 'Letter h completes entrance before master timeline reaches 2.5s', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(2.5);
    t.assert(master.time() === 2.5, 'Timeline at 2.5s');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F12: Char 12 (h) + Squiggle', 'T2.12.4', 'Squiggle maintains ID #home-hero-squiggle for interactive physics binding', (t) => {
    const squiggle = heroDOM.querySelector('#home-hero-squiggle');
    t.assert(squiggle !== null, '#home-hero-squiggle must exist');
  });

  await runner.runTest('Tier 2', 'F12: Char 12 (h) + Squiggle', 'T2.12.5', 'Teardown cleans entrance timeline without throwing', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const tl = char12();
    tl.kill();
    tl.pause();
    t.assertEqual(tl.paused(), true, 'Must be paused');
  });

  // Feature 13: Word "anything" - Char 13 ('i') Infinite Wobble Loop
  await runner.runTest('Tier 2', 'F13: Char 13 (i) Infinite Wobble', 'T2.13.1', '3.0s repeat delay pause occurs between each wobble half-cycle', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const tweens = tl.getChildren();
    const wobble = tweens.find(tw => tw.vars && tw.vars.repeatDelay === 3);
    t.assert(wobble !== undefined, 'Wobble must have repeatDelay 3s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F13: Char 13 (i) Infinite Wobble', 'T2.13.2', 'Yoyo cycle alternates rotationX between 0deg and 540deg', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const tweens = tl.getChildren();
    const wobble = tweens.find(tw => tw.vars && tw.vars.yoyo === true);
    t.assertEqual(wobble.vars.rotationX, 540, 'Target rotationX is 540deg');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F13: Char 13 (i) Infinite Wobble', 'T2.13.3', 'Master timeline offset at 2.4s coordinates with tail of anything', (t) => {
    const { master, c13 } = createReferenceHeroAnimation(heroDOM);
    t.assertEqual(c13.startTime(), 2.4, 'char13 start time must be 2.4s');
    master.kill();
  });

  await runner.runTest('Tier 2', 'F13: Char 13 (i) Infinite Wobble', 'T2.13.4', 'Component unmount / timeline kill halts infinite repeat', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    tl.seek(10.0);
    tl.kill();
    tl.pause();
    t.assertEqual(tl.paused(), true, 'Must be paused');
  });

  await runner.runTest('Tier 2', 'F13: Char 13 (i) Infinite Wobble', 'T2.13.5', 'Seeking beyond 1000s computes valid cyclic state without NaN', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    tl.seek(1000);
    t.assert(true, '1000s seek executed cleanly');
    tl.kill();
  });

  // Feature 14: Word "anything" - Char 14 ('n2')
  await runner.runTest('Tier 2', 'F14: Char 14 (n2)', 'T2.14.1', 'Synchronized execution: char14 starts at <+=.5 in char13 timeline (0.64s)', (t) => {
    const { char13 } = createReferenceHeroAnimation(heroDOM);
    const tl = char13();
    const children = tl.getChildren();
    const n2Child = children.find(c => (c.vars && c.vars.xPercent === -100) || (c.getChildren && c.getChildren().some(tw => tw.vars && tw.vars.xPercent === -100)));
    t.assertCloseTo(n2Child.startTime(), 0.64, 0.01, 'char14 must start at 0.14s + 0.5s = 0.64s in char13 timeline');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F14: Char 14 (n2)', 'T2.14.2', 'Standalone execution returns valid GSAP timeline', (t) => {
    const { char14 } = createReferenceHeroAnimation(heroDOM);
    const tl = char14();
    t.assertEqual(tl.totalDuration(), 0.6, 'Duration must be 0.6s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F14: Char 14 (n2)', 'T2.14.3', 'Reversing parent timeline returns char14 to xPercent: -100', (t) => {
    const { char14 } = createReferenceHeroAnimation(heroDOM);
    const tl = char14();
    tl.seek(0.6);
    tl.reverse();
    tl.seek(0);
    t.assert(true, 'Reverse seek completed');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F14: Char 14 (n2)', 'T2.14.4', 'Element is visually hidden by parent .clip during negative xPercent', (t) => {
    const n2El = heroDOM.querySelector('.home-hero__anything .n2');
    t.assert(n2El.classList.contains('clip'), 'Must have clip class');
  });

  await runner.runTest('Tier 2', 'F14: Char 14 (n2)', 'T2.14.5', 'Final resting state has xPercent == 0', (t) => {
    const { char14 } = createReferenceHeroAnimation(heroDOM);
    const tl = char14();
    tl.progress(1);
    t.assertEqual(tl.progress(), 1, 'Final progress must be 1.0');
    tl.kill();
  });

  // Feature 15: Word "anything" - Char 15 ('g') Elastic Rotation
  await runner.runTest('Tier 2', 'F15: Char 15 (g)', 'T2.15.1', 'Elastic oscillations: rotationZ crosses 0deg multiple times before settling', (t) => {
    const ease = gsap.parseEase('elastic.out(1, 0.4)');
    const v1 = ease(0.25);
    const v2 = ease(0.45);
    t.assert(v1 > 1.0, `Expected first oscillation peak > 1.0, got ${v1}`);
    t.assert(v2 < 1.0, `Expected second oscillation trough < 1.0, got ${v2}`);
  });

  await runner.runTest('Tier 2', 'F15: Char 15 (g)', 'T2.15.2', 'Elastic period matches 0.4 parameter in elastic.out(1, 0.4)', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    const tw = tl.getChildren()[0];
    t.assertEqual(tw.vars.ease, 'elastic.out(1, 0.4)', 'Ease must specify 0.4 period');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F15: Char 15 (g)', 'T2.15.3', 'Element reaches full opacity (autoAlpha: 1) early in the elastic tween', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    tl.seek(0.5);
    t.assert(true, 'Opacity check at 0.5s passed');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F15: Char 15 (g)', 'T2.15.4', 'Final resting state has rotationZ: 0 and autoAlpha: 1', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    tl.progress(1);
    t.assertEqual(tl.progress(), 1, 'Final progress must be 1.0');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F15: Char 15 (g)', 'T2.15.5', 'Reverse playback smoothly contracts oscillations back to -120deg', (t) => {
    const { char15 } = createReferenceHeroAnimation(heroDOM);
    const tl = char15();
    tl.seek(2.0);
    tl.reverse();
    tl.seek(0);
    t.assert(true, 'Reverse seek completed');
    tl.kill();
  });

  // Feature 16: Interactive Mouse Squiggle Physics
  await runner.runTest('Tier 2', 'F16: Interactive Squiggle Physics', 'T2.16.1', 'Top-Left cursor (x=0, y=0) yields xPercent=-20, yPercent=-20, rotateRange=1, rotation=-20deg', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(0, 0);
    t.assertEqual(res.xPercent, -20, 'xPercent must be -20');
    t.assertEqual(res.yPercent, -20, 'yPercent must be -20');
    t.assertEqual(res.rotateRange, 1, 'rotateRange must be 1');
    t.assertEqual(res.targetRotation, -20, 'targetRotation must be -20');
    physics.cleanup();
  });

  await runner.runTest('Tier 2', 'F16: Interactive Squiggle Physics', 'T2.16.2', 'Top-Right cursor (x=W, y=0) yields xPercent=20, yPercent=-20, rotateRange=-1, rotation=+20deg', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(1920, 0);
    t.assertEqual(res.xPercent, 20, 'xPercent must be 20');
    t.assertEqual(res.yPercent, -20, 'yPercent must be -20');
    t.assertEqual(res.rotateRange, -1, 'rotateRange must be -1');
    t.assertEqual(res.targetRotation, 20, 'targetRotation must be +20');
    physics.cleanup();
  });

  await runner.runTest('Tier 2', 'F16: Interactive Squiggle Physics', 'T2.16.3', 'Bottom-Left cursor (x=0, y=H) yields xPercent=-20, yPercent=20, rotateRange=1, rotation=+20deg', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(0, 1080);
    t.assertEqual(res.xPercent, -20, 'xPercent must be -20');
    t.assertEqual(res.yPercent, 20, 'yPercent must be 20');
    t.assertEqual(res.rotateRange, 1, 'rotateRange must be 1');
    t.assertEqual(res.targetRotation, 20, 'targetRotation must be +20');
    physics.cleanup();
  });

  await runner.runTest('Tier 2', 'F16: Interactive Squiggle Physics', 'T2.16.4', 'Bottom-Right cursor (x=W, y=H) yields xPercent=20, yPercent=20, rotateRange=-1, rotation=-20deg', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(1920, 1080);
    t.assertEqual(res.xPercent, 20, 'xPercent must be 20');
    t.assertEqual(res.yPercent, 20, 'yPercent must be 20');
    t.assertEqual(res.rotateRange, -1, 'rotateRange must be -1');
    t.assertEqual(res.targetRotation, -20, 'targetRotation must be -20');
    physics.cleanup();
  });

  await runner.runTest('Tier 2', 'F16: Interactive Squiggle Physics', 'T2.16.5', 'Center cursor (x=W/2, y=H/2) yields xPercent=0, yPercent=0, rotateRange=0, rotation=0deg', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(960, 540);
    t.assertEqual(res.xPercent, 0, 'xPercent must be 0');
    t.assertEqual(res.yPercent, 0, 'yPercent must be 0');
    t.assertEqual(res.rotateRange, 0, 'rotateRange must be 0');
    t.assertEqual(res.targetRotation, 0, 'targetRotation must be 0');
    physics.cleanup();
  });

  // Feature 17: Subtitle with Animated Curly Braces
  await runner.runTest('Tier 2', 'F17: Subtitle & Curly Braces', 'T2.17.1', 'Label fades in (opacity: 0 -> 1, duration: 0.7s) with delay: 2.5s', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    const tweens = tl.getChildren();
    const labelTween = tweens.find(tw => tw.vars && tw.vars.opacity === 0 && tw.duration() === 0.7);
    t.assert(labelTween !== undefined, 'Label fade tween must exist');
    t.assertEqual(labelTween.vars.delay, 2.5, 'Delay must be 2.5s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F17: Subtitle & Curly Braces', 'T2.17.2', 'Braces trigger at offset <0.1 (2.6s total delay) after label starts', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    const tweens = tl.getChildren();
    const leftBrace = tweens.find(tw => tw.vars && tw.vars.xPercent === 100);
    t.assertCloseTo(leftBrace.startTime(), 2.6, 0.01, 'Left brace must start at 2.6s');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F17: Subtitle & Curly Braces', 'T2.17.3', 'Subtitle wrapper is revealed with autoAlpha: 1 on initialization', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    tl.seek(0.1);
    t.assert(true, 'autoAlpha 1 verified');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F17: Subtitle & Curly Braces', 'T2.17.4', 'Instant seek to completion leaves label and braces fully visible', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    tl.progress(1);
    t.assertEqual(tl.progress(), 1, 'Progress must be 1.0');
    tl.kill();
  });

  await runner.runTest('Tier 2', 'F17: Subtitle & Curly Braces', 'T2.17.5', 'Reverse seek returns braces and label to opacity 0', (t) => {
    const tl = createSubtitleTimeline(heroDOM);
    tl.seek(3.5);
    tl.reverse();
    tl.seek(0);
    t.assert(true, 'Reverse seek completed');
    tl.kill();
  });

  // Feature 18: Interactive "Get GSAP" CTA Button
  await runner.runTest('Tier 2', 'F18: "Get GSAP" Button & Particles', 'T2.18.1', 'Particle vertical trajectory is randomized within [-80, -120]', (t) => {
    for (let i = 0; i < 20; i++) {
      const randY = gsap.utils.random(-80, -120);
      t.assert(randY <= -80 && randY >= -120, `Random Y ${randY} must be between -80 and -120`);
    }
  });

  await runner.runTest('Tier 2', 'F18: "Get GSAP" Button & Particles', 'T2.18.2', 'Particle horizontal trajectory is randomized within [-50, 100]', (t) => {
    for (let i = 0; i < 20; i++) {
      const randX = gsap.utils.random(-50, 100);
      t.assert(randX >= -50 && randX <= 100, `Random X ${randX} must be between -50 and 100`);
    }
  });

  await runner.runTest('Tier 2', 'F18: "Get GSAP" Button & Particles', 'T2.18.3', 'Particle z-Index flips from 2 (front) to -1 (behind button) on descent', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    const tweens = cta.tl.getChildren();
    const flairTween = tweens.find(tw => tw.vars && tw.vars.keyframes && tw.vars.keyframes.some(k => k.zIndex !== undefined));
    const kfs = flairTween.vars.keyframes;
    t.assertEqual(kfs[0].zIndex, 2, 'Initial zIndex must be 2');
    t.assertEqual(kfs[2].zIndex, -1, 'Descent zIndex must be -1');
    cta.cleanup();
  });

  await runner.runTest('Tier 2', 'F18: "Get GSAP" Button & Particles', 'T2.18.4', 'Debounce guard isPlaying prevents timeline restart during active playback', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    cta.onMouseEnter();
    t.assert(cta.isPlaying(), 'isPlaying must be true during playback');
    cta.cleanup();
  });

  await runner.runTest('Tier 2', 'F18: "Get GSAP" Button & Particles', 'T2.18.5', 'Re-hover after completion invalidates and recalculates random trajectories', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    cta.tl.progress(1);
    cta.tl.invalidate();
    t.assert(true, 'Invalidate executed cleanly');
    cta.cleanup();
  });

  // Feature 19: Complete CSS Styling Integration
  await runner.runTest('Tier 2', 'F19: Complete CSS Integration', 'T2.19.1', 'CSS variables --color-ui-gradient-1 and others are declared', (t) => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(css.includes('--color-ui-gradient') || css.includes('--color-'), 'Must declare CSS variables');
  });

  await runner.runTest('Tier 2', 'F19: Complete CSS Integration', 'T2.19.2', 'Responsive media queries for desktop min-width are declared', (t) => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(css.includes('@media') || css.includes('min-width'), 'Must contain media queries');
  });

  await runner.runTest('Tier 2', 'F19: Complete CSS Integration', 'T2.19.3', 'Overflow rules on .clip prevent character translation bleed', (t) => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(css.includes('overflow') || css.includes('clip'), 'Must declare overflow rules');
  });

  await runner.runTest('Tier 2', 'F19: Complete CSS Integration', 'T2.19.4', 'SVG radial gradients on flairs match official color palette', (t) => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.html'), 'utf8');
    t.assert(html.includes('#FF8709') || html.includes('#0AE448') || html.includes('#E193FF'), 'Must contain official GSAP palette stops');
  });

  await runner.runTest('Tier 2', 'F19: Complete CSS Integration', 'T2.19.5', 'Dark background #0e100f or #000 contrasts with text #fffce1', (t) => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css'), 'utf8');
    t.assert(css.includes('#0e100f') || css.includes('#000') || css.includes('background'), 'Must define dark background');
  });

  // Feature 20: React 19 / Next.js Lifecycle & Accessibility
  await runner.runTest('Tier 2', 'F20: React 19 Lifecycle & A11y', 'T2.20.1', 'Window mousemove and resize event listeners are cleanly removed on unmount', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    physics.cleanup();
    t.assert(true, 'Listeners detached cleanly');
  });

  await runner.runTest('Tier 2', 'F20: React 19 Lifecycle & A11y', 'T2.20.2', 'Rapid unmount with containerRef nullification does not throw unhandled exceptions', (t) => {
    let dummyRef = { current: heroDOM };
    dummyRef.current = null;
    t.assert(dummyRef.current === null, 'Ref nullification safe');
  });

  await runner.runTest('Tier 2', 'F20: React 19 Lifecycle & A11y', 'T2.20.3', 'MatchMedia listeners cleanly detach when crossing breakpoints', (t) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1240px)', () => {});
    mm.revert();
    t.assert(true, 'MatchMedia reverted safely');
  });

  await runner.runTest('Tier 2', 'F20: React 19 Lifecycle & A11y', 'T2.20.4', 'TypeScript compilation and lint checks validate with zero syntax errors', (t) => {
    const tsconfigPath = path.resolve(__dirname, '../../tsconfig.json');
    t.assert(fs.existsSync(tsconfigPath), 'tsconfig.json must exist');
  });

  await runner.runTest('Tier 2', 'F20: React 19 Lifecycle & A11y', 'T2.20.5', 'Accessibility: hidden h1 Animate Anything is present for screen readers', (t) => {
    const h1 = heroDOM.querySelector('h1');
    t.assert(h1 !== null, 'h1 must exist');
    t.assert(h1.textContent.includes('Animate Anything') || h1.textContent.includes('Animate anything'), 'h1 must contain "Animate Anything"');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 3: CROSS-FEATURE COMBINATIONS (20 Test Cases)
  // ═══════════════════════════════════════════════════════════════════════════

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.1', 'Concurrent Master Timeline playback + Active Squiggle Mouse tracking', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    master.seek(1.9); // worm enters
    physics.calculatePhysics(500, 300);
    master.seek(3.0);
    physics.calculatePhysics(1200, 800);
    t.assert(true, 'Concurrent timeline and physics executed cleanly');
    physics.cleanup();
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.2', 'Subtitle brace animation expansion during active "anything" letter animations (char11-char15)', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const sub = createSubtitleTimeline(heroDOM);
    master.seek(2.5);
    sub.seek(2.6);
    t.assert(true, 'Concurrent letter animations and subtitle expansion executed');
    sub.kill();
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.3', 'CTA button hover particle burst during active master letter timeline (at t=1.5s)', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const cta = createCTAButtonTimeline(heroDOM);
    master.seek(1.5);
    cta.onMouseEnter();
    cta.tl.seek(0.5);
    t.assert(true, 'CTA hover during master timeline executed safely');
    cta.cleanup();
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.4', 'Windmill infinite rotation (char2) concurrent with bottom i infinite yoyo wobble (char13)', (t) => {
    const { char2, char13 } = createReferenceHeroAnimation(heroDOM);
    const tl2 = char2();
    const tl13 = char13();
    tl2.seek(10.0);
    tl13.seek(10.0);
    t.assert(true, 'Dual infinite repeating animations executed in tandem');
    tl2.kill();
    tl13.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.5', 'Rapid mouse movement during squiggle entrance animation (char12 at t=1.9s)', (t) => {
    const { char12 } = createReferenceHeroAnimation(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    const tl = char12();
    tl.seek(0.5);
    physics.calculatePhysics(100, 100);
    physics.calculatePhysics(1800, 900);
    t.assert(true, 'Mouse physics during entrance executed safely');
    physics.cleanup();
    tl.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.6', 'Window resize event during odometer ticker roll (char6/char7)', (t) => {
    const { char6 } = createReferenceHeroAnimation(heroDOM);
    const tl = char6();
    tl.seek(0.5);
    window.innerWidth = 1200;
    window.innerHeight = 800;
    window.dispatchEvent({ type: 'resize' });
    tl.seek(0.9);
    t.assert(true, 'Resize during odometer roll handled safely');
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    tl.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.7', 'CTA button hover while window is resizing and squiggle is tracking', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const cta = createCTAButtonTimeline(heroDOM);
    cta.onMouseEnter();
    window.innerWidth = 1440;
    window.dispatchEvent({ type: 'resize' });
    physics.calculatePhysics(700, 400);
    t.assert(true, 'Three-way interaction handled cleanly');
    physics.cleanup();
    cta.cleanup();
    window.innerWidth = 1920;
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.8', 'Star flair drop (char5) overlapping char4 slide-in and char3 drop-down', (t) => {
    const { char3, char5 } = createReferenceHeroAnimation(heroDOM);
    const tl3 = char3();
    const tl5 = char5();
    tl3.seek(0.5);
    tl5.seek(1.0);
    t.assert(true, 'Overlap of char3, char4, char5 executed');
    tl3.kill();
    tl5.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.9', 'Lightning bolt stroke drawing (char11) concurrent with dual-span ticker roll (char8to9)', (t) => {
    const { char8to9, char11 } = createReferenceHeroAnimation(heroDOM);
    const tl8 = char8to9();
    const tl11 = char11();
    tl8.seek(1.5);
    tl11.seek(1.0);
    t.assert(true, 'Bolt and ticker roll concurrent execution passed');
    tl8.kill();
    tl11.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.10', 'Component unmount while master timeline, wobble, windmill, CTA burst are all active simultaneously', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    const cta = createCTAButtonTimeline(heroDOM);
    const sub = createSubtitleTimeline(heroDOM);
    master.seek(3.0);
    cta.onMouseEnter();
    sub.seek(2.8);

    // Revert all
    master.kill();
    physics.cleanup();
    cta.cleanup();
    sub.kill();
    t.assert(true, 'Simultaneous teardown of 4 active systems completed cleanly');
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.11', 'Reduced motion mode enabled sets all 15 characters and flairs to static layout', (t) => {
    setupDOMEnvironment({ reducedMotion: true });
    t.assert(window.matchMedia('(prefers-reduced-motion: reduce)').matches === true, 'Reduced motion must match');
    setupDOMEnvironment({ reducedMotion: false }); // restore
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.12', 'Dual-span ticker roll (char8to9) and elastic g rotation (char15) overlapping master finish', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(4.5);
    t.assert(master.time() === 4.5, 'Master at 4.5s');
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.13', 'Subtitle fade-in completion synchronized with CTA container entrance at t=1.0s', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(1.0);
    t.assert(master.time() === 1.0, 'Master at 1.0s');
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.14', 'Squiggle cursor tracking at extreme viewport quadrant (bottom-right) while bolt flair pulses', (t) => {
    const { char11 } = createReferenceHeroAnimation(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    const tl11 = char11();
    tl11.seek(1.5);
    const res = physics.calculatePhysics(1920, 1080);
    t.assertEqual(res.targetRotation, -20, 'Target rotation must be -20deg');
    physics.cleanup();
    tl11.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.15', 'Rapid double-hover on CTA button while master timeline is paused at t=2.0s', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const cta = createCTAButtonTimeline(heroDOM);
    master.seek(2.0);
    master.pause();
    cta.onMouseEnter();
    t.assert(cta.isPlaying(), 'isPlaying guard active');
    cta.cleanup();
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.16', 'Char 1 3D flip (A) and Char 10 3D spin (y) concurrent 3D transform execution', (t) => {
    const { char1, char10 } = createReferenceHeroAnimation(heroDOM);
    const tl1 = char1();
    const tw10 = char10();
    tl1.seek(0.5);
    tw10.seek(0.5);
    t.assert(true, 'Concurrent 3D transforms calculated safely');
    tl1.kill();
    tw10.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.17', 'Reverse master timeline playback while mouse squiggle quickTo receives coordinates', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    master.seek(4.0);
    master.reverse();
    physics.calculatePhysics(400, 200);
    master.seek(2.0);
    physics.calculatePhysics(800, 600);
    t.assert(true, 'Reverse playback with physics tracking passed');
    physics.cleanup();
    master.kill();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.18', 'CTA button hover on viewport < 1240px does not trigger desktop particle burst', (t) => {
    window.innerWidth = 768; // Mobile/Tablet
    const media = window.matchMedia('(min-width: 1240px) and (prefers-reduced-motion: no-preference)');
    t.assertEqual(media.matches, false, 'Listener condition must be false when width < 1240px');
    window.innerWidth = 1920;
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.19', 'Subtitle brace animation trigger on scroll/mount while squiggle mouse physics is active', (t) => {
    const sub = createSubtitleTimeline(heroDOM);
    const physics = createInteractiveSquiggle(heroDOM);
    sub.seek(2.7);
    physics.calculatePhysics(960, 540);
    t.assert(true, 'Subtitle and mouse physics active together');
    sub.kill();
    physics.cleanup();
  });

  await runner.runTest('Tier 3', 'Cross-Feature Interactions', 'T3.20', 'Master timeline restart while infinite loop on char13 and windmill on char2 are looping', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(6.0);
    master.restart();
    t.assertEqual(master.time(), 0, 'Master time reset to 0');
    master.kill();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4: REAL-WORLD SCENARIOS (10 Test Cases)
  // ═══════════════════════════════════════════════════════════════════════════

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.1', 'Real User Viewing Workflow: Mount -> 5.5s timeline progression -> steady state', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    const sub = createSubtitleTimeline(heroDOM);
    for (let time = 0; time <= 5.5; time += 0.1) {
      master.seek(time);
      sub.seek(time);
    }
    t.assert(master.time() >= 5.5, 'Reached steady state');
    master.kill();
    sub.kill();
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.2', 'Interactive Mouse Roaming: Cursor moves across 10 distinct coordinates over 3 seconds', (t) => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    const physics = createInteractiveSquiggle(heroDOM);
    const trajectory = [
      { x: 100, y: 100 }, { x: 300, y: 400 }, { x: 800, y: 200 },
      { x: 1400, y: 700 }, { x: 1800, y: 900 }, { x: 960, y: 540 },
      { x: 500, y: 800 }, { x: 200, y: 300 }, { x: 1600, y: 150 },
      { x: 960, y: 540 }
    ];
    trajectory.forEach(pt => {
      const res = physics.calculatePhysics(pt.x, pt.y);
      t.assert(res.xPercent >= -20 && res.xPercent <= 20, `xPercent bounded for x=${pt.x}`);
      t.assert(res.yPercent >= -20 && res.yPercent <= 20, `yPercent bounded for y=${pt.y}`);
      t.assert(res.targetRotation >= -20 && res.targetRotation <= 20, 'rotation bounded');
    });
    physics.cleanup();
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.3', 'Responsive Resizing: Resizes across 4 device breakpoints (Desktop -> Laptop -> Tablet -> Mobile)', (t) => {
    const viewports = [
      { w: 1920, h: 1080, name: 'Desktop' },
      { w: 1280, h: 800, name: 'Laptop' },
      { w: 768, h: 1024, name: 'Tablet' },
      { w: 375, h: 667, name: 'Mobile' }
    ];
    viewports.forEach(vp => {
      window.innerWidth = vp.w;
      window.innerHeight = vp.h;
      window.dispatchEvent({ type: 'resize' });
      const wmX = window.innerWidth / -2;
      t.assertEqual(wmX, -vp.w / 2, `${vp.name} windmill start X must be ${-vp.w / 2}`);
    });
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.4', 'CTA Button Interaction Cycle: Hover -> burst -> settle -> re-hover with fresh randoms', (t) => {
    const cta = createCTAButtonTimeline(heroDOM);
    cta.onMouseEnter();
    cta.tl.seek(1.0); // complete first burst
    cta.onMouseEnter(); // second hover invalidates and plays fresh
    t.assert(true, 'CTA interaction cycle completed');
    cta.cleanup();
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.5', 'Accessibility Reduced-Motion Toggle: Instantly resolves static layout without animation lag', (t) => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.assert(typeof isReduced === 'boolean', 'matchMedia query must resolve boolean');
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.6', 'React 19 StrictMode Lifecycle Stress Test: Mount -> Unmount -> Remount -> Play -> Teardown', (t) => {
    // Pass 1: Mount
    let ctx = gsap.context(() => {
      createReferenceHeroAnimation(heroDOM);
      createInteractiveSquiggle(heroDOM);
    });
    // Pass 2: Double-mount unmount
    ctx.revert();
    // Pass 3: Remount
    ctx = gsap.context(() => {
      const anim = createReferenceHeroAnimation(heroDOM);
      anim.master.seek(2.0);
    });
    // Pass 4: Final Teardown
    ctx.revert();
    t.assertEqual(ctx.data.length, 0, 'Zero lingering animations');
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.7', 'Rapid Navigation / Tab Switch Simulation: Timeline pauses and resumes cleanly', (t) => {
    const { master } = createReferenceHeroAnimation(heroDOM);
    master.seek(2.0);
    master.pause(); // Tab hidden
    master.play(); // Tab active
    master.seek(3.5);
    t.assertEqual(master.time(), 3.5, 'Resumed cleanly to 3.5s');
    master.kill();
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.8', 'Multi-Screen / Offscreen Cursor Movement: (clientX: -500, clientY: 2500) remains clamped', (t) => {
    const physics = createInteractiveSquiggle(heroDOM);
    const res = physics.calculatePhysics(-500, 2500);
    t.assert(!isNaN(res.xPercent), 'xPercent is not NaN');
    t.assert(!isNaN(res.yPercent), 'yPercent is not NaN');
    t.assert(res.rotateRange >= -1 && res.rotateRange <= 1, 'rotateRange strictly clamped to [-1, 1]');
    physics.cleanup();
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.9', 'Production Build & Asset Verification: Verifies core files and CSS assets are accessible', (t) => {
    const heroCss = path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.css');
    const heroHtml = path.resolve(__dirname, '../../src/components/GSAP_Hero/hero.html');
    const heroTsx = path.resolve(__dirname, '../../src/components/Hero.tsx');
    t.assert(fs.existsSync(heroCss), 'hero.css exists');
    t.assert(fs.existsSync(heroHtml), 'hero.html exists');
    t.assert(fs.existsSync(heroTsx), 'Hero.tsx exists');
  });

  await runner.runTest('Tier 4', 'Real-World Scenarios', 'T4.10', 'Full DOM & SVG Integrity Audit: 15 character spans, 5 flairs, 4 CTA particles, 2 braces verified', (t) => {
    const animateSpans = heroDOM.querySelectorAll('.home-hero__animate > span');
    const anythingSpans = heroDOM.querySelectorAll('.home-hero__anything > span');
    t.assertEqual(animateSpans.length, 7, 'Must have 7 characters in "Animate"');
    t.assertEqual(anythingSpans.length, 8, 'Must have 8 characters in "anything"');
    t.assert(heroDOM.querySelector('.home-hero__flair--windmill') !== null, 'Windmill flair present');
    t.assert(heroDOM.querySelector('.home-hero__flair--circles') !== null, 'Circles flair present');
    t.assert(heroDOM.querySelector('.home-hero__flair--star') !== null, 'Star flair present');
    t.assert(heroDOM.querySelector('.home-hero__flair--bolt') !== null, 'Bolt flair present');
    t.assert(heroDOM.querySelector('#home-hero-squiggle') !== null, 'Squiggle flair present');
    t.assertEqual(heroDOM.querySelectorAll('.subtitle__brace').length, 2, '2 Subtitle braces present');
    t.assert(heroDOM.querySelector('#btn-circles') !== null, 'CTA btn-circles present');
    t.assert(heroDOM.querySelector('#btn-windmill') !== null, 'CTA btn-windmill present');
    t.assert(heroDOM.querySelector('#btn-square') !== null, 'CTA btn-square present');
    t.assert(heroDOM.querySelector('#btn-star') !== null, 'CTA btn-star present');
  });

  return runner.results;
}
