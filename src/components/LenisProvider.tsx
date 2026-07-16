"use client";

import { type ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

declare global {
  interface Window {
    /** Shared Lenis instance — read by the dither canvas and scroll effects. */
    __lenis?: Lenis;
  }
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Same wiring as the original Nuxt app: Lenis is stepped from GSAP's
    // ticker (so scrub tweens and scroll position always agree on a frame)
    // and ScrollTrigger recomputes on every smoothed scroll step.
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;
    window.dispatchEvent(new Event("lenis:ready"));
    return () => {
      gsap.ticker.remove(tick);
      if (window.__lenis === lenis) window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
