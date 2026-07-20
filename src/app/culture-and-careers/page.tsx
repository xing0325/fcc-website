import type { Metadata } from "next";
import CultureHero from "@/components/pages/culture-and-careers/CultureHero";
import CultureSection from "@/components/pages/culture-and-careers/CultureSection";
import CareersSection from "@/components/pages/culture-and-careers/CareersSection";
import PerksSection from "@/components/pages/culture-and-careers/PerksSection";
import OutsourceCares from "@/components/pages/culture-and-careers/OutsourceCares";

export const metadata: Metadata = {
  title: "文化与加入我们 | FCC Funshine Career Consulting",
  description:
    "了解 FCC 的文化:长期主义、信息透明、结果导向、陪伴式辅导。查看开放角色——兼职行业导师、全职求职顾问、内容运营与品牌,和我们一起陪伴下一代走向职业未来。",
};

export default function CultureAndCareersPage() {
  return (
    <main>
      <CultureHero />
      <CultureSection />
      <CareersSection />
      <PerksSection />
      <OutsourceCares />
    </main>
  );
}
