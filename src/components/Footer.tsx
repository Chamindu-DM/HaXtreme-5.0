import React from "react";
import Image from "next/image";

interface ContactPerson {
  name: string;
  role: string;
  email: string;
}

const CONTACTS: ContactPerson[] = [
  {
    name: "Chamindu Dissanayake",
    role: "Co-Chair",
    email: "chamindudissanayake1@gmail.com",
  },
  {
    name: "Denuwan Lakpriya",
    role: "Co-Chair",
    email: "denuwanlakpriya44@gmail.com",
  },
  {
    name: "Sulitha Nulaksha",
    role: "Public Relations (PR) Lead",
    email: "sulithanb119@gmail.com",
  },
  {
    name: "Shalomi Angel",
    role: "Public Relations (PR) Member",
    email: "shalomiangel12@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer id="contact-us" className="w-full pt-16 pb-12 sm:pt-20 sm:pb-16 px-6 flex flex-col items-center bg-transparent">
      {/* Contact Section at top of footer */}
      <div className="w-full max-w-[1200px] mx-auto py-8 md:py-16 mb-16 sm:mb-20">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12 gap-8">
          <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{
                fontFamily:
                  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <span className="block overflow-hidden">
                <span className="block guideline-line-reveal">
                  Get in Touch
                </span>
              </span>
            </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#bbbaa6] font-['Space_Mono',monospace] max-w-md">
            Have questions regarding HaXtreme 5.0? Connect with our team leads directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CONTACTS.map((contact) => (
            <div
              key={contact.email}
              className=" border border-[#272d2a] hover:border-[#0ae448]/50 p-5 flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-['Space_Mono',monospace] uppercase text-[#0ae448] tracking-widest block font-medium">
                  {contact.role}
                </span>
                <h4
                  className="text-base sm:text-lg font-bold text-white group-hover:text-[#abff84] transition-colors"
                  style={{
                    fontFamily:
                      '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {contact.name}
                </h4>
              </div>

              <div className="pt-5 mt-4 border-t border-[#272d2a]/80">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#bbbaa6] hover:text-[#0ae448] font-['Space_Mono',monospace] transition-colors break-all"
                  title={`Email ${contact.name}`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0 text-[#7c7c6f] group-hover:text-[#0ae448] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{contact.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner and Organizer Logos */}
      <div className="relative w-full max-w-[220px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px] aspect-[1232/106]">
        <Image
          src="/Logo.png"
          alt="HaXtreme 5.0 Partners and Organizers"
          fill
          sizes="(max-width: 640px) 220px, (max-width: 768px) 340px, (max-width: 1024px) 420px, 480px"
          className="object-contain"
          priority
        />
      </div>
    </footer>
  );
}
