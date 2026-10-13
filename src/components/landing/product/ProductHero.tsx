import React from 'react'
import Button from '../ui/Button'
import { cn } from '@site/src/lib/utils'

export interface ProductHeroCopy {
  eyebrow: string
  headline: string
  body: string
  /** The GitHub repository (opens in a new tab) and the docs. */
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

const BUTTON = 'h-[36px] px-[10px] text-[16px] leading-[1.3]'

/**
 * Hero of a product page: the page's background art, the eyebrow, headline and copy, the GitHub
 * and docs buttons, then `children` (the product shot). `className` sets the top padding from lg
 * up, which differs per design.
 */
export default function ProductHero({
  copy,
  background,
  className,
  children
}: {
  copy: ProductHeroCopy
  background: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden px-[16px] pt-[132px] pb-[72px] lg:px-[24px] lg:pb-[141px]',
        className
      )}
    >
      {background}

      <div className='mx-auto w-full max-w-[1018px]'>
        <div className='mx-auto max-w-[664px] text-center'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
            {copy.eyebrow}
          </p>
          <h1 className='mt-[10px] text-[34px] leading-[1.2] font-normal text-balance text-olake-ink sm:text-[40px] lg:mt-[12px] lg:text-[48px] lg:leading-[1.3]'>
            {copy.headline}
          </h1>
          <p className='mx-auto mt-[14px] max-w-[468px] text-[15px] leading-[1.4] text-olake-ink lg:text-[16px] lg:leading-[1.3]'>
            {copy.body}
          </p>
          <div className='mt-[32px] flex items-center justify-center gap-[16px] lg:mt-[42px]'>
            <Button
              href={copy.primary.href}
              external
              className={cn(
                BUTTON,
                'rounded-[10px] border-[rgba(150,171,254,0.6)] bg-(--product-blue) text-[#fcfcfb] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] hover:border-[rgba(150,171,254,0.6)] hover:bg-(--product-blue-hover)'
              )}
            >
              <img
                src='/img/landing/product/icon-github.webp'
                alt=''
                width={16}
                height={16}
                decoding='async'
                className='block'
              />
              {copy.primary.label}
            </Button>
            <Button
              href={copy.secondary.href}
              variant='secondary'
              className={cn(
                BUTTON,
                'border-[#d0d0d0] bg-transparent text-[#565656] hover:bg-olake-surface hover:text-olake-ink'
              )}
            >
              {copy.secondary.label}
            </Button>
          </div>
        </div>

        {children}
      </div>
    </section>
  )
}
