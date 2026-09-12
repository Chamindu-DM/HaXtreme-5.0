import type { Metadata } from "next";
import RegisterPageClient from "./RegisterPageClient";

export const metadata: Metadata = {
  title: "Join HaXtreme 5.0 | Official Team Registration",
  description:
    "Register your team for HaXtreme 5.0 - Premier competitive programming and hackathon arena organized by IEEE Student Branch of University of Ruhuna & ComES.",
  openGraph: {
    title: "Join HaXtreme 5.0 | Official Team Registration",
    description:
      "Form your trio and compete in Sri Lanka's premier hackathon and competitive programming arena.",
    url: "https://haxtreme.ieeeuor.org/register",
    siteName: "HaXtreme 5.0",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "HaXtreme 5.0 Registration",
      },
    ],
  },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
