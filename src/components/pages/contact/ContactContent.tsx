"use client";

import { useState } from "react";
import { useAnim } from "@/lib/anim";

/**
 * Contact page body — "Let's Connect" hero + 咨询/合作 form,
 * ported from the original's contact route (classes match its UnoCSS
 * markup; form styles from contact.ZKoBoUtb.css), restyled with FCC content.
 */

const contactCss = `
.form-tab {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  font-size: 2.25rem;
  padding-bottom: 6px;
  border-bottom: 1px solid transparent;
  opacity: 25%;
  transition: opacity 0.3s, border-color 0.3s;
  cursor: pointer;
}
@media (min-width: 1024px) {
  .form-tab { font-size: 2.875rem; }
}
.form-tab.active {
  border-color: var(--color-blue);
  opacity: 100%;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.form-label {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.5;
  letter-spacing: 0;
}
.form-input {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 1.375rem;
  line-height: 1;
  letter-spacing: 0;
  padding-bottom: 8px;
  outline: none;
  border: 0;
  border-bottom: 1px solid var(--color-blue);
  background: transparent;
  width: 100%;
}
.form-input::placeholder {
  color: var(--color-blue);
  opacity: 30%;
}
select.form-input {
  appearance: none;
  border-radius: 0;
  cursor: pointer;
}
select.form-input:invalid {
  opacity: 60%;
}
.contact-text {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 1.375rem;
  line-height: 1.5;
  letter-spacing: 0;
}
@media (min-width: 1024px) {
  .contact-text { font-size: 1rem; }
}
`;

function Field({
  id,
  label,
  placeholder,
  type = "text",
  className = "",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={`form-field ${className}`}>
      <span className="form-label">{label}</span>
      <input id={id} name={id} type={type} placeholder={placeholder} className="form-input" />
    </label>
  );
}

const socialLinks = [
  { href: "https://www.xiaohongshu.com/", label: "小红书" },
  { href: "https://weixin.qq.com/", label: "微信公众号" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
];

export default function ContactContent() {
  const [tab, setTab] = useState<"question" | "proposal">("question");
  const titleRef = useAnim<HTMLHeadingElement>("title", { triggerStart: "100%" });
  const headingMobileRef = useAnim<HTMLDivElement>("lineUp");
  const headingRef = useAnim<HTMLDivElement>("lineUp");
  const addressRef = useAnim<HTMLDivElement>("lineUp", { delay: 0.1 });
  const formRef = useAnim<HTMLDivElement>("fadeIn", { delay: 0.2 });

  return (
    <div className="pb-100">
      <style>{contactCss}</style>

      {/* full-bleed red hero */}
      <section className="px-15 flex justify-center bg-blue pt-192 pb-20 lg:pt-312 lg:pb-50">
        <h1 ref={titleRef} className="page-title font-normal text-mercury mx-auto lg:font-medium">
          Let&rsquo;s Connect
        </h1>
      </section>

      <section className="px-15 my-grid relative lg:border-b-1px lg:b-blue">
        {/* mono label row */}
        <div
          className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full mt-20 lg:w-full lg:absolute lg:top-12"
          aria-hidden="true"
        >
          <div>
            <span>Contact us</span>
          </div>
          <div>[FCC.1]</div>
        </div>

        {/* mobile heading */}
        <div
          ref={headingMobileRef}
          className="col-span-full text-heading font-normal fs-30 mt-50 lg:hidden"
        >
          联系我们,一起规划你的下一段职业旅程。
        </div>

        {/* form column */}
        <div
          ref={formRef}
          className="col-span-full grid grid-cols-subgrid mt-86 lg:col-start-5 lg:col-end-[-1] lg:border-l-1px lg:b-blue lg:mt-0 lg:pt-160 lg:pb-140"
        >
          <div className="col-span-full flex lg:col-start-2 lg:col-end-[-2] lg:gap-x-56">
            <div className="flex-1 flex justify-center lg:flex-none">
              <button
                type="button"
                onClick={() => setTab("question")}
                className={`form-tab${tab === "question" ? " active" : ""}`}
              >
                求职咨询
              </button>
            </div>
            <div className="flex-1 flex justify-center lg:flex-none">
              <button
                type="button"
                onClick={() => setTab("proposal")}
                className={`form-tab${tab === "proposal" ? " active" : ""}`}
              >
                商务合作
              </button>
            </div>
          </div>
          <form
            className="col-span-full mt-72 space-y-50 lg:col-start-2 lg:col-end-[-2] lg:mt-110 lg:space-y-30"
            onSubmit={(e) => e.preventDefault()}
            aria-label={tab === "question" ? "求职咨询表单" : "商务合作表单"}
          >
            <div className="w-full space-y-50 lg:flex lg:gap-x-15 lg:space-y-0">
              <Field id="name" label="姓名 Name" placeholder="张同学" className="lg:flex-1" />
              <Field
                id="contact"
                label="邮箱或微信 Email / WeChat"
                placeholder="hello@example.com"
                className="lg:flex-1"
              />
            </div>
            <label htmlFor="industry" className="form-field">
              <span className="form-label">目标行业 Target Industry</span>
              <select id="industry" name="industry" defaultValue="" required className="form-input">
                <option value="" disabled>
                  请选择目标行业…
                </option>
                <option value="consulting">Consulting 咨询</option>
                <option value="internet">Internet 互联网</option>
                <option value="banking">Banking 金融投行</option>
                <option value="ai-product">AI Product 人工智能产品</option>
              </select>
            </label>
            <Field id="message" label="留言 Message" placeholder="想聊聊你的求职目标…" className="mb-0" />
            <button
              type="submit"
              className="mt-50 lg:mt-60 relative inline-block overflow-hidden text-center uppercase fs-14 leading-none tracking-[0.02em] font-normal font-gta-mono group cursor-pointer"
            >
              <span className="block px-46 py-25 bg-blue text-mercury transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                Submit
              </span>
              <span
                aria-hidden
                className="absolute inset-0 block px-46 py-25 bg-white text-blue origin-bottom translate-y-full scale-x-50 transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:scale-x-100"
              >
                Submit
              </span>
            </button>
          </form>
        </div>

        {/* left column (desktop) */}
        <div className="col-span-full mt-80 lg:pt-160 lg:grid lg:grid-cols-subgrid lg:mt-0 lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:self-start">
          <div ref={headingRef} className="hidden lg:block lg:col-span-3 text-heading font-normal fs-30">
            联系我们,一起规划你的下一段职业旅程。
          </div>
          <div ref={addressRef} className="col-span-full lg:col-span-2 lg:mt-100">
            <div className="contact-text not-italic mb-30 lg:mb-24">
              <p>
                成都 · 高新区
                <br />
                Singapore · Raffles Place
              </p>
            </div>
            <div className="flex flex-col items-start">
              <a className="contact-text underline" href="tel:+864000155158" aria-label="致电 400 015 5158">
                400 015 5158
              </a>
              <a
                className="contact-text underline"
                href="mailto:hello@fccccc.org"
                aria-label="发邮件至 hello@fccccc.org"
              >
                hello@fccccc.org
              </a>
            </div>
            <div className="flex flex-col items-start mt-30 lg:mt-24">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="contact-text underline"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
