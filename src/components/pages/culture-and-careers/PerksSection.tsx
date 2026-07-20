"use client";

import { useAnim } from "@/lib/anim";
import DitheredImage from "@/components/DitheredImage";

/**
 * Perks slice — giant centered "Perks" wordmark over a bordered ledger:
 * dithered photo bottom-left, three mono-labelled benefit rows right.
 */

type Perk = { label: string; copy: string };

const PERKS: Perk[] = [
  {
    label: "Remote Collaboration 远程协作",
    copy:
      "成都、新加坡双办公室加全远程协作体系,大部分角色不受城市限制。异步文档 + 定期线上例会,让你在最有状态的时间做最有价值的事。",
  },
  {
    label: "Mentor Network 行业一线导师网络",
    copy:
      "与 BCG 全球合伙人、腾讯云前副总裁、顶尖投行 VP 等行业一线导师并肩工作,Consulting、Banking、Internet、AI 四大赛道的一手行业情报触手可及。",
  },
  {
    label: "Flexible Part-time 灵活兼职",
    copy:
      "行业导师按项目制灵活排期,每周数小时即可参与,不影响本职工作。用你的行业经验换取有竞争力的课时回报。",
  },
  {
    label: "Real Impact 见证学员成长",
    copy:
      "从背景诊断到最终 Offer,你会完整见证一位学员从迷茫到拿下 Accenture、Bain、PwC 的全过程——这份成就感,是别处给不了的。",
  },
];

function PerkRow({ perk }: { perk: Perk }) {
  const copyRef = useAnim<HTMLDivElement>("lineUp");
  return (
    <div className="col-span-full lg:border-b b-blue lg:last:border-b-0 lg:pt-20 lg:pb-80 lg:flex">
      <h3 className="text-blue font-gta-mono font-normal uppercase leading-none tracking-[0] fs-12 lg:w-[24.72vw]">
        {perk.label}
      </h3>
      <div
        ref={copyRef}
        className="font-pp-neue font-normal text-blue fs-16 leading-[1.2] tracking-[0] mt-24 lg:fs-14 lg:mt-0 lg:w-[23.61vw]"
        role="text"
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
        className="text-heading fs-100 col-span-full justify-self-center lg:text-[18.75rem]"
      >
        Perks
      </h2>

      <div className="col-span-full grid grid-cols-subgrid mt-50 lg:border-t lg:border-b b-blue">
        <div className="col-span-full lg:col-span-5 lg:border-r b-blue lg:flex lg:items-end lg:pb-20">
          <div className="relative overflow-hidden w-full aspect-[5/4] lg:w-[23.61vw]">
            <DitheredImage
              src="/images/fcc-6.jpg"
              alt="FCC 团队成员在协作讨论"
            />
          </div>
        </div>

        <div className="col-span-full mt-50 space-y-74 lg:mt-0 lg:col-start-6 lg:col-end-[-1] lg:space-y-0">
          {PERKS.map((perk) => (
            <PerkRow key={perk.label} perk={perk} />
          ))}
        </div>
      </div>
    </section>
  );
}
