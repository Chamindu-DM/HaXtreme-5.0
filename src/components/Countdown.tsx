"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const initialPath = "M 0 105 V 105 Q 50 105 100 105 V 105 z";
const startPath = "M 0 105 V 50 Q 50 0 100 50 V 105 z";
const endPath = "M 0 105 V 0 Q 50 0 100 0 V 105 z";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const containerRef = useRef<HTMLElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const crowdRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);
  const exitPathRef = useRef<SVGPathElement>(null);

  // Target countdown date: 15 September 2026, 12:00 a.m. (00:00:00)
  const targetDate = useRef(new Date("2026-09-15T00:00:00+05:30").getTime());

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate.current - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            if (self.progress > 0.5) {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "dark" } })
              );
            } else {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "light" } })
              );
            }
          },
        });
        return;
      }

      // ─── 1. Parallax Effects on Rocket, Crowd, and Text ───
      if (rocketRef.current) {
        gsap.to(rocketRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (crowdRef.current) {
        gsap.to(crowdRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (leftTextRef.current && timerRef.current) {
        gsap.to([leftTextRef.current, timerRef.current], {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ─── 2. Black Circular Arch Exit Transition to Next Section ───
      if (exitPathRef.current && exitOverlayRef.current) {
        gsap.set(exitPathRef.current, { attr: { d: initialPath } });

        const exitTl = gsap.timeline({
          scrollTrigger: {
            id: "countdown-exit",
            trigger: containerRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            snap: {
              snapTo: [0, 1],
              duration: { min: 0.2, max: 0.5 },
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              // Switch navbar back to dark theme when black arch covers Countdown
              if (self.progress > 0.35) {
                window.dispatchEvent(
                  new CustomEvent("theme-change", { detail: { theme: "dark" } })
                );
              } else {
                window.dispatchEvent(
                  new CustomEvent("theme-change", { detail: { theme: "light" } })
                );
              }
            },
          },
        });

        // Black circular arch pull-over morph
        exitTl.fromTo(
          exitPathRef.current,
          { attr: { d: initialPath } },
          {
            attr: { d: startPath },
            ease: "power1.in",
            duration: 0.5,
          }
        ).to(exitPathRef.current, {
          attr: { d: endPath },
          ease: "power1.out",
          duration: 0.5,
        });
      }
    },
    { scope: containerRef }
  );

  const formattedDays = isClient
    ? String(timeLeft.days).padStart(2, "0")
    : "19";
  const formattedHours = isClient
    ? String(timeLeft.hours).padStart(2, "0")
    : "12";
  const formattedMinutes = isClient
    ? String(timeLeft.minutes).padStart(2, "0")
    : "00";
  const formattedSeconds = isClient
    ? String(timeLeft.seconds).padStart(2, "0")
    : "00";

  return (
    <section
      ref={containerRef}
      id="countdown"
      className="w-full h-screen min-h-screen relative flex flex-col items-center justify-center bg-white text-black overflow-hidden select-none"
    >
      {/* ─── Black Circular Arch Exit Transition Overlay ─── */}
      <div
        ref={exitOverlayRef}
        className="section-exit-overlay absolute inset-0 z-40 pointer-events-none w-full h-full overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="section-exit-svg absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={exitPathRef}
            className="path"
            stroke="#0E100F"
            fill="#0E100F"
            strokeWidth="1.5px"
            vectorEffect="non-scaling-stroke"
            d={initialPath}
          />
        </svg>
      </div>

      {/* ─── Center Standing Rocket: Dead Centered on Viewport ─── */}
      <div
        ref={rocketRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[60vh] sm:h-[72vh] md:h-[82vh] lg:h-[93vh] max-h-[96vh] z-10 flex items-end justify-center pointer-events-none will-change-transform"
      >
        <img
          src="/hero-rocket.avif"
          alt="HaXtreme Rocket Launch"
          className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-sm"
        />
      </div>

      {/* ─── Main Content Container (Locked to max-w-[1385px]) ─── */}
      <div className="w-full flex-1 max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between relative z-15 pt-16 sm:pt-20 lg:pt-0 pb-20 sm:pb-24">
        
        {/* Left Side: "Prepare for Liftoff." (Horizontally aligned with numbers) */}
        <div
          ref={leftTextRef}
          className="w-full lg:w-[628px] flex lg:mt-7 flex-col justify-center items-center lg:items-start z-15 lg:pr-4"
        >
          <h2 className="w-full text-center lg:text-left text-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium font-['Handjet'] leading-none">
            Prepare for Liftoff.
          </h2>
        </div>

        {/* Right Side: Exact Structure Digital Matrix Countdown Timer (Perfect Center Alignment) */}
        <div
          ref={timerRef}
          className="w-full lg:w-auto mt-6 lg:mt-0 flex flex-col items-center lg:items-end justify-center z-15 lg:pl-4"
        >
          {/* Labels Row aligned cleanly over each column */}
          <div className="flex items-center justify-between w-full px-1 sm:px-2 mb-1 sm:mb-2">
            <div className="flex-1 text-center text-black text-base sm:text-xl lg:text-2xl font-medium font-['Handjet'] leading-none">
              DD
            </div>
            <div className="w-2 sm:w-2.5 lg:w-3" aria-hidden="true" />
            <div className="flex-1 text-center text-black text-base sm:text-xl lg:text-2xl font-medium font-['Handjet'] leading-none">
              HH
            </div>
            <div className="w-2 sm:w-2.5 lg:w-3" aria-hidden="true" />
            <div className="flex-1 text-center text-black text-base sm:text-xl lg:text-2xl font-medium font-['Handjet'] leading-none">
              MM
            </div>
            <div className="w-2 sm:w-2.5 lg:w-3" aria-hidden="true" />
            <div className="flex-1 text-center text-black text-base sm:text-xl lg:text-2xl font-medium font-['Handjet'] leading-none">
              SS
            </div>
          </div>

          {/* Digits & Separators Row: All locked to the exact same horizontal center axis */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 lg:gap-3">
            {/* DD */}
            <div className="text-center text-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Doto'] leading-none tabular-nums">
              {formattedDays}
            </div>

            {/* Separator 1 */}
            <div className="flex flex-col justify-center items-center gap-1.5 sm:gap-2 lg:gap-2.5">
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
            </div>

            {/* HH */}
            <div className="text-center text-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Doto'] leading-none tabular-nums">
              {formattedHours}
            </div>

            {/* Separator 2 */}
            <div className="flex flex-col justify-center items-center gap-1.5 sm:gap-2 lg:gap-2.5">
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
            </div>

            {/* MM */}
            <div className="text-center text-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Doto'] leading-none tabular-nums">
              {formattedMinutes}
            </div>

            {/* Separator 3 */}
            <div className="flex flex-col justify-center items-center gap-1.5 sm:gap-2 lg:gap-2.5">
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
              <div className="w-1.5 sm:w-2.5 lg:w-3 h-1.5 sm:h-2.5 lg:h-3 bg-black" />
            </div>

            {/* SS */}
            <div className="text-center text-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Doto'] leading-none tabular-nums">
              {formattedSeconds}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Foreground: Looking Up Crowd Silhouette ─── */}
      <div
        ref={crowdRef}
        className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none overflow-hidden will-change-transform flex justify-center items-end"
      >
        <img
          src="/hero-crowd.png"
          alt="Crowd watching liftoff"
          className="w-full max-w-[1920px] h-auto max-h-[24vh] sm:max-h-[30vh] md:max-h-[38vh] lg:max-h-[42vh] object-cover object-top"
        />
      </div>
    </section>
  );
}
