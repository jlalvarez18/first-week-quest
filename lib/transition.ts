import { flushSync } from "react-dom";

/**
 * Run a React state update inside a View Transition when the browser supports it and the
 * user has not asked for reduced motion. Falls back to a plain update.
 *
 * `wideOnly`: skip the transition below the lg breakpoint. Used where the small-screen
 * layout is an overlay (a bottom sheet) that a root snapshot would paint over.
 *
 * A transition can be aborted (a second one starts, the tab reloads). Those rejections
 * are expected and swallowed here so they never surface as uncaught errors.
 */
export function withViewTransition(update: () => void, opts: { wideOnly?: boolean } = {}) {
  if (typeof document === "undefined") return update();
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> };
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = !opts.wideOnly || window.matchMedia("(min-width: 1024px)").matches;
  if (!doc.startViewTransition || reduce || !wide) return update();
  const vt = doc.startViewTransition(() => flushSync(update));
  const ignore = () => {};
  vt.ready.catch(ignore);
  vt.finished.catch(ignore);
  vt.updateCallbackDone.catch(ignore);
}
