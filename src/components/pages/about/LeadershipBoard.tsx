"use client";

import { useAnim } from "@/lib/anim";
import { TopRightArrowIcon } from "@/components/icons";

/**
 * Our Mentors slice — white full-bleed panel, oversized title and a
 * 2-up (mobile) / 4-up (lg) grid of typographic mentor cards (anonymized,
 * no photos). Hovering a card grows the white ↗ button from the
 * bottom-right corner, like the original.
 */

type Mentor = {
  tag: string;
  track: string;
  role: string;
  years: string;
  focus: string;
};

const MENTORS: Mentor[] = [
  {
    tag: "Consulting",
    track: "咨询",
    role: "咨询赛道导师",
    years: "10 年战略咨询经验",
    focus: "主带:Case 面试、结构化表达",
  },
  {
    tag: "Internet",
    track: "互联网",
    role: "互联网赛道导师",
    years: "9 年大厂产品经验",
    focus: "主带:产品面试、项目叙事",
  },
  {
    tag: "Banking",
    track: "投行",
    role: "投行赛道导师",
    years: "8 年 IBD 经验",
    focus: "主带:技术面、估值与三张报表",
  },
  {
    tag: "AI Product",
    track: "AI",
    role: "AI 赛道导师",
    years: "7 年 AI 产品经验",
    focus: "主带:AI PM 面试、作品集",
  },
];

export default function LeadershipBoard() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const cardsRef = useAnim<HTMLDivElement>("fadeUp", {
    target: ".js-member-card",
    stagger: 0.06,
  });
  const noteRef = useAnim<HTMLParagraphElement>("fadeUp", { delay: 0.15 });

  return (
    <section id="mentors" className="px-15 relative my-grid pt-50 pb-100 lg:pt-104 lg:pb-156">
      <div aria-hidden="true" className="bg-white absolute inset-0 -z-2" />

      <span className="col-span-full text-blue font-gta-mono fs-12 leading-none uppercase opacity-60 hidden lg:block">
        Our Mentors
      </span>
      <h2
        ref={titleRef}
        className="text-heading col-span-full text-blue -ml-5 fs-72 leading-[0.9375] lg:col-start-1 lg:col-span-7 lg:fs-160 lg:mt-14"
      >
        导师团队
      </h2>

      <div
        ref={cardsRef}
        className="col-span-full grid grid-cols-subgrid mt-50 gap-y-50"
      >
        {MENTORS.map((mentor) => (
          <div key={mentor.tag} className="js-member-card col-span-3 group">
            <div>
              <div className="relative overflow-hidden aspect-square border b-blue text-blue flex flex-col justify-between p-16 lg:p-20">
                <span className="font-gta-mono fs-10 leading-none uppercase lg:fs-12">
                  {mentor.tag}
                </span>
                <span className="font-pp-neue font-normal fs-46 leading-[0.95] lg:fs-72">
                  {mentor.track}
                </span>
                <span className="font-gta-mono fs-10 leading-none uppercase opacity-60 lg:fs-12">
                  {mentor.years}
                </span>
                <div className="bg-white border-[0.5px] b-blue absolute bottom-0 right-0 flex-center w-60 h-60 origin-bottom-right scale-0 will-change-transform transition-transform duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100">
                  <TopRightArrowIcon
                    aria-hidden="true"
                    className="icon w-[53%] h-[53%] text-blue scale-0 origin-center transition-transform delay-[0.1s] duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100"
                  />
                </div>
              </div>
              <div className="mt-12 page-text text-blue">
                {mentor.role} · {mentor.years}
              </div>
              <div className="text-mono fs-12 leading-[1.5] mt-2 lg:mt-6">
                <p>{mentor.focus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p
        ref={noteRef}
        className="col-span-full mt-50 text-blue font-gta-mono fs-12 leading-[1.5] opacity-60"
      >
        导师均为在职从业者,入驻前经资历核验;应合规要求统一脱敏展示。
      </p>
    </section>
  );
}
