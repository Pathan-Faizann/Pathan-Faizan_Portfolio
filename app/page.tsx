"use client";

import React, { useState } from "react";
import CinematicLoader from "@/components/loader/CinematicLoader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ZoomParallax from "@/components/zoom-parallax/ZoomParallax";
import Philosophy from "@/components/sections/Philosophy";
import SelectedWorks from "@/components/sections/SelectedWorks";
import Expertise from "@/components/sections/Expertise";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [isLoaderActive, setIsLoaderActive] = useState(true);

  return (
    <>
      {/* Cinematic Loading Overlay */}
      {isLoaderActive && (
        <CinematicLoader onComplete={() => setIsLoaderActive(false)} />
      )}

      {/* Main Homepage Container */}
      <div
        className="homepage-content min-h-screen w-full flex flex-col bg-[#050505]"
        style={isLoaderActive ? { filter: "blur(10px)" } : undefined}
      >
        <Navbar />
        <main className="flex-1 w-full">
          <Hero />
          <ZoomParallax />
     
          {/* <Philosophy />
          <SelectedWorks />
          <Expertise /> */}
        </main>
        <Footer />
      </div>
    </>
  );
}

