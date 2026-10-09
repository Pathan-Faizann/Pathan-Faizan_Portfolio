"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

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
      "Mongoose",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltCardRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Physics animation state for buttery smooth damping
  const targetRef = useRef({ rx: 0, ry: 0, scale: 1 });
  const currentRef = useRef({ rx: 0, ry: 0, scale: 1 });
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isLargeScreen = window.innerWidth >= 1024;
      const desktop = isFinePointer && isLargeScreen;
      setIsDesktop(desktop);

      if (!desktop && tiltCardRef.current) {
        tiltCardRef.current.style.transform = "";
      }
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => {
      window.removeEventListener("resize", checkDesktop);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const animate = () => {
    const current = currentRef.current;
    const target = targetRef.current;
    const cardEl = tiltCardRef.current;

    // Organic inertia / damping factor (0.085 for buttery luxury ease)
    const ease = 0.085;
    current.rx += (target.rx - current.rx) * ease;
    current.ry += (target.ry - current.ry) * ease;
    current.scale += (target.scale - current.scale) * ease;

    if (cardEl) {
      cardEl.style.transform = `rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale3d(${current.scale.toFixed(3)}, ${current.scale.toFixed(3)}, ${current.scale.toFixed(3)})`;
    }

    const deltaX = Math.abs(target.rx - current.rx);
    const deltaY = Math.abs(target.ry - current.ry);
    const deltaS = Math.abs(target.scale - current.scale);

    // Keep animating until rest position is reached
    if (deltaX > 0.01 || deltaY > 0.01 || deltaS > 0.001) {
      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      current.rx = target.rx;
      current.ry = target.ry;
      current.scale = target.scale;
      if (cardEl) {
        if (target.rx === 0 && target.ry === 0 && target.scale === 1) {
          cardEl.style.transform = "";
        } else {
          cardEl.style.transform = `rotateX(${target.rx.toFixed(2)}deg) rotateY(${target.ry.toFixed(2)}deg) scale3d(${target.scale.toFixed(3)}, ${target.scale.toFixed(3)}, ${target.scale.toFixed(3)})`;
        }
      }
      rafIdRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Normalized coordinates (-0.5 to 0.5)
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    // Subtle 11deg max tilt for sophisticated Awwwards feel
    const maxTilt = 11;
    targetRef.current.rx = -normY * maxTilt;
    targetRef.current.ry = normX * maxTilt;
    targetRef.current.scale = 1.025;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !containerRef.current) return;
    setIsHovered(true);

    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    targetRef.current.scale = 1.025;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsHovered(false);

    // Smoothly return to rest position
    targetRef.current.rx = 0;
    targetRef.current.ry = 0;
    targetRef.current.scale = 1;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        cardRef(el);
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full [perspective:1200px]"
    >
      {/* Outer ambient glow halo behind the card on hover (Desktop) */}
      <div
        className={`pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-2xl transition-opacity duration-500 ${isHovered && isDesktop ? "opacity-80" : "opacity-0"
          }`}
        style={{ transform: "translateZ(0)" }}
      />

      {/* The 3D Tilt Card */}
      <div
        ref={tiltCardRef}
        className="relative flex flex-col justify-start h-full p-6! sm:p-8! lg:p-9! rounded-3xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md select-none transition-colors duration-500 hover:border-white/30 will-change-transform [transform-style:preserve-3d]"
        style={{
          boxShadow:
            isHovered && isDesktop
              ? "0 28px 65px -12px rgba(0,0,0,0.85), 0 0 35px 2px rgba(255,255,255,0.08), inset 0 1px 1px 0 rgba(255,255,255,0.22)"
              : "0 10px 30px -10px rgba(0,0,0,0.5)",
        }}
      >
        {/* Rounded clipping mask for interactive spotlight & ambient corner glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Enhanced Interactive Cursor Spotlight Glow */}
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: isHovered && isDesktop ? 1 : 0,
              background: `radial-gradient(520px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.015) 60%, transparent 80%)`,
            }}
          />

          {/* Top ambient corner highlight (enhanced glow) */}
          <div className="absolute top-0 right-0 w-48! h-48! bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
        </div>

        {/* Card Header & Content (Subtle 3D layer depth) */}
        <div
          style={{
            transform: isDesktop ? "translateZ(18px)" : "none",
            transformStyle: "preserve-3d",
          }}
        >
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

        {/* Card Skills Badges (Layered 3D depth, original pills hover effect fully preserved) */}
        <div
          style={{
            transform: isDesktop ? "translateZ(26px)" : "none",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex items-center justify-between mb-3.5! border-t border-white/[0.06] pt-4!"></div>

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
      // Header entrance animation (hardware-accelerated GPU transform)
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }

      // 3 Cards staggered entrance animation (pure GPU transform, zero raster blur stalls)
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out",
            force3D: true,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-[#050505] text-[#f5f5f5] px-6! py-28! sm:py-28! md:px-12! md:py-36! lg:px-16! lg:py-55! overflow-hidden flex justify-center border-b border-[#111111]"
    >
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Radial soft lighting (GPU composite layer) */}
      <div
        className="absolute top-1/2 left-1/2 w-[700px]! h-[350px]! bg-white/[0.015] rounded-full blur-[140px] pointer-events-none"
        style={{ transform: "translate3d(-50%, -50%, 0)", willChange: "transform" }}
      />

      <div className="max-w-[1400px] w-full relative z-10! flex flex-col">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-start mb-12! sm:mb-16! md:mb-20!"
        >
          {/* <div className="flex items-center gap-2.5! mb-3.5!">
            <span className="w-1.5! h-1.5! rounded-full bg-white/40 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.28em] text-[#888888]">
              TECHNICAL ARSENAL
            </span>
          </div> */}

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[0.95] mb-4!">
            SKILLS &amp; CAPABILITIES
          </h2>

          <p className="max-w-xl text-xs sm:text-sm font-mono text-[#777777] leading-relaxed uppercase tracking-wider">
            Modern technologies, frameworks &amp; developer tools I utilize to
            craft production-grade digital products.
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
