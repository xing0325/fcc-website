"use client";

import { useAnim } from "@/lib/anim";
import SlideButton from "@/components/SlideButton";
import { TopRightArrowIcon } from "@/components/icons";

/**
 * Careers slice — giant centered "Careers" wordmark, the open-position
 * rows (title + location left, big blue APPLY panel right on desktop,
 * bordered Apply pill on mobile) and the View All CTA.
 */

type Job = {
  titleZh: string;
  titleEn: string;
  location: string;
  href: string;
};

const JOBS: Job[] = [
  {
    titleZh: "兼职行业导师",
    titleEn: "Industry Mentor — Consulting / Banking",
    location: "Part-Time, Remote",
    href: "mailto:hello@fccccc.org?subject=应聘:兼职行业导师(Consulting/Banking)",
  },
  {
    titleZh: "兼职行业导师",
    titleEn: "Industry Mentor — Internet / AI",
    location: "Part-Time, Remote",
    href: "mailto:hello@fccccc.org?subject=应聘:兼职行业导师(Internet/AI)",
  },
  {
    titleZh: "全职求职顾问",
    titleEn: "Career Consultant",
    location: "Full-Time, 成都 / 新加坡",
    href: "mailto:hello@fccccc.org?subject=应聘:全职求职顾问",
  },
  {
    titleZh: "内容运营 / 品牌",
    titleEn: "Content & Brand",
    location: "Full-Time, 成都",
    href: "mailto:hello@fccccc.org?subject=应聘:内容运营/品牌",
  },
];

const MONO =
  "text-blue font-gta-mono font-normal uppercase leading-none tracking-[0] fs-12";

function JobRow({ job, isFirst, isLast }: { job: Job; isFirst: boolean; isLast: boolean }) {
  const titleRef = useAnim<HTMLHeadingElement>("lineUp");

  return (
    <div className="relative col-span-full grid grid-cols-subgrid border-t b-blue last:border-b lg:border-none group">
      <div
        className={`col-span-full grid grid-cols-subgrid items-center py-36 lg:relative lg:min-h-[190px] lg:py-35 ${
          isFirst ? "lg:col-span-6" : "lg:col-span-full"
        }`}
      >
        {/* desktop hairlines */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 b-blue pointer-events-none h-1px border-t-1px w-full hidden lg:block"
        />
        {isLast && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 b-blue pointer-events-none h-1px border-t-1px w-full hidden lg:block"
          />
        )}
        <h3
          ref={titleRef}
          className={`col-span-full min-w-0 text-blue font-pp-neue font-normal tracking-[0] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] lg:group-hover:translate-x-10 lg:group-focus-within:translate-x-10 ${
            isFirst ? "lg:col-span-4" : "lg:col-span-7"
          }`}
        >
          <span className="block fs-22 leading-none lg:fs-30">{job.titleZh}</span>
          <span className="mt-10 block fs-16 leading-[1.15] opacity-60 lg:fs-18">
            {job.titleEn}
          </span>
        </h3>
        <div
          className={`${MONO} col-span-full mt-24 flex items-center justify-between transition-opacity duration-300 lg:col-span-2 lg:mt-0 lg:block lg:group-hover:opacity-60 lg:group-focus-within:opacity-60 ${
            isFirst ? "lg:col-start-5" : "lg:col-start-8"
          }`}
        >
          <span className="block leading-[1.25]">{job.location}</span>
          <a
            href={job.href}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-44 items-center justify-center px-34 b-1px b-blue lg:hidden"
          >
            <span className={MONO}>Apply</span>
          </a>
        </div>
      </div>

      {/* big APPLY panel (desktop) — parked next to the first row like the original */}
      {isFirst && (
        <div
          aria-hidden="true"
          className="hidden lg:flex lg:relative lg:pointer-events-none lg:col-span-6 lg:bg-blue lg:text-mercury lg:font-pp-neue lg:font-normal lg:fs-30 lg:tracking-[0.05em] lg:uppercase lg:items-center lg:justify-center lg:overflow-hidden"
        >
          Apply
          <div className="absolute top-0 right-0 bg-mercury w-90 h-90 b-1px b-blue flex-center origin-top-right scale-0 transition-transform duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100">
            <TopRightArrowIcon
              aria-hidden="true"
              className="icon text-blue w-37 h-37 scale-0 origin-center transition-transform delay-[0.1s] duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100"
            />
          </div>
        </div>
      )}

      {/* full-row link (desktop) */}
      <a
        href={job.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`应聘 ${job.titleZh}，${job.titleEn}`}
        className="hidden lg:block lg:absolute lg:inset-0 lg:z-10 focus:outline-none"
      />
    </div>
  );
}

export default function CareersSection() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const labelRef = useAnim<HTMLDivElement>("typeChars", { target: ".js-label" });

  return (
    <section className="px-15 my-grid mt-100 lg:mt-150">
      <h2
        ref={titleRef}
        className="text-heading fs-100 col-span-full justify-self-center lg:text-[18.75rem]"
      >
        Careers
      </h2>

      <div ref={labelRef} className={`${MONO} col-span-full mt-100 mb-20 lg:mt-80`}>
        <span className="js-label">Open Positions 开放角色</span>
      </div>

      {JOBS.map((job, i) => (
        <JobRow key={job.href} job={job} isFirst={i === 0} isLast={i === JOBS.length - 1} />
      ))}

      <div className="col-span-full mt-80 justify-self-center">
        <SlideButton
          label="投递简历 hello@fccccc.org"
          href="mailto:hello@fccccc.org"
        />
      </div>
    </section>
  );
}
