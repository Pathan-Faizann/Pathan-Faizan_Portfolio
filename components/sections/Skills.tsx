"use client";

import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";

const SKILL_CATEGORIES = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    highlight: "UI / UX & Motion",
    skills: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Redux",
      "Tailwind CSS",
      "Bootstrap",
      "Framer Motion",
    ],
  },
  {
    id: "backend",
    number: "02",
    title: "Backend & Database",
    highlight: "APIs & Persistence",
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
      "Figma",
      "Vercel",
      "Render",
      "Postman",
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="w-full bg-[#050505] overflow-x-hidden">
      {/* ── DESKTOP VIEW: 3D Tilt Scroll Animation (Untouched) ── */}
      <div className="hidden md:block">
        <ContainerScroll titleComponent={<></>}>
          <img
            src="/skills.png"
            alt="Skills"
            className="w-full h-full object-cover rounded-2xl"
          />
        </ContainerScroll>
      </div>

      {/* ── MOBILE VIEW: Minimal Dark Premium Skills Stack ── */}
      <div className="block md:hidden w-full px-5! py-16! sm:py-20! max-w-xl! mx-auto!">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-6!">
          <div className="flex items-center gap-2.5! mb-3!">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-[#888888]">
              TECHNICAL ARSENAL
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f5f5f5] leading-none mb-3!">
            SKILLS &amp; STACK
          </h2>
          <p className="text-xs sm:text-sm hidden font-mono text-[#777777] leading-relaxed uppercase tracking-wider">
            Modern technologies, frameworks &amp; developer tools I utilize to craft production-grade digital products.
          </p>
        </div>

        {/* Categories Stack */}
        <div className="space-y-6!">
          {SKILL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative p-6! rounded-2xl! border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md overflow-hidden shadow-2xl"
            >
              {/* Subtle ambient gradient highlight */}
              <div className="absolute top-0 right-0 w-32! h-32! bg-radial from-white/[0.04] to-transparent pointer-events-none" />

              {/* Category Sub-header */}
              <div className="flex items-center justify-between mb-4! border-b border-white/[0.06] pb-3!">
                <span className="text-[11px] font-mono text-[#555555] tracking-widest uppercase">
                  [ {cat.number} ]
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#888888]">
                  {cat.highlight}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#f5f5f5] mb-4!">
                {cat.title}
              </h3>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2! sm:gap-2.5!">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5! py-1.5! text-[11px] font-mono uppercase tracking-wider text-white/80 border border-white/10 rounded-full bg-white/[0.03] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
