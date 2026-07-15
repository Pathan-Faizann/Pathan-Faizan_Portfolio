"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    const headerElement = headerRef.current;
    if (!textElement || !headerElement) return;

    // Word reveal on scroll using GSAP ScrollTrigger
    // Splits text into spans (conceptually, or just animates lines/blocks)
    const words = textElement.innerText.split(" ");
    textElement.innerHTML = words
      .map((word) => `<span class="inline-block overflow-hidden"><span class="reveal-word inline-block">${word}&nbsp;</span></span>`)
      .join("");

    const wordSpans = textElement.querySelectorAll(".reveal-word");

    gsap.set(wordSpans, { yPercent: 100 });
    gsap.set(headerElement, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play none none none",
      },
    });

    tl.to(headerElement, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power2.out",
    });

    tl.to(
      wordSpans,
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.015,
        ease: "power2.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="bg-[#0d0d0d] text-[#f5f5f5] px-6 py-28 md:px-16 md:py-48 flex justify-center items-center min-h-[80vh] relative border-t border-b border-[#111111]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Left Side: Number & Header */}
        <div ref={headerRef} className="lg:col-span-4 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#888888] block mb-2">
              01 / PHILOSOPHY
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight uppercase text-[#f5f5f5]">
              THE ART OF REDUCTION
            </h3>
          </div>
          <div className="hidden lg:block h-[1px] w-20 bg-[#222222] mt-12" />
        </div>

        {/* Right Side: Philosophy Statement */}
        <div className="lg:col-span-8">
          <p
            ref={textRef}
            className="font-sans text-xl md:text-3xl lg:text-4xl font-normal leading-relaxed tracking-tight text-[#f5f5f5] max-w-4xl"
          >
            We believe that luxury is the complete absence of noise. Every line of code,
            every pixel, and every transition must serve an intentional purpose. In a
            world of fleeting visual clutter, we stand for cinematic quietude, premium craftsmanship,
            and software built to leave a lasting impression.
          </p>
        </div>
      </div>
    </section>
  );
}
