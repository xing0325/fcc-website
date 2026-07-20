"use client";

import { useAnim } from "@/lib/anim";

/**
 * "Our Vision / 我们的理念" slice — mono label row (MISSION STATEMENT / [FCC.1]),
 * the mission paragraph hanging off a left rule at column 5, the oversized
 * split heading (Our / Vision) and the vision paragraph below it.
 */
export default function OurVision() {
  const labelRef = useAnim<HTMLDivElement>("typeChars", { target: ".js-label" });
  const headingMobileRef = useAnim<HTMLDivElement>("title");
  const headingOurRef = useAnim<HTMLSpanElement>("title");
  const headingVisionRef = useAnim<HTMLSpanElement>("title", { delay: 0.1 });
  const missionRef = useAnim<HTMLDivElement>("lineUp");
  const visionRef = useAnim<HTMLDivElement>("lineUp");

  return (
    <section className="px-15 pt-45 lg:pt-0">
      <div className="my-grid relative lg:content-start">
        {/* label row */}
        <div
          ref={labelRef}
          className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full lg:w-full lg:pt-18 lg:border-t b-blue lg:absolute"
        >
          <div>
            <span className="js-label">Mission Statement</span>
          </div>
          <div aria-hidden="true">[FCC.1]</div>
        </div>

        <h2 className="sr-only">我们的理念 Our Vision</h2>

        {/* oversized heading (row 2 on lg, first in mobile flow) */}
        <div
          aria-hidden="true"
          className="col-span-full mt-50 text-heading fs-80 lg:row-start-2 lg:grid lg:grid-cols-subgrid lg:fs-160 lg:mt-45"
        >
          <div ref={headingMobileRef} className="lg:hidden" role="text">
            Our Vision
          </div>
          <span
            ref={headingOurRef}
            className="hidden lg:block lg:col-start-1 lg:col-span-4"
            role="text"
          >
            Our
          </span>
          <span
            ref={headingVisionRef}
            className="hidden lg:block lg:col-start-5 lg:col-span-8 lg:pl-46"
            role="text"
          >
            Vision
          </span>
        </div>

        {/* mission paragraph (row 1 on lg) */}
        <div
          ref={missionRef}
          className="col-span-full my-text mt-50 tracking-[-0.05em] lg:col-start-5 lg:col-span-3 lg:row-start-1 lg:mt-0 lg:pt-78 lg:pl-46 lg:pb-50 lg:fs-14 lg:border-l b-blue lg:normal-case"
          role="text"
        >
          <p>
            长期主义、信息透明、结果导向&mdash;&mdash;FCC
            以此为准则，用科学的测评方法与真实的行业信息，帮助新世代在关键节点做出属于自己的职业选择，成为最值得信赖的
            Boutique Career Agency。
          </p>
        </div>

        {/* vision paragraph (row 3 on lg) */}
        <div
          ref={visionRef}
          className="col-span-full pb-50 my-text mt-25 tracking-[-0.05em] lg:row-start-3 lg:col-start-5 lg:col-span-3 lg:pl-46 lg:pt-142 lg:pr-28 lg:fs-14 lg:border-l b-blue lg:normal-case"
          role="text"
        >
          <p>
            我们不做流水线式的求职中介。从第一次背景诊断到入职后的每一个关键时刻，FCC
            都与学员站在一起&mdash;&mdash;做穿越周期的长期职业伙伴，陪伴新世代共同拥有自己的职业未来。
          </p>
        </div>
      </div>
    </section>
  );
}
