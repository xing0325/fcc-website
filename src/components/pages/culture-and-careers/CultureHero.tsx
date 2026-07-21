"use client";

import { useAnim } from "@/lib/anim";

/** Centered intro line above the Culture collage. */
export default function CultureHero() {
  const eyebrowRef = useAnim<HTMLParagraphElement>("typeChars", {
    target: ".js-eyebrow",
  });
  const headingRef = useAnim<HTMLHeadingElement>("lineUp");

  return (
    <div className="px-15 pt-180 flex flex-col items-center lg:pt-260">
      <p
        ref={eyebrowRef}
        className="font-gta-mono fs-12 leading-none uppercase tracking-[0] text-blue"
      >
        <span className="js-eyebrow">Culture &amp; Careers / 文化与加入我们</span>
      </p>
      <h1
        ref={headingRef}
        className="mt-28 max-w-340 text-balance text-center font-pp-neue fs-32 font-normal leading-[1.02] tracking-[0] text-blue sm:max-w-420 lg:mt-40 lg:max-w-630 lg:fs-46 lg:leading-none"
      >
        与下一代站在一起，
        <br />
        把职业选择变成长期能力。
      </h1>
    </div>
  );
}
