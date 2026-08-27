import type { Metadata } from "next";
import "./globals.css";
import "../components/GSAP_Hero/hero.css";

export const metadata: Metadata = {
  title: "HaXtreme 5.0 | Redefine Possible",
  description:
    "HaXtreme 5.0 is the premier competitive programming and hackathon arena organized by the IEEE Student Branch of University of Ruhuna in collaboration with the Computer Engineering Society (ComES). Bringing together top undergraduate minds across Sri Lanka to architect, build, and deploy innovative solutions.",
  keywords: [
    "HaXtreme",
    "HaXtreme 5.0",
    "Hackathon",
    "Competitive Programming",
    "University of Ruhuna",
    "IEEE Student Branch",
    "ComES",
    "Computer Engineering Society",
    "Coding Competition",
    "Sri Lanka Hackathon",
    "Redefine Possible",
  ],
  authors: [{ name: "IEEE Student Branch of University of Ruhuna" }, { name: "ComES" }],
  openGraph: {
    title: "HaXtreme 5.0 | Redefine Possible",
    description:
      "The premier competitive programming and hackathon arena organized by the IEEE Student Branch of University of Ruhuna in collaboration with ComES.",
    url: "https://haxtreme.ieeeuor.org",
    siteName: "HaXtreme 5.0",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "HaXtreme 5.0",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaXtreme 5.0 | Redefine Possible",
    description:
      "Premier competitive programming and hackathon arena organized by IEEE SB University of Ruhuna & ComES.",
    images: ["/Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Handjet:wght,ELSH@100..900,2&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0E100F] text-slate-100 selection:bg-[#0ae448] selection:text-black">
        {children}
      </body>
    </html>
  );
}
