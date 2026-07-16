"use client";

import React, { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import WaterFillText, { WaterFillTextHandle } from "./WaterFillText";
import {
  createFloatingClone,
  measureElement,
  type FloatingClone,
} from "@/animations/sharedElementTransition";
import {
  FILL_HOLD,
  MORPH_DURATION,
  CURTAIN_DURATION,
  CURTAIN_OFFSET,
  EASE_PREMIUM,
  EASE_CURTAIN,
} from "@/animations/constants";

interface CinematicLoaderProps {
  heroTitleRef: React.RefObject<HTMLHeadingElement | null>;
  onComplete: () => void;
}

export default function CinematicLoader({
  heroTitleRef,
  onComplete,
}: CinematicLoaderProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const textShellRef = useRef<HTMLDivElement>(null);
  const waterFillRef = useRef<WaterFillTextHandle>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { unlockScroll } = useSmoothScroll();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      if (heroTitleRef.current) {
        heroTitleRef.current.style.visibility = "visible";
      }
      gsap.to(curtainRef.current, {
        yPercent: -100,
        duration: 0.6,
        ease: EASE_CURTAIN,
        onComplete: () => {
          unlockScroll();
          onComplete();
        },
      });
      return;
    }

    const waterFill = waterFillRef.current;
    if (!waterFill) return;

    let floatingClone: FloatingClone | null = null;
    let cancelled = false;

    const cleanup = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      floatingClone?.destroy();
      floatingClone = null;
    };

    (async () => {
      await waterFill.startFill();
      if (cancelled) return;

      await new Promise<void>((res) => gsap.delayedCall(FILL_HOLD, res));
      if (cancelled) return;

      const loaderEl = waterFill.element;
      const heroEl = heroTitleRef.current;

      if (!loaderEl || !heroEl) {
        if (heroEl) heroEl.style.visibility = "visible";
        gsap.to(curtainRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: EASE_CURTAIN,
          onComplete: () => {
            unlockScroll();
            onComplete();
          },
        });
        return;
      }

      // Ensure solid white letterforms are in the DOM before cloning
      flushSync(() => {
        waterFill.finalizeFill();
      });

      await new Promise<void>((res) =>
        requestAnimationFrame(() => requestAnimationFrame(() => res()))
      );
      if (cancelled) return;

      window.scrollTo(0, 0);

      const fromRect = measureElement(loaderEl);
      const toRect = measureElement(heroEl);

      if (fromRect.width === 0 || toRect.width === 0) {
        heroEl.style.visibility = "visible";
        gsap.to(curtainRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: EASE_CURTAIN,
          onComplete: () => {
            unlockScroll();
            onComplete();
          },
        });
        return;
      }

      // Clone BEFORE hiding the source — cloneNode copies inline visibility
      floatingClone = createFloatingClone(loaderEl);

      loaderEl.style.visibility = "hidden";
      if (textShellRef.current) {
        textShellRef.current.style.visibility = "hidden";
      }

      const transform = {
        x:
          toRect.left +
          toRect.width / 2 -
          (fromRect.left + fromRect.width / 2),
        y:
          toRect.top +
          toRect.height / 2 -
          (fromRect.top + fromRect.height / 2),
        scaleX: toRect.width / fromRect.width,
        scaleY: toRect.height / fromRect.height,
      };

      const tl = gsap.timeline({
        onComplete: () => {
          heroEl.style.visibility = "visible";
          cleanup();
          unlockScroll();
          onComplete();
        },
      });

      timelineRef.current = tl;

      tl.to(
        floatingClone.node,
        {
          x: transform.x,
          y: transform.y,
          scaleX: transform.scaleX,
          scaleY: transform.scaleY,
          duration: MORPH_DURATION,
          ease: EASE_PREMIUM,
          force3D: true,
        },
        0
      );

      tl.to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: CURTAIN_DURATION,
          ease: EASE_CURTAIN,
        },
        CURTAIN_OFFSET
      );
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9998] bg-[#050505] will-change-transform"
        aria-hidden="true"
      />

      <div
        ref={textShellRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[88vw] sm:w-[82vw] md:w-[76vw] lg:w-[70vw] xl:w-[62vw]">
          <WaterFillText ref={waterFillRef} />
        </div>
      </div>
    </>
  );
}
