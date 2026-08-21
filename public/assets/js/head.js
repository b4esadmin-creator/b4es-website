/* Render-blocking on purpose, and deliberately tiny.
 *
 * Marks the document as JS-capable before first paint so scroll-reveal
 * elements can start hidden without a flash of fully-laid-out content.
 * If this file never runs, every reveal stays visible — the CSS hidden
 * states are all scoped under .js-ready.
 *
 * Readers who ask for reduced motion are never opted in.
 */
try {
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.className += " js-ready";
  }
} catch (e) {
  /* no matchMedia: leave everything visible */
}
