"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "@/lib/gsap";
import HeroTitle from "./HeroTitle";
import {
  EASE_PORTRAIT,
  EASE_SUBTITLE,
  PORTRAIT_DURATION,
  SUBTITLE_DURATION,
  SCROLL_INDICATOR_DURATION,
  HERO_ENTRANCE_DELAY,
} from "@/animations/constants";

export interface HeroHandle {
  /** Call this after the loader morph completes to kick off the hero entrance. */
  playEntrance: () => void;
}

interface HeroProps {
  /** Ref to the hero title — consumed by the loader for FLIP math */
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}

/**
 * Hero section.
 *
 * The title is rendered via <HeroTitle> which starts with visibility:hidden.
 * The loader morph "arrives" at the title, then calls heroHandle.playEntrance()
 * which: reveals the title + fades in portrait, subtitle, scroll indicator.
 */
const Hero = forwardRef<HeroHandle, HeroProps>(function Hero(
  { titleRef },
  ref
) {
  const subTextRef        = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const portraitRef       = useRef<HTMLDivElement>(null);

  // Expose playEntrance() to parent
  useImperativeHandle(ref, () => ({
    playEntrance() {
      const tl = gsap.timeline({ delay: HERO_ENTRANCE_DELAY });

      // Portrait reveals: opacity + blur → crisp, tiny upward float
      tl.fromTo(
        portraitRef.current,
        {
          opacity: 0,
          filter: "blur(14px) grayscale(100%) brightness(0.8)",
          y: 28,
          scale: 0.97,
        },
        {
          opacity: 1,
          filter: "blur(0px) grayscale(100%) brightness(0.94)",
          y: 0,
          scale: 1,
          duration: PORTRAIT_DURATION,
          ease: EASE_PORTRAIT,
        },
        0
      );

      // Subtitle fades in gently after portrait is mostly revealed
      tl.fromTo(
        subTextRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 0.6,
          y: 0,
          duration: SUBTITLE_DURATION,
          ease: EASE_SUBTITLE,
        },
        PORTRAIT_DURATION * 0.55
      );

      // Scroll indicator is last
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        {
          opacity: 0.4,
          duration: SCROLL_INDICATOR_DURATION,
          ease: "power2.out",
        },
        PORTRAIT_DURATION * 0.8
      );
    },
  }));

  // Set initial states on mount (portrait hidden until playEntrance)
  useEffect(() => {
    gsap.set(portraitRef.current, {
      opacity: 0,
      filter: "blur(14px) grayscale(100%) brightness(0.8)",
      y: 28,
      scale: 0.97,
    });
    gsap.set(subTextRef.current,        { opacity: 0, y: 16 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 py-24 md:px-16 md:py-32 bg-[#050505] overflow-hidden items-center justify-center">
      {/* Editorial Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Circular Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,#050505_100%)] opacity-90" />

      {/* Spacer */}
      <div className="h-4 md:h-8" />

      {/* Main Column Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 my-auto">

        {/* Left Column: Title + Subtitle */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start select-none">
          {/*
           * HeroTitle receives the ref so the loader can read its rect.
           * It renders PATHAN / FAIZAN with visibility:hidden initially.
           * The loader morph arrives here, then visibility → visible.
           */}
          <HeroTitle ref={titleRef} />

          {/* Sub-title label lines (FULL STACK / DEVELOPER) */}
          <div className="flex flex-col font-display text-center font-bold tracking-tighter ml-16! uppercase leading-[0.85] mt-2! select-none">
            <span className="block text-3xl sm:text-5xl pl-10 md:text-6xl lg:text-[4.5vw] text-[#666666]">
              FULL STACK
            </span>
            <span className="block text-3xl sm:text-5xl ml-10 md:text-6xl lg:text-[4.5vw] text-[#666666] mb-4">
              DEVELOPER
            </span>
          </div>

          {/* Subtitle paragraph */}
          <div
            ref={subTextRef}
            className="max-w-md text-xs sm:text-sm text-[#888888] ml-12! font-mono text-center leading-relaxed uppercase tracking-wider mt-10 pl-1 border-l border-[#222222]"
          >
            <p>
              Building elegant digital experiences through thoughtful
              engineering, motion design and modern web technologies.
            </p>
          </div>
        </div>

        {/* Right Column: Portrait */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          {/* Studio spotlight glow */}
          <div className="absolute top-[10%] left-[50%] -translate-x-[50%] w-[80%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

          <div
            ref={portraitRef}
            className="relative w-full max-w-[340px] aspect-[4/5] sm:max-w-[380px] lg:max-w-full overflow-hidden z-10 will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/my.jpeg"
              alt="Faizan Pathan Portrait"
              className="w-full h-full object-cover filter grayscale contrast-[1.14] brightness-[0.92] select-none pointer-events-none"
              style={{
                maskImage:
                  "radial-gradient(circle at 50% 35%, black 25%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 35%, black 25%, transparent 75%)",
              }}
            />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,transparent_35%,#050505_85%)] opacity-70" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="max-w-7xl w-full flex justify-end items-end relative z-10 pl-1 mt-8 lg:mt-0">
        <div
          ref={scrollIndicatorRef}
          className="flex items-center gap-4 text-[#444444]"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-mono">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#222222] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-[#888888] animate-[slow-scroll-line_3s_infinite_cubic-bezier(0.76,0,0.24,1)]" />
          </div>
        </div>
      </div>

      {/* Scroll line keyframe */}
      <style jsx global>{`
        @keyframes slow-scroll-line {
          0%        { transform: translateY(-100%); }
          70%, 100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
});

export default Hero;
