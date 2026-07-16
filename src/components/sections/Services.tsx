"use client";

import { useState } from "react";
import DitheredImage from "@/components/DitheredImage";
import FlipArrowLink from "@/components/FlipArrowLink";
import SlideButton from "@/components/SlideButton";
import { PlusIcon } from "@/components/icons";
import { useAnim } from "@/lib/anim";

const SERVICES = [
  {
    title: "背景诊断 Background Assessment",
    description:
      "科学测评学员背景与职业兴趣，定制个性化求职方案，解决方向迷茫问题。",
    href: "#services",
    image: "/images/fcc-2.jpg",
  },
  {
    title: "顾问匹配 Consultant Matching",
    description:
      "精准匹配行业专家导师，优化申请材料与人脉网络，强化职业竞争力。",
    href: "#services",
    image: "/images/fcc-3.jpg",
  },
  {
    title: "导师指导 Mentorship Program",
    description:
      "多位资深导师一对一/小班教学，系统搭建知识体系与实战经验，覆盖跨行业转型支持。",
    href: "#services",
    image: "/images/fcc-6.jpg",
  },
  {
    title: "实战模拟 Simulation Training",
    description:
      "多轮 Mock 面试密集高强度演练，行为/技术/案例逐项拆解，系统性提升面试能力。",
    href: "#services",
    image: "/images/fcc-8.jpg",
  },
  {
    title: "职场分析 Career Analytics",
    description:
      "提供 Offer 评估策略与职业发展建议，涵盖网络内推、实习/全职岗位规划与路径优化。",
    href: "#services",
    image: "/images/fcc-5.jpg",
  },
  {
    title: "最终申请 Final Push",
    description:
      "系统化支持全职申请，对接行业领军与校友网络，推进流程并提供谈薪建议。",
    href: "#services",
    image: "/images/fcc-7.jpg",
  },
];

export default function Services() {
  const ourRef = useAnim<HTMLDivElement>("title");
  const servicesRef = useAnim<HTMLDivElement>("title");
  const accordionRef = useAnim<HTMLDivElement>("fadeIn");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [imageIndex, setImageIndex] = useState(0);

  const toggle = (i: number) => {
    if (openIndex === i) {
      setOpenIndex(null);
    } else {
      setOpenIndex(i);
      setImageIndex(i);
    }
  };

  return (
    <section className="px-15 pt-50 my-grid grid-rows-[repeat(2,auto)] content-start min-h-svh">
      <h2 className="sr-only">Our Services</h2>
      <div className="hidden lg:block border-l-1px b-blue col-start-7 col-end-[-1] row-start-1 row-end-3 -ml-[1.11vw]" />
      <div
        className="bg-mercury col-span-full text-blue font-pp-neue font-medium text-[5rem] tracking-[0] leading-none lg:leading-[0.9375] lg:text-[10rem] lg:mb-110 lg:grid lg:col-span-full lg:row-start-1 lg:grid-cols-subgrid lg:mt-70"
        aria-hidden="true"
      >
        <div ref={ourRef} className="lg:col-start-1 lg:col-end-7">
          Our
        </div>
        <div ref={servicesRef} className="lg:col-start-7 lg:col-span-6">
          Services
        </div>
      </div>
      <div className="hidden lg:block lg:col-start-1 lg:col-span-6 lg:row-start-2 lg:relative">
        {SERVICES.map((service, i) => (
          <div
            key={service.href}
            className={`absolute inset-0 flex-center transition-opacity duration-500 ${
              imageIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative overflow-hidden w-[49%] aspect-[340/240]">
              <DitheredImage src={service.image} alt={service.title} />
            </div>
          </div>
        ))}
      </div>
      <div className="col-span-full mt-50 pb-15 lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:mt-0">
        <div ref={accordionRef} className="accordion border-t-1px b-blue" role="presentation">
          {SERVICES.map((service, i) => {
            const open = openIndex === i;
            return (
              <div key={service.href} className="border-b-1px b-blue">
                <h3>
                  <button
                    id={`accordion-button-${i}`}
                    aria-expanded={open}
                    aria-controls={`accordion-panel-${i}`}
                    onClick={() => toggle(i)}
                    className="text-blue font-normal font-pp-neue fs-30 flex w-full justify-between text-left items-start py-17 pr-3 lg:pr-15 leading-none cursor-pointer"
                  >
                    <span>{service.title}</span>
                    <PlusIcon
                      className={`icon w-18 h-18 mt-6 inline-block origin-center shrink-0 transition-transform duration-500 ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`accordion-panel-${i}`}
                  className="grid"
                  role="region"
                  aria-labelledby={`accordion-button-${i}`}
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="flex flex-col items-start w-[49%] ml-auto pt-35 pb-35">
                      <p className="my-text">{service.description}</p>
                      <FlipArrowLink
                        label="Learn More"
                        href={service.href}
                        className="fs-12 mt-40 lg:mt-30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <SlideButton label="View All Services" href="/services" fullWidth className="mt-15" />
      </div>
      <div className="col-span-full border-b-1px b-blue" />
    </section>
  );
}
