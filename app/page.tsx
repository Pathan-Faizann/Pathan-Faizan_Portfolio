"use client";

import React, { useRef, useState } from "react";
import CinematicLoader from "@/components/loader/CinematicLoader";
import Navbar from "@/components/layout/Navbar";
import Hero, { HeroHandle } from "@/components/sections/Hero";
import ZoomParallax from "@/components/zoom-parallax/ZoomParallax";
import Footer from "@/components/layout/Footer";
import Philosophy from "@/components/sections/Philosophy";
import SelectedWorks from "@/components/sections/SelectedWorks";

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
          <ZoomParallax />
          <Philosophy/>
          <SelectedWorks/>
        </main>
        <Footer />
      </div>
    </>
  );
}
