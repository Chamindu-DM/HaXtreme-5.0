"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-title",
          {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
          },
          "-=0.4"
        )
        .from(
          ".hero-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.4"
        )
        .from(
          ".feature-card",
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=0.3"
        );

      gsap.to(".floating-shape", {
        y: 15,
        rotation: 8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950"
    >
      {/* Background Glows & Floating Shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="floating-shape absolute top-20 left-12 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-md hidden md:block pointer-events-none" />
      <div className="floating-shape absolute bottom-24 right-16 w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 backdrop-blur-md hidden md:block pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Next.js + GSAP Ready
        </div>

        <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Build High Performance <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Interactive Experiences
          </span>
        </h1>

        <p className="hero-description text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
          Modern Next.js 15 App Router architecture pre-configured with GSAP animation engine, TypeScript, and Tailwind CSS.
        </p>

        <div className="hero-cta flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="https://gsap.com/docs/v3/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            GSAP Documentation
          </a>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all duration-200"
          >
            Next.js Docs
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="feature-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
            <div className="text-2xl mb-3">⚡</div>
            <h2 className="text-lg font-semibold text-white mb-2">Next.js App Router</h2>
            <p className="text-sm text-slate-400">
              Latest React Server Components and streamlined file-based routing.
            </p>
          </div>

          <div className="feature-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
            <div className="text-2xl mb-3">🎭</div>
            <h2 className="text-lg font-semibold text-white mb-2">GSAP & @gsap/react</h2>
            <p className="text-sm text-slate-400">
              Industry standard high-performance JavaScript animations with React hook integration.
            </p>
          </div>

          <div className="feature-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <div className="text-2xl mb-3">🎨</div>
            <h2 className="text-lg font-semibold text-white mb-2">Tailwind CSS</h2>
            <p className="text-sm text-slate-400">
              Utility-first styling for rapid, clean, and responsive design development.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
