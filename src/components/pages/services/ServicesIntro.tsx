"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * Services intro — original services_intro slice. Red full-bleed block with
 * the "Intro / [FCC.1]" mono label row, a large indented paragraph (masked
 * lineUp reveal) and the mercury "stairs" scrubbing in along the bottom
 * (same choreography as the home intro, but 4 columns wide:
 * --grid-column-end: 5).
 */

const STAIR_FRACTIONS = [1 / 3, 2 / 3, 1];

export default function ServicesIntro() {
  const mainRef = useAnim<HTMLParagraphElement>("lineUp");
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
    <section className="px-15 relative my-grid bg-blue text-mercury pt-20 pb-334 content-start page-text md:pb-214">
      <style>{`
        .svc-stair {
          grid-column-end: -1;
          width: var(--stair-width-mobile);
        }
        @media (min-width: 1024px) {
          .svc-stair {
            grid-column-end: var(--grid-column-end);
            width: var(--stair-width);
          }
        }
      `}</style>

      <div
        className="flex justify-between font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full text-mercury"
        aria-hidden="true"
      >
        <div>
          <span>Intro</span>
        </div>
        <div>[FCC.1]</div>
      </div>

      <div className="col-span-full mt-30 leading-[1.1] lg:col-start-6 lg:col-end-[-2] lg:mt-100">
        <p ref={mainRef}>
          <span
            aria-hidden="true"
            className="inline-block h-1 w-90 lg:w-[8.33vw]"
          />
          FCC 以六阶段全流程陪伴式辅导，陪你走完求职的每一步——从背景诊断、
          顾问匹配、导师指导、实战模拟，到职场分析与最终申请谈薪。
          每个阶段由核心顾问统筹推进、行业专家深度介入，
          以长期主义和信息透明为原则，把迷茫的求职过程变成一条可执行、
          可复盘的清晰路径。
        </p>
      </div>

      <div
        ref={stairsRef}
        aria-hidden="true"
        className="absolute -bottom-1 px-15 my-grid left-0 w-full pointer-events-none"
      >
        {STAIR_FRACTIONS.map((fraction, i) => (
          <div
            key={i}
            className="js-stairs svc-stair h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15"
            style={
              {
                "--grid-column-end": "5",
                "--stair-width-mobile": `calc(${fraction} * 100% + 1.875rem)`,
                "--stair-width": `calc(${fraction} * 100% + 0.9375rem)`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </section>
  );
}
