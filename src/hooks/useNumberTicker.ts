import { useEffect, useState } from 'react'

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export const useNumberTicker = (
  endValue: number,
  options: { startValue?: number; duration?: number; delay?: number } = {}
) => {
  const { startValue = 0, duration = 2000, delay = 0 } = options
  const [value, setValue] = useState(startValue)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < delay) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      const timeElapsed = progress - delay
      const animationProgress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easeOutExpo(animationProgress)
      
      const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress)
      setValue(currentValue)

      if (animationProgress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [endValue, startValue, duration, delay])

  return value
}
