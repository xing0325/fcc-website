"use client";

import { useAnim } from "@/lib/anim";

/**
 * FCC Cares slice — centered heading over a 2-up (mobile) / 5-up (lg)
 * grid of bordered typographic tiles that zoom on hover.
 */

type Cause = { campus: string; program: string };

// 免费校园分享 / 公益求职讲座 / 信息平权,走进高校的公益版图
const CAUSES: Cause[] = [
  { campus: "四川大学", program: "免费校园分享" },
  { campus: "电子科技大学", program: "公益求职讲座" },
  { campus: "复旦大学", program: "免费校园分享" },
  { campus: "上海交通大学", program: "行业认知工作坊" },
  { campus: "浙江大学", program: "公益求职讲座" },
  { campus: "武汉大学", program: "免费校园分享" },
  { campus: "西南财经大学", program: "公益求职讲座" },
  { campus: "香港大学", program: "行业认知工作坊" },
  { campus: "新加坡国立大学", program: "免费校园分享" },
  { campus: "南洋理工大学", program: "公益求职讲座" },
];

export default function OutsourceCares() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const introRef = useAnim<HTMLParagraphElement>("lineUp");
  const tilesRef = useAnim<HTMLDivElement>("fadeIn", {
    target: ".js-tile",
    stagger: 0.05,
  });

  return (
    <section className="px-15 mt-100 flex flex-col items-center pb-80 lg:mt-150 lg:pb-100">
      <h2
        ref={titleRef}
        className="text-heading max-w-340 text-balance text-center fs-32 font-normal leading-[1.02] sm:max-w-600 lg:max-w-none lg:fs-46 lg:font-medium lg:leading-none"
      >
        FCC Cares&mdash;信息平权，从校园开始
      </h2>

      <p
        ref={introRef}
        className="mt-24 max-w-340 text-balance text-center font-pp-neue fs-16 leading-[1.25] tracking-[0] text-blue sm:max-w-520 lg:mt-30 lg:max-w-630 lg:fs-20 lg:leading-[1.15]"
      >
        我们把真实的行业经验带进校园，让职业信息不再只属于少数人。
      </p>

      <div
        ref={tilesRef}
        className="mt-40 grid w-full grid-cols-2 content-start items-start gap-x-11 gap-y-10 lg:mt-70 lg:grid-cols-5 lg:gap-16"
      >
        {CAUSES.map((cause, i) => (
          <div
            key={i}
            className="js-tile group relative flex h-132 items-end border border-blue px-14 pb-16 sm:h-148 sm:px-20 lg:h-[13.61vw] lg:items-center lg:justify-center lg:px-42 lg:pb-0"
          >
            <div className="w-full text-left transition-transform duration-200 ease-in-out group-hover:-translate-y-3 lg:text-center lg:group-hover:translate-y-0 lg:group-hover:scale-105">
              <div className="font-pp-neue fs-18 font-normal leading-none tracking-[0] text-blue lg:fs-20">
                {cause.campus}
              </div>
              <div className="mt-12 font-gta-mono fs-10 font-normal uppercase leading-[1.15] tracking-[0] text-blue lg:mt-16 lg:fs-12 lg:leading-none">
                {cause.program}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
