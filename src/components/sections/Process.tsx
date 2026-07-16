"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * Process — "Here at every step". The cards are a scroll-driven scrub,
 * ported verbatim from the original slice:
 *
 *   gsap.from(cards, {
 *     x: (i+1) * 150,  y: (i+1) * 200,     // desktop (75/100 on mobile)
 *     rotate: alternating ± random(10..25)deg,
 *     stagger: { each: 0.1, ease: "power2.out" },
 *     scrollTrigger: { start: "top bottom",
 *                      end: "bottom 50%" (desktop) / "bottom bottom" (mobile),
 *                      scrub: true },
 *   })
 *
 * so each card floats up-left into place one after another as you scroll,
 * and everything rests perfectly straight once the section clears.
 */

const CARDS = [
  {
    title: "Backend Support",
    number: "01",
    text: "后台客服：1 对 4 专属顾问群，1 对 1 制定个人职业规划。",
  },
  {
    title: "Core Consultant",
    number: "02",
    text: "核心顾问：全程梳理求职方向，答疑解惑，把控每一个节点。",
  },
  {
    title: "Industry Expert",
    number: "03",
    text: "行业专家：头部一线从业者亲自下场，解决行业信息差。",
  },
  {
    title: "Career Mentor",
    number: "04",
    text: "教研导师：锁定心仪岗位，简历、笔试、面试逐项击破。",
  },
] as const;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useAnim<HTMLDivElement>("title");
  const subtitleRef = useAnim<HTMLDivElement>("lineUp");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const build = () => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const xStep = isLg ? 150 : 75;
      const yStep = isLg ? 200 : 100;
      const cards = section.querySelectorAll(".js-card");
      gsap.from(cards, {
        x: (i: number) => (i + 1) * xStep,
        y: (i: number) => (i + 1) * yStep,
        stagger: { each: 0.1, ease: "power2.out" },
        rotate: (i: number) =>
          gsap.utils.wrap([-1, 1], i) * gsap.utils.random(10, 25),
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: `bottom ${isLg ? "50%" : "bottom"}`,
          scrub: true,
        },
      });
    };

    let ctx = gsap.context(build, section);
    let lastLg = window.matchMedia("(min-width: 1024px)").matches;
    const onResize = () => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      if (isLg === lastLg) return;
      lastLg = isLg;
      ctx.revert();
      ctx = gsap.context(build, section);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-15 relative overflow-hidden z-1 pt-18 pb-60 lg:pb-160"
    >
      {/* Full-section background rails at the lg column 5-8 boundaries. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-1 inset-0 my-grid grid-rows-[1fr]"
      >
        <div className="hidden col-start-5 col-span-4 border-l-1px border-r-1px b-blue lg:block"></div>
      </div>
      <div className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase">
        <div>
          <span>PROCESS</span>
        </div>
        <div aria-hidden="true">[FCC.2]</div>
      </div>
      <div className="my-grid mt-50 lg:mt-90">
        <div className="col-span-full lg:col-span-6 grid grid-cols-subgrid content-start">
          <div className="col-span-full my-title relative lg:col-span-6">
            <div className="relative">
              <div className="bg-mercury h-1/2 w-full absolute left-0 top-1/2 -translate-y-1/2 -z-1"></div>
              <div ref={titleRef}>
                <h2>
                  Here
                  <br />
                  at every
                  <br />
                  step
                </h2>
              </div>
            </div>
          </div>
          {/* my-text minus its built-in lg:12px downshift — the original
              bumps this block back up to 14px on desktop (my-text lg:fs-14) */}
          <div className="mt-80 col-start-2 col-end-[-1] font-gta-mono font-normal uppercase text-blue tracking-[0] fs-14 leading-[1.21] lg:leading-[1.33] lg:col-start-2 lg:col-span-3 lg:pr-55 lg:mt-46">
            <div ref={subtitleRef}>
              <p>
                求职路上的方向迷茫与信息差，常让最优秀的同学也无从下手——
                FCC 用一支专属团队陪你走完每一步。
              </p>
            </div>
          </div>
        </div>
        <div className="content-start col-span-full grid grid-cols-subgrid mt-66 space-y-[1.25em] lg:col-start-7 lg:col-span-6 lg:mt-0 lg:space-y-[2em]">
          {CARDS.map((card) => (
            <div
              key={card.number}
              className="js-card col-span-full bg-white text-blue pt-10 pb-20 px-16 lg:col-span-4 lg:pb-22 lg:px-22"
            >
              <div className="flex justify-between items-center font-pp-neue font-normal text-blue leading-none tracking-[0] fs-24 lg:fs-30">
                <h3>{card.title}</h3>
                <div className="mr-8">{card.number}</div>
              </div>
              <hr className="mt-8 lg:mt-10" />
              <div className="mt-20 lg:mt-26">
                <p className="my-text pr-60 lg:pr-150">{card.text}</p>
              </div>
              <hr className="mt-28 lg:mt-46" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
