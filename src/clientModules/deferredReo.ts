// Loads Reo.dev (reo.js) after the browser goes idle instead of during page load, the same
// way deferredGtag.ts handles GA — keeps this third-party script off the critical path so
// it doesn't push LCP/FCP back the way the un-deferred GA snippet did.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

const REO_CLIENT_ID = 'fffabce108fa8ea'
const IDLE_TIMEOUT = 3000

declare global {
  interface Window {
    Reo?: {
      init: (config: { clientID: string; enableThirdPartyTracking?: boolean }) => void
    }
  }
}

let scriptRequested = false

function loadReoScript(): void {
  if (scriptRequested) return
  scriptRequested = true
  const script = document.createElement('script')
  script.src = `https://static.reo.dev/${REO_CLIENT_ID}/reo.js`
  script.defer = true
  script.onload = () => {
    window.Reo?.init({ clientID: REO_CLIENT_ID, enableThirdPartyTracking: true })
  }
  document.head.appendChild(script)
}

function scheduleLoad(): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadReoScript, { timeout: IDLE_TIMEOUT })
    } else {
      window.setTimeout(loadReoScript, 1500)
    }
  }

  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })

  // Anyone who engages before idle fires gets the script straight away.
  const opts: AddEventListenerOptions = { once: true, passive: true }
  ;['pointerdown', 'keydown', 'touchstart'].forEach((evt) =>
    window.addEventListener(evt, loadReoScript, opts)
  )
}

if (ExecutionEnvironment.canUseDOM) {
  scheduleLoad()
}
