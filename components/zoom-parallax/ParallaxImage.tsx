"use client";

import React from "react";
import Image from "next/image";
import { motion, MotionValue } from "framer-motion";

interface ParallaxImageProps {
  id: string;
  src: string;
  alt: string;
  className: string;
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

export const ParallaxImage = React.memo(function ParallaxImage({
  id,
  src,
  alt,
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
      <div className="relative w-full h-full overflow-hidden group">
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
      </div>
    </motion.div>
  );
});

ParallaxImage.displayName = "ParallaxImage";
