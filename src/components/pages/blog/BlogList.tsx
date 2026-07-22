"use client";

import { useState } from "react";
import ArchiveImage from "@/components/ArchiveImage";
import { useAnim } from "@/lib/anim";

/**
 * /blog — "Insights" hero, sticky category filters and the post index.
 * Layout classes are copied from the original page markup; the original's
 * `.active` row state (red panel wiping down, text flipping to mercury and
 * a "Read" button fading in) is reproduced with group-hover CSS.
 * Post links point at /blog itself — individual post pages are out of scope.
 */

interface Post {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}

const CATEGORIES = ["Consulting", "Internet", "Banking", "AI Product"];

const POSTS: Post[] = [
  {
    date: "2026.03",
    category: "Consulting",
    title: "Case 面试的节奏感比框架更重要",
    excerpt:
      "背熟 Profitability 树不等于会做 Case。我们复盘了 40+ 场 MBB Mock，发现拉开差距的是开场三分钟的节奏感与假设驱动的追问方式。",
    image: "/images/fcc-1.jpg",
  },
  {
    date: "2026.02",
    category: "AI Product",
    title: "AI 产品经理的作品集怎么做",
    excerpt:
      "一份能过简历关的 AI PM 作品集，不是 Demo 堆砌，而是「问题定义 — 模型边界 — 产品取舍」的完整叙事。附清华系 AI 公司面试官的评分视角。",
    image: "/images/fcc-2.jpg",
  },
  {
    date: "2026.01",
    category: "Banking",
    title: "投行暑期实习的隐性门槛",
    excerpt:
      "高盛、摩根士丹利与中金的暑期项目，网申之外还有三道看不见的筛选：Networking 记录、可验证的估值功底与 Deal Sense。逐一拆给你看。",
    image: "/images/fcc-3.jpg",
  },
  {
    date: "2025.12",
    category: "Internet",
    title: "转专业同学如何补齐行业信息差",
    excerpt:
      "没有互联网实习、不认识业内人，转专业求职最缺的不是能力而是信息。这篇给出一条 8 周补齐信息差的路径：从产品拆解到导师访谈。",
    image: "/images/fcc-4.jpg",
  },
  {
    date: "2025.11",
    category: "Consulting",
    title: "谈薪的三个筹码：信息、时点与替代选项",
    excerpt:
      "拿到 Offer 只是谈判的开始。市场薪酬带宽、回复截止日的运用与并行 Offer 的展示方式，是应届生手里最被低估的三个筹码。",
    image: "/images/fcc-5.jpg",
  },
  {
    date: "2025.10",
    category: "Internet",
    title: "2026 秋招时间线全景图",
    excerpt:
      "从 6 月提前批到次年春招补录，一张图看清咨询、互联网、投行与 AI 赛道的关键节点，以及每个阶段该完成的准备动作。",
    image: "/images/fcc-6.jpg",
  },
  {
    date: "2025.09",
    category: "Banking",
    title: "IBD 技术面拆解：三张报表如何讲成一个故事",
    excerpt:
      "「Walk me through the three statements」不是背诵题。顶尖投行 VP 导师示范如何用一笔折旧把三张报表串成有逻辑的现金流故事。",
    image: "/images/fcc-7.jpg",
  },
  {
    date: "2025.08",
    category: "AI Product",
    title: "从 Demo 到 PRD：AI 产品面试的实战准备",
    excerpt:
      "AI 产品面试越来越像开卷考试：现场写 Prompt、评估幻觉风险、定义评测指标。我们把高频题型整理成一套可演练的 PRD 工作流。",
    image: "/images/fcc-8.jpg",
  },
  {
    date: "2025.07",
    category: "Consulting",
    title: "从 PTA 到 Return Offer：一段春季实习的正确打开方式",
    excerpt:
      "以 Bain 2025 Spring PTA 学员的真实路径为样本，拆解 PTA 阶段如何管理预期、争取曝光，并把短期项目转化为 Return Offer。",
    image: "/images/fcc-9.jpg",
  },
];

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)]";

function ReadButton({
  label = "Read",
  title,
  className = "",
  large = false,
}: {
  label?: string;
  title: string;
  className?: string;
  large?: boolean;
}) {
  const pad = large ? "px-50 py-30" : "px-37 py-21";
  return (
    <a
      href="/blog"
      aria-label={`Read article: ${title}`}
      className={`group/read relative overflow-hidden text-center uppercase leading-none tracking-[0.02em] font-gta-mono font-normal ${
        large
          ? "fs-14 bg-mercury text-blue"
          : "text-[11px] b-1px b-blue text-blue"
      } ${className}`}
    >
      <span
        className={`block ${pad} transition-transform duration-[0.6s] ${EASE} group-hover/read:-translate-y-full`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 block ${pad} bg-blue text-mercury origin-bottom translate-y-full scale-x-50 transition-transform duration-[0.6s] ${EASE} group-hover/read:translate-y-0 group-hover/read:scale-x-100`}
      >
        {label}
      </span>
    </a>
  );
}

function PostRow({ post }: { post: Post }) {
  return (
    <article className="group relative col-span-full pt-40 pb-50 border-b-1px b-blue lg:grid lg:grid-cols-subgrid lg:pb-32">
      {/* red panel that wipes down over the row on hover (lg only) */}
      <div
        aria-hidden="true"
        className={`hidden lg:block absolute inset-0 -z-1 bg-blue origin-top scale-y-0 transition-transform duration-500 ${EASE} group-hover:scale-y-100`}
      />

      {/* date + category */}
      <div className="flex justify-between items-end lg:col-span-3 lg:pl-22 lg:flex-col lg:justify-start lg:items-start">
        <div className="font-pp-neue font-normal fs-30 leading-none tracking-[0.05em] text-blue transition-colors duration-200 lg:group-hover:text-mercury">
          {post.date}
        </div>
        <div className="font-gta-mono uppercase fs-12 leading-[1.2] text-blue transition-colors duration-200 lg:group-hover:text-mercury lg:mt-16">
          {post.category}
        </div>
      </div>

      {/* title + excerpt + desktop read button */}
      <div className="mt-50 lg:col-span-4 lg:mt-0 lg:flex lg:flex-col lg:justify-between lg:items-start">
        <div>
          <h2 className="font-pp-neue font-normal fs-18 leading-none tracking-[0] text-blue transition-colors duration-200 lg:group-hover:text-mercury lg:fs-24">
            {post.title}
          </h2>
          <p className="font-pp-neue font-normal fs-14 leading-[1.5] text-blue transition-colors duration-200 lg:group-hover:text-mercury mt-16">
            {post.excerpt}
          </p>
        </div>
        <ReadButton
          title={post.title}
          large
          className="hidden lg:inline-block lg:mt-90 lg:opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100"
        />
      </div>

      {/* thumbnail + mobile read button */}
      <div className="flex justify-between items-end mt-50 lg:col-span-3 lg:justify-self-end lg:self-start lg:mt-0">
        <div className="relative overflow-hidden w-[29.37vw] aspect-square lg:w-[15.42vw] lg:mr-20">
          <ArchiveImage
            src={post.image}
            alt={`FCC ${post.category} 方向求职辅导主题配图`}
            variant="archive"
          />
        </div>
        <ReadButton title={post.title} className="inline-block lg:hidden" />
      </div>
    </article>
  );
}

export default function BlogList() {
  const [filter, setFilter] = useState("All");
  const titleRef = useAnim<HTMLSpanElement>("title");
  const supRef = useAnim<HTMLElement>("fadeIn", { delay: 0.6 });
  const ruleRef = useAnim<HTMLHRElement>("line", { axis: "x", delay: 0.2 });
  const filtersRef = useAnim<HTMLUListElement>("fadeUp", {
    target: "li",
    stagger: 0.08,
    delay: 0.2,
  });
  const postsRef = useAnim<HTMLDivElement>("fadeUp", { delay: 0.3 });

  const posts =
    filter === "All" ? POSTS : POSTS.filter((p) => p.category === filter);

  return (
    <section className="px-15 my-grid pt-148 pb-100 lg:pt-312">
      <h1 className="col-span-full relative page-title text-blue justify-self-start lg:-ml-[0.07em]">
        <span ref={titleRef} role="text">
          Insights
        </span>
        <sup
          ref={supRef}
          className="absolute left-full top-0 text-blue font-medium fs-20 leading-none ml-18 lg:fs-30 lg:ml-6"
        >
          ({String(posts.length).padStart(2, "0")})
        </sup>
      </h1>

      <hr
        ref={ruleRef}
        className="col-span-full border-t-1px b-blue mt-20 lg:mt-32"
      />

      {/* category filters */}
      <div className="col-span-full mt-30 lg:mt-40 lg:col-span-2">
        <ul ref={filtersRef} className="flex flex-col lg:sticky lg:top-100">
          {["All", ...CATEGORIES].map((cat) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => setFilter(cat)}
                className={`font-pp-neue font-normal fs-22 leading-[1.4] text-left text-blue cursor-pointer transition-opacity duration-200 ${
                  filter === cat ? "opacity-50" : ""
                }`}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="col-span-full border-t-1px b-blue mt-50 lg:hidden" />

      {/* post index */}
      <div
        ref={postsRef}
        className="relative col-span-full lg:col-span-10 lg:grid lg:grid-cols-subgrid"
      >
        {posts.map((post) => (
          <PostRow key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}
