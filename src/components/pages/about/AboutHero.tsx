"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";
import ArchiveImage from "@/components/ArchiveImage";

/**
 * About page hero — "About FCC / Boutique Career Agency".
 * Right-aligned page-title above a full-bleed dithered photo carrying
 * the mercury second line + intro paragraph; mercury stairs cut into the
 * bottom-left of the photo (same stair mechanic as the home IntroBlue).
 */

const STAIR_FRACTIONS = [1 / 3, 2 / 3, 1];

export default function AboutHero() {
  const titleRef = useAnim<HTMLDivElement>("title");
  const overlayTitleRef = useAnim<HTMLDivElement>("title", { delay: 0.15 });
  const textRef = useAnim<HTMLDivElement>("lineUp", { delay: 0.3 });
  const stairsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stairsRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".js-stairs"), {
        scaleX: 0,
        transformOrigin: "left",
        stagger: { each: 0.1, from: "end", ease: "power2.inOut" },
        scrollTrigger: {
          trigger: el,
          start: "bottom bottom",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-[100svh] lg:mb-36">
      <style>{`
        .about-stair {
          grid-column-end: -1;
          width: var(--stair-width-mobile);
        }
        @media (min-width: 1024px) {
          .about-stair {
            grid-column-end: var(--grid-column-end);
            width: var(--stair-width);
          }
        }
      `}</style>

      <div className="px-15 pt-180 lg:pt-312">
        <h1 className="sr-only">About FCC — Boutique Career Agency</h1>
        <div
          ref={titleRef}
          aria-hidden="true"
          role="text"
          className="text-blue text-right font-pp-neue font-medium tracking-[0] fs-52 leading-none lg:fs-160 lg:leading-[0.9375]"
        >
          About FCC
        </div>
      </div>

      <div className="relative mt-30 grid-stack-wrap lg:mt-15">
        {/* full-bleed archive photo */}
        <div className="grid-stack relative overflow-hidden aspect-[3/2]">
          <ArchiveImage
            src="/images/fcc-2.jpg"
            alt="FCC 团队与学员在一起"
            variant="archive"
            hover={false}
            eager
          />
        </div>

        {/* mercury copy stacked on the photo */}
        <div
          aria-hidden="true"
          className="grid-stack px-15 z-1 mt-20 pb-440 my-grid text-mercury lg:mt-150 lg:pb-132"
        >
          <div
            ref={overlayTitleRef}
            role="text"
            className="col-span-full font-pp-neue font-medium tracking-[0] fs-52 leading-none lg:fs-160 lg:leading-[0.9375]"
          >
            Boutique Career Agency
          </div>
          <div className="col-span-full page-text mt-160 lg:col-start-8 lg:col-span-4 lg:mt-192">
            <p ref={textRef}>
              FCC（Funshine Career Consulting）创立于 2021 年，是一家精品求职咨询机构。
              我们以长期主义为底色，陪伴新世代规划职业&mdash;&mdash;从背景诊断、导师匹配到最终
              Offer，与每一位学员一起穿越周期，共同拥有自己的职业未来。We Stand by the
              Next Generation, Own Our Career Future.
            </p>
          </div>
        </div>

        {/* mercury stairs cut into the photo's bottom-left */}
        <div
          ref={stairsRef}
          aria-hidden="true"
          className="absolute -bottom-1 px-15 my-grid left-0 w-full pointer-events-none"
        >
          {STAIR_FRACTIONS.map((fraction, i) => (
            <div
              key={i}
              className="js-stairs about-stair h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15"
              style={
                {
                  "--grid-column-end": "5",
                  "--stair-width-mobile": `calc(${fraction} * 100% + 1.875rem)`,
                  "--stair-width": `calc(${fraction} * 100% + 0.9375rem + 0.9375rem)`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
