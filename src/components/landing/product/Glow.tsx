import React from 'react'
import { cn } from '@site/src/lib/utils'

/**
 * A soft glow drawn in CSS rather than loaded as an image: the design's blurred ellipse layer, an
 * `rx` × `ry` ellipse in `color` blurred by `blur` px (the Gaussian's standard deviation, as the
 * design's layer blur). `className` places the layer's `width` × `height` frame the way the design
 * does; the ellipse sits at its centre.
 */
export default function Glow({
  width,
  height,
  rx,
  ry,
  blur,
  color,
  className
}: {
  width: number
  height: number
  rx: number
  ry: number
  blur: number
  color: string
  className?: string
}) {
  return (
    <span
      aria-hidden='true'
      className={cn('pointer-events-none absolute block', className)}
      style={{ width, height }}
    >
      <span
        className='absolute top-1/2 left-1/2 block -translate-1/2 rounded-[50%]'
        style={{ width: rx * 2, height: ry * 2, backgroundColor: color, filter: `blur(${blur}px)` }}
      />
    </span>
  )
}
