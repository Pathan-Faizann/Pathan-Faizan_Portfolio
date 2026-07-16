// ─── Loader / Hero Cinematic Sequence — Shared Constants ────────────────────

// Easing strings (must match CustomEase registered in lib/gsap.ts)
export const EASE_PREMIUM = "premium-ease";
export const EASE_CURTAIN = "power4.inOut";
export const EASE_PORTRAIT = "power3.out";
export const EASE_SUBTITLE = "power2.out";

// ── Water fill ───────────────────────────────────────────────────────────────
/** Delay before water starts rising (seconds) */
export const WATER_DELAY = 0.4;
/** Duration of the water fill animation (seconds) */
export const WATER_DURATION = 4.0;
/** How long to hold after fill is complete (seconds) */
export const FILL_HOLD = 0.5;

// ── Morph / curtain ──────────────────────────────────────────────────────────
/** Duration of the text morph (scale + translate) */
export const MORPH_DURATION = 1.1;
/** Curtain slide-up duration */
export const CURTAIN_DURATION = 1.3;
/** How far into the morph the curtain starts (seconds offset, positive = later) */
export const CURTAIN_OFFSET = 0.15;

// ── Hero entrance (triggered after morph lands) ──────────────────────────────
/** Delay after loader calls onComplete before hero elements start entering */
export const HERO_ENTRANCE_DELAY = 0.05;
/** Portrait reveal duration */
export const PORTRAIT_DURATION = 1.5;
/** Subtitle fade duration */
export const SUBTITLE_DURATION = 1.1;
/** Scroll indicator fade duration */
export const SCROLL_INDICATOR_DURATION = 1.0;
