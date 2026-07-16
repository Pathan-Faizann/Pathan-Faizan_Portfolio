"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface ParallaxImageProps {
  id: string;
  src: string;
  alt: string;
  content?: "about" | "statement" | "manifesto" | "projects";
  className: string;
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

function EditorialTextCard({ content }: Pick<ParallaxImageProps, "content">) {
  if (content === "projects") {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#171717_0%,#0a0a0a_42%,#050505_100%)] px-[clamp(1rem,2vw,2.5rem)] text-[#ECECEC] select-none">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="font-display text-[clamp(2.1rem,6.25vw,4.5rem)] font-black uppercase leading-[0.82] tracking-normal">
            PROJECTS
          </h2>
          <p className="mt-[clamp(0.75rem,1.4vw,1.5rem)] font-mono text-[clamp(0.5rem,0.65vw,0.72rem)] uppercase tracking-[0.32em] text-[#ECECEC]/40">
            Selected Works
          </p>
          <p className="mt-2 font-mono text-[clamp(0.42rem,0.5vw,0.58rem)] uppercase tracking-[0.2em] text-[#ECECEC]/30">
            Curated Digital Experiences
          </p>
        </div>
      </div>
    );
  }

  if (content === "about") {
    return (
      <div className="flex h-full w-full items-start text-[#ECECEC] select-none">
        <span className="whitespace-nowrap font-display text-[clamp(1.35rem,2.25vw,2.75rem)] font-[100] uppercase leading-none tracking-[0.18em]">
          [ ABOUT ]
        </span>
      </div>
    );
  }

  if (content === "statement") {
    return (
      <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
        <p className="w-[min(30vw,calc(100vw-3rem))] font-sans text-[clamp(1rem,1.65vw,1.65rem)] font-semibold leading-[1.2] tracking-[0.01em]">
          BCA graduate focused on building modern, thoughtful digital
          experiences with clean code and motion.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center text-[#ECECEC] select-none">
      <p className="whitespace-nowrap font-display text-[clamp(1.75rem,3.1vw,3.50rem)] font-semibold leading-[1.12] tracking-[0.01em]">
        <span className="block">Learning.</span>
        <span className="block">Building.</span>
        <span className="block">Improving.</span>
      </p>
    </div>
  );
}

export const ParallaxImage = React.memo(function ParallaxImage({
  id,
  src,
  alt,
  content,
  className,
  scale,
  x,
  y,
  opacity,
}: ParallaxImageProps) {
  const isCenter = id === "center";

  return (
    <motion.div
      style={{
        scale,
        x,
        y,
        opacity,
      }}
      className={className}
    >
      <div className={content ? "relative h-full w-full group" : "relative h-full w-full overflow-hidden group"}>
        {content ? (
          <EditorialTextCard content={content} />
        ) : (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={
                isCenter
                  ? "(max-width: 768px) 50vw, 35vw"
                  : "(max-width: 768px) 30vw, 20vw"
              }
              priority={isCenter}
              className="object-cover filter grayscale contrast-[1.12] brightness-[0.88] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 group-hover:contrast-105"
            />
            {/* Subtle cinematic gradient overlay to add luxury depth and frame text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-30 transition-opacity duration-1000" />
          </>
        )}
      </div>
    </motion.div>
  );
});

ParallaxImage.displayName = "ParallaxImage";
