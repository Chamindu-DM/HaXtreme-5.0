"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const navLinks = [
  { name: "Home", href: "#hero", num: "01" },
  { name: "Countdown", href: "#countdown", num: "02" },
  { name: "What is HaXtreme", href: "#what-is", num: "03" },
  { name: "Guidelines", href: "#guidelines", num: "04" },
  { name: "Timeline", href: "#timeline", num: "05" },
  { name: "Partners", href: "#partners", num: "06" },
  { name: "Prizes", href: "#prizes", num: "07" },
  { name: "Memory Lane", href: "#memory-lane", num: "08" },
  { name: "Contact Us", href: "#contact-us", num: "09" },
];

const registerChars = "REGISTER".split("");

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      // Calculate responsive expanded width
      const expandedWidth = Math.min(
        typeof window !== "undefined" ? window.innerWidth * 0.9 : 400,
        400
      );

      // Initial state: collapsed round button
      gsap.set(".island", { width: 50 });

      // ─── 1. Island Menu Timeline (Exact Codepen Timings & Easing) ───
      const tl = gsap
        .timeline({ paused: true })
        .set(".menu-overlay", { pointerEvents: "auto" })
        .to(
          ".island",
          {
            width: expandedWidth,
            duration: 0.8,
            ease: "back.out(2)",
          },
          0
        )
        .to(
          ".island-logo",
          {
            opacity: 1,
            rotation: 180,
            duration: 0.5,
            ease: "back.out",
          },
          0.12
        )
        .to(
          ".bar-mid",
          {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in",
          },
          0
        )
        .to(
          ".bar-top",
          {
            attr: { x1: 3, y1: 3, x2: 13, y2: 13 },
            duration: 0.28,
            ease: "power3.inOut",
          },
          0
        )
        .to(
          ".bar-bot",
          {
            attr: { x1: 13, y1: 3, x2: 3, y2: 13 },
            duration: 0.28,
            ease: "power3.inOut",
          },
          0
        )
        .to(
          ".menu-backdrop",
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        )
        .fromTo(
          ".menu-panel",
          { autoAlpha: 0, yPercent: -10, scale: 0.6 },
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            duration: 0.8,
            transformOrigin: "top center",
            ease: "back.out(2)",
          },
          0.1
        )
        .fromTo(
          ".menu-link",
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.05,
          },
          0.22
        );

      tlRef.current = tl;

      // ─── 2. SVG Draw / Morph Continuous Loop ───
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength() || 650;
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap
          .timeline({
            repeat: -1,
            defaults: { duration: 3, ease: "power1.inOut" },
          })
          .to(pathRef.current, { strokeDashoffset: 0 })
          .to(pathRef.current, { strokeDashoffset: -pathLength });
      }

      // ─── 3. 3D Tube Initial Setup for Register Button ───
      gsap.set(".roll-line", { perspective: 400, transformStyle: "preserve-3d" });
      gsap.set(".char-line-1", { rotationX: 0, opacity: 1 });
      gsap.set(".char-line-2", { rotationX: -90, opacity: 0 });
    },
    { scope: containerRef }
  );

  // ─── 3D Tube Rolling Animation on Button Hover ───
  const handleButtonMouseEnter = contextSafe(() => {
    const depth = "-10px";
    const transformOrigin = `50% 50% ${depth}`;

    gsap.timeline({ defaults: { duration: 0.38, ease: "power2.inOut" } })
      .to(
        ".char-line-1",
        {
          rotationX: 90,
          opacity: 0,
          stagger: 0.025,
          transformOrigin,
        },
        0
      )
      .fromTo(
        ".char-line-2",
        {
          rotationX: -90,
          opacity: 0,
        },
        {
          rotationX: 0,
          opacity: 1,
          stagger: 0.025,
          transformOrigin,
        },
        0.04
      );
  });

  const handleButtonMouseLeave = contextSafe(() => {
    const depth = "-10px";
    const transformOrigin = `50% 50% ${depth}`;

    gsap.timeline({ defaults: { duration: 0.38, ease: "power2.inOut" } })
      .to(
        ".char-line-2",
        {
          rotationX: -90,
          opacity: 0,
          stagger: 0.025,
          transformOrigin,
        },
        0
      )
      .to(
        ".char-line-1",
        {
          rotationX: 0,
          opacity: 1,
          stagger: 0.025,
          transformOrigin,
        },
        0.04
      );
  });

  // ─── Menu Toggle & Close Controls ───
  const toggleMenu = contextSafe(() => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      tlRef.current?.timeScale(1).play();
    } else {
      tlRef.current?.eventCallback("onReverseComplete", () => {
        gsap.set(".menu-overlay", { pointerEvents: "none" });
      });
      tlRef.current?.timeScale(1.2).reverse();
    }
  });

  const closeMenu = contextSafe(() => {
    if (!isOpen) return;
    setIsOpen(false);
    tlRef.current?.eventCallback("onReverseComplete", () => {
      gsap.set(".menu-overlay", { pointerEvents: "none" });
    });
    tlRef.current?.timeScale(1.2).reverse();
  });

  // ─── Magnetic Register Pull (overwrite: "auto") ───
  const strength = 0.4;
  const labelStrength = 0.24;

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoneRef.current || !btnRef.current || !labelRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const mapX = gsap.utils.mapRange(
      rect.left,
      rect.right,
      -rect.width / 2,
      rect.width / 2,
      e.clientX
    );
    const mapY = gsap.utils.mapRange(
      rect.top,
      rect.bottom,
      -rect.height / 2,
      rect.height / 2,
      e.clientY
    );

    gsap.to(btnRef.current, {
      x: mapX * strength,
      y: mapY * strength,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(labelRef.current, {
      x: mapX * labelStrength,
      y: mapY * labelStrength,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  });

  const handleMouseLeave = contextSafe(() => {
    handleButtonMouseLeave();

    if (!btnRef.current || !labelRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });

    gsap.to(labelRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: true,
    });
  });

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
        document.getElementById("menuToggle")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0E100F]/60 transition-all duration-300"
    >
      <div className="self-stretch px-4 sm:px-6 md:px-10 inline-flex justify-between items-center w-full">
        <div className="flex-1 py-4 border-b border-white/20 flex justify-between items-center relative">
          
          {/* Left: Logo */}
          <div className="py-2 inline-flex flex-col justify-start items-start gap-2">
            <a href="#hero" className="flex items-center group">
              <img
                className="w-40 sm:w-48 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                src="/Logo.svg"
                alt="HaXtreme 5.0"
              />
            </a>
          </div>

          {/* Middle: Exact Centered Round Island Button */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-50 pointer-events-auto">
            <div
              ref={islandRef}
              className="island flex items-center justify-between"
              style={{
                padding: "0.5rem",
                background: "var(--color-grey-dark)",
                border: "1.5px solid var(--s25)",
                borderRadius: "99px",
                whiteSpace: "nowrap",
                width: "50px",
                height: "50px",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* GSAP SVG Morph Stage */}
              <div
                className="island-logo--cont flex items-center"
                style={{
                  position: "relative",
                  width: "0px",
                  height: "24px",
                  pointerEvents: "none",
                }}
              >
                <svg
                  id="svg-stage"
                  className="island-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-1 -1 103 103"
                  fill="none"
                  strokeWidth="2.2"
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "24px",
                    flexShrink: 0,
                    opacity: 0,
                    marginLeft: "0.75rem",
                    overflow: "visible",
                  }}
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
                    d="M50.5 50.5h50v50s-19.2 1.3-37.2-16.7S56 35.4 35.5 15.5C18.5-1 .5.5.5.5v50h50s25.6-.6 38-18 12-32 12-32h-50v100H.5S.2 80.7 11.8 68.2 40 49.7 50.5 50.5Z"
                  />
                </svg>
              </div>

              <button
                className="menu-btn"
                id="menuToggle"
                type="button"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-controls="menu-overlay"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                style={{
                  width: "32px",
                  height: "32px",
                  margin: 0,
                  padding: 0,
                  background: "transparent",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  className="button-cont"
                  style={{
                    width: "34px",
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    id="menuIcon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="overflow-visible block"
                  >
                    <line
                      className="bar bar-top"
                      x1="2"
                      y1="5"
                      x2="14"
                      y2="5"
                      stroke="#BBBAA6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      className="bar bar-mid"
                      x1="2"
                      y1="8"
                      x2="14"
                      y2="8"
                      stroke="#BBBAA6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      className="bar bar-bot"
                      x1="2"
                      y1="11"
                      x2="14"
                      y2="11"
                      stroke="#BBBAA6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Magnetic Register Button with 3D Tube Rolling Hover */}
          <div
            ref={zoneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="mag-zone flex items-center justify-center cursor-pointer py-1"
            data-mode="auto"
            data-wiggle="false"
          >
            <button
              ref={btnRef}
              id="btnAuto"
              type="button"
              onMouseEnter={handleButtonMouseEnter}
              className="mag-btn relative h-11 px-7 py-3 rounded-[40px] flex justify-center items-center gap-2 cursor-pointer select-none shadow-lg shadow-green-500/15 hover:shadow-green-500/30 will-change-transform overflow-hidden border-none"
            >
              {/* Macha Gradient */}
              <div
                className="absolute inset-0 rounded-[40px] z-0 pointer-events-none"
                style={{ background: "var(--grad-macha)" }}
              />

              {/* 3D Tube Rolling Text Container */}
              <div
                ref={labelRef}
                className="relative z-10 h-5 overflow-hidden flex items-center justify-center pointer-events-none"
                style={{ perspective: "400px" }}
              >
                {/* Line 1 (default visible) */}
                <div
                  className="roll-line roll-line-1 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {registerChars.map((char, i) => (
                    <span
                      key={i}
                      className="char-line-1 inline-block text-[#0e100f] text-sm font-semibold tracking-wider font-['Helvetica_Neue','Inter',sans-serif] uppercase"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Line 2 (flips in from 3D depth on hover) */}
                <div
                  className="roll-line roll-line-2 absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {registerChars.map((char, i) => (
                    <span
                      key={i}
                      className="char-line-2 inline-block text-[#0e100f] text-sm font-semibold tracking-wider font-['Helvetica_Neue','Inter',sans-serif] uppercase"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Overlay & Dropdown Panel */}
      <div
        className="menu-overlay fixed inset-0 z-40 pointer-events-none"
        id="menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div
          onClick={closeMenu}
          className="menu-backdrop absolute inset-0 opacity-0 cursor-pointer"
          style={{
            background: "rgba(14, 16, 15, 0.88)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />

        <div
          className="menu-panel absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-[400px] p-[0.375rem] invisible shadow-2xl"
          style={{
            background: "var(--color-grey-dark)",
            border: "1.5px solid var(--s25)",
            borderRadius: "18px",
          }}
        >
          <nav>
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="menu-link"
                href={link.href}
                tabIndex={isOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span>{link.name}</span>
                <span className="link-num">{link.num}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
