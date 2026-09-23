"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SKILL_CATEGORIES = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    highlight: "UI / UX & Motion",
    count: "8 Technologies",
    description:
      "Crafting high-performance, fluid user interfaces with modern React ecosystems, responsive design systems, and 60fps animations.",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Redux",
      "Tailwind CSS",
      "JavaScript",
      "Bootstrap",
      "Framer Motion",
    ],
  },
  {
    id: "backend",
    number: "02",
    title: "Backend & Database",
    highlight: "APIs & Persistence",
    count: "7 Technologies",
    description:
      "Architecting scalable server-side systems, RESTful microservices, secure authentication, and robust relational & NoSQL databases.",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "Prisma",
      "JWT",
      "OAuth",
    ],
  },
  {
    id: "tools",
    number: "03",
    title: "Tools & DevOps",
    highlight: "Workflow & Cloud",
   
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "Cursor",
      "Antigravity",
      "Claude Code",
      "Figma",
      "Vercel",
      "Render",
      "Postman",
    ],
  },
];

function SkillCard({
  cat,
  cardRef,
}: {
  cat: (typeof SKILL_CATEGORIES)[0];
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-start p-6! sm:p-8! lg:p-9! rounded-3xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md overflow-hidden! shadow-2xl! transition-all duration-500 hover:border-white/25 hover:shadow-[0_12px_45px_rgba(255,255,255,0.05)] will-change-transform select-none"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          opacity: mousePos.active ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 70%)`,
        }}
      />

      {/* Top ambient corner highlight */}
      <div className="absolute top-0 right-0 w-44! h-44! bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />

      {/* Card Header & Content */}
      <div>
        <div className="flex items-center justify-between pb-4! mb-6! border-b border-white/[0.08]">
          <span className="font-mono text-xs text-[#666666] tracking-widest uppercase">
            [ {cat.number} ]
          </span>
          <span className="px-2.5! py-1! rounded-full text-[10px] font-mono uppercase tracking-widest text-[#888888] bg-white/[0.03] border border-white/[0.08]">
            {cat.highlight}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#f5f5f5] mb-3! group-hover:text-white transition-colors">
          {cat.title}
        </h3>

    
      </div>

      {/* Card Skills Badges */}
      <div>
        <div className="flex items-center justify-between mb-3.5! border-t border-white/[0.06] pt-4!">
         
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3.5!">
          {cat.skills.map((skill) => (
            <span
              key={skill}
              className="relative px-4! py-2.5! text-[12px] sm:text-[14px]! font-mono uppercase tracking-wider text-white/90 rounded-full border border-white/10 border-t-white/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_14px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-default select-none inline-flex items-center"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance animation
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 40, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      // 3 Cards staggered entrance animation
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 75,
            scale: 0.93,
            filter: "blur(12px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-[#050505] text-[#f5f5f5] px-6! py-15! sm:py-28! md:px-12! md:py-36! lg:px-16! lg:py-40! overflow-hidden flex justify-center border-b border-[#111111]"
    >
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Radial soft lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px]! h-[350px]! bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] w-full relative z-10! flex flex-col">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col items-start mb-12! sm:mb-16! md:mb-20!">
          <div className="flex items-center gap-2.5! mb-3.5!">
            <span className="w-1.5! h-1.5! rounded-full bg-white/40 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.28em] text-[#888888]">
              TECHNICAL ARSENAL
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[0.95] mb-4!">
            SKILLS &amp; CAPABILITIES
          </h2>

          <p className="max-w-xl text-xs sm:text-sm font-mono text-[#777777] leading-relaxed uppercase tracking-wider">
            Modern technologies, frameworks &amp; developer tools I utilize to craft production-grade digital products.
          </p>
        </div>

        {/* 3-Cards Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6! sm:gap-8! lg:gap-8! items-stretch">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <SkillCard
              key={cat.id}
              cat={cat}
              cardRef={(el) => {
                cardsRef.current[idx] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
