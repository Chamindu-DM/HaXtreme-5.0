"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Sponsor logos starting with image 8.jpg
const SPONSORS = [
  { name: "Sponsor", src: "/Sponsors/image 8.jpg" },
  { name: "Heladev", src: "/Sponsors/Heladev Logo 1.jpg" },
  { name: "Partner", src: "/Sponsors/LOGO-01 (Primary).jpg" },
  { name: "Sponsor", src: "/Sponsors/Frame 1010106631.jpg" },
  { name: "Sponsor", src: "/Sponsors/IMG_8636 (1) (1) 1.jpg" },
  { name: "Partner", src: "/Sponsors/WhatsApp Image 2024-09-29 at 22.05.55_c8a0d71a 1.jpg" },
  { name: "Partner", src: "/Sponsors/download-1.webp" },
  { name: "Sponsor", src: "/Sponsors/download-4.webp" },
  { name: "Partner", src: "/Sponsors/download-5.webp" },
  { name: "Sponsor", src: "/Sponsors/download-6.webp" },
  { name: "Partner", src: "/Sponsors/download-7.webp" },
  { name: "Sponsor", src: "/Sponsors/image 9.jpg" },
  { name: "Sponsor", src: "/Sponsors/image 11.jpg" },
  { name: "Partner", src: "/Sponsors/photo_2021-09-22_09-45-03 1.jpg" },
];

const initialPath = "M 0 105 V 105 Q 50 105 100 105 V 105 z";
const startPath = "M 0 105 V 50 Q 50 0 100 50 V 105 z";
const endPath = "M 0 105 V 0 Q 50 0 100 0 V 105 z";

export default function Partners() {
  const containerRef = useRef<HTMLElement>(null);
  const transitionPathRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─── 1. Section Top Curved Arch Transition from MemoryLane (Dark) to Partners (White) ───
      if (transitionPathRef.current && !prefersReducedMotion) {
        gsap.set(transitionPathRef.current, { attr: { d: initialPath } });

        const transitionTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "top 20%",
            scrub: 0.5,
          },
        });

        transitionTl
          .fromTo(
            transitionPathRef.current,
            { attr: { d: initialPath } },
            {
              attr: { d: startPath },
              ease: "power1.in",
              duration: 0.5,
            }
          )
          .to(transitionPathRef.current, {
            attr: { d: endPath },
            ease: "power1.out",
            duration: 0.5,
          });
      }

      // ─── 2. Continuous Always-Playing Single Row Carousel ───
      if (trackRef.current) {
        const track = trackRef.current;
        
        // Single continuous loop from left to right (start with image 8)
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
        });

        // Always keep playing smoothly
        return () => {
          loop.kill();
        };
      }
    },
    { scope: containerRef }
  );

  // Quadruple items to ensure totally smooth continuous infinite track
  const carouselItems = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <section
      ref={containerRef}
      id="partners"
      className="w-full relative bg-white text-black py-24 sm:py-36 overflow-hidden select-none"
    >
      {/* Curved White Section Top Arch Transition */}
      <div
        className="absolute top-0 left-0 w-full h-32 sm:h-44 -translate-y-[98%] pointer-events-none overflow-hidden z-20"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={transitionPathRef}
            stroke="#FFFFFF"
            fill="#FFFFFF"
            strokeWidth="1.5px"
            vectorEffect="non-scaling-stroke"
            d={initialPath}
          />
        </svg>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 mb-12 sm:mb-16 text-center">
        {/* Headline */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black leading-tight mb-4"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Previous Sponsors
        </h2>

        {/* Space Mono Description */}
        <p className="font-space-mono text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Powering innovation and supporting Sri Lanka&apos;s next generation of
          software engineers.
        </p>
      </div>

      {/* Single Row Infinite Partner Logos Carousel */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Edge Fade Gradients for seamless visual blending */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex items-center gap-10 sm:gap-14 md:gap-20 flex-nowrap will-change-transform w-max px-6"
        >
          {carouselItems.map((sponsor, index) => (
            <div
              key={`${sponsor.src}-${index}`}
              className="group relative flex items-center justify-center shrink-0 w-[140px] sm:w-[180px] md:w-[220px] aspect-[16/9]"
            >
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                width={200}
                height={90}
                className="object-contain max-h-16 sm:max-h-20 w-auto opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
