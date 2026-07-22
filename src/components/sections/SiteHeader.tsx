"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect on the client (seat menu state before paint), useEffect on
// the server render pass to avoid React's SSR warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { LogoIcon } from "@/components/icons";
import ScrambleText from "@/components/ScrambleText";
import { gsap } from "@/lib/gsapSetup";
import { onLoaderComplete } from "@/lib/loaderBus";

// Compliant eases (see fcc-motion-brief): power4.out for entrance/interaction,
// power4.inOut for large state changes.
const EASE_INOUT_CSS = "cubic-bezier(0.86,0,0.07,1)";

type NavLink = { href: string; label: string };

/** Delays `play` by `delay` ms so each nav link decodes on its own beat. */
function NavScramble({ text, play, delay }: { text: string; play: boolean; delay: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = window.setTimeout(() => setGo(true), delay);
    return () => window.clearTimeout(id);
  }, [play, delay]);
  return <ScrambleText text={text} play={go} restMode="empty" />;
}

const primaryLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Cases" },
  { href: "/about#mentors", label: "Mentors" },
];

const secondaryLinks: NavLink[] = [
  { href: "/clients", label: "Placements" },
  { href: "/culture-and-careers", label: "Culture" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // swapped: the preloader's Flip has landed on the pill → show the real pill.
  const [swapped, setSwapped] = useState(false);
  // entered: loader fully complete → nav links may scramble in.
  const [entered, setEntered] = useState(false);
  // The white overlay panel — driven directly by GSAP (three-beat open sequence).
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const firstRunRef = useRef(true);

  useEffect(() => {
    const onSwap = () => setSwapped(true);
    window.addEventListener("oci:header-swap", onSwap);
    const offLoader = onLoaderComplete(() => {
      setSwapped(true);
      setEntered(true);
    });
    // Fallback in case the preloader never runs (e.g. hot reload edge).
    const fallback = window.setTimeout(() => {
      setSwapped(true);
      setEntered(true);
    }, 8000);
    return () => {
      window.removeEventListener("oci:header-swap", onSwap);
      offLoader();
      window.clearTimeout(fallback);
    };
  }, []);

  // Header collapse: hide the link columns / show the MENU pill past 20px.
  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC closes the overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Scroll lock while the overlay is open (stops Lenis; the html overflow lock
  // stays as a belt-and-braces fallback for native scroll).
  useEffect(() => {
    if (!open) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [open]);

  // Three-beat menu open (OCI cadence), GSAP-driven so the panel push and the
  // link/secondary reveals share one clock. Close pushes the panel back out —
  // it does NOT reverse the link stagger (per brief: 关闭反向). Layout effect so
  // the mount seats the closed transform before first paint (no open-panel
  // flash), and GSAP alone ever writes this element's transform.
  useIsomorphicLayoutEffect(() => {
    const inner = panelInnerRef.current;
    if (!inner) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = inner.querySelectorAll<HTMLElement>(".menu-primary-line");
    const seconds = inner.querySelectorAll<HTMLElement>("[data-menu-second]");

    gsap.killTweensOf([inner, ...lines, ...seconds]);

    // First run = mount: just seat the closed state, never touch Lenis (the
    // loader/LenisProvider own the initial lock).
    if (firstRunRef.current) {
      firstRunRef.current = false;
      gsap.set(inner, { xPercent: 101 });
      gsap.set(lines, { yPercent: 100 });
      gsap.set(seconds, { y: 24, opacity: 0 });
      return;
    }

    if (open) {
      window.__lenis?.stop();
      if (reduce) {
        gsap.set(inner, { xPercent: 0 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(seconds, { y: 0, opacity: 1 });
        return;
      }
      const tl = gsap.timeline();
      // Beat 1 — panel slides in as one block, 1s power4.inOut.
      tl.fromTo(inner, { xPercent: 101 }, { xPercent: 0, duration: 1, ease: "power4.inOut" }, 0);
      // Beat 2 — primary links begin at ~0.5s, 0.3s each, stagger amount 0.2.
      tl.fromTo(
        lines,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.3, ease: "power4.out", stagger: { amount: 0.2 } },
        0.5,
      );
      // Beat 3 — secondary info (Company col + contact) drops in AFTER the links.
      tl.fromTo(
        seconds,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power4.out", stagger: 0.08 },
        1.0,
      );
    } else {
      window.__lenis?.start();
      if (reduce) {
        gsap.set(inner, { xPercent: 101 });
        return;
      }
      gsap.to(inner, {
        xPercent: 101,
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(lines, { yPercent: 100 });
          gsap.set(seconds, { y: 24, opacity: 0 });
        },
      });
    }
  }, [open]);

  const showLinks = !collapsed;
  const showPill = collapsed || open;

  // Each link line sits in its own overflow-hidden wrapper; past the scroll
  // threshold the inner element folds down to 110% line by line (40ms stagger).
  const renderLinkColumn = (links: NavLink[], colClass: string, delayOffset: number) => (
    <div
      className={`relative ${colClass} pt-15 pl-15 hidden lg:block ${
        showLinks ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="hidden bg-mercury w-1 absolute top-0 left-0 h-151 -mt-15" />
      <ul role="menu" className="absolute flex flex-col gap-y-1">
        {links.map((link, i) => (
          <li key={link.href} className="overflow-hidden" role="none">
            <span
              className={`block transition-transform ${
                showLinks ? "translate-y-0" : "translate-y-[110%]"
              }`}
              style={{
                transitionDuration: "0.5s",
                transitionTimingFunction: EASE_INOUT_CSS,
                transitionDelay: `${(delayOffset + i) * 40}ms`,
              }}
            >
              <a
                href={link.href}
                role="menuitem"
                tabIndex={showLinks ? 0 : -1}
                className="font-gta-mono uppercase fs-14 leading-[1.3] tracking-[-0.05em] text-mercury transition-opacity duration-500 hover:opacity-60"
              >
                <NavScramble text={link.label} play={entered} delay={(delayOffset + i) * 60} />
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <header className="fixed left-0 top-15 w-full px-15 z-[1000] max-h-screen pointer-events-none">
      {/* Invisible click-catcher: click outside closes the menu (no dimming, per original) */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 -z-[1] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <nav
        aria-label="Main"
        className="text-mercury grid grid-cols-[60vw_1fr] gap-y-1 gap-x-3.5 content-start lg:grid-cols-12 lg:gap-x-15"
      >
        {/* Logo pill — the preloader's blue bg / logo / wordmark Flip onto
            these data-loader-target anchors, then the real pill is revealed. */}
        <div
          data-loader-target="pill"
          className="bg-blue b-mercury b-1px lg:w-auto lg:col-span-6 lg:justify-self-start will-change-transform"
          style={{ visibility: swapped ? "visible" : "hidden" }}
        >
          <a
            aria-current="page"
            href="/"
            className="relative w-full pointer-events-auto flex items-center flex-shrink-0 py-[9.45px] pl-19 pr-30"
          >
            <span className="sr-only">Funshine Career Consulting home page</span>
            <span className="size-29 block flex-center shrink-0">
              <LogoIcon data-loader-target="logo" width={25} height={25} className="icon size-25 shrink-0 text-mercury" />
            </span>
            <span
              data-loader-target="text"
              className="block whitespace-nowrap ml-20 mr-28 font-gta-mono fs-10 leading-none tracking-[0] font-medium uppercase text-mercury"
            >
              Funshine Career Consulting
            </span>
          </a>
        </div>

        {/* Nav link columns (visible near scrollY=0 and while the menu is open) */}
        {renderLinkColumn(primaryLinks, "col-span-3", 0)}
        {renderLinkColumn(secondaryLinks, "col-span-2", primaryLinks.length)}

        {/* MENU pill + pen square */}
        <div className="pointer-events-auto flex gap-x-3.5 lg:justify-end lg:gap-x-0">
          <div className="relative overflow-hidden flex-1 lg:w-80 lg:h-48 lg:flex-none lg:flex-shrink-0">
            <div
              className={`b-1px border-transparent overflow-hidden h-full w-full transition-[translate,opacity] duration-500 ${
                showPill ? "" : "lg:translate-x-full lg:opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? "close menu" : "open menu"}
                className="group relative z-[1] text-blue font-normal h-full w-full bg-white flex-center uppercase font-gta-mono fs-10"
              >
                <span
                  className={`absolute inset-0 bg-mercury -z-[1] transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span>{open ? "Close" : "Menu"}</span>
              </button>
            </div>
          </div>
          <a
            href="/contact"
            aria-label="预约咨询"
            className="group relative z-[1] overflow-hidden flex-1 b-1px border-transparent text-blue font-normal bg-white flex-center uppercase font-gta-mono fs-10 lg:w-80 lg:h-48 lg:flex-none lg:flex-shrink-0"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-mercury -z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="lg:hidden">咨询</span>
            <span className="hidden lg:inline">预约咨询</span>
          </a>
        </div>

        {/* Menu overlay panel: inset from the edges (below the bar, 15px right/bottom,
            left at the lg column-7 line) and grows leftward from the right edge. */}
        <div
          aria-hidden={!open}
          className={`fixed top-64 right-15 bottom-15 left-15 overflow-hidden lg:left-[calc(50vw_+_7.5px)] ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            ref={panelInnerRef}
            data-lenis-prevent
            data-menu-panel
            /* Closed state is seated by GSAP in a layout effect before first
               paint (no flash). Deliberately NO transform here — an inline
               `style` gets re-applied by React on every `open` change and snaps
               the panel shut, a Tailwind `translate-x` class maps to the CSS
               `translate` property that stacks on GSAP's `transform`, and a
               percent transform in a stylesheet is one GSAP can't parse so it
               preserves it as a prefix (doubling the offset). GSAP owning the
               transform outright is the only combination that doesn't fight. */
            className="menu-panel h-full w-full overflow-y-auto overflow-x-hidden pt-50 px-24 pb-26 bg-white will-change-transform"
          >
            <ul className="text-blue flex flex-col items-start" role="menubar">
              {primaryLinks.map((link) => (
                <li key={link.href} className="overflow-hidden flex flex-col relative pr-20 pl-20 -ml-20" role="none">
                  <span className="menu-primary-line block relative will-change-transform">
                    <a
                      href={link.href}
                      role="menuitem"
                      tabIndex={open ? 0 : -1}
                      className="group relative block text-blue font-pp-neue font-normal text-[2.25rem] leading-[1.2] tracking-[0] lg:text-[2.875rem] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:opacity-50 hover:translate-x-12"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -left-18 -translate-y-1/2 -translate-x-6 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        ·
                      </span>
                      {link.label}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
            <hr data-menu-second className="mt-74 b-blue lg:mt-160" />
            <section data-menu-second className="mt-30 lg:flex lg:mt-15">
              <div className="lg:w-full">
                <h2 className="font-gta-mono font-normal uppercase text-blue tracking-[0] fs-12 leading-[1.33]">Company</h2>
              </div>
              <ul className="text-blue mt-30 lg:mt-0 lg:w-full" role="menubar">
                {secondaryLinks.map((link) => (
                  <li key={link.href} className="overflow-hidden flex flex-col" role="none">
                    <a
                      href={link.href}
                      role="menuitem"
                      tabIndex={open ? 0 : -1}
                      className="font-pp-neue font-normal fs-16 leading-[1.3] text-blue transition-opacity duration-500 hover:opacity-60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <hr data-menu-second className="mt-50 b-blue lg:mt-38" />
            <section data-menu-second className="mt-30 lg:flex lg:mt-15">
              <div className="lg:w-1/2">
                <h2 className="font-gta-mono font-normal uppercase text-blue tracking-[0] fs-12 leading-[1.33] mb-30">Stay in touch</h2>
              </div>
              <div className="flex flex-col items-start lg:w-1/2">
                <div className="overflow-hidden">
                  <a
                    href="tel:+864000155158"
                    tabIndex={open ? 0 : -1}
                    aria-label="Call us at 400 015 5158"
                    className="font-pp-neue font-normal fs-16 leading-[1.4] text-blue border-b-1px b-blue pb-4"
                  >
                    400 015 5158
                  </a>
                </div>
                <div className="overflow-hidden">
                  <a
                    href="mailto:hello@fccccc.org"
                    tabIndex={open ? 0 : -1}
                    aria-label="Email us at hello@fccccc.org"
                    className="font-pp-neue font-normal fs-16 leading-[1.4] text-blue border-b-1px b-blue pb-4 mt-10"
                  >
                    hello@fccccc.org
                  </a>
                </div>
                <div className="overflow-hidden mt-30">
                  <address className="font-pp-neue font-normal fs-16 leading-[1.4] text-blue not-italic">
                    <p>
                      成都市国际金融中心 IFS 二号办公楼 2801
                      <br />
                      30 Raffles Pl, Singapore 048622
                    </p>
                  </address>
                </div>
              </div>
            </section>
          </div>
        </div>
      </nav>
    </header>
  );
}
