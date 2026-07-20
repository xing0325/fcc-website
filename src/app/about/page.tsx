import type { Metadata } from "next";
import AboutHero from "@/components/pages/about/AboutHero";
import OurVision from "@/components/pages/about/OurVision";
import Milestones from "@/components/pages/about/Milestones";
import LeadershipBoard from "@/components/pages/about/LeadershipBoard";

export const metadata: Metadata = {
  title: "关于我们 | FCC Funshine Career Consulting",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurVision />
      <Milestones />
      <LeadershipBoard />
    </main>
  );
}
