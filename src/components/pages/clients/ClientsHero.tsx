"use client";

import { useAnim } from "@/lib/anim";

/**
 * /clients hero — oversized centered heading over the mercury page
 * background, followed by an indented pull-quote with a rule + attribution
 * (classes lifted from the original page markup).
 */
export default function ClientsHero() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const quoteRef = useAnim<HTMLDivElement>("lineUp", { delay: 0.2 });
  const ruleRef = useAnim<HTMLDivElement>("line", { axis: "x", delay: 0.2 });
  const citeRef = useAnim<HTMLElement>("fadeUp", { delay: 0.3 });

  return (
    <section className="px-15 my-grid lg:mb-228">
      <h1
        ref={titleRef}
        className="page-title col-span-full justify-self-center text-blue text-center lg:col-start-2 lg:col-span-10"
      >
        Where Our Students Land
      </h1>

      <blockquote
        className="col-span-full mt-100 lg:col-start-6 lg:col-span-5 lg:mt-88"
        role="group"
      >
        <div
          ref={quoteRef}
          className="page-text text-blue lg:fs-20 lg:leading-[1.3]"
          role="text"
        >
          <span aria-hidden="true" className="inline-block w-[8.33vw] h-1" />
          &ldquo;学员的去向,是我们导师团队最真实的成绩单。从战略咨询到投资银行,从头部互联网大厂到前沿
          AI
          公司,每一份录用的背后,都是背景诊断、导师辅导与多轮实战模拟的长期积累。我们坚持信息透明、结果导向,陪伴每一位学员走到
          Offer 的那一刻。&rdquo;
        </div>
        <footer className="mt-100 flex items-center gap-x-15 lg:mt-44">
          <div ref={ruleRef} className="w-104 h-1 bg-blue" aria-hidden="true" />
          <cite ref={citeRef} className="text-blue not-italic">
            <div className="page-text lg:fs-20">咨询赛道导师</div>
            <div className="text-mono fs-12 mt-8">FCC 导师委员会</div>
          </cite>
        </footer>
      </blockquote>
    </section>
  );
}
