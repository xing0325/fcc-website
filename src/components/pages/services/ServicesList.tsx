"use client";

import { useRef } from "react";
import ArchiveImage from "@/components/ArchiveImage";
import { useAnim } from "@/lib/anim";

/**
 * Services list — original services_list slice:
 * 1. "A Full / Journey of / Coaching" staggered showcase with the tall
 *    archive-graded brand photo, mono side notes and vertical rules.
 * 2. Numbered service rows. On lg a full-bleed blue bar slides behind the
 *    hovered row (approximating the original's GSAP Flip js-bg), the row's
 *    ArchiveImage thumbnail restores from its cool grade to full colour,
 *    the description flips to mercury and a "Read More" button fades in.
 *
 * Stacking note: the hover bar sits at -z-2 so it slides behind the row
 * content (the ArchiveImage thumbnails paint above it in normal flow).
 */

const SERVICES = [
  {
    number: "1",
    titleLines: ["背景诊断", "Background Assessment"],
    description:
      "科学测评学员背景与职业兴趣，定制个性化求职方案。入学两周内完成 1v1 深度访谈与能力测评，输出 20+ 页背景诊断报告与目标行业匹配矩阵，并由核心顾问制定季度行动路线图。",
    href: "/contact",
    image: "/images/fcc-2.jpg",
    imageAlt: "FCC 顾问为学员进行背景诊断访谈",
  },
  {
    number: "2",
    titleLines: ["顾问匹配", "Consultant Matching"],
    description:
      "精准匹配行业专家导师，优化申请材料与人脉网络。基于诊断结果在 MBB、腾讯、高盛等背景的导师库中双向匹配，一周内敲定核心顾问加行业专家的双导师配置，简历与 LinkedIn 档案同步打磨。",
    href: "/contact",
    image: "/images/fcc-3.jpg",
    imageAlt: "FCC 行业导师与学员一对一交流",
  },
  {
    number: "3",
    titleLines: ["导师指导", "Mentorship Program"],
    description:
      "资深导师一对一/小班教学，系统搭建行业知识体系。每周固定 1v1 辅导配合双周小班案例课，覆盖咨询、互联网、投行与 AI 产品四大赛道，跨行业转型学员另配转型专项模块。",
    href: "/contact",
    image: "/images/fcc-6.jpg",
    imageAlt: "FCC 导师带领学员进行行业知识小班教学",
  },
  {
    number: "4",
    titleLines: ["实战模拟", "Simulation Training"],
    description:
      "多轮 Mock 面试高强度演练，行为/技术/案例逐项拆解。冲刺期每周 2-3 轮全真模拟，由目标公司背景导师执面并出具逐题反馈报告，直至各项评分稳定达到 Offer 水位。",
    href: "/contact",
    image: "/images/fcc-8.jpg",
    imageAlt: "FCC 模拟面试实战演练现场",
  },
  {
    number: "5",
    titleLines: ["职场分析", "Career Analytics"],
    description:
      "Offer 评估策略与职业发展建议，覆盖内推与岗位规划。每月更新目标行业招聘情报与岗位清单，结合内推资源规划实习与全职申请节奏，并在多个 Offer 之间提供量化对比与选择建议。",
    href: "/contact",
    image: "/images/fcc-5.jpg",
    imageAlt: "FCC 顾问分析职业发展与岗位规划",
  },
  {
    number: "6",
    titleLines: ["最终申请", "Final Push"],
    description:
      "系统化支持全职申请，对接行业领军与校友网络。核心顾问全程跟进网申、笔试与终面日程，关键节点由合伙人级导师亲自复盘，拿到 Offer 后提供谈薪策略与入职过渡辅导。",
    href: "/contact",
    image: "/images/fcc-7.jpg",
    imageAlt: "FCC 导师陪伴学员完成最终申请与谈薪",
  },
];

const MONO_TEXT = "font-normal font-gta-mono uppercase tracking-[0] fs-12 leading-[1.33]";

function ReadMoreLink({ href, className = "" }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      className={`relative inline-block overflow-hidden text-center uppercase text-[11px] leading-none tracking-[0.02em] font-normal font-gta-mono text-blue group/btn ${className}`}
    >
      <span className="block p-21 bg-mercury transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/btn:-translate-y-full">
        Read More
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block p-21 bg-blue text-mercury origin-bottom translate-y-full scale-x-50 transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/btn:translate-y-0 group-hover/btn:scale-x-100"
      >
        Read More
      </span>
    </a>
  );
}

function MonoParagraph({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useAnim<HTMLDivElement>("lineUp", { delay });
  return (
    <div ref={ref} className={`text-blue ${MONO_TEXT} ${className}`}>
      <p>{text}</p>
    </div>
  );
}

function StageKeywordList({ className = "" }: { className?: string }) {
  const ref = useAnim<HTMLDivElement>("lineUp");
  return (
    <div ref={ref} className={`text-blue ${MONO_TEXT} ${className}`}>
      <p>
        Assess
        <br />
        Match
        <br />
        Train
        <br />
        Offer
      </p>
    </div>
  );
}

function ServiceRow({
  service,
  onEnter,
}: {
  service: (typeof SERVICES)[number];
  onEnter: (li: HTMLLIElement) => void;
}) {
  const numberRef = useAnim<HTMLSpanElement>("fadeIn");
  const titleRef = useAnim<HTMLHeadingElement>("lineUp");
  const descRef = useAnim<HTMLDivElement>("lineUp", { delay: 0.1 });

  return (
    <li
      className="service group col-span-full grid grid-cols-subgrid text-heading fs-30 pt-20 pb-34 border-t-1px b-blue transition-colors duration-300 lg:pt-15 lg:pb-82"
      onMouseEnter={(e) => onEnter(e.currentTarget)}
    >
      <span
        ref={numberRef}
        className="col-start-[-2] col-end-[-1] row-start-1 justify-self-end lg:col-start-1 lg:col-end-2 lg:justify-self-start"
      >
        {service.number}
      </span>

      {/* archive thumb: cool-graded at rest, colour restores on row hover (lg only) */}
      <div className="relative overflow-hidden hidden lg:block lg:col-start-2 lg:col-span-2 lg:row-span-2 lg:aspect-[222/158]">
        <ArchiveImage
          src={service.image}
          alt={service.imageAlt}
          variant="archive"
        />
      </div>

      <div className="col-start-1 col-end-[-2] row-start-1 flex flex-col items-start lg:col-start-5 lg:col-end-9">
        <h3 ref={titleRef}>
          <span>{service.titleLines[0]}</span>
          <br />
          <span>{service.titleLines[1]}</span>
        </h3>
        <ReadMoreLink
          href={service.href}
          className="hidden justify-self-start mt-44 lg:block lg:opacity-0 lg:transition-opacity lg:duration-200 lg:ease-in-out lg:group-hover:opacity-100"
        />
      </div>

      <div
        ref={descRef}
        className={`col-start-1 col-span-5 text-blue ${MONO_TEXT} mt-30 transition-colors duration-500 lg:col-start-9 lg:col-end-[-2] lg:mt-0 lg:group-hover:text-mercury`}
      >
        <p>{service.description}</p>
      </div>

      <div className="col-span-full mt-16 lg:hidden">
        <ReadMoreLink href={service.href} className="b-1px b-mercury" />
      </div>
    </li>
  );
}

export default function ServicesList() {
  const bgRef = useRef<HTMLLIElement>(null);

  const titleMobileRef = useAnim<HTMLDivElement>("title");
  const titleARef = useAnim<HTMLDivElement>("title");
  const titleVersatileRef = useAnim<HTMLDivElement>("title", { delay: 0.1 });
  const titleRangeRef = useAnim<HTMLDivElement>("title");
  const titleServicesRef = useAnim<HTMLDivElement>("title");

  const hoverBar = (li: HTMLLIElement | null) => {
    const bg = bgRef.current;
    if (!bg) return;
    if (!li || !window.matchMedia("(min-width: 1024px)").matches) {
      bg.style.opacity = "0";
      return;
    }
    bg.style.top = `${li.offsetTop}px`;
    bg.style.height = `${li.offsetHeight}px`;
    bg.style.opacity = "1";
  };

  return (
    <section className="px-15 pt-25 lg:pt-110">
      {/* row hover: the whole row's text flips to mercury (original adds
          text-mercury to the li); needs to out-rank .text-heading's blue */}
      <style>{`
        @media (min-width: 1024px) {
          li.service:hover { color: var(--color-mercury); }
        }
      `}</style>
      {/* ---- A Full Journey of Coaching ---- */}
      <div className="relative my-grid pb-48 border-b-1px b-blue lg:border-none lg:pb-0">
        <div className="col-span-full border-t-1px b-blue pt-20 lg:absolute lg:w-full">
          <div
            className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase"
            aria-hidden="true"
          >
            <div>
              <span>Our Services</span>
            </div>
            <div>[FCC.2]</div>
          </div>
        </div>

        <h2 className="sr-only">A full journey of coaching</h2>
        <div
          ref={titleMobileRef}
          aria-hidden="true"
          className="col-span-full my-title mt-50 lg:hidden"
        >
          A full journey of coaching
        </div>
        <div
          ref={titleARef}
          aria-hidden="true"
          className="hidden my-title col-start-2 col-span-3 row-start-2 lg:block"
        >
          A
        </div>
        <div
          ref={titleVersatileRef}
          aria-hidden="true"
          className="hidden my-title col-start-5 col-end-[-1] row-start-2 lg:block lg:ml-[3.19vw]"
        >
          Full
        </div>

        <div className="col-span-full mt-44 lg:col-start-5 lg:col-end-[-1] lg:row-start-1 lg:border-l b-blue lg:mt-0 lg:pt-85 lg:pb-82 lg:mb-38">
          <MonoParagraph
            text="对留学生和转行者而言，信息差、流程复杂与缺少反馈，常让求职变成一场孤军奋战。"
            className="lg:w-340 lg:ml-[3.22vw]"
          />
        </div>

        <div className="col-span-full relative overflow-hidden aspect-[380/500] mt-22 lg:hidden">
          <ArchiveImage
            src="/images/fcc-9.jpg"
            alt="FCC 导师与学员在办公室进行一对一辅导"
            variant="archive"
          />
        </div>

        <div className="col-span-full mt-24 lg:col-start-5 lg:col-end-[-1] lg:row-start-3 lg:border-l b-blue lg:pt-110 lg:pb-64 lg:mt-38">
          <MonoParagraph
            text="从背景诊断到最终谈薪，FCC 全程陪伴——把每一步拆解成可执行、可复盘的行动清单。"
            className="lg:w-340 lg:ml-[32.98vw]"
          />
        </div>

        <StageKeywordList className="col-start-4 col-span-3 mt-50 lg:hidden" />

        <div className="hidden lg:grid grid-cols-subgrid lg:col-span-full lg:border-t lg:border-b b-blue">
          <div className="relative col-start-3 col-end-[-1] grid grid-cols-subgrid border-l-1px b-blue">
            <div className="relative overflow-hidden col-start-2 col-span-6 aspect-[698/738] mt-100 mb-115">
              <ArchiveImage
                src="/images/fcc-9.jpg"
                alt="FCC 导师与学员在办公室进行一对一辅导"
                variant="archive"
              />
            </div>
            <StageKeywordList className="col-span-2 self-center -translate-y-50" />
            <div
              ref={titleRangeRef}
              aria-hidden="true"
              className="my-title mt-184 absolute -ml-[9.03vw] z-[1]"
            >
              <div className="absolute inset-0 bg-mercury -z-1 w-[9.15vw] scale-y-[1.4]" />
              Journey of
            </div>
            <div
              ref={titleServicesRef}
              aria-hidden="true"
              className="my-title absolute bottom-0 mb-184 right-[6.25vw]"
            >
              Coaching
            </div>
          </div>
        </div>
      </div>

      {/* ---- numbered service rows ---- */}
      <ul
        className="my-grid relative border-t-1px b-blue pb-100 lg:border-none"
        onMouseLeave={() => hoverBar(null)}
      >
        <li
          ref={bgRef}
          aria-hidden="true"
          className="hidden lg:block absolute -inset-x-15 -z-2 bg-blue opacity-0 pointer-events-none"
          style={{
            transition:
              "top 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
          }}
        />
        {SERVICES.map((service) => (
          <ServiceRow key={service.number} service={service} onEnter={hoverBar} />
        ))}
      </ul>
    </section>
  );
}
