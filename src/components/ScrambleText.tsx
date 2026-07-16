"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Text that decodes with a scramble effect, like the original's GSAP
 * ScrambleText usage:
 * - restMode "underscore": renders "_" until `play` (footer links)
 * - restMode "empty": renders nothing until `play` (header nav entrance)
 * While playing, characters resolve left-to-right with random uppercase
 * letters garbling the unresolved tail. Decodes once; stays decoded.
 */
export default function ScrambleText({
  text,
  play,
  restMode = "underscore",
  charInterval = 28,
  className = "",
}: {
  text: string;
  play: boolean;
  restMode?: "underscore" | "empty";
  charInterval?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(restMode === "underscore" ? "_" : "");
  const started = useRef(false);

  useEffect(() => {
    if (!play || started.current) return;
    started.current = true;
    let resolved = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (now - last >= charInterval) {
        resolved += Math.max(1, Math.floor((now - last) / charInterval));
        last = now;
      }
      if (resolved >= text.length) {
        setDisplay(text);
        return;
      }
      let out = text.slice(0, resolved);
      for (let j = resolved; j < text.length; j++) {
        const c = text[j];
        out += /\s/.test(c) ? c : CHARS[(Math.random() * CHARS.length) | 0];
      }
      setDisplay(out);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, text, charInterval]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
