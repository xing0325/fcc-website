"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";
import { onLoaderComplete, isLoaderComplete } from "@/lib/loaderBus";

/**
 * ArchiveImage — the replacement for the old WebGL dither canvas. Instead of
 * remapping every pixel to a two-tone dot screen (which moiré'd and flickered
 * on scroll/zoom), it shows the real photograph with a restrained, editorial
 * "archive" grade and reveals/hovers it via CSS transforms only. No continuous
 * shader, no per-frame noise.
 *
 * Three region variants (see the site's art-direction table):
 *  - "archive" (default) — cool desaturated grade that restores to full colour
 *    on hover; for the hero and any people photography.
 *  - "film" — real photo under a thin FCC-red film (rgba(200,16,24,0.1)); the
 *    film slides off diagonally on hover / when its `active` flips true, and
 *    slowly covers back. For the Services thumbnails.
 *  - "plain" — true colour, no grade; a crop (clip-path inset) opens on hover
 *    with a slight zoom. For environmental / office photography.
 *
 * Motion: scroll-in is a one-shot clip-path wipe + 1.035→1 scale (never a
 * continuous effect); hover grades are 0.55–0.7s power4.out in, 0.8s
 * power4.inOut out. All gated to respect prefers-reduced-motion. On touch the
 * grade eases partway back as the image nears viewport centre — no
 * finger-tracking effects.
 *
 * Fill semantics match the old DitheredImage: absolutely fills its nearest
 * positioned, overflow-hidden ancestor.
 */

export type ArchiveVariant = "archive" | "film" | "plain";

export interface ArchiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  variant?: ArchiveVariant;
  /** enable the hover colour-restore / crop-open (default true; ignored for hero) */
  hover?: boolean;
  /** play the scroll-in clip-path reveal (default true) */
  reveal?: boolean;
  /** hero only: 1.2→1 zoom synced to the loader Flip; suppresses scroll reveal */
  loaderZoom?: boolean;
  /** "film" only: when true the red film is slid off (parent-controlled, e.g. active accordion) */
  active?: boolean;
  /** object-position for the <img> (e.g. "50% 30%") */
  objectPosition?: string;
  /** prioritise loading (above-the-fold hero) */
  eager?: boolean;
}

// Static paper grain — a single inline SVG turbulence tile, no animation.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// Grade at rest vs. fully restored, expressed as a single 0→1 `--g` (grade).
// g=1: grayscale .55 / saturate .75 / contrast .96 + cool overlay .10
// g=0: original colour, overlay 0. Driven by GSAP on hover / touch-centre.
const gradeCss = `
.archive-img {
  filter:
    grayscale(calc(var(--g) * 0.55))
    saturate(calc(1 - var(--g) * 0.25))
    contrast(calc(1 - var(--g) * 0.04));
  transition: none;
}
.archive-overlay {
  background: rgb(38 51 61);           /* cool blue-grey */
  opacity: calc(var(--g) * 0.10);
}
.archive-grain {
  background-image: ${GRAIN};
  background-size: 140px 140px;
  opacity: 0.03;                        /* static 3% paper grain */
  mix-blend-mode: multiply;
}
.film-overlay { background: rgba(200, 16, 24, 0.1); }
@media (prefers-reduced-motion: reduce) {
  .archive-reveal { clip-path: none !important; transform: none !important; opacity: 1 !important; }
}
`;

export default function ArchiveImage({
  src,
  alt = "",
  className = "",
  variant = "archive",
  hover = true,
  reveal = true,
  loaderZoom = false,
  active = false,
  objectPosition,
  eager = false,
}: ArchiveImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<{ g: number }>({ g: variant === "archive" ? 1 : 0 });

  // ---- scroll-in reveal + loader zoom -------------------------------------
  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hero: slow 1.2→1 zoom synced to the loader's exit Flip (no scroll reveal).
    if (loaderZoom) {
      gsap.set(img, { scale: 1.2, transformOrigin: "50% 50%" });
      if (reduce || isLoaderComplete()) {
        gsap.set(img, { scale: 1 });
        return;
      }
      const onFlip = () =>
        gsap.to(img, { scale: 1, duration: 1.33, ease: "power4.inOut" });
      window.addEventListener("oci:loader-flip", onFlip);
      return () => window.removeEventListener("oci:loader-flip", onFlip);
    }

    if (!reveal || reduce) return;

    // One-shot wipe: clip from left, settle a 1.035 scale, lift opacity.
    gsap.set(wrap, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(img, { scale: 1.035, opacity: 0.75 });
    let trigger: ScrollTrigger | null = null;
    const off = onLoaderComplete(() => {
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(wrap, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.out" });
          gsap.to(img, { scale: 1, opacity: 1, duration: 1, ease: "power4.out" });
        },
      });
    });
    return () => {
      off();
      trigger?.kill();
    };
  }, [loaderZoom, reveal, src]);

  // ---- hover / touch-centre grade + film slide ----------------------------
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grade = gradeRef.current;

    const setG = (v: number) => {
      grade.g = v;
      wrap.style.setProperty("--g", String(v));
    };
    setG(grade.g);

    // Touch / no-hover: no finger tracking — ease the grade partway back when
    // the image is near viewport centre, all the way when reduced-motion.
    if (window.matchMedia("(hover: none)").matches) {
      if (variant !== "archive") return;
      const io = new IntersectionObserver(
        ([e]) => {
          const target = e.isIntersecting ? 0.35 : 1; // partial restore
          if (reduce) setG(target);
          else gsap.to(grade, { g: target, duration: 0.6, ease: "power4.out", onUpdate: () => setG(grade.g) });
        },
        { rootMargin: "-35% 0px -35% 0px" }, // fires when centred
      );
      io.observe(wrap);
      return () => io.disconnect();
    }
    return;
  }, [variant]);

  // Desktop hover handlers (archive/plain colour restore; film slide handled by CSS via data-active)
  const onEnter = () => {
    if (!hover || variant === "film") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grade = gradeRef.current;
    gsap.to(grade, { g: 0, duration: 0.6, ease: "power4.out", onUpdate: () => wrapRef.current?.style.setProperty("--g", String(grade.g)) });
    if (imgRef.current) gsap.to(imgRef.current, { scale: variant === "plain" ? 1 : 1.015, duration: 0.6, ease: "power4.out" });
  };
  const onLeave = () => {
    if (!hover || variant === "film") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grade = gradeRef.current;
    const rest = variant === "archive" ? 1 : 0;
    gsap.to(grade, { g: rest, duration: 0.8, ease: "power4.inOut", onUpdate: () => wrapRef.current?.style.setProperty("--g", String(grade.g)) });
    if (imgRef.current) gsap.to(imgRef.current, { scale: variant === "plain" ? 1.05 : 1, duration: 0.8, ease: "power4.inOut" });
  };

  const restG = variant === "archive" ? 1 : 0;

  return (
    <div
      ref={wrapRef}
      className={`archive-reveal absolute inset-0 h-full w-full overflow-hidden ${className}`}
      style={{ ["--g" as string]: String(restG) }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      <style>{gradeCss}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="archive-img absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition,
          // plain starts slightly cropped-in; hover opens it
          clipPath: variant === "plain" ? "inset(8% 6%)" : undefined,
          transform: variant === "plain" ? "scale(1.05)" : undefined,
        }}
      />
      {/* cool overlay + grain (archive/plain) */}
      {variant !== "film" && (
        <>
          <div className="archive-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="archive-grain pointer-events-none absolute inset-0" aria-hidden="true" />
        </>
      )}
      {/* red film that slides off diagonally (film variant) */}
      {variant === "film" && (
        <div
          ref={filmRef}
          className="film-overlay pointer-events-none absolute inset-0 transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.86,0,0.07,1)]"
          aria-hidden="true"
          style={{
            clipPath: active ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      )}
    </div>
  );
}
