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
  midPath: string;
  box2Left: string;
  box2Right: string;
}

function Frame({ innerRef, janRef }: { innerRef?: React.RefObject<HTMLDivElement | null>; janRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div
      ref={innerRef}
      className="border-l-8 border-solid border-transparent content-stretch flex items-end p-[8px] relative shrink-0 w-full overflow-hidden"
    >
      <p
        ref={janRef}
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Jan
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
          Registerations Opening
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
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Feb
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
          Registerations Opening
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
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        mar
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
          Registerations Opening
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
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          APR
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
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          APR
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
        Registerations Opening
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
        Registerations Opening
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

function Frame27({ jun1Ref }: { jun1Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden">
        <p
          ref={jun1Ref}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Jun
        </p>
      </div>
    </div>
  );
}

function Frame28({ jul1Ref }: { jul1Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end justify-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden">
        <p
          ref={jul1Ref}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          jul
        </p>
      </div>
    </div>
  );
}

function Frame26({
  jun1Ref,
  jul1Ref,
}: {
  jun1Ref?: React.RefObject<HTMLParagraphElement | null>;
  jul1Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full overflow-hidden">
      <Frame27 jun1Ref={jun1Ref} />
      <Frame28 jul1Ref={jul1Ref} />
    </div>
  );
}

function Frame22({
  innerRef,
  descBox1LRef,
  descBox1RRef,
  jun1Ref,
  jul1Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descBox1LRef?: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef?: React.RefObject<HTMLParagraphElement | null>;
  jun1Ref?: React.RefObject<HTMLParagraphElement | null>;
  jul1Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="aspect-[492/492] border-8 border-solid border-transparent content-stretch flex flex-col gap-[280px] items-start justify-center relative shrink-0 w-full"
    >
      <Frame23 descBox1LRef={descBox1LRef} descBox1RRef={descBox1RRef} />
      <Frame26 jun1Ref={jun1Ref} jul1Ref={jul1Ref} />
    </div>
  );
}

function Frame30({
  innerRef,
  descMidLRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descMidLRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div
        ref={innerRef}
        className="border-b-8 border-r-8 border-solid border-transparent content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[40px] pl-[8px] pr-[40px] pt-[8px] relative overflow-hidden"
      >
        <p
          ref={descMidLRef}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
        >
          Registerations Opening
        </p>
      </div>
    </div>
  );
}

function Frame31({ descMidRRef }: { descMidRRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[40px] pl-[40px] pr-[8px] pt-[8px] relative overflow-hidden">
        <p
          ref={descMidRRef}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-right text-gray-300 will-change-transform"
        >
          Registerations Opening
        </p>
      </div>
    </div>
  );
}

function Frame29({
  innerRef,
  descMidLRef,
  descMidRRef,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descMidLRef?: React.RefObject<HTMLParagraphElement | null>;
  descMidRRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame30 innerRef={innerRef} descMidLRef={descMidLRef} />
      <Frame31 descMidRRef={descMidRRef} />
    </div>
  );
}

function Frame32({
  innerRef,
  apr2Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  apr2Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="border-l-8 border-solid border-transparent content-stretch flex h-[101px] items-end pb-[8px] pt-[40px] px-[8px] relative shrink-0 w-full overflow-hidden"
    >
      <p
        ref={apr2Ref}
        className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
        style={{
          fontFamily:
            '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        APR
      </p>
    </div>
  );
}

function Frame34({
  innerRef,
  descMid34Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descMid34Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div
        ref={innerRef}
        className="border-r-8 border-solid border-t-8 border-transparent content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[40px] pl-[8px] pr-[40px] pt-[8px] relative overflow-hidden"
      >
        <p
          ref={descMid34Ref}
          className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
        >
          Registerations Opening
        </p>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[40px] pl-[40px] pr-[8px] pt-[8px] relative" />
    </div>
  );
}

function Frame33({
  innerRef,
  descMid34Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descMid34Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full overflow-hidden">
      <Frame34 innerRef={innerRef} descMid34Ref={descMid34Ref} />
      <Frame35 />
    </div>
  );
}

function Frame38({ descBox2LRef }: { descBox2LRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px pb-[40px] pt-[8px] px-[8px] relative overflow-hidden">
      <p
        ref={descBox2LRef}
        className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-gray-300 will-change-transform"
      >
        Registerations Opening
      </p>
    </div>
  );
}

function Frame39({ descBox2RRef }: { descBox2RRef?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-w-px pb-[40px] pt-[8px] px-[8px] relative overflow-hidden">
      <p
        ref={descBox2RRef}
        className="[word-break:break-word] flex-[1_0_0] font-space-mono leading-relaxed min-w-px not-italic relative text-[13px] sm:text-[14px] text-right text-gray-300 will-change-transform"
      >
        Registerations Opening
      </p>
    </div>
  );
}

function Frame37({
  descBox2LRef,
  descBox2RRef,
}: {
  descBox2LRef?: React.RefObject<HTMLParagraphElement | null>;
  descBox2RRef?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full overflow-hidden">
      <Frame38 descBox2LRef={descBox2LRef} />
      <Frame39 descBox2RRef={descBox2RRef} />
    </div>
  );
}

function Frame41({ jun2Ref }: { jun2Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden">
        <p
          ref={jun2Ref}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Jun
        </p>
      </div>
    </div>
  );
}

function Frame42({ jul2Ref }: { jul2Ref?: React.RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch overflow-hidden">
      <div className="content-stretch flex flex-[1_0_0] h-full items-end justify-end min-w-px pb-[8px] pt-[40px] px-[8px] relative overflow-hidden">
        <p
          ref={jul2Ref}
          className="[word-break:break-word] font-bold leading-[0.93] relative shrink-0 text-[42px] sm:text-[48px] text-white uppercase whitespace-nowrap will-change-transform"
          style={{
            fontFamily:
              '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          jul
        </p>
      </div>
    </div>
  );
}

function Frame40({
  jun2Ref,
  jul2Ref,
}: {
  jun2Ref?: React.RefObject<HTMLParagraphElement | null>;
  jul2Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full overflow-hidden">
      <Frame41 jun2Ref={jun2Ref} />
      <Frame42 jul2Ref={jul2Ref} />
    </div>
  );
}

function Frame36({
  innerRef,
  descBox2LRef,
  descBox2RRef,
  jun2Ref,
  jul2Ref,
}: {
  innerRef?: React.RefObject<HTMLDivElement | null>;
  descBox2LRef?: React.RefObject<HTMLParagraphElement | null>;
  descBox2RRef?: React.RefObject<HTMLParagraphElement | null>;
  jun2Ref?: React.RefObject<HTMLParagraphElement | null>;
  jul2Ref?: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div
      ref={innerRef}
      className="aspect-[492/492] border-8 border-solid border-transparent content-stretch flex flex-col gap-[280px] items-start justify-center relative shrink-0 w-full"
    >
      <Frame37 descBox2LRef={descBox2LRef} descBox2RRef={descBox2RRef} />
      <Frame40 jun2Ref={jun2Ref} jul2Ref={jul2Ref} />
    </div>
  );
}

function Frame15(props: {
  frame18Ref: React.RefObject<HTMLDivElement | null>;
  frame21Ref: React.RefObject<HTMLDivElement | null>;
  frame22Ref: React.RefObject<HTMLDivElement | null>;
  frame30Ref: React.RefObject<HTMLDivElement | null>;
  frame32Ref: React.RefObject<HTMLDivElement | null>;
  frame34Ref: React.RefObject<HTMLDivElement | null>;
  frame36Ref: React.RefObject<HTMLDivElement | null>;
  desc3Ref: React.RefObject<HTMLParagraphElement | null>;
  apr1LeftRef: React.RefObject<HTMLParagraphElement | null>;
  apr1RightRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1LRef: React.RefObject<HTMLParagraphElement | null>;
  descBox1RRef: React.RefObject<HTMLParagraphElement | null>;
  jun1Ref: React.RefObject<HTMLParagraphElement | null>;
  jul1Ref: React.RefObject<HTMLParagraphElement | null>;
  descMidLRef: React.RefObject<HTMLParagraphElement | null>;
  descMidRRef: React.RefObject<HTMLParagraphElement | null>;
  apr2Ref: React.RefObject<HTMLParagraphElement | null>;
  descMid34Ref: React.RefObject<HTMLParagraphElement | null>;
  descBox2LRef: React.RefObject<HTMLParagraphElement | null>;
  descBox2RRef: React.RefObject<HTMLParagraphElement | null>;
  jun2Ref: React.RefObject<HTMLParagraphElement | null>;
  jul2Ref: React.RefObject<HTMLParagraphElement | null>;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame16 innerRef={props.frame18Ref} desc3Ref={props.desc3Ref} />
      <Frame19 innerRef={props.frame21Ref} apr1LeftRef={props.apr1LeftRef} apr1RightRef={props.apr1RightRef} />
      <Frame22
        innerRef={props.frame22Ref}
        descBox1LRef={props.descBox1LRef}
        descBox1RRef={props.descBox1RRef}
        jun1Ref={props.jun1Ref}
        jul1Ref={props.jul1Ref}
      />
      <Frame29 innerRef={props.frame30Ref} descMidLRef={props.descMidLRef} descMidRRef={props.descMidRRef} />
      <Frame32 innerRef={props.frame32Ref} apr2Ref={props.apr2Ref} />
      <Frame33 innerRef={props.frame34Ref} descMid34Ref={props.descMid34Ref} />
      <Frame36
        innerRef={props.frame36Ref}
        descBox2LRef={props.descBox2LRef}
        descBox2RRef={props.descBox2RRef}
        jun2Ref={props.jun2Ref}
        jul2Ref={props.jul2Ref}
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
  frame30Ref: React.RefObject<HTMLDivElement | null>;
  frame32Ref: React.RefObject<HTMLDivElement | null>;
  frame34Ref: React.RefObject<HTMLDivElement | null>;
  frame36Ref: React.RefObject<HTMLDivElement | null>;
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
  jun1Ref: React.RefObject<HTMLParagraphElement | null>;
  jul1Ref: React.RefObject<HTMLParagraphElement | null>;
  descMidLRef: React.RefObject<HTMLParagraphElement | null>;
  descMidRRef: React.RefObject<HTMLParagraphElement | null>;
  apr2Ref: React.RefObject<HTMLParagraphElement | null>;
  descMid34Ref: React.RefObject<HTMLParagraphElement | null>;
  descBox2LRef: React.RefObject<HTMLParagraphElement | null>;
  descBox2RRef: React.RefObject<HTMLParagraphElement | null>;
  jun2Ref: React.RefObject<HTMLParagraphElement | null>;
  jul2Ref: React.RefObject<HTMLParagraphElement | null>;
  main1PathRef: React.RefObject<SVGPathElement | null>;
  box1LeftPathRef: React.RefObject<SVGPathElement | null>;
  box1RightPathRef: React.RefObject<SVGPathElement | null>;
  midPathRef: React.RefObject<SVGPathElement | null>;
  box2LeftPathRef: React.RefObject<SVGPathElement | null>;
  box2RightPathRef: React.RefObject<SVGPathElement | null>;
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
          {/* Main path from Jan to Box 1 */}
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
          {/* Mid path from Box 1 to Box 2 */}
          <path
            ref={props.midPathRef}
            d={props.paths.midPath}
            stroke="#0ae448"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Box 2: Left Branch */}
          <path
            ref={props.box2LeftPathRef}
            d={props.paths.box2Left}
            stroke="#0ae448"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {/* Box 2: Right Branch */}
          <path
            ref={props.box2RightPathRef}
            d={props.paths.box2Right}
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
        frame30Ref={props.frame30Ref}
        frame32Ref={props.frame32Ref}
        frame34Ref={props.frame34Ref}
        frame36Ref={props.frame36Ref}
        desc3Ref={props.desc3Ref}
        apr1LeftRef={props.apr1LeftRef}
        apr1RightRef={props.apr1RightRef}
        descBox1LRef={props.descBox1LRef}
        descBox1RRef={props.descBox1RRef}
        jun1Ref={props.jun1Ref}
        jul1Ref={props.jul1Ref}
        descMidLRef={props.descMidLRef}
        descMidRRef={props.descMidRRef}
        apr2Ref={props.apr2Ref}
        descMid34Ref={props.descMid34Ref}
        descBox2LRef={props.descBox2LRef}
        descBox2RRef={props.descBox2RRef}
        jun2Ref={props.jun2Ref}
        jul2Ref={props.jul2Ref}
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
  const midPathRef = useRef<SVGPathElement | null>(null);
  const box2LeftPathRef = useRef<SVGPathElement | null>(null);
  const box2RightPathRef = useRef<SVGPathElement | null>(null);

  // Frame Border Coordinate Refs
  const frameRef = useRef<HTMLDivElement | null>(null);
  const frame5Ref = useRef<HTMLDivElement | null>(null);
  const frame8Ref = useRef<HTMLDivElement | null>(null);
  const frame18Ref = useRef<HTMLDivElement | null>(null);
  const frame21Ref = useRef<HTMLDivElement | null>(null);
  const frame22Ref = useRef<HTMLDivElement | null>(null);
  const frame30Ref = useRef<HTMLDivElement | null>(null);
  const frame32Ref = useRef<HTMLDivElement | null>(null);
  const frame34Ref = useRef<HTMLDivElement | null>(null);
  const frame36Ref = useRef<HTMLDivElement | null>(null);

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
  const jun1Ref = useRef<HTMLParagraphElement | null>(null);
  const jul1Ref = useRef<HTMLParagraphElement | null>(null);
  const descMidLRef = useRef<HTMLParagraphElement | null>(null);
  const descMidRRef = useRef<HTMLParagraphElement | null>(null);
  const apr2Ref = useRef<HTMLParagraphElement | null>(null);
  const descMid34Ref = useRef<HTMLParagraphElement | null>(null);
  const descBox2LRef = useRef<HTMLParagraphElement | null>(null);
  const descBox2RRef = useRef<HTMLParagraphElement | null>(null);
  const jun2Ref = useRef<HTMLParagraphElement | null>(null);
  const jul2Ref = useRef<HTMLParagraphElement | null>(null);

  const [paths, setPaths] = useState<PathData | null>(null);
  const [svgSize, setSvgSize] = useState({ width: 480, height: 2000 });

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
    const f30 = getPos(frame30Ref.current, container);
    const f32 = getPos(frame32Ref.current, container);
    const f34 = getPos(frame34Ref.current, container);
    const f36 = getPos(frame36Ref.current, container);

    const leftX = halfS;
    const rightX = W - halfS;

    // Box 1 center X & Ys
    const cx1 = f21.left > 0 ? f21.left + halfS : W / 2;
    const topY1 = f22.top + halfS;
    const botY1 = f22.bottom - halfS;

    // Box 2 center X & Ys
    const cx2 = f34.right > 0 ? f34.right - halfS : W / 2;
    const topY2 = f36.top + halfS;
    const botY2 = f36.bottom - halfS;

    // 1. Main 1 path (Jan to top center of Box 1)
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

    // 4. Mid path (Box 1 bottom to Box 2 top)
    const midPath = [
      `M ${cx1} ${botY1}`,
      `L ${cx1} ${f30.bottom - halfS}`,
      `L ${leftX} ${f30.bottom - halfS}`,
      `L ${leftX} ${f34.top + halfS}`,
      `L ${cx2} ${f34.top + halfS}`,
      `L ${cx2} ${topY2}`,
    ].join(" ");

    // 5. Box 2 Left path
    const box2Left = [
      `M ${cx2} ${topY2}`,
      `L ${leftX} ${topY2}`,
      `L ${leftX} ${botY2}`,
      `L ${cx2} ${botY2}`,
    ].join(" ");

    // 6. Box 2 Right path
    const box2Right = [
      `M ${cx2} ${topY2}`,
      `L ${rightX} ${topY2}`,
      `L ${rightX} ${botY2}`,
      `L ${cx2} ${botY2}`,
    ].join(" ");

    setPaths({ main1, box1Left, box1Right, midPath, box2Left, box2Right });
    setSvgSize({ width: W, height: container.offsetHeight || 2000 });
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
      !midPathRef.current ||
      !box2LeftPathRef.current ||
      !box2RightPathRef.current ||
      !sectionRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const p1 = main1PathRef.current;
      const pB1L = box1LeftPathRef.current;
      const pB1R = box1RightPathRef.current;
      const pMid = midPathRef.current;
      const pB2L = box2LeftPathRef.current;
      const pB2R = box2RightPathRef.current;

      if (!p1 || !pB1L || !pB1R || !pMid || !pB2L || !pB2R) return;

      const len1 = p1.getTotalLength() || 1000;
      const lenB1L = pB1L.getTotalLength() || 800;
      const lenB1R = pB1R.getTotalLength() || 800;
      const lenMid = pMid.getTotalLength() || 600;
      const lenB2L = pB2L.getTotalLength() || 800;
      const lenB2R = pB2R.getTotalLength() || 800;

      // Initialize line strokes
      const allPaths = [
        { el: p1, len: len1 },
        { el: pB1L, len: lenB1L },
        { el: pB1R, len: lenB1R },
        { el: pMid, len: lenMid },
        { el: pB2L, len: lenB2L },
        { el: pB2R, len: lenB2R },
      ];

      allPaths.forEach(({ el, len }) => {
        gsap.set(el, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      // Initialize months (slide up from behind the path: y: 28 -> 0)
      const monthEls = [
        janRef.current,
        febRef.current,
        marRef.current,
        apr1LeftRef.current,
        apr1RightRef.current,
        jun1Ref.current,
        jul1Ref.current,
        apr2Ref.current,
        jun2Ref.current,
        jul2Ref.current,
      ];

      monthEls.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 28 });
      });

      // Initialize descriptions (slide down from behind the path: y: -28 -> 0)
      const descEls = [
        desc1Ref.current,
        desc2Ref.current,
        desc3Ref.current,
        descBox1LRef.current,
        descBox1RRef.current,
        descMidLRef.current,
        descMidRRef.current,
        descMid34Ref.current,
        descBox2LRef.current,
        descBox2RRef.current,
      ];

      descEls.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: -28 });
      });

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
      // STEP 1: Main 1 (Jan -> Box 1)
      // ==========================================
      tl.to(p1, {
        strokeDashoffset: 0,
        duration: len1,
        ease: "none",
      });

      // Jan month & Jan description start at the EXACT SAME TIME
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

      // Feb month & Feb description start at the EXACT SAME TIME
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

      // Mar month & Mar description start at the EXACT SAME TIME
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

      // APR 1 (left & right)
      const apr1Els = [apr1LeftRef.current, apr1RightRef.current].filter(Boolean);
      if (apr1Els.length > 0) {
        tl.to(
          apr1Els,
          { opacity: 1, y: 0, duration: 0.15 * len1, ease: "power2.out" },
          0.88 * len1
        );
      }

      const tBox1 = len1;

      // ==========================================
      // STEP 2: Box 1 (Dual branch left & right)
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

      // Box 1 Descriptions & Box 1 Months start at the EXACT SAME TIME
      const descBox1Els = [descBox1LRef.current, descBox1RRef.current].filter(Boolean);
      if (descBox1Els.length > 0) {
        tl.to(
          descBox1Els,
          { opacity: 1, y: 0, duration: 0.35 * lenB1L, ease: "power2.out" },
          tBox1 + 0.10 * lenB1L
        );
      }

      const box1MonthEls = [jun1Ref.current, jul1Ref.current].filter(Boolean);
      if (box1MonthEls.length > 0) {
        tl.to(
          box1MonthEls,
          { opacity: 1, y: 0, duration: 0.35 * lenB1L, ease: "power2.out" },
          tBox1 + 0.10 * lenB1L
        );
      }

      const tMid = tBox1 + lenB1L;

      // ==========================================
      // STEP 3: Mid Path (Box 1 -> Box 2)
      // ==========================================
      tl.to(
        pMid,
        {
          strokeDashoffset: 0,
          duration: lenMid,
          ease: "none",
        },
        tMid
      );

      // Descriptions below Box 1 (Frame 30 & 31)
      const descMidEls = [descMidLRef.current, descMidRRef.current].filter(Boolean);
      if (descMidEls.length > 0) {
        tl.to(
          descMidEls,
          { opacity: 1, y: 0, duration: 0.30 * lenMid, ease: "power2.out" },
          tMid + 0.05 * lenMid
        );
      }

      // APR 2 Month (Frame 32) & Description (Frame 34) start at the EXACT SAME TIME
      if (apr2Ref.current) {
        tl.to(
          apr2Ref.current,
          { opacity: 1, y: 0, duration: 0.30 * lenMid, ease: "power2.out" },
          tMid + 0.50 * lenMid
        );
      }

      if (descMid34Ref.current) {
        tl.to(
          descMid34Ref.current,
          { opacity: 1, y: 0, duration: 0.30 * lenMid, ease: "power2.out" },
          tMid + 0.50 * lenMid
        );
      }

      const tBox2 = tMid + lenMid;

      // ==========================================
      // STEP 4: Box 2 (Dual branch left & right)
      // ==========================================
      tl.to(
        pB2L,
        {
          strokeDashoffset: 0,
          duration: lenB2L,
          ease: "none",
        },
        tBox2
      );
      tl.to(
        pB2R,
        {
          strokeDashoffset: 0,
          duration: lenB2R,
          ease: "none",
        },
        tBox2
      );

      // Box 2 Descriptions & Box 2 Months start at the EXACT SAME TIME
      const descBox2Els = [descBox2LRef.current, descBox2RRef.current].filter(Boolean);
      if (descBox2Els.length > 0) {
        tl.to(
          descBox2Els,
          { opacity: 1, y: 0, duration: 0.35 * lenB2L, ease: "power2.out" },
          tBox2 + 0.10 * lenB2L
        );
      }

      const box2MonthEls = [jun2Ref.current, jul2Ref.current].filter(Boolean);
      if (box2MonthEls.length > 0) {
        tl.to(
          box2MonthEls,
          { opacity: 1, y: 0, duration: 0.35 * lenB2L, ease: "power2.out" },
          tBox2 + 0.10 * lenB2L
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
              frame30Ref={frame30Ref}
              frame32Ref={frame32Ref}
              frame34Ref={frame34Ref}
              frame36Ref={frame36Ref}
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
              jun1Ref={jun1Ref}
              jul1Ref={jul1Ref}
              descMidLRef={descMidLRef}
              descMidRRef={descMidRRef}
              apr2Ref={apr2Ref}
              descMid34Ref={descMid34Ref}
              descBox2LRef={descBox2LRef}
              descBox2RRef={descBox2RRef}
              jun2Ref={jun2Ref}
              jul2Ref={jul2Ref}
              main1PathRef={main1PathRef}
              box1LeftPathRef={box1LeftPathRef}
              box1RightPathRef={box1RightPathRef}
              midPathRef={midPathRef}
              box2LeftPathRef={box2LeftPathRef}
              box2RightPathRef={box2RightPathRef}
              paths={paths}
              svgSize={svgSize}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
