"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useId } from "react";
import { gsap } from "@/lib/gsap";
import PathanFaizanTypography from "@/components/typography/PathanFaizanTypography";
import { WATER_DELAY, WATER_DURATION } from "@/animations/constants";

export interface WaterFillTextHandle {
  /** Outer wrapper — used for FLIP rect measurement */
  element: HTMLDivElement | null;
  /** Returns a promise that resolves when fill is 100% complete */
  startFill: () => Promise<void>;
  /** Switch to solid fill before cloning for the morph */
  finalizeFill: () => void;
}

const WaterFillText = forwardRef<WaterFillTextHandle>((_, ref) => {
  const instanceId = useId().replace(/:/g, "");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const isFilledRef = useRef(false);
  const [solidFill, setSolidFill] = React.useState(false);

  const finalizeFill = () => {
    isFilledRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const path = wavePathRef.current;
    if (path) {
      path.setAttribute("d", "M 0 0 L 1200 0 L 1200 600 L 0 600 Z");
    }

    setSolidFill(true);
  };

  useImperativeHandle(ref, () => ({
    get element() {
      return wrapperRef.current;
    },
    finalizeFill,
    startFill: () =>
      new Promise<void>((resolve) => {
        const animObj = { progress: 0 };

        gsap.to(animObj, {
          progress: 1,
          duration: WATER_DURATION,
          delay: WATER_DELAY,
          ease: "power2.inOut",
          onUpdate() {
            progressRef.current = animObj.progress;
          },
          onComplete() {
            finalizeFill();
            resolve();
          },
        });

        const tick = () => {
          if (isFilledRef.current) return;

          const path = wavePathRef.current;
          if (!path) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }

          const p = progressRef.current;
          phaseRef.current += 0.035;

          const startY = 560;
          const endY = 20;
          const waterY = startY - p * (startY - endY);
          const amplitude = (1 - p) * 14;

          const steps = 32;
          const segW = 1200 / steps;
          const points: string[] = [];

          for (let i = 0; i <= steps; i++) {
            const x = i * segW;
            const sine = Math.sin(x * 0.006 + phaseRef.current);
            const cos = Math.cos(x * 0.013 - phaseRef.current * 0.75);
            const y = waterY + (sine * 1.0 + cos * 0.45) * amplitude;
            points.push(`${x.toFixed(1)},${y.toFixed(2)}`);
          }

          const d =
            `M 0 600 L 0 ${points[0].split(",")[1]} ` +
            points.map((pt) => `L ${pt}`).join(" ") +
            ` L 1200 600 Z`;

          path.setAttribute("d", d);
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      }),
  }));

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full select-none pointer-events-none"
      aria-hidden="true"
    >
      <PathanFaizanTypography
        instanceId={`loader-${instanceId}`}
        wavePathRef={wavePathRef}
        solidFill={solidFill}
      />
    </div>
  );
});

WaterFillText.displayName = "WaterFillText";
export default WaterFillText;
