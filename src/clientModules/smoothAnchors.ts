/**
 * Smooth scrolling for in-page links (the table of contents, "Logo assets" style buttons, heading
 * links), the one place where animated scrolling helps: you see where you went. Everything else
 * keeps the browser's native scrolling (no scroll hijacking), and nothing runs for visitors who
 * ask for reduced motion.
 *
 * - Only plain `<a href="#id">` links on the current page; Docusaurus route links, modified clicks
 *   (cmd/ctrl/shift/middle button) and links to targets that do not exist are left alone.
 * - The target's `scroll-margin-top` (set for headings in custom.css and for sections) is honoured by
 *   `scrollIntoView`, so it stops below the navbar.
 * - The hash is written to the URL and the target is focused (without scrolling again) so keyboard
 *   and screen reader users land where the page scrolled.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const link = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
  if (!link) return
  const hash = link.getAttribute('href') || ''
  if (hash.length < 2) return
  if (reduceMotion()) return

  let id: string
  try {
    id = decodeURIComponent(hash.slice(1))
  } catch {
    return
  }
  const target = document.getElementById(id)
  if (!target) return

  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', onClick)
}
