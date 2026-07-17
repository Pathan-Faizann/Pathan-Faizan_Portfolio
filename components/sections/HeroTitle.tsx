"use client";

import React, { useId } from "react";
import PathanFaizanTypography from "@/components/typography/PathanFaizanTypography";

/**
 * HeroTitle
 *
 * Uses the exact same SVG typography as the loader so the shared-element
 * landing swap is mathematically invisible.
 *
 * visibility:hidden keeps layout stable without display:none shifts.
 * width:fit-content ensures getBoundingClientRect() returns true text bounds.
 */
const HeroTitle = React.forwardRef<HTMLHeadingElement>(
  function HeroTitle(_props, ref) {
    const instanceId = useId().replace(/:/g, "");

    return (
      <h1
        ref={ref}
        className="select-none"
        style={{ visibility: "hidden", width: "fit-content" }}
        aria-label="Pathan Faizan"
      >
        <div className="w-[78vw] sm:w-[64vw] md:w-[50vw] lg:w-[38vw] xl:w-[34vw] max-w-[640px]">
          <PathanFaizanTypography instanceId={`hero-${instanceId}`} solidFill />
        </div>
      </h1>
    );
  },
);

export default HeroTitle;
