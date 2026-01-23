/**
 * Client module to mitigate anchor link misalignment in a Docusaurus SPA.
 *
 * Problem:
 * - Docusaurus performs early anchor scrolling during route transitions.
 * - Subsequent layout shifts (MDX hydration, images, fonts) can move the
 *   target element after the initial scroll, leaving the anchor misaligned.
 *
 * Approach (Pragmatic):
 * - Defer the first scroll until `window.onload` to avoid the earliest shifts.
 * - During SPA navigations, re-assert the scroll position for a short window.
 * - Immediately abort if the user interacts (wheel/touch/keys/mouse) to avoid
 *   fighting user intent.
 */

const NAVBAR_SELECTOR = '.navbar'
const DEFAULT_NAVBAR_HEIGHT = 60
const EXTRA_PADDING = 16
const SPA_NAV_DURATION = 2000

let initialLoadHandled = false
let spaTimeoutId: NodeJS.Timeout | null = null
let rafId: number | null = null
let isUserInteracting = false

function cleanupInteractionListeners() {
  window.removeEventListener('wheel', handleInteraction)
  window.removeEventListener('touchstart', handleInteraction)
  window.removeEventListener('keydown', handleInteraction)
  window.removeEventListener('mousedown', handleInteraction)
}

function handleInteraction() {
  isUserInteracting = true
  cleanupInteractionListeners()

  // Kill any pending tasks
  if (rafId) cancelAnimationFrame(rafId)
  if (spaTimeoutId) clearTimeout(spaTimeoutId)
}

function setupInteractionListeners() {
  isUserInteracting = false
  window.addEventListener('wheel', handleInteraction, { passive: true })
  window.addEventListener('touchstart', handleInteraction, { passive: true })
  window.addEventListener('keydown', handleInteraction, { passive: true })
  window.addEventListener('mousedown', handleInteraction, { passive: true })
}

function scrollToTarget() {
  if (isUserInteracting) return

  const hash = window.location.hash
  if (!hash || hash === '#') return

  try {
    const id = decodeURIComponent(hash.slice(1))
    const element = document.getElementById(id)
    if (!element) return

    const navbar = document.querySelector(NAVBAR_SELECTOR) as HTMLElement | null
    const navbarHeight = navbar?.offsetHeight ?? DEFAULT_NAVBAR_HEIGHT

    const targetTop =
      element.getBoundingClientRect().top + window.scrollY - navbarHeight - EXTRA_PADDING

    // Execute Scroll
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'instant' })
  } catch (e) {
    // ignore
  }
}

function handleWindowLoad() {
  // Check once, immediately
  if (isUserInteracting) return

  rafId = requestAnimationFrame(() => {
    scrollToTarget()
    // Double tap
    requestAnimationFrame(scrollToTarget)
  })
}

function handleSpaNavigation() {
  setupInteractionListeners()

  const start = Date.now()
  const interval = setInterval(() => {
    if (isUserInteracting || Date.now() - start > SPA_NAV_DURATION) {
      clearInterval(interval)
      cleanupInteractionListeners()
      return
    }
    scrollToTarget()
  }, 100)

  spaTimeoutId = setTimeout(() => {
    clearInterval(interval)
    cleanupInteractionListeners()
  }, SPA_NAV_DURATION)
}

export function onClientEntry(): void {
  if (window.location.hash) {
    setupInteractionListeners()

    if (document.readyState === 'complete') {
      handleWindowLoad()
    } else {
      window.addEventListener('load', handleWindowLoad)
    }
    initialLoadHandled = true
  }
}

export function onRouteDidUpdate({ location }: { location: { hash: string } }): void {
  if (location.hash) {
    handleSpaNavigation()
  }
}
