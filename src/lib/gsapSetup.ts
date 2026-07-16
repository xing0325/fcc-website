"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, ScrambleTextPlugin);

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__gsap = gsap;
}

export { gsap, ScrollTrigger, Flip, SplitText, ScrambleTextPlugin };
