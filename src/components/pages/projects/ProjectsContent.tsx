"use client";

import { useEffect, useRef, useState } from "react";
import DitheredImage from "@/components/DitheredImage";
import { TopRightArrowIcon } from "@/components/icons";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";

/**
 * Recent Offers index — "Recent Offers (N)" title, sticky category filter
 * rail and the 4-column masonry-ish card grid, ported from the original
 * projects route. Cards keep the original spans (2/1 columns), the two
 * vw-offset cards, and the differential parallax drift on the
 * `js-project-parallax` cards (same scrub pattern as the home projects
 * slice). Filtering fades the grid and re-renders the matching cards; the
 * active filter is dimmed to 50% like the original.
 */

const FILTERS = [
  "All",
  "Consulting",
  "Internet",
  "Banking",
  "AI Product",
] as const;

type Filter = (typeof FILTERS)[number];

interface Project {
  title: string;
  category: Exclude<Filter, "All">;
  href: string;
  image: string;
  /** lg column span in the 4-col grid */
  span: 1 | 2;
  /** original js-project-parallax flag */
  parallax?: boolean;
  /** the two offset cards carry vw margins */
  offset?: boolean;
}

const PROJECTS: Project[] = [
  { title: "Accenture · 分析师", category: "Consulting", href: "/contact#accenture-analyst", image: "/images/fcc-1.jpg", span: 2 },
  { title: "Bain · 2025 Spring PTA", category: "Consulting", href: "/contact#bain-pta", image: "/images/fcc-2.jpg", span: 1, parallax: true },
  { title: "PwC · 暑期实习", category: "Consulting", href: "/contact#pwc-summer", image: "/images/fcc-3.jpg", span: 1, parallax: true },
  { title: "腾讯 · 产品经理", category: "Internet", href: "/contact#tencent-pm", image: "/images/fcc-4.jpg", span: 1, parallax: true },
  { title: "中金 · IBD 暑期", category: "Banking", href: "/contact#cicc-ibd", image: "/images/fcc-5.jpg", span: 1, parallax: true },
  { title: "BCG · PTA", category: "Consulting", href: "/contact#bcg-pta", image: "/images/fcc-6.jpg", span: 2 },
  { title: "字节跳动 · 数据分析", category: "Internet", href: "/contact#bytedance-da", image: "/images/fcc-7.jpg", span: 2 },
  { title: "高盛 · Markets 暑期", category: "Banking", href: "/contact#gs-markets", image: "/images/fcc-8.jpg", span: 2, parallax: true, offset: true },
  { title: "麦肯锡 · BA", category: "Consulting", href: "/contact#mckinsey-ba", image: "/images/fcc-9.jpg", span: 2 },
  { title: "智谱 AI · 产品实习", category: "AI Product", href: "/contact#zhipu-ai-pm", image: "/images/fcc-10.jpg", span: 1, parallax: true },
];

const pageTitleCss = `
.projects-page .page-title {
  font-family: var(--font-pp-neue);
  font-weight: 500;
  letter-spacing: 0;
  font-size: 3.25rem;
  line-height: 1;
}
@media (min-width: 1024px) {
  .projects-page .page-title {
    font-size: 10rem;
    line-height: 0.9375;
  }
}
`;

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`col-span-full relative lg:self-start ${
        project.span === 2 ? "lg:col-span-2" : "lg:col-span-1"
      }${project.offset ? " lg:ml-[8.21vw] lg:mr-[12.36vw]" : ""}`}
    >
      <div
        className="relative"
        data-project-parallax={project.parallax ? "" : undefined}
      >
        <div className="overflow-hidden relative group w-full aspect-[382/257]">
          <DitheredImage src={project.image} alt={project.title} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div
            className="bg-white border-[0.5px] b-blue absolute bottom-0 right-0 flex-center scale-0 origin-bottom-right will-change-transform transition-transform duration-500 group-hover:scale-100"
            style={{ width: "3.75rem", height: "3.75rem" }}
          >
            <TopRightArrowIcon
              className="icon size-[53%] text-blue scale-0 origin-center transition-transform duration-500 delay-100 group-hover:scale-100"
              aria-hidden="true"
            />
          </div>
        </div>
        <h2 className="text-blue mt-20 text-heading font-normal fs-36 leading-[0.83]">
          {project.title}
        </h2>
        <div className="text-mono font-normal fs-18 leading-[1.67] mt-8">
          {project.category}
        </div>
        <a
          href={project.href}
          className="absolute inset-0"
          aria-label={`查看学员案例:${project.title}`}
        ></a>
      </div>
    </div>
  );
}

export default function ProjectsContent() {
  const [filter, setFilter] = useState<Filter>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const titleRef = useAnim<HTMLSpanElement>("title", { triggerStart: "100%" });
  const supRef = useAnim<HTMLElement>("fadeIn", { delay: 0.8, triggerStart: "100%" });
  const ruleRef = useAnim<HTMLDivElement>("line", { axis: "x", delay: 0.4 });
  const filtersRef = useAnim<HTMLUListElement>("fadeUp", { delay: 0.5, stagger: 0.05, target: "li" });

  const filtered =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  // Fade the grid when the filter changes.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;
    const tween = gsap.fromTo(
      grid,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [filter]);

  // Differential parallax drift on the flagged cards (lg only), ported from
  // the original js-project-parallax behaviour.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const build = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>(
        grid.querySelectorAll("[data-project-parallax]"),
      );
      if (!cards.length) return;
      const MAX = 22;
      const MID = MAX / 2;
      const from = cards.map((_, i) =>
        i % 2 === 1 ? gsap.utils.random(0, MID) : gsap.utils.random(MID, MAX),
      );
      const to = from.map((v, i) => {
        const delta = gsap.utils.random(8, 12);
        return i % 2 === 1 ? Math.min(v + delta, MAX) : Math.max(v - delta, 0);
      });
      ctx = gsap.context(() => {
        gsap.set(cards, { y: (i: number) => `${from[i]}vh` });
        gsap.to(cards, {
          y: (i: number) => `${to[i]}vh`,
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
  }, [filter]);

  return (
    <div className="projects-page">
      <style>{pageTitleCss}</style>
      <section className="px-15 my-grid pt-148 pb-100 lg:pt-312 lg:pb-200">
        <h1 className="col-span-full page-title text-blue relative justify-self-start">
          <span ref={titleRef}>Recent Offers</span>
          <sup
            ref={supRef}
            className="text-blue fs-20 absolute left-full top-0 ml-20 leading-none"
          >
            ({filtered.length})
          </sup>
        </h1>
        <div
          ref={ruleRef}
          aria-hidden="true"
          className="col-span-full h-1px border-t-1px b-blue pointer-events-none w-full translate-y-[0.5px] mt-10 mb-30 lg:mt-40"
        />

        <div className="col-span-full lg:col-span-2">
          <ul ref={filtersRef} className="lg:sticky lg:top-100">
            {FILTERS.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`text-blue fs-24 leading-[1.5] text-left cursor-pointer lg:leading-[1.3] ${
                    filter === f
                      ? "opacity-50"
                      : "transition-opacity duration-300 hover:opacity-50"
                  }`}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={gridRef}
          className="col-span-full grid grid-cols-4 my-gap mt-50 gap-y-74 lg:col-span-10 lg:mt-0 lg:gap-y-100"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.href} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
