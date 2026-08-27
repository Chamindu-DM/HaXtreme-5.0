"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function WhatIs() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgStageRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─── 1. SVG Continuous Draw Animation (Slower, Smooth Pace) ───
      if (svgStageRef.current && pathRef.current) {
        const svgEl = svgStageRef.current;
        const pathEl = pathRef.current;
        const length = pathEl.getTotalLength() || 600;

        gsap.set(pathEl, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.set(svgEl, { autoAlpha: 1 });

        if (!prefersReducedMotion) {
          const svgTl = gsap.timeline({
            repeat: -1,
            defaults: { duration: 5, ease: "power1.inOut" }, // Slower drawing animation (5s)
          });

          svgTl
            .fromTo(
              pathEl,
              { strokeDashoffset: length },
              { strokeDashoffset: 0 }
            )
            .to(pathEl, {
              strokeDashoffset: -length,
            });
        } else {
          gsap.set(pathEl, { strokeDashoffset: 0 });
        }
      }

      // ─── 2. Line-by-Line Reveal Animation using GSAP Core ───
      if (!prefersReducedMotion) {
        const textLines = gsap.utils.toArray<HTMLElement>(
          ".line-reveal",
          sectionRef.current
        );

        const textTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // Meta tag reveal
        textTl.from(".meta-reveal", {
          y: 15,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        // Line-by-line staggered text reveal
        textTl.from(
          textLines,
          {
            yPercent: 115,
            autoAlpha: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.2"
        );

        // Logo reveal
        textTl.from(
          ".logo-reveal",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="what-is"
      className="w-full min-h-screen relative flex items-center justify-center bg-[#0e100f] text-white py-12 sm:py-16 select-none"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline, Body, and Logo */}
          <div className="flex flex-col justify-center space-y-6">

            {/* Headline in Helvetica Neue with Line-by-Line Reveal */}
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{
                fontFamily:
                  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <span className="block overflow-hidden">
                <span className="block line-reveal">What is HaXtreme?</span>
              </span>
            </h2>

            {/* Body Copy in Space Mono with Line-by-Line Reveal */}
            <div className="space-y-4 font-space-mono text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              <p className="block overflow-hidden">
                <span className="block line-reveal">
                  HaXtreme is the premier competitive programming and hackathon
                  event organized by the{" "}
                  <span className="text-white font-medium">
                    IEEE Student Branch at the University of Ruhuna
                  </span>{" "}
                  colaborate with{" "}
                  <span className="text-white font-medium">
                    Computer Engineering Society (ComES)
                  </span>
                  .
                </span>
              </p>
              
              <p className="block overflow-hidden">
                <span className="block line-reveal text-gray-400">
                  Now in its fifth iteration, HaXtreme goes beyond traditional
                  coding challenges.
                </span>
              </p>

              <p className="block overflow-hidden">
                <span className="block line-reveal text-gray-400">
                  It is a high-stakes arena that brings together the brightest
                  undergraduate minds from state and private universities across
                  Sri Lanka to architect, build, and deploy innovative solutions to
                  real-world problems.
                </span>
              </p>
            </div>

            {/* Brand Logo Below Body Copy */}
            <div className="logo-reveal pt-4 flex items-center">
              <img
                src="/Logo.png"
                alt="HaXtreme 5.0"
                className="h-10 sm:h-12 w-auto object-contain brightness-100 hover:brightness-110 transition-all"
              />
            </div>

          </div>

          {/* Right Column: Clean SVG Draw Animation */}
          <div className="flex items-center justify-center w-full">
            <svg
              ref={svgStageRef}
              id="svg-stage"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-1 -1 103 103"
              fill="none"
              /* 
               * 💡 STROKE REDUCTION:
               * You can adjust stroke-width directly here on the SVG (e.g. strokeWidth="1.5" or "1.0")
               * or on the <path> element below. Default is "1.8".
               */
              strokeWidth="1.2"
              opacity="0"
              className="w-3/4 sm:w-2/3 max-w-[420px] overflow-visible"
            >
              <defs>
                <linearGradient
                  id="grad-1"
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.2" stopColor="rgb(255, 135, 9)" />
                  <stop offset="0.8" stopColor="rgb(247, 189, 248)" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                stroke="url(#grad-1)"
                strokeLinecap="round"
                strokeLinejoin="round"
                /* You can also specify strokeWidth="1.5" directly on this path */
                strokeWidth="1.8"
                d="M50.5 50.5h50v50s-19.2 1.3-37.2-16.7S56 35.4 35.5 15.5C18.5-1 .5.5.5.5v50h50s25.6-.6 38-18 12-32 12-32h-50v100H.5S.2 80.7 11.8 68.2 40 49.7 50.5 50.5Z"
              />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
