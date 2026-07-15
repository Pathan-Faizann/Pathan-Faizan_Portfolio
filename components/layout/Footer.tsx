"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // update every second for live countdown feel
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="contact"
      className="bg-[#050505] text-[#f5f5f5] px-6 py-20 md:px-16 md:py-32 border-t border-[#111111] flex justify-center w-full"
    >
      <div className="max-w-7xl w-full flex flex-col justify-between h-full">
        {/* Massive Typographic Call to Action */}
        <div className="mb-20 md:mb-32">
          <span className="text-xs uppercase tracking-[0.3em] text-[#888888] block mb-6">
            Get in touch
          </span>
          <h2 className="font-display text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase max-w-4xl">
            LET'S SHAPE THE DIGITAL FUTURE.
          </h2>
        </div>

        {/* Footer Meta & Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 pt-12 border-t border-[#111111] items-start">
          {/* Email section */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-3">
              Direct Inquiry
            </span>
            <a
              href="mailto:hello@faizan.design"
              className="text-lg font-mono hover:opacity-75 transition-opacity inline-block w-fit text-[#f5f5f5]"
            >
              hello@faizan.design
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-3">
              Connect
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-mono uppercase tracking-wider text-[#888888]">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://read.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                Read.cv
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* Clock & Copyright */}
          <div className="flex flex-col md:items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-3">
              Local Time Zone
            </span>
            <span className="font-mono text-sm tracking-wider mb-2 text-[#f5f5f5]">
              {time || "00:00:00 AM"}
            </span>
            <span className="text-[10px] tracking-wide text-[#555555] uppercase mt-2">
              © {new Date().getFullYear()} FAIZAN. ALL RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
