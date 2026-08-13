"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/nav/Navigation";
import Hero from "@/components/sections/Hero";
import WeaponsDetail from "@/components/sections/WeaponsDetail";
import TheKalari from "@/components/sections/TheKalari";
import TheArt from "@/components/sections/TheArt";
import ThePractice from "@/components/sections/ThePractice";
import TheMovement from "@/components/sections/TheMovement";
import Training from "@/components/sections/Training";
import Philosophy from "@/components/sections/Philosophy";
import Testimonials from "@/components/sections/Testimonials";
import Location from "@/components/sections/Location";
import JoinKalari from "@/components/sections/JoinKalari";
import Footer from "@/components/sections/Footer";

// Client-only components
const SmoothScroll = dynamic(() => import("@/components/ui/SmoothScroll"), { ssr: false });
const ScrollReveal = dynamic(() => import("@/components/ui/ScrollReveal"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), { ssr: false });
const GrainOverlay = dynamic(() => import("@/components/ui/GrainOverlay"), { ssr: false });

export default function HomePage() {
  return (
    <>
      {/* Global overlays */}
      <GrainOverlay />
      <ScrollProgress />

      {/* Smooth scroll wrapper */}
      <SmoothScroll>
        {/* Scroll animation trigger */}
        <ScrollReveal>
          {/* Navigation */}
          <Navigation />

          {/* Page sections — one continuous journey */}
          <main id="main-content">
            {/* 01 — Hero */}
            <Hero />

            {/* 01.5 — Weapons Detail (Inverse Parallax Transition) */}
            <WeaponsDetail />

            {/* 02 — The Kalari */}
            <TheKalari />

            {/* 03 — The Art */}
            <TheArt />

            {/* 04 — The Practice */}
            <ThePractice />

            {/* 05 — The Movement */}
            <TheMovement />

            {/* 06 — Training */}

            {/* 07 — Training */}
            <Training />

            {/* 08 — Philosophy */}
            <Philosophy />

            {/* 09 — Testimonials */}
            <Testimonials />

            {/* 10 — Location */}
            <Location />

            {/* 11 — Join */}
            <JoinKalari />
          </main>

          {/* 12 — Footer */}
          <Footer />
        </ScrollReveal>
      </SmoothScroll>
    </>
  );
}
