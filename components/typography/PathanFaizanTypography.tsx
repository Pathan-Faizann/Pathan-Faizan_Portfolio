"use client";

import React from "react";

export interface PathanFaizanTypographyProps {
  /** Unique suffix for SVG clipPath ids (avoids collisions when multiple instances mount) */
  instanceId: string;
  className?: string;
  /** Ref attached to the animated wave path (loader only) */
  wavePathRef?: React.RefObject<SVGPathElement | null>;
  /** Solid white fill — used for hero title and post-fill loader state */
  solidFill?: boolean;
}

/**
 * Shared PATHAN / FAIZAN typography rendered as SVG.
 * Used identically by the loader (water fill) and hero (final title)
 * so the shared-element transition has zero rendering mismatch.
 */
export default function PathanFaizanTypography({
  instanceId,
  className,
  wavePathRef,
  solidFill = false,
}: PathanFaizanTypographyProps) {
  const clipId = `pathan-faizan-clip-${instanceId}`;

  const textProps = {
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontSize: 270,
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    fontWeight: 900,
    letterSpacing: "-12",
    style: { textTransform: "uppercase" as const },
  };

  return (
    <svg
      viewBox="0 0 1200 600"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "w-full h-auto"}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <text x="600" y="250" {...textProps}>
            PATHAN
          </text>
          <text x="600" y="520" {...textProps}>
            FAIZAN
          </text>
        </clipPath>
      </defs>

      {/* Ghost letterforms */}
      <text x="600" y="250" {...textProps} fill="#1a1a1a">
        PATHAN
      </text>
      <text x="600" y="520" {...textProps} fill="#1a1a1a">
        FAIZAN
      </text>

      {/* Liquid or solid fill */}
      {solidFill ? (
        <>
          <text x="600" y="250" {...textProps} fill="#f5f5f5">
            PATHAN
          </text>
          <text x="600" y="520" {...textProps} fill="#f5f5f5">
            FAIZAN
          </text>
        </>
      ) : (
        <g clipPath={`url(#${clipId})`}>
          <path ref={wavePathRef} fill="#f5f5f5" />
        </g>
      )}
    </svg>
  );
}
