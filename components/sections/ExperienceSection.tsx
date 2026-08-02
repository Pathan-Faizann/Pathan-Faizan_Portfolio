"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface ExperienceItem {
  number: string;
  company: string;
  location: string;
  role: string;
  duration: string;
  description: string;
  img: string;
  tags: string[];
}

const experiences: ExperienceItem[] = [
  {
    number: "01",
    company: "INAI Worlds Pvt. Ltd.",
    location: "Surat, Gujarat",
    role: "MERN Stack Developer Intern",
    duration: "3 Months",
    description:
      "Worked on production-ready frontend pages and backend REST APIs while collaborating with the development team. Contributed to real-world application features, API integration, database operations, debugging, and continuous improvements across the MERN stack.",
    img: "/company_inai.png",
    tags: ["MERN", "REST APIs", "MongoDB", "Express", "Team Collaboration"],
  },
  {
    number: "02",
    company: "Parashift Technologies",
    location: "Jogeshwari, Mumbai",
    role: "Frontend Developer",
    duration: " 3 months, Current",
    description:
      "Building modern user interfaces using Next.js, TypeScript, Tailwind CSS, and Framer Motion. Focused on responsive layouts, reusable component architecture, smooth animations, and delivering polished user experiences for production applications.",
    img: "/PSLogo.svg",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive UI",
    ],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Clip-path peel transition on scroll
      mm.add("(min-width: 1024px)", () => {
        const total = experiences.length;
        if (total < 2) return;

        // Set initial clip paths and z-indexes for image layers
        imageWrapperRefs.current.forEach((wrapper, idx) => {
          if (!wrapper) return;
          gsap.set(wrapper, {
            clipPath: "inset(0% 0% 0% 0%)",
            zIndex: total - idx,
          });
        });

        // Scrub clip-path reveal when scrolling from item 0 to item 1
        for (let i = 0; i < total - 1; i++) {
          const nextLeft = leftItemRefs.current[i + 1];
          const currentWrapper = imageWrapperRefs.current[i];

          if (!nextLeft || !currentWrapper) continue;

          gsap.to(currentWrapper, {
            clipPath: "inset(0% 0% 100% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: nextLeft,
              start: "top 60%",
              end: "top 40%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full bg-[#050505] text-white py-24 select-none flex flex-col items-center justify-center"
    >
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1500px] w-full mx-auto px-6 md:px-1 relative z-10 flex flex-col items-center">
        {/* SECTION HEADER - Centered */}
        <div className="flex flex-col items-center text-start max-w-8xl mx-auto pb-16 mb-16 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
              [ EXPERIENCE ]
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-[1.08]">
            Industry Experience
          </h2>

         
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="w-full lg:mt-42! grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative">
          {/* LEFT COLUMN: EDITORIAL CONTENT BLOCKS */}
          <div className="lg:col-span-6 flex flex-col">
            {experiences.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  leftItemRefs.current[index] = el;
                }}
                className={`min-h-[60vh] ${index==1?"justify-end":"justify-start"} flex flex-col gap-y-3 py-16 border-b border-white/5 lg:border-none`}
              >
                {/* Index Number */}
                {/* <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase mb-4 block">
                  {item.number} / {experiences.length < 10 ? `0${experiences.length}` : experiences.length}
                </span> */}

                {/* Company Name */}
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-3 leading-snug">
                  {item.company}
                </h3>

                {/* Role */}
                <p className="text-lg sm:text-xl font-medium text-white/80 mb-6">
                  {item.role}
                </p>

                {/* Meta Bar */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs uppercase tracking-widest text-white/40 mb-6 border-y border-white/10 py-3.5 max-w-xl">
                  <span>{item.location}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span>{item.duration}</span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/60 leading-relaxed font-light max-w-xl mb-8">
                  {item.description}
                </p>

                {/* Tags / Chips */}
                <div className="flex flex-wrap gap-2.5 max-w-xl">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-mono text-white/70 border border-white/15 rounded-full bg-white/[0.02] backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* MOBILE ONLY INLINE IMAGE */}
                <div className="mt-8 lg:hidden w-full aspect-[14/10] max-w-[460px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/60 shadow-2xl relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={`${item.company} screenshot`}
                    className="w-full h-full object-cover grayscale contrast-[1.05] brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: STICKY PINNED IMAGE STACK */}
          <div className="hidden lg:flex lg:col-span-6 justify-center items-center sticky top-[calc(50vh-164px)] self-start my-auto py-4">
            <div className="w-full max-w-[460px] aspect-[14/10] rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/40 shadow-2xl backdrop-blur-sm relative">
              {experiences.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    imageWrapperRefs.current[index] = el;
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden will-change-[clip-path]"
                >
                  {/* Static Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={`${item.company} screenshot`}
                    className={`w-full ${index==1?"object-contain":"object-cover"} h-full grayscale contrast-[1.05] brightness-[0.9] hover:grayscale-0 transition-all duration-700`}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
