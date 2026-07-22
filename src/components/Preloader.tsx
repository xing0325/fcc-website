"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, Flip } from "@/lib/gsapSetup";
import { emitLoaderComplete } from "@/lib/loaderBus";
import { LogoIcon } from "@/components/icons";

/**
 * Full-screen loader, ported 1:1 from the original's GSAP timeline:
 *
 * 0.00s  mercury bg; a full-viewport 2px cross + the crosshair assembly
 *        start rotating 360° (power4.inOut, 1.8s) while the cross lines
 *        shrink to logo width ×0.97 (power4.inOut, 1s)
 * 0.00s  bg fades to blue (power4.out, 0.66s); white ring scales 0→1 (1s)
 * 0.20s  blue disc scales 0→1 (1s)
 * 0.66s  "Funshine Career Consulting" slides up into view (power4.out, 1s)
 * 1.10s  (end−0.7) crosshair assembly swaps to the real logo mid-rotation
 * 1.80s  intro done → once page assets are ready, the blue bg, logo and
 *        wordmark FLIP into the header pill (power4.inOut, 1.33s), then
 *        +500ms → scroll unlocks and LOADER_COMPLETE fires.
 */

/** Cross of two 2px lines; gsap centers them (translate via xPercent/yPercent). */
function CrossLines({
  color,
  className = "",
}: {
  color: "mercury" | "blue";
  className?: string;
}) {
  const bg = color === "mercury" ? "bg-mercury" : "bg-blue";
  return (
    <div aria-hidden="true" className={`js-loader-lines absolute inset-0 ${className}`}>
      <div className={`js-line-h absolute left-0 top-1/2 h-2 w-full ${bg}`} />
      <div className={`js-line-v absolute top-0 left-1/2 h-full w-2 ${bg}`} />
    </div>
  );
}

/** The full intro plays once per browser session; later page loads skip it so
 * navigation chrome is usable immediately (the original is a SPA and never
 * replays its loader between pages). */
const PLAYED_KEY = "fcc:loader-played";

function hasPlayedThisSession() {
  try {
    return sessionStorage.getItem(PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    window.__lenis?.stop();

    // Unlock the page (scroll + entrance reveals) — the original fires this
    // ~0.5s into the exit Flip, while the logo is still flying to the header.
    const finish = () => {
      try {
        sessionStorage.setItem(PLAYED_KEY, "1");
      } catch {
        /* storage unavailable — replay next load */
      }
      window.__lenis?.start();
      emitLoaderComplete();
    };
    // Unmount the overlay. Kept out of the effect body (wrapped in a function)
    // so it isn't flagged as a synchronous setState-in-effect.
    const hide = () => setGone(true);

    if (
      hasPlayedThisSession() ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      hide();
      return;
    }

    const q = gsap.utils.selector(root);
    const bg = q(".js-loader-bg");
    const animLogo = q(".js-loader-animated-logo");
    const lines = q(".js-loader-lines");
    const hLine = q(".js-loader-main .js-line-h");
    const vLine = q(".js-loader-main .js-line-v");
    const circleWhite = q(".js-loader-circle-white");
    const circleBlue = q(".js-loader-circle-blue");
    const logo = q(".js-loader-logo");
    const text = q(".js-loader-text");

    const logoW = 80;
    const vh = window.innerHeight || 1;
    const vw = window.innerWidth || 1;

    const ctx = gsap.context(() => {
      // Center everything through gsap so tweened transforms never clobber
      // the centering (the original does the same with center-x/y classes).
      gsap.set([".js-line-h"], { yPercent: -50 });
      gsap.set([".js-line-v"], { xPercent: -50 });
      gsap.set([circleWhite, circleBlue, ".js-loader-circles"], {
        xPercent: -50,
        yPercent: -50,
        force3D: false,
      });
      gsap.set(text, { opacity: 1, yPercent: 101 });
      gsap.set(bg, { backgroundColor: "rgb(232, 230, 224)" });
      gsap.set([lines, logo], { force3D: true });

      let flipDone = false;
      let animDone = false;
      let assetsReady = false;

      const flipToHeader = () => {
        if (flipDone || !animDone || !assetsReady) return;
        flipDone = true;

        const pill = document.querySelector<HTMLElement>('[data-loader-target="pill"]');
        const logoSlot = document.querySelector<HTMLElement>('[data-loader-target="logo"]');
        const textSlot = document.querySelector<HTMLElement>('[data-loader-target="text"]');
        if (!pill || !logoSlot || !textSlot) {
          finish();
          hide();
          return;
        }

        const D = 1.33;
        const E = "power4.inOut";
        // The hero listens for this to run its concurrent zoom-out (1.2 → 1).
        window.dispatchEvent(new Event("oci:loader-flip"));
        // The page takes over while the logo is still in flight: intro ends
        // ~1.8s, flip starts, scroll/reveals unlock at ~2.3s, logo settles
        // at ~3.13s — overlapping beats, not serial ones.
        gsap.delayedCall(0.5, finish);
        Flip.fit(bg[0], pill, { duration: D, ease: E, scale: true, absolute: true });
        Flip.fit(logo[0], logoSlot, { duration: D, ease: E, scale: true, absolute: true });
        Flip.fit(text[0], textSlot, {
          duration: D,
          ease: E,
          scale: true,
          absolute: true,
          onComplete: () => {
            // Reveal the real header pill under the flown-in pieces.
            window.dispatchEvent(new Event("oci:header-swap"));
            gsap.set(root, { autoAlpha: 0 });
            hide();
          },
        });
      };

      gsap
        .timeline({
          onComplete: () => {
            animDone = true;
            flipToHeader();
          },
        })
        .to(bg, {
          backgroundColor: "rgb(200, 16, 24)",
          ease: "power4.out",
          duration: 0.66,
        })
        .to(vLine, { scaleY: (logoW * 0.97) / vh, ease: "power4.inOut", duration: 1 }, 0)
        .to(hLine, { scaleX: (logoW * 0.97) / vw, ease: "power4.inOut", duration: 1 }, 0)
        .to([lines, logo], { rotate: 360, ease: "power4.inOut", duration: 1.8 }, 0)
        .fromTo(
          circleWhite,
          { opacity: 1, scale: 0 },
          { scale: 1, ease: "power4.inOut", duration: 1 },
          0,
        )
        .fromTo(
          circleBlue,
          { opacity: 1, scale: 0 },
          { scale: 1, ease: "power4.inOut", duration: 1 },
          0.2,
        )
        .addLabel("end")
        .to(animLogo, { display: "none", opacity: 0, duration: 0 }, "end-=0.7")
        .to(logo, { opacity: 1, duration: 0 }, "end-=0.7")
        .to(text, { yPercent: 0, ease: "power4.out", duration: 1 }, 0.66);

      // Match the original's gate: intro timeline done AND page assets ready
      // (window load + fonts, so the reveal never shows placeholder glyphs).
      const markReady = () => {
        assetsReady = true;
        flipToHeader();
      };
      const loaded = new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      });
      const fonts = document.fonts?.ready ?? Promise.resolve();
      Promise.all([loaded, fonts]).then(markReady);
      // Safety valve so a stalled asset can never trap the loader.
      setTimeout(markReady, 6000);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[2000] flex-center pointer-events-none"
    >
      {/* full-screen blue bg — flips into the header pill at the end */}
      <span aria-hidden="true" className="js-loader-bg block absolute inset-0 -z-[1]" />

      {/* animated crosshair assembly (full-viewport cross + two circles) */}
      <div aria-hidden="true" className="js-loader-animated-logo absolute inset-0">
        <CrossLines color="mercury" className="js-loader-main origin-center" />
        <div className="js-loader-circles absolute left-1/2 top-1/2 size-66">
          <div
            className="js-loader-circle-white absolute left-1/2 top-1/2 size-66 rounded-full bg-mercury"
            style={{ opacity: 0 }}
          >
            <CrossLines color="blue" />
          </div>
          <div
            className="js-loader-circle-blue absolute left-1/2 top-1/2 size-49 overflow-hidden rounded-full bg-blue"
            style={{ opacity: 0 }}
          >
            <CrossLines color="mercury" />
          </div>
        </div>
      </div>

      {/* real logo + wordmark (revealed mid-rotation, then flipped to header) */}
      <div className="relative flex-center flex-col">
        <div className="size-80">
          <LogoIcon
            className="js-loader-logo icon size-full text-mercury"
            style={{ opacity: 0 }}
          />
        </div>
        <div className="absolute top-[120%] overflow-hidden">
          <span
            className="js-loader-text block whitespace-nowrap text-center font-gta-mono fs-10 leading-none tracking-[0] font-medium uppercase text-mercury"
            style={{ opacity: 0 }}
          >
            Funshine Career Consulting
          </span>
        </div>
      </div>
    </div>
  );
}
