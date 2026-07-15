import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  
  // Create a premium, custom ease: slow start, rapid sweep, smooth deceleration.
  // This corresponds to a custom bezier curve: [0.76, 0, 0.24, 1] (or similar custom cubic-bezier)
  CustomEase.create("premium-ease", "M0,0 C0.76,0 0.24,1 1,1");
}

export * from "gsap";
export { ScrollTrigger, CustomEase };
