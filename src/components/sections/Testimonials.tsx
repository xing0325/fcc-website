"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useAnim } from "@/lib/anim";
import { ArrowControlsIcon } from "@/components/icons";

const SLIDES = [
  {
    quote:
      "“从背景诊断到最终谈薪，FCC 的导师在每一个节点都给了我可执行的建议。方向清晰之后，拿到埃森哲的分析师 Offer 只是水到渠成。”",
    name: "Devon",
    company: "Accenture · 分析师",
    logo: "",
    logoText: "Accenture",
  },
  {
    quote:
      "“Case 面试最难的不是框架，而是节奏。多轮高强度的 Mock 让我在真正的 Bain 面试里几乎没有遇到意料之外的问题。”",
    name: "Lucas",
    company: "Bain · 2025 Spring PTA",
    logo: "",
    logoText: "BAIN & COMPANY",
  },
  {
    quote:
      "“作为转专业的同学，我最需要的是行业信息差的填补。FCC 的行业专家把 PwC 的用人逻辑讲透了，暑期实习面试一次通过。”",
    name: "Kevin",
    company: "PwC · 暑期实习",
    logo: "",
    logoText: "PwC",
  },
];

/**
 * Splits a quote into per-word spans (splitting ONLY on regular spaces so
 * zero-width joiners inside "words" stay intact) and staggers them in:
 * ~0.4s fade per word, ~15ms delay increment. With prefers-reduced-motion
 * the words swap in instantly (no transition, no stagger).
 */
function QuoteWords({ text, revealed }: { text: string; revealed: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={`motion-safe:transition-opacity motion-safe:duration-400 motion-safe:[transition-delay:var(--wd)] ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
          style={{ "--wd": revealed ? `${i * 15}ms` : "0ms" } as CSSProperties}
        >
          {i < words.length - 1 ? `${word} ` : word}
        </span>
      ))}
    </>
  );
}

function ControlButton({
  label,
  flipped,
  onClick,
}: {
  label: string;
  flipped?: boolean;
  onClick: () => void;
}) {
  const rotation = flipped ? "lg:rotate-90 scale-x-[-1]" : "lg:rotate-90";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative overflow-hidden size-46 rounded-full b-1px b-blue flex-center text-blue"
    >
      {/* resting arrow slides DOWN and out on hover */}
      <ArrowControlsIcon
        className={`icon w-20 h-9 transition-transform duration-500 group-hover:translate-y-55 ${rotation}`}
        aria-hidden="true"
      />
      {/* blue disc scales up from the bottom */}
      <span className="block absolute inset-0 w-full h-full bg-blue rounded-full origin-bottom scale-y-0 transition-transform duration-500 group-hover:scale-y-100" />
      {/* replacement arrow slides in from ABOVE (original: translateY(-55px) -> 0) */}
      <span className="block absolute inset-0 flex-center rounded-full w-full h-full z-1 -translate-y-55 transition-transform duration-500 group-hover:translate-y-0">
        <ArrowControlsIcon
          className={`icon w-20 h-9 text-white! ${rotation}`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const quoteRef = useAnim<HTMLDivElement>("fadeUp");
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const count = SLIDES.length;
  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  // Word stagger kicks off once, when the section scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return (
    <section
      ref={ref}
      className="px-15 bg-white pt-50 pb-56 lg:pb-0"
      data-slice-type="testimonials"
      data-slice-variation="default"
    >
      <div className="my-grid">
        <div className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full">
          <div>
            <span>Testimonials</span>
          </div>
          <div aria-hidden="true">[FCC.3]</div>
        </div>
      </div>
      <h2 className="sr-only">Testimonials</h2>
      <div className="col-span-full mt-50 my-grid lg:mt-0">
        <div
          ref={quoteRef}
          className="grid grid-cols-subgrid col-span-full lg:col-start-5 lg:col-end-[-2] lg:pt-122 lg:pb-122"
        >
          {/* quote zone reserves the height of the tallest quote (6 lines) */}
          <div className="col-span-full grid-stack-wrap mb-80 lg:mb-130 lg:min-h-322">
            {SLIDES.map((slide, i) => (
              <blockquote
                key={i}
                role="group"
                className={`grid-stack [&>*]:inline text-blue font-normal font-pp-neue fs-32 leading-none tracking-[0] lg:fs-46 motion-safe:transition-opacity motion-safe:duration-250 ${
                  i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <QuoteWords text={slide.quote} revealed={inView && i === active} />
              </blockquote>
            ))}
          </div>
          <div className="flex col-start-1 col-span-1 my-text">
            <span className="grid-stack-wrap">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`grid-stack motion-safe:transition-opacity motion-safe:duration-300 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </span>{" "}
            / <span>03</span>
          </div>
          <div className="col-start-2 col-end-[-1] grid-stack-wrap">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`my-text grid-stack motion-safe:transition-opacity motion-safe:duration-300 ${
                  i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div>{slide.name}</div>
                <span>{slide.company}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-full mt-80 flex justify-between items-center lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start lg:pt-122 lg:pb-112 lg:border-l b-blue">
          <div className="relative lg:-translate-x-1/2 lg:h-60 lg:flex lg:items-center">
            <div className="hidden lg:block bg-white absolute inset-0 -z-1 scale-y-200" />
            <div className="grid-stack-wrap items-center lg:h-full">
              {SLIDES.map((slide, i) => (
                <span
                  key={i}
                  className={`grid-stack whitespace-nowrap font-pp-neue font-medium fs-24 leading-none text-blue transition-opacity duration-500 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {slide.logoText}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-x-20 lg:flex-col lg:gap-y-20 lg:-translate-x-1/2 lg:relative">
            <div className="hidden lg:block bg-white absolute inset-0 -z-1 scale-y-130" />
            <ControlButton label="Previous Testimonial" flipped onClick={prev} />
            <ControlButton label="Next Testimonial" onClick={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
