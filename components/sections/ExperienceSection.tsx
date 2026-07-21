// "use client";

// import { useRef } from "react";
// import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// interface Feature {
//   title: string;
//   desc: string;
//   img: string;
// }

// const features: Feature[] = [
//   {
//     title: "Attend Live & Recorded Lectures",
//     desc: "Students can join scheduled sessions or revisit recordings with clear explanations and visuals.",
//     img: "/company_inai.png",
//   },
//   {
//     title: "Personalized AI Tutoring",
//     desc: "Our AI listens and adapts to your learning style, providing targeted help instantly.",
//     img: "/company_frontend.png",
//   },
// ];

// // --- Sub-component for Text to respect Rules of Hooks ---
// const FeatureItemText = ({
//   item,
//   index,
//   total,
//   scrollYProgress,
// }: {
//   item: Feature;
//   index: number;
//   total: number;
//   scrollYProgress: MotionValue<number>;
// }) => {
//   const start = index / total;
//   const end = (index + 1) / total;

//   // Fade in at start of segment, fade out near the end (keep last item visible)
//   const opacity = useTransform(
//     scrollYProgress,
//     index === total - 1
//       ? [start, start + 0.15]
//       : [start, start + 0.15, end - 0.15, end],
//     index === total - 1 ? [0, 1] : [0, 1, 1, 0],
//   );

//   const y = useTransform(
//     scrollYProgress,
//     index === total - 1
//       ? [start, start + 0.15]
//       : [start, start + 0.15, end - 0.15, end],
//     index === total - 1 ? [40, 0] : [40, 0, 0, -40],
//   );

//   return (
//     <motion.div
//       style={{ opacity, y }}
//       className="absolute inset-0 flex flex-col justify-center"
//     >
//       <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
//         {item.title}
//       </h2>
//       <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-md">
//         {item.desc}
//       </p>
//       <div className="mt-8 h-1 w-24 bg-blue-600 rounded-full" />
//     </motion.div>
//   );
// };

// // --- Sub-component for Image to respect Rules of Hooks ---
// const FeatureItemImage = ({
//   item,
//   index,
//   total,
//   scrollYProgress,
// }: {
//   item: Feature;
//   index: number;
//   total: number;
//   scrollYProgress: MotionValue<number>;
// }) => {
//   const start = index / total;
//   const end = (index + 1) / total;

//   const opacity = useTransform(
//     scrollYProgress,
//     index === total - 1
//       ? [start, start + 0.15]
//       : [start, start + 0.15, end - 0.15, end],
//     index === total - 1 ? [0, 1] : [0, 1, 1, 0],
//   );

//   const scale = useTransform(
//     scrollYProgress,
//     index === total - 1
//       ? [start, start + 0.15]
//       : [start, start + 0.15, end - 0.15, end],
//     index === total - 1 ? [0.95, 1] : [0.95, 1, 1, 1.05],
//   );

//   return (
//     <motion.img
//       src={item.img}
//       alt={item.title}
//       style={{ opacity, scale }}
//       className="absolute inset-0 w-full h-full object-cover"
//     />
//   );
// };

// export default function FeatureScroll() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     // Starts calculations exactly when sticky pins and ends when section finishes
//     offset: ["start start", "end end"],
//   });

//   return (
//     <div ref={containerRef} className="relative bg-black">
//       {/* Container height scales dynamically with items count */}
//       <div className="h-[250vh]">
//         <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
//           {/* LEFT SIDE: TEXT */}
//           <div className="w-full md:w-1/2 h-full flex items-center px-8 md:px-20 order-2 md:order-1">
//             <div className="relative w-full h-[400px]">
//               {features.map((item, i) => (
//                 <FeatureItemText
//                   key={i}
//                   item={item}
//                   index={i}
//                   total={features.length}
//                   scrollYProgress={scrollYProgress}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* RIGHT SIDE: IMAGES */}
//           <div className="w-full md:w-1/2 h-full flex items-center justify-center p-6 md:p-12 order-1 md:order-2">
//             <div className="relative w-full aspect-video rounded-[30px] overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
//               {features.map((item, i) => (
//                 <FeatureItemImage
//                   key={i}
//                   item={item}
//                   index={i}
//                   total={features.length}
//                   scrollYProgress={scrollYProgress}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";

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
    role: "Frontend Developer Intern",
    duration: "Current",
    description:
      "Building modern user interfaces using Next.js, TypeScript, Tailwind CSS, and Framer Motion. Focused on responsive layouts, reusable component architecture, smooth animations, and delivering polished user experiences for production applications.",
    img: "/company_frontend.png",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive UI",
    ],
  },
];

// A single, slow, always-completes fade. Scroll no longer drives opacity
// directly — it only decides which index is "active" (see the hysteresis
// listener below). Once that decision is made, this transition runs on
// its own clock and always finishes, so scroll stopping mid-way can never
// freeze two cards in a half-overlapped state.
const FADE_TRANSITION = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

// Sub-component for individual text block
const ExperienceTextCard = ({
  item,
  index,
  total,
  active,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  active: number;
}) => {
  const isActive = index === active;

  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : index < active ? -30 : 30,
      }}
      initial={false}
      transition={FADE_TRANSITION}
      style={{ willChange: "opacity, transform" }}
      className={`absolute inset-0 flex flex-col justify-center py-4 ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Index Number */}
      <span className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase mb-3">
        {item.number} / {total < 10 ? `0${total}` : total}
      </span>

      {/* Company Name */}
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-2">
        {item.company}
      </h3>

      {/* Role */}
      <p className="text-lg md:text-xl font-medium text-white/80 mb-5">
        {item.role}
      </p>

      {/* Meta Bar */}
      <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-white/40 mb-6 border-y border-white/10 py-3">
        <span>{item.location}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{item.duration}</span>
      </div>

      {/* Description */}
      <p className="text-base md:text-lg text-white/60 leading-relaxed font-light max-w-xl mb-6">
        {item.description}
      </p>

      {/* Tags / Chips */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-mono text-white/70 border border-white/15 rounded-full bg-white/[0.02] backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Sub-component for individual image card
const ExperienceImageCard = ({
  item,
  index,
  active,
}: {
  item: ExperienceItem;
  index: number;
  active: number;
}) => {
  const isActive = index === active;

  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.97,
        y: isActive ? 0 : index < active ? -20 : 20,
      }}
      initial={false}
      transition={FADE_TRANSITION}
      style={{ willChange: "opacity, transform" }}
      className={`absolute inset-0 w-full h-full p-2 sm:p-4 ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/60 shadow-2xl backdrop-blur-sm group pointer-events-auto">
        <img
          src={item.img}
          alt={`${item.company} screenshot`}
          className="w-full h-full object-cover grayscale contrast-[1.05] brightness-[0.9] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function FeatureScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start start" ensures card 1 is active right when sticky container locks to top
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    // Scroll only ever picks an index — it never drives opacity directly.
    // Hysteresis (cross 0.58 to advance, 0.42 to go back) stops the trigger
    // from flip-flopping if someone parks the scroll right at the midpoint.
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setActive((prev) => {
        if (prev === 0 && v > 0.58) return 1;
        if (prev === 1 && v < 0.42) return 0;
        return prev;
      });
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section className="relative w-full bg-black text-white selection:bg-white selection:text-black px-6 sm:px-8 md:px-12 lg:px-16">
      {/* Ambient Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Outer Container */}
      <div className="max-w-[1550px] mx-auto">
        {/* SECTION HEADER */}
        <div className="pt-24 pb-12 border-b border-white/10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                [ EXPERIENCE ]
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-[1.08]">
              Industry Experience
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/50 font-light leading-relaxed max-w-2xl">
              Building production-ready applications, collaborating within
              development teams, and contributing to real-world products.
            </p>
          </div>
        </div>

        {/* STICKY ANIMATION CONTAINER */}
        <div ref={containerRef} className="relative">
          <div className="h-[250vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8 overflow-hidden">
              {/* LEFT SIDE: EDITORIAL CONTENT */}
              <div className="w-full md:w-[52%] lg:w-[50%] h-full flex items-center order-2 md:order-1">
                <div className="relative w-full h-[460px]">
                  {experiences.map((item, index) => (
                    <ExperienceTextCard
                      key={index}
                      item={item}
                      index={index}
                      total={experiences.length}
                      active={active}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE: IMAGE PRESENTATION */}
              <div className="w-full md:w-[48%] lg:w-[50%] h-[300px] sm:h-[380px] md:h-[480px] flex items-center justify-center order-1 md:order-2">
                <div className="relative w-full h-full">
                  {experiences.map((item, index) => (
                    <ExperienceImageCard
                      key={index}
                      item={item}
                      index={index}
                      active={active}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
