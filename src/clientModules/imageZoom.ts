/**
 * Click-to-zoom for images in docs, blog posts and stories (replaces the unmaintained
 * `plugin-image-zoom` package, which called medium-zoom the same way).
 *
 * - Zooms every `.markdown img`.
 * - Attaches shortly after each page render and detaches the previous instance first, so
 *   listeners do not pile up as readers navigate (the old plugin never detached).
 * - Skips hash-only navigation (same page), where nothing re-rendered.
 * - Keyboard: images outside links get tabindex and role=button (Enter or Space zooms); while zoomed
 *   a visible "Close image" button takes focus, Esc and a click on the backdrop also close, and focus
 *   goes back to the image that was zoomed.
 */

import mediumZoom, { type Zoom } from 'medium-zoom'

const SELECTOR = '.markdown img:not([data-no-zoom])'
// The scrim is a design token (tokens.css); medium-zoom writes it to the overlay's inline style.
const OPTIONS = { margin: 24, background: 'var(--olake-scrim)' }
// Images are rendered during hydration/route render; a short delay lets the new DOM settle.
const ATTACH_DELAY_MS = 300

let zoom: Zoom | null = null
let timer: ReturnType<typeof setTimeout> | null = null

let closeButton: HTMLButtonElement | null = null

function getCloseButton() {
  if (closeButton && document.body.contains(closeButton)) return closeButton
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'olake-zoom-close'
  button.hidden = true
  button.setAttribute('aria-label', 'Close image')
  button.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>'
  button.addEventListener('click', () => zoom?.close())
  // The only control while zoomed: keep Tab from leaving the overlay.
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') event.preventDefault()
  })
  document.body.appendChild(button)
  closeButton = button
  return button
}

function onKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (!target || target.tagName !== 'IMG' || target.getAttribute('role') !== 'button') return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    target.click()
  }
}

function attach() {
  zoom?.detach()
  zoom = mediumZoom(SELECTOR, OPTIONS)
  document.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
    if (img.closest('a, button')) return
    img.tabIndex = 0
    img.setAttribute('role', 'button')
  })
  zoom.on('open', () => {
    const button = getCloseButton()
    button.hidden = false
  })
  zoom.on('opened', () => {
    getCloseButton().focus({ preventScroll: true })
  })
  zoom.on('close', () => {
    getCloseButton().hidden = true
  })
  zoom.on('closed', (event) => {
    const image = event.target as HTMLElement
    if (image.tabIndex >= 0) image.focus({ preventScroll: true })
  })
}

function schedule() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(attach, ATTACH_DELAY_MS)
}

if (typeof document !== 'undefined') document.addEventListener('keydown', onKeyDown)

export function onRouteDidUpdate({
  location,
  previousLocation
}: {
  location: { pathname: string }
  previousLocation: { pathname: string } | null
}) {
  if (previousLocation && location.pathname === previousLocation.pathname) return
  schedule()
}
