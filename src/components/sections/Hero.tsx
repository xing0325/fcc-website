"use client";

import { useEffect, useRef } from "react";
import DitheredImage, { type DitheredImageRef } from "@/components/DitheredImage";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * Hero — full-viewport dithered photo, oversized two-line title,
 * tagline and white vertical grid lines.
 *
 * Original choreography: the shader starts at zoom 1.2 and un-zooms to 1
 * (1.33s power4.inOut) in sync with the loader's Flip to the header; the
 * titles are per-char `title` reveals (delays 0.333 / 0.4, trigger at
 * "top 100%"), the grid lines are `line` reveals (delay 0.3) and the
 * tagline is a masked `lineUp` (delay 0.8) — all gated on LOADER_COMPLETE.
 */

const heroCss = `
.hero .title {
  font-weight: 500;
  letter-spacing: 0;
  font-size: 3.25rem;
  line-height: 1.2;
}
/* The original ships md:fs-120 on this span but no matching CSS rule exists
   in its build — the tablet title really renders at the base 52px, wrapped to
   two lines by the md column constraint (see qa2/orig-tablet-768-full.png). */
@media (min-width: 1024px) {
  .my-grid.hero {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: 1fr auto;
    grid-template-areas:
      ". . line1 line2"
      ". . line1 tagline"
      "title1 title1 title1 line3"
      "title2 title2 title2 title2"
      ". . line4 line5";
  }
  .hero .title {
    font-size: 10rem;
    line-height: 0.9375;
    margin-left: 15px;
  }
}
`;

const LINES: {
  area: string;
  wrapperClass?: string;
  style: React.CSSProperties;
}[] = [
  { area: "line1", style: { height: "100%", top: 0 } },
  { area: "line2", style: { height: "calc(100% - 50px)", top: 0 } },
  { area: "line3", style: { height: "calc(100% - 60px)", bottom: 0 } },
  { area: "line4", wrapperClass: "h-45!", style: { height: "100%", top: 0 } },
  { area: "line5", wrapperClass: "h-45!", style: { height: "100%", top: 0 } },
];

export default function Hero() {
  const imageRef = useRef<DitheredImageRef>(null);

  const linesRef = useAnim<HTMLDivElement>("line", {
    target: ".js-home-intro-line",
    delay: 0.3,
  });
  const titleMobileRef = useAnim<HTMLSpanElement>("title", { triggerStart: "100%" });
  const title1Ref = useAnim<HTMLSpanElement>("title", {
    delay: 0.333,
    triggerStart: "100%",
  });
  const title2Ref = useAnim<HTMLSpanElement>("title", {
    delay: 0.4,
    triggerStart: "100%",
  });
  const taglineRef = useAnim<HTMLDivElement>("lineUp", { duration: 1, delay: 0.8 });

  // Un-zoom the shader (1.2 → 1) in sync with the loader's Flip exit.
  useEffect(() => {
    const onFlip = () => {
      const zoom = imageRef.current?.zoom;
      if (zoom) {
        gsap.to(zoom, { value: 1, duration: 1.33, ease: "power4.inOut" });
      }
    };
    window.addEventListener("oci:loader-flip", onFlip);
    return () => window.removeEventListener("oci:loader-flip", onFlip);
  }, []);

  return (
    <section className="px-15 relative h-svh">
      <style>{heroCss}</style>
      <div className="overflow-hidden absolute h-full w-full inset-0">
        <DitheredImage
          ref={imageRef}
          src="/images/fcc-1.jpg"
          zoom={1.2}
          revealOnScroll={false}
        />
      </div>
      <h1 className="sr-only">Funshine Career Consulting</h1>
      <div
        ref={linesRef}
        className="hero relative my-grid h-full place-content-end font-pp-neue text-white pb-62 lg:grid-cols-4 lg:pb-0"
      >
        {LINES.map(({ area, wrapperClass, style }) => (
          <div
            key={area}
            className={`hidden relative overflow-hidden lg:block${wrapperClass ? ` ${wrapperClass}` : ""}`}
            style={{ gridArea: area }}
            aria-hidden="true"
          >
            <div
              className="js-home-intro-line bg-white w-px absolute left-0"
              style={style}
            />
          </div>
        ))}
        {/* md column constraint makes the 52px title wrap after the first word,
            matching the original's two-line tablet rendering. */}
        <span
          ref={titleMobileRef}
          className="title col-span-full row-start-2 md:col-end-[-3] lg:hidden"
        >
          Funshine Career Consulting
        </span>
        <span
          ref={title1Ref}
          className="title hidden [grid-area:title1] mt-[-0.05em] lg:block"
          aria-hidden="true"
        >
          Funshine
        </span>
        <span
          ref={title2Ref}
          className="title hidden [grid-area:title2] mb-10! lg:block"
          aria-hidden="true"
        >
          Career Consulting.
        </span>
        <div className="col-start-3 col-end-[-1] mb-100 font-normal fs-24 leading-none tracking-normal md:col-start-[-4] lg:-ml-8 lg:mb-0 lg:[grid-area:tagline]">
          <div ref={taglineRef}>
            <p>
              We stand by the
              <br />
              next generation, own
              <br />
              our career future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
