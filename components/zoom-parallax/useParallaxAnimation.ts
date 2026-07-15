import { useTransform, MotionValue } from "framer-motion";
import { PARALLAX_IMAGES } from "./constants";

export interface MappedAnimation {
  id: string;
  scale: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

/**
 * Custom hook to map the raw scroll progress to individual eased transformations
 * for each image in the zoom parallax collage.
 * 
 * Easing: We apply a custom cubic easing function to the raw scroll value
 * to ensure the animation transitions smoothly at the beginning, climax, and release.
 */
export function useParallaxAnimation(scrollYProgress: MotionValue<number>): MappedAnimation[] {
  
  // Custom ease-in-out curve (comparable to premium CSS ease-in-out / cubic-bezier(0.76, 0, 0.24, 1))
  const easedProgress = useTransform(scrollYProgress, (v: number) => {
    // Cubic ease-in-out formula
    return v < 0.5 
      ? 4 * v * v * v 
      : 1 - Math.pow(-2 * v + 2, 3) / 2;
  });

  return PARALLAX_IMAGES.map((img) => {
    // 1. Scale mapping: from 1 (natural layout) to max scale
    const scale = useTransform(easedProgress, [0, 1], img.scaleRange);

    // 2. Positional translation mapping: starts at 0 (natural layout) and moves to the target flyout
    // We multiply the flyout coordinate by the depth factor to give subtle depth offsets (layering)
    const x = useTransform(easedProgress, [0, 1], [0, img.xRange[0] * img.depth]);
    const y = useTransform(easedProgress, [0, 1], [0, img.yRange[0] * img.depth]);

    // 3. Opacity mapping: fades supporting images to 0, while keeping the center image at 1
    const opacity = useTransform(easedProgress, [0, 1], img.opacityRange);

    return {
      id: img.id,
      scale,
      x,
      y,
      opacity,
    };
  });
}
