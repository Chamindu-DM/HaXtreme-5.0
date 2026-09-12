"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const MEMORY_IMAGES = [
  "/Memories/image-998.webp",
  "/Memories/image-999.webp",
  "/Memories/image-1000.webp",
  "/Memories/image-1045.webp",
  "/Memories/407304759_770490495091274_2613428125469826788_n-1.webp",
  "/Memories/407304759_770490495091274_2613428125469826788_n-4.webp",
  "/Memories/407308659_770490305091293_2712908387265516032_n-1.webp",
  "/Memories/407308659_770490305091293_2712908387265516032_n-2.webp",
  "/Memories/407353251_770491348424522_8014008165630634164_n-1.webp",
  "/Memories/407362513_770490528424604_1559419601375149637_n-1.webp",
  "/Memories/407362513_770490528424604_1559419601375149637_n-2.webp",
  "/Memories/407413189_770490661757924_2208827396625310375_n-1.webp",
  "/Memories/407413189_770490661757924_2208827396625310375_n-2.webp",
  "/Memories/401485383_770490771757913_7353613965438145222_n-1.webp",
];

export default function MemoryLane() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pinWrap = stripRef.current;
      if (!section || !pinWrap) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const getScrollLength = () =>
        Math.max(0, pinWrap.scrollWidth - window.innerWidth);

      // Master Horizontal Scroll
      const tween = gsap.to(pinWrap, {
        x: () => -getScrollLength(),
        ease: "none",
        scrollTrigger: {
          id: "memory-lane-horizontal",
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${getScrollLength()}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      const t1 = setTimeout(refresh, 200);
      const t2 = setTimeout(refresh, 600);

      return () => {
        window.removeEventListener("resize", refresh);
        clearTimeout(t1);
        clearTimeout(t2);
        tween.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="memory-lane"
      className="w-full relative h-screen bg-transparent text-white overflow-hidden select-none flex items-center"
    >
      {/* Horizontal Scrolling Gallery Strip */}
      <div
        ref={stripRef}
        className="flex items-center gap-8 sm:gap-12 flex-nowrap will-change-transform pl-8 sm:pl-16 lg:pl-24 pr-16 sm:pr-24 lg:pr-32"
      >
        {/* Intro Narrative Card */}
        <div className="w-[90vw] sm:w-[48vw] md:w-[35vw] lg:w-[26vw] max-w-[400px] shrink-0 flex flex-col justify-center space-y-6 pr-4 sm:pr-8">
          <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{
                fontFamily:
                  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <span className="block overflow-hidden">
                <span className="block guideline-line-reveal">
                  Memory Lane
                </span>
              </span>
            </h2>

          <div className="space-y-4 font-space-mono text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              A journey through the legacy of HaXtreme. Revisit the moments,
              debugging sessions, and celebrations from past editions.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 font-space-mono text-xs text-[#0ae448]">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-lg leading-none">→</span>
          </div>
        </div>

        {/* Horizontal Photo Cards */}
        {MEMORY_IMAGES.map((src, index) => (
          <div
            key={src}
            className="w-[92vw] sm:w-[75vw] md:w-[58vw] lg:w-[46vw] xl:w-[42vw] max-w-[680px] shrink-0 p-2 sm:p-2.5 border border-dashed border-[#272d2a] hover:border-[#3a423e] transition-colors duration-300"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-video overflow-hidden bg-[#131514] shadow-2xl rounded-sm">
              <Image
                src={src}
                alt={`HaXtreme Memory ${index + 1}`}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 768px) 75vw, (max-width: 1024px) 58vw, (max-width: 1280px) 46vw, 680px"
                className="object-cover select-none pointer-events-none"
                priority={index < 3}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
