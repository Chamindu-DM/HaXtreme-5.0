"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const NEW_SVG_DATA = {
  // Static Back Folder Shell (Bottom Layer)
  bgPath:
    "M38.9304 196.197L38.9304 805.595H987.06C987.13 795.194 987.14 272.791 987.1 262.39C986.825 240.721 973.68 222.061 953.205 215.32C942.26 211.717 923.47 212.907 911.475 212.909L855.485 212.935L553.375 212.933L454.814 212.936C437.556 212.937 420.179 213.123 402.939 212.746C355.228 211.704 354.241 137.897 305.25 138.965C300.015 139.079 294.533 138.918 289.279 138.917L243.26 138.929L141.796 138.914C124.165 138.912 106.719 139.051 88.8033 138.978C65.7003 138.884 46.4987 153.603 40.3191 175.973C38.9257 182.546 38.8606 189.543 38.9304 196.197Z",
  // Static Bottom Seam Layer
  bottomPath:
    "M39.2002 808.849C42.3752 807.499 55.4399 808.004 59.7969 808.004L93.3904 808.019L201.337 808.024L803.895 807.989C821.315 807.989 983.15 807.329 985.385 808.394C985.51 808.449 985.615 808.539 985.73 808.614C984.6 810.124 982.48 809.719 980.695 809.654L279.677 809.624L110.754 809.614L64.9899 809.604C59.2654 809.584 44.956 808.964 39.8179 810.214L39.2002 808.849Z",
  
  // State 1 (from 1.svg - closed folder)
  state1: {
    paper: {
      x: 73,
      y: 225,
      transform: "rotate(0 73 225)",
    },
    frontFlap:
      "M39 308C39 280.386 61.3858 258 89 258H937C964.614 258 987 280.386 987 308L987 833C987 860.614 964.614 883 937 883H89C61.3858 883 39 860.614 39 833L39 308Z",
  },

  // State 2 (from 2.svg - open folder with paper pulled up and rotated)
  state2: {
    paper: {
      x: 121.522,
      y: 158.934,
      transform: "rotate(4.43159 121.522 158.934)",
    },
    frontFlap:
      "M9.76512 326.624C8.26204 298.018 31.0513 274 59.6962 274H907.558C934.153 274 956.094 294.818 957.489 321.376L984.235 830.376C985.738 858.982 962.949 883 934.304 883H86.4417C59.8471 883 37.9061 862.182 36.5106 835.624L9.76512 326.624Z",
  },
};

export default function Guidelines() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<SVGRectElement>(null);
  const frontFlapRef = useRef<SVGPathElement>(null);

  const loopTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─── 1. Text Line-by-Line Entrance Animations ───
      if (!prefersReducedMotion) {
        const textLines = gsap.utils.toArray<HTMLElement>(
          ".guideline-line-reveal",
          sectionRef.current
        );

        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        textTl.from(".guidelines-meta", {
          y: 15,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        textTl.from(
          textLines,
          {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.2"
        );

        textTl.from(
          ".guidelines-cta",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // ─── 2. SVG Morphing: Move only middle paper and front flap ───
      if (paperRef.current && frontFlapRef.current) {
        const pEl = paperRef.current;
        const fEl = frontFlapRef.current;

        const loopTl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.2,
          defaults: { duration: 1.4, ease: "power2.inOut" },
        });

        loopTlRef.current = loopTl;

        if (!prefersReducedMotion) {
          // Transition: 1.svg -> 2.svg
          loopTl
            .to(
              pEl,
              {
                attr: {
                  x: NEW_SVG_DATA.state2.paper.x,
                  y: NEW_SVG_DATA.state2.paper.y,
                  transform: NEW_SVG_DATA.state2.paper.transform,
                },
              },
              0
            )
            .to(fEl, { attr: { d: NEW_SVG_DATA.state2.frontFlap } }, 0)
            // Transition: 2.svg -> 1.svg
            .to(
              pEl,
              {
                attr: {
                  x: NEW_SVG_DATA.state1.paper.x,
                  y: NEW_SVG_DATA.state1.paper.y,
                  transform: NEW_SVG_DATA.state1.paper.transform,
                },
                delay: 1.2,
              }
            )
            .to(fEl, { attr: { d: NEW_SVG_DATA.state1.frontFlap } }, "<");
        }
      }
    },
    { scope: sectionRef }
  );

  // ─── Hover Handler: Always show 2.svg on hover ───
  const handleMouseEnter = () => {
    if (loopTlRef.current) loopTlRef.current.pause();

    if (paperRef.current && frontFlapRef.current) {
      gsap.to(paperRef.current, {
        attr: {
          x: NEW_SVG_DATA.state2.paper.x,
          y: NEW_SVG_DATA.state2.paper.y,
          transform: NEW_SVG_DATA.state2.paper.transform,
        },
        duration: 0.45,
        ease: "power2.out",
      });
      gsap.to(frontFlapRef.current, {
        attr: { d: NEW_SVG_DATA.state2.frontFlap },
        duration: 0.45,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (paperRef.current && frontFlapRef.current) {
      gsap.to(paperRef.current, {
        attr: {
          x: NEW_SVG_DATA.state1.paper.x,
          y: NEW_SVG_DATA.state1.paper.y,
          transform: NEW_SVG_DATA.state1.paper.transform,
        },
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (loopTlRef.current) loopTlRef.current.play();
        },
      });
      gsap.to(frontFlapRef.current, {
        attr: { d: NEW_SVG_DATA.state1.frontFlap },
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="guidelines"
      className="w-full min-h-screen relative flex items-center justify-center bg-[#0e100f] text-white py-16 sm:py-24 select-none"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typography, Details, and Download Button */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Headline in Helvetica Neue */}
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{
                fontFamily:
                  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <span className="block overflow-hidden">
                <span className="block guideline-line-reveal">
                  Guidelines Booklet
                </span>
              </span>
            </h2>

            {/* Body copy in Space Mono with Line-by-Line Reveal */}
            <div className="space-y-4 font-space-mono text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              <p className="block overflow-hidden">
                <span className="block guideline-line-reveal">
                  Get full clarity on competition stages, team eligibility,
                  scoring criteria, and the official code of conduct.
                </span>
              </p>
            </div>

            {/* Document Specs & Download CTA Button */}
            <div className="guidelines-cta pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Primary Download Button */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert("HaXtreme 5.0 Guideline booklet will be available for download soon!");
                }}
                className="group inline-flex items-center gap-3 bg-[#0ae448] hover:bg-[#abff84] text-black font-space-mono font-bold px-7 py-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-[#0ae448]/20"
              >
                <span>Download Booklet</span>
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>

          </div>

          {/* Right Column: Clean SVG Morphing Folder */}
          <div className="flex items-center justify-center w-full">
            <div
              ref={svgWrapRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* 1. Static Bottom/Back Folder Layer (Does NOT move) */}
                <path d={NEW_SVG_DATA.bgPath} fill="#91DDFF" />

                {/* 2. Middle Layer: Paper Sheet (Moves & Rotates between 1.svg and 2.svg) */}
                <rect
                  ref={paperRef}
                  x={NEW_SVG_DATA.state1.paper.x}
                  y={NEW_SVG_DATA.state1.paper.y}
                  width="878"
                  height="594"
                  rx="40"
                  transform={NEW_SVG_DATA.state1.paper.transform}
                  fill="#F5F5F5"
                />

                {/* 3. Static Bottom Seam Layer (Does NOT move) */}
                <path d={NEW_SVG_DATA.bottomPath} fill="#91DDFF" />

                {/* 4. Front Layer: Front Flap (Morphs smoothly between 1.svg and 2.svg) */}
                <path
                  ref={frontFlapRef}
                  d={NEW_SVG_DATA.state1.frontFlap}
                  fill="#71CEF7"
                />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
