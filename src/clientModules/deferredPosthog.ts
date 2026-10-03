// Loads PostHog (analytics, pageviews, feature flags) on every route after the browser goes idle
// or on the first interaction, instead of in the main bundle: the same pattern as
// deferredGtag.ts and deferredReo.ts. posthog-js ships as its own chunk via the dynamic import
// in src/lib/posthog/client.ts. Once loaded it tracks SPA navigation itself (history-change
// pageviews come with the `defaults` init option), so no onRouteDidUpdate hook is needed.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { loadPosthog } from '@site/src/lib/posthog/client'

const IDLE_TIMEOUT = 4000

function load(): void {
  loadPosthog().catch(() => {
    // Blocked by an ad blocker or offline: analytics are optional, stay silent.
  })
}

function scheduleLoad(): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(load, { timeout: IDLE_TIMEOUT })
    } else {
      window.setTimeout(load, 2000)
    }
  }

  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })

  // Anyone who engages before idle fires gets PostHog straight away.
  const opts: AddEventListenerOptions = { once: true, passive: true }
  ;['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((evt) =>
    window.addEventListener(evt, load, opts)
  )
}

if (ExecutionEnvironment.canUseDOM) {
  scheduleLoad()
}
