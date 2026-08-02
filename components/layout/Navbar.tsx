"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata", // Client location time zone or UTC
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "about") {
      const el = document.getElementById("works");
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 1.4 });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    } else if (id === "projects") {
      const el = document.getElementById("works");
      if (el) {
        // 3 * innerHeight is the exact zoom depth in WorksSection where PROJECTS text is scaled 1.0 full on screen
        const targetY = el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 3;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 1.4 });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    } else {
      const el = document.getElementById(id);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { duration: 1.4 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const navItems = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 3.8 }}
      className="fixed top-0 left-0 w-full z-50 px-4 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none"
    >
      {/* Center Zone: Clock (Desktop only) */}
      <div className="hidden md:flex flex-col items-start pointer-events-auto">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888]">
          IST — MUMBAI, IN
        </span>
        <span className="font-mono text-xs text-[#f5f5f5] mt-1 tracking-wider">
          {time || "00:00 AM"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-wrap gap-4 sm:gap-6 md:gap-10 pointer-events-auto ml-auto md:ml-0">
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
    </motion.header>
  );
}
