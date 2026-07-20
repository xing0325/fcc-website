"use client";

import { useAnim } from "@/lib/anim";
import DitheredImage from "@/components/DitheredImage";
import { TopRightArrowIcon } from "@/components/icons";

/**
 * Our Mentors slice — white full-bleed panel, oversized title and a
 * 2-up (mobile) / 4-up (lg) grid of dithered headshots. Hovering a card
 * grows the white ↗ button from the bottom-right corner, like the original.
 */

type Member = { name: string; role: string; image: string };

const MEMBERS: Member[] = [
  { name: "徐天石", role: "波士顿咨询公司全球合伙人兼董事 · Consulting Partner", image: "/images/fcc-1.jpg" },
  { name: "林晓斌", role: "腾讯云前任副总裁 · Internet Product Partner", image: "/images/fcc-4.jpg" },
  { name: "K 导师", role: "顶尖投行 VP · 投行求职全程规划", image: "/images/fcc-8.jpg" },
  { name: "Q 导师", role: "清华系 AI 公司 VP · AI 产品求职实战", image: "/images/fcc-6.jpg" },
];

export default function LeadershipBoard() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const cardsRef = useAnim<HTMLDivElement>("fadeUp", {
    target: ".js-member-card",
    stagger: 0.06,
  });

  return (
    <section id="mentors" className="px-15 relative my-grid pt-50 pb-100 lg:pt-104 lg:pb-156">
      <div aria-hidden="true" className="bg-white absolute inset-0 -z-2" />

      <h2
        ref={titleRef}
        className="text-heading col-span-full text-blue -ml-5 fs-72 leading-[0.9375] lg:col-start-1 lg:col-span-7 lg:fs-160"
      >
        Our Mentors
      </h2>

      <div
        ref={cardsRef}
        className="col-span-full grid grid-cols-subgrid mt-50 gap-y-50"
      >
        {MEMBERS.map((member) => (
          <div key={member.name} className="js-member-card col-span-3 group">
            <div>
              <button
                type="button"
                className="relative overflow-hidden w-full cursor-pointer"
                aria-label={`Show modal info for ${member.name}`}
              >
                <div className="relative overflow-hidden aspect-square">
                  <DitheredImage src={member.image} alt={member.name} />
                  <div className="bg-white border-[0.5px] b-blue absolute bottom-0 right-0 flex-center w-60 h-60 origin-bottom-right scale-0 will-change-transform transition-transform duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100">
                    <TopRightArrowIcon
                      aria-hidden="true"
                      className="icon w-[53%] h-[53%] text-blue scale-0 origin-center transition-transform delay-[0.1s] duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100"
                    />
                  </div>
                </div>
              </button>
              <div className="mt-12 page-text text-blue">{member.name}</div>
              <div className="text-mono fs-12 leading-[1.5] mt-2 lg:mt-6">
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
