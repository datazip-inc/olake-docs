// Client module to lazily load analytics and chat widgets without blocking LCP/INP
// Loaded automatically by Docusaurus on the client

function onFirstInteraction(callback: () => void) {
  let called = false
  const call = () => {
    if (called) return
    called = true
    callback()
  }

  const opts = { passive: true } as AddEventListenerOptions
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart']
  const onAny = () => {
    events.forEach((e) => window.removeEventListener(e, onAny as any))
    call()
  }
  events.forEach((e) => window.addEventListener(e, onAny as any, opts))

  // Absolute backstop so bots never load analytics during LH runs
  setTimeout(() => {
    if (!called && document.visibilityState === 'hidden') return
    // Do not call automatically; require actual interaction for perf
  }, 60000)
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.async = true
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

export function onRouteDidUpdate() {
  // No-op
}

export function onClientEntry() {
  onFirstInteraction(async () => {
    try {
      // Initialize GTM dataLayer (required before GTM script loads)
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).gtag = function() {
        ;(window as any).dataLayer.push(arguments)
      }
      ;(window as any).gtag('js', new Date())
      
      // Load GTM container (deferred) - GTM will handle its own config
      // Note: Keep IDs in sync with docusaurus.config.js if you re-enable inline config
      const gtmId = 'GTM-TFZ2GXJP'
      await loadScript(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`)
    } catch (e) {
      console.warn('Deferred analytics/widget load failed', e)
    }
  })
}


