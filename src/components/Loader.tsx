"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  img: HTMLImageElement;
}

const MEMORY_IMAGES = [
  "/Memories/image 998.jpg",
  "/Memories/image 999.jpg",
  "/Memories/image 1000.jpg",
  "/Memories/image 1045.jpg",
  "/Memories/407304759_770490495091274_2613428125469826788_n 1.jpg",
  "/Memories/407304759_770490495091274_2613428125469826788_n 4.jpg",
  "/Memories/407308659_770490305091293_2712908387265516032_n 1.jpg",
  "/Memories/407308659_770490305091293_2712908387265516032_n 2.jpg",
  "/Memories/407353251_770491348424522_8014008165630634164_n 1.jpg",
  "/Memories/407362513_770490528424604_1559419601375149637_n 1.jpg",
  "/Memories/407362513_770490528424604_1559419601375149637_n 2.jpg",
  "/Memories/407413189_770490661757924_2208827396625310375_n 1.jpg",
  "/Memories/407413189_770490661757924_2208827396625310375_n 2.jpg",
  "/Memories/401485383_770490771757913_7353613965438145222_n 1.jpg",
];

export default function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Preload Memory Lane photos in background while loader runs
    MEMORY_IMAGES.forEach((src) => {
      const memoryImg = new Image();
      memoryImg.src = src;
    });

    if (!canvasRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent("hero-start"));
      return;
    }

    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let cw = (c.width = window.innerWidth);
    let ch = (c.height = window.innerHeight);
    let radius = Math.max(cw, ch);
    const particleCount = 99;
    const particles: Particle[] = new Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const img = new Image();
      img.src = `/flair-images/flair-${2 + (i % 21)}.webp`;
      particles[i] = {
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
        img: img,
      };
    }

    function draw() {
      if (!ctx) return;
      particles.sort((a, b) => a.scale - b.scale); // Sort by scale for z-indexing
      ctx.clearRect(0, 0, cw, ch);
      particles.forEach((p) => {
        if (!p.img.complete || p.img.naturalWidth === 0 || p.scale <= 0.001) return;
        ctx.translate(cw / 2, ch / 2);
        ctx.rotate(p.rotate);
        const w = p.img.width || 80;
        const h = p.img.height || 80;
        ctx.drawImage(
          p.img,
          p.x - (w * p.scale) / 2,
          p.y - (h * p.scale) / 2,
          w * p.scale,
          h * p.scale
        );
        ctx.resetTransform();
      });
    }

    // ─── Initial Spiraling Timeline from Source Code ───
    const tl = gsap
      .timeline({ onUpdate: draw })
      .fromTo(
        particles,
        {
          x: (i) => {
            const angle = (i / particleCount) * Math.PI * 2 - Math.PI / 2;
            return Math.cos(angle * 10) * radius;
          },
          y: (i) => {
            const angle = (i / particleCount) * Math.PI * 2 - Math.PI / 2;
            return Math.sin(angle * 10) * radius;
          },
          scale: 1.1,
          rotate: 0,
        },
        {
          duration: 5,
          ease: "sine",
          x: 0,
          y: 0,
          scale: 0,
          rotate: -3,
          stagger: { each: -0.05, repeat: -1 },
        },
        0
      )
      .seek(99);

    // ─── Resize Handler ───
    const handleResize = () => {
      cw = c.width = window.innerWidth;
      ch = c.height = window.innerHeight;
      radius = Math.max(cw, ch);
      tl.invalidate();
      draw();
    };
    window.addEventListener("resize", handleResize);

    // ─── Finale: Maintain exact uniform speed, dissolve overlay smoothly ───
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      gsap.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        onStart: () => {
          // Trigger hero animation right as the transition starts
          window.dispatchEvent(new CustomEvent("hero-start"));
        },
        onComplete: () => {
          setIsVisible(false);
          tl.kill();
        },
      });
    }, 2400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      tl.kill();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0E100F] flex items-center justify-center pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
