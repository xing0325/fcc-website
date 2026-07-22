"use client";

import { useAnim } from "@/lib/anim";
import ArchiveImage from "@/components/ArchiveImage";

/**
 * Perks slice — giant centered "Perks" wordmark over a bordered ledger:
 * dithered photo bottom-left, four compact bilingual benefit rows right.
 */

type Perk = {
  labelZh: string;
  labelEn: string;
  copy: string;
};

const PERKS: Perk[] = [
  {
    labelZh: "远程协作",
    labelEn: "Remote collaboration",
    copy: "成都、新加坡与远程岗位协同，让你按最合适的节奏完成高价值工作。",
  },
  {
    labelZh: "一线导师网络",
    labelEn: "Mentor network",
    copy: "与来自咨询、金融、互联网和 AI 的一线导师协作，直接接触真实行业经验。",
  },
  {
    labelZh: "灵活兼职",
    labelEn: "Flexible part-time",
    copy: "导师可按项目灵活排期，用每周数小时分享经验并获得有竞争力的回报。",
  },
  {
    labelZh: "见证学员成长",
    labelEn: "Real impact",
    copy: "从背景诊断到最终 Offer，全程见证学员把职业目标变成结果。",
  },
];

function PerkRow({ perk }: { perk: Perk }) {
  const copyRef = useAnim<HTMLDivElement>("lineUp");
  return (
    <div className="col-span-full border-t b-blue px-0 py-40 lg:first:border-t-0 lg:grid lg:grid-cols-subgrid lg:h-125 lg:py-20">
      <h3 className="text-blue font-normal tracking-[0] lg:col-span-3">
        <span className="block font-pp-neue fs-22 leading-none lg:fs-20">
          {perk.labelZh}
        </span>
        <span className="block mt-12 font-gta-mono fs-12 leading-none uppercase">
          {perk.labelEn}
        </span>
      </h3>
      <div
        ref={copyRef}
        className="mt-24 font-pp-neue font-normal text-blue fs-16 leading-[1.3] tracking-[0] lg:col-start-4 lg:col-span-3 lg:mt-0 lg:fs-14 lg:leading-[1.3]"
      >
        <p>{perk.copy}</p>
      </div>
    </div>
  );
}

export default function PerksSection() {
  const titleRef = useAnim<HTMLHeadingElement>("title");

  return (
    <section className="px-15 my-grid mt-100 lg:mt-150">
      <h2
        ref={titleRef}
        className="text-heading fs-100 leading-none col-span-full justify-self-center lg:text-[18.75rem]"
      >
        Perks
      </h2>

      <div className="col-span-full grid grid-cols-subgrid mt-50 border-t border-b b-blue">
        <div className="col-span-full pb-24 lg:col-span-5 lg:border-r b-blue lg:flex lg:items-end lg:pb-20">
          <div className="relative overflow-hidden w-full aspect-[5/4] lg:w-[23.61vw]">
            <ArchiveImage
              src="/images/fcc-6.jpg"
              alt="FCC 团队成员在协作讨论"
              variant="plain"
              objectPosition="50% 40%"
            />
          </div>
        </div>

        <div className="col-span-full grid grid-cols-subgrid lg:col-start-6 lg:col-end-[-1]">
          {PERKS.map((perk) => (
            <PerkRow key={perk.labelEn} perk={perk} />
          ))}
        </div>
      </div>
    </section>
  );
}
