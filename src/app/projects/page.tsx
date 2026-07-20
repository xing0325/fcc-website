import type { Metadata } from "next";
import ProjectsContent from "@/components/pages/projects/ProjectsContent";

export const metadata: Metadata = {
  title: "学员案例 | FCC Funshine Career Consulting",
  description:
    "FCC 学员近期 Offer 案例:覆盖 Consulting、Internet、Banking、AI Product 四大赛道,从背景诊断到最终申请的六大流程全程护航,见证每一份 Offer 的达成。",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
