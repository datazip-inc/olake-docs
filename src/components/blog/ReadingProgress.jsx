import React, { useEffect, useRef } from 'react'

/**
 * The 2px reading-progress bar fixed to the top of the viewport. The scroll position is written
 * straight to the DOM (no React state), so scrolling does not re-render the article.
 */
export default function ReadingProgress() {
  const fillRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className='ob-progress-bar' aria-hidden='true'>
      <div ref={fillRef} className='ob-progress-bar__fill' />
    </div>
  )
}
