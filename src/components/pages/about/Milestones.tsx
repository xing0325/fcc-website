"use client";

import { useAnim } from "@/lib/anim";
import ArchiveImage from "@/components/ArchiveImage";

/**
 * Milestones slice — six year cards staggered across three rule-lined
 * columns on desktop (grid placement lifted from the original's
 * --col / --row / --margin-top custom properties), stacked with dividers
 * on mobile.
 */

type Milestone = {
  year: string;
  caption: [string, string];
  image: string;
  /** descriptive Chinese alt for the photo */
  alt: string;
  aspect: string;
  /** lg grid placement + stagger offset */
  lgClasses: string;
  /** right-aligned card on mobile */
  alignEnd?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    year: "2021",
    caption: ["FCC 成都创立", "Founded in Chengdu"],
    image: "/images/fcc-3.jpg",
    alt: "2021 年 FCC 在成都创立时的创始团队合影",
    aspect: "aspect-[3/2]",
    lgClasses: "lg:col-start-1 lg:row-start-1 lg:mt-44",
  },
  {
    year: "2022",
    caption: ["导师网络扩张", "100+ Mentors"],
    image: "/images/fcc-5.jpg",
    alt: "FCC 导师团队交流研讨、扩张导师网络的场景",
    aspect: "aspect-[1600/1066]",
    lgClasses: "lg:col-start-9 lg:row-start-1 lg:mt-144",
    alignEnd: true,
  },
  {
    year: "2023",
    caption: ["新加坡办公室成立", "Singapore Office"],
    image: "/images/fcc-7.jpg",
    alt: "FCC 新加坡办公室的工作环境",
    aspect: "aspect-[645/834]",
    lgClasses: "lg:col-start-5 lg:row-start-1 lg:mt-312",
  },
  {
    year: "2024",
    caption: ["学员社群破千", "1,000+ Members"],
    image: "/images/fcc-9.jpg",
    alt: "FCC 学员社群成员聚会互动的现场",
    aspect: "aspect-[683/480]",
    lgClasses: "lg:col-start-9 lg:row-start-2 lg:mt-0",
    alignEnd: true,
  },
  {
    year: "2025",
    caption: ["500+ Offer 里程碑", "官网 fccccc.org 上线"],
    image: "/images/fcc-10.jpg",
    alt: "FCC 学员收获 500+ Offer 的庆祝时刻",
    aspect: "aspect-[2880/2202]",
    lgClasses: "lg:col-start-1 lg:row-start-2 lg:mt-160",
  },
  {
    year: "2026",
    caption: ["陪伴新世代", "Own Our Career Future"],
    image: "/images/fcc-2.jpg",
    alt: "FCC 团队与新世代学员并肩同行的画面",
    aspect: "aspect-[3/2]",
    lgClasses: "lg:col-start-5 lg:row-start-2 lg:mt-340",
    alignEnd: true,
  },
];

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const revealRef = useAnim<HTMLDivElement>("fadeUp", { delay: (index % 3) * 0.1 });
  return (
    <div
      className={`col-span-full mt-50 first:mt-20 pb-50 border-b b-blue last:border-b-0 lg:block lg:col-span-4 lg:ml-44 lg:border-b-0 lg:pb-0 lg:last:mb-130 ${
        milestone.alignEnd ? "flex flex-col items-end" : ""
      } ${milestone.lgClasses}`}
    >
      <div className="w-[60.95vw] lg:w-[20.83vw]">
        <div className={`relative overflow-hidden ${milestone.aspect}`}>
          <ArchiveImage src={milestone.image} alt={milestone.alt} variant="archive" />
        </div>
        <div className="relative">
          {/* mercury backdrop masking the column rule behind the type */}
          <div
            aria-hidden="true"
            className="bg-mercury absolute inset-0 -z-1 origin-right scale-x-[1.2]"
          />
          <div ref={revealRef}>
            <div className="text-heading mt-8 fs-100 lg:text-[8.125rem]">{milestone.year}</div>
            <div className="text-mono mt-8 fs-20">
              <p>
                {milestone.caption[0]}
                <br />
                {milestone.caption[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Milestones() {
  const labelRef = useAnim<HTMLDivElement>("typeChars", { target: ".js-label" });
  const linesRef = useAnim<HTMLDivElement>("line", {
    target: ".js-line",
    stagger: 0.15,
    duration: 1.2,
  });

  return (
    <section className="px-15">
      {/* label row */}
      <div
        ref={labelRef}
        className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase border-t-1px b-blue pt-20"
      >
        <div>
          <span className="js-label">Milestones</span>
        </div>
        <div aria-hidden="true">[FCC.2]</div>
      </div>

      <div className="my-grid relative lg:content-start lg:items-start lg:mt-30">
        {/* three column rules behind the cards */}
        <div
          ref={linesRef}
          aria-hidden="true"
          className="hidden my-gap lg:absolute lg:inset-0 lg:grid lg:grid-cols-3"
        >
          <div className="js-line border-l-1px b-blue -z-1" />
          <div className="js-line border-l-1px b-blue -z-1" />
          <div className="js-line border-l-1px b-blue -z-1" />
        </div>

        {MILESTONES.map((milestone, i) => (
          <MilestoneCard key={milestone.year} milestone={milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
