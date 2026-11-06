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
  const spotlightRef = useRef<HTMLDivElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);

  const isDesktopRef = useRef(false);

  // Physics animation state for buttery smooth damping
  const targetRef = useRef({ rx: 0, ry: 0, scale: 1 });
  const currentRef = useRef({ rx: 0, ry: 0, scale: 1 });
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isLargeScreen = window.innerWidth >= 1024;
      const desktop = isFinePointer && isLargeScreen;
      isDesktopRef.current = desktop;

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
    if (!isDesktopRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM update for cursor spotlight glow - ZERO React re-renders during scroll/hover
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(520px circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.015) 60%, transparent 80%)`;
    }

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
    if (!isDesktopRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "1";
      spotlightRef.current.style.background = `radial-gradient(520px circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.015) 60%, transparent 80%)`;
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.style.opacity = "0.8";
    }

    targetRef.current.scale = 1.025;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktopRef.current) return;

    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.style.opacity = "0";
    }

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
        ref={outerGlowRef}
        className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-2xl transition-opacity duration-500 opacity-0"
        style={{ transform: "translateZ(0)" }}
      />

      {/* The 3D Tilt Card */}
      <div
        ref={tiltCardRef}
        className="relative flex flex-col justify-start h-full p-6! sm:p-8! lg:p-9! rounded-3xl border border-white/10 bg-[#0a0a0a]/95 select-none transition-colors duration-500 hover:border-white/30 will-change-transform [transform-style:preserve-3d] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_28px_65px_-12px_rgba(0,0,0,0.85),0_0_35px_2px_rgba(255,255,255,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.22)]"
      >
        {/* Rounded clipping mask for interactive spotlight & ambient corner glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Enhanced Interactive Cursor Spotlight Glow */}
          <div
            ref={spotlightRef}
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none opacity-0"
          />

          {/* Top ambient corner highlight (enhanced glow) */}
          <div className="absolute top-0 right-0 w-48! h-48! bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
        </div>

        {/* Card Header & Content (Subtle 3D layer depth) */}
        <div
          className="lg:[transform:translateZ(18px)] lg:[transform-style:preserve-3d]"
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

        {/* Card Skills Badges (Layered 3D depth, original pills hover effect fully preserved without lag) */}
        <div
          className="lg:[transform:translateZ(26px)] lg:[transform-style:preserve-3d]"
        >
          <div className="flex items-center justify-between mb-3.5! border-t border-white/[0.06] pt-4!"></div>

          <div className="flex flex-wrap gap-2 sm:gap-3.5!">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="relative px-4! py-2.5! text-[12px] sm:text-[14px]! font-mono uppercase tracking-wider text-white/90 rounded-full border border-white/10 border-t-white/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_14px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-default select-none inline-flex items-center"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const stickyWrapper = stickyWrapperRef.current;
    const mobileTrack = mobileTrackRef.current;
    const header = headerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile && stickyWrapper && mobileTrack) {
        // Compute total scroll distance for horizontal translation
        const getScrollDistance = () =>
          mobileTrack.scrollWidth - window.innerWidth + 48; // 48px to allow generous right padding / reveal

        // GSAP ScrollTrigger for pinned mobile horizontal scroll
        gsap.to(mobileTrack, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: stickyWrapper,
            start: "top top",
            end: () => `+=${getScrollDistance() * 1.5}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                SKILL_CATEGORIES.length - 1,
                Math.floor(progress * SKILL_CATEGORIES.length + 0.15)
              );
              setActiveMobileIdx(idx);
            },
          },
        });
      } else {
        // Desktop animations (100% untouched original behaviour)
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
                trigger: container,
                start: "top 82%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }

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
                trigger: container,
                start: "top 78%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative w-full bg-[#050505] text-[#f5f5f5] border-b border-[#111111]"
    >
      {/* 
        Sticky Wrapper:
        - Mobile: `h-screen sticky top-0 flex flex-col justify-center overflow-hidden py-6 px-6`
        - Desktop: `static h-auto px-6 pt-28 pb-10 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-55 overflow-hidden flex justify-center`
      */}
      <div
        ref={stickyWrapperRef}
        className="w-full relative flex flex-col justify-center lg:block overflow-hidden px-6! py-6! sm:px-10! sm:py-10! lg:px-16! lg:pt-28! lg:pb-55! min-h-screen lg:min-h-0"
      >
        {/* Ambient Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Radial soft lighting (GPU composite layer) */}
        <div
          className="absolute top-1/2 left-1/2 w-[700px]! h-[350px]! bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.035),transparent_70%)] pointer-events-none"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        />

        <div className="max-w-[1400px] w-full mx-auto relative z-10! flex flex-col">
          {/* Section Header */}
          <div
            ref={headerRef}
            className="flex flex-col items-start mb-6! sm:mb-10! lg:mb-20!"
          >
            {/* Mobile index badge */}
            <div className="flex lg:hidden items-center justify-between w-full mb-2!">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] flex items-center gap-5">
                {/* <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse inline-block" /> */}
                TECHNICAL ARSENAL [0{activeMobileIdx + 1} / 0{SKILL_CATEGORIES.length}]
              </span>
              {/* <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777777]">
                {SKILL_CATEGORIES[activeMobileIdx].highlight}
              </span> */}
            </div>

            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[0.95] mb-2! sm:mb-6!">
              SKILLS &amp; CAPABILITIES
            </h2>

            <p className="max-w-xl text-[11px] sm:text-xs md:text-sm font-mono text-[#777777] leading-relaxed uppercase tracking-wider line-clamp-2 sm:line-clamp-none">
              Modern technologies, frameworks &amp; developer tools I utilize to
              craft production-grade digital products.
            </p>
          </div>

          {/* 
            Desktop View: Original 3-column static grid, untouched.
          */}
          <div className="hidden lg:grid grid-cols-3 gap-8! items-stretch">
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

          {/* 
            Mobile View: Sticky horizontal track driven by vertical scroll.
          */}
          <div className="lg:hidden w-full overflow-visible">
            <div
              ref={mobileTrackRef}
              className="flex items-stretch gap-4 sm:gap-6 w-max will-change-transform"
            >
              {SKILL_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="w-[84vw] max-w-[340px] sm:w-[380px] shrink-0"
                >
                  <SkillCard cat={cat} cardRef={() => {}} />
                </div>
              ))}
            </div>

            {/* Mobile Indicator Bar */}
            <div className="flex items-center gap-2 pt-4! mt-2! border-t border-white/[0.06]">
              {SKILL_CATEGORIES.map((cat, idx) => {
                const isActive = activeMobileIdx === idx;
                return (
                  <div
                    key={cat.id}
                    className={`transition-all duration-300 rounded-full h-1 ${
                      isActive
                        ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        : "w-2 bg-white/20"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
