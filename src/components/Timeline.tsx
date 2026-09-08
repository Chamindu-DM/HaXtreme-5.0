"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PathData {
  main1: string;
  box1Left: string;
  box1Right: string;
}

function Frame({ innerRef, janRef }: { innerRef?: React.RefObject<HTMLDivElement | null>; janRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div
      ref={innerRef}
      className="border-l-8 border-solid border-transparent content-stretch flex items-end p-[8px] relative shrink-0 w-full overflow-hidden"
    >
      <p
        ref={janRef}
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[32px] sm:text-[40px] md:text-[46px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Sep 15
      </p>
    </div>
  );
}

function Frame2({ desc1Ref }: { desc1Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px p-[8px] relative overflow-hidden">
        <p
          ref={desc1Ref}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
        >
          Registration Opening
        </p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px p-[8px] relative" />
    </div>
  );
}

function Frame3({ desc1Ref }: { desc1Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame2 desc1Ref={desc1Ref} />
      <Frame1 />
    </div>
  );
}

function Frame7({ febRef }: { febRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-end justify-end min-w-px p-[8px] relative overflow-hidden">
      <p
        ref={febRef}
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[32px] sm:text-[40px] md:text-[46px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Sep 19
      </p>
    </div>
  );
}

function Frame6({ febRef }: { febRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame7 febRef={febRef} />
    </div>
  );
}

function Frame5({
  innerRef,
  desc1Ref,
  febRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  desc1Ref?: React.RefObject<HTMLParagraphElement | null>;
  febRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="border-b-8 border-r-8 border-solid border-t-8 border-transparent content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full"
    >
      <Frame3 desc1Ref={desc1Ref} />
      <Frame6 febRef={febRef} />
    </div>
  );
}

function Frame11() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px p-[8px] relative" />
    </div>
  );
}

function Frame12({ desc2Ref }: { desc2Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px p-[8px] relative overflow-hidden">
        <p
          ref={desc2Ref}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-right text-gray-300 will-change-transform"
        >
          Webinar 1 (Online)
        </p>
      </div>
    </div>
  );
}

function Frame9({ desc2Ref }: { desc2Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame11 />
      <Frame12 desc2Ref={desc2Ref} />
    </div>
  );
}

function Frame14({ marRef }: { marRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-end min-w-px p-[8px] relative overflow-hidden">
      <p
        ref={marRef}
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[32px] sm:text-[40px] md:text-[46px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Sep 27
      </p>
    </div>
  );
}

function Frame13({ marRef }: { marRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame14 marRef={marRef} />
    </div>
  );
}

function Frame8({
  innerRef,
  desc2Ref,
  marRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  desc2Ref?: React.RefObject<HTMLParagraphElement | null>;
  marRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="border-b-8 border-l-8 border-solid border-transparent content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full"
    >
      <Frame9 desc2Ref={desc2Ref} />
      <Frame13 marRef={marRef} />
    </div>
  );
}

function Frame17({ desc3Ref }: { desc3Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px pb-[40px] pt-[8px] px-[8px] relative overflow-hidden">
        <p
          ref={desc3Ref}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
        >
          Webinar 2 (Online)
        </p>
      </div>
    </div>
  );
}

function Frame18({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div
        ref={innerRef}
        className="border-b-8 border-r-8 border-solid border-transparent content-stretch flex flex-[1_0_0] h-full items-start min-w-px p-[8px] relative"
      />
    </div>
  );
}

function Frame16({
  innerRef,
  desc3Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  desc3Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame17 desc3Ref={desc3Ref} />
      <Frame18 innerRef={innerRef} />
    </div>
  );
}

function Frame20({ apr1LeftRef }: { apr1LeftRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden">
        <p
          ref={apr1LeftRef}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[32px] sm:text-[40px] md:text-[46px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Sep 30
        </p>
      </div>
    </div>
  );
}

function Frame21({
  innerRef,
  apr1RightRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  apr1RightRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div
        ref={innerRef}
        className="border-l-8 border-solid border-transparent content-stretch flex flex-[1_0_0] h-full items-end justify-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden"
      >
        <p
          ref={apr1RightRef}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[32px] sm:text-[40px] md:text-[46px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          OCT 03
        </p>
      </div>
    </div>
  );
}

function Frame19({
  innerRef,
  apr1LeftRef,
  apr1RightRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  apr1LeftRef?: React.RefObject<HTMLParagraphElement | null>;
  apr1RightRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame20 apr1LeftRef={apr1LeftRef} />
      <Frame21 innerRef={innerRef} apr1RightRef={apr1RightRef} />
    </div>
  );
}

function Frame24({ descBox1LRef }: { descBox1LRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px pb-[40px] pt-[8px] px-[8px] relative overflow-hidden">
      <p
        ref={descBox1LRef}
        className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
      >
        Registration Closing
      </p>
    </div>
  );
}

function Frame25({ descBox1RRef }: { descBox1RRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px pb-[40px] pt-[8px] px-[8px] relative overflow-hidden">
      <p
        ref={descBox1RRef}
        className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-right text-gray-300 will-change-transform"
      >
        Online Round (All Teams)
      </p>
    </div>
  );
}

function Frame23({
  descBox1LRef,
  descBox1RRef,
}: {
  descBox1LRef?: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full overflow-hidden">
      <Frame24 descBox1LRef={descBox1LRef} />
      <Frame25 descBox1RRef={descBox1RRef} />
    </div>
  );
}

function Frame22({
  innerRef,
  descBox1LRef,
  descBox1RRef,
  oct4Ref,
  descOct4Ref,
  finalDateRef,
  finalDescRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descBox1LRef?: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef?: React.RefObject<HTMLParagraphElement | null>;
  oct4Ref?: React.RefObject<HTMLParagraphElement | null>;
  descOct4Ref?: React.RefObject<HTMLParagraphElement | null>;
  finalDateRef?: React.RefObject<HTMLParagraphElement | null>;
  finalDescRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="aspect-[492/492] border-8 border-solid border-transparent content-stretch flex flex-col justify-between items-center relative shrink-0 w-full overflow-hidden"
    >
      {/* Top Row: Left = Registration Closing, Right = Online Round */}
      <Frame23 descBox1LRef={descBox1LRef} descBox1RRef={descBox1RRef} />

      {/* Middle Milestone: Oct 04 Finalist Announcement */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-4 z-10">
        <p
          ref={oct4Ref}
          className="[word-break:break-word] font-bold leading-[0.93] text-[24px] sm:text-[30px] md:text-[34px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Oct 04
        </p>
        <p
          ref={descOct4Ref}
          className="[word-break:break-word] font-space-mono text-[12px] sm:text-[13px] text-gray-300 will-change-transform mt-1 text-center"
        >
          Finalist Announcement
        </p>
      </div>

      {/* Bottom Climax: Large Oct 10 Physical Final Round inside square bottom */}
      <div className="w-full flex flex-col items-center justify-center text-center pb-4 sm:pb-6 px-4 z-10">
        <p
          ref={finalDateRef}
          className="[word-break:break-word] font-bold leading-none text-[48px] sm:text-[60px] md:text-[72px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Oct 10
        </p>
        <p
          ref={finalDescRef}
          className="[word-break:break-word] font-space-mono text-[13px] sm:text-[15px] md:text-[17px] text-[#0ae448] uppercase tracking-wider font-bold will-change-transform mt-2 text-center"
        >
          Physical Final Round
        </p>
      </div>
    </div>
  );
}

function Frame15(props: {
  frame18Ref: React.RefObject<HTMLDivElement | null>;
  frame21Ref: React.RefObject<HTMLDivElement | null>;
  frame22Ref: React.RefObject<HTMLDivElement | null>;
  desc3Ref: React.RefObject<HTMLParagraphElement | null>;
  apr1LeftRef: React.RefObject<HTMLParagraphElement | null>;
  apr1RightRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1LRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef: React.RefObject<HTMLParagraphElement | null>;
  oct4Ref: React.RefObject<HTMLParagraphElement | null>;
  descOct4Ref: React.RefObject<HTMLParagraphElement | null>;
  finalDateRef: React.RefObject<HTMLParagraphElement | null>;
  finalDescRef: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame16 innerRef={props.frame18Ref} desc3Ref={props.desc3Ref} />
      <Frame19 innerRef={props.frame21Ref} apr1LeftRef={props.apr1LeftRef} apr1RightRef={props.apr1RightRef} />
      <Frame22
        innerRef={props.frame22Ref}
        descBox1LRef={props.descBox1LRef}
        descBox1RRef={props.descBox1RRef}
        oct4Ref={props.oct4Ref}
        descOct4Ref={props.descOct4Ref}
        finalDateRef={props.finalDateRef}
        finalDescRef={props.finalDescRef}
      />
    </div>
  );
}

function Frame4(props: {
  frame4Ref: React.RefObject<HTMLDivElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  frame5Ref: React.RefObject<HTMLDivElement | null>;
  frame8Ref: React.RefObject<HTMLDivElement | null>;
  frame18Ref: React.RefObject<HTMLDivElement | null>;
  frame21Ref: React.RefObject<HTMLDivElement | null>;
  frame22Ref: React.RefObject<HTMLDivElement | null>;
  janRef: React.RefObject<HTMLParagraphElement | null>;
  desc1Ref: React.RefObject<HTMLParagraphElement | null>;
  febRef: React.RefObject<HTMLParagraphElement | null>;
  desc2Ref: React.RefObject<HTMLParagraphElement | null>;
  marRef: React.RefObject<HTMLParagraphElement | null>;
  desc3Ref: React.RefObject<HTMLParagraphElement | null>;
  apr1LeftRef: React.RefObject<HTMLParagraphElement | null>;
  apr1RightRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1LRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef: React.RefObject<HTMLParagraphElement | null>;
  oct4Ref: React.RefObject<HTMLParagraphElement | null>;
  descOct4Ref: React.RefObject<HTMLParagraphElement | null>;
  finalDateRef: React.RefObject<HTMLParagraphElement | null>;
  finalDescRef: React.RefObject<HTMLParagraphElement | null>;
  main1PathRef: React.RefObject<SVGPathElement | null>;
  box1LeftPathRef: React.RefObject<SVGPathElement | null>;
  box1RightPathRef: React.RefObject<SVGPathElement | null>;
  paths: PathData | null;
  svgSize: { width: number; height: number };
}) {
  return (
    <div
      ref={props.frame4Ref}
      className="content-stretch flex flex-col items-start relative shrink-0 w-full max-w-[480px]"
    >
      {/* Animated SVG line overlay drawing on scroll in GREEN */}
      {props.paths && (
        <svg
          className="absolute inset-0 pointer-events-none z-20 overflow-visible"
          width={props.svgSize.width || 480}
          height={props.svgSize.height || "100%"}
          viewBox={`0 0 ${props.svgSize.width || 480} ${props.svgSize.height || 1000}`}
          fill="none"
        >
          {/* Main path from Sep 15 to Box 1 */}
          <path
            ref={props.main1PathRef}
            d={props.paths.main1}
            stroke="#0ae448"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Box 1: Left Branch */}
          <path
            ref={props.box1LeftPathRef}
            d={props.paths.box1Left}
            stroke="#0ae448"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Box 1: Right Branch */}
          <path
            ref={props.box1RightPathRef}
            d={props.paths.box1Right}
            stroke="#0ae448"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )}

      <Frame innerRef={props.frameRef} janRef={props.janRef} />
      <Frame5 innerRef={props.frame5Ref} desc1Ref={props.desc1Ref} febRef={props.febRef} />
      <Frame8 innerRef={props.frame8Ref} desc2Ref={props.desc2Ref} marRef={props.marRef} />
      <Frame15
        frame18Ref={props.frame18Ref}
        frame21Ref={props.frame21Ref}
        frame22Ref={props.frame22Ref}
        desc3Ref={props.desc3Ref}
        apr1LeftRef={props.apr1LeftRef}
        apr1RightRef={props.apr1RightRef}
        descBox1LRef={props.descBox1LRef}
        descBox1RRef={props.descBox1RRef}
        oct4Ref={props.oct4Ref}
        descOct4Ref={props.descOct4Ref}
        finalDateRef={props.finalDateRef}
        finalDescRef={props.finalDescRef}
      />
    </div>
  );
}

export default function Timeline({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frame4Ref = useRef<HTMLDivElement | null>(null);

  // SVG Path Refs
  const main1PathRef = useRef<SVGPathElement | null>(null);
  const box1LeftPathRef = useRef<SVGPathElement | null>(null);
  const box1RightPathRef = useRef<SVGPathElement | null>(null);

  // Frame Border Coordinate Refs
  const frameRef = useRef<HTMLDivElement | null>(null);
  const frame5Ref = useRef<HTMLDivElement | null>(null);
  const frame8Ref = useRef<HTMLDivElement | null>(null);
  const frame18Ref = useRef<HTMLDivElement | null>(null);
  const frame21Ref = useRef<HTMLDivElement | null>(null);
  const frame22Ref = useRef<HTMLDivElement | null>(null);

  // Text & Month Refs for sliding animations
  const janRef = useRef<HTMLParagraphElement | null>(null);
  const desc1Ref = useRef<HTMLParagraphElement | null>(null);
  const febRef = useRef<HTMLParagraphElement | null>(null);
  const desc2Ref = useRef<HTMLParagraphElement | null>(null);
  const marRef = useRef<HTMLParagraphElement | null>(null);
  const desc3Ref = useRef<HTMLParagraphElement | null>(null);
  const apr1LeftRef = useRef<HTMLParagraphElement | null>(null);
  const apr1RightRef = useRef<HTMLParagraphElement | null>(null);
  const descBox1LRef = useRef<HTMLParagraphElement | null>(null);
  const descBox1RRef = useRef<HTMLParagraphElement | null>(null);
  const oct4Ref = useRef<HTMLParagraphElement | null>(null);
  const descOct4Ref = useRef<HTMLParagraphElement | null>(null);
  const finalDateRef = useRef<HTMLParagraphElement | null>(null);
  const finalDescRef = useRef<HTMLParagraphElement | null>(null);

  const [paths, setPaths] = useState<PathData | null>(null);
  const [svgSize, setSvgSize] = useState({ width: 480, height: 1200 });

  // Calculate layout coordinates using getBoundingClientRect relative to container
  const getPos = (el: HTMLElement | null, container: HTMLElement | null) => {
    if (!el || !container) return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    const elRect = el.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const top = elRect.top - contRect.top;
    const left = elRect.left - contRect.left;
    const width = elRect.width;
    const height = elRect.height;
    return {
      top,
      left,
      bottom: top + height,
      right: left + width,
      width,
      height,
    };
  };

  const updatePath = () => {
    if (!frame4Ref.current) return;
    const container = frame4Ref.current;
    const W = container.offsetWidth || 480;
    const halfS = 4; // half of 8px border

    const f1 = getPos(frameRef.current, container);
    const f5 = getPos(frame5Ref.current, container);
    const f8 = getPos(frame8Ref.current, container);
    const f18 = getPos(frame18Ref.current, container);
    const f21 = getPos(frame21Ref.current, container);
    const f22 = getPos(frame22Ref.current, container);

    const leftX = halfS;
    const rightX = W - halfS;

    // Box 1 center X & Ys
    const cx1 = f21.left > 0 ? f21.left + halfS : W / 2;
    const topY1 = f22.top + halfS;
    const botY1 = f22.bottom - halfS;

    // 1. Main 1 path (Sep 15 to top center of Box 1)
    const main1 = [
      `M ${leftX} ${f1.top + halfS}`,
      `L ${leftX} ${f5.top + halfS}`,
      `L ${rightX} ${f5.top + halfS}`,
      `L ${rightX} ${f5.bottom - halfS}`,
      `L ${leftX} ${f5.bottom - halfS}`,
      `L ${leftX} ${f8.bottom - halfS}`,
      `L ${rightX} ${f8.bottom - halfS}`,
      `L ${rightX} ${f18.bottom - halfS}`,
      `L ${f18.left > 0 ? f18.left + halfS : W / 2} ${f18.bottom - halfS}`,
      `L ${cx1} ${topY1}`,
    ].join(" ");

    // 2. Box 1 Left path
    const box1Left = [
      `M ${cx1} ${topY1}`,
      `L ${leftX} ${topY1}`,
      `L ${leftX} ${botY1}`,
      `L ${cx1} ${botY1}`,
    ].join(" ");

    // 3. Box 1 Right path
    const box1Right = [
      `M ${cx1} ${topY1}`,
      `L ${rightX} ${topY1}`,
      `L ${rightX} ${botY1}`,
      `L ${cx1} ${botY1}`,
    ].join(" ");

    setPaths({ main1, box1Left, box1Right });
    setSvgSize({ width: W, height: container.offsetHeight || 1200 });
  };

  useEffect(() => {
    updatePath();

    const onAssetsReady = () => {
      updatePath();
      ScrollTrigger.refresh();
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(onAssetsReady);
    }

    const t1 = setTimeout(onAssetsReady, 100);
    const t2 = setTimeout(onAssetsReady, 500);
    const t3 = setTimeout(onAssetsReady, 1500);

    window.addEventListener("resize", onAssetsReady);
    window.addEventListener("load", onAssetsReady);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", onAssetsReady);
      window.removeEventListener("load", onAssetsReady);
    };
  }, []);

  // GSAP ScrollTrigger animation
  useEffect(() => {
    if (
      !paths ||
      !main1PathRef.current ||
      !box1LeftPathRef.current ||
      !box1RightPathRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const p1 = main1PathRef.current;
      const pB1L = box1LeftPathRef.current;
      const pB1R = box1RightPathRef.current;

      if (!p1 || !pB1L || !pB1R) return;

      const len1 = p1.getTotalLength() || 1000;
      const lenB1L = pB1L.getTotalLength() || 800;
      const lenB1R = pB1R.getTotalLength() || 800;

      // Initialize line strokes
      const allPaths = [
        { el: p1, len: len1 },
        { el: pB1L, len: lenB1L },
        { el: pB1R, len: lenB1R },
      ];

      allPaths.forEach(({ el, len }) => {
        gsap.set(el, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      // Initialize slide up items (y: 28 -> 0)
      const monthEls = [
        janRef.current,
        febRef.current,
        marRef.current,
        apr1LeftRef.current,
        apr1RightRef.current,
        oct4Ref.current,
      ];

      monthEls.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 28 });
      });

      // Initialize descriptions (y: -28 -> 0)
      const descEls = [
        desc1Ref.current,
        desc2Ref.current,
        desc3Ref.current,
        descBox1LRef.current,
        descBox1RRef.current,
        descOct4Ref.current,
      ];

      descEls.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: -28 });
      });

      // Initialize grand finale (Physical Final Round inside square bottom)
      const finalEls = [finalDateRef.current, finalDescRef.current].filter(Boolean);
      if (finalEls.length > 0) {
        gsap.set(finalEls, { opacity: 0, y: 24, scale: 0.92 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // ==========================================
      // STEP 1: Main 1 (Sep 15 -> Sep 30)
      // ==========================================
      tl.to(p1, {
        strokeDashoffset: 0,
        duration: len1,
        ease: "none",
      });

      // Sep 15: Month & Description
      if (janRef.current) {
        tl.to(
          janRef.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.05 * len1
        );
      }
      if (desc1Ref.current) {
        tl.to(
          desc1Ref.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.05 * len1
        );
      }

      // Sep 19: Webinar 1 (Online)
      if (febRef.current) {
        tl.to(
          febRef.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.35 * len1
        );
      }
      if (desc2Ref.current) {
        tl.to(
          desc2Ref.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.35 * len1
        );
      }

      // Sep 27: Webinar 2 (Online)
      if (marRef.current) {
        tl.to(
          marRef.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.65 * len1
        );
      }
      if (desc3Ref.current) {
        tl.to(
          desc3Ref.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.65 * len1
        );
      }

      // Sep 30: Top-left of square
      if (apr1LeftRef.current) {
        tl.to(
          apr1LeftRef.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.88 * len1
        );
      }
      if (descBox1LRef.current) {
        tl.to(
          descBox1LRef.current,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.88 * len1
        );
      }

      const tBox1 = len1;

      // ==========================================
      // STEP 2: Box 1 (Square Drawing)
      // ==========================================
      tl.to(
        pB1L,
        {
          strokeDashoffset: 0,
          duration: lenB1L,
          ease: "none",
        },
        tBox1
      );
      tl.to(
        pB1R,
        {
          strokeDashoffset: 0,
          duration: lenB1R,
          ease: "none",
        },
        tBox1
      );

      // Oct 03: Top-right of square
      if (apr1RightRef.current) {
        tl.to(
          apr1RightRef.current,
          { opacity: 1, y: 0, duration: 0.25 * lenB1R, ease: "power2.out" },
          tBox1 + 0.05 * lenB1R
        );
      }
      if (descBox1RRef.current) {
        tl.to(
          descBox1RRef.current,
          { opacity: 1, y: 0, duration: 0.25 * lenB1R, ease: "power2.out" },
          tBox1 + 0.05 * lenB1R
        );
      }

      // Oct 04: Middle of square
      if (oct4Ref.current) {
        tl.to(
          oct4Ref.current,
          { opacity: 1, y: 0, duration: 0.3 * lenB1L, ease: "power2.out" },
          tBox1 + 0.40 * lenB1L
        );
      }
      if (descOct4Ref.current) {
        tl.to(
          descOct4Ref.current,
          { opacity: 1, y: 0, duration: 0.3 * lenB1L, ease: "power2.out" },
          tBox1 + 0.40 * lenB1L
        );
      }

      // ==========================================
      // STEP 3: Grand Finale — Full square completed!
      // Large Oct 10 Physical Final Round appears inside square bottom
      // ==========================================
      if (finalEls.length > 0) {
        tl.to(
          finalEls,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4 * lenB1L,
            stagger: 0.08,
            ease: "back.out(1.5)",
          },
          tBox1 + lenB1L * 0.90
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [paths]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className={`w-full relative py-20 lg:py-32 select-none ${className}`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 xl:gap-24">
          
          {/* Left Column: Sticky Big Headline on Desktop / Top on Mobile */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32 flex flex-col justify-start space-y-6 mb-16 lg:mb-0 z-10">

            <h2
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-[1.02]"
              style={{
                fontFamily:
                  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Timeline
            </h2>

            <p className="font-space-mono text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
              Key milestones, registration cutoffs, and competitive rounds for
              HaXtreme 5.0.
            </p>

            <div className="pt-4 flex items-center gap-3 border-t border-white/10 font-space-mono text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0ae448] animate-pulse" />
              <span>PHASE // 2026 ROADMAP</span>
            </div>
          </div>

          {/* Right Column: Dynamic Drawing SVG Timeline Path */}
          <div className="w-full lg:w-7/12 flex justify-center lg:justify-end">
            <Frame4
              frame4Ref={frame4Ref}
              frameRef={frameRef}
              frame5Ref={frame5Ref}
              frame8Ref={frame8Ref}
              frame18Ref={frame18Ref}
              frame21Ref={frame21Ref}
              frame22Ref={frame22Ref}
              janRef={janRef}
              desc1Ref={desc1Ref}
              febRef={febRef}
              desc2Ref={desc2Ref}
              marRef={marRef}
              desc3Ref={desc3Ref}
              apr1LeftRef={apr1LeftRef}
              apr1RightRef={apr1RightRef}
              descBox1LRef={descBox1LRef}
              descBox1RRef={descBox1RRef}
              oct4Ref={oct4Ref}
              descOct4Ref={descOct4Ref}
              finalDateRef={finalDateRef}
              finalDescRef={finalDescRef}
              main1PathRef={main1PathRef}
              box1LeftPathRef={box1LeftPathRef}
              box1RightPathRef={box1RightPathRef}
              paths={paths}
              svgSize={svgSize}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
