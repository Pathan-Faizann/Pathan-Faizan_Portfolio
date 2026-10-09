"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SmoothScrollContextType {
  lenis: Lenis | null;
  isLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  isLocked: true,
  lockScroll: () => {},
  unlockScroll: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis scroll options
    const lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential ease
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Initial state: locked scroll for loading animation
    lenisInstance.stop();
    document.documentElement.classList.add("loading-lock");
    document.body.classList.add("loading-lock");
    window.scrollTo(0, 0);

    // Synchronize Lenis with GSAP ticker (unified 60/120fps clock, lagSmoothing(0))
    const updateTicker = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Synchronize ScrollTrigger updates with Lenis scroll ticks
    const scrollHandler = () => {
      ScrollTrigger.update();
    };
    lenisInstance.on("scroll", scrollHandler);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenisInstance.off("scroll", scrollHandler);
      lenisInstance.destroy();
      document.documentElement.classList.remove("loading-lock");
      document.body.classList.remove("loading-lock");
    };
  }, []);

  // Block all scroll interactions (wheel, touch, arrow keys, scroll) while locked
  useEffect(() => {
    if (!isLocked) return;

    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"];
      if (keys.includes(e.code) || keys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const forceZero = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.scrollTo(0, 0);

    window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("keydown", preventScrollKeys, { passive: false, capture: true });
    window.addEventListener("scroll", forceZero, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", preventScroll, true);
      window.removeEventListener("touchmove", preventScroll, true);
      window.removeEventListener("keydown", preventScrollKeys, true);
      window.removeEventListener("scroll", forceZero, true);
    };
  }, [isLocked]);

  const lockScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
    setIsLocked(true);
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("loading-lock");
      document.body.classList.add("loading-lock");
    }
  };

  const unlockScroll = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("loading-lock");
      document.body.classList.remove("loading-lock");
    }
    setIsLocked(false);
    if (lenisRef.current) {
      lenisRef.current.start();
      lenisRef.current.resize();
    }
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <SmoothScrollContext.Provider
      value={{ lenis, isLocked, lockScroll, unlockScroll }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
