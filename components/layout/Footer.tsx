"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [time, setTime] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("faizanpathan8104@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = "faizanpathan8104@gmail.com";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      className="bg-[#050505] text-[#f5f5f5] px-6! pt-10! pb-10! md:px-16 md:pt-12! flex justify-center w-full"
    >
      <div className="max-w-[1400px] w-full flex flex-col justify-between h-full">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:pt-12! pt-6! border-t border-[#111111] items-start">
          {/* Email section */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-1!">
              Direct Inquiry
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group relative inline-flex items-center gap-2 text-lg font-mono text-[#f5f5f5] hover:opacity-85 transition-opacity cursor-pointer select-none text-left"
              title="Click to copy email"
              aria-label="Copy email address"
            >
              <span>faizanpathan8104@gmail.com</span>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border transition-all duration-200 ${
                  copied
                    ? "bg-white text-black border-white opacity-100 scale-100"
                    : "opacity-0 scale-95 border-white/20 text-white/50 group-hover:opacity-100"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] mb-3!">
              Connect
            </span>
            <div className="flex flex-wrap gap-x-3 lg:gap-x-6 gap-y-2 text-sm font-mono uppercase tracking-wider text-[#888888]">
              <a
                href="https://github.com/Pathan-Faizann"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/pathan-faizan/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/Faizan-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                Read CV
              </a>
              <a
                href="https://wa.me/919737667990"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f5f5f5] transition-colors"
              >
                WhatsApp
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
