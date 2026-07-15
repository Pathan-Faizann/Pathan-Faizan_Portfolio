"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { PARALLAX_IMAGES } from "./constants";
import { ParallaxImage } from "./ParallaxImage";
import { MappedAnimation } from "./useParallaxAnimation";

interface CollageLayoutProps {
  animations: MappedAnimation[];
  scrollYProgress: MotionValue<number>;
}

export function CollageLayout({ animations, scrollYProgress }: CollageLayoutProps) {
  // Fade out typographic overlays as the zoom starts to clear up the viewport
  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [0.5, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.94]);

  return (
    <div className="relative w-full h-full">
      {/* Editorial Typographic Overlays */}
      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="absolute top-12 left-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888] select-none pointer-events-none hidden md:block"
      >
        [ 02 / ZOOM PARALLAX COLLAGE ]
      </motion.div>

      <motion.div
        style={{ opacity: textOpacity, scale: textScale }}
        className="absolute bottom-12 right-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888] select-none pointer-events-none text-right hidden md:block"
      >
        SCROLL TO EXPLORE <br />
        <span className="text-[#444444]">THE SPACE BETWEEN</span>
      </motion.div>

      {/* Render the 7 Images */}
      {PARALLAX_IMAGES.map((imgConfig) => {
        const anim = animations.find((a) => a.id === imgConfig.id);
        if (!anim) return null;

        return (
          <ParallaxImage
            key={imgConfig.id}
            id={imgConfig.id}
            src={imgConfig.src}
            alt={imgConfig.alt}
            className={imgConfig.className}
            scale={anim.scale}
            x={anim.x}
            y={anim.y}
            opacity={anim.opacity}
          />
        );
      })}
    </div>
  );
}
