import type { Metadata } from "next";
import ServicesHero from "@/components/pages/services/ServicesHero";
import ServicesIntro from "@/components/pages/services/ServicesIntro";
import ServicesList from "@/components/pages/services/ServicesList";

export const metadata: Metadata = {
  title: "服务 | FCC Funshine Career Consulting",
  description:
    "FCC 六阶段全流程陪伴式求职辅导——从背景诊断、顾问匹配、导师指导、实战模拟到职场分析与最终申请谈薪，长期主义陪你拿到理想 Offer。",
};

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesIntro />
      <ServicesList />
    </div>
  );
}
