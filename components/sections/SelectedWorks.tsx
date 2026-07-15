"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const PROJECTS = [
  {
    id: "aurelia",
    title: "Aurelia Residences",
    category: "Architecture & Design",
    year: "2025",
    role: "Digital Direction",
    image: "/aurelia.png",
  },
  {
    id: "kronos",
    title: "Kronos Horology",
    category: "E-Commerce Suite",
    year: "2025",
    role: "Design & Dev",
    image: "/kronos.png",
  },
  {
    id: "nordic",
    title: "Nordic Editorial",
    category: "Visual Identity",
    year: "2024",
    role: "Frontend Engineering",
    image: "/nordic.png",
  },
];

export default function SelectedWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container || !trigger) return;

    const numPanels = 4; // 1 Intro + 3 Case Studies
    
    // We use a function to return the dynamic scroll amount when refreshing (e.g. window resize)
    const getScrollAmount = () => window.innerWidth * (numPanels - 1);

    const pin = gsap.to(container, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      pin.scrollTrigger?.kill();
      pin.kill();
    };
  }, []);

  return (
    <div ref={triggerRef} id="works" className="relative bg-[#050505] overflow-hidden flex justify-center w-full">
      {/* Scrollable Container */}
      <div ref={containerRef} className="flex h-screen w-fit items-center flex-row">
        
        {/* Intro Slide Panel */}
        <div className="w-[100vw] h-screen flex flex-col justify-center items-center px-6 md:px-16 flex-shrink-0 bg-[#050505] relative">
          <div className="max-w-7xl w-full">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#888888] block mb-4">
              02 / CASE STUDIES
            </span>
            <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-[#f5f5f5]">
              SELECTED <br />
              <span className="text-[#888888]">WORKS.</span>
            </h2>
          </div>
        </div>

        {/* Case Study Panels */}
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            className="w-[100vw] h-screen flex flex-col justify-center items-center px-6 md:px-16 flex-shrink-0 bg-[#050505] relative border-l border-[#111111]/30"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-7xl">
              
              {/* B&W Image with Premium Hover */}
              <div className="lg:col-span-7 overflow-hidden aspect-[16/10] relative group bg-[#0d0d0d] border border-[#1c1c1c]/50">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-[1.5s] ease-premium"
                  priority={index === 0}
                />
              </div>

              {/* Text Description */}
              <div className="lg:col-span-5 flex flex-col justify-between py-6 pl-0 lg:pl-12">
                <div>
                  <span className="text-xs font-mono text-[#888888] uppercase tracking-[0.25em] block mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#f5f5f5] mb-6">
                    {project.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-[#1c1c1c] pt-8 text-xs font-mono uppercase tracking-widest text-[#888888]">
                  <div>
                    <span className="text-[10px] text-[#555555] block mb-1">Services</span>
                    <span className="text-[#f5f5f5]">{project.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555555] block mb-1">Year</span>
                    <span className="text-[#f5f5f5]">{project.year}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
