"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * IntroBlue — original home_intro slice. The main paragraph and both
 * highlights are masked lineUp reveals (highlights delayed n × 0.2); the
 * mercury "stairs" at the bottom scrub in with scaleX 0 → 1 from the
 * right-most stair (stagger 0.1 from "end", power2.inOut) while the
 * section's bottom travels from the viewport bottom up to 30%.
 */

const STAIR_FRACTIONS = [1 / 3, 2 / 3, 1];

function Highlight({ text, index }: { text: string; index: number }) {
  const ref = useAnim<HTMLParagraphElement>("lineUp", { delay: index * 0.2 });
  return (
    <li className="font-normal font-gta-mono uppercase leading-[1.2] tracking-[0] fs-14 lg:fs-12 lg:w-280 lg:leading-[1.33]">
      <p ref={ref}>{text}</p>
    </li>
  );
}

export default function IntroBlue() {
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
          FCC 作为 Boutique Career Agency，始终关注亚太、北美与英国的高薪行业
          和新兴赛道，持续研究职场战略发展态势。我们汇聚来自全球顶尖金融、
          战略咨询、科技新贵与独角兽企业的一线从业者，组成 FCC
          导师顾问团队，提供私人型的职业咨询与策略指导——不仅帮助你踏入
          世界顶级公司，更致力于探索职业发展的多元可能，规划职场的永续发展路径。
        </p>
      </div>

      <div className="col-start-3 col-end-[-1] mt-68 lg:col-start-7 lg:col-span-5 lg:mt-80">
        <ul className="flex flex-col space-y-50 lg:grid lg:gap-x-[65.6px] lg:grid-cols-[auto_auto]">
          <Highlight
            index={0}
            text="长期主义&mdash;&mdash;短期起步就站在头部平台，长期搭建能持续增值的职业成长路线，未来转行晋升都不慌。"
          />
          <Highlight
            index={1}
            text="从金融、咨询的看家本领出发，全力押注驱动人类进步的新赛道&mdash;&mdash;大健康、数字智能、跨境出海、半导体与双碳。"
          />
        </ul>
      </div>
    </section>
  );
}
