import React from "react";

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

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    label: "IEEE Computer Society-University of Ruhuna",
    href: "https://www.facebook.com/ieeecsuor",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
        viewBox="0 0 16 16"
      >
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    label: "IEEE Computer Society-University of Ruhuna",
    href: "https://www.linkedin.com/company/ieeecs-uor/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
        viewBox="0 0 16 16"
      >
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    label: "HaXtreme 5.0",
    href: "https://whatsapp.com/channel/0029VbDHmmsKAwEneRfPYE1T",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
        viewBox="0 0 16 16"
      >
        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
      </svg>
    ),
  },
];

export default function ContactUs() {
  return (
    <section
      id="contact-us"
      className="w-full pt-16 pb-12 sm:pt-20 sm:pb-16 px-6 flex flex-col items-center bg-transparent relative z-10"
    >
      <div className="w-full max-w-[1200px] mx-auto py-8 md:py-16">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12 gap-8">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
            style={{
              fontFamily:
                '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            <span className="block overflow-hidden">
              <span className="block">
                Get in Touch
              </span>
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base lg:text-lg leading-relaxed text-[#bbbaa6] font-['Space_Mono',monospace] max-w-lg">
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

        {/* Social Community Links */}
        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row flex-wrap items-start sm:items-center sm:justify-center gap-6 sm:gap-12">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group transition-colors select-none"
            >
              <div className="size-8 relative overflow-hidden flex items-center justify-center text-white group-hover:text-[#0ae448] transition-colors shrink-0">
                {link.icon}
              </div>
              <span className="justify-start text-white group-hover:text-[#abff84] text-base sm:text-lg font-normal font-['Space_Mono',monospace] underline underline-offset-4 transition-colors leading-6">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
