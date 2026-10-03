/**
 * Images that are still loading when a page renders fade in instead of popping in. Applied by script
 * after render, and only to images that are not complete yet, so the server HTML is untouched, images
 * that are already visible never flicker, and an image that fails to load is shown anyway.
 */

const SELECTOR = '.markdown img, .ob-card__media img, .theme-doc-markdown img'
const SAFETY_MS = 4000

function reveal(img: HTMLImageElement) {
  img.classList.add('is-loaded')
}

function prepare() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
    if (img.complete || img.hasAttribute('data-fade') || img.loading !== 'lazy') return
    img.setAttribute('data-fade', '')
    img.addEventListener('load', () => reveal(img), { once: true })
    img.addEventListener('error', () => reveal(img), { once: true })
    window.setTimeout(() => reveal(img), SAFETY_MS)
  })
}

export function onRouteDidUpdate(): void {
  // the new page's DOM is committed; images rendered lazily appear shortly after
  window.requestAnimationFrame(prepare)
  window.setTimeout(prepare, 400)
}
