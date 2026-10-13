import React from 'react'
import { cn } from '@site/src/lib/utils'

/**
 * Shared pieces of the product mock-ups (the hero dashboards and the feature-card editors of the
 * OLake Go and OLake Fusion pages). They are pictures of the OLake UI, so they keep the UI's own
 * colours and type rather than the page tokens.
 */

/** A frame's inside stroke, painted over its children the way the design draws it. Add the width and colour. */
export const STROKE =
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:content-['']"

/**
 * An exported icon at its own size (`h` defaults to `w`). `name` is its path under /img/landing
 * without the extension, e.g. `go/dashboard-plus` or `product/mock-sidebar-help`.
 */
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
      src={`/img/landing/${name}.webp`}
      alt=''
      width={w}
      height={h}
      decoding='async'
      className={cn('block shrink-0 object-contain', className)}
    />
  )
}

/**
 * Wraps a mock-up drawn at `width` × `height` design px so it scales down to fit (`.product-fit`).
 * `fade` fades it out between two depths in design px, as under the hero heading.
 */
export function MockFit({
  width,
  height,
  fade,
  className,
  innerClassName,
  children
}: {
  width: number
  height: number
  fade?: [number, number]
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden='true'
      className={cn('product-fit relative', className)}
      style={{ '--fit-w': width, '--fit-h': height } as React.CSSProperties}
    >
      <div
        className={cn('font-helvetica', fade && 'product-fade', innerClassName)}
        style={
          fade
            ? ({
                '--fade-from': `${fade[0]}px`,
                '--fade-to': `${fade[1]}px`
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}

/** The mock-ups' collapsed navigation rail (10.8px icons), as drawn in the feature-card editors. */
export function MockRail({
  className,
  activeIndex = 0
}: {
  className?: string
  activeIndex?: 0 | 1
}) {
  const box = 'flex w-full items-center overflow-hidden rounded-[3.241px] p-[2.161px]'
  return (
    <div
      className={cn(
        'absolute top-[-0.68px] left-[-0.68px] h-[436px] w-[40px] overflow-hidden border-0 border-r-[0.676px] border-solid border-[#eaeaea] bg-white',
        className
      )}
    >
      <div className='absolute top-[21.79px] left-[15.78px] flex w-[11.383px] flex-col items-center gap-[12.175px]'>
        <MockIcon name='product/mock-sidebar-toggle' w={10.8031} />
        <div className='flex w-[13.774px] flex-col items-center gap-[13.528px]'>
          <span
            className={cn(
              box,
              'justify-center',
              activeIndex === 0 ? 'bg-[#f5f5f5]' : 'bg-[#fffffe]'
            )}
          >
            <MockIcon name='product/mock-sidebar-jobs' w={10.8031} />
          </span>
          <span className={cn(box, activeIndex === 1 ? 'bg-[#eee]' : 'bg-white')}>
            <MockIcon name='product/mock-sidebar-sparkle' w={9.45275} />
          </span>
          <MockIcon name='product/mock-sidebar-settings' w={10.8031} />
          <MockIcon name='product/mock-sidebar-help' w={10.8031} />
        </div>
      </div>
    </div>
  )
}
