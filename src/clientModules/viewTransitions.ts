/**
 * Cross-fade between pages with the View Transitions API.
 *
 * Why: Docusaurus swaps the whole page in one frame. Without a transition the old page vanishes and
 * the new one appears at once (the navbar, sidebar and content all change together), which reads as
 * a jolt. The browser can instead keep a snapshot of the old page and dissolve it into the new one.
 *
 * How (no wrapper around React's state update is possible, so the click is replayed):
 * 1. A capturing click listener sees a click on an internal link, cancels it, and starts
 *    `document.startViewTransition()`. The browser snapshots the OLD page, then runs our callback.
 * 2. The callback re-dispatches the same click. This time we let it through, so Docusaurus' own
 *    router handles it: it loads the next page's code while the old page stays on screen (the
 *    snapshot is shown meanwhile), then renders the new page.
 * 3. `onRouteDidUpdate` (called before the browser paints the new page) resolves the callback's
 *    promise; the browser snapshots the NEW page and cross-fades old to new (see motion.css).
 *
 * Safeguards: skipped for reduced motion, browsers without the API (they simply swap as before),
 * modified clicks, new-tab and external links, downloads, same-page (hash/query) links; a 2s timer
 * resolves the transition if the route never changes (for example a link that does a full page load).
 */

type Loc = { pathname: string; search: string; hash: string }
type VTDocument = Document & { startViewTransition?: (cb: () => Promise<void> | void) => unknown }

const TIMEOUT_MS = 2000

let resolvePending: (() => void) | null = null
let replaying = false

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function finish() {
  if (resolvePending) {
    const resolve = resolvePending
    resolvePending = null
    resolve()
  }
}

function isPlainInternalNavigation(link: HTMLAnchorElement, event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (link.target && link.target !== '_self') return false
  if (link.hasAttribute('download')) return false
  let url: URL
  try {
    url = new URL(link.href, window.location.href)
  } catch {
    return false
  }
  if (url.origin !== window.location.origin) return false
  if (!/^https?:$/.test(url.protocol)) return false
  return url.pathname !== window.location.pathname
}

function onClick(event: MouseEvent) {
  if (replaying) return
  const doc = document as VTDocument
  if (typeof doc.startViewTransition !== 'function' || reduceMotion()) return

  const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!link || !isPlainInternalNavigation(link, event)) return

  // Cancel this click; it is replayed inside the transition callback below.
  event.preventDefault()
  event.stopImmediatePropagation()

  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        resolvePending = resolve
        window.setTimeout(finish, TIMEOUT_MS)
        replaying = true
        try {
          link.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, button: 0 })
          )
        } finally {
          replaying = false
        }
      })
  )
}

export function onRouteDidUpdate({
  location,
  previousLocation
}: {
  location: Loc
  previousLocation?: Loc | null
}): void {
  if (previousLocation && location.pathname !== previousLocation.pathname) finish()
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', onClick, true)
}
