// Loads GA after the browser goes idle instead of during page load, keeping 166KB of
// third-party JS off the critical path. dataLayer is initialised immediately, so hits
// fired before the script arrives are queued and flushed on load — nothing is lost.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

const GA_ID = 'G-GTNTGHDNZW'
const IDLE_TIMEOUT = 3000

// `gtag` is already declared on Window in global.d.ts; only dataLayer is missing.
declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

type RouteLocation = { pathname: string; search: string; hash: string }

let scriptRequested = false

function initDataLayer(): void {
  if (typeof window.gtag === 'function') return
  window.dataLayer = window.dataLayer || []
  // gtag.js expects the raw `arguments` object here, not an array — this is the shape
  // Google's own snippet pushes, and the one verified to produce hits.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

function loadGtagScript(): void {
  if (scriptRequested) return
  scriptRequested = true
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

function scheduleLoad(): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadGtagScript, { timeout: IDLE_TIMEOUT })
    } else {
      window.setTimeout(loadGtagScript, 1500)
    }
  }

  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })

  // Anyone who engages before idle fires gets the script straight away.
  const opts: AddEventListenerOptions = { once: true, passive: true }
  ;['pointerdown', 'keydown', 'touchstart'].forEach((evt) =>
    window.addEventListener(evt, loadGtagScript, opts)
  )
}

if (ExecutionEnvironment.canUseDOM) {
  initDataLayer()
  scheduleLoad()
}

// Docusaurus is a SPA, so only the first page view is automatic; the rest are sent here.
export function onRouteDidUpdate({
  location,
  previousLocation
}: {
  location: RouteLocation
  previousLocation: RouteLocation | null
}): void {
  if (!previousLocation || previousLocation.pathname === location.pathname) return
  window.gtag?.('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: location.pathname + location.search + location.hash
  })
}
