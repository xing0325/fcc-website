"use client";

import { useAnim } from "@/lib/anim";

/** Centered intro line above the Culture collage. */
export default function CultureHero() {
  const headingRef = useAnim<HTMLHeadingElement>("lineUp");

  return (
    <div className="px-15 pt-200 flex justify-center lg:pt-312">
      <h1
        ref={headingRef}
        className="text-blue font-pp-neue font-normal text-center tracking-[0] leading-none fs-36 max-w-360 lg:fs-46 lg:leading-none lg:max-w-630"
      >
        {`文化与加入我们 Culture & Careers——在 FCC,我们与下一代站在一起。`}
      </h1>
    </div>
  );
}
