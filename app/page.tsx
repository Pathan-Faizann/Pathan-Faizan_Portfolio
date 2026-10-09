"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import CinematicLoader from "@/components/loader/CinematicLoader";
import Navbar from "@/components/layout/Navbar";
import Hero, { HeroHandle } from "@/components/sections/Hero";
import WorksSection from "@/components/sections/WorksSection";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

// Dynamically split below-the-fold components to reduce initial JavaScript payload
const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection"),
);
const Skills = dynamic(() =>
  import("@/components/sections/Skills").then((mod) => mod.Skills),
);
const Expertise = dynamic(() => import("@/components/sections/Expertise"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const { unlockScroll } = useSmoothScroll();

  /**
   * heroTitleRef — points to the <h1> inside HeroTitle.
   * Passed into both CinematicLoader (to measure morph destination)
   * and Hero (so HeroTitle can attach to it via its own forwardRef chain).
   */
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  /**
   * heroRef — lets us call hero.playEntrance() the moment the
   * loader morph completes, kicking off the portrait / subtitle reveal.
   */
  const heroRef = useRef<HeroHandle>(null);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    // Trigger hero entrance animations (portrait, subtitle, scroll indicator)
    // Unlock scrolling only after hero page has completely settled
    let unlocked = false;
    const safeUnlock = () => {
      if (!unlocked) {
        unlocked = true;
        setIsSettled(true);
        unlockScroll();
      }
    };

    if (heroRef.current) {
      heroRef.current.playEntrance(safeUnlock);
    } else {
      safeUnlock();
    }

    // Fallback safety timeout in case entrance animation is interrupted or skipped
    setTimeout(safeUnlock, 2500);
  };

  return (
    <>
      {/* Loader — unmounts after its exit animation finishes */}
      {!loaderDone && (
        <CinematicLoader
          heroTitleRef={heroTitleRef}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* Full page — strictly bounded to 100vh until settled, then expands to full scrollable length */}
      <div
        className={`homepage-content min-h-screen w-full flex flex-col bg-[#050505] ${
          !isSettled ? "h-screen max-h-screen overflow-hidden" : ""
        }`}
      >
        <Navbar />
        <main className="flex-1 w-full">
          <Hero ref={heroRef} titleRef={heroTitleRef} />
          {/* <Philosophy /> */}
          {/*
           * WorksSection replaces both ZoomParallax + SelectedWorks.
           * ONE pinned container, ONE GSAP timeline:
           *   Phase 1 → collage zoom (same as original ZoomParallax)
           *   Phase 2 → horizontal project panels slide over the frozen PROJECTS card
           * Zero section jump. Zero visual cut.
           */}
          <WorksSection />
          {/* Experience — independent section, starts after Selected Works unpins */}
          <ExperienceSection />

          <Skills />
          <Expertise />
        </main>
        <Footer />
      </div>
    </>
  );
}
