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
  const tilesRef = useAnim<HTMLDivElement>("fadeIn", {
    target: ".js-tile",
    stagger: 0.05,
  });

  return (
    <section className="px-15 flex flex-col items-center mt-100 pb-100 lg:mt-150">
      <h2
        ref={titleRef}
        className="text-heading text-center font-normal fs-36 lg:font-medium lg:fs-46"
      >
        FCC Cares&mdash;信息平权,从校园开始
      </h2>

      <div
        ref={tilesRef}
        className="w-full grid grid-cols-2 gap-x-11 gap-y-10 mt-50 items-start content-start lg:grid-cols-5 lg:gap-16 lg:mt-100"
      >
        {CAUSES.map((cause, i) => (
          <div
            key={i}
            className="js-tile relative b-blue b-1px h-[32.77vw] flex-center px-40 group lg:h-[13.61vw] lg:px-73"
          >
            <div className="text-center transition-transform duration-200 ease-in-out group-hover:scale-110">
              <div className="text-blue font-pp-neue font-normal leading-none tracking-[0] fs-22 lg:fs-20">
                {cause.campus}
              </div>
              <div className="text-blue font-gta-mono font-normal uppercase leading-none tracking-[0] fs-12 mt-16">
                {cause.program}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
