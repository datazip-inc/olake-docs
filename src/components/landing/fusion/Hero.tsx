import React from 'react'
import Button from '../ui/Button'
import { HERO } from '@site/src/data/landing/fusion/hero'

/** First section of the page. It sits inside `.lakeside-hero-bg`, so it must stay a direct `<section>`. */
export default function Hero({ headline }: { headline: string }) {
  return (
    <section className='relative px-[32px] pb-[64px] pt-[180px] lg:px-[24px] lg:pb-[120px] lg:pt-[190px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <p className='inline-flex h-[28px] items-center gap-[8px] rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[12px] text-[12px] text-olake-text lg:h-[30px] lg:text-[13px]'>
          <img
            src='/img/landing/shared/olake-mark-mono.svg'
            alt=''
            width={12}
            height={12}
            decoding='async'
            className='block h-[12px] w-[12px]'
          />
          {HERO.eyebrow}
        </p>
        <h1 className='olake-h1 mt-[16px] lg:mx-auto lg:mt-[22px] lg:max-w-[820px]'>
          {headline}
        </h1>
        <div className='mt-[24px] flex items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
          <Button href={HERO.primary.href} size='lg'>
            {HERO.primary.label}
          </Button>
          <Button href={HERO.secondary.href} variant='secondary' size='lg'>
            {HERO.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
