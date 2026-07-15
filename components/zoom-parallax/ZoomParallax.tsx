"use client";

import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import { useParallaxAnimation } from "./useParallaxAnimation";
import { CollageLayout } from "./CollageLayout";

export default function ZoomParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the 300vh scrollable track container.
  // "start start": sticky animation begins as soon as the top of the container hits the top of the viewport.
  // "end end": sticky animation releases when the bottom of the container hits the bottom of the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const animations = useParallaxAnimation(scrollYProgress);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] w-full bg-[#050505] z-10"
      id="zoom-collage"
    >
      {/* 
        Sticky Viewport Pinner.
        Uses high-performance native CSS position: sticky to lock the screen.
        This completely avoids scroll fighting, works natively with Lenis smooth scroll,
        and is responsive to resize events without jitter.
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
        
        {/* Subtle background grid matching the Hero grid to keep design theme unified */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25 pointer-events-none z-0" />

        {/* Circular vignette overlay for dramatic depth */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,#050505_100%)] opacity-90 z-0" />

        {/* The 7-image collage grid layout and typography layers */}
        <CollageLayout
          animations={animations}
          scrollYProgress={scrollYProgress}
        />
      </div>
    </section>
  );
}
