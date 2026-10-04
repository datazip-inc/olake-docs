import { useEffect } from 'react'

/**
 * A gentle entrance for the sections of a marketing page: sections that start below the fold fade
 * in and rise 12px as they scroll into view (about 300ms). It never changes scrolling itself.
 *
 * - Runs after hydration, so the server HTML is complete and visible; only sections that are
 *   off-screen at that moment get the hidden start state (`lk-reveal`), so nothing flickers.
 * - Skipped for visitors who prefer reduced motion and when IntersectionObserver is missing.
 * - Opacity and transform only: no layout shift.
 */
export default function useRevealOnScroll(rootSelector = '.lakeside-page') {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const root = document.querySelector(rootSelector)
    if (!root) return undefined
    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > section, :scope > div > section, :scope > .lakeside-benchmark-suite, :scope > main > section, :scope > main > div > section, :scope > main > .lakeside-benchmark-suite, :scope > main > div > div > section, :scope > main > div > .lakeside-benchmark-suite'))
      .filter((el) => !el.closest('.lakeside-hero-bg') && !el.closest('footer'))
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight)

    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('lk-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    sections.forEach((el) => {
      el.classList.add('lk-reveal')
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
      sections.forEach((el) => el.classList.remove('lk-reveal', 'lk-in'))
    }
  }, [rootSelector])
}
