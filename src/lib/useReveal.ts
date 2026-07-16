"use client";

import { useEffect, useRef } from "react";

/**
 * Adds the "is-inview" class to the element when it enters the viewport.
 * Pair with the .reveal-line / .reveal-fade helpers in globals.css.
 */
export function useReveal<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T>(null);
  const { threshold = 0.2, rootMargin = "0px", once = true } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-inview");
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
