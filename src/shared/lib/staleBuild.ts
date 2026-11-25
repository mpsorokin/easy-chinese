// After a new version is deployed, a page still running the old one can't load its lazy
// chunks: the server and the service worker only have the new files. One reload picks up
// the new version. A time guard keeps a real outage from turning into a reload loop.
const KEY = 'hanzi:reloadedAt';
const GUARD_MS = 10_000;

const CHUNK_ERROR =
  /dynamically imported module|Importing a module script failed|Unable to preload CSS/i;

// A lazy chunk (a page's JS or CSS) failed to load.
export const isChunkLoadError = (error: unknown): boolean =>
  error instanceof Error && CHUNK_ERROR.test(error.message);

let reloading = false;

// A reload is under way: there is no point in showing an error page.
export const isReloading = () => reloading;

// Reloads the page, or opens `to` (a page being navigated to), unless it was reloaded for
// this a moment ago. True when it reloads.
export function reloadOnce(to?: string, now = Date.now()): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY));
    if (last && now - last < GUARD_MS) return false;
    sessionStorage.setItem(KEY, String(now));
  } catch {
    return false;
  }
  reloading = true;
  if (to) window.location.assign(to);
  else window.location.reload();
  return true;
}
