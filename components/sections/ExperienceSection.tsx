// "use client";

// /**
//  * ExperienceSection
//  * ─────────────────────────────────────────────────────────────────────────────
//  * A premium editorial experience section that appears AFTER the Selected Works
//  * horizontal scroll (WorksSection) finishes and the section unpins naturally.
//  *
//  * Architecture:
//  *   • Single Continuous Journey: The Journey Indicator travels continuously
//  *     from Experience 1 (Anchor A) to Experience 2 (Anchor B).
//  *   • Dynamic DOM Anchors: Bounding client rects of invisible anchor elements are
//  *     measured relative to the section top-left to calculate exact path coordinates.
//  *   • Single absolute overlay layer: Holds the Journey Indicator SVG and path.
//  *   • Tangent Rotation: Calculates path slope at every progress tick to tilt the
//  *     sphere by up to 3 degrees.
//  *   • Perfect Reversibility: Fully driven by ScrollTrigger scrub.
//  *   • Selective Reveals: Experience 1 is visible from the start; Experience 2 reveals
//  *     with fade/translate/blur as the sphere approaches.
//  */

// import React, { useEffect, useRef } from "react";
// import Image from "next/image";
// import { gsap, ScrollTrigger } from "@/lib/gsap";

// // ─── Experience data ──────────────────────────────────────────────────────────

// const EXPERIENCES = [
//   {
//     id: "exp-01",
//     index: "01",
//     company: "INAI Worlds Pvt Ltd",
//     location: "Surat",
//     role: "MERN Stack Developer",
//     duration: "3 Months",
//     responsibilities: [
//       "Worked on Frontend pages",
//       "Worked on REST APIs",
//     ],
//     image: "/company_inai.png",
//     imageAlt: "INAI Worlds — Technology Studio",
//   },
//   {
//     id: "exp-02",
//     index: "02",
//     company: "Parashift Technologies",
//     location: "Jogeshwari, Mumbai",
//     role: "Frontend Developer Intern",
//     duration: "Current",
//     responsibilities: [
//       "Next.js",
//       "TypeScript",
//     ],
//     image: "/company_frontend.png",
//     imageAlt: "Parashift Technologies — Frontend Developer Intern",
//   },
// ] as const;

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ExperienceSection() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const cardsContainerRef = useRef<HTMLDivElement>(null);

//   // Refs for anchors
//   const anchorARef = useRef<HTMLDivElement>(null);
//   const anchorBRef = useRef<HTMLDivElement>(null);

//   // Refs for Journey Indicator elements
//   const pathRef = useRef<SVGPathElement>(null);
//   const sphereRef = useRef<SVGGElement>(null);
//   const labelRef = useRef<SVGTextElement>(null);

//   // Refs for Card 2 elements (Card 1 starts fully visible)
//   const card2ImageRef = useRef<HTMLDivElement>(null);
//   const card2TextRef = useRef<HTMLDivElement>(null);

//   // Cache to store journey metrics across resize events
//   const journeyMetricsRef = useRef<{
//     xA: number;
//     yA: number;
//     xB: number;
//     yB: number;
//     pathLength: number;
//   } | null>(null);

//   const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const cardsContainer = cardsContainerRef.current;
//     const anchorA = anchorARef.current;
//     const anchorB = anchorBRef.current;
//     const pathEl = pathRef.current;
//     const sphereEl = sphereRef.current;
//     const labelEl = labelRef.current;

//     const card2Image = card2ImageRef.current;
//     const card2Text = card2TextRef.current;

//     if (
//       !section ||
//       !cardsContainer ||
//       !anchorA ||
//       !anchorB ||
//       !pathEl ||
//       !sphereEl ||
//       !labelEl ||
//       !card2Image ||
//       !card2Text
//     ) {
//       return;
//     }

//     // Proxy properties used in the timeline
//     const sphereProgress = { val: 0 };
//     const sphereOffset = { x: 0, y: 0 };

//     /**
//      * Positions and rotates the sphere along the dynamically measured Bezier curve.
//      */
//     const updateSphere = () => {
//       const progressVal = sphereProgress.val;
//       const metrics = journeyMetricsRef.current;
//       if (!metrics || !pathEl || !sphereEl) return;

//       // Extract current coordinates along the path
//       const point = pathEl.getPointAtLength(progressVal * metrics.pathLength);

//       // Compute heading angle (tangent) for physical tilting
//       const step = 2; // px
//       const nextVal = Math.min(metrics.pathLength, progressVal * metrics.pathLength + step);
//       const nextPoint = pathEl.getPointAtLength(nextVal);

//       const dx = nextPoint.x - point.x;
//       const dy = nextPoint.y - point.y;

//       let tilt = 0;
//       // Calculate tilt only when sphere is actively moving along the curve
//       if (progressVal < 0.99 && (dx !== 0 || dy !== 0)) {
//         const angleRad = Math.atan2(dy, dx);
//         const deviationRad = angleRad - Math.PI / 2; // deviation from straight down (90 deg)
//         const deviationDeg = deviationRad * (180 / Math.PI);

//         // Scale down tilt to ensure maximum curve tilt is extremely subtle (max 3 degrees)
//         tilt = Math.max(-3, Math.min(3, deviationDeg * 0.12));
//       }

//       gsap.set(sphereEl, {
//         x: point.x + sphereOffset.x,
//         y: point.y + sphereOffset.y,
//         rotation: tilt,
//         xPercent: -50,
//         yPercent: -50,
//         transformOrigin: "center center",
//         force3D: true,
//       });
//     };

//     /**
//      * Measures actual client bounding rectangles and updates the S-curve coordinates.
//      */
//     const recalculateJourney = () => {
//       const secRect = section.getBoundingClientRect();
//       const rectA = anchorA.getBoundingClientRect();
//       const rectB = anchorB.getBoundingClientRect();

//       // Compute position relative to the section's top-left
//       const xA = rectA.left - secRect.left + rectA.width / 2;
//       const yA = rectA.top - secRect.top + rectA.height / 2;

//       const xB = rectB.left - secRect.left + rectB.width / 2;
//       const yB = rectB.top - secRect.top + rectB.height / 2;

//       const dy = yB - yA;

//       // Calculate perfect S-curve path
//       const dVal = `M ${xA} ${yA} C ${xA} ${yA + dy * 0.40}, ${xB} ${yB - dy * 0.40}, ${xB} ${yB}`;
//       pathEl.setAttribute("d", dVal);

//       // Measure the new path length
//       const pathLength = pathEl.getTotalLength() || 520;

//       // Save calculated parameters
//       journeyMetricsRef.current = {
//         xA,
//         yA,
//         xB,
//         yB,
//         pathLength,
//       };

//       // Set SVG text label coordinate directly under Anchor B
//       labelEl.setAttribute("x", String(xB));
//       labelEl.setAttribute("y", String(yB + 45));

//       // Reset path stroke dashes
//       gsap.set(pathEl, {
//         strokeDasharray: String(pathLength),
//         strokeDashoffset: String(pathLength * (1 - sphereProgress.val)),
//       });

//       // Recalculate sphere positions
//       updateSphere();
//     };

//     // Initialize layout dimensions
//     recalculateJourney();

//     // ── Setup GSAP ScrollTrigger Context ─────────────────────────────────────
//     const ctx = gsap.context(() => {
//       // Set initial state for Card 2 elements (Card 1 is already visible first)
//       gsap.set([card2Image, card2Text], {
//         opacity: 0,
//         y: 20,
//         filter: "blur(10px)",
//       });
//       gsap.set(labelEl, { opacity: 0 });

//       // Create Scrub-driven timeline
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: cardsContainer,
//           start: "top 55%",
//           end: "bottom 55%",
//           scrub: 1.2,
//           invalidateOnRefresh: true,
//           onRefresh: recalculateJourney, // recalculate metrics on scroll refresh
//         },
//         onUpdate: updateSphere,
//       });

//       scrollTimelineRef.current = tl;

//       // 1. Path drawing (strokeDashoffset: pathLength -> 0)
//       tl.to(
//         pathEl,
//         {
//           strokeDashoffset: 0,
//           duration: 0.8,
//           ease: "power2.inOut",
//         },
//         0
//       );

//       // 2. Sphere travel progress (val: 0 -> 1)
//       tl.to(
//         sphereProgress,
//         {
//           val: 1,
//           duration: 0.8,
//           ease: "power2.inOut",
//         },
//         0
//       );

//       // 3. Card 2 reveal as the sphere approaches (progress 0.45 to 0.65)
//       tl.to(
//         card2Image,
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 0.2,
//           ease: "power2.out",
//         },
//         0.45
//       );
//       tl.to(
//         card2Text,
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 0.2,
//           ease: "power2.out",
//         },
//         0.52
//       );

//       // 4. Subtle overshoot settle at final destination (Anchor B)
//       tl.to(
//         sphereOffset,
//         {
//           x: -2,
//           y: 2,
//           duration: 0.04,
//           ease: "power1.out",
//         },
//         0.8
//       );
//       tl.to(
//         sphereOffset,
//         {
//           x: 0,
//           y: 0,
//           duration: 0.04,
//           ease: "power1.inOut",
//         },
//         0.84
//       );

//       // 5. "More to come" label fades in (progress 0.85 to 1.0)
//       tl.to(
//         labelEl,
//         {
//           opacity: 0.25,
//           duration: 0.15,
//           ease: "power1.inOut",
//         },
//         0.85
//       );
//     }, section);

//     // Event listeners to handle updates on layout changes
//     window.addEventListener("resize", recalculateJourney);

//     // Stable layout delays
//     const timer = setTimeout(recalculateJourney, 150);

//     return () => {
//       ctx.revert();
//       window.removeEventListener("resize", recalculateJourney);
//       clearTimeout(timer);
//     };
//   }, []);

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <section
//       ref={sectionRef}
//       id="experience"
//       className="relative bg-[#050505] text-[#f5f5f5] overflow-hidden py-32 md:py-48 w-full flex justify-center border-b border-[#111111]"
//       aria-label="Experience"
//     >
//       {/* Background grain and gradient overlays */}
//       <div
//         className="absolute inset-0 pointer-events-none z-0"
//         style={{
//           backgroundImage:
//             "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
//           backgroundRepeat: "repeat",
//           backgroundSize: "128px 128px",
//           opacity: 0.5,
//         }}
//       />
//       <div
//         className="absolute inset-0 pointer-events-none z-0"
//         style={{
//           background:
//             "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #050505 100%)",
//         }}
//       />

//       {/* Main Container */}
//       <div className="relative z-10 max-w-[1400px] w-full px-6 md:px-16 lg:px-24 flex flex-col items-center">

//         {/* Title Area */}
//         <div className="w-full text-left mb-28 md:mb-40">
//           <span className="block font-mono text-[10px] uppercase tracking-[0.38em] text-[#555555] mb-4">
//             04 / Experience
//           </span>
//           <h2 className="font-display font-black uppercase text-[#ECECEC] leading-none tracking-tight text-[clamp(3.5rem,10vw,8.5rem)]">
//             EXPERIENCE
//           </h2>
//         </div>

//         {/* Timeline Content Grid */}
//         <div ref={cardsContainerRef} className="relative w-full">

//           {/* Centered Floating Journey Layer (Desktop only) */}
//           <div className="invisible lg:visible absolute inset-0 pointer-events-none z-20 w-full h-full">
//             <svg
//               className="w-full h-full overflow-visible"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//             >
//               <defs>
//                 {/* Sphere clipping circle */}
//                 <clipPath id="exp-sphere-clip">
//                   <circle cx="0" cy="0" r="40" />
//                 </clipPath>
//               </defs>

//               {/* S-curve path (dynamic coordinates set relative to DOM anchors) */}
//               <path
//                 ref={pathRef}
//                 fill="none"
//                 stroke="rgba(255,255,255,0.42)"
//                 strokeWidth="1.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ willChange: "stroke-dashoffset" }}
//               />

//               {/* The sphere group scaled to 72% */}
//               <g
//                 ref={sphereRef}
//                 style={{ willChange: "transform, opacity" }}
//               >
//                 <g transform="scale(0.72)" style={{ transformOrigin: "0px 0px" }}>
//                   <g clipPath="url(#exp-sphere-clip)">
//                     <circle cx="0" cy="0" r="40" fill="#F1F1F1" />
//                     <ellipse cx="12" cy="12" rx="36" ry="34" fill="#ECECEC" opacity="0.50" />
//                     <ellipse cx="-12" cy="-12" rx="18" ry="12" fill="#FFFFFF" opacity="0.60" />
//                   </g>
//                   {/* Sphere contact shadow */}
//                   <ellipse cx="0" cy="44" rx="22" ry="3.5" fill="#ECECEC" opacity="0.28" />
//                 </g>
//               </g>

//               {/* "More to come" label dynamically positioned under Anchor B */}
//               <text
//                 ref={labelRef}
//                 textAnchor="middle"
//                 style={{
//                   fontFamily: "var(--font-geist-mono), monospace",
//                   fontSize: "9px",
//                   fontWeight: 300,
//                   letterSpacing: "0.42em",
//                   textTransform: "uppercase",
//                   fill: "#ffffff",
//                   opacity: 0,
//                   willChange: "opacity",
//                 }}
//               >
//                 More to come
//               </text>
//             </svg>
//           </div>

//           {/* Cards Wrapper */}
//           <div className="flex flex-col gap-48 lg:gap-80 relative w-full">

//             {/* Card 1 — Left Aligned (Experience 1) */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start w-full relative">
//               {/* Left Column: Content */}
//               <article className="flex flex-col w-full">

//                 {/* Grayscale to color transition image with rounded corners and editorial aspect ratio */}
//                 <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-[#0d0d0d]">
//                   <Image
//                     src={EXPERIENCES[0].image}
//                     alt={EXPERIENCES[0].imageAlt}
//                     fill
//                     priority
//                     sizes="(max-width: 768px) 100vw, 600px"
//                     className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-[1.01] hover:scale-100"
//                   />
//                 </div>

//                 {/* Editorial Typography Details */}
//                 <div className="flex flex-col">
//                   <div className="flex flex-col mb-4">
//                     <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.8rem,3.5vw,2.6rem)] leading-none tracking-tight">
//                       {EXPERIENCES[0].company}
//                     </h3>
//                     <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
//                       {EXPERIENCES[0].location}
//                     </span>
//                   </div>

//                   <div className="flex flex-col mb-6">
//                     <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
//                       {EXPERIENCES[0].role}
//                     </span>
//                     <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
//                       {EXPERIENCES[0].duration}
//                     </span>
//                   </div>

//                   <div className="border-t border-[#1a1a1a] pt-6">
//                     <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-4">
//                       Worked On
//                     </span>
//                     <ul className="flex flex-col gap-3">
//                       {EXPERIENCES[0].responsibilities.map((resp, idx) => (
//                         <li
//                           key={idx}
//                           className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#333333]" />
//                           {resp}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//               </article>

//               {/* Right Column: Empty on desktop, contains Anchor A (Starting Point) */}
//               <div className="relative h-full min-h-[250px] lg:min-h-0 w-full flex items-center justify-center">
//                 <div
//                   ref={anchorARef}
//                   className="absolute bottom-1/4 right-[25%] w-1.5 h-1.5 bg-transparent pointer-events-none"
//                   aria-hidden="true"
//                 />
//               </div>
//             </div>

//             {/* Card 2 — Right Aligned (Experience 2) */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start w-full relative">
//               {/* Left Column: Empty on desktop, contains Anchor B (Destination Point) */}
//               <div className="relative h-full min-h-[100px] lg:min-h-0 w-full flex items-center justify-center">
//                 <div
//                   ref={anchorBRef}
//                   className="absolute top-1/4 left-[25%] w-1.5 h-1.5 bg-transparent pointer-events-none"
//                   aria-hidden="true"
//                 />
//               </div>

//               {/* Right Column: Content */}
//               <article className="flex flex-col w-full">

//                 {/* Grayscale to color transition image with rounded corners and editorial aspect ratio */}
//                 <div
//                   ref={card2ImageRef}
//                   className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-[#0d0d0d] will-change-[transform,opacity,filter]"
//                 >
//                   <Image
//                     src={EXPERIENCES[1].image}
//                     alt={EXPERIENCES[1].imageAlt}
//                     fill
//                     sizes="(max-width: 768px) 100vw, 600px"
//                     className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-[1.01] hover:scale-100"
//                   />
//                 </div>

//                 {/* Editorial Typography Details */}
//                 <div ref={card2TextRef} className="flex flex-col will-change-[transform,opacity,filter]">
//                   <div className="flex flex-col mb-4">
//                     <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.8rem,3.5vw,2.6rem)] leading-none tracking-tight">
//                       {EXPERIENCES[1].company}
//                     </h3>
//                     <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
//                       {EXPERIENCES[1].location}
//                     </span>
//                   </div>

//                   <div className="flex flex-col mb-6">
//                     <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
//                       {EXPERIENCES[1].role}
//                     </span>
//                     <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
//                       {EXPERIENCES[1].duration}
//                     </span>
//                   </div>

//                   <div className="border-t border-[#1a1a1a] pt-6">
//                     <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-4">
//                       Worked On
//                     </span>
//                     <ul className="flex flex-col gap-3">
//                       {EXPERIENCES[1].responsibilities.map((resp, idx) => (
//                         <li
//                           key={idx}
//                           className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#333333]" />
//                           {resp}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//               </article>
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

// "use client";

// /**
//  * ExperienceSection
//  * ─────────────────────────────────────────────────────────────────────────────
//  * A premium editorial experience section featuring a dynamic snake-like
//  * journey path that draws progressively as you scroll.
//  *
//  * Architecture:
//  *   • Snake-like S-curve SVG path between experience cards
//  *   • Progressive dash drawing animation
//  *   • Sphere leads the path with tangent rotation
//  *   • Premium Apple Maps-style journey animation
//  *   • Perfect scroll-driven scrub with GSAP
//  */

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { gsap, ScrollTrigger } from "@/lib/gsap";

// // ─── Experience data ──────────────────────────────────────────────────────────

// const EXPERIENCES = [
//   {
//     id: "exp-01",
//     index: "01",
//     company: "INAI Worlds Pvt Ltd",
//     location: "Surat",
//     role: "MERN Stack Developer",
//     duration: "3 Months",
//     responsibilities: ["Frontend Development", "REST API Integration"],
//     image: "/company_inai.png",
//     imageAlt: "INAI Worlds — Technology Studio",
//   },
//   {
//     id: "exp-02",
//     index: "02",
//     company: "Parashift Technologies",
//     location: "Jogeshwari, Mumbai",
//     role: "Frontend Developer Intern",
//     duration: "Current",
//     responsibilities: ["Next.js", "TypeScript"],
//     image: "/company_frontend.png",
//     imageAlt: "Parashift Technologies — Frontend Developer Intern",
//   },
// ] as const;

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ExperienceSection() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const cardsContainerRef = useRef<HTMLDivElement>(null);
//   const [isDesktop, setIsDesktop] = useState(false);

//   // Refs for anchors
//   const anchorARef = useRef<HTMLDivElement>(null);
//   const anchorBRef = useRef<HTMLDivElement>(null);

//   // Refs for Journey elements
//   const pathRef = useRef<SVGPathElement>(null);
//   const sphereRef = useRef<SVGGElement>(null);
//   const glowRef = useRef<SVGCircleElement>(null);
//   const trailRef = useRef<SVGPathElement>(null);

//   // Refs for Card 2 elements
//   const card2ImageRef = useRef<HTMLDivElement>(null);
//   const card2TextRef = useRef<HTMLDivElement>(null);

//   // Journey metrics cache
//   const journeyMetricsRef = useRef<{
//     xA: number;
//     yA: number;
//     xB: number;
//     yB: number;
//     pathLength: number;
//     controlPoints: {
//       cx1: number;
//       cy1: number;
//       cx2: number;
//       cy2: number;
//     };
//   } | null>(null);

//   const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);

//   // Check if desktop
//   useEffect(() => {
//     const checkDesktop = () => {
//       setIsDesktop(window.innerWidth >= 1024);
//     };
//     checkDesktop();
//     window.addEventListener("resize", checkDesktop);
//     return () => window.removeEventListener("resize", checkDesktop);
//   }, []);

//   useEffect(() => {
//     if (!isDesktop) return;

//     const section = sectionRef.current;
//     const cardsContainer = cardsContainerRef.current;
//     const anchorA = anchorARef.current;
//     const anchorB = anchorBRef.current;
//     const pathEl = pathRef.current;
//     const sphereEl = sphereRef.current;
//     const glowEl = glowRef.current;
//     const trailEl = trailRef.current;

//     const card2Image = card2ImageRef.current;
//     const card2Text = card2TextRef.current;

//     if (
//       !section ||
//       !cardsContainer ||
//       !anchorA ||
//       !anchorB ||
//       !pathEl ||
//       !sphereEl ||
//       !glowEl ||
//       !trailEl ||
//       !card2Image ||
//       !card2Text
//     ) {
//       return;
//     }

//     // Proxy properties
//     const sphereProgress = { val: 0 };
//     const sphereOffset = { x: 0, y: 0 };
//     const trailProgress = { val: 0 };

//     /**
//      * Creates a snake-like S-curve path from A to B
//      * With multiple control points for organic flow
//      */
//     const createSnakePath = (
//       xA: number,
//       yA: number,
//       xB: number,
//       yB: number,
//     ) => {
//       const dx = xB - xA;
//       const dy = yB - yA;

//       // Snake-like S-curve with multiple control points for organic feel
//       const cx1 = xA + dx * 0.15;
//       const cy1 = yA + dy * 0.1;
//       const cx2 = xA + dx * 0.35;
//       const cy2 = yA + dy * 0.4;
//       const cx3 = xB - dx * 0.35;
//       const cy3 = yB - dy * 0.4;
//       const cx4 = xB - dx * 0.15;
//       const cy4 = yB - dy * 0.1;

//       return {
//         d: `M ${xA} ${yA} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${(xA + xB) / 2} ${(yA + yB) / 2} C ${cx3} ${cy3}, ${cx4} ${cy4}, ${xB} ${yB}`,
//         controlPoints: { cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4 },
//       };
//     };

//     /**
//      * Updates sphere position and rotation along the path
//      */
//     const updateSphere = () => {
//       const progress = sphereProgress.val;
//       const metrics = journeyMetricsRef.current;
//       if (!metrics || !pathEl || !sphereEl) return;

//       const point = pathEl.getPointAtLength(progress * metrics.pathLength);

//       // Calculate tangent for natural rotation
//       const step = 2;
//       const nextProgress = Math.min(1, progress + step / metrics.pathLength);
//       const nextPoint = pathEl.getPointAtLength(
//         nextProgress * metrics.pathLength,
//       );

//       const dx = nextPoint.x - point.x;
//       const dy = nextPoint.y - point.y;

//       let rotation = 0;
//       if (progress < 0.99 && (dx !== 0 || dy !== 0)) {
//         const angle = Math.atan2(dy, dx);
//         const deviation = angle - Math.PI / 2;
//         rotation = Math.max(-3, Math.min(3, deviation * 0.1));
//       }

//       gsap.set(sphereEl, {
//         x: point.x + sphereOffset.x,
//         y: point.y + sphereOffset.y,
//         rotation: rotation,
//         xPercent: -50,
//         yPercent: -50,
//         transformOrigin: "center center",
//         force3D: true,
//       });

//       // Update glow position
//       gsap.set(glowEl, {
//         cx: point.x + sphereOffset.x,
//         cy: point.y + sphereOffset.y,
//       });
//     };

//     /**
//      * Updates the trail dash offset for progressive drawing
//      */
//     const updateTrail = () => {
//       const progress = trailProgress.val;
//       const metrics = journeyMetricsRef.current;
//       if (!metrics || !trailEl) return;

//       // Calculate offset to show only the traveled portion
//       const offset = metrics.pathLength * (1 - progress);
//       gsap.set(trailEl, {
//         strokeDashoffset: offset,
//       });
//     };

//     /**
//      * Recalculates journey metrics on resize/refresh
//      */
//     const recalculateJourney = () => {
//       const secRect = section.getBoundingClientRect();
//       const rectA = anchorA.getBoundingClientRect();
//       const rectB = anchorB.getBoundingClientRect();

//       // Position relative to section
//       const xA = rectA.left - secRect.left + rectA.width / 2;
//       const yA = rectA.top - secRect.top + rectA.height / 2;

//       const xB = rectB.left - secRect.left + rectB.width / 2;
//       const yB = rectB.top - secRect.top + rectB.height / 2;

//       // Create snake-like S-curve
//       const { d, controlPoints } = createSnakePath(xA, yA, xB, yB);
//       pathEl.setAttribute("d", d);
//       trailEl.setAttribute("d", d);

//       const pathLength = pathEl.getTotalLength() || 600;

//       journeyMetricsRef.current = {
//         xA,
//         yA,
//         xB,
//         yB,
//         pathLength,
//         controlPoints,
//       };

//       // Setup progressive trail
//       const dashLength = 12;
//       const gapLength = 14;
//       const totalDash = dashLength + gapLength;

//       gsap.set(trailEl, {
//         strokeDasharray: `${dashLength} ${gapLength}`,
//         strokeDashoffset: pathLength,
//       });

//       // Initial state - nothing visible
//       gsap.set(pathEl, {
//         strokeDasharray: pathLength,
//         strokeDashoffset: pathLength,
//       });

//       updateSphere();
//       updateTrail();
//     };

//     // Initial calculation
//     recalculateJourney();

//     // ── Setup GSAP ScrollTrigger Context ─────────────────────────────────────
//     const ctx = gsap.context(() => {
//       // Initial states
//       gsap.set(card2Image, {
//         opacity: 0,
//         y: 30,
//         filter: "blur(12px)",
//       });
//       gsap.set(card2Text, {
//         opacity: 0,
//         y: 20,
//         filter: "blur(8px)",
//       });
//       gsap.set(sphereEl, { opacity: 0, scale: 0.5 });
//       gsap.set(glowEl, { opacity: 0, r: 35 });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: cardsContainer,
//           start: "top 30%",
//           end: "bottom 30%",
//           scrub: 1.5,
//           invalidateOnRefresh: true,
//           onRefresh: recalculateJourney,
//         },
//         onUpdate: () => {
//           updateSphere();
//           updateTrail();
//         },
//       });

//       scrollTimelineRef.current = tl;

//       // 1. Sphere fades in and scales up
//       tl.to(
//         sphereEl,
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 0.1,
//           ease: "power2.out",
//         },
//         0,
//       );

//       // 2. Glow fades in
//       tl.to(
//         glowEl,
//         {
//           opacity: 0.5,
//           duration: 0.1,
//           ease: "power2.out",
//         },
//         0,
//       );

//       // 3. Path drawing animation - progressively reveals the trail
//       tl.to(
//         trailProgress,
//         {
//           val: 1,
//           duration: 0.9,
//           ease: "power1.inOut",
//         },
//         0,
//       );

//       // 4. Sphere follows the same path
//       tl.to(
//         sphereProgress,
//         {
//           val: 1,
//           duration: 0.9,
//           ease: "power1.inOut",
//         },
//         0,
//       );

//       // 5. Card 2 reveal sequence
//       tl.to(
//         card2Image,
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 0.3,
//           ease: "power2.out",
//         },
//         0.4,
//       );

//       tl.to(
//         card2Text,
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 0.3,
//           ease: "power2.out",
//         },
//         0.5,
//       );

//       // 6. Premium settle animation at destination
//       tl.to(
//         sphereOffset,
//         {
//           x: -3,
//           y: 2,
//           duration: 0.05,
//           ease: "power1.out",
//         },
//         0.88,
//       );

//       tl.to(
//         sphereOffset,
//         {
//           x: 0,
//           y: 0,
//           duration: 0.05,
//           ease: "power1.inOut",
//         },
//         0.93,
//       );

//       // 7. Glow pulse at arrival
//       tl.to(
//         glowEl,
//         {
//           r: 50,
//           duration: 0.08,
//           ease: "power2.out",
//         },
//         0.9,
//       );

//       tl.to(
//         glowEl,
//         {
//           r: 35,
//           duration: 0.08,
//           ease: "power2.in",
//         },
//         0.98,
//       );
//     }, section);

//     // Event listeners
//     const handleResize = () => {
//       recalculateJourney();
//     };

//     window.addEventListener("resize", handleResize);
//     const timer = setTimeout(recalculateJourney, 200);

//     return () => {
//       ctx.revert();
//       window.removeEventListener("resize", handleResize);
//       clearTimeout(timer);
//     };
//   }, [isDesktop]);

//   // ── Render ──────────────────────────────────────────────────────────────────
//   return (
//     <section
//       ref={sectionRef}
//       id="experience"
//       className="relative bg-[#050505] text-[#f5f5f5] overflow-hidden py-24 md:py-32 lg:py-48 w-full flex justify-center border-b border-[#111111]"
//       aria-label="Experience"
//     >
//       {/* Background grain */}
//       <div
//         className="absolute inset-0 pointer-events-none z-0"
//         style={{
//           backgroundImage:
//             "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
//           backgroundRepeat: "repeat",
//           backgroundSize: "128px 128px",
//           opacity: 0.5,
//         }}
//       />

//       {/* Gradient overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none z-0"
//         style={{
//           background:
//             "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #050505 100%)",
//         }}
//       />

//       {/* Main Container */}
//       <div className="relative z-10 max-w-[1400px] w-full px-6 md:px-16 lg:px-24 flex flex-col items-center">
//         {/* Header */}
//         <div className="w-full text-left mb-20 md:mb-32">
//           <span className="block font-mono text-[10px] uppercase tracking-[0.38em] text-[#555555] mb-4">
//             04 / Experience
//           </span>
//           <h2 className="font-display font-black uppercase text-[#ECECEC] leading-none tracking-tight text-[clamp(3rem,8vw,7.5rem)]">
//             EXPERIENCE
//           </h2>
//         </div>

//         {/* Cards Container */}
//         <div ref={cardsContainerRef} className="relative w-full">
//           {/* Journey Overlay - Desktop only */}
//           {isDesktop && (
//             <div className="absolute inset-0 pointer-events-none z-20 w-full h-full">
//               <svg
//                 className="w-full h-full overflow-visible"
//                 xmlns="http://www.w3.org/2000/svg"
//                 aria-hidden="true"
//               >
//                 <defs>
//                   <clipPath id="sphere-clip">
//                     <circle cx="0" cy="0" r="36" />
//                   </clipPath>
//                   <radialGradient id="glow-gradient">
//                     <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
//                     <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
//                   </radialGradient>
//                   <filter id="glow-blur">
//                     <feGaussianBlur stdDeviation="3" result="blur" />
//                     <feMerge>
//                       <feMergeNode in="blur" />
//                       <feMergeNode in="SourceGraphic" />
//                     </feMerge>
//                   </filter>
//                 </defs>

//                 {/* Progressively drawn trail - snake-like path */}
//                 <path
//                   ref={trailRef}
//                   fill="none"
//                   stroke="rgba(255,255,255,0.6)"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeDasharray="12 14"
//                   style={{ willChange: "stroke-dashoffset" }}
//                 />

//                 {/* Faint reference path */}
//                 <path
//                   ref={pathRef}
//                   fill="none"
//                   stroke="rgba(255,255,255,0.08)"
//                   strokeWidth="0.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   style={{ willChange: "stroke-dashoffset" }}
//                 />

//                 {/* Glow behind sphere */}
//                 <circle
//                   ref={glowRef}
//                   r="35"
//                   fill="url(#glow-gradient)"
//                   opacity="0"
//                   style={{ willChange: "opacity, cx, cy, r" }}
//                 />

//                 {/* Premium sphere with Apple-style design */}
//                 <g ref={sphereRef} style={{ willChange: "transform, opacity" }}>
//                   <g
//                     transform="scale(0.65)"
//                     style={{ transformOrigin: "0px 0px" }}
//                   >
//                     <g clipPath="url(#sphere-clip)">
//                       {/* Base */}
//                       <circle cx="0" cy="0" r="36" fill="#F5F5F5" />

//                       {/* Inner shadow */}
//                       <ellipse
//                         cx="14"
//                         cy="14"
//                         rx="32"
//                         ry="30"
//                         fill="#E8E8E8"
//                         opacity="0.25"
//                       />

//                       {/* Top highlight */}
//                       <ellipse
//                         cx="-12"
//                         cy="-12"
//                         rx="18"
//                         ry="12"
//                         fill="#FFFFFF"
//                         opacity="0.6"
//                       />

//                       {/* Specular highlight */}
//                       <circle
//                         cx="-8"
//                         cy="-8"
//                         r="3.5"
//                         fill="#FFFFFF"
//                         opacity="0.8"
//                       />

//                       {/* Rim light */}
//                       <ellipse
//                         cx="20"
//                         cy="20"
//                         rx="28"
//                         ry="26"
//                         fill="none"
//                         stroke="#FFFFFF"
//                         strokeWidth="0.5"
//                         opacity="0.15"
//                       />
//                     </g>

//                     {/* Contact shadow */}
//                     <ellipse
//                       cx="0"
//                       cy="40"
//                       rx="18"
//                       ry="2.5"
//                       fill="#F5F5F5"
//                       opacity="0.15"
//                     />
//                   </g>
//                 </g>
//               </svg>
//             </div>
//           )}

//           {/* Cards */}
//           <div className="flex flex-col gap-32 md:gap-40 lg:gap-60 relative w-full">
//             {/* Card 1 - Left */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start w-full relative">
//               <article className="flex flex-col w-full">
//                 {/* Image */}
//                 <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#0d0d0d] group">
//                   <Image
//                     src={EXPERIENCES[0].image}
//                     alt={EXPERIENCES[0].imageAlt}
//                     fill
//                     priority
//                     sizes="(max-width: 768px) 100vw, 600px"
//                     className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-[1.02] group-hover:scale-100"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="flex flex-col">
//                   <div className="flex flex-col mb-3">
//                     <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-tight">
//                       {EXPERIENCES[0].company}
//                     </h3>
//                     <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
//                       {EXPERIENCES[0].location}
//                     </span>
//                   </div>

//                   <div className="flex flex-col mb-5">
//                     <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
//                       {EXPERIENCES[0].role}
//                     </span>
//                     <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
//                       {EXPERIENCES[0].duration}
//                     </span>
//                   </div>

//                   <div className="border-t border-[#1a1a1a] pt-5">
//                     <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-3">
//                       Worked On
//                     </span>
//                     <ul className="flex flex-col gap-2.5">
//                       {EXPERIENCES[0].responsibilities.map((resp, idx) => (
//                         <li
//                           key={idx}
//                           className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#333333] flex-shrink-0" />
//                           {resp}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </article>

//               {/* Anchor A - positioned at center-right of card */}
//               <div className="relative h-full min-h-[200px] lg:min-h-0 w-full flex items-center justify-center">
//                 <div
//                   ref={anchorARef}
//                   className="absolute top-[35%] right-[15%] w-2 h-2 bg-transparent pointer-events-none"
//                   aria-hidden="true"
//                 />
//               </div>
//             </div>

//             {/* Card 2 - Right */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start w-full relative">
//               {/* Anchor B - positioned at center-left of card */}
//               <div className="relative h-full min-h-[100px] lg:min-h-0 w-full flex items-center justify-center">
//                 <div
//                   ref={anchorBRef}
//                   className="absolute top-[25%] left-[15%] w-2 h-2 bg-transparent pointer-events-none"
//                   aria-hidden="true"
//                 />
//               </div>

//               <article className="flex flex-col w-full">
//                 <div
//                   ref={card2ImageRef}
//                   className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#0d0d0d] group will-change-[transform,opacity,filter]"
//                 >
//                   <Image
//                     src={EXPERIENCES[1].image}
//                     alt={EXPERIENCES[1].imageAlt}
//                     fill
//                     sizes="(max-width: 768px) 100vw, 600px"
//                     className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-[1.02] group-hover:scale-100"
//                   />
//                 </div>

//                 <div
//                   ref={card2TextRef}
//                   className="flex flex-col will-change-[transform,opacity,filter]"
//                 >
//                   <div className="flex flex-col mb-3">
//                     <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-tight">
//                       {EXPERIENCES[1].company}
//                     </h3>
//                     <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
//                       {EXPERIENCES[1].location}
//                     </span>
//                   </div>

//                   <div className="flex flex-col mb-5">
//                     <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
//                       {EXPERIENCES[1].role}
//                     </span>
//                     <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
//                       {EXPERIENCES[1].duration}
//                     </span>
//                   </div>

//                   <div className="border-t border-[#1a1a1a] pt-5">
//                     <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-3">
//                       Worked On
//                     </span>
//                     <ul className="flex flex-col gap-2.5">
//                       {EXPERIENCES[1].responsibilities.map((resp, idx) => (
//                         <li
//                           key={idx}
//                           className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#333333] flex-shrink-0" />
//                           {resp}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </article>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

/**
 * ExperienceSection
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium editorial experience section with cinematic journey animation.
 * Features a handcrafted S-curve path that draws progressively as you scroll,
 * with a sphere that follows the path with natural weight and momentum.
 *
 * Architecture:
 *   • Handcrafted organic S-curve between experience cards
 *   • Progressive dash-by-dash drawing animation
 *   • Sphere follows exact SVG path using getPointAtLength
 *   • 12% chase delay between path and sphere for cinematic feel
 *   • Weighted easing with subtle acceleration/deceleration
 *   • Apple-quality minimal aesthetic
 */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Experience data ──────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    id: "exp-01",
    index: "01",
    company: "INAI Worlds Pvt Ltd",
    location: "Surat",
    role: "MERN Stack Developer",
    duration: "3 Months",
    responsibilities: ["Frontend Development", "REST API Integration"],
    image: "/company_inai.png",
    imageAlt: "INAI Worlds — Technology Studio",
  },
  {
    id: "exp-02",
    index: "02",
    company: "Parashift Technologies",
    location: "Jogeshwari, Mumbai",
    role: "Frontend Developer Intern",
    duration: "Current",
    responsibilities: ["Next.js", "TypeScript"],
    image: "/company_frontend.png",
    imageAlt: "Parashift Technologies — Frontend Developer Intern",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Refs for anchors
  const anchorARef = useRef<HTMLDivElement>(null);
  const anchorBRef = useRef<HTMLDivElement>(null);

  // Refs for Journey elements
  const pathRef = useRef<SVGPathElement>(null);
  const sphereRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  // Refs for Card 2 elements
  const card2ImageRef = useRef<HTMLDivElement>(null);
  const card2TextRef = useRef<HTMLDivElement>(null);

  // Journey state - using refs to avoid React re-renders
  const journeyState = useRef({
    pathLength: 0,
    currentProgress: 0,
    targetProgress: 0,
    isDrawing: false,
  });

  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  /**
   * Creates a handcrafted organic S-curve
   * Not robotic, not exaggerated - just natural
   */
  const createOrganicCurve = (
    xA: number,
    yA: number,
    xB: number,
    yB: number,
  ) => {
    const dx = xB - xA;
    const dy = yB - yA;
    const midX = (xA + xB) / 2;
    const midY = (yA + yB) / 2;

    // Organic S-curve with subtle, natural control points
    // The curve should feel like a designer drew it by hand
    const cx1 = xA + dx * 0.15;
    const cy1 = yA + dy * 0.05;
    const cx2 = xA + dx * 0.35;
    const cy2 = yA + dy * 0.35;
    const cx3 = xB - dx * 0.35;
    const cy3 = yB - dy * 0.35;
    const cx4 = xB - dx * 0.15;
    const cy4 = yB - dy * 0.05;

    // Add a slight organic wobble to make it feel hand-drawn
    const wobble = (t: number) => {
      const wave = Math.sin(t * Math.PI * 2) * 0.03;
      return wave;
    };

    return {
      d: `M ${xA} ${yA} C ${cx1} ${cy1 + wobble(0.1)}, ${cx2} ${cy2 + wobble(0.3)}, ${midX + wobble(0.5)} ${midY + wobble(0.5)} C ${cx3} ${cy3 + wobble(0.7)}, ${cx4} ${cy4 + wobble(0.9)}, ${xB} ${yB}`,
    };
  };

  /**
   * Updates sphere position and rotation along the exact SVG path
   * Using getPointAtLength for true path-following
   */
  const updateSphere = (progress: number) => {
    const path = pathRef.current;
    const sphere = sphereRef.current;
    if (!path || !sphere || !journeyState.current.pathLength) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const point = path.getPointAtLength(
      clampedProgress * journeyState.current.pathLength,
    );

    // Calculate tangent for natural orientation
    const step = Math.max(1, journeyState.current.pathLength * 0.001);
    const nextProgress = Math.min(
      1,
      clampedProgress + step / journeyState.current.pathLength,
    );
    const nextPoint = path.getPointAtLength(
      nextProgress * journeyState.current.pathLength,
    );

    const dx = nextPoint.x - point.x;
    const dy = nextPoint.y - point.y;

    // Calculate angle for subtle rotation following the path
    let rotation = 0;
    if (dx !== 0 || dy !== 0) {
      const angle = Math.atan2(dy, dx);
      const deviation = angle - Math.PI / 2;
      rotation = Math.max(-2, Math.min(2, deviation * 0.08));
    }

    // Apply transforms using GSAP for smooth GPU-accelerated updates
    gsap.set(sphere, {
      x: point.x,
      y: point.y,
      rotation: rotation,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
      force3D: true,
    });
  };

  /**
   * Updates the trail drawing state
   * The path should appear dash by dash as user scrolls
   */
  const updateTrail = (progress: number) => {
    const trail = trailRef.current;
    const path = pathRef.current;
    if (!trail || !path || !journeyState.current.pathLength) return;

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const offset = journeyState.current.pathLength * (1 - clampedProgress);

    // Progressive dash drawing
    gsap.set(trail, {
      strokeDashoffset: offset,
    });
  };

  /**
   * Main animation loop - handles the 12% chase delay
   * and weighted easing for cinematic feel
   */
  const animateJourney = () => {
    const state = journeyState.current;
    if (!state.pathLength) return;

    // Apply weighted easing - subtle acceleration/deceleration
    const delta = state.targetProgress - state.currentProgress;
    const easingFactor = 0.12; // 12% chase delay as requested
    const weightedDelta = delta * easingFactor;

    // Add tiny momentum for natural feel
    const momentum = weightedDelta * 0.15;

    state.currentProgress += weightedDelta + momentum;

    // Prevent overshoot
    if (state.currentProgress > state.targetProgress) {
      state.currentProgress = state.targetProgress;
    }

    // Update visual elements
    updateSphere(state.currentProgress);
    updateTrail(state.currentProgress);

    // Continue animation loop
    if (state.isDrawing) {
      animationFrameRef.current = requestAnimationFrame(animateJourney);
    }
  };

  /**
   * Recalculates journey metrics on resize/refresh
   */
  const recalculateJourney = () => {
    const section = sectionRef.current;
    const anchorA = anchorARef.current;
    const anchorB = anchorBRef.current;
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;

    if (!section || !anchorA || !anchorB || !pathEl || !trailEl) return;

    const secRect = section.getBoundingClientRect();
    const rectA = anchorA.getBoundingClientRect();
    const rectB = anchorB.getBoundingClientRect();

    // Position relative to section
    const xA = rectA.left - secRect.left + rectA.width / 2;
    const yA = rectA.top - secRect.top + rectA.height / 2;
    const xB = rectB.left - secRect.left + rectB.width / 2;
    const yB = rectB.top - secRect.top + rectB.height / 2;

    // Create organic handcrafted curve
    const { d } = createOrganicCurve(xA, yA, xB, yB);
    pathEl.setAttribute("d", d);
    trailEl.setAttribute("d", d);

    // Get path length for calculations
    const pathLength = pathEl.getTotalLength() || 600;
    journeyState.current.pathLength = pathLength;

    // Setup trail with rounded dashes - premium aesthetic
    const dashLength = 10;
    const gapLength = 16;
    const totalDash = dashLength + gapLength;

    gsap.set(trailEl, {
      strokeDasharray: `${dashLength} ${gapLength}`,
      strokeDashoffset: pathLength,
      strokeLinecap: "round",
    });

    // Initial state - nothing visible until scroll
    gsap.set(pathEl, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
  };

  useEffect(() => {
    if (!isDesktop) return;

    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const card2Image = card2ImageRef.current;
    const card2Text = card2TextRef.current;

    if (!section || !cardsContainer || !card2Image || !card2Text) {
      return;
    }

    // Initial calculation
    recalculateJourney();

    // ── Setup GSAP ScrollTrigger Context ─────────────────────────────────────
    const ctx = gsap.context(() => {
      // Initial states - nothing visible until scroll starts
      gsap.set(card2Image, {
        opacity: 0,
        y: 40,
        filter: "blur(16px)",
      });
      gsap.set(card2Text, {
        opacity: 0,
        y: 30,
        filter: "blur(12px)",
      });
      gsap.set(sphereRef.current, { opacity: 0, scale: 0.6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsContainer,
          start: "top 25%",
          end: "bottom 25%",
          scrub: 1.2,
          invalidateOnRefresh: true,
          onRefresh: recalculateJourney,
          onUpdate: (self) => {
            // Update target progress based on scroll
            const progress = self.progress;
            journeyState.current.targetProgress = progress;

            // Start/stop animation loop based on scroll state
            if (progress > 0 && progress < 1) {
              if (!journeyState.current.isDrawing) {
                journeyState.current.isDrawing = true;
                if (animationFrameRef.current === null) {
                  animationFrameRef.current =
                    requestAnimationFrame(animateJourney);
                }
              }
            } else if (progress >= 1) {
              journeyState.current.isDrawing = false;
              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
              }
              // Ensure final position is exact
              updateSphere(1);
              updateTrail(1);
            } else if (progress === 0) {
              journeyState.current.isDrawing = false;
              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
              }
              // Reset to initial state
              updateSphere(0);
              updateTrail(0);
            }
          },
        },
      });

      scrollTimelineRef.current = tl;

      // 1. Sphere fades in with weight
      tl.to(
        sphereRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        },
        0,
      );

      // 2. Card 2 reveal - cinematic sequence
      tl.to(
        card2Image,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power3.out",
        },
        0.35,
      );

      tl.to(
        card2Text,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "power3.out",
        },
        0.45,
      );

      // 3. Final subtle settle at destination
      tl.to(
        sphereRef.current,
        {
          scale: 0.98,
          duration: 0.08,
          ease: "power1.inOut",
        },
        0.92,
      );

      tl.to(
        sphereRef.current,
        {
          scale: 1,
          duration: 0.08,
          ease: "power1.inOut",
        },
        0.98,
      );
    }, section);

    // ── Event listeners for resize ──────────────────────────────────────────
    const handleResize = () => {
      recalculateJourney();
    };

    window.addEventListener("resize", handleResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isDesktop]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-[#050505] text-[#f5f5f5] overflow-hidden py-24 md:py-32 lg:py-48 w-full flex justify-center border-b border-[#111111]"
      aria-label="Experience"
    >
      {/* Background grain - subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.5,
        }}
      />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #050505 100%)",
        }}
      />

      {/* Main Container - Increased padding for breathing room */}
      <div className="relative z-10 max-w-[1400px] w-full px-8 md:px-20 lg:px-28 flex flex-col items-center">
        {/* Header */}
        <div className="w-full text-left mb-20 md:mb-32">
          <span className="block font-mono text-[10px] uppercase tracking-[0.38em] text-[#555555] mb-4">
            04 / Experience
          </span>
          <h2 className="font-display font-black uppercase text-[#ECECEC] leading-none tracking-tight text-[clamp(3rem,8vw,7.5rem)]">
            EXPERIENCE
          </h2>
        </div>

        {/* Cards Container */}
        <div ref={cardsContainerRef} className="relative w-full">
          {/* Journey Overlay - Desktop only */}
          {isDesktop && (
            <div className="absolute inset-0 pointer-events-none z-20 w-full h-full">
              <svg
                className="w-full h-full overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id="sphere-clip">
                    <circle cx="0" cy="0" r="36" />
                  </clipPath>
                  <radialGradient id="sphere-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Progressively drawn trail - premium rounded dashes */}
                <path
                  ref={trailRef}
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 16"
                  style={{
                    willChange: "stroke-dashoffset",
                    transition: "none",
                  }}
                />

                {/* Faint reference path - subtle guide */}
                <path
                  ref={pathRef}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ willChange: "stroke-dashoffset" }}
                />

                {/* Subtle glow behind sphere */}
                <circle
                  cx="0"
                  cy="0"
                  r="50"
                  fill="url(#sphere-glow)"
                  opacity="0"
                  className="sphere-glow"
                  style={{ willChange: "opacity, cx, cy" }}
                />

                {/* Premium minimal sphere - matte, no reflections */}
                <g ref={sphereRef} style={{ willChange: "transform, opacity" }}>
                  <g
                    transform="scale(0.6)"
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    <g clipPath="url(#sphere-clip)">
                      {/* Solid matte base */}
                      <circle cx="0" cy="0" r="36" fill="#F5F5F5" />

                      {/* Very subtle inner shadow for depth */}
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="32"
                        ry="30"
                        fill="#E8E8E8"
                        opacity="0.15"
                      />

                      {/* Soft top highlight - minimal */}
                      <ellipse
                        cx="-8"
                        cy="-8"
                        rx="20"
                        ry="14"
                        fill="#FFFFFF"
                        opacity="0.4"
                      />

                      {/* Single specular point */}
                      <circle
                        cx="-6"
                        cy="-6"
                        r="3"
                        fill="#FFFFFF"
                        opacity="0.6"
                      />

                      {/* Fine rim light */}
                      <ellipse
                        cx="18"
                        cy="18"
                        rx="28"
                        ry="26"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="0.3"
                        opacity="0.1"
                      />
                    </g>

                    {/* Contact shadow */}
                    <ellipse
                      cx="0"
                      cy="38"
                      rx="16"
                      ry="2"
                      fill="#F5F5F5"
                      opacity="0.1"
                    />
                  </g>
                </g>
              </svg>
            </div>
          )}

          {/* Cards */}
          <div className="flex flex-col gap-32 md:gap-40 lg:gap-60 relative w-full">
            {/* Card 1 - Left */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start w-full relative">
              <article className="flex flex-col w-full">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#0d0d0d] group">
                  <Image
                    src={EXPERIENCES[0].image}
                    alt={EXPERIENCES[0].imageAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-[1.02] group-hover:scale-100"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <div className="flex flex-col mb-3">
                    <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-tight">
                      {EXPERIENCES[0].company}
                    </h3>
                    <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
                      {EXPERIENCES[0].location}
                    </span>
                  </div>

                  <div className="flex flex-col mb-5">
                    <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
                      {EXPERIENCES[0].role}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
                      {EXPERIENCES[0].duration}
                    </span>
                  </div>

                  <div className="border-t border-[#1a1a1a] pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-3">
                      Worked On
                    </span>
                    <ul className="flex flex-col gap-2.5">
                      {EXPERIENCES[0].responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#333333] flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {/* Anchor A - positioned at center-right of card */}
              <div className="relative h-full min-h-[200px] lg:min-h-0 w-full flex items-center justify-center">
                <div
                  ref={anchorARef}
                  className="absolute top-[35%] right-[15%] w-2 h-2 bg-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Card 2 - Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start w-full relative">
              {/* Anchor B - positioned at center-left of card */}
              <div className="relative h-full min-h-[100px] lg:min-h-0 w-full flex items-center justify-center">
                <div
                  ref={anchorBRef}
                  className="absolute top-[25%] left-[15%] w-2 h-2 bg-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              <article className="flex flex-col w-full">
                <div
                  ref={card2ImageRef}
                  className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#0d0d0d] group will-change-[transform,opacity,filter]"
                >
                  <Image
                    src={EXPERIENCES[1].image}
                    alt={EXPERIENCES[1].imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-[1.02] group-hover:scale-100"
                  />
                </div>

                <div
                  ref={card2TextRef}
                  className="flex flex-col will-change-[transform,opacity,filter]"
                >
                  <div className="flex flex-col mb-3">
                    <h3 className="font-display font-bold uppercase text-[#ECECEC] text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-tight">
                      {EXPERIENCES[1].company}
                    </h3>
                    <span className="font-mono text-xs text-[#555555] uppercase tracking-widest mt-2">
                      {EXPERIENCES[1].location}
                    </span>
                  </div>

                  <div className="flex flex-col mb-5">
                    <span className="text-sm font-mono uppercase tracking-wider text-[#CCCCCC]">
                      {EXPERIENCES[1].role}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#888888] mt-1">
                      {EXPERIENCES[1].duration}
                    </span>
                  </div>

                  <div className="border-t border-[#1a1a1a] pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#444444] block mb-3">
                      Worked On
                    </span>
                    <ul className="flex flex-col gap-2.5">
                      {EXPERIENCES[1].responsibilities.map((resp, idx) => (
                        <li
                          key={idx}
                          className="font-mono text-xs uppercase tracking-wider text-[#888888] flex items-center gap-3"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#333333] flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
