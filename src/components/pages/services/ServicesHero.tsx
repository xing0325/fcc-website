"use client";

import ArchiveImage from "@/components/ArchiveImage";
import { useAnim } from "@/lib/anim";

/**
 * Services hero — full-viewport dithered brand photo with the oversized
 * two-line "Our Services / Every Step With You" title (mercury, per-char
 * `title` reveals like the home hero).
 *
 * `.page-title` is inlined here (from the original entry CSS) because it is
 * not part of the shared globals: PP Neue 500, 3.25rem/1 mobile,
 * 10rem/0.9375 at lg.
 */

const heroCss = `
.svc-hero .page-title {
  font-family: var(--font-pp-neue);
  font-weight: 500;
  letter-spacing: 0;
  font-size: 3.25rem;
  line-height: 1;
}
@media (min-width: 1024px) {
  .svc-hero .page-title {
    font-size: 10rem;
    line-height: 0.9375;
  }
}
`;

export default function ServicesHero() {
  const line1Ref = useAnim<HTMLDivElement>("title", {
    delay: 0.333,
    triggerStart: "100%",
  });
  const line2Ref = useAnim<HTMLDivElement>("title", {
    delay: 0.4,
    triggerStart: "100%",
  });

  return (
    <section className="svc-hero px-15 my-grid content-end pb-235 relative min-h-svh lg:content-end lg:pb-42">
      <style>{heroCss}</style>
      <div className="overflow-hidden absolute inset-0">
        <ArchiveImage
          src="/images/fcc-10.jpg"
          alt=""
          variant="archive"
          hover={false}
          eager
        />
      </div>
      <h1 className="sr-only">Our Services — 六阶段全流程陪伴式辅导</h1>
      <div
        ref={line1Ref}
        aria-hidden="true"
        className="relative col-start-3 col-span-4 text-mercury page-title text-right lg:col-start-6 lg:col-end-[-1] lg:mt-212"
        role="text"
      >
        Our Services
      </div>
      <div
        ref={line2Ref}
        aria-hidden="true"
        className="relative col-span-5 mt-90 text-mercury page-title lg:col-span-8 lg:mt-40"
        role="text"
      >
        Every Step With You
      </div>
    </section>
  );
}
