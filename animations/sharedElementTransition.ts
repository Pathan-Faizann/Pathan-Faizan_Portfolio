import { gsap } from "@/lib/gsap";
import { EASE_PREMIUM } from "@/animations/constants";

export interface ElementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FlipTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

/** Read a live layout rect — never hardcode destination values. */
export function measureElement(el: HTMLElement): ElementRect {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

/** Center-to-center FLIP delta using GPU-friendly transforms only. */
export function computeFlipTransform(
  from: ElementRect,
  to: ElementRect
): FlipTransform {
  const fromCX = from.left + from.width / 2;
  const fromCY = from.top + from.height / 2;
  const toCX = to.left + to.width / 2;
  const toCY = to.top + to.height / 2;

  return {
    x: toCX - fromCX,
    y: toCY - fromCY,
    scaleX: to.width / from.width,
    scaleY: to.height / from.height,
  };
}

function forceVisible(root: HTMLElement): void {
  root.style.visibility = "visible";
  root.style.opacity = "1";

  root.querySelectorAll<HTMLElement | SVGElement>("*").forEach((node) => {
    if ("style" in node) {
      node.style.visibility = "visible";
      node.style.opacity = "1";
    }
  });
}

export interface FloatingClone {
  node: HTMLDivElement;
  destroy: () => void;
}

/**
 * Create a fixed-position floating clone from a source element.
 * Position/size are set once from measurement — only transform is animated.
 */
export function createFloatingClone(source: HTMLElement): FloatingClone {
  const rect = measureElement(source);

  const shell = document.createElement("div");
  shell.setAttribute("data-flip-clone", "true");
  shell.style.cssText = [
    "position:fixed",
    `left:${rect.left}px`,
    `top:${rect.top}px`,
    `width:${rect.width}px`,
    `height:${rect.height}px`,
    "z-index:99999",
    "pointer-events:none",
    "will-change:transform",
    "transform-origin:50% 50%",
    "visibility:visible",
    "opacity:1",
    "margin:0",
    "padding:0",
    "border:0",
  ].join(";");

  const content = source.cloneNode(true) as HTMLElement;
  content.style.width = "100%";
  content.style.height = "100%";
  forceVisible(content);

  shell.appendChild(content);
  document.body.appendChild(shell);

  gsap.set(shell, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    force3D: true,
  });

  return {
    node: shell,
    destroy() {
      shell.remove();
    },
  };
}

export interface FlipAnimationOptions {
  clone: FloatingClone;
  from: ElementRect;
  to: ElementRect;
  duration: number;
  ease?: string;
  onComplete?: () => void;
}

/** Animate a floating clone with translate3d + scale only. */
export function animateFlip({
  clone,
  from,
  to,
  duration,
  ease = EASE_PREMIUM,
  onComplete,
}: FlipAnimationOptions) {
  const transform = computeFlipTransform(from, to);

  return gsap.to(clone.node, {
    x: transform.x,
    y: transform.y,
    scaleX: transform.scaleX,
    scaleY: transform.scaleY,
    duration,
    ease,
    force3D: true,
    onComplete,
  });
}
