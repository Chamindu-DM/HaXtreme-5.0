import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-12 sm:py-16 px-6 flex justify-center items-center bg-[#0e100f]">
      <div className="relative w-full max-w-[220px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px] aspect-[1232/106]">
        <Image
          src="/Logo.png"
          alt="HaXtreme 5.0 Partners and Organizers"
          fill
          className="object-contain"
          priority
        />
      </div>
    </footer>
  );
}
