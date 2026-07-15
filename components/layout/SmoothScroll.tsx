"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

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
    document.body.classList.add("loading-lock");

    // Animation frame loop
    let rafId: number;
    const update = (time: number) => {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Synchronize ScrollTrigger updates with Lenis scroll ticks
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      lenisInstance.on("scroll", () => {
        ScrollTrigger.update();
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      document.body.classList.remove("loading-lock");
    };
  }, []);

  const lockScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
      setIsLocked(true);
      document.body.classList.add("loading-lock");
    }
  };

  const unlockScroll = () => {
    if (lenisRef.current) {
      lenisRef.current.start();
      setIsLocked(false);
      document.body.classList.remove("loading-lock");
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{ lenis, isLocked, lockScroll, unlockScroll }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
