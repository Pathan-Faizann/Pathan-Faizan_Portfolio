"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PARALLAX_IMAGES } from "@/components/zoom-parallax/constants";

/**
 * WorksSection — Unified cinematic scroll experience.
 *
 * Architecture:
 *   ONE outer wrapper  → provides scroll track (pinSpacing auto-extends)
 *   ONE pinned div     → stays locked to viewport via GSAP pin
 *   ONE horizontal strip (400vw) → the single sliding surface:
 *     ├── Panel 1 (100vw): PROJECTS world — collage + PROJECTS text (perfectly sharp)
 *     ├── Panel 2 (100vw): Aurelia Residences
 *     ├── Panel 3 (100vw): Kronos Horology
 *     └── Panel 4 (100vw): Nordic Editorial
 *
 * Phase 1 — ZOOM (300vh scroll depth):
 *   - Strip stays at x = 0.
 *   - Collage elements fly outward and fade to 0 opacity.
 *   - PROJECTS text container zooms from 0.20833 (1/4.8) to 1.0.
 *   - Because its final scale is exactly 1.0, the text is rendered at its native font size
 *     directly on the viewport, ensuring absolute vector crispness (no blurriness/pixelation).
 *
 * Phase 2 — HORIZONTAL SLIDE (300vw scroll depth):
 *   - The entire strip slides left (x: 0 → -300vw).
 *   - PROJECTS text slides off-screen left in perfect unison with Panel 1.
 *   - Aurelia, Kronos, Nordic panels slide in from right.
 */

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

export default function WorksSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const collage = collageRef.current;
    const strip = stripRef.current;
    if (!wrapper || !sticky || !collage || !strip) return;

    const getZoomPx = () => window.innerHeight * 3;
    const getHorizPx = () => strip.scrollWidth - window.innerWidth;
    const getTotalPx = () => getZoomPx() + getHorizPx();

    let ctx: gsap.Context | null = null;

    const build = () => {
      ctx?.revert();

      ctx = gsap.context(() => {
        const zoomPx = getZoomPx();
        const horizPx = getHorizPx();
        const totalPx = zoomPx + horizPx;

        const zoomFrac = zoomPx / totalPx;
        const horizFrac = horizPx / totalPx;

        // Initialize strip at starting position
        gsap.set(strip, { x: 0, force3D: true });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            pin: sticky,
            pinSpacing: true,
            scrub: 1.2,
            start: "top top",
            end: `+=${totalPx}`,
            invalidateOnRefresh: true,
          },
        });

        // ── PHASE 1: ZOOM ──
        PARALLAX_IMAGES.forEach((img) => {
          const el = collage.querySelector<HTMLElement>(
            `[data-parallax-id="${img.id}"]`,
          );
          if (!el) return;

          tl.to(
            el,
            {
              scale: img.scaleRange[1],
              x: img.xRange[0] * img.depth,
              y: img.yRange[0] * img.depth,
              opacity: img.opacityRange[1],
              ease: "power2.inOut",
              force3D: true,
              duration: zoomFrac,
            },
            0,
          );
        });

        // Scale and reveal the PROJECTS text in sync with the collage zoom
        const textInner =
          sticky.querySelector<HTMLElement>("[data-text-inner]");
        if (textInner) {
          tl.fromTo(
            textInner,
            { scale: 1 / 4.8, opacity: 1 },
            {
              scale: 1,
              opacity: 1,
              ease: "power2.inOut",
              force3D: true,
              duration: zoomFrac,
            },
            0,
          );
        }

        // Fade out the explore overlay
        const textOverlay = sticky.querySelector<HTMLElement>(
          "[data-text-overlay]",
        );
        if (textOverlay) {
          tl.to(
            textOverlay,
            {
              opacity: 0,
              scale: 0.94,
              ease: "power1.in",
              force3D: true,
              duration: 0.22 * zoomFrac,
            },
            0,
          );
        }

        // ── PHASE 2: HORIZONTAL SLIDE ──
        tl.to(
          strip,
          {
            x: () => -(strip.scrollWidth - window.innerWidth),
            ease: "none",
            force3D: true,
            duration: horizFrac,
            immediateRender: false,
          },
          zoomFrac,
        );
      });
    };

    build();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} id="works" className="relative bg-[#050505]">
      <div
        ref={stickyRef}
        className="w-full h-screen relative overflow-hidden bg-[#050505]"
      >
        <div
          ref={stripRef}
          className="flex h-full"
          style={{
            width: `${(PROJECTS.length + 1) * 100}vw`,
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* ── PANEL 1: COLLAGE + PROJECTS CARD ── */}
          <div
            className="relative flex-shrink-0 bg-[#050505] overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
          >
            {/* Subtle background grid */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #0c0c0c 1px, transparent 1px)," +
                  "linear-gradient(to bottom, #0c0c0c 1px, transparent 1px)",
                backgroundSize: "5rem 5rem",
                maskImage:
                  "radial-gradient(ellipse 60% 50% at 50% 40%, #000 70%, transparent 100%)",
                opacity: 0.25,
              }}
            />

            {/* Circular vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 45%, #050505 100%)",
                opacity: 0.9,
              }}
            />

            {/* Explore overlay */}
            <div
              data-text-overlay
              className="absolute bottom-12 right-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888] select-none pointer-events-none text-right hidden md:block"
              style={{ willChange: "opacity, transform" }}
            >
              SCROLL TO EXPLORE
              <br />
              <span className="text-[#444444]">THE SPACE BETWEEN</span>
            </div>

            {/* Collage images */}
            <div ref={collageRef} className="absolute inset-0 z-10">
              {PARALLAX_IMAGES.map((img) => (
                <div
                  key={img.id}
                  data-parallax-id={img.id}
                  className={img.className}
                  style={{
                    willChange: "transform, opacity",
                    transform: "translate3d(0, 0, 0)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {img.content === "projects" && (
                    <div className="relative h-full w-full overflow-hidden bg-transparent" />
                  )}

                  {img.content === "about" && (
                    <div className="flex h-full w-full items-start text-[#ECECEC] select-none">
                      <span className="whitespace-nowrap font-display text-[clamp(1.35rem,2.25vw,2.75rem)] font-[100] uppercase leading-none tracking-[0.18em]">
                        [ ABOUT ]
                      </span>
                    </div>
                  )}

                  {img.content === "statement" && (
                    <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
                      <p className="w-[min(30vw,calc(100vw-4rem))]! text-[clamp(1rem,1.65vw,1.45rem)] lg:pb-18! font-semibold leading-[1.2] tracking-[0.01em]">
                        {/* BCA graduate focused on building modern, thoughtful
                        digital experiences with clean code and motion. */}
                        Building modern digital experiences with a strong focus
                        on quality, performance, and thoughtful execution.
                        Experienced working on live client projects,
                        collaborating across teams, and transforming ideas into
                        reliable products.
                      </p>
                    </div>
                  )}

                  {img.content === "manifesto" && (
                    <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
                      <p className="whitespace-nowrap font-display text-[clamp(1.75rem,3.1vw,3.50rem)] font-semibold leading-[1.12] tracking-[0.01em]">
                        <span className="block">Learning.</span>
                        <span className="block">Building.</span>
                        <span className="block">Improving.</span>
                      </p>
                    </div>
                  )}

                  {!img.content && (
                    <div className="relative h-full w-full overflow-hidden group">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 30vw, 20vw"
                        className="object-cover filter grayscale contrast-[1.12] brightness-[0.88] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-30 transition-opacity duration-1000" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pinned/Centered PROJECTS Text (outside the scaling cards to prevent blur/double scaling) */}
            <div
              data-projects-text
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
            >
              <div
                data-text-inner
                className="flex flex-col items-center text-center origin-center"
                style={{
                  willChange: "transform, opacity",
                  transform: "translate3d(0,0,0)",
                  opacity: 0,
                  backfaceVisibility: "hidden",
                }}
              >
                <h2 className="font-display text-[clamp(10.08rem,30vw,14.4rem)] font-black uppercase leading-[0.82] tracking-normal text-[#ECECEC]">
                  PROJECTS
                </h2>
                <p className="mt-[clamp(3.6rem,6.72vw,7.2rem)] font-mono text-[clamp(2.4rem,3.12vw,3.456rem)] uppercase tracking-[0.32em] text-[#ECECEC]/40">
                  Selected Works
                </p>
                <p className="mt-10 font-mono text-[clamp(2.016rem,2.4vw,2.784rem)] uppercase tracking-[0.2em] text-[#ECECEC]/30">
                  Curated Digital Experiences
                </p>
              </div>
            </div>
          </div>

          {/* ── PANELS 2-4: CASE STUDIES ── */}
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="flex-shrink-0 bg-[#050505] relative"
              style={{ width: "100vw", height: "100vh" }}
            >
              <div className="absolute left-0 top-0 w-px h-full bg-[#111111]/40 z-10" />

              <div className="w-full h-full flex flex-col justify-center items-center px-6 md:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-7xl">
                  {/* Project Image */}
                  <div className="lg:col-span-7 overflow-hidden aspect-[16/10] relative group bg-[#0d0d0d] border border-[#1c1c1c]/50">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-[1.5s] ease-[cubic-bezier(0.76,0,0.24,1)]"
                      priority={index === 0}
                    />
                  </div>

                  {/* Project Info */}
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
                        <span className="text-[10px] text-[#555555] block mb-1">
                          Services
                        </span>
                        <span className="text-[#f5f5f5]">{project.role}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#555555] block mb-1">
                          Year
                        </span>
                        <span className="text-[#f5f5f5]">{project.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
