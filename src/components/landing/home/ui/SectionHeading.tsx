import React from 'react'
import { cn } from '@site/src/lib/utils'

/** The design's eyebrow + headline pair, used above every section. */
export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  className
}: {
  eyebrow?: string
  title: React.ReactNode
  body?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && <p className='text-[13px] text-[#8a8a8a] lg:text-[14px]'>{eyebrow}</p>}
      <h2 className='mt-[6px] text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-[#202020] lg:mt-[8px] lg:text-[38px]'>
        {title}
      </h2>
      {body && (
        <p className='mt-[12px] text-[13px] leading-[1.6] text-[#5d5d5d] lg:text-[15px]'>{body}</p>
      )}
    </div>
  )
}
