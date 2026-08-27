import type { Metadata } from "next";
import "./globals.css";
import "../components/GSAP_Hero/hero.css";

export const metadata: Metadata = {
  title: "HaXtreme 5.0 | Next.js + GSAP",
  description: "Next.js web application with GSAP animations",
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
