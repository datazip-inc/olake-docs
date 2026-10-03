import React from 'react'
import Button from '../ui/Button'
import { BRANDING_HERO } from '@site/src/data/landing/branding'

/** Streak hero (rendered inside `.lakeside-hero-bg` by LakesidePage): title, intro, two jump links. */
export default function BrandingHero() {
  return (
    <section className='relative px-[32px] pb-[40px] pt-[150px] lg:px-[24px] lg:pb-[50px] lg:pt-[170px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <h1 className='olake-h1'>
          {BRANDING_HERO.title}
        </h1>
        <p className='mb-0 mt-[12px] text-[12px] leading-normal text-olake-text lg:mx-auto lg:mt-[22px] lg:max-w-[560px] lg:text-[15px] lg:leading-[1.55]'>
          {BRANDING_HERO.body}
        </p>
        <div className='mt-[24px] flex items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
          <Button href={BRANDING_HERO.primary.href} size='lg'>
            {BRANDING_HERO.primary.label}
          </Button>
          <Button href={BRANDING_HERO.secondary.href} variant='secondary' size='lg'>
            {BRANDING_HERO.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
