import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './Marquee.module.css'

interface MarqueeProps {
  children: React.ReactNode
  /** Scroll speed in CSS pixels per second. */
  speed?: number
  direction?: 'left' | 'right'
  /** Pause while the pointer is over the marquee. */
  pauseOnHover?: boolean
  /** Repeat the children until one group is at least as wide as the container (for short lists). */
  autoFill?: boolean
  /** Set to false to pause (for example while the marquee is scrolled out of view). */
  play?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * A dependency-free infinite marquee (it replaces react-fast-marquee, which does not declare
 * React 19 support). Two identical groups sit side by side and the track slides left by exactly
 * one group, so the loop is seamless. The duration is derived from the measured group width and
 * the requested speed. Motion is paused when the visitor prefers reduced motion.
 */
export default function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = false,
  autoFill = false,
  play = true,
  className,
  style
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(30)
  const [copies, setCopies] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    const group = groupRef.current
    if (!container || !group || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      const containerWidth = container.offsetWidth
      // Width of a single copy of the children; the group holds `copies` of them.
      const single = group.scrollWidth / copies
      if (!single) return
      if (autoFill) {
        const needed = Math.max(1, Math.ceil(containerWidth / single))
        if (needed !== copies) setCopies(needed)
      }
      const groupWidth = single * (autoFill ? Math.max(1, Math.ceil(containerWidth / single)) : 1)
      setDuration(Math.max(1, groupWidth / speed))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    ro.observe(group)
    return () => ro.disconnect()
  }, [autoFill, copies, speed])

  const items = Array.from({ length: copies }, (_, i) => (
    <React.Fragment key={i}>{children}</React.Fragment>
  ))

  return (
    <div
      ref={containerRef}
      className={clsx(styles.container, pauseOnHover && styles.pauseOnHover, className)}
      style={style}
    >
      <div
        className={clsx(styles.track, direction === 'right' && styles.reverse, !play && styles.paused)}
        style={{ animationDuration: `${duration}s` }}
      >
        <div ref={groupRef} className={styles.group}>
          {items}
        </div>
        <div className={styles.group} aria-hidden='true'>
          {items}
        </div>
      </div>
    </div>
  )
}
