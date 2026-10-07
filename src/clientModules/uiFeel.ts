/**
 * Two small behaviours that need a bit of script:
 * - the colors fade for ~300ms when the theme is toggled (class `theme-fade` on <html>, see
 *   custom.css), instead of every surface snapping at once;
 * - `data-scrolled` on <html> once the page is scrolled, so the floating navbar can deepen its shadow
 *   (it reads as lifted above the content).
 * Both do nothing for visitors who prefer reduced motion.
 */

if (typeof window !== 'undefined') {
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const root = document.documentElement

  document.addEventListener(
    'click',
    (event) => {
      const toggle = (event.target as Element | null)?.closest?.('[class*="colorModeToggle"], .olake-bar-colormode')
      if (!toggle || reduce()) return
      root.classList.add('theme-fade')
      window.setTimeout(() => root.classList.remove('theme-fade'), 320)
    },
    true
  )

  let frame = 0
  const update = () => {
    frame = 0
    if (window.scrollY > 8) root.setAttribute('data-scrolled', '')
    else root.removeAttribute('data-scrolled')
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    },
    { passive: true }
  )
  update()
}
