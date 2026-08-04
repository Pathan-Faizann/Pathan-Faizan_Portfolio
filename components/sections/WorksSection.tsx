// "use client";

// import React, { useEffect, useRef } from "react";
// import Image from "next/image";
// import { gsap, ScrollTrigger } from "@/lib/gsap";
// import { PARALLAX_IMAGES } from "@/components/zoom-parallax/constants";

// /**
//  * WorksSection — Unified cinematic scroll experience.
//  *
//  * Architecture:
//  *   ONE outer wrapper  → provides scroll track (pinSpacing auto-extends)
//  *   ONE pinned div     → stays locked to viewport via GSAP pin
//  *   ONE horizontal strip (400vw) → the single sliding surface:
//  *     ├── Panel 1 (100vw): PROJECTS world — collage + PROJECTS text (perfectly sharp)
//  *     ├── Panel 2 (100vw): Aurelia Residences
//  *     ├── Panel 3 (100vw): Kronos Horology
//  *     └── Panel 4 (100vw): Nordic Editorial
//  *
//  * Phase 1 — ZOOM (300vh scroll depth):
//  *   - Strip stays at x = 0.
//  *   - Collage elements fly outward and fade to 0 opacity.
//  *   - PROJECTS text container zooms from 0.20833 (1/4.8) to 1.0.
//  *   - Because its final scale is exactly 1.0, the text is rendered at its native font size
//  *     directly on the viewport, ensuring absolute vector crispness (no blurriness/pixelation).
//  *
//  * Phase 2 — HORIZONTAL SLIDE (300vw scroll depth):
//  *   - The entire strip slides left (x: 0 → -300vw).
//  *   - PROJECTS text slides off-screen left in perfect unison with Panel 1.
//  *   - Aurelia, Kronos, Nordic panels slide in from right.
//  */

// const PROJECTS = [
//   {
//     id: "darsh-industrial-parks",
//     title: "Darsh Industrial Parks",
//     href: "https://www.darshindustrialparks.com/",
//     industry: "Industrial & Logistics",
//     description:
//       "Developed responsive frontend pages across the platform, delivering clean layouts, intuitive navigation, and production-ready user experiences.",
//     website: "Visit Website ↗",
//     image: "/Darsh.png",
//   },
//   {
//     id: "ksh-infra",
//     title: "KSH Infra",
//     href: "https://www.kshinfra.com/",
//     industry: "Grade A Industrial Parks",
//     description:
//       "Built multiple frontend pages focused on responsive design, smooth interactions, and a consistent digital experience across the website.",
//     website: "Visit Website ↗",
//     image: "/ksh.jpeg",
//   },
//   {
//     id: "horizon-industrial-parks",
//     title: "Horizon Industrial Parks",
//     href: "https://www.hiparks.com/",
//     industry: "Industrial Infrastructure",
//     description:
//       "Contributed to frontend development with modern layouts, seamless navigation, and polished interfaces for an enterprise-scale platform.",
//     website: "Visit Website ↗",
//     image: "/horizon-industrial-parks.jpg",
//   },
//   {
//     id: "buildspace",
//     title: "BuildSpace",
//     href: "https://buildspaceweb.vercel.app/",
//     industry: "Infrastructure Development",
//     description:
//       "Crafted responsive frontend experiences showcasing investment opportunities, infrastructure solutions, and business capabilities with performance in mind.",
//     website: "Visit Website ↗",
//     image: "/buildspace.png",
//   },
//   {
//     id: "arenax",
//     title: "ArenaX",
//     href: "https://turf-project-bice.vercel.app/",
//     industry: "Sports Booking Platform",
//     description:
//       "Designed and developed a modern turf booking platform featuring seamless reservations, intuitive user flows, and a community-driven sports experience.",
//     website: "Visit Website ↗",
//     image: "/arenax.png",
//   },
// ];

// export default function WorksSection() {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const stickyRef = useRef<HTMLDivElement>(null);
//   const collageRef = useRef<HTMLDivElement>(null);
//   const stripRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const wrapper = wrapperRef.current;
//     const sticky = stickyRef.current;
//     const collage = collageRef.current;
//     const strip = stripRef.current;
//     if (!wrapper || !sticky || !collage || !strip) return;

//     const getZoomPx = () => window.innerHeight * 3;
//     const getHorizPx = () => strip.scrollWidth - window.innerWidth;
//     const getTotalPx = () => getZoomPx() + getHorizPx();

//     let ctx: gsap.Context | null = null;

//     const build = () => {
//       ctx?.revert();

//       ctx = gsap.context(() => {
//         const zoomPx = getZoomPx();
//         const horizPx = getHorizPx();
//         const totalPx = zoomPx + horizPx;

//         const zoomFrac = zoomPx / totalPx;
//         const horizFrac = horizPx / totalPx;

//         // Initialize strip at starting position
//         gsap.set(strip, { x: 0, force3D: true });

//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: wrapper,
//             pin: sticky,
//             pinSpacing: true,
//             scrub: 1.2,
//             start: "top top",
//             end: `+=${totalPx}`,
//             invalidateOnRefresh: true,
//           },
//         });

//         // ── PHASE 1: ZOOM ──
//         PARALLAX_IMAGES.forEach((img) => {
//           const el = collage.querySelector<HTMLElement>(
//             `[data-parallax-id="${img.id}"]`,
//           );
//           if (!el) return;

//           tl.to(
//             el,
//             {
//               scale: img.scaleRange[1],
//               x: img.xRange[0] * img.depth,
//               y: img.yRange[0] * img.depth,
//               opacity: img.opacityRange[1],
//               ease: "power2.inOut",
//               force3D: true,
//               duration: zoomFrac,
//             },
//             0,
//           );
//         });

//         // Scale and reveal the PROJECTS text in sync with the collage zoom
//         const textInner =
//           sticky.querySelector<HTMLElement>("[data-text-inner]");
//         if (textInner) {
//           tl.fromTo(
//             textInner,
//             { scale: 1 / 4.8, opacity: 1 },
//             {
//               scale: 1,
//               opacity: 1,
//               ease: "power2.inOut",
//               force3D: true,
//               duration: zoomFrac,
//             },
//             0,
//           );
//         }

//         // Fade out the explore overlay
//         const textOverlay = sticky.querySelector<HTMLElement>(
//           "[data-text-overlay]",
//         );
//         if (textOverlay) {
//           tl.to(
//             textOverlay,
//             {
//               opacity: 0,
//               scale: 0.94,
//               ease: "power1.in",
//               force3D: true,
//               duration: 0.22 * zoomFrac,
//             },
//             0,
//           );
//         }

//         // ── PHASE 2: HORIZONTAL SLIDE ──
//         tl.to(
//           strip,
//           {
//             x: () => -(strip.scrollWidth - window.innerWidth),
//             ease: "none",
//             force3D: true,
//             duration: horizFrac,
//             immediateRender: false,
//           },
//           zoomFrac,
//         );
//       });
//     };

//     build();

//     let resizeTimer: ReturnType<typeof setTimeout>;
//     const onResize = () => {
//       clearTimeout(resizeTimer);
//       resizeTimer = setTimeout(() => {
//         build();
//         ScrollTrigger.refresh();
//       }, 250);
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       clearTimeout(resizeTimer);
//       window.removeEventListener("resize", onResize);
//       ctx?.revert();
//     };
//   }, []);

//   return (
//     <div ref={wrapperRef} id="works" className="relative bg-[#050505]">
//       <div
//         ref={stickyRef}
//         className="w-full h-screen relative overflow-hidden bg-[#050505]"
//       >
//         <div
//           ref={stripRef}
//           className="flex h-full"
//           style={{
//             width: `${(PROJECTS.length + 1) * 100}vw`,
//             willChange: "transform",
//             transform: "translate3d(0, 0, 0)",
//             backfaceVisibility: "hidden",
//           }}
//         >
//           {/* ── PANEL 1: COLLAGE + PROJECTS CARD ── */}
//           <div
//             className="relative flex-shrink-0 bg-[#050505] overflow-hidden"
//             style={{ width: "100vw", height: "100vh" }}
//           >
//             {/* Subtle background grid */}
//             <div
//               className="absolute inset-0 pointer-events-none z-0"
//               style={{
//                 backgroundImage:
//                   "linear-gradient(to right, #0c0c0c 1px, transparent 1px)," +
//                   "linear-gradient(to bottom, #0c0c0c 1px, transparent 1px)",
//                 backgroundSize: "5rem 5rem",
//                 maskImage:
//                   "radial-gradient(ellipse 60% 50% at 50% 40%, #000 70%, transparent 100%)",
//                 opacity: 0.25,
//               }}
//             />

//             {/* Circular vignette */}
//             <div
//               className="absolute inset-0 pointer-events-none z-0"
//               style={{
//                 background:
//                   "radial-gradient(circle at center, transparent 45%, #050505 100%)",
//                 opacity: 0.9,
//               }}
//             />

//             {/* Explore overlay */}
//             <div
//               data-text-overlay
//               className="absolute bottom-12 right-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888] select-none pointer-events-none text-right hidden md:block"
//               style={{ willChange: "opacity, transform" }}
//             >
//               SCROLL TO EXPLORE
//               <br />
//               <span className="text-[#444444]">THE SPACE BETWEEN</span>
//             </div>

//             {/* Collage images */}
//             <div ref={collageRef} className="absolute inset-0 z-10">
//               {PARALLAX_IMAGES.map((img) => (
//                 <div
//                   key={img.id}
//                   data-parallax-id={img.id}
//                   className={img.className}
//                   style={{
//                     willChange: "transform, opacity",
//                     transform: "translate3d(0, 0, 0)",
//                     backfaceVisibility: "hidden",
//                   }}
//                 >
//                   {img.content === "projects" && (
//                     <div className="relative h-full w-full overflow-hidden bg-transparent" />
//                   )}

//                   {img.content === "about" && (
//                     <div className="flex h-full w-full items-start text-[#ECECEC] select-none">
//                       <span className="whitespace-nowrap font-display text-xs sm:text-sm md:text-[clamp(1.35rem,2.25vw,2.75rem)] font-[100] uppercase leading-none tracking-[0.18em]">
//                         [ ABOUT ]
//                       </span>
//                     </div>
//                   )}

//                   {img.content === "statement" && (
//                     <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
//                       <p className="w-full md:w-[min(30vw,calc(100vw-4rem))]! text-[11px] sm:text-xs md:text-[clamp(1rem,1.65vw,1.45rem)] lg:pb-18! font-semibold leading-tight md:leading-[1.2] tracking-[0.01em]">
//                         {/* BCA graduate focused on building modern, thoughtful
//                         digital experiences with clean code and motion. */}
//                         Building modern digital experiences with a strong focus
//                         on quality, performance, and thoughtful execution.
//                         Experienced working on live client projects,
//                         collaborating across teams, and transforming ideas into
//                         reliable products.
//                       </p>
//                     </div>
//                   )}

//                   {img.content === "manifesto" && (
//                     <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
//                       <p className="whitespace-nowrap font-display text-xs sm:text-base md:text-[clamp(1.75rem,3.1vw,3.50rem)] font-semibold leading-[1.12] tracking-[0.01em]">
//                         {/* <span className="block">Learning.</span> */}
//                         <span className="block">Building.</span>
//                         <span className="block">Improving.</span>
//                       </p>
//                     </div>
//                   )}

//                   {!img.content && (
//                     <div className="relative h-full w-full overflow-hidden group">
//                       <Image
//                         src={img.src}
//                         alt={img.alt}
//                         fill
//                         sizes="(max-width: 768px) 30vw, 20vw"
//                         className="object-cover filter grayscale contrast-[1.12] brightness-[0.88] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-105"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-30 transition-opacity duration-1000" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Pinned/Centered PROJECTS Text (outside the scaling cards to prevent blur/double scaling) */}
//             <div
//               data-projects-text
//               className="absolute inset-0 flex items-center justify-center pointer-events-none z-25 px-4"
//             >
//               <div
//                 data-text-inner
//                 className="flex flex-col items-center text-center origin-center max-w-full"
//                 style={{
//                   willChange: "transform, opacity",
//                   transform: "translate3d(0,0,0)",
//                   opacity: 0,
//                   backfaceVisibility: "hidden",
//                 }}
//               >
//                 <h2 className="font-display text-[clamp(2.5rem,11.5vw,4.5rem)] md:text-[clamp(10.08rem,30vw,14.4rem)] font-black uppercase leading-[0.85] md:leading-[0.82] tracking-tight md:tracking-normal text-[#ECECEC]">
//                   PROJECTS
//                 </h2>
//                 <p className="mt-3 sm:mt-4 md:mt-[clamp(3.6rem,6.72vw,7.2rem)] font-mono text-[11px] sm:text-xs md:text-[clamp(2.4rem,3.12vw,3.456rem)] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.32em] text-[#ECECEC]/40">
//                   Selected Works
//                 </p>
//                 <p className="mt-2 sm:mt-3 md:mt-10 font-mono text-[9px] sm:text-[10px] md:text-[clamp(2.016rem,2.4vw,2.784rem)] uppercase tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.2em] text-[#ECECEC]/30">
//                   Curated Digital Experiences
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ── PANELS 2-4: CASE STUDIES ── */}
//           {PROJECTS.map((project, index) => (
//             <div
//               key={project.id}
//               className="flex-shrink-0 bg-[#050505] relative"
//               style={{ width: "100vw", height: "100vh" }}
//             >
//               <div className="absolute left-0 top-0 w-px h-full bg-[#111111]/40 z-10" />

//               <div className="w-full h-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-16">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center w-full max-w-7xl">
//                   {/* Project Image */}
//                   <div className="lg:col-span-7 overflow-hidden aspect-[16/10] relative group bg-[#0d0d0d] border border-[#1c1c1c]/50 rounded-lg sm:rounded-none">
//                     <Image
//                       src={project.image}
//                       alt={project.title}
//                       fill
//                       sizes="(max-width: 1024px) 100vw, 60vw"
//                       priority={index === 0}
//                       className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
//                     />
//                   </div>

//                   {/* Project Info */}
//                   <div className="lg:col-span-5 flex flex-col justify-center h-full lg:pl-12">
//                     {/* Industry */}
//                     <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7f7f7f] mb-2! sm:mb-4!">
//                       {project.industry}
//                     </span>

//                     {/* Project Name */}
//                     <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[0.95] mb-3 sm:mb-6">
//                       {project.title}
//                     </h3>

//                     {/* Description */}
//                     <p className="max-w-md text-sm md:text-[15px] leading-normal text-[#8c8c8c] my-3! sm:my-10!">
//                       {project.description}
//                     </p>

//                     {/* Divider */}
//                     <div className="border-t border-[#1c1c1c] pt-4 sm:pt-6">
//                       <a
//                         target="_blank"
//                         href={project.href}
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#f5f5f5] transition-all duration-300 hover:tracking-[0.35em]"
//                       >
//                         {project.website}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PARALLAX_IMAGES } from "@/components/zoom-parallax/constants";

/**
 * Helper function to safely detect video extensions in image paths
 */
function checkIsVideo(url: string | undefined | null): boolean {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].split("#")[0].trim();
  return /\.(mp4|webm|ogg|mov)$/i.test(cleanUrl);
}

const PROJECTS = [
  {
    id: "darsh-industrial-parks",
    title: "Darsh Industrial Parks",
    href: "https://www.darshindustrialparks.com/",
    industry: "Industrial & Logistics",
    description:
      "Developed responsive frontend pages across the platform, delivering clean layouts, intuitive navigation, and production-ready user experiences.",
    website: "Visit Website ↗",
    image: "/Darsh.png",
  },
  {
    id: "ksh-infra",
    title: "KSH Infra",
    href: "https://www.kshinfra.com/",
    industry: "Grade A Industrial Parks",
    description:
      "Built multiple frontend pages focused on responsive design, smooth interactions, and a consistent digital experience across the website.",
    website: "Visit Website ↗",
    image: "/ksh.jpeg",
  },
  {
    id: "horizon-industrial-parks",
    title: "Horizon Industrial Parks",
    href: "https://www.hiparks.com/",
    industry: "Industrial Infrastructure",
    description:
      "Contributed to frontend development with modern layouts, seamless navigation, and polished interfaces for an enterprise-scale platform.",
    website: "Visit Website ↗",
    image: "/horizon-industrial-parks.jpg",
  },
  {
    id: "buildspace",
    title: "BuildSpace",
    href: "https://buildspaceweb.vercel.app/",
    industry: "Infrastructure Development",
    description:
      "Crafted responsive frontend experiences showcasing investment opportunities, infrastructure solutions, and business capabilities with performance in mind.",
    website: "Visit Website ↗",
    image: "/buildspace.png",
  },
  {
    id: "arenax",
    title: "ArenaX",
    href: "https://turf-project-bice.vercel.app/",
    industry: "Sports Booking Platform",
    description:
      "Designed and developed a modern turf booking platform featuring seamless reservations, intuitive user flows, and a community-driven sports experience.",
    website: "Visit Website ↗",
    image: "/arenax.png",
  },
];

export default function WorksSection() {
  const [isMounted, setIsMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

            {/* Collage images & videos */}
            <div ref={collageRef} className="absolute inset-0 z-10">
              {PARALLAX_IMAGES.map((img) => {
                const isVideo = checkIsVideo(img.src);

                return (
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
                        <span className="whitespace-nowrap font-display text-xs sm:text-sm md:text-[clamp(1.35rem,2.25vw,2.75rem)] font-[100] uppercase leading-none tracking-[0.18em]">
                          [ ABOUT ]
                        </span>
                      </div>
                    )}

                    {img.content === "statement" && (
                      <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
                        <p className="w-full md:w-[min(30vw,calc(100vw-4rem))]! text-[11px] sm:text-xs md:text-[clamp(1rem,1.65vw,1.45rem)] lg:pb-18! font-semibold leading-tight md:leading-[1.2] tracking-[0.01em]">
                          Building modern digital experiences with a strong
                          focus on quality, performance, and thoughtful
                          execution. Experienced working on live client
                          projects, collaborating across teams, and transforming
                          ideas into reliable products.
                        </p>
                      </div>
                    )}

                    {img.content === "manifesto" && (
                      <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
                        <p className="whitespace-nowrap font-display text-xs sm:text-base md:text-[clamp(1.75rem,3.1vw,3.50rem)] font-semibold leading-[1.12] tracking-[0.01em]">
                          <span className="block">Building.</span>
                          <span className="block">Improving.</span>
                        </p>
                      </div>
                    )}

                    {!img.content && (
                      <div className="relative h-full w-full overflow-hidden group">
                        {isVideo ? (
                          isMounted ? (
                            <video
                              src={img.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="auto"
                              aria-label={img.alt}
                              className="absolute inset-0 h-full w-full object-cover filter grayscale contrast-[1.12] brightness-[0.88] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-105"
                            />
                          ) : (
                            <div className="absolute inset-0 h-full w-full bg-[#0a0a0a]" />
                          )
                        ) : (
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 768px) 30vw, 20vw"
                            className="object-cover filter grayscale contrast-[1.12] brightness-[0.88] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-30 transition-opacity duration-1000" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pinned/Centered PROJECTS Text */}
            <div
              data-projects-text
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-25 px-4"
            >
              <div
                data-text-inner
                className="flex flex-col items-center text-center origin-center max-w-full"
                style={{
                  willChange: "transform, opacity",
                  transform: "translate3d(0,0,0)",
                  opacity: 0,
                  backfaceVisibility: "hidden",
                }}
              >
                <h2 className="font-display text-[clamp(2.5rem,11.5vw,4.5rem)] md:text-[clamp(10.08rem,30vw,14.4rem)] font-black uppercase leading-[0.85] md:leading-[0.82] tracking-tight md:tracking-normal text-[#ECECEC]">
                  PROJECTS
                </h2>
                <p className="mt-3 sm:mt-4 md:mt-[clamp(3.6rem,6.72vw,7.2rem)] font-mono text-[11px] sm:text-xs md:text-[clamp(2.4rem,3.12vw,3.456rem)] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.32em] text-[#ECECEC]/40">
                  Selected Works
                </p>
                <p className="mt-2 sm:mt-3 md:mt-10 font-mono text-[9px] sm:text-[10px] md:text-[clamp(2.016rem,2.4vw,2.784rem)] uppercase tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.2em] text-[#ECECEC]/30">
                  Curated Digital Experiences
                </p>
              </div>
            </div>
          </div>

          {/* ── PANELS 2-6: CASE STUDIES ── */}
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="flex-shrink-0 bg-[#050505] relative"
              style={{ width: "100vw", height: "100vh" }}
            >
              <div className="absolute left-0 top-0 w-px h-full bg-[#111111]/40 z-10" />

              <div className="w-full h-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center w-full max-w-7xl">
                  {/* Project Image */}
                  <div className="lg:col-span-7 overflow-hidden aspect-[16/10] relative group bg-[#0d0d0d] border border-[#1c1c1c]/50 rounded-lg sm:rounded-none">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority={index === 0}
                      className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                    />
                  </div>

                  {/* Project Info */}
                  <div className="lg:col-span-5 flex flex-col justify-center h-full lg:pl-12">
                    {/* Industry */}
                    <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7f7f7f] mb-2! sm:mb-4!">
                      {project.industry}
                    </span>

                    {/* Project Name */}
                    <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-[#f5f5f5] leading-[0.95] mb-3 sm:mb-6">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="max-w-md text-sm md:text-[15px] leading-normal text-[#8c8c8c] my-3! sm:my-10!">
                      {project.description}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-[#1c1c1c] pt-4 sm:pt-6">
                      <a
                        target="_blank"
                        href={project.href}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#f5f5f5] transition-all duration-300 hover:tracking-[0.35em]"
                      >
                        {project.website}
                      </a>
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
