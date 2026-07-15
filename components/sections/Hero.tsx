"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Hero() {
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const subTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !lineRefs.current.includes(el)) {
      lineRefs.current.push(el);
    }
  };

  useEffect(() => {
    lineRefs.current = lineRefs.current.filter(Boolean);

    // Initial state: hidden
    gsap.set(lineRefs.current, { yPercent: 100 });
    gsap.set(subTextRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });
    gsap.set(portraitRef.current, { 
      opacity: 0, 
      filter: "blur(12px) grayscale(100%)", 
      y: 35 
    });

    // Timeline for hero entrance
    // Delay: starts at 3.6s (coinciding with loader curtain rise)
    const tl = gsap.timeline({ delay: 3.6 });

    // 1. Text reveals
    tl.to(lineRefs.current, {
      yPercent: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: "premium-ease",
    });

    // 2. Portrait fades in (delayed slightly after text starts)
    tl.to(
      portraitRef.current,
      {
        opacity: 1,
        filter: "blur(0px) grayscale(100%)",
        y: 0,
        duration: 1.6,
        ease: "premium-ease",
      },
      "-=1.1"
    );

    // 3. Subtext fade
    tl.to(
      subTextRef.current,
      {
        opacity: 0.6,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      },
      "-=0.9"
    );

    // 4. Scroll indicator reveal
    tl.to(
      scrollIndicatorRef.current,
      {
        opacity: 0.4,
        duration: 1.0,
        ease: "power2.out",
      },
      "-=0.7"
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between px-6 py-24 md:px-16 md:py-32 bg-[#050505] overflow-hidden flex-center justify-center items-center">
      {/* Subtle Editorial Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Subtle Circular Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,#050505_100%)] opacity-90" />

      {/* Spacer */}
      <div className="h-4 md:h-8" />

      {/* Main Column Grid Wrapper */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 my-auto">
        
        {/* Left Column: Typographic stack & Subtitle (55%) */}
        <div className="lg:col-span-7 flex flex-col justify-center select-none text-left">
          <h1 className="flex flex-col font-display tracking-tighter uppercase leading-[0.85]">
            <span className="block overflow-hidden h-fit py-1">
              <span ref={addToRefs} className="block font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vw] text-[#f5f5f5]">
                PATHAN
              </span>
            </span>
            <span className="block overflow-hidden h-fit py-1">
              <span ref={addToRefs} className="block font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vw] text-[#f5f5f5] mb-4">
                FAIZAN
              </span>
            </span>
            
            <span className="block overflow-hidden h-fit py-1">
              <span ref={addToRefs} className="block font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[4.5vw] text-[#666666]">
                FULL STACK
              </span>
            </span>
            <span className="block overflow-hidden h-fit py-1">
              <span ref={addToRefs} className="block font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[4.5vw] text-[#666666]">
                DEVELOPER
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <div
            ref={subTextRef}
            className="max-w-md text-xs sm:text-sm text-[#888888] font-mono leading-relaxed uppercase tracking-wider mt-12 pl-1 border-l border-[#222222]"
          >
            <p>
              Building elegant digital experiences through thoughtful engineering, 
              motion design and modern web technologies.
            </p>
          </div>
        </div>

        {/* Right Column: Monochrome Blended Portrait (45%) */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          
          {/* Circular top spotlight ( luxury fashion fashion mood ) */}
          <div className="absolute top-[10%] left-[50%] -translate-x-[50%] w-[80%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
          
          <div
            ref={portraitRef}
            className="relative w-full max-w-[340px] aspect-[4/5] sm:max-w-[380px] lg:max-w-full overflow-hidden z-10"
          >
            {/* Blended Portrait */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/my.jpeg"
              alt="Faizan Pathan Portrait"
              className="w-full h-full object-cover filter grayscale contrast-[1.14] brightness-[0.92] select-none pointer-events-none"
              style={{
                maskImage: "radial-gradient(circle at 50% 35%, black 25%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 25%, transparent 75%)",
              }}
            />
            {/* Shadow gradients to bleed edges seamlessly into #050505 */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,transparent_35%,#050505_85%)] opacity-70" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          </div>
        </div>

      </div>

      {/* Bottom Scroll Down Element */}
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

      {/* Embedded slow line animation CSS */}
      <style jsx global>{`
        @keyframes slow-scroll-line {
          0% {
            transform: translateY(-100%);
          }
          70%, 100% {
            transform: translateY(300%);
          }
        }
      `}</style>
    </section>
  );
}
