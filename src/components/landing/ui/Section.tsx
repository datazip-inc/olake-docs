import React from 'react'
import { cn } from '@site/src/lib/utils'

/** Page-width column: 1016px max, centered. */
export function Container({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-full max-w-[1016px]', className)}>{children}</div>
}

/**
 * A page section with the Lakeside rhythm: 32px gutters and 56px of vertical space on mobile,
 * 24px gutters and 96px from lg up. `flush` drops the vertical padding for sections that
 * manage their own.
 */
export default function Section({
  id,
  className,
  flush,
  children
}: {
  id?: string
  className?: string
  flush?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn('px-[32px] lg:px-[24px]', !flush && 'py-[56px] lg:py-[96px]', className)}
    >
      <Container>{children}</Container>
    </section>
  )
}
