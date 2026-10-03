import React from 'react'
import Button from '../../ui/Button'
import { PiGithubLogo } from 'react-icons/pi'
import { HERO } from '@site/src/data/landing/home/hero'
/** Same outlined mark the navbar and footer use. */
const GithubMark = () => <PiGithubLogo size={17} aria-hidden='true' />
export default function Hero() {
  return (
    <section className='relative px-[32px] pb-[64px] pt-[180px] lg:px-[24px] lg:pb-[150px] lg:pt-[190px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <h1 className='olake-h1 lg:mx-auto lg:max-w-[820px]'>
          {HERO.headline}
          <span className='block text-olake-muted lg:inline'>{HERO.headlineTail}</span>
        </h1>
        <p className='mt-[12px] text-[12px] leading-normal text-olake-text lg:mx-auto lg:mt-[22px] lg:max-w-[560px] lg:text-[15px] lg:leading-[1.55]'>
          {HERO.body}
        </p>
        <div className='mt-[24px] flex items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
          <Button href={HERO.primary.href} size='lg'>
            {HERO.primary.label}
          </Button>
          <Button href={HERO.secondary.href} variant='secondary' size='lg' external>
            <GithubMark />
            {HERO.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}