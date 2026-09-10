"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dimImg from "../../public/Dim.webp";
import lightImg from "../../public/Light.webp";

export default function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // ─── 1. Viewport Interactivity: Countdown and Partners Detection ───
  useEffect(() => {
    let ticking = false;

    const checkVisibility = () => {
      const countdownEl = document.getElementById("countdown");
      const partnersEl = document.getElementById("partners");
      const vh = window.innerHeight;

      let countdownShowing = false;
      let partnersShowing = false;

      if (countdownEl) {
        const rect = countdownEl.getBoundingClientRect();
        // Overlaps the viewport
        if (rect.bottom > 0 && rect.top < vh) {
          countdownShowing = true;
        }
      }

      if (partnersEl) {
        const rect = partnersEl.getBoundingClientRect();
        // Overlaps the viewport (taking into account the curved top arch as well)
        if (rect.bottom > 0 && rect.top < vh + 100) {
          partnersShowing = true;
        }
      }

      const shouldShow = !countdownShowing && !partnersShowing;
      setIsVisible(shouldShow);
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
      }
    };

    checkVisibility();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // IntersectionObserver for reliable callback triggers on section boundaries
    const observer = new IntersectionObserver(
      () => {
        checkVisibility();
      },
      {
        root: null,
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    const countdownEl = document.getElementById("countdown");
    const partnersEl = document.getElementById("partners");

    if (countdownEl) observer.observe(countdownEl);
    if (partnersEl) observer.observe(partnersEl);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      observer.disconnect();
    };
  }, []);

  // ─── 2. Cursor Spotlight with Radial Gradient Mask ───
  useEffect(() => {
    const lightLayer = lightLayerRef.current;
    if (!lightLayer) return;

    let rafId: number | null = null;
    let lastX = -9999;
    let lastY = -9999;

    const updateMask = (x: number, y: number) => {
      // Large radius area (responsive: between 320px and 440px based on screen size)
      const radius = Math.max(320, Math.min(Math.round(window.innerWidth * 0.28), 440));
      
      const maskString = `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 22%, rgba(0, 0, 0, 0.35) 55%, transparent 100%)`;

      lightLayer.style.webkitMaskImage = maskString;
      lightLayer.style.maskImage = maskString;
      lightLayer.style.opacity = "1";
    };

    const handlePointerMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateMask(lastX, lastY);
          rafId = null;
        });
      }
    };

    const handlePointerLeave = () => {
      if (lightLayer) {
        lightLayer.style.opacity = "0";
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMask(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMask(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      if (lightLayer) {
        lightLayer.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden="true"
    >
      {/* ─── Layer 1 (Bottom): Dim.png filling the viewport ─── */}
      <Image
        src={dimImg}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className="object-cover object-center pointer-events-none select-none"
      />

      {/* ─── Layer 2 (Top): Light.png masked with radial gradient ─── */}
      <div
        ref={lightLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none transition-opacity duration-300 ease-out"
        style={{
          opacity: 0,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <Image
          src={lightImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
