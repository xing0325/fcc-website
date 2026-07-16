import type { ReactNode } from "react";
import { ArrowIcon } from "./icons";

/**
 * `[ LABEL → ]` mono link that reproduces the original's arrow-swap hover:
 * at rest the arrow sits to the RIGHT of the label; on hover the label slides
 * right while a left arrow slides in and the right arrow slides out (clipped).
 * The 25px shift = arrow width (14) + gap (11).
 */
export default function FlipArrowLink({
  label,
  href = "#",
  className = "",
}: {
  label: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-baseline whitespace-nowrap font-gta-mono uppercase text-blue ${className}`}
    >
      [
      <span className="relative inline-block overflow-hidden mx-10 align-baseline">
        <ArrowIcon
          aria-hidden
          className="icon absolute left-0 top-1/2 -translate-y-1/2 w-14 h-8 [translate:-26px_0] group-hover:[translate:0_0] transition-[translate] duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
        />
        <span className="inline-flex items-baseline transition-transform duration-[0.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-25">
          <span>{label}</span>
          <ArrowIcon
            aria-hidden
            className="icon w-14 h-8 ml-11 self-center shrink-0"
          />
        </span>
      </span>
      ]
    </a>
  );
}
