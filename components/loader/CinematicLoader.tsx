"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useSmoothScroll } from "../layout/SmoothScroll";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textFillRef = useRef<SVGTextElement>(null);
  const { unlockScroll } = useSmoothScroll();
  
  const [isFilled, setIsFilled] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  // Animation values using refs for 60fps direct DOM manipulation
  const currentProgressRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    // Check for prefers-reduced-motion media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setHasReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      // Reduced motion flow: skip water animation, show white immediately, exit fast
      setIsFilled(true);
      const exitTl = gsap.timeline({
        delay: 0.8,
        onComplete: () => {
          unlockScroll();
          onComplete();
        }
      });

      exitTl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power2.inOut",
      });

      exitTl.to(".homepage-content", {
        filter: "blur(0px)",
        clearProps: "filter",
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.15");

      return;
    }

    // Standard water fill animation timeline
    const animObj = { progress: 0 };
    const fillTimeline = gsap.timeline({
      onComplete: () => {
        // Step 3: Hold white text, then slide curtain up
        setIsFilled(true);
        
        // Wait 0.5s before triggering exit shutter
        gsap.delayedCall(0.5, () => {
          const exitTl = gsap.timeline({
            onComplete: () => {
              unlockScroll();
              onComplete();
            }
          });

          // Exit duration: 1.2 seconds, Ease: power4.inOut, no bounce
          exitTl.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
          });

          // Homepage blur reduction starts in the last 15% (0.18s) of the exit animation
          exitTl.to(
            ".homepage-content",
            {
              filter: "blur(0px)",
              clearProps: "filter",
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.25"
          );
        });
      }
    });

    // Step 1 & 2: Delay 0.5s, Fill duration 2.5s, Ease: easeInOut
    fillTimeline.to(animObj, {
      progress: 1,
      duration: 4.5,
      delay: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        currentProgressRef.current = animObj.progress;
      }
    });

    // Wave drawing loop using requestAnimationFrame
    let rafId: number;
    const animateWave = () => {
      const path = pathRef.current;
      if (!path) return;

      const progress = currentProgressRef.current;
      phaseRef.current += 0.04; // Calm horizontal movement speed

      // SVG dimensions are 1200 x 300
      // Water level rises from bottom (260px) to top (40px)
      const startY = 260;
      const endY = 40;
      const waterY = startY - progress * (startY - endY);

      // Damp amplitude as progress reaches the top (0 at complete)
      const baseAmplitude = 12;
      const amplitude = (1 - progress) * baseAmplitude;

      const points: string[] = [];
      const steps = 30;
      const segmentWidth = 1200 / steps;

      for (let i = 0; i <= steps; i++) {
        const x = i * segmentWidth;
        // Dual sine components for a natural fluid look
        const sineVal = Math.sin(x * 0.007 + phaseRef.current);
        const cosVal = Math.cos(x * 0.015 - phaseRef.current * 0.8);
        const y = waterY + (sineVal * 1.0 + cosVal * 0.4) * amplitude;
        points.push(`${x},${y}`);
      }

      // Construct SVG path string (enclosing the bottom area)
      const pathD = `M 0 300 L 0 ${points[0].split(",")[1]} ` +
        points.map((p) => `L ${p}`).join(" ") +
        ` L 1200 300 Z`;

      path.setAttribute("d", pathD);

      rafId = requestAnimationFrame(animateWave);
    };

    rafId = requestAnimationFrame(animateWave);

    return () => {
      cancelAnimationFrame(rafId);
      fillTimeline.kill();
    };
  }, [onComplete, unlockScroll]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#050505] select-none"
    >
      <div className="w-full max-w-[90vw] px-4 md:px-0">
        <svg
          viewBox="0 0 1200 300"
          width="100%"
          height="100%"
          className="w-full h-auto select-none pointer-events-none"
        >
          <defs>
            <clipPath id="hello-text-clip">
              <text
                x="600"
                y="160"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="130"
                className="font-display font-black tracking-tighter uppercase"
                style={{ fontWeight: 900 }}
              >
                HELLO WORLD
              </text>
            </clipPath>
          </defs>

          {/* Unfilled background text - Dark Gray */}
          <text
            x="600"
            y="160"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="130"
            className="font-display font-black tracking-tighter uppercase fill-[#181818]"
            style={{ fontWeight: 900 }}
          >
            HELLO WORLD
          </text>

          {/* Water Fill - Clipped to Text */}
          <g clipPath="url(#hello-text-clip)">
            {isFilled || hasReducedMotion ? (
              // Instant flat white on complete / reduced motion
              <rect width="1200" height="300" fill="#f5f5f5" />
            ) : (
              // Animated wave path - pure white fill
              <path ref={pathRef} fill="#f5f5f5" />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
