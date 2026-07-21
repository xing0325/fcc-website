"use client";

import { useState } from "react";
import FlipArrowLink from "@/components/FlipArrowLink";
import { TopRightArrowIcon } from "@/components/icons";
import { useAnim } from "@/lib/anim";

const mentors = [
  {
    date: "01",
    datetime: "2026-01-01",
    tag: "Consulting",
    track: "咨询",
    title: "咨询赛道导师 · 10 年战略咨询经验",
    years: "10 年战略咨询经验",
    focus: ["Case 面试", "结构化表达"],
    href: "/about#mentors",
  },
  {
    date: "02",
    datetime: "2026-01-02",
    tag: "Internet",
    track: "互联网",
    title: "互联网赛道导师 · 9 年大厂产品经验",
    years: "9 年大厂产品经验",
    focus: ["产品面试", "项目叙事"],
    href: "/about#mentors",
  },
  {
    date: "03",
    datetime: "2026-01-03",
    tag: "Banking",
    track: "投行",
    title: "投行赛道导师 · 8 年 IBD 经验",
    years: "8 年 IBD 经验",
    focus: ["技术面", "估值与三张报表"],
    href: "/about#mentors",
  },
  {
    date: "04",
    datetime: "2026-01-04",
    tag: "AI Product",
    track: "AI",
    title: "AI 赛道导师 · 7 年 AI 产品经验",
    years: "7 年 AI 产品经验",
    focus: ["AI PM 面试", "作品集"],
    href: "/about#mentors",
  },
];

export default function News() {
  const panelRef = useAnim<HTMLDivElement>("fadeIn");
  const cardsRef = useAnim<HTMLDivElement>("fadeUp");
  const noteRef = useAnim<HTMLParagraphElement>("fadeUp", { delay: 0.15 });
  const [active, setActive] = useState(0);

  return (
    <section className="px-15 my-grid overflow-hidden pt-50 pb-64 lg:pb-100">
      {/* header row */}
      <div className="flex justify-between items-end text-blue col-span-full border-t-1px b-blue pt-18">
        <div>
          <span className="block font-gta-mono fs-12 leading-none uppercase opacity-60">
            Our Mentors
          </span>
          <h2 className="font-pp-neue font-normal fs-32 leading-none mt-14 lg:fs-46">
            导师团队
          </h2>
        </div>
        <div className="font-gta-mono fs-12 leading-none uppercase">
          <FlipArrowLink label="View All Mentors" href="/about#mentors" className="my-text" />
        </div>
      </div>

      {/* big feature panel — typographic, crossfaded by the hovered card */}
      <div
        ref={panelRef}
        className="col-span-full grid-stack-wrap mt-50 aspect-square bg-blue text-mercury lg:col-start-1 lg:col-span-6"
      >
        {mentors.map((mentor, i) => (
          <div
            key={mentor.tag}
            aria-hidden={active !== i}
            className={`grid-stack w-full h-full flex flex-col justify-between p-28 transition-opacity duration-700 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex justify-between font-gta-mono fs-12 leading-none uppercase">
              <span>{mentor.tag}</span>
              <span className="opacity-60">{mentor.date} / 04</span>
            </div>
            <div className="font-pp-neue font-normal fs-80 leading-[0.95] lg:fs-120">
              {mentor.track}
            </div>
            <div>
              <div className="font-gta-mono fs-12 leading-none uppercase opacity-60">
                {mentor.years}
              </div>
              <ul className="mt-14 font-pp-neue fs-18 leading-[1.3] lg:fs-20">
                {mentor.focus.map((item) => (
                  <li key={item} className="border-t-1px b-mercury py-8">
                    主带:{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 2x2 mentor cards */}
      <div
        ref={cardsRef}
        className="col-span-full mt-15 flex flex-nowrap gap-x-10 lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:mt-50 lg:gap-x-0"
        onMouseLeave={() => setActive(0)}
      >
        {mentors.map((mentor, i) => (
          <article
            key={mentor.tag}
            onMouseEnter={() => setActive(i)}
            className={`group relative ${
              active === i ? "text-mercury" : "text-blue"
            } font-pp-neue font-normal fs-18 tracking-[0] leading-none w-[76.94vw] min-h-280 border-y b-blue shrink-0 pr-55 pl-28 pt-18 pb-28 flex flex-col justify-between lg:col-span-3 lg:w-auto lg:aspect-square ${
              i < 2 ? "lg:border-y-0" : ""
            }`}
          >
            {/* blue background of the active (featured) card + corner arrow button on hover */}
            <div
              className={`bg-blue absolute -z-1 inset-0 transition-opacity duration-500 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="size-85 bg-mercury border-[0.5px] b-blue absolute top-0 right-0 flex-center origin-top-right lg:size-90 will-change-transform scale-0 transition-transform duration-500 group-hover:scale-100">
                <TopRightArrowIcon
                  className="icon size-[40%] text-blue origin-center will-change-transform"
                  aria-hidden="true"
                />
              </div>
            </div>
            {/* vertical rule between the two card columns (lg) */}
            {(i === 1 || i === 3) && (
              <span
                aria-hidden="true"
                className="hidden lg:block absolute top-18 bottom-18 left-0 w-1 bg-blue"
              />
            )}
            <time dateTime={mentor.datetime} className="transition-colors duration-500">
              {mentor.date}
            </time>
            <div className="mt-24 transition-colors duration-500">
              <span className="font-gta-mono uppercase fs-10">{mentor.tag}</span>
              <h3 className="mt-22">{mentor.title}</h3>
              <p className="mt-14 fs-14 leading-[1.4]">
                主带:{mentor.focus.join("、")}
              </p>
            </div>
            <a
              href={mentor.href}
              className="absolute inset-0 outline-none"
              aria-label={`认识导师: ${mentor.title}`}
              onFocus={() => setActive(i)}
            />
          </article>
        ))}
      </div>

      {/* disclosure note */}
      <p
        ref={noteRef}
        className="col-span-full mt-24 text-blue font-gta-mono fs-12 leading-[1.5] opacity-60"
      >
        导师均为在职从业者,入驻前经资历核验;应合规要求统一脱敏展示。
      </p>
    </section>
  );
}
