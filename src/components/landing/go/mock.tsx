import React from 'react'
import { cn } from '@site/src/lib/utils'

/**
 * Shared pieces of the two product mock-ups (GoDashboardMock, GoFeatureMock). They are pictures of
 * the OLake UI, so they keep the UI's own colours and type rather than the page tokens.
 */

/** A frame's inside stroke, painted over its children the way the design draws it. Add the width and colour. */
export const STROKE =
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:content-['']"

/** An exported icon from /img/landing/go at its own size (`h` defaults to `w`). */
export function MockIcon({
  name,
  w,
  h = w,
  className
}: {
  name: string
  w: number
  h?: number
  className?: string
}) {
  return (
    <img
      src={`/img/landing/go/${name}.svg`}
      alt=''
      width={w}
      height={h}
      decoding='async'
      className={cn('block shrink-0', className)}
    />
  )
}

/** Wraps a mock drawn at `width` × `height` design px so it scales down to fit (`.go-fit` in go.css). */
export function MockFit({
  width,
  height,
  className,
  innerClassName,
  children
}: {
  width: number
  height: number
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden='true'
      className={cn('go-fit relative', className)}
      style={{ '--go-fit-w': width, '--go-fit-h': height } as React.CSSProperties}
    >
      <div className={cn('font-helvetica', innerClassName)}>{children}</div>
    </div>
  )
}
