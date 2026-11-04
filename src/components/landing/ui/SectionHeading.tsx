import React from 'react'
import { cn } from '@site/src/lib/utils'

/** The design's eyebrow + headline pair, used above every section. */
export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  as: Tag = 'h2',
  className
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: React.ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className='text-[15px] font-medium tracking-wide text-olake-muted lg:text-[16px]'>
          {eyebrow}
        </p>
      )}
      <Tag className='mt-[6px] text-balance text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-olake-ink lg:mt-[8px] lg:text-[38px]'>
        {title}
      </Tag>
      {body && (
        <p className='mt-[12px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>{body}</p>
      )}
    </div>
  )
}
