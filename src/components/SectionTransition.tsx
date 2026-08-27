"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Extending Y beyond 100 (to 105) eliminates any sub-pixel seam at the bottom edge
const initialPath = "M 0 105 V 105 Q 50 105 100 105 V 105 z";
const startPath = "M 0 105 V 50 Q 50 0 100 50 V 105 z";
const endPath = "M 0 105 V 0 Q 50 0 100 0 V 105 z";

export function triggerSectionTransition(targetId: string = "countdown") {
  if (typeof window !== "undefined") {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      const heroEl = document.getElementById("hero");
      heroEl?.scrollIntoView({ behavior: "smooth" });
    }
  }
}

export default function SectionTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const heroEl = document.getElementById("hero");
      if (!heroEl || !pathRef.current || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        ScrollTrigger.create({
          id: "hero-transition",
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            if (self.progress > 0.5) {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "light" } })
              );
            } else {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "dark" } })
              );
            }
          },
        });
        return;
      }

      // Initial state
      gsap.set(pathRef.current, { attr: { d: initialPath } });

      // Master Scroll-Driven Circular Arch Morph Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "hero-transition",
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            // Theme switching for navbar
            if (self.progress > 0.35) {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "light" } })
              );
            } else {
              window.dispatchEvent(
                new CustomEvent("theme-change", { detail: { theme: "dark" } })
              );
            }
          },
        },
      });

      // Smooth circular arch pull over
      tl.fromTo(
        pathRef.current,
        { attr: { d: initialPath } },
        {
          attr: { d: startPath },
          ease: "power1.in",
          duration: 0.5,
        }
      ).to(pathRef.current, {
        attr: { d: endPath },
        ease: "power1.out",
        duration: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="section-transition-overlay absolute inset-0 z-40 pointer-events-none w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="section-transition-svg absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className="path"
          stroke="#FFFFFF"
          fill="#FFFFFF"
          strokeWidth="1.5px"
          vectorEffect="non-scaling-stroke"
          d={initialPath}
        />
      </svg>
    </div>
  );
}
