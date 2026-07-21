"use client";

import SlideButton from "@/components/SlideButton";
import { useAnim } from "@/lib/anim";

/**
 * CtaSection — the "next step" block between News and the footer. No photos
 * (R2): pure typography on the brand bg-blue field, reversed in mercury.
 * Chinese headline is the primary scan line (R1); "BOOK A SESSION" is the
 * auxiliary mono tag. Four mono/grid info columns answer 适合谁 / 会聊什么 /
 * 需要多久 / 如何预约, then a SlideButton leads to /contact.
 */

const ITEMS = [
  {
    num: "01",
    label: "适合谁",
    text: "海内外在读与应届同学,以及工作 1–3 年、考虑转型的职场人。",
  },
  {
    num: "02",
    label: "会聊什么",
    text: "背景诊断与赛道建议:先弄清现状,再谈要不要投入。",
  },
  {
    num: "03",
    label: "需要多久",
    text: "30 分钟,线上进行。",
  },
  {
    num: "04",
    label: "如何预约",
    text: "提交你的背景信息,我们会在 48 小时内回复,确认时间。",
  },
] as const;

export default function CtaSection() {
  const tagRef = useAnim<HTMLDivElement>("fadeIn");
  const titleRef = useAnim<HTMLDivElement>("title");
  const itemsRef = useAnim<HTMLDivElement>("fadeUp", {
    target: ".js-cta-item",
    stagger: 0.1,
  });
  const buttonRef = useAnim<HTMLDivElement>("fadeUp", { delay: 0.2 });

  return (
    <section className="px-15 my-grid content-start overflow-hidden bg-blue text-mercury pt-50 pb-64 lg:pt-80 lg:pb-100">
      {/* mono header row (auxiliary English tag, hidden on mobile per R1) */}
      <div
        ref={tagRef}
        className="col-span-full hidden lg:flex justify-between font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase opacity-60"
      >
        <span>Book a Session</span>
        <span aria-hidden="true">[FCC.6]</span>
      </div>

      {/* Chinese main title */}
      <div className="col-span-full mt-30 lg:col-start-1 lg:col-end-[-3] lg:mt-50">
        <div ref={titleRef}>
          <h2 className="font-pp-neue font-medium tracking-[0] leading-[1.05] fs-36 lg:fs-72">
            先聊 30 分钟,
            <br />
            再决定要不要开始
          </h2>
        </div>
      </div>

      {/* four mono/grid info columns */}
      <div
        ref={itemsRef}
        className="col-span-full grid grid-cols-subgrid gap-y-40 mt-60 lg:mt-90 lg:gap-y-0"
      >
        {ITEMS.map((item) => (
          <div
            key={item.num}
            className="js-cta-item col-span-full border-l-1px b-mercury pl-12 lg:col-span-3 lg:pr-30"
          >
            <div className="font-gta-mono fs-12 uppercase leading-none tracking-[0] opacity-60">
              {item.num}
            </div>
            <h3 className="font-pp-neue font-normal fs-18 lg:fs-20 leading-none tracking-[0] mt-16">
              {item.label}
            </h3>
            <p className="font-gta-mono fs-14 lg:fs-12 leading-[1.21] lg:leading-[1.33] tracking-[0] mt-14 lg:mt-18">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* primary CTA */}
      <div ref={buttonRef} className="col-span-full mt-60 lg:mt-90">
        <SlideButton label="预约咨询" href="/contact" className="b-1px b-mercury" />
      </div>
    </section>
  );
}
