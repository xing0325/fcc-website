"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * IntroBlue — original home_intro slice. The main paragraph and the three
 * stats are masked lineUp reveals (stats delayed n × 0.2); the
 * mercury "stairs" at the bottom scrub in with scaleX 0 → 1 from the
 * right-most stair (stagger 0.1 from "end", power2.inOut) while the
 * section's bottom travels from the viewport bottom up to 30%.
 */

const STAIR_FRACTIONS = [1 / 3, 2 / 3, 1];

function Stat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useAnim<HTMLDivElement>("lineUp", { delay: index * 0.2 });
  return (
    <li>
      <div ref={ref}>
        <p className="font-pp-neue font-normal leading-none tracking-[0] fs-46 lg:fs-72">
          {value}
        </p>
        <p className="mt-10 font-normal font-gta-mono leading-[1.2] tracking-[0] fs-14 lg:fs-12 lg:leading-[1.33]">
          {label}
        </p>
      </div>
    </li>
  );
}

export default function IntroBlue() {
  // Chinese wraps to many lines; keep the 0.8s power4.out line reveal but
  // cut the inter-line stagger so total stagger stays ≤0.4s (~7 lines × 0.06).
  const mainRef = useAnim<HTMLParagraphElement>("lineUp", { stagger: 0.06 });
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
    <section className="px-15 relative my-grid min-h-screen content-start bg-blue text-mercury pt-60 pb-76 lg:pt-80 lg:pb-112">
      <style>{`
        .stair {
          grid-column-end: -1;
          width: var(--stair-width-mobile);
        }
        @media (min-width: 1024px) {
          .stair {
            grid-column-end: var(--grid-column-end);
            width: var(--stair-width);
          }
        }
      `}</style>

      <div
        ref={stairsRef}
        aria-hidden="true"
        className="absolute -bottom-1 px-15 my-grid left-0 w-full pointer-events-none"
      >
        {STAIR_FRACTIONS.map((fraction, i) => (
          <div
            key={i}
            className="js-stairs stair h-130 lg:h-140 bg-mercury col-start-1 pointer-events-auto -ml-15"
            style={
              {
                "--grid-column-end": "7",
                "--stair-width-mobile": `calc(${fraction} * 100% + 1.875rem)`,
                "--stair-width": `calc(${fraction} * 100% + 0.9375rem)`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="col-span-full tracking-[0] leading-none font-pp-neue font-normal fs-26 w-[99%] lg:col-start-1 lg:col-end-[-3] lg:fs-46 lg:w-full">
        <p ref={mainRef}>
          FCC 是一家精品求职咨询机构，为海内外高校在读与应届学生提供
          一对一的求职策略与面试辅导——从行业选择、简历网申到面试与
          Offer 决策，覆盖咨询、互联网、投行与 AI 产品四大赛道。
        </p>
      </div>

      <div className="col-start-3 col-end-[-1] mt-68 lg:col-start-7 lg:col-span-5 lg:mt-80">
        <ul className="flex flex-col space-y-50 lg:space-y-60">
          <Stat index={0} value="100+" label="在职一线导师" />
          <Stat index={1} value="500+" label="学员 Offer（截至 2025）" />
          <Stat index={2} value="成都 · 新加坡" label="2021 年起步，两地服务" />
        </ul>
      </div>
    </section>
  );
}
