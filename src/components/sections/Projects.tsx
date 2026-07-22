"use client";

import { useEffect, useRef } from "react";
import SlideButton from "@/components/SlideButton";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

const cases = [
  {
    index: "01",
    category: "Consulting",
    title: "Accenture · 分析师",
    student: "W 同学|2025 届|商科",
    chain: {
      start: "双非本科,零咨询实习",
      intervention: "8 周 Case 训练 + 2 位行业专家内推",
      result: "2025.09 拿到 Offer",
    },
    href: "/projects",
  },
  {
    index: "02",
    category: "Consulting",
    title: "Bain · 2025 Spring PTA",
    student: "L 同学|2026 届|经济学|海本",
    chain: {
      start: "框架背得熟,Mock 一追问就乱",
      intervention: "12 轮高强度 Mock + 结构化表达专项",
      result: "2025.03 拿到 PTA Offer",
    },
    href: "/projects",
  },
  {
    index: "03",
    category: "Consulting",
    title: "PwC · 暑期实习",
    student: "C 同学|2026 届|跨专业|工科转商",
    chain: {
      start: "工科转商,简历投递长期没有回音",
      intervention: "4 次行业专家 1v1 + 简历逐条重写",
      result: "2025.04 拿到暑期实习",
    },
    href: "/projects",
  },
];

type CaseItem = (typeof cases)[number];

function CaseTitle({ title, index }: { title: string; index: number }) {
  const ref = useAnim<HTMLHeadingElement>("lineUp", { delay: index * 0.3 });
  return (
    <h3
      ref={ref}
      className="text-blue font-normal font-pp-neue fs-36 leading-none tracking-[0]"
    >
      {title}
    </h3>
  );
}

function CaseChain({ item, index }: { item: CaseItem; index: number }) {
  const ref = useAnim<HTMLDivElement>("fadeUp", { delay: index * 0.3 + 0.2 });
  return (
    <div ref={ref} className="mt-24">
      <ul className="text-blue font-normal fs-16 leading-[1.6] tracking-[0]">
        <li>
          <span className="font-gta-mono fs-12 uppercase opacity-60">
            起点
          </span>
          <p>{item.chain.start}</p>
        </li>
        <li className="mt-14 pt-14 border-t-1px b-blue">
          <span className="font-gta-mono fs-12 uppercase opacity-60">
            → 干预
          </span>
          <p>{item.chain.intervention}</p>
        </li>
        <li className="mt-14 pt-14 border-t-1px b-blue">
          <span className="font-gta-mono fs-12 uppercase opacity-60">
            → 结果
          </span>
          <p>{item.chain.result}</p>
        </li>
      </ul>
      <div className="mt-24 text-blue font-gta-mono fs-12 leading-none tracking-[0] opacity-60">
        {item.student}
      </div>
    </div>
  );
}

export default function Projects() {
  const labelRef = useAnim<HTMLDivElement>("fadeIn");
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const linesRef = useAnim<HTMLDivElement>("line", {
    target: ".js-project-line",
    stagger: 0.3,
  });
  const buttonRef = useAnim<HTMLDivElement>("fadeUp");
  const noteRef = useAnim<HTMLParagraphElement>("fadeIn");

  // OCI-style whole-column scroll parallax on the three case columns:
  // each column starts at a different vertical offset (0 / 30 / 15vh) and
  // drifts ~12vh over the scroll, odd/even columns in opposite directions
  // (even down, odd up). lg desktop only; skipped for reduced-motion. The
  // columns carry a large bottom padding (lg:pb-[32vh]) so every column
  // drifts down into its own reserved space instead of colliding with the
  // button row or leaving a void beneath the section.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const build = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const cols = gsap.utils.toArray<HTMLElement>(
        grid.querySelectorAll("[data-project-index]"),
      );
      if (!cols.length) return;
      const FROM = [0, 30, 15];
      const TO = [12, 18, 27]; // even cols drift down, odd col drifts up
      ctx = gsap.context(() => {
        gsap.set(cols, { y: (i: number) => `${FROM[i % FROM.length]}vh` });
        gsap.to(cols, {
          y: (i: number) => `${TO[i % TO.length]}vh`,
          scrollTrigger: {
            trigger: grid,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, grid);
    };

    build();
    let lastLg = window.matchMedia("(min-width: 1024px)").matches;
    const onResize = () => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      if (isLg === lastLg) return;
      lastLg = isLg;
      ctx?.revert();
      ctx = null;
      build();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  return (
    <section className="px-15 pb-15">
      <div className="border-t-1px b-blue pt-50 lg:pt-100"></div>
      <div className="my-grid">
        <div className="my-title text-center col-span-full lg:col-start-3 lg:col-end-[-3]">
          <div
            ref={labelRef}
            className="hidden lg:block text-blue font-gta-mono fs-12 leading-none tracking-[0] uppercase opacity-60 mb-24"
          >
            Recent Offers
          </div>
          <h2 ref={titleRef}>
            最新学员
            <br />
            Offer
          </h2>
        </div>
      </div>
      <div ref={gridRef} className="my-grid relative mt-130 gap-y-60 lg:pb-40">
        <div ref={linesRef} className="hidden absolute top-0 left-0 w-full h-full my-grid lg:grid">
          {cases.map((item) => (
            <div
              key={item.index}
              className="js-project-line absolute top-0 left-0 b-blue pointer-events-none w-[1px] border-l-1px h-full translate-x-[0.5px] col-span-4 static!"
            ></div>
          ))}
        </div>
        {cases.map((item, i) => (
          <div
            key={item.index}
            className="col-span-full lg:col-span-4 lg:pl-15 lg:pr-65 lg:pb-[32vh]"
            data-project-index={i}
          >
            <div className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase lg:pr-12">
              <div>
                <span>{item.index}</span>
              </div>
              <div aria-hidden="true">{item.category}</div>
            </div>
            <div className="mt-44 relative z-1">
              <div className="bg-mercury absolute w-[2vw] h-full top-0 right-full -z-1"></div>
              <CaseTitle title={item.title} index={i} />
              <div className="relative">
                <CaseChain item={item} index={i} />
                <a
                  href={item.href}
                  className="absolute inset-0"
                  aria-label={`查看学员案例: ${item.title}`}
                ></a>
              </div>
            </div>
          </div>
        ))}
        <div
          ref={buttonRef}
          className="relative z-1 col-span-full mt-100 lg:col-start-5 lg:col-end-[span_3] lg:justify-self-start"
        >
          <div className="hidden lg:block bg-mercury absolute right-0 w-[105%] h-full -z-1"></div>
          <SlideButton
            label="View All Cases"
            href="/projects"
            className="w-full lg:w-248 lg:ml-15"
          />
        </div>
        <p
          ref={noteRef}
          className="col-span-full text-blue font-gta-mono fs-12 leading-none tracking-[0] opacity-60 text-center mt-40"
        >
          案例与评价均经学员授权,信息已脱敏。
        </p>
      </div>
    </section>
  );
}
