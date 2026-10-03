/**
 * A table that is wider than its column scrolls sideways, and a very tall one scrolls inside itself (see "Tables" in content-elements.css).
 * A scroll container that a keyboard cannot reach is an accessibility failure, so every table that
 * actually overflows gets tabindex=0 (arrow keys then scroll it) and an accessible name. Tables that
 * fit are left alone, so there are no pointless tab stops.
 *
 * Re-evaluated when the route changes, when the window is resized, and when a table changes size
 * (a ResizeObserver also catches a table inside a Tab that was hidden until now).
 *
 * No role="region": on a <table> it would replace the table role and strip the table semantics from
 * screen readers. The native role stays and the label names the table.
 *
 * Browser only: nothing touches `window` at module top level (the module is also evaluated during
 * the server build).
 */

const SELECTOR = '.markdown table'
const MARK = 'data-table-scroll'

let observer: ResizeObserver | null = null
let resizeBound = false
let timer: number | undefined

function labelFor(table: HTMLTableElement): string {
  const caption = table.querySelector('caption')?.textContent?.trim()
  if (caption) return caption
  // the nearest heading before the table, in document order
  let node: Element | null = table
  while (node) {
    let prev: Element | null = node.previousElementSibling
    while (prev) {
      const heading = /^H[1-6]$/.test(prev.tagName) ? prev : prev.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4')
      if (heading) {
        // the "#" anchor link and zero-width characters are not part of the title
        const text = heading.textContent?.replace(/[​#]/g, '').trim()
        if (text) return text
      }
      prev = prev.previousElementSibling
    }
    node = node.parentElement
    if (!node || node.classList.contains('markdown')) break
  }
  return 'Data table'
}

function evaluate(table: HTMLTableElement) {
  // tables also cap their height (sticky header), so a tall table scrolls vertically as well
  const overflows = table.scrollWidth > table.clientWidth + 1 || table.scrollHeight > table.clientHeight + 1
  if (overflows) {
    if (!table.hasAttribute(MARK)) {
      table.setAttribute(MARK, '')
      if (!table.hasAttribute('tabindex')) table.setAttribute('tabindex', '0')
      if (!table.hasAttribute('aria-label')) table.setAttribute('aria-label', `${labelFor(table)} (scrollable)`)
    }
  } else if (table.hasAttribute(MARK)) {
    table.removeAttribute(MARK)
    table.removeAttribute('tabindex')
    table.removeAttribute('aria-label')
  }
}

function scan() {
  if (!observer) return
  document.querySelectorAll<HTMLTableElement>(SELECTOR).forEach((table) => {
    observer!.observe(table) // observing twice is a no-op
    evaluate(table)
  })
}

function scanSoon() {
  window.clearTimeout(timer)
  timer = window.setTimeout(scan, 120)
}

function setup() {
  if (!observer && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => evaluate(entry.target as HTMLTableElement))
    })
  }
  if (!resizeBound) {
    resizeBound = true
    window.addEventListener('resize', scanSoon, { passive: true })
  }
}

export function onRouteDidUpdate(): void {
  setup()
  // the old page's tables are gone; drop their observations
  observer?.disconnect()
  window.requestAnimationFrame(scan)
  window.setTimeout(scan, 400) // tables rendered lazily (tabs, deferred content) appear shortly after
}
