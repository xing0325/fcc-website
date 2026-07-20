import type { Metadata } from "next";
import ClientsHero from "@/components/pages/clients/ClientsHero";
import LogosGrid, {
  type ClientLogo,
} from "@/components/pages/clients/LogosGrid";

export const metadata: Metadata = {
  title: "学员去向 | FCC Funshine Career Consulting",
  description:
    "FCC 学员的 Offer 覆盖战略咨询、投资银行、互联网与 AI 四大赛道:McKinsey、BCG、Bain、高盛、摩根士丹利、中金、腾讯、字节跳动、阿里巴巴等行业头部公司。",
};

const CONSULTING: ClientLogo[] = [
  { name: "McKinsey & Company" },
  { name: "BCG" },
  { name: "Bain & Company" },
  { name: "Accenture" },
  { name: "PwC" },
  { name: "Deloitte" },
];

const BANKING: ClientLogo[] = [
  { name: "Goldman Sachs" },
  { name: "Morgan Stanley" },
  { name: "CICC", sub: "中金公司" },
];

const INTERNET: ClientLogo[] = [
  { name: "Tencent", sub: "腾讯" },
  { name: "ByteDance", sub: "字节跳动" },
  { name: "Alibaba", sub: "阿里巴巴" },
];

const AI: ClientLogo[] = [
  { name: "DeepSeek", sub: "深度求索" },
  { name: "Moonshot AI", sub: "月之暗面" },
  { name: "Zhipu AI", sub: "智谱" },
];

export default function ClientsPage() {
  return (
    <main id="main">
      <div className="pt-200 pb-100 lg:pt-312">
        <ClientsHero />
        <LogosGrid title="战略咨询 Consulting" logos={CONSULTING} />
        <LogosGrid title="投资银行 Banking" logos={BANKING} />
        <LogosGrid title="互联网 Internet" logos={INTERNET} />
        <LogosGrid title="AI 产品 AI Product" logos={AI} />
      </div>
    </main>
  );
}
