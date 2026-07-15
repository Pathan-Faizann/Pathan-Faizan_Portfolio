"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [time, setTime] = useState<string>("");

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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 3.8 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none"
    >
      {/* Brand logo - clickable */}
      <div className="pointer-events-auto">
        <a
          href="#"
          className="font-display font-bold text-lg tracking-widest text-[#f5f5f5] hover:opacity-75 transition-opacity"
        >
          FAIZAN.
        </a>
      </div>

      {/* Center Zone: Clock (Desktop only) */}
      <div className="hidden md:flex flex-col items-center pointer-events-auto">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888]">
          IST — MUMBAI, IN
        </span>
        <span className="font-mono text-xs text-[#f5f5f5] mt-1 tracking-wider">
          {time || "00:00 AM"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-8 md:gap-12 pointer-events-auto">
        <button
          onClick={() => scrollToSection("works")}
          className="text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-[#f5f5f5] transition-colors cursor-pointer"
        >
          Works
        </button>
        <button
          onClick={() => scrollToSection("philosophy")}
          className="text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-[#f5f5f5] transition-colors cursor-pointer"
        >
          Philosophy
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-[#f5f5f5] transition-colors cursor-pointer"
        >
          Contact
        </button>
      </nav>
    </motion.header>
  );
}
