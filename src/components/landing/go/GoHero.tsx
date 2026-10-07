import React from 'react'
import Button from '../ui/Button'
import { GO_HERO } from '@site/src/data/landing/go/hero'

/** Hero of the OLake Go page. Its wrapper (`.lakeside-hero-bg`) lives in LakesidePage. */
export default function GoHero() {
  return (
    <section className='relative px-[32px] pb-[56px] pt-[180px] lg:px-[24px] lg:pb-[64px] lg:pt-[190px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <p className='mb-0 inline-flex items-center gap-[8px] rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[12px] py-[5px] text-[12px] tracking-wide text-olake-text-2 lg:text-[13px]'>
          {/* First image on the page and above the fold, so it is not lazy-loaded. */}
          <img
            src='/img/landing/shared/olake-mark-mono.svg'
            alt=''
            width={12}
            height={12}
            decoding='async'
            className='block h-[12px] w-[12px]'
          />
          {GO_HERO.badge}
        </p>
        <h1 className='olake-h1 mb-0 mt-[16px] lg:mx-auto lg:mt-[22px] lg:max-w-[820px]'>
          {GO_HERO.headline}
        </h1>
        <div className='mt-[24px] flex items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
          <Button href={GO_HERO.primary.href} size='lg'>
            {GO_HERO.primary.label}
          </Button>
          <Button href={GO_HERO.secondary.href} variant='secondary' size='lg'>
            {GO_HERO.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
