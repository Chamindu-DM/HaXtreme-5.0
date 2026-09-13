"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface FAQItemData {
  id: string;
  question: string;
  answer: string;
  flair: string;
}

const FAQ_ITEMS: FAQItemData[] = [
  {
    id: "eligibility",
    question: "Who is eligible to participate in HaXtreme 5.0?",
    answer:
      "The competition is open to active undergraduate students from recognized universities (University teams must belong to an institution with an active IEEE Student Branch) and current school students.",
    flair: "/flair-images/flair-3.webp",
  },
  {
    id: "team-requirements",
    question: "What are the requirements for forming a team?",
    answer:
      "Every team must consist of exactly three members (one Team Leader and two Team Members). All three members must be from the same institution.",
    flair: "/flair-images/flair-17.webp",
  },
  {
    id: "team-modification",
    question: "Can we modify our team members after submitting the registration?",
    answer:
      "No changes can be made once registered without prior approval. If you need to modify your team, you must contact the Organizing Committee for permission before the registration deadline.",
    flair: "/flair-images/flair-12.webp",
  },
  {
    id: "languages",
    question: "What programming languages are permitted?",
    answer:
      "You are free to use any programming language of your choice to solve the given problems during the rounds.",
    flair: "/flair-images/flair-21.webp",
  },
  {
    id: "equipment",
    question: "Do we need to bring our own equipment?",
    answer:
      "Yes. Teams that advance to the Physical Final Round are permitted and encouraged to bring their personal laptops to the venue.",
    flair: "/flair-images/flair-14.webp",
  },
  {
    id: "scoring",
    question: "How are the scores and rankings calculated?",
    answer:
      "Rankings are determined based on the total problem score, solution accuracy, number of problems solved, and submission time. Penalties may apply for late submissions or rule violations. All decisions made by the judging panel are final.",
    flair: "/flair-images/flair-7.webp",
  },
];

interface FAQAccordionItemProps {
  item: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQAccordionItem({ item, isOpen, onToggle }: FAQAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const verticalBarRef = useRef<HTMLDivElement>(null);
  const flairRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const contentEl = contentRef.current;
    const vertBar = verticalBarRef.current;
    const flair = flairRef.current;

    if (isInitialRender.current) {
      isInitialRender.current = false;
      if (isOpen) {
        if (contentEl) gsap.set(contentEl, { height: "auto", opacity: 1 });
        if (vertBar) gsap.set(vertBar, { rotation: 0, opacity: 0 });
        if (flair) gsap.set(flair, { rotation: 180 });
      } else {
        if (contentEl) gsap.set(contentEl, { height: 0, opacity: 0 });
        if (vertBar) gsap.set(vertBar, { rotation: 90, opacity: 1 });
        if (flair) gsap.set(flair, { rotation: 0 });
      }
      return;
    }

    if (prefersReducedMotion) {
      if (contentEl) {
        gsap.set(contentEl, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        });
      }
      if (vertBar) {
        gsap.set(vertBar, {
          rotation: isOpen ? 0 : 90,
          opacity: isOpen ? 0 : 1,
        });
      }
      if (flair) {
        gsap.set(flair, { rotation: isOpen ? 180 : 0 });
      }
      return;
    }

    if (isOpen) {
      // Smooth Expand
      if (contentEl) {
        gsap.killTweensOf(contentEl);
        const height = contentEl.scrollHeight;
        gsap.fromTo(
          contentEl,
          { height: 0, opacity: 0 },
          {
            height: height,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(contentEl, { height: "auto" });
            },
          }
        );
      }
      if (vertBar) {
        gsap.to(vertBar, {
          rotation: 0,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        });
      }
      if (flair) {
        gsap.to(flair, {
          rotation: 180,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    } else {
      // Smooth Collapse
      if (contentEl) {
        gsap.killTweensOf(contentEl);
        const currentHeight = contentEl.offsetHeight;
        gsap.fromTo(
          contentEl,
          { height: currentHeight, opacity: 1 },
          {
            height: 0,
            opacity: 0,
            duration: 0.28,
            ease: "power2.inOut",
          }
        );
      }
      if (vertBar) {
        gsap.to(vertBar, {
          rotation: 90,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      }
      if (flair) {
        gsap.to(flair, {
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="faq-row w-full flex flex-col justify-start items-start gap-2 border-b border-[#272d2a]/60 pb-3 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full p-2 group flex items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0ae448]/60"
      >
        {/* Flair Icon */}
        <div
          ref={flairRef}
          className="size-8 sm:size-10 shrink-0 origin-center transition-transform"
        >
          <Image
            src={item.flair}
            alt=""
            width={40}
            height={40}
            className="w-full h-full object-contain pointer-events-none"
            priority={false}
          />
        </div>

        {/* Question Text */}
        <span className="text-white text-base sm:text-xl lg:text-2xl font-normal font-['Space_Mono',monospace] leading-relaxed transition-colors group-hover:text-[#abff84] shrink-0 max-w-[calc(100%-80px)] sm:max-w-none">
          {item.question}
        </span>

        {/* Dashed Connecting Line */}
        <div className="hidden md:block flex-1 h-0 border-t-2 border-dashed border-white/20 min-w-[24px] self-center group-hover:border-[#0ae448]/40 transition-colors" />

        {/* Plus / Minus Animated Toggle */}
        <div
          className="size-7 sm:size-8 relative shrink-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Horizontal Bar (Always visible) */}
          <div className="w-6 sm:w-8 h-[3px] bg-[#0ae448] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          {/* Vertical Bar (Rotates to 0deg and fades out when Minus) */}
          <div
            ref={verticalBarRef}
            className="w-6 sm:w-8 h-[3px] bg-[#0ae448] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full origin-center"
          />
        </div>
      </button>

      {/* Answer Disclosure */}
      <div
        ref={contentRef}
        className="overflow-hidden w-full"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="w-full max-w-[650px] pl-12 sm:pl-16 pr-4 pt-1 pb-4">
          <p className="text-gray-300 text-sm sm:text-base font-normal font-['Space_Mono',monospace] leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const containerRef = useRef<HTMLElement>(null);
  // Default to first question open to showcase design as in Figma
  const [openId, setOpenId] = useState<string | null>("eligibility");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Section Entrance Animations with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.from(".faq-header-reveal", {
        y: 35,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
      }).from(
        ".faq-row",
        {
          y: 25,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "y,opacity",
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="faq"
      ref={containerRef}
      className="w-full pt-16 pb-12 sm:pt-24 sm:pb-20 px-8 sm:px-8 lg:px-20 flex flex-col items-center bg-transparent relative z-10"
    >
      {/* Section Header */}
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center text-center mb-12 sm:mb-16 gap-8">
        <h2
          className="faq-header-reveal text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <span className="block overflow-hidden">
            <span className="block">Frequently Asked Questions</span>
          </span>
        </h2>
        <p className="faq-header-reveal text-sm sm:text-base lg:text-lg leading-relaxed text-[#bbbaa6] font-['Space_Mono',monospace] max-w-lg">
          Everything you need to know about HaXtreme 5.0 before stepping into the arena.
        </p>


          <p className="font-space-mono text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md"></p>



      </div>

      {/* Accordion Container matching Figma w-[1575px] max constraint */}
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-start items-start gap-4">
        {FAQ_ITEMS.map((item) => (
          <FAQAccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
