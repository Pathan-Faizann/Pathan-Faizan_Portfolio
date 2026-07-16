export interface ParallaxImageConfig {
  id: string;
  src: string;
  alt: string;
  content?: "about" | "statement" | "manifesto" | "projects";
  /**
   * Tailwind classes to lay out the image's container wrapper.
   * Defines default absolute positioning (top/left/right/bottom), z-index,
   * width, height, and display properties for desktop, tablet, and mobile.
   */
  className: string;
  
  /**
   * Framer Motion useTransform mappings from scrollProgress [0, 1].
   */
  scaleRange: [number, number];
  xRange: [number, number];
  yRange: [number, number];
  opacityRange: [number, number];
  
  /**
   * Controls the relative depth/parallax factor. Higher means more responsive to secondary motion.
   */
  depth: number;
}
