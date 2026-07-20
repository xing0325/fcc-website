"use client";

import { useAnim } from "@/lib/anim";

export interface ClientLogo {
  /** wordmark line — company name rendered as uppercase type */
  name: string;
  /** optional secondary line (e.g. Chinese name) */
  sub?: string;
}

/**
 * One "logos_grid" slice from the original /clients page: a centered
 * category heading over a bordered logo-card grid (2 cols mobile / 5 lg).
 * Logos are rendered as typographic wordmarks (uppercase company names);
 * every card keeps the original's hover zoom.
 */
export default function LogosGrid({
  title,
  logos,
}: {
  title: string;
  logos: ClientLogo[];
}) {
  const headingRef = useAnim<HTMLHeadingElement>("title");
  const gridRef = useAnim<HTMLDivElement>("fadeUp", {
    target: ".js-logo-cell",
    stagger: 0.06,
  });

  return (
    <section className="px-15 mt-100 lg:mt-150">
      <section className="px-15 flex flex-col items-center">
        <h2
          ref={headingRef}
          className="text-heading text-center font-normal fs-36 lg:font-medium lg:fs-46"
        >
          {title}
        </h2>
        <div
          ref={gridRef}
          className="w-full grid grid-cols-2 gap-x-11 gap-y-10 mt-50 items-start content-start lg:grid-cols-5 lg:gap-16 lg:mt-100"
        >
          {logos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="js-logo-cell relative b-blue b-1px h-[32.77vw] flex-center px-40 group lg:h-[13.61vw] lg:px-73"
            >
              <div className="w-full text-center transition-transform duration-200 ease-in-out group-hover:scale-110">
                <div className="text-heading uppercase font-medium fs-14 leading-[1.25] tracking-[0.06em] lg:fs-18">
                  {logo.name}
                </div>
                {logo.sub && (
                  <div className="text-mono fs-10 mt-8 lg:fs-12">
                    {logo.sub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
