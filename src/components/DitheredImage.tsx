"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { getDitherManager, type MediaHandle } from "@/lib/ditherGL";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";
import { onLoaderComplete } from "@/lib/loaderBus";

/**
 * A photo drawn by the shared WebGL dither canvas (see lib/ditherGL.ts).
 * This component only renders an invisible placeholder rect; the pixels
 * live on the fixed full-viewport canvas behind the page, where the
 * mouse-trail and bias-noise perturbations run, exactly like the original.
 *
 * Reveal (same as the original DitherImage.vue): the plane parks dark
 * until LOADER_COMPLETE, then a once-ScrollTrigger at "top 85%" plays the
 * 2s power4.out form-up. Falls back to a static 2D-canvas dither when
 * WebGL2 is unavailable.
 */

export interface DitheredImageRef {
  showOriginal(): void;
  showDither(): void;
  /** tweenable zoom uniform, e.g. hero's 1.2 → 1 (null without WebGL) */
  zoom: { value: number } | null;
  /** tweenable dither mix, 1 = dithered / 0 = original (null without WebGL) */
  ditherAmount: { value: number } | null;
}

export interface DitheredImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** initial shader zoom (top-left anchored), default 1 */
  zoom?: number;
  /** play the scroll form-up reveal (default true, like the original) */
  revealOnScroll?: boolean;
  /** seconds to hold before the form-up plays */
  revealDelay?: number;
}

const DitheredImage = forwardRef<DitheredImageRef, DitheredImageProps>(
  function DitheredImage(
    { src, alt = "", className = "", zoom = 1, revealOnScroll = true, revealDelay = 0 },
    ref,
  ) {
    const elRef = useRef<HTMLDivElement>(null);
    const fallbackRef = useRef<HTMLCanvasElement>(null);
    const handleRef = useRef<MediaHandle | null>(null);

    useImperativeHandle(ref, () => ({
      showOriginal: () => handleRef.current?.showOriginal(),
      showDither: () => handleRef.current?.showDither(),
      get zoom() {
        return handleRef.current?.zoom ?? null;
      },
      get ditherAmount() {
        return handleRef.current?.ditherAmount ?? null;
      },
    }));

    useEffect(() => {
      const el = elRef.current;
      if (!el) return;

      const manager = getDitherManager();
      if (!manager) {
        renderFallback(fallbackRef.current, el, src);
        return;
      }

      const media = manager.register(el, src, { zoom });
      if (!media) return;
      handleRef.current = media;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let trigger: ScrollTrigger | null = null;
      let offLoader = () => {};
      if (revealOnScroll && !reduceMotion) {
        media.prepareOnEnter();
        offLoader = onLoaderComplete(() => {
          trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => {
              gsap.delayedCall(revealDelay, () => media.onEnter());
            },
            once: true,
          });
        });
      }

      return () => {
        offLoader();
        trigger?.kill();
        media.destroy();
        handleRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
      <div
        ref={elRef}
        className={`absolute inset-0 h-full w-full ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      >
        <canvas ref={fallbackRef} className="absolute inset-0 h-full w-full" />
      </div>
    );
  },
);

export default DitheredImage;

/* ------------------------------------------------- no-WebGL static fallback */

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];
const DARK = [200, 16, 24];
const LIGHT = [211, 185, 183];

function renderFallback(
  canvas: HTMLCanvasElement | null,
  parent: HTMLElement,
  src: string,
) {
  if (!canvas) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  img.decode().then(() => {
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (!w || !h) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / scale;
    const sh = h / scale;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h);
    const d = data.data;
    for (let y = 0; y < h; y++) {
      const row = BAYER_8[y % 8];
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const lum = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        const isLight = lum > (row[x % 8] + 0.5) / 64 + 0.1;
        const c = isLight ? LIGHT : DARK;
        d[i] = c[0];
        d[i + 1] = c[1];
        d[i + 2] = c[2];
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
  }).catch(() => {});
}
