"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXPERTISES = [
  {
    num: "01",
    title: "Frontend Architecture",
    description:
      "Engineering robust React, Next.js, and TypeScript architectures. Designing scalable codebases with automated testing, optimized state management, and semantic SEO frameworks.",
    skills: ["Next.js (App Router)", "TypeScript", "Performance Tuning", "Scalable APIs"],
  },
  {
    num: "02",
    title: "Motion Design & UI",
    description:
      "Crafting immersive micro-interactions and screen transitions. Bridging the gap between design and development using GSAP, Framer Motion, and custom WebGL scripts.",
    skills: ["GSAP / ScrollTrigger", "Framer Motion", "Interactive Canvas", "Bezier Motion"],
  },
  {
    num: "03",
    title: "Creative Direction",
    description:
      "Defining high-end visual systems, typography-first layouts, and brand assets that position products at the absolute pinnacle of luxury and editorial design.",
    skills: ["Typographic Direction", "Visual Architecture", "Brand Assets", "Creative Guidelines"],
  },
];

export default function Expertise() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0); // Default open first

  return (
    <section className="bg-[#050505] text-[#f5f5f5] px-6 py-28 md:px-16 md:py-48 relative border-b border-[#111111] flex justify-center w-full">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        
        {/* Left column: Tagline & info */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#888888] block mb-2">
              03 / CAPABILITIES
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight uppercase text-[#f5f5f5] mb-6">
              EXPERT SERVICES
            </h3>
            <p className="text-sm font-mono uppercase text-[#888888] tracking-widest leading-relaxed max-w-xs">
              Meticulously building performant solutions for discerning clients.
            </p>
          </div>
          <div className="hidden lg:block h-[1px] w-20 bg-[#222222] mt-12" />
        </div>

        {/* Right column: Interactive list */}
        <div className="lg:col-span-8 flex flex-col">
          {EXPERTISES.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isExpanded = expandedIdx === idx;
            // Dim siblings on hover
            const opacity = hoveredIdx === null ? 1 : isHovered ? 1 : 0.35;

            return (
              <motion.div
                key={item.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                style={{ opacity }}
                className="border-b border-[#1c1c1c] py-8 cursor-pointer first:border-t flex flex-col transition-opacity duration-300 select-none"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className="font-mono text-xs text-[#555555]">
                      {item.num}
                    </span>
                    <h4 className="font-display text-xl md:text-3xl font-black uppercase tracking-tight text-[#f5f5f5]">
                      {item.title}
                    </h4>
                  </div>
                  
                  {/* Expand indicators */}
                  <div className="text-xs font-mono text-[#888888] tracking-widest uppercase">
                    {isExpanded ? "[ CLOSE ]" : "[ DETAILS ]"}
                  </div>
                </div>

                {/* Animated expandable panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden flex flex-col lg:flex-row gap-6 justify-between pl-6 md:pl-14 pr-4"
                    >
                      <p className="text-sm font-sans leading-relaxed text-[#888888] max-w-md">
                        {item.description}
                      </p>
                      
                      {/* Skill bullets */}
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#555555]">
                          Specialties
                        </span>
                        <ul className="flex flex-wrap lg:flex-col gap-x-4 gap-y-1 text-xs font-mono text-[#f5f5f5]">
                          {item.skills.map((skill) => (
                            <li key={skill} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#888888] hidden lg:block" />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
