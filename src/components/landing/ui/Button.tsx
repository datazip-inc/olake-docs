import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

export const BUTTON_BASE =
  'lk-press inline-flex items-center justify-center gap-[10px] rounded-[8px] border border-solid transition-all'

export const BUTTON_VARIANT: Record<Variant, string> = {
  primary:
    'border-olake-blue-ring bg-olake-blue text-olake-on-blue shadow-[var(--olake-shadow-btn)] hover:border-olake-blue-hover hover:bg-olake-blue-hover hover:text-white',
  secondary:
    'border-olake-btn-border bg-olake-surface text-olake-btn-secondary transition-colors hover:bg-olake-surface-alt hover:text-olake-ink'
}

/** `sm` is the navbar CTA, `md` the in-page button, `lg` the hero button (40px tall at every width, a comfortable tap target). */
export const BUTTON_SIZE: Record<Size, string> = {
  sm: 'h-[34px] px-[14px] text-[13px] font-medium',
  md: 'h-[38px] px-[18px] text-[14px]',
  lg: 'h-[40px] px-[18px] text-[14px] lg:px-[20px] lg:text-[15px]'
}

export interface ButtonProps {
  href: string
  variant?: Variant
  size?: Size
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean
  className?: string
  children: React.ReactNode
}

/** The Lakeside button: brand-blue primary and outlined secondary, rendered as a link. */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  external,
  className,
  children
}: ButtonProps) {
  const cls = cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)
  if (href.startsWith('#')) {
    // In-page anchor: a plain link, so Docusaurus' router does not treat it as a navigation.
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return external ? (
    <a href={href} target='_blank' rel='noopener noreferrer' className={cls}>
      {children}
    </a>
  ) : (
    <Link to={href} className={cls}>
      {children}
    </Link>
  )
}
