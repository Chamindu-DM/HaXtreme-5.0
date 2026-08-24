"use client";

/**
 * Hero.tsx
 * -----------------------------------------------------------------------
 * A from-scratch recreation of the "Animate anything" hero timeline,
 * reverse-engineered from a minified GSAP bundle (class `P` in the
 * original site's compiled JS) and the rendered DOM snapshot.
 *
 * What's faithfully preserved from the original:
 *  - The exact master-timeline offsets for every letter (0, .4, .8, 1,
 *    1.1, 1.5, 1.7, 1.9, 2, 2.2, 2.4) and every nested sub-timeline
 *    (e.g. the "m" reveal riding inside the "a2"/star timeline at
 *    "+=.6", "e" riding inside "t" at "<", "n2" riding inside the
 *    idle "i" wobble at "<+=.5").
 *  - Every per-letter easing curve, duration, and relative position
 *    ("<", "-=.4", "+=.5", keyframe arrays, etc).
 *  - The mouse-following squiggle (quickTo + mapRange/clamp math).
 *  - The DOM structure (nested clip/letter spans) needed for those
 *    exact CSS selectors to resolve to the right elements.
 *
 * What's NOT recoverable from a JS bundle and had to be substituted:
 *  - Original CSS (type scale, colors, exact icon positioning) wasn't
 *    in the bundle, so only minimal functional styling is included
 *    below — restyle to match your design system.
 *  - The worm/squiggle PNG asset doesn't exist here, so it's replaced
 *    with an inline SVG squiggle — swap in your own art.
 *  - One effect (`drawSVG`) depends on the paid DrawSVGPlugin, which
 *    isn't part of core GSAP. It's reproduced below with a plain
 *    strokeDasharray/strokeDashoffset tween instead.
 *
 * Dependencies: `gsap` only (no ScrollTrigger/SplitText/MorphSVG —
 * the original hero class doesn't use them; those plugins belong to
 * other sections of that page).
 * -----------------------------------------------------------------------
 */

import { useId, useLayoutEffect, useRef, forwardRef } from "react";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  Decorative flair pieces                                           */
/* ------------------------------------------------------------------ */

function WindmillFlair() {
  const gradId = useId();
  return (
    <div className="hero-flair hero-flair--windmill" aria-hidden="true">
      <svg viewBox="0 0 137 135" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z"
          fill={`url(#${gradId})`}
        />
        <defs>
          <linearGradient id={gradId} x1="-76.6791" y1="-15.6157" x2="165.682" y2="81.0082" gradientUnits="userSpaceOnUse">
            <stop offset="0.427083" stopColor="#FF8709" />
            <stop offset="0.791667" stopColor="#F7BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CirclesFlair() {
  const gradId = useId();
  return (
    <div className="hero-flair hero-flair--circles" aria-hidden="true">
      <svg viewBox="0 0 156 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M45.9341 76.316C43.4159 76.8454 40.8068 77.1236 38.1333 77.1236C17.0729 77.1236 0 59.8589 0 38.5618C0 17.2647 17.0729 0 38.1333 0C59.1938 0 76.2666 17.2647 76.2666 38.5618C76.2666 40.3457 76.1469 42.1013 75.915 43.8209H80.0849C79.853 42.1013 79.7332 40.3457 79.7332 38.5618C79.7332 17.2647 96.8061 0 117.867 0C138.927 0 156 17.2647 156 38.5618C156 59.8589 138.927 77.1236 117.867 77.1236C115.499 77.1236 113.182 76.9054 110.934 76.4879V79.5128C113.182 79.0953 115.499 78.8771 117.867 78.8771C138.927 78.8771 156 96.1418 156 117.439C156 138.736 138.927 156.001 117.867 156.001C96.8064 156.001 79.7335 138.736 79.7335 117.439C79.7335 114.736 80.0086 112.097 80.5319 109.551H75.6376C76.0508 111.825 76.2667 114.169 76.2667 116.564C76.2667 137.861 59.1938 155.126 38.1334 155.126C17.0729 155.126 0.0000630 137.861 0.0000630 116.564C0.0000630 95.2671 17.0729 78.0024 38.1334 78.0024C40.8068 78.0024 43.416 78.2806 45.9341 78.8099V76.316Z"
          fill={`url(#${gradId})`}
        />
        <defs>
          <radialGradient id={gradId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48.0022 111.876) rotate(-90) scale(122.883 122.883)">
            <stop stopColor="#E193FF" />
            <stop offset="0.6721" stopColor="#8E78DA" />
            <stop offset="1" stopColor="#DFC7E8" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function StarFlair() {
  const gradId = useId();
  return (
    <div className="hero-flair hero-flair--star" aria-hidden="true">
      <svg viewBox="0 0 157 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M82.2214 104.04L105.483 143.586C108.242 148.276 114.274 149.852 118.974 147.112C123.675 144.371 125.275 138.345 122.552 133.634L99.5971 93.9091L144.009 105.424C149.276 106.79 154.656 103.639 156.042 98.3773C157.428 93.1154 154.298 87.7233 149.042 86.317L104.72 74.4593L144.266 51.1978C148.957 48.439 150.533 42.407 147.792 37.7062C145.052 33.0054 139.026 31.4057 134.314 34.1282L94.5898 57.0835L106.105 12.6719C107.471 7.40463 104.32 2.02469 99.058 0.638673C93.7961 -0.747342 88.4041 2.38242 86.9977 7.63895L75.14 51.9603L51.8786 12.4142C49.1197 7.72403 43.0878 6.14763 38.387 8.8883C33.6862 11.629 32.0865 17.6548 34.809 22.3662L57.7643 62.0908L13.3526 50.5758C8.08539 49.2101 2.70545 52.3607 1.31944 57.6226C-0.0665745 62.8845 3.06319 68.2766 8.31971 69.6829L52.6411 81.5406L13.095 104.802C8.4048 107.561 6.8284 113.593 9.56907 118.294C12.3097 122.994 18.3356 124.594 23.0469 121.872L62.7716 98.9164L51.2566 143.328C49.8909 148.595 53.0414 153.975 58.3034 155.361C63.5653 156.747 68.9573 153.617 70.3637 148.361L82.2214 104.04Z"
          fill={`url(#${gradId})`}
        />
        <defs>
          <radialGradient id={gradId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(124.192 87.08) rotate(149.757) scale(126.034)">
            <stop stopColor="#FFEBE7" />
            <stop offset="0.6721" stopColor="#FF9C7C" />
            <stop offset="1" stopColor="#E76F00" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

const BoltFlair = forwardRef<
  { path: SVGPathElement | null; rect: SVGRectElement | null },
  { pathRef: React.RefObject<SVGPathElement | null>; rectRef: React.RefObject<SVGRectElement | null> }
>(function BoltFlairInner({ pathRef, rectRef }) {
  const maskId = useId();
  return (
    <div className="hero-flair hero-flair--bolt" aria-hidden="true">
      <svg viewBox="0 0 134 229" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={pathRef}
          d="M101.08 11C102.439 11 103.402 12.3264 102.982 13.6187L78.6746 88.3335C78.2542 89.6259 79.2175 90.9522 80.5765 90.9522H108.983C110.634 90.9522 111.574 92.8401 110.579 94.1577L10.2304 227L39.4408 125.708C39.8095 124.429 38.8499 123.154 37.5191 123.154H7.82733C6.44727 123.154 5.48193 121.789 5.94147 120.488L44.1353 12.334C44.4176 11.5346 45.1733 11 46.0211 11H101.08Z"
          stroke="#0AE448"
          strokeWidth={4}
        />
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="134" height="229">
          <rect ref={rectRef} width="134" height="227" fill="#D9D9D9" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M102.08 10C103.439 10 104.402 11.3264 103.982 12.6187L79.6746 87.3335C79.2542 88.6259 80.2175 89.9522 81.5765 89.9522H109.983C111.634 89.9522 112.574 91.8401 111.579 93.1577L11.2304 226L40.4408 124.708C40.8095 123.429 39.8499 122.154 38.5191 122.154H8.82733C7.44727 122.154 6.48193 120.789 6.94147 119.488L45.1353 11.334C45.4176 10.5346 46.1733 10 47.0211 10H102.08Z"
            fill="#0AE448"
          />
        </g>
      </svg>
    </div>
  );
});

// Stand-in for the original worm PNG — swap for your own asset.
const WormFlair = forwardRef<HTMLDivElement>(function WormFlairInner(_props, ref) {
  return (
    <div ref={ref} className="hero-flair hero-flair--worm" aria-hidden="true">
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 20 Q20 2 38 20 T74 20 T110 20" stroke="#0AE448" strokeWidth={4} strokeLinecap="round" />
      </svg>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLSpanElement>(null); // "Animate"
  const heading2Ref = useRef<HTMLSpanElement>(null); // "anything"
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const wormWrapRef = useRef<HTMLDivElement>(null);
  const boltPathRef = useRef<SVGPathElement>(null);
  const boltRectRef = useRef<SVGRectElement>(null);

  useLayoutEffect(() => {
    const heading1 = heading1Ref.current;
    const heading2 = heading2Ref.current;
    if (!heading1 || !heading2) return;

    // Scoped-selector helpers, mirroring gsap.utils.selector(scopeEl)
    // from the original bundle.
    const $1 = <T extends Element = HTMLElement>(sel: string) => heading1.querySelector<T>(sel);
    const $1all = <T extends Element = HTMLElement>(sel: string) => Array.from(heading1.querySelectorAll<T>(sel));
    const $2 = <T extends Element = HTMLElement>(sel: string) => heading2.querySelector<T>(sel);
    const $2all = <T extends Element = HTMLElement>(sel: string) => Array.from(heading2.querySelectorAll<T>(sel));

    let removeListeners = () => {};

    const ctx = gsap.context(() => {
      const defaults = { ease: "power2.out", duration: 0.6 };

      /* ---------------- mouse-follow squiggle ---------------- */
      let vw = window.innerWidth;
      let vh = window.innerHeight;
      const measure = () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
      };
      measure();

      const worm = wormWrapRef.current;
      if (worm) {
        const moveX = gsap.quickTo(worm, "xPercent", { duration: 1, ease: "power3" });
        const moveY = gsap.quickTo(worm, "yPercent", { duration: 1, ease: "power3" });
        const rotate = gsap.quickTo(worm, "rotation", { duration: 1, ease: "power3" });

        const onResize = () => measure();
        const onMove = (e: MouseEvent) => {
          const x = gsap.utils.mapRange(0, vw, -20, 20, e.clientX);
          const y = gsap.utils.mapRange(0, vh, -20, 20, e.clientY);
          const w = gsap.utils.clamp(-1, 1, gsap.utils.mapRange(vw * 0.25, vw * 0.75, 1, -1, e.clientX));
          rotate(y * 1 * w);
          moveX(x);
          moveY(y);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMove);
        removeListeners = () => {
          window.removeEventListener("resize", onResize);
          window.removeEventListener("mousemove", onMove);
        };
      }

      /* ---------------- "Animate" letters ---------------- */

      // char1 — "A": flip in on rotationX
      const charA = () => {
        const tl = gsap.timeline({ defaults });
        const outer = $1(".a > span");
        const inner = $1(".a > span > span");
        tl.set(outer, { transformOrigin: "50% 100%" });
        tl.from(inner, { yPercent: 100 });
        tl.from(outer, { rotationX: -180, ease: "back.out(1.7)", duration: 1 }, "-=.4");
        return tl;
      };

      // char2 — "n": windmill flies in, circles flair sweeps through,
      // "n" flips into view while a hidden ghost "a" flips away.
      const charN = () => {
        const tl = gsap.timeline({ defaults });
        const circlesWrap = $1(".hero-flair--circles");
        const circlesSvg = $1(".hero-flair--circles svg");
        const windmill = $1(".hero-flair--windmill");
        const wrap = $1(".n > span > span");
        const letters = $1all(".n > span > span > span"); // [n, ghost-a]

        tl.set(letters[1], { autoAlpha: 1 });
        tl.set(circlesWrap, { autoAlpha: 1, yPercent: 100 });
        tl.from(circlesSvg, { scale: 0, ease: "back.out(1.7)" });
        tl.to(circlesWrap, { yPercent: -200, autoAlpha: 0, duration: 1.5, ease: "power4.out" });
        tl.from(wrap, { yPercent: 100, duration: 0.4 }, "<");
        tl.from(windmill, { x: () => -window.innerWidth / 2, rotationZ: -360, duration: 1 }, "<");
        tl.from(letters[0], { rotationY: -180, duration: 0.3 }, "+=.4");
        tl.to(letters[1], { rotationY: 180, duration: 0.3 }, "<");
        tl.to(windmill, { rotationZ: 90, duration: 0.3, repeat: -1, repeatDelay: 1 }, "<");
        return tl;
      };

      // char3 — "i"
      const charI = () => gsap.from($1(".i > span"), { yPercent: -100, ease: "back.out(1.4)", duration: 1 });

      // char4 — "m" (also reused nested inside char5/"a2")
      const charM = () => gsap.from($1(".m > span"), { xPercent: -100, ...defaults });

      // char5 — second "a" + star flair; nests char4 ("m") inside it
      const charA2 = () => {
        const tl = gsap.timeline({ defaults });
        const star = $1(".hero-flair--star");
        const starSvg = $1(".hero-flair--star svg");
        const a2 = $1(".a2");
        const letter = $1(".a2 > span > span");

        tl.set(star, { xPercent: -150, autoAlpha: 1 });
        tl.from(starSvg, { scale: 0, duration: 0.4 });
        tl.add(charM(), "+=.6");
        tl.to(star, { xPercent: 0 }, "<");
        tl.set(a2, { overflow: "hidden" });
        tl.to(star, { yPercent: 130, ease: "power2.in" }, "+=.5");
        tl.from(letter, { yPercent: 100 }, "-=.3");
        tl.to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);
        return tl;
      };

      // char7 — "e" (nested inside char6/"t")
      const charE = () => gsap.from($1(".e > span"), { yPercent: 100, duration: 0.9 });

      // char6 — "t": a little "100" odometer rolls past before settling
      const charT = () => {
        const tl = gsap.timeline({ defaults });
        const clipChildren = $1all(".t > span > span"); // [t-letter, digits-wrap]
        const letter = clipChildren[0];
        const digits = $1all(".t > span > span > span"); // [1, 0, 0]

        tl.set(clipChildren, { autoAlpha: 1 });
        tl.from(digits[0], { yPercent: 100, duration: 0.4 }, "<");
        tl.fromTo(
          [digits[1], digits[2]],
          { yPercent: 100 },
          { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" },
          "+=.2"
        );
        tl.to(digits[0], { yPercent: -100 }, "-=.6");
        tl.from(letter, { yPercent: 100, duration: 0.9 }, "<");
        tl.add(charE(), "<");
        return tl;
      };

      /* ---------------- "anything" letters ---------------- */

      // char8to9 — "a" + "n": a jittery ticker-roll before settling
      const charAN = () => {
        const tl = gsap.timeline({ defaults });
        const first = $2all(".a span:first-of-type, .n span:first-of-type");
        const last = $2all(".a span:last-of-type, .n span:last-of-type");

        tl.fromTo(
          last,
          { yPercent: 100 },
          { keyframes: { yPercent: [100, 0, 100, 0], ease: "power1.out" }, duration: 3, stagger: 0.4 }
        );
        tl.fromTo(
          first,
          { yPercent: -100 },
          { keyframes: { yPercent: [-100, -100, 20, -100], ease: "power1.out" }, duration: 3, stagger: 0.4 },
          "<"
        );
        return tl;
      };

      // char10 — "y"
      const charY = () => gsap.from($2(".y > span"), { rotationY: -180, duration: 1, scale: 0 });

      // char11 — "t" + bolt flair (drawSVG substituted with dasharray/dashoffset)
      const charT2 = () => {
        const tl = gsap.timeline({ defaults });
        const bolt = $2(".hero-flair--bolt");
        const path = boltPathRef.current;
        const rect = boltRectRef.current;
        const letter = $2(".t span");

        tl.set(bolt, { autoAlpha: 1 });
        if (path) {
          const len = path.getTotalLength();
          tl.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" }
          );
        }
        tl.from(rect, { yPercent: 100, transformOrigin: "50% 100%", duration: 3.5, ease: "power4.out" }, "<.5");
        tl.from(bolt, { keyframes: { scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0], duration: 2 } }, "-=2");
        tl.from(letter, { scale: 0, ease: "back.out(1.4)" }, "<.5");
        return tl;
      };

      // char12 — "h" + worm squiggle drop-in
      const charH = () => {
        const tl = gsap.timeline({ defaults });
        const wormImg = worm?.querySelector("svg, img") ?? null;
        const letter = $2(".h span span");

        tl.from(wormImg, { autoAlpha: 0, duration: 1.5, yPercent: 100, rotationZ: 180, ease: "back.out(1.6)" });
        tl.from(letter, { yPercent: -100 }, "<.2");
        return tl;
      };

      // char14 — "n2" (nested inside char13/idle "i")
      const charN2 = () => gsap.from($2(".n2 span"), { xPercent: -100 });

      // char13 — "i": entrance flip, then an idle wobble loop
      const charI2 = () => {
        const tl = gsap.timeline({ defaults });
        const letter = $2(".i > span");

        tl.from(letter, { autoAlpha: 0, duration: 0.1 }, "<");
        tl.from(letter, { rotationX: -450, duration: 1.3 }, "<.14");
        tl.add(charN2(), "<+=.5");
        tl.to(
          letter,
          { rotationX: 540, duration: 1.5, repeat: -1, repeatDelay: 3, yoyo: true, yoyoEase: "power2.out" },
          "+=2"
        );
        return tl;
      };

      // char15 — "g"
      const charG = () => {
        const tl = gsap.timeline({ defaults });
        tl.from($2(".g span"), { autoAlpha: 0, rotationZ: -120, duration: 2, ease: "elastic.out(1, 0.4)" }, "<.6");
        return tl;
      };

      const buttonIn = () => gsap.from(buttonRef.current, { autoAlpha: 0, yPercent: 30, ...defaults });

      /* ---------------- master timeline ---------------- */
      gsap.set([heading1, heading2], { autoAlpha: 1 });

      const master = gsap.timeline({ defaults });
      master.add(charA(), 0);
      master.add(charN(), 0.4);
      master.add(charI(), 1);
      master.add(charA2(), 0.8);
      master.add(charT(), 1.1);
      master.add(charAN(), 1.5);
      master.add(charY(), 1.7);
      master.add(charT2(), 2);
      master.add(charH(), 1.9);
      master.add(charI2(), 2.4);
      master.add(charG(), 2.2);
      master.add(buttonIn(), 1);
    }, rootRef);

    return () => {
      removeListeners();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="hero">
      <style>{`
        .hero { position: relative; padding: 8rem 1.5rem; overflow: hidden; }
        .hero-heading {
          font-size: clamp(2.5rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1.05;
          display: flex;
          flex-direction: column;
          gap: .1em;
        }
        .hero-heading .row { display: flex; flex-wrap: wrap; visibility: hidden; }
        .hero-heading span[class]:not(.clip) { position: relative; display: inline-block; }
        .clip { display: inline-block; overflow: hidden; }
        .clip > span { display: inline-block; }
        .hero-flair { position: absolute; width: 2em; height: 2em; pointer-events: none; }
        .hero-flair--windmill { top: -0.6em; left: -1.4em; }
        .hero-flair--circles { top: -0.4em; left: -0.2em; }
        .hero-flair--star { top: -0.9em; right: -1.2em; }
        .hero-flair--bolt { top: -0.8em; right: -1.6em; width: 1.4em; height: 2.4em; }
        .hero-flair--worm { top: -0.5em; left: 0; width: 3em; height: 1em; }
        .a2 { position: relative; }
        .hero-cta {
          display: inline-block;
          margin-top: 2.5rem;
          padding: 0.9em 1.8em;
          border-radius: 999px;
          background: #0ae448;
          color: #05130a;
          font-weight: 600;
          text-decoration: none;
        }
        .sr-only {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>

      <h1 className="sr-only">Animate anything</h1>

      <div className="hero-heading" aria-hidden="true">
        <span ref={heading1Ref} className="row row--animate">
          <span className="a">
            <span className="clip">
              <span>A</span>
            </span>
          </span>
          <span className="n">
            <WindmillFlair />
            <CirclesFlair />
            <span className="clip">
              <span>
                <span>n</span>
                <span>a</span>
              </span>
            </span>
          </span>
          <span className="i">
            <span>i</span>
          </span>
          <span className="m">
            <span>m</span>
          </span>
          <span className="a2">
            <StarFlair />
            <span className="clip">
              <span>a</span>
            </span>
          </span>
          <span className="t">
            <span className="clip">
              <span>t</span>
              <span>
                <span>1</span>
                <span>0</span>
                <span>0</span>
              </span>
            </span>
          </span>
          <span className="e">
            <span>e</span>
          </span>
        </span>

        <span ref={heading2Ref} className="row row--anything">
          <span className="a clip">
            <span>a</span>
            <span>a</span>
          </span>
          <span className="n clip">
            <span>n</span>
            <span>n</span>
          </span>
          <span className="y">
            <span>y</span>
          </span>
          <span className="t">
            <BoltFlair pathRef={boltPathRef} rectRef={boltRectRef} />
            <span>t</span>
          </span>
          <span className="h">
            <WormFlair ref={wormWrapRef} />
            <span className="clip">
              <span>h</span>
            </span>
          </span>
          <span className="i">
            <span>i</span>
          </span>
          <span className="n2">
            <span>n</span>
          </span>
          <span className="g">
            <span>g</span>
          </span>
        </span>
      </div>

      <a ref={buttonRef} href="#" className="hero-cta">
        Get started
      </a>
    </div>
  );
}