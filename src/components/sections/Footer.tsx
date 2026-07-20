"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowControlsIcon } from "@/components/icons";
import ScrambleText from "@/components/ScrambleText";

const LINK_STAGGER_MS = 40;
const TOUCH_FALLBACK_MS = 1500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Footer label: rests as "_" (ScrambleText underscore mode), decodes with a
 * letter-garble once `play` flips true, staggered by `delay`. With reduced
 * motion the real text renders immediately (no scramble, no stagger).
 */
function FooterScramble({
  text,
  play,
  delay = 0,
  instant = false,
}: {
  text: string;
  play: boolean;
  delay?: number;
  instant?: boolean;
}) {
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (!play || go) return;
    if (delay <= 0) {
      setGo(true);
      return;
    }
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [play, go, delay]);

  if (instant) return <span>{text}</span>;
  return <ScrambleText text={text} play={go} restMode="underscore" />;
}

type FooterLink = { href: string; label: string };

const pageLinks: FooterLink[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Cases" },
  { href: "/about#mentors", label: "Mentors" },
];

const companyLinks: FooterLink[] = [
  { href: "/clients", label: "Placements" },
  { href: "/culture-and-careers", label: "Culture" },
  { href: "/contact", label: "Contact" },
];

const faqLinks: FooterLink[] = [{ href: "/blog", label: "Insights" }];

const socialLinks: FooterLink[] = [
  { href: "https://www.xiaohongshu.com/", label: "小红书" },
  { href: "https://weixin.qq.com/", label: "微信公众号" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "https://www.fccccc.org/img/%E5%93%81%E7%89%8C%E6%89%8B%E5%86%8C.pdf", label: "品牌手册" },
];

const legalLinks: FooterLink[] = [
  { href: "https://beian.miit.gov.cn/", label: "蜀ICP备2025153008号-2" },
  { href: "/contact", label: "400 015 5158" },
];

const linkHoverClass = "transition-opacity duration-500 hover:opacity-60";

function MenuItems({
  links,
  base,
  play,
  instant,
}: {
  links: FooterLink[];
  base: number;
  play: boolean;
  instant: boolean;
}) {
  return (
    <>
      {links.map((link, i) => (
        <li key={link.href} role="none">
          <span>
            <a href={link.href} role="menuitem" className={linkHoverClass}>
              <FooterScramble
                text={link.label}
                play={play}
                delay={(base + i) * LINK_STAGGER_MS}
                instant={instant}
              />
            </a>
          </span>
        </li>
      ))}
    </>
  );
}

/**
 * Inline copy of the crosshair logo (from icons.tsx FooterLogo) with the two
 * plus-bars and the ring wrapped in groups so each part can animate in when
 * the footer enters the viewport (keyed off the `is-inview` class).
 */
function AnimatedFooterLogo({ className }: { className?: string }) {
  return (
    <div className={`flogo-part flogo-ring flex-center ${className ?? ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/fcc-logo.png" alt="" className="w-[62%] h-auto" />
    </div>
  );
}

const footerLogoCss = `
.flogo-part {
  transform-box: fill-box;
  transform-origin: center;
}
.flogo-bar-v {
  transform: scaleY(0);
  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}
.flogo-bar-h {
  transform: scaleX(0);
  transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}
.flogo-ring {
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.15s,
    transform 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.15s;
}
.is-inview .flogo-bar-v,
.is-inview .flogo-bar-h {
  transform: none;
}
.is-inview .flogo-ring {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .flogo-bar-v,
  .flogo-bar-h,
  .flogo-ring {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
`;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [decoded, setDecoded] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-inview");
            // Touch/no-hover fallback only: decode 1.5s after the footer
            // enters the viewport. Hover-capable devices keep "_" until a
            // pointer enters the nav, matching the original.
            if (window.matchMedia("(hover: none)").matches) {
              fallbackTimer.current = setTimeout(() => setDecoded(true), TOUCH_FALLBACK_MS);
            }
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (fallbackTimer.current !== null) clearTimeout(fallbackTimer.current);
    };
  }, []);

  const decodeAll = () => {
    if (fallbackTimer.current !== null) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    setDecoded(true);
  };

  return (
    <footer ref={footerRef} className="px-15 my-grid bg-blue pt-50 pb-20 lg:pt-20 lg:pb-26">
      <style>{footerLogoCss}</style>
      <div className="col-span-full flex justify-center items-center lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-2">
        <AnimatedFooterLogo className="size-[71.6vw] lg:size-[29vw]" />
      </div>
      <hr className="b-mercury col-span-full mt-50 lg:hidden" />
      <nav
        aria-label="Footer Navigation"
        onPointerEnter={decodeAll}
        className="font-pp-neue fs-16 leading-[1.5] text-mercury col-span-full grid grid-cols-subgrid mt-50 gap-y-30 lg:col-span-6 lg:gap-y-0 lg:mt-0 lg:content-start"
      >
        <ul
          role="menu"
          className="col-span-full flex flex-col items-start lg:col-span-3 lg:border-l lg:border-mercury lg:pl-12 lg:pt-15 lg:h-285"
        >
          <MenuItems links={pageLinks} base={0} play={decoded} instant={reduceMotion} />
        </ul>
        <ul
          role="menu"
          className="col-span-full flex flex-col items-start lg:col-span-3 lg:border-l lg:border-mercury lg:pl-12 lg:pt-15 lg:h-285"
        >
          <MenuItems links={companyLinks} base={4} play={decoded} instant={reduceMotion} />
        </ul>
        <ul
          role="menu"
          className="col-span-full flex flex-col items-start lg:col-span-3 lg:pl-12 lg:mt-32"
        >
          <MenuItems links={faqLinks} base={7} play={decoded} instant={reduceMotion} />
        </ul>
        <ul className="col-span-full lg:col-span-3 lg:order-1 lg:border-l lg:border-mercury lg:pl-12 lg:h-185 lg:flex lg:flex-col lg:justify-end">
          {socialLinks.map((link, i) => (
            <li key={link.href}>
              <span>
                <a href={link.href} target="_blank" className={linkHoverClass}>
                  <FooterScramble
                    text={link.label}
                    play={decoded}
                    delay={(8 + i) * LINK_STAGGER_MS}
                    instant={reduceMotion}
                  />
                </a>
              </span>
            </li>
          ))}
        </ul>
        <ul
          role="menu"
          className="col-span-full flex flex-col items-start lg:col-span-3 lg:border-l lg:border-mercury lg:pl-12 lg:order-1 lg:h-185 lg:flex lg:flex-col lg:justify-end"
        >
          <MenuItems links={legalLinks} base={12} play={decoded} instant={reduceMotion} />
          <li role="none">
            {/* Always readable in the original — never scrambles. */}
            <span className="hidden lg:mt-20 lg:block">
              <a
                href="https://www.fccccc.org/"
                target="_blank"
                rel="noopener"
                role="menuitem"
                className={linkHoverClass}
              >
                FCC Official Website
              </a>
            </span>
          </li>
        </ul>
        <div className="col-span-full lg:col-span-3 lg:order-0 lg:mt-32 lg:mb-34 lg:ml-12">
          <div className="w-full flex">
            <span>
              <FooterScramble
                text="Stay In Touch"
                play={decoded}
                delay={14 * LINK_STAGGER_MS}
                instant={reduceMotion}
              />
            </span>
            <span className="mx-22 lg:mx-16">|</span>
            <span>
              <a href="tel:+864000155158" className={linkHoverClass}>
                <FooterScramble
                  text="400 015 5158"
                  play={decoded}
                  delay={15 * LINK_STAGGER_MS}
                  instant={reduceMotion}
                />
              </a>
            </span>
          </div>
          {/*
           * Native validation: type="email" + required with no noValidate, so
           * an invalid submit is blocked by the browser (native bubble shows)
           * and onSubmit only fires — and preventDefaults — when valid.
           */}
          <form
            method="post"
            aria-label="Newsletter subscription"
            className="w-full mt-20 reveal-fade"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="b-mercury bg-blue text-mercury lg:w-[17.36vw] b-1px pl-20 flex justify-between items-center">
              <label htmlFor="newsletter-email" className="block w-full h-full flex-1">
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  placeholder="Your email..."
                  required
                  className="text-mercury placeholder:text-mercury bg-transparent text-[0.875rem] lg:text-[0.75rem] font-pp-neue tracking-[0] leading-none h-full w-full outline-none"
                />
                <span className="sr-only">Email address for newsletter subscription</span>
              </label>
              <button type="submit" aria-label="Subscribe to newsletter" className="h-55 px-15">
                <ArrowControlsIcon className="icon w-20 h-9 -mt-[0.3em] text-mercury" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </nav>
      <div className="col-span-full font-pp-neue fs-16 leading-[1.5] text-mercury mt-20 lg:hidden">
        <span>
          <a
            href="https://www.fccccc.org/"
            target="_blank"
            rel="noopener"
            className={linkHoverClass}
          >
            FCC Official Website
          </a>
        </span>
      </div>
      {/* Genuinely mono/uppercase in the original — static, never scrambles. */}
      <div className="my-text text-mercury! col-span-full mt-26 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-2 lg:self-end lg:pl-15">
        © 2025.
        <br className="lg:hidden" /> Funshine Career Consulting. All Rights Reserved. 蜀ICP备2025153008号-2
      </div>
    </footer>
  );
}
