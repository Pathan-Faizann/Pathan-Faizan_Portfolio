"use client";

/**
 * JourneyOrb.tsx
 * ---------------------------------------------------------------------------
 * Experience section: a floating orb travels between the two cards below as
 * the page scrolls, softly illuminating whichever one it's nearest to.
 * Single-use on purpose — the two experiences are hardcoded, this section
 * will never render anything else.
 *
 * Built on Framer Motion (already in the stack) instead of GSAP so it can't
 * collide with the Embla/horizontal-scroll carousels or Lenis elsewhere on
 * the site.
 *
 * The scroll range is split into one segment per card, sized by each card's
 * real measured height. Inside a segment the orb travels for most of it
 * (88%, see SETTLE_AT) and only settles beside the card near the very end —
 * never early — then stays parked until the next card's segment begins.
 * Illumination is a 0→1 value from the same math, crossfading between cards
 * during each travel phase and holding steady while parked — applied as
 * opacity/scale rather than a per-frame `filter: brightness()`, since real
 * filters repaint the whole layer every frame.
 */

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  useSpring,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

interface Point {
  x: number;
  y: number;
}

const SETTLE_AT = 0.88; // fraction of each card's segment spent travelling before the orb settles

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Quadratic bezier through a slightly offset control point — the subtle curve in the orb's path. */
const quadBezier = (
  p0: Point,
  p1: Point,
  curveStrength: number,
  t: number,
): Point => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const control: Point = {
    x: (p0.x + p1.x) / 2 + nx * curveStrength,
    y: (p0.y + p1.y) / 2 + ny * curveStrength,
  };
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * control.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * control.y + t * t * p1.y,
  };
};

// Orb SVG asset, inserted verbatim.
function OrbGraphic() {
  return (
    <svg
      viewBox="0 0 300 300"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="sphereBody" cx="32%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FDFCFA" />
          <stop offset="40%" stopColor="#F4F2EF" />
          <stop offset="75%" stopColor="#E2DFDA" />
          <stop offset="100%" stopColor="#CFCBC4" />
        </radialGradient>
        <radialGradient id="occlusionGrad" cx="68%" cy="72%" r="65%">
          <stop offset="0%" stopColor="#B8B3AC" stopOpacity="0" />
          <stop offset="70%" stopColor="#B8B3AC" stopOpacity="0" />
          <stop offset="100%" stopColor="#B8B3AC" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="innerCoreGrad" cx="50%" cy="58%" r="45%">
          <stop offset="0%" stopColor="#FFEFDD" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#FFEFDD" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FFEFDD" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="highlightGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4F2EF" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#F4F2EF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F4F2EF" stopOpacity="0" />
        </radialGradient>
        <clipPath id="orb-clip">
          <circle cx="150" cy="132" r="90" />
        </clipPath>
        <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g>
        <ellipse
          cx="150"
          cy="240"
          rx="58"
          ry="13"
          fill="url(#shadowGrad)"
          filter="url(#shadowBlur)"
        />
        <g clipPath="url(#orb-clip)">
          <circle cx="150" cy="132" r="90" fill="url(#sphereBody)" />
          <circle cx="150" cy="132" r="90" fill="url(#occlusionGrad)" />
          <circle cx="150" cy="132" r="90" fill="url(#innerCoreGrad)" />
          <ellipse
            cx="118"
            cy="92"
            rx="34"
            ry="26"
            fill="url(#highlightGrad)"
          />
        </g>
      </g>
    </svg>
  );
}

const JourneyOrb = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Measured, in-section target position for each card, plus each segment's
  // [start, end] scroll-progress bounds. Read live inside the motion-value
  // callbacks below, so a resize never needs to recreate any transform.
  const targetsRef = useRef<Point[]>([]);
  const boundsRef = useRef<[number, number][]>([]);
  const startRef = useRef<Point>({ x: 0, y: 0 });
  const curveStrengthRef = useRef(28);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Bumped after every measurement pass so the position transforms below
  // recompute even when the user resizes without scrolling.
  const remeasureTick = useMotionValue(0);

  function measure() {
    const container = sectionRef.current;
    const cards = [card1Ref.current, card2Ref.current];
    if (!container || cards.some((c) => !c)) return;

    const containerRect = container.getBoundingClientRect();
    const totalHeight = container.scrollHeight || containerRect.height;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const targets: Point[] = [];
    const bounds: [number, number][] = [];

    cards.forEach((el) => {
      const rect = el!.getBoundingClientRect();
      const top = rect.top - containerRect.top;
      const bottom = top + rect.height;
      bounds.push([top / totalHeight, bottom / totalHeight]);

      targets.push(
        isMobile
          ? { x: rect.width - 18, y: top - 30 }
          : { x: containerRect.width - 64, y: top + rect.height / 2 },
      );
    });

    targetsRef.current = targets;
    boundsRef.current = bounds;
    curveStrengthRef.current = isMobile ? 12 : 28;
    startRef.current = isMobile
      ? { x: (targets[0]?.x ?? 0) - 40, y: -80 }
      : { x: containerRect.width + 60, y: targets[0]?.y ?? 0 };

    remeasureTick.set(remeasureTick.get() + 1);
  }

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Given overall section progress, returns which segment we're in and an
   *  eased 0-1 "how far through this segment's travel phase" value. */
  function resolveSegment(progress: number) {
    const bounds = boundsRef.current;
    if (bounds.length === 0) return { index: 0, travelT: 0, parked: false };

    let index = bounds.findIndex(
      ([start, end]) => progress >= start && progress <= end,
    );
    if (index === -1) index = progress < bounds[0][0] ? 0 : bounds.length - 1;

    const [segStart, segEnd] = bounds[index];
    const segSpan = Math.max(segEnd - segStart, 0.0001);
    const travelEnd = segStart + segSpan * SETTLE_AT;
    const localT = clamp01(
      (progress - segStart) / Math.max(travelEnd - segStart, 0.0001),
    );

    return {
      index,
      travelT: easeInOutCubic(localT),
      parked: progress >= travelEnd,
    };
  }

  function computeAxis(progress: number, axis: "x" | "y") {
    const targets = targetsRef.current;
    if (targets.length === 0) return 0;

    const { index, travelT } = resolveSegment(progress);
    const from = index === 0 ? startRef.current : targets[index - 1];
    const to = targets[index];

    const point = quadBezier(from, to, curveStrengthRef.current, travelT);
    return axis === "x" ? point.x : point.y;
  }

  function getIllumination(progress: number, cardIndex: number) {
    const { index, travelT, parked } = resolveSegment(progress);
    if (cardIndex === index) return parked ? 1 : travelT;
    if (cardIndex === index - 1 && !parked) return 1 - travelT;
    return 0;
  }

  // --- Orb position: scroll-driven base, smoothed with a soft spring so it
  // never snaps, layered with a continuous idle float for "it feels alive".
  const baseX = useTransform([scrollYProgress, remeasureTick], ([p]) =>
    computeAxis(p as number, "x"),
  );
  const baseY = useTransform([scrollYProgress, remeasureTick], ([p]) =>
    computeAxis(p as number, "y"),
  );

  const weightlessSpring = prefersReducedMotion
    ? { stiffness: 1000, damping: 100 }
    : { stiffness: 60, damping: 20, mass: 1 };

  const springX = useSpring(baseX, weightlessSpring);
  const springY = useSpring(baseY, weightlessSpring);

  const floatT = useMotionValue(0);
  useAnimationFrame((t) => {
    if (!prefersReducedMotion) floatT.set(t / 1000);
  });

  const floatY = useTransform(floatT, (t) => Math.sin(t * 0.6) * 6);
  const floatRotate = useTransform(floatT, (t) => Math.sin(t * 0.42) * 3);
  const floatScale = useTransform(floatT, (t) => 1 + Math.sin(t * 0.3) * 0.02);

  const orbX = springX;
  const orbY = useTransform(
    [springY, floatY],
    ([sy, fy]) => (sy as number) + (fy as number),
  );

  // --- Per-card illumination + the small text/lift reactions to it.
  const illumination1 = useTransform([scrollYProgress, remeasureTick], ([p]) =>
    getIllumination(p as number, 0),
  );
  const illumination2 = useTransform([scrollYProgress, remeasureTick], ([p]) =>
    getIllumination(p as number, 1),
  );

  const textOpacity1 = useTransform(illumination1, (v) => 0.72 + 0.28 * v);
  const textOpacity2 = useTransform(illumination2, (v) => 0.72 + 0.28 * v);
  const liftY1 = useTransform(illumination1, (v) => -4 * v);
  const liftY2 = useTransform(illumination2, (v) => -4 * v);

  return (
    <section ref={sectionRef} className="relative">
      {/* Orb — absolutely positioned within this section only, pointer-events
          disabled so it never intercepts clicks/scroll and never overlaps text.
          Split into two nested nodes on purpose: the outer div does the static
          "center this box on its own point" offset via a Tailwind transform
          class, the inner motion.div owns the animated x/y/rotate/scale —
          mixing both into one Framer Motion style object fights itself. */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          aria-hidden="true"
          className="h-[clamp(56px,6vw,96px)] w-[clamp(56px,6vw,96px)] will-change-transform"
          style={{ x: orbX, y: orbY, rotate: floatRotate, scale: floatScale }}
        >
          <OrbGraphic />
        </motion.div>
      </div>

      <div className="relative z-0 flex flex-col gap-16 pr-20 md:pr-40">
        {/* Card 1 — INAI Worlds */}
        <motion.div
          ref={card1Ref}
          style={{ y: liftY1 }}
          className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#FAFAF8] p-8 md:p-10"
        >
          <motion.div
            style={{ opacity: illumination1 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,239,221,0.35),transparent_65%)]"
          />
          <motion.div style={{ opacity: textOpacity1 }} className="relative">
            <div className="mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/experience/inai-worlds.webp"
                alt="INAI Worlds Pvt. Ltd."
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-inter mb-2 text-sm uppercase tracking-[0.14em] text-[#003b9d]/70">
              MERN Stack Developer Intern · Surat
            </p>
            <h3 className="font-sora mb-3 text-2xl font-medium text-neutral-900 md:text-3xl">
              INAI Worlds Pvt. Ltd.
            </h3>
            <p className="font-inter mb-4 text-sm text-neutral-500">3 Months</p>
            <p className="font-inter max-w-xl text-neutral-600">
              Worked on frontend pages, REST APIs, backend integration, reusable
              React components and production-ready MERN features.
            </p>
          </motion.div>
        </motion.div>

        {/* Card 2 — Parashift Technologies */}
        <motion.div
          ref={card2Ref}
          style={{ y: liftY2 }}
          className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#FAFAF8] p-8 md:p-10"
        >
          <motion.div
            style={{ opacity: illumination2 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,239,221,0.35),transparent_65%)]"
          />
          <motion.div style={{ opacity: textOpacity2 }} className="relative">
            <div className="mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/experience/parashift.webp"
                alt="Parashift Technologies"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-inter mb-2 text-sm uppercase tracking-[0.14em] text-[#003b9d]/70">
              Frontend Developer Intern · Jogeshwari, Mumbai
            </p>
            <h3 className="font-sora mb-3 text-2xl font-medium text-neutral-900 md:text-3xl">
              Parashift Technologies
            </h3>
            <p className="font-inter mb-4 text-sm text-neutral-500">
              Next.js · TypeScript
            </p>
            <p className="font-inter max-w-xl text-neutral-600">
              Currently building scalable frontend interfaces with Next.js,
              TypeScript and modern UI architecture.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneyOrb;
