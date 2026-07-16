"use client";

import { useState } from "react";
import DitheredImage from "@/components/DitheredImage";
import FlipArrowLink from "@/components/FlipArrowLink";
import { TopRightArrowIcon } from "@/components/icons";
import { useAnim } from "@/lib/anim";

const posts = [
  {
    date: "01",
    datetime: "2026-01-01",
    category: "Consulting",
    title: "徐天石 — 波士顿咨询公司全球合伙人兼董事，Consulting Partner",
    href: "#mentors",
    image: "/images/fcc-1.jpg",
  },
  {
    date: "02",
    datetime: "2026-01-02",
    category: "Internet",
    title: "林晓斌 — 腾讯云前任副总裁，Internet Product Partner",
    href: "#mentors",
    image: "/images/fcc-4.jpg",
  },
  {
    date: "03",
    datetime: "2026-01-03",
    category: "Banking",
    title: "K 导师 — 顶尖投行 VP，投行求职全程规划",
    href: "#mentors",
    image: "/images/fcc-8.jpg",
  },
  {
    date: "04",
    datetime: "2026-01-04",
    category: "AI Product",
    title: "Q 导师 — 清华系 AI 公司 VP，AI 产品求职实战",
    href: "#mentors",
    image: "/images/fcc-6.jpg",
  },
];

export default function News() {
  const cardsRef = useAnim<HTMLDivElement>("fadeUp");
  const [active, setActive] = useState(0);

  return (
    <section className="px-15 my-grid overflow-hidden pt-50 pb-64 lg:pb-100">
      {/* header row */}
      <div className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full border-t-1px b-blue pt-18">
        <div>
          <span>Our Mentors</span>
        </div>
        <div>
          <FlipArrowLink label="View All Mentors" href="#mentors" className="my-text" />
        </div>
      </div>

      {/* big feature image — the four post images stacked, crossfaded by the hovered card */}
      <div className="col-span-full grid-stack-wrap mt-50 aspect-square lg:col-start-1 lg:col-span-6">
        {posts.map((post, i) => (
          <div
            key={post.image}
            className={`overflow-hidden w-full h-full grid-stack relative transition-opacity duration-700 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <DitheredImage src={post.image} alt="" />
          </div>
        ))}
      </div>

      {/* 2x2 post cards */}
      <div
        ref={cardsRef}
        className="col-span-full mt-15 flex flex-nowrap gap-x-10 lg:col-span-6 lg:grid lg:grid-cols-subgrid lg:mt-50 lg:gap-x-0"
        onMouseLeave={() => setActive(0)}
      >
        {posts.map((post, i) => (
          <article
            key={post.href}
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
            <time dateTime={post.datetime} className="transition-colors duration-500">
              {post.date}
            </time>
            <div className="mt-24 transition-colors duration-500">
              <span className="font-gta-mono uppercase fs-10">{post.category}</span>
              <h3 className="mt-22">{post.title}</h3>
            </div>
            <a
              href={post.href}
              className="absolute inset-0 outline-none"
              aria-label={`认识导师: ${post.title}`}
              onFocus={() => setActive(i)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
