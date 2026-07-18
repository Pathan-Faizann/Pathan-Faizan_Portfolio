"use client";

/**
 * ExperienceSection
 * ─────────────────────────────────────────────────────────────────────────────
 * A premium editorial experience section that appears AFTER the Selected Works
 * horizontal scroll (WorksSection) finishes and the section unpins naturally.
 *
 * Architecture:
 *   • Fully independent from WorksSection — no shared refs, no shared triggers.
 *   • Creates its OWN GSAP ScrollTrigger scoped entirely to this section's wrapper.
 *   • 70% left (experience cards) / 30% right (journey indicator) grid.
 *   • The journey indicator SVG draws a dashed vertical curve as the user scrolls.
 *   • The matte white sphere follows the path with a 15% lag (inertia feel).
 *   • Everything is scrub-driven — reversible by scrolling up.
 *   • All animations use transforms + opacity only. Zero layout thrashing.
 */

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Experience data ──────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    id: "exp-01",
    index: "01",
    company: "INAI Worlds Pvt Ltd",
    role: "MERN Stack Developer Intern",
    duration: "3 Months",
    stack: ["MongoDB", "Express.js", "React", "Node.js"],
    responsibilities: [
      "Frontend Pages",
      "REST APIs",
      "Backend Development",
      "API Integration",
    ],
    image: "/company_inai.png",
    imageAlt: "INAI Worlds — Technology Studio",
  },
  {
    id: "exp-02",
    index: "02",
    company: "Frontend Developer Intern",
    role: "UI Engineering",
    duration: "Ongoing",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    responsibilities: [
      "Modern UI Development",
      "Component Architecture",
      "Responsive Interfaces",
      "Performance Optimisation",
    ],
    image: "/company_frontend.png",
    imageAlt: "Frontend Engineering — Architectural UI",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const pathRef      = useRef<SVGPathElement>(null);
  const sphereRef    = useRef<SVGGElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const cardsRef     = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pathEl  = pathRef.current;
    const sphereEl = sphereRef.current;
    const labelEl  = labelRef.current;
    const cards    = cardsRef.current;
    const header   = headerRef.current;

    if (!section || !pathEl || !sphereEl || !labelEl || !cards || !header) return;

    // ── Measure path ──────────────────────────────────────────────────────────
    const pathLength = pathEl.getTotalLength();
    if (pathLength === 0) return;

    // ── Proxy for sphere path progress ────────────────────────────────────────
    // The draw head leads; the sphere trails by LAG (15% of path length).
    const LAG = 0.15;
    const proxy = { draw: 0 };

    /**
     * Positions the sphere group at a normalised [0..1] fraction along the path.
     * clamps to [0,1] to prevent overshooting either end.
     */
    const positionSphere = (t: number) => {
      const c  = Math.min(1, Math.max(0, t));
      const pt = pathEl.getPointAtLength(c * pathLength);
      gsap.set(sphereEl, {
        x:        pt.x,
        y:        pt.y,
        xPercent: -50,
        yPercent: -50,
        force3D:  true,
      });
    };

    // ── Initial states ────────────────────────────────────────────────────────
    gsap.set(pathEl, {
      attr: {
        strokeDasharray:  String(pathLength),
        strokeDashoffset: String(pathLength),
      },
    });
    gsap.set(sphereEl, {
      opacity:  0,
      scale:    0.88,
      force3D:  true,
    });
    gsap.set(labelEl, { opacity: 0, y: 8, force3D: true });

    // Park sphere at path start
    positionSphere(0);

    // Individual card lines/elements for stagger reveal
    const cardEls = cards.querySelectorAll<HTMLElement>("[data-exp-card]");

    // ── GSAP context — scoped to this section ONLY ────────────────────────────
    const ctx = gsap.context(() => {

      // ─ 1. Header reveal — plain fromTo, fires once on enter ────────────────
      // Not scrub-driven — a clean one-shot reveal as section scrolls in.
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity:  1,
          y:        0,
          duration: 1.2,
          ease:     "power3.out",
          scrollTrigger: {
            trigger:  section,
            start:    "top 85%",
            once:     true,
          },
        }
      );

      // ─ 2. Cards stagger reveal ─────────────────────────────────────────────
      if (cardEls.length > 0) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 60 },
          {
            opacity:  1,
            y:        0,
            duration: 1.4,
            ease:     "power3.out",
            stagger:  0.18,
            scrollTrigger: {
              trigger:  cards,
              start:    "top 80%",
              once:     true,
            },
          }
        );
      }

      // ─ 3. Journey Indicator — scrub-driven, scoped to this section ─────────
      // Creates its own independent ScrollTrigger; never touches WorksSection.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:          section,
          start:            "top 60%",   // fires when section is 60% into viewport
          end:              "bottom 40%",
          scrub:            1.4,
          invalidateOnRefresh: true,
        },
      });

      // 3a. Sphere fades in
      tl.to(
        sphereEl,
        {
          opacity:  1,
          scale:    1,
          duration: 0.08,
          ease:     "power1.out",
          force3D:  true,
        },
        0
      );

      // 3b. Path draws (strokeDashoffset: pathLength → 0)
      tl.to(
        pathEl,
        {
          attr:     { strokeDashoffset: "0" },
          duration: 0.72,
          ease:     "power1.inOut",
        },
        0.02  // tiny offset so sphere and line move together immediately
      );

      // 3c. Sphere tracks path with inertia lag
      tl.to(
        proxy,
        {
          draw:     1,
          duration: 0.78,
          ease:     "power2.inOut",
          onUpdate() {
            positionSphere(proxy.draw - LAG);
          },
          onStart() {
            positionSphere(0);
          },
        },
        0
      );

      // 3d. "More to come" label fades in at end
      tl.to(
        labelEl,
        {
          opacity:  0.42,
          y:        0,
          duration: 0.14,
          ease:     "power1.inOut",
          force3D:  true,
        },
        0.84
      );
    }, section); // ← GSAP context scoped to this section — never leaks

    return () => {
      ctx.revert(); // kills all ScrollTriggers and tweens created inside
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-[#050505] text-[#f5f5f5] overflow-hidden"
      aria-label="Experience"
    >
      {/* ── Background layers ─────────────────────────────────────────────── */}
      {/* Subtle grain texture via SVG filter — zero layout cost */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.6,
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #050505 100%)",
        }}
      />
      {/* Subtle top gradient separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{ background: "linear-gradient(to right, transparent, #1c1c1c 30%, #1c1c1c 70%, transparent)" }}
      />

      {/* ── Content wrapper ───────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-28 md:py-40">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div ref={headerRef} style={{ opacity: 0 }}>
          {/* Index label */}
          <span className="block font-mono text-[10px] uppercase tracking-[0.38em] text-[#555555] mb-8 md:mb-10">
            04 / Experience
          </span>

          {/* Headline */}
          <h2 className="font-display font-black uppercase text-[#ECECEC] leading-[0.88] tracking-tight text-[clamp(4rem,11vw,9rem)] mb-10 md:mb-14">
            EXPERIENCE
          </h2>

          {/* Divider */}
          <div
            className="w-full h-px mb-20 md:mb-28"
            style={{
              background: "linear-gradient(to right, #1c1c1c, #2a2a2a 30%, #1c1c1c 70%, transparent)",
            }}
          />
        </div>

        {/* ── 70 / 30 grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.43fr] gap-12 lg:gap-20 items-start">

          {/* ════════ LEFT — Experience Cards (70%) ════════ */}
          <div ref={cardsRef} className="flex flex-col gap-24 md:gap-32">

            {EXPERIENCES.map((exp) => (
              <article
                key={exp.id}
                data-exp-card
                className="relative"
                style={{ opacity: 0 }} // initial hidden for GSAP reveal
              >
                {/* Index + meta row */}
                <div className="flex items-baseline gap-6 mb-8">
                  <span className="font-mono text-[11px] text-[#444444] tracking-[0.3em] uppercase select-none">
                    Experience {exp.index}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "linear-gradient(to right, #1c1c1c, transparent)" }}
                  />
                </div>

                {/* Company name */}
                <h3 className="font-display font-black uppercase text-[#ECECEC] leading-[0.90] tracking-tight text-[clamp(2rem,5vw,3.8rem)] mb-3">
                  {exp.company}
                </h3>

                {/* Role */}
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#888888] mb-10">
                  {exp.role} · {exp.duration}
                </p>

                {/* Two-column detail grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
                  {/* Stack */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-4">
                      Technology Stack
                    </span>
                    <ul className="flex flex-col gap-2">
                      {exp.stack.map((s) => (
                        <li
                          key={s}
                          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ECECEC]/70 flex items-center gap-3"
                        >
                          <span
                            className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: "#555" }}
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-4">
                      Worked On
                    </span>
                    <ul className="flex flex-col gap-2">
                      {exp.responsibilities.map((r) => (
                        <li
                          key={r}
                          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ECECEC]/70 flex items-center gap-3"
                        >
                          <span
                            className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: "#555" }}
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Company image — minimal, grayscale, editorial */}
                <div
                  className="relative w-full aspect-[16/7] overflow-hidden"
                  style={{
                    background: "#0a0a0a",
                    borderTop:    "1px solid #141414",
                    borderBottom: "1px solid #141414",
                  }}
                >
                  <Image
                    src={exp.image}
                    alt={exp.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 65vw"
                    className="object-cover filter grayscale brightness-[0.55] contrast-[1.1]"
                    style={{ willChange: "transform" }}
                  />
                  {/* Inner vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, #050505 0%, transparent 25%, transparent 75%, #050505 100%)",
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* ════════ RIGHT — Journey Indicator (30%) ════════ */}
          {/*
            Sticky: stays in the right column as the user scrolls through cards.
            The SVG canvas is tall enough to cover the full scroll range.
            The indicator is ONLY here — not in any other section.
          */}
          <div
            className="hidden lg:block"
            style={{
              position:    "sticky",
              top:         "20vh",
              alignSelf:   "start",
              height:      "60vh",
            }}
          >
            {/* Journey Indicator SVG container */}
            <div className="relative w-full h-full flex flex-col items-center">

              {/*
                SVG canvas.
                viewBox is 200 × 600.
                The sphere starts at top (100, 60) and ends at (100, 540).
                The path is a gentle editorial curve that meanders slightly
                before arriving at the bottom — feels hand-guided.
              */}
              <svg
                viewBox="0 0 200 600"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                <defs>
                  {/* Sphere clip centered at origin — GSAP translates the group */}
                  <clipPath id="exp-sphere-clip">
                    <circle cx="0" cy="0" r="40" />
                  </clipPath>
                </defs>

                {/*
                  Editorial dashed path — vertical, with a gentle S-meander.
                  M 100  60  — start near top-center
                  C  60 200   — first control: drift left
                     140 350  — second control: drift right
                  100 540     — end near bottom-center

                  GSAP overrides strokeDasharray/strokeDashoffset at runtime.
                */}
                <path
                  ref={pathRef}
                  d="M 100 60 C 60 200, 140 350, 100 540"
                  fill="none"
                  stroke="rgba(255,255,255,0.42)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="9999"
                  strokeDashoffset="9999"
                  style={{ willChange: "stroke-dashoffset" }}
                />

                {/*
                  Matte white sphere — exactly the user-supplied design.
                  Centered at (0,0). GSAP moves via translate x/y + xPercent/yPercent -50.

                  Layer stack (bottom → top):
                    base:      #F1F1F1 fill — warm matte white
                    shadow:    offset (+12,+12), #ECECEC 50% — gives volume
                    highlight: offset (-12,-12), #FFFFFF 60% — catch light
                  Contact shadow below the sphere.
                */}
                <g
                  ref={sphereRef}
                  style={{ willChange: "transform, opacity" }}
                >
                  <g clipPath="url(#exp-sphere-clip)">
                    <circle cx="0" cy="0" r="40"  fill="#F1F1F1" />
                    <ellipse cx="12"  cy="12"  rx="36" ry="34" fill="#ECECEC" opacity="0.50" />
                    <ellipse cx="-12" cy="-12" rx="18" ry="12" fill="#FFFFFF" opacity="0.60" />
                  </g>
                  {/* Contact shadow */}
                  <ellipse cx="0" cy="44" rx="22" ry="3.5" fill="#ECECEC" opacity="0.28" />
                </g>
              </svg>

              {/* "More to come" label — centred under path end */}
              <div
                ref={labelRef}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 whitespace-nowrap select-none pointer-events-none"
                style={{
                  fontFamily:    "var(--font-geist-mono), monospace",
                  fontSize:      "9px",
                  fontWeight:    300,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color:         "#bdbdbd",
                  opacity:       0,
                  willChange:    "opacity, transform",
                }}
              >
                More to come
              </div>
            </div>
          </div>

        </div>{/* end 70/30 grid */}
      </div>{/* end content wrapper */}
    </section>
  );
}
