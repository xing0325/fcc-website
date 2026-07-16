"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsapSetup";
import { onLoaderComplete } from "@/lib/loaderBus";

/**
 * Scroll-reveal presets ported 1:1 from the original site's v-anim directive
 * (fadeIn / fadeUp / line / lineUp / title / typeChars).
 *
 * Shared defaults from the original: ScrollTrigger `start: "top 80%"`,
 * tween `{ duration: 1, ease: "power4.out" }`. Each preset builds a paused
 * timeline; a ScrollTrigger plays it on enter, but only after the loader
 * has emitted LOADER_COMPLETE (reveals never fire under the loader).
 */

export type AnimPreset =
  | "fadeIn"
  | "fadeUp"
  | "line"
  | "lineUp"
  | "title"
  | "typeChars";

export interface AnimOptions {
  /** CSS selector: animate matching descendants instead of the node itself */
  target?: string;
  delay?: number;
  duration?: number;
  stagger?: number | gsap.StaggerVars;
  /** ScrollTrigger start viewport line, e.g. "90%" (default "80%") */
  triggerStart?: string;
  /** for `line`: "x" scales from the left edge, "y" (default) from the top */
  axis?: "x" | "y";
  disabled?: boolean;
}

const DEFAULT_TWEEN = { duration: 1, ease: "power4.out" as const };

/** SplitText masking helpers copied from the original build. */
const SPLIT_VARS = {
  mask: "lines" as const,
  autoSplit: true,
  linesClass: "line-split",
  wordDelimiter: "‍",
  prepareText: (t: string) =>
    t.length === 0 ? "‍" : t.replace(/-/g, "-‍").replace(/\s/g, "‍ ‍"),
};

async function waitForFonts() {
  if (document.fonts?.ready) await document.fonts.ready;
}

export function useAnim<T extends HTMLElement = HTMLDivElement>(
  preset: AnimPreset,
  options: AnimOptions = {},
) {
  const ref = useRef<T>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    const opts = optsRef.current;
    if (!el || opts.disabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeline: gsap.core.Timeline | null = null;
    let split: SplitText | null = null;
    let trigger: ScrollTrigger | null = null;
    let loaderDone = false;
    let entered = false;
    let cancelled = false;
    const offLoader = onLoaderComplete(() => {
      loaderDone = true;
      if (entered) timeline?.play();
    });

    const t = {
      ...DEFAULT_TWEEN,
      delay: opts.delay,
      ...(opts.duration !== undefined && { duration: opts.duration }),
    };

    const targets = (): Element[] | Element => {
      if (opts.target) {
        const found = el.querySelectorAll(opts.target);
        if (found.length) return Array.from(found);
      }
      return el;
    };

    const arm = () => {
      if (cancelled || !timeline) return;
      trigger = ScrollTrigger.create({
        trigger: el,
        start: `top ${opts.triggerStart ?? "80%"}`,
        onEnter: () => {
          entered = true;
          if (loaderDone) timeline?.play();
        },
        once: true,
      });
    };

    const build = async () => {
      switch (preset) {
        case "fadeIn": {
          timeline = gsap.timeline({ paused: true });
          timeline.from(targets(), {
            opacity: 0,
            duration: t.duration,
            ease: t.ease,
            delay: t.delay,
            stagger: opts.stagger ?? 0.1,
          });
          break;
        }
        case "fadeUp": {
          timeline = gsap.timeline({ paused: true });
          timeline.from(targets(), {
            opacity: 0,
            y: 30,
            duration: t.duration,
            ease: t.ease,
            delay: t.delay,
            stagger: opts.stagger ?? 0.1,
          });
          break;
        }
        case "line": {
          const axis = opts.axis ?? "y";
          timeline = gsap.timeline({ paused: true });
          timeline.from(targets(), {
            [axis === "x" ? "scaleX" : "scaleY"]: 0,
            transformOrigin: axis === "x" ? "left center" : "top center",
            duration: opts.duration ?? 0.6,
            ease: t.ease,
            delay: t.delay,
            stagger: opts.stagger ?? 0.1,
          });
          break;
        }
        case "lineUp": {
          el.classList.add("split-text");
          await waitForFonts();
          if (cancelled) return;
          split = SplitText.create(el, {
            type: "lines",
            ...SPLIT_VARS,
            onSplit: (self) => {
              timeline = gsap.timeline({ paused: true });
              timeline.fromTo(
                self.lines,
                { yPercent: 100, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  stagger: opts.stagger ?? 0.1,
                  duration: opts.duration ?? 0.8,
                  ease: t.ease,
                  delay: t.delay,
                },
              );
              return timeline;
            },
          });
          break;
        }
        case "title": {
          el.classList.add("split-text");
          await waitForFonts();
          if (cancelled) return;
          split = SplitText.create(el, {
            type: "lines, words, chars",
            ...SPLIT_VARS,
            onSplit: (self) => {
              timeline = gsap.timeline({ paused: true });
              timeline.fromTo(
                self.chars,
                { yPercent: 100, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  ...(opts.stagger
                    ? { stagger: opts.stagger, duration: t.duration }
                    : {
                        duration: t.duration * 0.8,
                        stagger: { amount: t.duration * 0.2 },
                      }),
                  ease: t.ease,
                  delay: t.delay,
                },
              );
              return timeline;
            },
          });
          break;
        }
        case "typeChars": {
          const node = opts.target ? el.querySelector(opts.target) ?? el : el;
          const text =
            node.firstElementChild?.textContent || node.textContent || "";
          timeline = gsap.timeline({
            paused: true,
            onComplete: () => {
              gsap.set(node, { clearProps: "all" });
            },
          });
          timeline.fromTo(
            node,
            { scrambleText: { text: "_" } },
            {
              ease: t.ease,
              delay: t.delay,
              scrambleText: { text, speed: 2, chars: "x&fcc" },
              duration: 2,
            },
            0,
          );
          break;
        }
      }
      arm();
    };

    build();

    return () => {
      cancelled = true;
      offLoader();
      trigger?.kill();
      timeline?.kill();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return ref;
}
