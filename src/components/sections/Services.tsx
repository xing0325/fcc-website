"use client";

import { useState } from "react";
import DitheredImage from "@/components/DitheredImage";
import FlipArrowLink from "@/components/FlipArrowLink";
import SlideButton from "@/components/SlideButton";
import { PlusIcon } from "@/components/icons";
import { useAnim } from "@/lib/anim";

const SERVICES = [
  {
    title: "背景诊断",
    en: "Background Assessment",
    description: "测评你的背景与目标赛道，产出一份可执行的求职定位方案。",
    href: "/services",
    image: "/images/fcc-10.jpg",
  },
  {
    title: "顾问匹配",
    en: "Consultant Matching",
    description: "按目标行业匹配核心顾问与行业专家，确定你的专属服务团队。",
    href: "/services",
    image: "/images/fcc-3.jpg",
  },
  {
    title: "导师指导",
    en: "Mentorship Program",
    description: "导师一对一带教，补齐目标岗位所需的知识与技能清单。",
    href: "/services",
    image: "/images/fcc-8.jpg",
  },
  {
    title: "实战模拟",
    en: "Simulation Training",
    description: "多轮 Mock 面试逐项拆解，每轮给出反馈与改进清单。",
    href: "/services",
    image: "/images/fcc-7.jpg",
  },
  {
    title: "职场分析",
    en: "Career Analytics",
    description: "梳理岗位节奏与内推渠道，产出实习与全职的投递计划。",
    href: "/services",
    image: "/images/fcc-9.jpg",
  },
  {
    title: "最终申请",
    en: "Final Push",
    description: "跟进网申、面试到谈薪的每个节点，直到 Offer 落定。",
    href: "/services",
    image: "/images/fcc-1.jpg",
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
            key={service.en}
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
              <div key={service.en} className="border-b-1px b-blue">
                <h3>
                  <button
                    id={`accordion-button-${i}`}
                    aria-expanded={open}
                    aria-controls={`accordion-panel-${i}`}
                    onClick={() => toggle(i)}
                    className="text-blue font-normal font-pp-neue fs-30 flex w-full justify-between text-left items-start py-17 pr-3 lg:pr-15 leading-none cursor-pointer"
                  >
                    <span className="flex flex-col items-start">
                      <span className="font-gta-mono fs-12 uppercase opacity-60 hidden lg:block mb-6">
                        {service.en}
                      </span>
                      <span>{service.title}</span>
                    </span>
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
