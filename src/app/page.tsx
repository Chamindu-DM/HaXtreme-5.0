import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import WhatIs from "@/components/WhatIs";
import Guidelines from "@/components/Guidelines";
import Timeline from "@/components/Timeline";
import Partners from "@/components/Partners";
import Prizes from "@/components/Prizes";
import MemoryLane from "@/components/MemoryLane";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between">
      <Loader />
      <Navbar />
      <Hero />
      <Countdown />
      <WhatIs />
      <Guidelines />
      <Timeline />
      <Prizes />
      <MemoryLane />
      <Partners />
      <ContactUs />
      <Footer />
    </main>
  );
}
