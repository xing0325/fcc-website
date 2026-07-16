"use client";

/**
 * Loader lifecycle bus, mirroring the original's emitter events.
 * The page loader emits LOADER_COMPLETE once its exit Flip has landed;
 * every scroll-reveal animation arms only after that moment (the original's
 * v-anim directives wait on the same event before playing/creating their
 * ScrollTriggers).
 */

const COMPLETE_EVENT = "oci:loader-complete";

let completed = false;

export function emitLoaderComplete() {
  if (completed) return;
  completed = true;
  (window as unknown as Record<string, unknown>).__loaderCompleted = true;
  window.dispatchEvent(new Event(COMPLETE_EVENT));
}

/** Runs `cb` once the loader has finished (immediately if it already has). */
export function onLoaderComplete(cb: () => void): () => void {
  if (completed) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(COMPLETE_EVENT, handler, { once: true });
  return () => window.removeEventListener(COMPLETE_EVENT, handler);
}

export function isLoaderComplete() {
  return completed;
}
