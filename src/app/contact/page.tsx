import type { Metadata } from "next";
import ContactContent from "@/components/pages/contact/ContactContent";

export const metadata: Metadata = {
  title: "联系我们 | FCC Funshine Career Consulting",
  description:
    "联系 FCC Funshine Career Consulting,咨询求职辅导服务。电话 400 015 5158,邮箱 hello@fccccc.org,办公室位于成都与新加坡。",
};

export default function ContactPage() {
  return <ContactContent />;
}
