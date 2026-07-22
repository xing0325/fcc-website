"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapSetup";
import { useAnim } from "@/lib/anim";
import { onLoaderComplete } from "@/lib/loaderBus";
import { ArrowControlsIcon } from "@/components/icons";

/**
 * Each quote is hand-split into 3–4 *visual* lines (semantic breaks, not by
 * space and not per-character — Chinese doesn't split on spaces). Every line
 * rides in its own overflow-hidden mask and sweeps yPercent 110 → 0.
 */
const SLIDES = [
  {
    lines: [
      "“最初我连 Case 框架都搭不起来，",
      "Mock 常在开头就卡住。",
      "八周训练把拆题的步骤一步步固定下来，",
      "终面时我第一次完整、稳定地讲完了整个分析。”",
    ],
    name: "W 同学|2025 届|商科",
    company: "Accenture · 分析师",
    logoText: "Accenture",
  },
  {
    lines: [
      "“我的问题是节奏：框架背得熟，",
      "一被追问就乱。十二轮 Mock 之后，",
      "我习惯了先停两秒再作答，",
      "真实的 Bain 面试里没有再被追问带偏过。”",
    ],
    name: "L 同学|2026 届|经济学|海本",
    company: "Bain · 2025 Spring PTA",
    logoText: "BAIN & COMPANY",
  },
  {
    lines: [
      "“转专业的我不了解审计的用人逻辑，",
      "简历投出去长期没有回音。",
      "导师逐条改掉简历里的学生腔表述，",
      "重投之后一周内就收到了面试邀请。”",
    ],
    name: "C 同学|2026 届|跨专业|工科转商",
    company: "PwC · 暑期实习",
    logoText: "PwC",
  },
];

// Line mask reveal + synced meta fadeUp — OCI's real cadence.
const DUR = 0.3;
const STAGGER = 0.05;
const EASE = "power4.out";

type QSelector = ReturnType<typeof gsap.utils.selector>;

/** Reveal timeline for slide `i`: lines mask up, meta fades up, in one beat. */
function inTL(q: QSelector, i: number): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.fromTo(
    q(`.tm-line[data-slide="${i}"]`),
    { yPercent: 110 },
    { yPercent: 0, duration: DUR, ease: EASE, stagger: STAGGER },
    0,
  );
  tl.fromTo(
    q(`.tm-fade[data-slide="${i}"]`),
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: DUR, ease: EASE },
    0,
  );
  return tl;
}

/** Conceal timeline for slide `i` — the reveal, run in reverse (收走). */
function outTL(q: QSelector, i: number): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.to(
    q(`.tm-line[data-slide="${i}"]`),
    { yPercent: 110, duration: DUR, ease: EASE, stagger: STAGGER },
    0,
  );
  tl.to(
    q(`.tm-fade[data-slide="${i}"]`),
    { opacity: 0, y: 12, duration: DUR, ease: EASE },
    0,
  );
  return tl;
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

  // Imperative controller state (refs so it never triggers re-renders).
  const qRef = useRef<QSelector | null>(null);
  const reducedRef = useRef(false);
  const startedRef = useRef(false); // entrance reveal has played
  const displayedRef = useRef(0); // slide currently on screen
  const activeRef = useRef(0); // latest requested slide
  const animatingRef = useRef(false); // buttons locked while true

  const prev = () => {
    if (animatingRef.current) return; // lock: ignore clicks mid-transition
    setActive((i) => (i - 1 + count) % count);
  };
  const next = () => {
    if (animatingRef.current) return;
    setActive((i) => (i + 1) % count);
  };

  // Baseline: hide every line/meta; honour reduced-motion by showing slide 0.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    qRef.current = q;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set(q(".tm-line"), { yPercent: 110 });
    gsap.set(q(".tm-fade"), { opacity: 0, y: 12 });

    if (reducedRef.current) {
      startedRef.current = true;
      displayedRef.current = activeRef.current;
      gsap.set(q(`.tm-line[data-slide="${activeRef.current}"]`), {
        yPercent: 0,
      });
      gsap.set(q(`.tm-fade[data-slide="${activeRef.current}"]`), {
        opacity: 1,
        y: 0,
      });
    }
  }, []);

  // Fire the section once it scrolls into view.
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
  }, []);

  // Entrance: same per-line reveal for the first quote, gated on loader+inView.
  useEffect(() => {
    if (reducedRef.current || !inView || startedRef.current) return;
    const off = onLoaderComplete(() => {
      if (startedRef.current) return;
      const q = qRef.current;
      if (!q) return;
      startedRef.current = true;
      const i = activeRef.current;
      displayedRef.current = i;
      animatingRef.current = true;
      const tl = inTL(q, i);
      tl.eventCallback("onComplete", () => {
        animatingRef.current = false;
      });
    });
    return off;
  }, [inView]);

  // Switch: serial out(old) → in(new), one timeline; buttons stay locked.
  useEffect(() => {
    activeRef.current = active;
    if (!startedRef.current) return;
    const q = qRef.current;
    if (!q) return;
    const from = displayedRef.current;
    if (from === active) return;

    if (reducedRef.current) {
      gsap.set(q(`.tm-line[data-slide="${from}"]`), { yPercent: 110 });
      gsap.set(q(`.tm-fade[data-slide="${from}"]`), { opacity: 0, y: 12 });
      gsap.set(q(`.tm-line[data-slide="${active}"]`), { yPercent: 0 });
      gsap.set(q(`.tm-fade[data-slide="${active}"]`), { opacity: 1, y: 0 });
      displayedRef.current = active;
      return;
    }

    animatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
        displayedRef.current = active;
      },
    });
    tl.add(outTL(q, from));
    tl.add(inTL(q, active));
  }, [active]);

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
      <h2 className="sr-only">学员评价</h2>
      <div className="col-span-full mt-50 my-grid lg:mt-0">
        <div
          ref={quoteRef}
          className="grid grid-cols-subgrid col-span-full lg:col-start-5 lg:col-end-[-2] lg:pt-122 lg:pb-122"
        >
          {/* quote zone reserves the height of the tallest quote */}
          <div className="col-span-full grid-stack-wrap mb-80 lg:mb-130 lg:min-h-322">
            {SLIDES.map((slide, i) => (
              <blockquote
                key={i}
                role="group"
                className="grid-stack text-blue font-normal font-pp-neue fs-32 leading-none tracking-[0] lg:fs-46"
              >
                {slide.lines.map((line, li) => (
                  <span key={li} className="block overflow-hidden">
                    <span
                      className="tm-line block"
                      data-slide={i}
                      style={{ transform: "translateY(110%)" }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </blockquote>
            ))}
          </div>
          <div className="flex col-start-1 col-span-1 my-text">
            <span className="grid-stack-wrap">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className="grid-stack tm-fade"
                  data-slide={i}
                  style={{ opacity: 0 }}
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
                className="my-text grid-stack tm-fade"
                data-slide={i}
                style={{ opacity: 0 }}
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
                  className="grid-stack tm-fade whitespace-nowrap font-pp-neue font-medium lg:font-bold fs-24 lg:fs-32 leading-none text-blue"
                  data-slide={i}
                  style={{ opacity: 0 }}
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
