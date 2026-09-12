import type { Metadata } from "next";
import ContestPageClient from "./ContestPageClient";

export const metadata: Metadata = {
  title: "Contest Portal | HaXtreme 5.0",
  description:
    "Official HaXtreme 5.0 Contest Portal. Access the HackerRank contest arena, view verified team roster, and unlock your official virtual photobooth badge.",
  openGraph: {
    title: "Contest Portal | HaXtreme 5.0",
    description:
      "Official HaXtreme 5.0 Contest Portal. Access the HackerRank contest arena, view verified team roster, and unlock your official virtual photobooth badge.",
    url: "/contest",
    siteName: "HaXtreme 5.0",
    images: [
      {
        url: "/LinkPreview.png",
        width: 1920,
        height: 1080,
        alt: "HaXtreme 5.0 Contest Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function ContestPage() {
  return <ContestPageClient />;
}
