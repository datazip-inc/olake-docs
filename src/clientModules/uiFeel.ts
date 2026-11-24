/**
 * Two small behaviours that need a bit of script:
 * - transitions are off for the frame the theme changes in (class `theme-switching` on <html>, see
 *   motion.css), so every surface swaps at once instead of fading component by component (the fade
 *   on the toggle is a view transition, src/theme/ColorModeToggle);
 * - `data-scrolled` on <html> once the page is scrolled, so the floating navbar can deepen its shadow
 *   (it reads as lifted above the content).
 */

if (typeof window !== 'undefined') {
  const root = document.documentElement

  // The observer runs before the browser restyles, so the class lands in the same style change as the
  // new theme. It comes off two frames later, once the new theme has been painted.
  let switching = 0
  new MutationObserver(() => {
    root.classList.add('theme-switching')
    window.cancelAnimationFrame(switching)
    switching = window.requestAnimationFrame(() => {
      switching = window.requestAnimationFrame(() => root.classList.remove('theme-switching'))
    })
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] })

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
