import type { Metadata } from "next";
import BlogList from "@/components/pages/blog/BlogList";

export const metadata: Metadata = {
  title: "求职洞察 | FCC Funshine Career Consulting",
  description:
    "FCC 求职洞察：咨询、互联网、投行与 AI 产品四大赛道的一手求职干货 —— 面试拆解、行业信息差、时间线规划与谈薪策略。",
};

export default function BlogPage() {
  return (
    <main id="main">
      <BlogList />
    </main>
  );
}
