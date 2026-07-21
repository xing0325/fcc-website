"use client";

import { useEffect, useRef } from "react";
import DitheredImage, { type DitheredImageRef } from "@/components/DitheredImage";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";
import { isLoaderComplete } from "@/lib/loaderBus";

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
  font-size: 3rem;
  line-height: 1.2;
}
/* The original ships md:fs-120 on this span but no matching CSS rule exists
   in its build — the tablet title really renders at the base size, wrapped to
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
  /* CJK glyphs are full-width (1em each): min(10vw, 10rem) keeps the 7-char
     first line inside its 3-column area at every lg viewport; line-height is
     opened slightly for CJK em boxes. */
  .hero .title {
    font-size: min(10vw, 10rem);
    line-height: 1.05;
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

  // Un-zoom the shader (1.2 → 1) in sync with the loader's Flip exit. When
  // the loader was skipped (already played this session / reduced motion)
  // no flip event will come — settle at 1 immediately.
  useEffect(() => {
    if (isLoaderComplete()) {
      const zoom = imageRef.current?.zoom;
      if (zoom) zoom.value = 1;
      return;
    }
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
          src="/images/fcc-6.jpg"
          zoom={1.2}
          revealOnScroll={false}
        />
      </div>
      <h1 className="sr-only">FCC——留学生与应届生的求职策略伙伴</h1>
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
          留学生与应届生
          <br />
          求职策略伙伴
        </span>
        <span
          ref={title1Ref}
          className="title hidden [grid-area:title1] mt-[-0.05em] lg:block"
          aria-hidden="true"
        >
          留学生与应届生
        </span>
        <span
          ref={title2Ref}
          className="title hidden [grid-area:title2] mb-10! lg:block"
          aria-hidden="true"
        >
          求职策略伙伴
        </span>
        <div className="col-start-3 col-end-[-1] mb-100 font-normal fs-24 leading-[1.15] tracking-normal md:col-start-[-4] lg:-ml-8 lg:mb-0 lg:[grid-area:tagline]">
          <div ref={taglineRef}>
            <p className="font-gta-mono fs-12 uppercase opacity-60 mb-10 hidden lg:block">
              Career Strategy Partner
            </p>
            <p>
              服务海内外高校
              <br />
              在读与应届学生，
              <br />
              覆盖咨询 / 互联网 / 投行 /
              <br />
              AI 四大赛道，
              <br />
              成都 · 新加坡两地。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
