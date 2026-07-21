"use client";

import React, { useRef, useState } from "react";
import CinematicLoader from "@/components/loader/CinematicLoader";
import Navbar from "@/components/layout/Navbar";
import Hero, { HeroHandle } from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
// import Philosophy from "@/components/sections/Philosophy";
import WorksSection from "@/components/sections/WorksSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Expertise from "@/components/sections/Expertise";
import JourneyOrb from "@/components/sections/JourneyOrb";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

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
    heroRef.current?.playEntrance();
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

      {/* Full page — always mounted so layout is stable for FLIP measurement */}
      <div className="homepage-content min-h-screen w-full flex flex-col bg-[#050505]">
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
          {/* <JourneyOrb /> */}
          <Skills />
          <Expertise />
        </main>
        <Footer />
      </div>
    </>
  );
}
