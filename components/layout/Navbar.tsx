"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const isFirstMount = useRef(true);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Set hasEntered to true after initial cinematic loader delay completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Smart hide-on-scroll down, reveal-on-scroll up
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const onScroll = (currentY: number) => {
      if (currentY <= 80) {
        setIsVisible(true);
        lastScrollY = currentY;
        return;
      }

      const diff = currentY - lastScrollY;
      if (Math.abs(diff) < 8) return;

      if (diff > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentY;
    };

    if (lenis) {
      const lenisHandler = (e: { scroll: number }) => onScroll(e.scroll);
      lenis.on("scroll", lenisHandler);
      return () => lenis.off("scroll", lenisHandler);
    } else {
      const windowHandler = () => onScroll(window.scrollY);
      window.addEventListener("scroll", windowHandler, { passive: true });
      return () => window.removeEventListener("scroll", windowHandler);
    }
  }, [lenis]);

  // Lock / unlock scroll when mobile overlay toggles (never add height: 100vh loading-lock)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("loading-lock");
      if (lenis) {
        lenis.start();
        lenis.resize();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("loading-lock");
    };
  }, [isOpen, lenis]);

  // Close mobile menu if screen resizes to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    let targetEl: HTMLElement | null = null;
    let targetY: number | null = null;

    if (id === "about") {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        targetEl =
          document.getElementById("about-mobile") ||
          document.getElementById("works");
      } else {
        targetEl = document.getElementById("works");
      }
    } else if (id === "projects") {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        targetEl =
          document.getElementById("projects-mobile") ||
          document.getElementById("works");
      } else {
        const worksEl = document.getElementById("works");
        if (worksEl) {
          const rect = worksEl.getBoundingClientRect();
          const currentScrollY =
            window.pageYOffset || document.documentElement.scrollTop;
          targetY = rect.top + currentScrollY + window.innerHeight * 3;
        }
      }
    } else {
      targetEl = document.getElementById(id);
    }

    if (targetEl && targetY === null) {
      const rect = targetEl.getBoundingClientRect();
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      // 24px offset for clean breathing room below sticky header
      targetY = Math.max(0, rect.top + currentScrollY - 24);
    }

    if (targetY !== null) {
      if (lenis) {
        lenis.start();
        lenis.resize();
        lenis.scrollTo(targetY, { duration: 1.2, immediate: false });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }

      // Fallback verification for mobile touch environments
      const destinationY = targetY;
      setTimeout(() => {
        const actualScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(actualScroll - destinationY) > 80) {
          window.scrollTo({ top: destinationY, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleMobileNavClick = (id: string) => {
    // 1. Immediately close mobile overlay
    setIsOpen(false);

    // 2. Clear any lingering body scroll lock
    document.body.style.overflow = "";
    document.body.classList.remove("loading-lock");

    // 3. Resume and resize Lenis immediately
    if (lenis) {
      lenis.start();
      lenis.resize();
    }

    // 4. Trigger scroll immediately & re-sync on next tick for buttery smooth travel
    scrollToSection(id);
    setTimeout(() => {
      scrollToSection(id);
    }, 120);
  };

  const navItems = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];

  // Animation variants
  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      y: -12,
      transition: {
        duration: 0.35,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const navListVariants: Variants = {
    closed: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const navItemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 28,
      transition: {
        duration: 0.25,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const showNav = isOpen || isVisible;

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{
          y: showNav ? 0 : -130,
          opacity: hasEntered ? 1 : (showNav ? 1 : 0),
        }}
        transition={{
          y: {
            duration: hasEntered ? 0.38 : 1.2,
            ease: [0.76, 0, 0.24, 1] as const,
            delay: hasEntered ? 0 : 3.8,
          },
          opacity: {
            duration: hasEntered ? 0 : 1.2,
            delay: hasEntered ? 0 : 3.8,
          },
        }}
        className="fixed top-4 md:top-6 left-0 w-full z-50 flex justify-center items-center px-4 sm:px-6 md:px-8 pointer-events-none"
      >
        {/* Desktop Centered 1400px Clean Frosted Glass Pill */}
        <div className="hidden md:flex relative overflow-hidden items-center justify-between w-full max-w-[1400px] h-[64px]! px-8! rounded-full border border-white/10! border-t-white/30! border-b-white/5! bg-[#050505]/28! bg-gradient-to-b! from-white/[0.09] via-white/[0.025] to-transparent! backdrop-blur-[8px]! shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_1px_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.45)]! pointer-events-auto transition-all duration-300">

          {/* Left Zone: Brand Logo (FAIZAN.dev) */}
          <button
            onClick={() => {
              if (lenis) {
                lenis.scrollTo(0, { duration: 1.4 });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="group relative z-10 flex items-baseline gap-0.5 pointer-events-auto cursor-pointer select-none transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            aria-label="Scroll to top"
          >
            <span className="font-display text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.35)] transition-colors">
              FAIZAN
            </span>
            <span className="font-mono text-xs sm:text-sm font-medium tracking-normal text-neutral-400 group-hover:text-neutral-200 transition-colors">
              .dev
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="relative z-10 flex items-center gap-8 lg:gap-12 pointer-events-auto ml-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-[#f5f5f5] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between w-full pointer-events-auto px-1">
          {/* Mobile Brand Logo */}
          <button
            onClick={() => {
              if (lenis) {
                lenis.scrollTo(0, { duration: 1.4 });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-baseline gap-0.5 cursor-pointer select-none px-3.5 py-1.5 rounded-full border border-white/10 border-t-white/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_4px_14px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
            aria-label="Scroll to top"
          >
            <span className="font-display text-sm font-black uppercase tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              FAIZAN
            </span>
            <span className="font-mono text-[11px] font-medium text-neutral-400">
              .dev
            </span>
          </button>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={`relative w-12! h-12! rounded-full border border-t-white/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 select-none ${isOpen
              ? "border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_24px_rgba(255,255,255,0.18)]"
              : "border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_14px_rgba(0,0,0,0.5)] hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              }`}
          >
            {/* 2 Parallel Lines morphing into an 'X' */}
            <div className="relative w-5! h-5! flex items-center justify-center">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="absolute w-5! h-[1.75px]! bg-white rounded-full origin-center"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="absolute w-5! h-[1.75px]! bg-white rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav-overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40! md:hidden bg-[#050505]/92 backdrop-blur-2xl flex flex-col justify-between px-7! pt-20! pb-18! sm:px-12 overflow-y-auto"
          >
            {/* Ambient Background Grid & Lighting */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute top-1/4! right-0 w-80! h-80! bg-white/[0.03] rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-10 left-0! w-80! h-80! bg-white/[0.02] rounded-full blur-[110px] pointer-events-none" />



            {/* Main Navigation Links (Awwwards-style large editorial typography) */}
            <motion.nav
              variants={navListVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative z-10 flex flex-col justify-center gap-3! sm:gap-5 my-auto py-4!"
            >
              {navItems.map((item, index) => (
                <motion.div key={item.id} variants={navItemVariants}>
                  <button
                    onClick={() => handleMobileNavClick(item.id)}
                    className="group flex items-center justify-between w-full py-2.5! border-b! border-white/[0.06]! text-left transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-4! sm:gap-6!">
                      <span className="font-mono text-xs sm:text-sm text-[#555555] group-hover:text-white transition-colors duration-300">
                        0{index + 1}
                      </span>
                      <span className="font-display text-3xl sm:text-4xl xs:text-3xl font-black uppercase tracking-tight text-[#d0d0d0] group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                        {item.label}
                      </span>
                    </div>
                    {/* <span className="text-[#555555] group-hover:text-white group-hover:translate-x-1.5! transition-all duration-300">
                      <RiArrowRightWideLine className="text-2xl" />
                    </span> */}
                  </button>
                </motion.div>
              ))}
            </motion.nav>

            {/* Bottom Meta & Time */}
            <div className="relative z-10 pt-4! border-t! border-white/[0.08]! flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#666666]">
                  CURRENT TIME
                </span>
                <span className="font-mono text-xs text-[#f5f5f5] mt-1! tracking-wider">
                  {time || "00:00 AM"} IST
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-[#666666]">
                  PORTFOLIO
                </span>
                <span className="font-mono text-xs text-[#888888] mt-1! tracking-wider">
                  FAIZAN PATHAN
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
