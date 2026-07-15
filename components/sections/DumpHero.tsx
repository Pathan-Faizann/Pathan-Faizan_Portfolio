"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function DumpHero() {
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const subTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !lineRefs.current.includes(el)) {
      lineRefs.current.push(el);
    }
  };

  useEffect(() => {
    lineRefs.current = lineRefs.current.filter(Boolean);

    gsap.set(lineRefs.current, { yPercent: 100 });
    gsap.set(subTextRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({ delay: 3.6 });

    tl.to(lineRefs.current, {
      yPercent: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: "premium-ease",
    });

    tl.to(
      subTextRef.current,
      {
        opacity: 0.6,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      },
      "-=0.8"
    );

    tl.to(
      scrollIndicatorRef.current,
      {
        opacity: 0.4,
        duration: 1.0,
        ease: "power2.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col justify-between px-6 py-24 md:px-16 md:py-32 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <h1 className="font-display text-5xl sm:text-7xl md:text-[9vw] lg:text-[10vw] font-black leading-[0.9] tracking-tighter uppercase select-none flex flex-col">
          <span className="block overflow-hidden h-fit py-2">
            <span ref={addToRefs} className="block origin-bottom">
              CRAFTING
            </span>
          </span>
          <span className="block overflow-hidden h-fit py-2 text-[#888888]">
            <span ref={addToRefs} className="block origin-bottom">
              DIGITAL
            </span>
          </span>
          <span className="block overflow-hidden h-fit py-2">
            <span ref={addToRefs} className="block origin-bottom">
              ELEGANCE.
            </span>
          </span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 relative z-10">
        <div
          ref={subTextRef}
          className="max-w-md text-xs sm:text-sm text-[#888888] font-mono leading-relaxed uppercase tracking-wider"
        >
          <p>
            An award-winning playground dedicated to building exceptional, 
            motion-centered digital products that breathe craftsmanship and detail.
          </p>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="flex items-center gap-4 text-[#888888]"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono animate-pulse">
            Scroll down
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#888888] to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#f5f5f5] animate-[scroll-dot_2s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scroll-dot {
          0% {
            transform: translateY(-100%);
          }
          80%, 100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </section>
  );
}
