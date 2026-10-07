import { useCallback, useEffect, useRef, useState } from 'react'

const TICK_MS = 100
/** 100 ticks of 100ms: each feature is on screen for ten seconds before the next one. */
const TICKS_PER_FEATURE = 100

/**
 * Drives the feature selector: once the section scrolls into view the active feature advances every
 * ten seconds and `progress` (0 to 100) fills its underline. Picking a feature by hand stops the
 * cycle for good, and it never starts for visitors who prefer reduced motion.
 */
export function useFeatureCycle(count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || manual) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) {
      setRunning(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRunning(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [manual])

  useEffect(() => {
    if (!running || manual) return
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p + 1 < TICKS_PER_FEATURE) return p + 1
        setActive((a) => (a + 1) % count)
        return 0
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [running, manual, count])

  const select = useCallback((index: number) => {
    setActive(index)
    setProgress(TICKS_PER_FEATURE)
    setManual(true)
  }, [])

  return { ref, active, progress, select, manual }
}
