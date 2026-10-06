import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import Card from '@site/src/components/landing/ui/Card'
import { BUTTON_BASE, BUTTON_SIZE, BUTTON_VARIANT } from '@site/src/components/landing/ui/Button'

/** Small outlined label (size, difficulty, tech, status). */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[10px] py-[3px] text-[12px] leading-[1.4] text-olake-text-2',
        className
      )}
    >
      {children}
    </span>
  )
}

/** A real <button> with the Lakeside button look (the shared Button is link-only). */
export function ActionButton({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type='button'
      {...props}
      className={cn(
        BUTTON_BASE,
        BUTTON_VARIANT[variant],
        BUTTON_SIZE.lg,
        'cursor-pointer font-[inherit]',
        className
      )}
    />
  )
}

/** Outlined tile that is one link: title, optional description, optional leading icon. */
export function LinkCard({
  href,
  external,
  icon,
  title,
  children,
  className
}: {
  href: string
  external?: boolean
  icon?: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const cls = cn(
    'flex items-start gap-[14px] rounded-[16px] border border-solid border-olake-line bg-olake-surface p-[20px] transition-colors hover:border-olake-line-strong lg:p-[24px]',
    className
  )
  const body = (
    <>
      {icon && <span className='mt-[2px] shrink-0 text-[22px] text-olake-ink'>{icon}</span>}
      <span className='block min-w-0'>
        <span className='block text-[16px] leading-[1.35] font-medium text-olake-ink'>{title}</span>
        {children && (
          <span className='mt-[6px] block text-[14px] leading-[1.55] text-olake-text-2'>
            {children}
          </span>
        )}
      </span>
    </>
  )
  return external ? (
    <a href={href} target='_blank' rel='noopener noreferrer' className={cls}>
      {body}
    </a>
  ) : (
    <Link to={href} className={cls}>
      {body}
    </Link>
  )
}

/** Row of headline numbers inside one outlined card, divided by hairlines. */
export function StatBand({ items }: { items: { value: React.ReactNode; label: string }[] }) {
  return (
    <Card
      as='div'
      className={cn(
        'grid grid-cols-2 gap-px bg-olake-line',
        items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            'bg-olake-surface px-[20px] py-[24px] text-center lg:py-[32px]',
            // an odd last item spans both mobile columns so no grey cell shows
            items.length % 2 === 1 && i === items.length - 1 && 'col-span-2 lg:col-span-1'
          )}
        >
          <p className='text-[28px] leading-[1.1] font-normal tracking-[-0.01em] text-olake-ink lg:text-[38px]'>
            {item.value}
          </p>
          <p className='mt-[8px] text-[13px] text-olake-muted lg:text-[14px]'>{item.label}</p>
        </div>
      ))}
    </Card>
  )
}

/** Small tick used in lists. */
export const Tick = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 14 14'
    fill='none'
    aria-hidden='true'
    className='mt-[4px] shrink-0 text-olake-ink'
  >
    <path
      d='M2.5 7.5l3 3 6-6.5'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

/** Text-sized heading used inside cards and article sections. */
export function SubHeading({
  as: Tag = 'h3',
  children,
  className
}: {
  as?: 'h2' | 'h3' | 'h4'
  children: React.ReactNode
  className?: string
}) {
  return (
    <Tag
      className={cn(
        'text-[18px] leading-[1.3] font-normal text-olake-ink lg:text-[22px]',
        className
      )}
    >
      {children}
    </Tag>
  )
}

/** Plain bulleted list with the page's body type. */
export function BulletList({
  children,
  className,
  small
}: {
  children: React.ReactNode
  className?: string
  small?: boolean
}) {
  return (
    <ul
      className={cn(
        'ml-[20px] list-disc leading-[1.65] text-olake-text-2 marker:text-olake-muted [&>li]:list-disc [&>li+li]:mt-[8px]',
        small ? 'text-[14px]' : 'text-[14px] lg:text-[15px]',
        className
      )}
    >
      {children}
    </ul>
  )
}

/** Quiet callout box (replaces the amber and blue notices). */
export function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt px-[18px] py-[14px] text-[14px] leading-[1.6] text-olake-text-2',
        className
      )}
    >
      {children}
    </p>
  )
}

/** Centered content column under a section heading. */
export function Column({
  children,
  className,
  width = 760
}: {
  children: React.ReactNode
  className?: string
  width?: number
}) {
  return (
    <div
      className={cn('mx-auto mt-[28px] w-full lg:mt-[40px]', className)}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  )
}
