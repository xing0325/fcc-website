"use client";

import { useAnim } from "@/lib/anim";
import DitheredImage from "@/components/DitheredImage";

/**
 * Culture slice — a giant "Culture" wordmark parked behind a staggered
 * collage of five dithered photos and two rule-anchored captions, closed
 * by the centered mission statement.
 */

function CaptionRule({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 b-blue pointer-events-none w-1 border-l-1px h-full hidden lg:block"
      />
      <div className="relative z-1">{children}</div>
    </div>
  );
}

export default function CultureSection() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const textARef = useAnim<HTMLDivElement>("lineUp");
  const textBRef = useAnim<HTMLDivElement>("lineUp");
  const statementRef = useAnim<HTMLDivElement>("lineUp");

  const textStyle =
    "text-blue font-pp-neue font-normal fs-18 leading-[1.2] tracking-[0] lg:fs-20 lg:leading-[1.15]";

  return (
    <section className="px-15 my-grid mt-100 lg:mt-90">
      <h2
        ref={titleRef}
        className="text-heading font-medium fs-100 leading-[1.5] col-span-full justify-self-center mb-48 relative -z-2 lg:mb-100 lg:text-[18.75rem] lg:absolute"
      >
        Culture
      </h2>

      <div className="grid grid-cols-subgrid col-span-full items-start lg:mt-260">
        {/* photo collage */}
        <div className="relative overflow-hidden col-span-full row-start-1 aspect-[4/3] lg:col-start-1 lg:col-end-6">
          <DitheredImage
            src="/images/fcc-2.jpg"
            alt="FCC 团队成员合影"
          />
        </div>
        <div className="relative overflow-hidden col-start-3 col-end-[-1] mt-20 row-start-2 aspect-[600/608] lg:mt-0 lg:row-start-1 lg:col-start-5 lg:col-end-8 lg:aspect-[320/220] lg:self-end lg:translate-y-[40%]">
          <DitheredImage
            src="/images/fcc-1.jpg"
            alt="FCC 办公室前台"
          />
        </div>
        <div className="relative overflow-hidden col-start-1 col-end-[-2] mt-72 aspect-[315/340] row-start-4 lg:col-start-[-4] lg:col-end-[-1] lg:row-start-1 lg:mt-0 lg:translate-y-[90%]">
          <DitheredImage
            src="/images/fcc-3.jpg"
            alt="导师与学员的一对一辅导现场"
          />
        </div>
        <div className="relative overflow-hidden col-start-3 col-end-[-1] mt-60 row-start-5 aspect-[3/2] lg:row-start-2 lg:col-start-[-6] lg:col-span-3 lg:mt-0 lg:translate-y-full lg:self-end">
          <DitheredImage
            src="/images/fcc-4.jpg"
            alt="FCC 团队活动合影"
          />
        </div>
        <div className="relative overflow-hidden col-span-full mt-60 aspect-[380/460] row-start-6 lg:row-start-3 lg:col-start-2 lg:col-span-5 lg:mt-0 lg:aspect-[578/700]">
          <DitheredImage
            src="/images/fcc-5.jpg"
            alt="FCC 顾问团队成员"
          />
        </div>

        {/* captions on hairline rules */}
        <div
          className={`relative col-start-1 col-end-[-2] row-start-3 mt-64 lg:col-start-3 lg:col-end-6 lg:row-start-2 lg:pt-74 lg:pb-100 lg:pl-10 lg:mt-[10.42vw] ${textStyle}`}
        >
          <CaptionRule>
            <div ref={textARef} className="space-y-28 lg:max-w-290 lg:space-y-24">
              <div>
                <h3 className="font-medium">
                  长期主义
                  <span
                    lang="en"
                    className="ml-8 inline-block fs-12 font-normal uppercase leading-none tracking-[0.04em] opacity-70"
                  >
                    Long-termism
                  </span>
                </h3>
                <p className="mt-10">
                  我们不追逐速成，陪学员练成真正带得走的能力。
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  信息透明
                  <span
                    lang="en"
                    className="ml-8 inline-block fs-12 font-normal uppercase leading-none tracking-[0.04em] opacity-70"
                  >
                    Transparency
                  </span>
                </h3>
                <p className="mt-10">
                  行业信息、流程进度和评估结论全程公开，不让信息差成为门槛。
                </p>
              </div>
            </div>
          </CaptionRule>
        </div>
        <div
          className={`col-start-1 col-end-[-2] row-start-7 mt-64 lg:relative lg:row-start-3 lg:col-start-[-6] lg:col-span-3 lg:self-end lg:mt-0 lg:pt-64 lg:pb-92 lg:pl-10 lg:mb-110 ${textStyle}`}
        >
          <CaptionRule>
            <div ref={textBRef} className="space-y-28 lg:space-y-24">
              <div>
                <h3 className="font-medium">
                  结果导向
                  <span
                    lang="en"
                    className="ml-8 inline-block fs-12 font-normal uppercase leading-none tracking-[0.04em] opacity-70"
                  >
                    Result-driven
                  </span>
                </h3>
                <p className="mt-10">
                  从背景诊断到最终 Offer，每个阶段都有可检验的交付。
                </p>
              </div>
              <div>
                <h3 className="font-medium">
                  陪伴式辅导
                  <span
                    lang="en"
                    className="ml-8 inline-block fs-12 font-normal uppercase leading-none tracking-[0.04em] opacity-70"
                  >
                    Companion Mentorship
                  </span>
                </h3>
                <p className="mt-10">
                  导师贯穿整段求职旅程，和学员一起面对每一次选择。
                </p>
              </div>
            </div>
          </CaptionRule>
        </div>
      </div>

      {/* mission statement */}
      <div
        ref={statementRef}
        className="col-span-full mt-100 justify-self-center text-blue font-pp-neue font-normal text-center tracking-[0] leading-none fs-32 lg:mt-166 lg:fs-46 lg:max-w-1172"
        role="text"
      >
        真诚、专业、长期投入——我们和下一代一起，把职业未来握在自己手里。
      </div>
    </section>
  );
}
