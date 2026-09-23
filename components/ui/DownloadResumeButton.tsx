"use client";

import React from "react";

export default function DownloadResumeButton() {
  return (
    <a
      href="/Faizan_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center! gap-2.5! px-5! py-2.5! sm:px-6! sm:py-3! rounded-full! text-xs! font-mono tracking-widest uppercase! border! border-white/20! bg-white/[0.04]! text-white/90! hover:text-black! hover:bg-white! !hover:border-white! transition-all! duration-500! ease-out! shadow-sm! hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]! active:scale-95! cursor-pointer! backdrop-blur-sm!"
      aria-label="Download CV"
    >
      <span className="font-medium text-[11px] sm:text-xs">Read CV</span>
      <svg
        className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white/70 group-hover:text-black"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  );
}
