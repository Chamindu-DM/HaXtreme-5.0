"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { triggerSectionTransition } from "./SectionTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const navLinks = [
  { name: "About", href: "#what-is", num: "01" },
  { name: "Guidelines", href: "#guidelines", num: "02" },
  { name: "Timeline", href: "#timeline", num: "03" },
  { name: "Memory Lane", href: "#memory-lane", num: "04" },
  { name: "Partners", href: "#partners", num: "05" },
  { name: "Contact", href: "#contact-us", num: "06" },
];

const registerChars = "REGISTER".split("");

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme?: string }>;
      setIsLight(customEvent.detail?.theme === "light");
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;

      if (currentScrollY <= 30) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollYRef.current + 8 &&
        currentScrollY > 80
      ) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      // ─── 1. Mobile Menu Panel Timeline ───
      const tl = gsap
        .timeline({ paused: true })
        .set(".menu-overlay", { pointerEvents: "auto" })
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
          { autoAlpha: 0, y: -16, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            transformOrigin: "top right",
            ease: "power3.out",
          },
          0.05
        )
        .fromTo(
          ".menu-svg-wrap",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.5)",
          },
          0.1
        )
        .fromTo(
          ".menu-link",
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.25,
            ease: "power2.out",
            stagger: 0.03,
          },
          0.15
        );

      tlRef.current = tl;

      // ─── 2. SVG Draw Continuous Loop ───
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

    gsap
      .timeline({ defaults: { duration: 0.38, ease: "power2.inOut" } })
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

    gsap
      .timeline({ defaults: { duration: 0.38, ease: "power2.inOut" } })
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

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    tlRef.current?.eventCallback("onReverseComplete", () => {
      gsap.set(".menu-overlay", { pointerEvents: "none" });
    });
    tlRef.current?.timeScale(1.2).reverse();
  }, []);

  // ─── Click Outside to Close Menu ───
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  // ─── Keyboard accessibility ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

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

  return (
    <header
      ref={containerRef}
      className={`sticky top-0 z-[1000] w-full backdrop-blur-md transition-all duration-300 border-b px-4 sm:px-6 lg:px-8 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isLight
          ? "bg-white/90 border-black/10 shadow-sm"
          : "bg-[#0E100F]/85 border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto py-3.5 flex justify-between items-center w-full">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <a href="#hero" className="flex items-center group relative w-36 sm:w-44 h-8">
            <Image
              src={isLight ? "/White_Logo.svg" : "/Logo.svg"}
              alt="HaXtreme 5.0"
              fill
              className="object-contain transition-all duration-300 group-hover:scale-105"
              priority
            />
          </a>
        </div>

        {/* ─── Desktop Navbar: Minimal & Common UI ─── */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <nav className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-space-mono text-xs tracking-wider uppercase transition-colors duration-200 relative py-1 group font-medium ${
                  isLight
                    ? "text-black/75 hover:text-black"
                    : "text-[#bbbaa6] hover:text-[#0ae448]"
                }`}
                onClick={(e) => {
                  if (link.href === "#hero") {
                    e.preventDefault();
                    triggerSectionTransition("hero");
                  }
                }}
              >
                <span>{link.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                    isLight ? "bg-black" : "bg-[#0ae448]"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Desktop Right: Magnetic Register Button */}
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
              className="mag-btn relative h-10 px-6 rounded-[40px] flex justify-center items-center gap-2 cursor-pointer select-none shadow-md shadow-green-500/15 hover:shadow-green-500/30 will-change-transform overflow-hidden border-none"
            >
              <div
                className="absolute inset-0 rounded-[40px] z-0 pointer-events-none"
                style={{ background: "var(--grad-macha)" }}
              />

              <div
                ref={labelRef}
                className="relative z-10 h-4 overflow-hidden flex items-center justify-center pointer-events-none"
                style={{ perspective: "400px" }}
              >
                <div
                  className="roll-line roll-line-1 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {registerChars.map((char, i) => (
                    <span
                      key={i}
                      className="char-line-1 inline-block text-[#0e100f] text-xs font-bold tracking-wider font-['Helvetica_Neue','Inter',sans-serif] uppercase"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <div
                  className="roll-line roll-line-2 absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {registerChars.map((char, i) => (
                    <span
                      key={i}
                      className="char-line-2 inline-block text-[#0e100f] text-xs font-bold tracking-wider font-['Helvetica_Neue','Inter',sans-serif] uppercase"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ─── Mobile Navbar: Borderless & Backgroundless Hamburger Button ─── */}
        <div className="flex lg:hidden items-center">
          <button
            ref={menuBtnRef}
            id="menuToggle"
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="menu-overlay"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="flex items-center justify-center w-10 h-10 bg-transparent border-0 p-0 m-0 cursor-pointer shadow-none outline-none focus:outline-none"
          >
            <svg
              id="menuIcon"
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="overflow-visible block"
            >
              <line
                className={`bar bar-top transition-transform duration-300 origin-center ${
                  isOpen
                    ? "rotate-45 translate-x-[0.5px] translate-y-[3.5px]"
                    : ""
                }`}
                x1="2"
                y1="4.5"
                x2="14"
                y2="4.5"
                stroke={isLight ? "#050505" : "#BBBAA6"}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <line
                className={`bar bar-mid transition-opacity duration-200 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
                x1="2"
                y1="8"
                x2="14"
                y2="8"
                stroke={isLight ? "#050505" : "#BBBAA6"}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <line
                className={`bar bar-bot transition-transform duration-300 origin-center ${
                  isOpen
                    ? "-rotate-45 translate-x-[0.5px] -translate-y-[3.5px]"
                    : ""
                }`}
                x1="2"
                y1="11.5"
                x2="14"
                y2="11.5"
                stroke={isLight ? "#050505" : "#BBBAA6"}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu Overlay & Dropdown Panel ─── */}
      <div
        className="menu-overlay fixed inset-0 z-40 pointer-events-none lg:hidden"
        id="menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Backdrop for click outside */}
        <div
          onClick={closeMenu}
          className="menu-backdrop absolute inset-0 opacity-0 cursor-pointer"
          style={{
            background: isLight
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(14, 16, 15, 0.88)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />

        <div
          ref={menuPanelRef}
          className="menu-panel absolute top-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] p-4 invisible shadow-2xl transition-colors duration-500"
          style={{
            background: isLight ? "#ffffff" : "var(--color-grey-dark)",
            border: isLight
              ? "1.5px solid rgba(0, 0, 0, 0.12)"
              : "1.5px solid var(--s25)",
            borderRadius: "20px",
            boxShadow: isLight ? "0 10px 30px rgba(0, 0, 0, 0.12)" : "none",
          }}
        >
          {/* Animated SVG Drawing in the middle of expanded menu */}
          <div className="menu-svg-wrap flex flex-col items-center justify-center pt-2 pb-3 border-b border-white/10 mb-2">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                id="svg-stage-expanded"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-1 -1 103 103"
                fill="none"
                strokeWidth="2.4"
                className="w-10 h-10 flex-shrink-0 overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="grad-expanded-1"
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
                  stroke="url(#grad-expanded-1)"
                  d="M50.5 50.5h50v50s-19.2 1.3-37.2-16.7S56 35.4 35.5 15.5C18.5-1 .5.5.5.5v50h50s25.6-.6 38-18 12-32 12-32h-50v100H.5S.2 80.7 11.8 68.2 40 49.7 50.5 50.5Z"
                />
              </svg>
            </div>
          </div>

          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="menu-link"
                href={link.href}
                tabIndex={isOpen ? 0 : -1}
                style={{
                  color: isLight ? "#050505" : "var(--s75)",
                  borderTop: isLight
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : undefined,
                }}
                onClick={() => {
                  closeMenu();
                }}
              >
                <span className="font-medium text-sm">{link.name}</span>
                <span
                  className="link-num text-xs"
                  style={{ color: isLight ? "#888888" : undefined }}
                >
                  {link.num}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
