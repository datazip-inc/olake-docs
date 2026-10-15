import React from 'react'
import Button from '../ui/Button'
import { cn } from '@site/src/lib/utils'

const BUTTON = 'h-[36px] rounded-[8px] px-[10px] text-[16px] leading-[1.3]'

/**
 * Closing call to action of a product page: a dark-blue card with the page's art rising behind the
 * two buttons. `className` sets the card's background colour.
 */
export default function ProductCta({
  eyebrow,
  title,
  primary,
  secondary,
  art,
  className
}: {
  eyebrow: string
  title: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  art: React.ReactNode
  className?: string
}) {
  return (
    <section className='px-[16px] py-[48px] lg:px-[24px] lg:py-[96px]'>
      <div
        className={cn(
          'relative isolate mx-auto max-w-[1018px] overflow-hidden rounded-[28px] px-[20px] pt-[48px] pb-[200px] text-center lg:rounded-[36px] lg:pt-[64px] lg:pb-[274px]',
          className
        )}
      >
        {art}
        <p className='text-[15px] leading-[1.3] text-[#fefefd] lg:text-[16px]'>{eyebrow}</p>
        <h2 className='mt-[6px] text-[28px] leading-[1.3] font-normal text-balance text-white lg:text-[40px]'>
          {title}
        </h2>
        <div className='mt-[24px] flex flex-wrap items-center justify-center gap-[16px] lg:mt-[29px]'>
          <Button
            href={primary.href}
            variant='secondary'
            className={`${BUTTON} border-[#d0d0d0] bg-[#fcfcfb] text-(--product-blue-deep) hover:bg-olake-surface hover:text-(--product-blue)`}
          >
            {primary.label}
          </Button>
          <Button
            href={secondary.href}
            className={`${BUTTON} border-[#315ef2] bg-(--product-blue-deep) text-[#fdfdfd] shadow-none hover:border-[#5b7ff5] hover:bg-(--product-blue-deep) hover:text-white`}
          >
            {secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
