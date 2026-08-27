"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import SectionTransition, { triggerSectionTransition } from "./SectionTransition";
import "./GSAP_Hero/hero.css";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, CustomEase);
  try {
    CustomEase.create(
      "airtime",
      "M0,0 C0.05,0.356 0.377,0.435 0.5,0.5 0.61,0.558 0.948,0.652 1,1 "
    );
    CustomEase.create(
      "rotaaaaate",
      "M0,0 C0.148,0.346 0.254,0.444 0.5,0.5 0.751,0.557 0.852,0.646 1,1 "
    );
  } catch {
    // Fallback if already created
  }
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const heading1Ref = useRef<HTMLSpanElement>(null);
  const heading2Ref = useRef<HTMLSpanElement>(null);
  const squiggleRef = useRef<HTMLDivElement>(null);
  const boltPathRef = useRef<SVGPathElement>(null);
  const boltRectRef = useRef<SVGRectElement>(null);
  const buttonWrapRef = useRef<HTMLDivElement>(null);
  const buttonBlockRef = useRef<HTMLDivElement>(null);
  const subtitleWrapRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // ─── 0. Reduced Motion Check ───
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Instant static reveal without continuous animations
        gsap.set(
          [
            ".home-hero__animate",
            ".home-hero__anything",
            ".home-hero__subtitle",
            ".home-hero__button",
            ".home-hero__flair",
            ".subtitle",
          ],
          {
            autoAlpha: 1,
            visibility: "inherit",
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
          }
        );
        gsap.set(".home-hero__flair--circles", { autoAlpha: 0 });
        gsap.set(".home-hero__flair--star", { autoAlpha: 0 });
        gsap.set(".home-hero__flair--bolt", { autoAlpha: 0 });
        gsap.set(".subtitle__label", { opacity: 1 });
        gsap.set(".subtitle__brace", { opacity: 1, xPercent: 0 });
        return;
      }

      // ─── 1. Squiggle Viewport Mouse Following Physics ───
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      const setWindowSize = () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
      };

      const squiggleEl = squiggleRef.current;
      let handleMouseMove: ((e: MouseEvent) => void) | null = null;
      let handleResize: (() => void) | null = null;

      if (squiggleEl) {
        const xTo = gsap.quickTo(squiggleEl, "xPercent", {
          duration: 1,
          ease: "power3",
        });
        const yTo = gsap.quickTo(squiggleEl, "yPercent", {
          duration: 1,
          ease: "power3",
        });
        const rotateTo = gsap.quickTo(squiggleEl, "rotation", {
          duration: 1,
          ease: "power3",
        });

        handleResize = () => {
          setWindowSize();
        };
        window.addEventListener("resize", handleResize);

        handleMouseMove = (e: MouseEvent) => {
          const xPercent = gsap.utils.mapRange(0, windowWidth, -20, 20, e.clientX);
          const yPercent = gsap.utils.mapRange(0, windowHeight, -20, 20, e.clientY);
          const rotateRange = gsap.utils.clamp(
            -1,
            1,
            gsap.utils.mapRange(
              windowWidth * 0.25,
              windowWidth * 0.75,
              1,
              -1,
              e.clientX
            )
          );

          rotateTo(yPercent * 1 * rotateRange);
          xTo(xPercent);
          yTo(yPercent);
        };
        window.addEventListener("mousemove", handleMouseMove);
      }

      // ─── 2. Letter Selectors & Master Timelines ───
      const heading1 = heading1Ref.current;
      const heading2 = heading2Ref.current;
      if (!heading1 || !heading2) return;

      const animateSelector = gsap.utils.selector(heading1);
      const anythingSelector = gsap.utils.selector(heading2);

      const defaults = {
        ease: "power2.out",
        duration: 0.6,
      };

      // Letter 1: "A"
      const char1 = () => {
        const tl = gsap.timeline({ defaults });
        const wrap = animateSelector(".a > span");
        const char = animateSelector(".a > span > span");

        tl.set(wrap, { transformOrigin: "50% 100%", rotationX: 0, yPercent: 0 });
        tl.fromTo(char, { yPercent: 100 }, { yPercent: 0, duration: 0.6 });
        tl.fromTo(
          wrap,
          { rotationX: -180 },
          { rotationX: 0, ease: "back.out(1.7)", duration: 1 },
          "-=.4"
        );
        return tl;
      };

      // Letter 2: "n" + Windmill + Circles Flair
      const char2 = () => {
        const tl = gsap.timeline({ defaults });
        const circles = animateSelector(".home-hero__flair--circles");
        const circlesSvg = animateSelector(".home-hero__flair--circles svg");
        const windmill = animateSelector(".home-hero__flair--windmill");
        const wrap = animateSelector(".n > span > span");
        const chars = animateSelector(".n > span > span > span");

        tl.set(chars[1], { autoAlpha: 1, rotationY: 0 });
        tl.set(circles, { autoAlpha: 1, yPercent: 100 });
        tl.fromTo(circlesSvg, { scale: 0 }, { scale: 1, ease: "back.out(1.7)", duration: 0.6 });
        tl.to(circles, {
          yPercent: -200,
          autoAlpha: 0,
          duration: 1.5,
          ease: "power4.out",
        });
        tl.fromTo(wrap, { yPercent: 100 }, { yPercent: 0, duration: 0.4 }, "<");
        tl.fromTo(
          windmill,
          {
            x: () => window.innerWidth / -2,
            rotationZ: -360,
          },
          {
            x: 0,
            rotationZ: 0,
            duration: 1,
          },
          "<"
        );
        tl.fromTo(chars[0], { rotationY: -180 }, { rotationY: 0, duration: 0.3 }, "+=.4");
        tl.fromTo(chars[1], { rotationY: 0 }, { rotationY: 180, duration: 0.3 }, "<");
        tl.to(
          windmill,
          {
            rotationZ: 90,
            duration: 0.3,
            repeat: -1,
            repeatDelay: 1,
          },
          "<"
        );
        return tl;
      };

      // Letter 3: "i"
      const char3 = () => {
        const char = animateSelector(".i > span");
        return gsap.fromTo(
          char,
          { yPercent: -100 },
          { yPercent: 0, ease: "back.out(1.4)", duration: 1 }
        );
      };

      // Letter 4: "m"
      const char4 = () => {
        const char = animateSelector(".m > span");
        return gsap.fromTo(
          char,
          { xPercent: -100 },
          { xPercent: 0, ...defaults }
        );
      };

      // Letter 5: "a2" + Star Flair (nests char4)
      const char5 = () => {
        const tl = gsap.timeline({ defaults });
        const wrap = animateSelector(".a2");
        const star = animateSelector(".home-hero__flair--star");
        const starSvg = animateSelector(".home-hero__flair--star svg");
        const char = animateSelector(".a2 > span > span");

        tl.set(star, { xPercent: -150, autoAlpha: 1 });
        tl.fromTo(starSvg, { scale: 0 }, { scale: 1, duration: 0.4 });
        tl.add(char4(), "+=.6");
        tl.to(star, { xPercent: 0 }, "<");
        tl.set(wrap, { overflow: "hidden" });
        tl.to(star, { yPercent: 130, ease: "power2.in" }, "+=.5");
        tl.fromTo(char, { yPercent: 100 }, { yPercent: 0, duration: 0.6 }, "-=.3");
        tl.to(starSvg, { rotationZ: 360, ease: "none", repeat: 2, duration: 2 }, 0);
        return tl;
      };

      // Letter 7: "n"
      const char7 = () => {
        const char = animateSelector(".e > span");
        return gsap.fromTo(
          char,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.9, ease: "power2.out" }
        );
      };

      // Letter 8: "e"
      const char8_e = () => {
        const char = animateSelector(".e2 > span");
        return gsap.fromTo(
          char,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.9, ease: "power2.out" }
        );
      };

      // Letter 6: "i" + Odometer Counter (nests char7 and char8_e)
      const char6 = () => {
        const tl = gsap.timeline({ defaults });
        const char = animateSelector(".t > span > span")[0];
        const numbersWrap = animateSelector(".t > span > span");
        const numbers = animateSelector(".t > span > span > span");

        tl.set(numbersWrap, { autoAlpha: 1 });
        tl.fromTo(numbers[0], { yPercent: 100 }, { yPercent: 0, duration: 0.4 }, "<");
        tl.fromTo(
          [numbers[1], numbers[2]],
          { yPercent: 100 },
          { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "power2.inOut" },
          "+=.2"
        );
        tl.to(numbers[0], { yPercent: -100 }, "-=.6");
        tl.fromTo(char, { yPercent: 100 }, { yPercent: 0, duration: 0.9 }, "<");
        tl.add(char7(), "<");
        tl.add(char8_e(), "<.1");
        return tl;
      };

      // Letter 8 & 9: "a" & "n" Dual-span Ticker
      const char8to9 = () => {
        const tl = gsap.timeline({ defaults });
        const topChars = anythingSelector(
          ".a span:first-of-type, .n span:first-of-type"
        );
        const bottomChars = anythingSelector(
          ".a span:last-of-type, .n span:last-of-type"
        );

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

      // Letter 10: "y"
      const char10 = () => {
        const char = anythingSelector(".y > span");
        return gsap.fromTo(
          char,
          { rotationY: -180, scale: 0 },
          { rotationY: 0, scale: 1, duration: 1, ease: "power2.out" }
        );
      };

      // Letter 11: "t" + Lightning Bolt
      const char11 = () => {
        const tl = gsap.timeline({ defaults });
        const bolt = anythingSelector(".home-hero__flair--bolt");
        const path = boltPathRef.current;
        const rect = boltRectRef.current;
        const char = anythingSelector(".t span");

        tl.set(bolt, { autoAlpha: 1 });
        if (path) {
          const len = path.getTotalLength() || 600.3;
          tl.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" }
          );
        }
        if (rect) {
          tl.from(
            rect,
            {
              yPercent: 100,
              transformOrigin: "50% 100%",
              duration: 3.5,
              ease: "power4.out",
            },
            "<.5"
          );
        }
        tl.from(
          bolt,
          {
            keyframes: {
              scale: [1, 1.1, 0.6, 0.7, 0.2, 0.3, 0],
              duration: 2,
            },
          },
          "-=2"
        );
        tl.fromTo(char, { scale: 0 }, { scale: 1, ease: "back.out(1.4)", duration: 0.6 }, "<.5");
        return tl;
      };

      // Letter 12: "h" + Squiggle Entrance
      const char12 = () => {
        const tl = gsap.timeline({ defaults });
        const worm = anythingSelector(".home-hero__flair--worm img");
        const char = anythingSelector(".h span span");

        tl.fromTo(
          worm,
          {
            autoAlpha: 0,
            yPercent: 100,
            rotationZ: 180,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationZ: 0,
            duration: 1.5,
            ease: "back.out(1.6)",
          }
        );
        tl.fromTo(char, { yPercent: -100 }, { yPercent: 0, duration: 0.6 }, "<.2");
        return tl;
      };

      // Letter 14: "n2"
      const char14 = () => {
        const tl = gsap.timeline({ defaults });
        const char = anythingSelector(".n2 span");
        tl.fromTo(char, { xPercent: -100 }, { xPercent: 0, duration: 0.6 });
        return tl;
      };

      // Letter 13: "i" Infinite Loop (nests char14)
      const char13 = () => {
        const tl = gsap.timeline({ defaults });
        const char = anythingSelector(".i > span");

        tl.from(char, { autoAlpha: 0, duration: 0.1 }, "<");
        tl.from(char, { rotationX: -450, duration: 1.3 }, "<.14");
        tl.add(char14(), "<+=.5");
        tl.to(
          char,
          {
            rotationX: 540,
            duration: 1.5,
            repeat: -1,
            repeatDelay: 3,
            yoyo: true,
            yoyoEase: "power2.out",
          },
          "+=2"
        );
        return tl;
      };

      // Letter 15: "g"
      const char15 = () => {
        const tl = gsap.timeline({ defaults });
        const char = anythingSelector(".g span");
        tl.fromTo(
          char,
          {
            autoAlpha: 0,
            rotationZ: -120,
          },
          {
            autoAlpha: 1,
            rotationZ: 0,
            duration: 2,
            ease: "elastic.out(1, 0.4)",
          },
          "<.6"
        );
        return tl;
      };

      // CTA Button Entrance
      const buttonIn = () => {
        const wrap = buttonWrapRef.current || ".home-hero__button";
        return gsap.from(wrap, {
          autoAlpha: 0,
          yPercent: 30,
          ...defaults,
        });
      };

      // ─── 3. Assemble Master Timeline ───
      const masterTl = gsap.timeline({
        id: "home-hero",
        defaults,
        paused: true,
      });

      masterTl.set([heading1, heading2], { autoAlpha: 1 });

      /* Animate */
      masterTl.add(char1(), 0);
      masterTl.add(char2(), 0.4);
      masterTl.add(char3(), 1.0);
      // Character 4 called inside 5
      masterTl.add(char5(), 0.8);
      masterTl.add(char6(), 1.1);
      // Character 7 called inside 6

      /* Possible */
      masterTl.add(char8to9(), 1.5);
      masterTl.add(char10(), 1.7);
      masterTl.add(char11(), 2.0);
      masterTl.add(char13(), 1.9);
      masterTl.add(char12(), 2.2);
      // Character 14 called inside 13
      masterTl.add(char15(), 2.4);
      masterTl.add(buttonIn(), 1.0);

      // ─── 4. Subtitle with Animated Curly Braces ───
      const subtitleEl = subtitleWrapRef.current;
      let subtitleTl: gsap.core.Timeline | null = null;
      if (subtitleEl) {
        subtitleTl = gsap.timeline({
          defaults: {
            ease: "power3.out",
            duration: 0.3,
          },
          paused: true,
        });
        gsap.set(subtitleEl, { autoAlpha: 1 });
        const label = subtitleEl.querySelector(".subtitle__label");
        const braces = subtitleEl.querySelectorAll(".subtitle__brace");

        subtitleTl
          .from(label, {
            opacity: 0,
            duration: 0.7,
            delay: 2.5,
          })
          .from(
            braces[0],
            {
              opacity: 0,
              xPercent: 100,
            },
            "<0.1"
          )
          .from(
            braces[1],
            {
              opacity: 0,
              xPercent: -100,
            },
            "<"
          );
      }

      // Listen for loader completion
      const startHero = () => {
        masterTl.play();
        if (subtitleTl) subtitleTl.play();
      };

      window.addEventListener("hero-start", startHero);

      // ─── 5. "Get GSAP" Button Particle Burst & Hover Interactions ───
      const btnBlock = buttonBlockRef.current;
      if (btnBlock) {
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

        const btnEaseAirtime =
          CustomEase.get("airtime") || "cubic-bezier(0.05, 0.356, 0.377, 0.435)";
        const btnEaseRotaaaaate =
          CustomEase.get("rotaaaaate") || "cubic-bezier(0.148, 0.346, 0.254, 0.444)";

        let isPlaying = false;

        const btnTl = gsap.timeline({
          defaults: {
            duration: 1,
          },
          paused: true,
          onStart: () => {
            isPlaying = true;
          },
          onComplete: () => {
            isPlaying = false;
          },
        });

        gsap.set(flairs, { scale: 0 });

        btnTl
          .set(flairs, {
            scale: 0,
            x: 0,
            y: 10,
            rotateZ: 0,
          })
          .set(icons[0], {
            yPercent: -140,
          })
          .set(icons[1], {
            yPercent: 0,
          })
          .to(getWord, {
            keyframes: [
              { x: -30, ease: "power4.out" },
              { x: 0, ease: "power4.in" },
            ],
          })
          .to(
            gsapWord,
            {
              keyframes: [
                { x: 30, ease: "power4.out" },
                { x: 0, ease: "power4.in" },
              ],
            },
            "<"
          )
          .to(
            icons[0],
            {
              yPercent: 0,
              duration: 0.6,
              ease: "power3.in",
            },
            "<.3"
          )
          .to(
            icons[1],
            {
              yPercent: 140,
              duration: 0.6,
              ease: "power3.out",
            },
            "<"
          )
          .to(
            flairs,
            {
              keyframes: [
                { scale: 0, zIndex: 2, duration: 0 },
                { y: () => gsap.utils.random(-80, -120), scale: 1 },
                { zIndex: -1, duration: 0.05 },
                { y: 0, scale: 0.3 },
              ],
              ease: btnEaseAirtime,
              stagger: 0.15,
            },
            "<"
          )
          .to(
            flairs,
            {
              x: () => gsap.utils.random(-50, 100),
              rotateZ: () => -360,
              ease: btnEaseRotaaaaate,
              stagger: 0.15,
            },
            "<"
          );

        const playBtnTimeline = () => {
          if (!isPlaying) {
            btnTl.invalidate().play(0);
          }
        };

        btnBlock.addEventListener("mouseenter", playBtnTimeline);

        return () => {
          btnBlock.removeEventListener("mouseenter", playBtnTimeline);
          window.removeEventListener("hero-start", startHero);
          if (handleResize) window.removeEventListener("resize", handleResize);
          if (handleMouseMove)
            window.removeEventListener("mousemove", handleMouseMove);
        };
      }

      return () => {
        window.removeEventListener("hero-start", startHero);
        if (handleResize) window.removeEventListener("resize", handleResize);
        if (handleMouseMove)
          window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="hero" className="home-hero relative">
      <SectionTransition />
      {/* Global Shared SVG Defs and Noise Filters */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="noise-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect id="svg-noise" width="500" height="500" filter="url(#noise-filter)" />
        </defs>
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="home-hero__inner">
          <div className="home-hero__heading">
            <h1 className="sr-only">Redefine Possible</h1>
            <div
              id="home-hero-heading"
              className="home-hero__heading-text heading-xl"
              aria-hidden="true"
            >
              {/* ─── Line 1: Redefine ─── */}
              <span
                ref={heading1Ref}
                className="home-hero__animate"
                style={{ opacity: 1, visibility: "inherit" }}
              >
                {/* 1. Letter 'R' */}
                <span className="a">
                  <span className="clip" style={{ transformOrigin: "50% 100%" }}>
                    <span>R</span>
                  </span>
                </span>

                {/* 2. Letter 'n' + Windmill & Circles Flair */}
                <span className="n">
                  <div className="home-hero__flair home-hero__flair--windmill">
                    <svg
                      viewBox="0 0 137 135"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z"
                        fill="url(#paint0_linear_1655_45397)"
                      />
                      <path
                        d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z"
                        fill="url(#pattern-home-hero-windmill-0)"
                        fillOpacity="0.6"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <defs>
                        <pattern
                          id="pattern-home-hero-windmill-0"
                          patternContentUnits="objectBoundingBox"
                          width="1.45985"
                          height="1.48148"
                        >
                          <use
                            href="#svg-noise"
                            transform="scale(0.00291971 0.00296296)"
                          />
                        </pattern>
                        <linearGradient
                          id="paint0_linear_1655_45397"
                          x1="-76.6791"
                          y1="-15.6157"
                          x2="165.682"
                          y2="81.0082"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.427083" stopColor="#FF8709" />
                          <stop offset="0.791667" stopColor="#F7BDF8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="home-hero__flair home-hero__flair--circles">
                    <svg
                      viewBox="0 0 156 156"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M45.9341 76.316C43.4159 76.8454 40.8068 77.1236 38.1333 77.1236C17.0729 77.1236 0 59.8589 0 38.5618C0 17.2647 17.0729 0 38.1333 0C59.1938 0 76.2666 17.2647 76.2666 38.5618C76.2666 40.3457 76.1469 42.1013 75.915 43.8209H80.0849C79.853 42.1013 79.7332 40.3457 79.7332 38.5618C79.7332 17.2647 96.8061 0 117.867 0C138.927 0 156 17.2647 156 38.5618C156 59.8589 138.927 77.1236 117.867 77.1236C115.499 77.1236 113.182 76.9054 110.934 76.4879V79.5128C113.182 79.0953 115.499 78.8771 117.867 78.8771C138.927 78.8771 156 96.1418 156 117.439C156 138.736 138.927 156.001 117.867 156.001C96.8064 156.001 79.7335 138.736 79.7335 117.439C79.7335 114.736 80.0086 112.097 80.5319 109.551H75.6376C76.0508 111.825 76.2667 114.169 76.2667 116.564C76.2667 137.861 59.1938 155.126 38.1334 155.126C17.0729 155.126 6.30037e-05 137.861 6.30037e-05 116.564C6.30037e-05 95.2671 17.0729 78.0024 38.1334 78.0024C40.8068 78.0024 43.416 78.2806 45.9341 78.8099V76.316Z"
                        fill="url(#paint0_radial_1336_100489)"
                      />
                      <path
                        fillOpacity="0.6"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M45.9341 76.316C43.4159 76.8454 40.8068 77.1236 38.1333 77.1236C17.0729 77.1236 0 59.8589 0 38.5618C0 17.2647 17.0729 0 38.1333 0C59.1938 0 76.2666 17.2647 76.2666 38.5618C76.2666 40.3457 76.1469 42.1013 75.915 43.8209H80.0849C79.853 42.1013 79.7332 40.3457 79.7332 38.5618C79.7332 17.2647 96.8061 0 117.867 0C138.927 0 156 17.2647 156 38.5618C156 59.8589 138.927 77.1236 117.867 77.1236C115.499 77.1236 113.182 76.9054 110.934 76.4879V79.5128C113.182 79.0953 115.499 78.8771 117.867 78.8771C138.927 78.8771 156 96.1418 156 117.439C156 138.736 138.927 156.001 117.867 156.001C96.8064 156.001 79.7335 138.736 79.7335 117.439C79.7335 114.736 80.0086 112.097 80.5319 109.551H75.6376C76.0508 111.825 76.2667 114.169 76.2667 116.564C76.2667 137.861 59.1938 155.126 38.1334 155.126C17.0729 155.126 6.30037e-05 137.861 6.30037e-05 116.564C6.30037e-05 95.2671 17.0729 78.0024 38.1334 78.0024C40.8068 78.0024 43.416 78.2806 45.9341 78.8099V76.316Z"
                        fill="url(#pattern-home-hero-circles-0)"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <defs>
                        <pattern
                          id="pattern-home-hero-circles-0"
                          patternContentUnits="objectBoundingBox"
                          width="0.641025"
                          height="0.641023"
                        >
                          <use href="#svg-noise" transform="scale(0.00128205)" />
                        </pattern>
                        <radialGradient
                          id="paint0_radial_1336_100489"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(48.0022 111.876) rotate(-90) scale(122.883 122.883)"
                        >
                          <stop stopColor="#E193FF" />
                          <stop offset="0.6721" stopColor="#8E78DA" />
                          <stop offset="0.7378" stopColor="#937DDB" />
                          <stop offset="0.8164" stopColor="#A28BDD" />
                          <stop offset="0.9014" stopColor="#BAA3E2" />
                          <stop offset="0.9905" stopColor="#DBC3E7" />
                          <stop offset="1" stopColor="#DFC7E8" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="clip">
                    <span>
                      <span>e</span>
                      <span
                        style={{
                          opacity: 1,
                          visibility: "inherit",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        e
                      </span>
                    </span>
                  </span>
                </span>

                {/* 3. Letter 'd' */}
                <span className="i clip">
                  <span>d</span>
                </span>

                {/* 4. Letter 'e' */}
                <span className="m clip">
                  <span>e</span>
                </span>

                {/* 5. Letter 'f' + Star Flair */}
                <span className="a2" style={{ overflow: "hidden" }}>
                  <div className="home-hero__flair home-hero__flair--star">
                    <svg
                      viewBox="0 0 157 156"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M82.2214 104.04L105.483 143.586C108.242 148.276 114.274 149.852 118.974 147.112V147.112C123.675 144.371 125.275 138.345 122.552 133.634L99.5971 93.9091L144.009 105.424C149.276 106.79 154.656 103.639 156.042 98.3773V98.3773C157.428 93.1154 154.298 87.7233 149.042 86.317L104.72 74.4593L144.266 51.1978C148.957 48.439 150.533 42.407 147.792 37.7062V37.7062C145.052 33.0054 139.026 31.4057 134.314 34.1282L94.5898 57.0835L106.105 12.6719C107.471 7.40463 104.32 2.02469 99.058 0.638673V0.638673C93.7961 -0.747342 88.4041 2.38242 86.9977 7.63895L75.14 51.9603L51.8786 12.4142C49.1197 7.72403 43.0878 6.14763 38.387 8.8883V8.8883C33.6862 11.629 32.0865 17.6548 34.809 22.3662L57.7643 62.0908L13.3526 50.5758C8.08539 49.2101 2.70545 52.3607 1.31944 57.6226V57.6226C-0.0665745 62.8845 3.06319 68.2766 8.31971 69.6829L52.6411 81.5406L13.095 104.802C8.4048 107.561 6.8284 113.593 9.56907 118.294V118.294C12.3097 122.994 18.3356 124.594 23.0469 121.872L62.7716 98.9164L51.2566 143.328C49.8909 148.595 53.0414 153.975 58.3034 155.361V155.361C63.5653 156.747 68.9573 153.617 70.3637 148.361L82.2214 104.04Z"
                        fill="white"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M82.2214 104.04L105.483 143.586C108.242 148.276 114.274 149.852 118.974 147.112V147.112C123.675 144.371 125.275 138.345 122.552 133.634L99.5971 93.9091L144.009 105.424C149.276 106.79 154.656 103.639 156.042 98.3773V98.3773C157.428 93.1154 154.298 87.7233 149.042 86.317L104.72 74.4593L144.266 51.1978C148.957 48.439 150.533 42.407 147.792 37.7062V37.7062C145.052 33.0054 139.026 31.4057 134.314 34.1282L94.5898 57.0835L106.105 12.6719C107.471 7.40463 104.32 2.02469 99.058 0.638673V0.638673C93.7961 -0.747342 88.4041 2.38242 86.9977 7.63895L75.14 51.9603L51.8786 12.4142C49.1197 7.72403 43.0878 6.14763 38.387 8.8883V8.8883C33.6862 11.629 32.0865 17.6548 34.809 22.3662L57.7643 62.0908L13.3526 50.5758C8.08539 49.2101 2.70545 52.3607 1.31944 57.6226V57.6226C-0.0665745 62.8845 3.06319 68.2766 8.31971 69.6829L52.6411 81.5406L13.095 104.802C8.4048 107.561 6.8284 113.593 9.56907 118.294V118.294C12.3097 122.994 18.3356 124.594 23.0469 121.872L62.7716 98.9164L51.2566 143.328C49.8909 148.595 53.0414 153.975 58.3034 155.361V155.361C63.5653 156.747 68.9573 153.617 70.3637 148.361L82.2214 104.04Z"
                        fill="url(#paint0_radial_1413_80169)"
                      />
                      <path
                        fillOpacity="0.6"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M82.2214 104.04L105.483 143.586C108.242 148.276 114.274 149.852 118.974 147.112V147.112C123.675 144.371 125.275 138.345 122.552 133.634L99.5971 93.9091L144.009 105.424C149.276 106.79 154.656 103.639 156.042 98.3773V98.3773C157.428 93.1154 154.298 87.7233 149.042 86.317L104.72 74.4593L144.266 51.1978C148.957 48.439 150.533 42.407 147.792 37.7062V37.7062C145.052 33.0054 139.026 31.4057 134.314 34.1282L94.5898 57.0835L106.105 12.6719C107.471 7.40463 104.32 2.02469 99.058 0.638673V0.638673C93.7961 -0.747342 88.4041 2.38242 86.9977 7.63895L75.14 51.9603L51.8786 12.4142C49.1197 7.72403 43.0878 6.14763 38.387 8.8883V8.8883C33.6862 11.629 32.0865 17.6548 34.809 22.3662L57.7643 62.0908L13.3526 50.5758C8.08539 49.2101 2.70545 52.3607 1.31944 57.6226V57.6226C-0.0665745 62.8845 3.06319 68.2766 8.31971 69.6829L52.6411 81.5406L13.095 104.802C8.4048 107.561 6.8284 113.593 9.56907 118.294V118.294C12.3097 122.994 18.3356 124.594 23.0469 121.872L62.7716 98.9164L51.2566 143.328C49.8909 148.595 53.0414 153.975 58.3034 155.361V155.361C63.5653 156.747 68.9573 153.617 70.3637 148.361L82.2214 104.04Z"
                        fill="url(#pattern-home-hero-star-0)"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <defs>
                        <pattern
                          id="pattern-home-hero-star-0"
                          patternContentUnits="objectBoundingBox"
                          width="0.625"
                          height="0.625"
                        >
                          <use href="#svg-noise" transform="scale(0.00125)" />
                        </pattern>
                        <radialGradient
                          id="paint0_radial_1413_80169"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(124.192 87.08) rotate(149.757) scale(126.034)"
                        >
                          <stop stopColor="#FFEBE7" />
                          <stop offset="0.6721" stopColor="#FF9C7C" />
                          <stop offset="0.8164" stopColor="#FF9983" />
                          <stop offset="0.9014" stopColor="#FF774B" />
                          <stop offset="1" stopColor="#E76F00" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="clip">
                    <span>f</span>
                  </span>
                </span>

                {/* 6. Letter 'i' + Odometer Digits */}
                <span className="t">
                  <span className="clip">
                    <span>i</span>
                    <span style={{ opacity: 1, visibility: "inherit" }}>
                      <span>1</span>
                      <span>0</span>
                      <span>0</span>
                    </span>
                  </span>
                </span>

                {/* 7. Letter 'n' */}
                <span className="e clip">
                  <span>n</span>
                </span>

                {/* 8. Letter 'e' */}
                <span className="e2 clip">
                  <span>e</span>
                </span>
              </span>

              {/* ─── Line 2: Possible ─── */}
              <span
                ref={heading2Ref}
                className="home-hero__anything"
                style={{ opacity: 1, visibility: "inherit" }}
              >
                {/* 8. Letter 'P' (Dual ticker) */}
                <span className="a clip">
                  <span>P</span>
                  <span>P</span>
                </span>

                {/* 9. Letter 'o' (Dual ticker) */}
                <span className="n clip">
                  <span>o</span>
                  <span>o</span>
                </span>

                {/* 10. Letter 's' */}
                <span className="y">
                  <span>s</span>
                </span>

                {/* 11. Letter 's' + Lightning Bolt */}
                <span className="t">
                  <div className="home-hero__flair home-hero__flair--bolt">
                    <svg
                      viewBox="0 0 134 229"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        ref={boltPathRef}
                        id="bolt-path"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M101.08 11C102.439 11 103.402 12.3264 102.982 13.6187L78.6746 88.3335C78.2542 89.6259 79.2175 90.9522 80.5765 90.9522H108.983C110.634 90.9522 111.574 92.8401 110.579 94.1577L10.2304 227L39.4408 125.708C39.8095 124.429 38.8499 123.154 37.5191 123.154H7.82733C6.44727 123.154 5.48193 121.789 5.94147 120.488L44.1353 12.334C44.4176 11.5346 45.1733 11 46.0211 11H101.08Z"
                        stroke="#0AE448"
                        strokeWidth="4"
                      />
                      <mask
                        id="mask0_1413_68143"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="134"
                        height="227"
                      >
                        <rect
                          ref={boltRectRef}
                          id="bolt-rect"
                          width="134"
                          height="227"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_1413_68143)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M102.08 10C103.439 10 104.402 11.3264 103.982 12.6187L79.6746 87.3335C79.2542 88.6259 80.2175 89.9522 81.5765 89.9522H109.983C111.634 89.9522 112.574 91.8401 111.579 93.1577L11.2304 226L40.4408 124.708C40.8095 123.429 39.8499 122.154 38.5191 122.154H8.82733C7.44727 122.154 6.48193 120.789 6.94147 119.488L45.1353 11.334C45.4176 10.5346 46.1733 10 47.0211 10H102.08Z"
                          fill="#0AE448"
                        />
                      </g>
                    </svg>
                  </div>
                  <span>s</span>
                </span>

                {/* 12. Letter 'i' (Infinite 3D wobble) */}
                <span className="i">
                  <span style={{ transformStyle: "preserve-3d" }}>i</span>
                </span>

                {/* 13. Letter 'b' + Worm Squiggle */}
                <span className="h">
                  <div
                    ref={squiggleRef}
                    id="home-hero-squiggle"
                    className="home-hero__flair home-hero__flair--worm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/flair-images/worm-e8f0c8f6.png"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="clip">
                    <span>b</span>
                  </span>
                </span>

                {/* 14. Letter 'l' */}
                <span className="n2 clip">
                  <span>l</span>
                </span>

                {/* 15. Letter 'e' */}
                <span className="g">
                  <span>e</span>
                </span>
              </span>
            </div>
          </div>

          {/* ─── Bottom Area: Subtitle & CTA Button ─── */}
          <div className="home-hero__bottom-area">
            {/* Subtitle with Curly Braces */}
            <div className="home-hero__subtitle">
            <h3
              ref={subtitleWrapRef}
              className="subtitle subtitle--large subtitle--left"
              data-block="subtitle"
              data-delay="2.5"
            >
              <div className="subtitle__brace">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 27 78"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFFCE1"
                    d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
                  />
                </svg>
              </div>
              <p className="subtitle__label">
                HaXtreme – An elite real-world problem solving arena engineered for talent
              </p>
              <div
                className="subtitle__brace"
                style={{ transform: "rotate(180deg)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 27 78"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFFCE1"
                    d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
                  />
                </svg>
              </div>
            </h3>
          </div>

          {/* ─── "Get GSAP" CTA Button with Particle Flairs ─── */}
          <div ref={buttonWrapRef} className="home-hero__button">
            <div
              ref={buttonBlockRef}
              className="get-gsap-btn get-gsap-btn--fill"
              data-block="get-gsap-btn"
            >
              {/* Flair 1: Circles */}
              <div
                id="btn-circles"
                className="get-gsap-btn__flair"
                style={{ transform: "translate(0px, 10px) scale(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  aria-hidden="true"
                >
                  <path
                    fill="url(#paint0_radial_2146_58993)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.959 10.053a4.368 4.368 0 0 1-.889-.17c-2.327-.7-3.64-3.174-2.933-5.527C4.845 2.002 7.305.662 9.632 1.36c2.327.7 3.64 3.174 2.933 5.528-.06.197-.131.387-.214.57l.46.138c.032-.198.078-.396.137-.593.707-2.353 3.167-3.694 5.494-2.995 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995a4.377 4.377 0 0 1-.745-.3l-.1.333c.261.029.525.082.786.16 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995-2.327-.7-3.64-3.175-2.933-5.528a4.51 4.51 0 0 1 .35-.845l-.54-.163c-.03.265-.085.531-.164.796-.708 2.353-3.168 3.694-5.495 2.994-2.327-.7-3.64-3.174-2.933-5.527.708-2.354 3.168-3.694 5.495-2.995.295.089.574.206.835.349l.083-.276Z"
                  />
                  <path
                    fill="url(#pattern-home-hero-btn-circles-0)"
                    fillOpacity="0.6"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.959 10.053a4.368 4.368 0 0 1-.889-.17c-2.327-.7-3.64-3.174-2.933-5.527C4.845 2.002 7.305.662 9.632 1.36c2.327.7 3.64 3.174 2.933 5.528-.06.197-.131.387-.214.57l.46.138c.032-.198.078-.396.137-.593.707-2.353 3.167-3.694 5.494-2.995 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995a4.377 4.377 0 0 1-.745-.3l-.1.333c.261.029.525.082.786.16 2.328.7 3.64 3.175 2.933 5.528-.707 2.353-3.167 3.694-5.494 2.995-2.327-.7-3.64-3.175-2.933-5.528a4.51 4.51 0 0 1 .35-.845l-.54-.163c-.03.265-.085.531-.164.796-.708 2.353-3.168 3.694-5.495 2.994-2.327-.7-3.64-3.174-2.933-5.527.708-2.354 3.168-3.694 5.495-2.995.295.089.574.206.835.349l.083-.276Z"
                  />
                  <defs>
                    <radialGradient
                      id="paint0_radial_2146_58993"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientTransform="rotate(-31.559 22.628 3.049) scale(17.064 11.3981)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFD9B0" />
                      <stop offset="0.807" stopColor="#FD9F3B" />
                      <stop offset="1" stopColor="#FF8709" />
                    </radialGradient>
                    <pattern
                      id="pattern-home-hero-btn-circles-0"
                      width="5.556"
                      height="5.556"
                      patternContentUnits="objectBoundingBox"
                    >
                      <use href="#svg-noise" transform="scale(0.01111)" />
                    </pattern>
                  </defs>
                </svg>
              </div>

              {/* Flair 2: Windmill */}
              <div
                id="btn-windmill"
                className="get-gsap-btn__flair"
                style={{ transform: "translate(0px, 10px) scale(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="62"
                  height="63"
                  viewBox="0 0 62 63"
                  aria-hidden="true"
                >
                  <path
                    fill="url(#paint0_radial_2771_42684)"
                    d="m34.246 27.525 10.197-13.201a.26.26 0 0 1 .362-.047L61.76 27.372a.26.26 0 0 1 .046.366c-7.386 9.336-20.882 11.074-30.391 3.919l16.975 13.112c.112.087.133.25.046.362L35.34 62.085a.26.26 0 0 1-.365.046c-9.41-7.444-11.1-21.093-3.746-30.616l-13.255 17.16a.259.259 0 0 1-.362.046L.658 35.626a.26.26 0 0 1-.046-.365c7.386-9.337 20.881-11.074 30.391-3.92l-16.935-13.08a.259.259 0 0 1-.047-.363L27.117.944a.26.26 0 0 1 .365-.046c8.08 6.393 10.469 17.361 6.326 26.362-.129.278.25.508.439.264l-.001.001Z"
                  />
                  <path
                    fill="url(#pattern-home-hero-btn-windmill-0)"
                    fillOpacity="0.6"
                    d="m34.246 27.525 10.197-13.201a.26.26 0 0 1 .362-.047L61.76 27.372a.26.26 0 0 1 .046.366c-7.386 9.336-20.882 11.074-30.391 3.919l16.975 13.112c.112.087.133.25.046.362L35.34 62.085a.26.26 0 0 1-.365.046c-9.41-7.444-11.1-21.093-3.746-30.616l-13.255 17.16a.259.259 0 0 1-.362.046L.658 35.626a.26.26 0 0 1-.046-.365c7.386-9.337 20.881-11.074 30.391-3.92l-16.935-13.08a.259.259 0 0 1-.047-.363L27.117.944a.26.26 0 0 1 .365-.046c8.08 6.393 10.469 17.361 6.326 26.362-.129.278.25.508.439.264l-.001.001Z"
                  />
                  <defs>
                    <radialGradient
                      id="paint0_radial_2771_42684"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientTransform="rotate(-142.317 24.316 16.274) scale(34.5669)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F0FCFF" />
                      <stop offset="0.672" stopColor="#9BEDFF" />
                      <stop offset="0.76" stopColor="#98ECFF" />
                      <stop offset="0.849" stopColor="#5BE1FF" />
                      <stop offset="0.948" stopColor="#00BAE2" />
                    </radialGradient>
                    <pattern
                      id="pattern-home-hero-btn-windmill-0"
                      width="2.279"
                      height="2.279"
                      patternContentUnits="objectBoundingBox"
                    >
                      <use href="#svg-noise" transform="scale(0.00456)" />
                    </pattern>
                  </defs>
                </svg>
              </div>

              {/* Flair 3: Square */}
              <div
                id="btn-square"
                className="get-gsap-btn__flair"
                style={{ transform: "translate(0px, 10px) scale(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  aria-hidden="true"
                >
                  <path
                    fill="url(#paint0_linear_2771_24471)"
                    d="M.27 7.683a1 1 0 0 1 .372-1.364L10.995.409a1 1 0 0 1 1.364.373l5.91 10.352a1 1 0 0 1-.373 1.365l-10.353 5.91a1 1 0 0 1-1.364-.373L.27 7.683Z"
                  />
                  <path
                    fill="url(#pattern-home-hero-btn-square-0)"
                    fillOpacity="0.6"
                    d="M.27 7.683a1 1 0 0 1 .372-1.364L10.995.409a1 1 0 0 1 1.364.373l5.91 10.352a1 1 0 0 1-.373 1.365l-10.353 5.91a1 1 0 0 1-1.364-.373L.27 7.683Z"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2771_24471"
                      x1="24.297"
                      x2="3.329"
                      y1="7.113"
                      y2="17.933"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.144" stopColor="#FFE9FE" />
                      <stop offset="1" stopColor="#FF96F9" />
                    </linearGradient>
                    <pattern
                      id="pattern-home-hero-btn-square-0"
                      width="5.08"
                      height="5.08"
                      patternContentUnits="objectBoundingBox"
                    >
                      <use href="#svg-noise" transform="scale(0.01016)" />
                    </pattern>
                  </defs>
                </svg>
              </div>

              {/* Flair 4: Star */}
              <div
                id="btn-star"
                className="get-gsap-btn__flair"
                style={{ transform: "translate(0px, 10px) scale(0, 0)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                >
                  <path
                    fill="url(#paint0_linear_2771_24384)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="m6.324 7.326-4.936-.849a1.078 1.078 0 0 0-.374 2.124l4.93.887-4.091 2.89a1.078 1.078 0 0 0 1.238 1.766l4.112-2.858-.849 4.936a1.078 1.078 0 0 0 2.124.374l.887-4.93 2.89 4.09a1.078 1.078 0 0 0 1.766-1.238l-2.858-4.111 4.936.848a1.078 1.078 0 0 0 .374-2.124l-4.93-.887 4.09-2.89a1.078 1.078 0 0 0-1.238-1.766l-4.111 2.858.848-4.935a1.078 1.078 0 0 0-2.124-.374l-.886 4.93-2.89-4.091a1.078 1.078 0 0 0-1.766 1.238l2.858 4.112Z"
                  />
                  <path
                    fill="url(#pattern-home-hero-btn-star-0)"
                    fillOpacity="0.6"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="m6.324 7.326-4.936-.849a1.078 1.078 0 0 0-.374 2.124l4.93.887-4.091 2.89a1.078 1.078 0 0 0 1.238 1.766l4.112-2.858-.849 4.936a1.078 1.078 0 0 0 2.124.374l.887-4.93 2.89 4.09a1.078 1.078 0 0 0 1.766-1.238l-2.858-4.111 4.936.848a1.078 1.078 0 0 0 .374-2.124l-4.93-.887 4.09-2.89a1.078 1.078 0 0 0-1.238-1.766l-4.111 2.858.848-4.935a1.078 1.078 0 0 0-2.124-.374l-.886 4.93-2.89-4.091a1.078 1.078 0 0 0-1.766 1.238l2.858 4.112Z"
                    style={{ mixBlendMode: "multiply" }}
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2771_24384"
                      x1="24.729"
                      x2="25.351"
                      y1="8.665"
                      y2="20.075"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#0AE448" />
                      <stop offset="1" stopColor="#0085D0" />
                    </linearGradient>
                    <pattern
                      id="pattern-home-hero-btn-star-0"
                      width="11.452"
                      height="11.452"
                      patternContentUnits="objectBoundingBox"
                    >
                      <use href="#svg-noise" transform="scale(0.0229)" />
                    </pattern>
                  </defs>
                </svg>
              </div>

              {/* Action Button */}
              <a
                href="#countdown"
                onClick={(e) => {
                  e.preventDefault();
                  triggerSectionTransition("countdown");
                }}
                className="get-gsap-btn__button button button--stroke"
              >
                <span className="get-gsap-btn__word">
                  <span className="button__label">Explore</span>
                </span>

                <span className="get-gsap-btn__word">
                  <span className="button__label">HaXtreme</span>

                  <span className="button__icon">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 11"
                        aria-hidden="true"
                      >
                        <path
                          fill="#fffce1"
                          d="M4.055 0v7.71l-3-3L0 5.79l4.805 4.804 4.804-4.805-1.054-1.078-3 3V0h-1.5Z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 11"
                        aria-hidden="true"
                      >
                        <path
                          fill="#fffce1"
                          d="M4.055 0v7.71l-3-3L0 5.79l4.805 4.804 4.804-4.805-1.054-1.078-3 3V0h-1.5Z"
                        />
                      </svg>
                    </span>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
