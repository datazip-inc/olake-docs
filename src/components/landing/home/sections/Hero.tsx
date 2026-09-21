import React from 'react'
import Link from '@docusaurus/Link'
import { PiGithubLogo } from 'react-icons/pi'
import { HERO } from '@site/src/data/landing/home/hero'

/** Same outlined mark the navbar and footer use. */
const GithubMark = () => <PiGithubLogo size={17} aria-hidden='true' />

export default function Hero() {
  return (
    <section className='relative px-[32px] pb-[64px] pt-[160px] lg:px-[24px] lg:pb-[150px] lg:pt-[190px]'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        <h1 className='mx-auto max-w-[313px] text-[28px] font-normal leading-[1.28] text-[#202020] lg:max-w-[820px] lg:text-[46px] lg:leading-[1.24] lg:tracking-[-0.01em]'>
          {HERO.headline}
          <span className='text-[#7a7a7a]'>{HERO.headlineTail}</span>
        </h1>
        <p className='mt-[12px] text-[12px] leading-[1.5] text-[#393939] lg:mx-auto lg:mt-[22px] lg:max-w-[560px] lg:text-[15px] lg:leading-[1.55]'>
          {HERO.body}
        </p>
        <div className='mt-[24px] flex items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
          <Link
            to={HERO.primary.href}
            className='inline-flex h-[32px] items-center justify-center rounded-[8px] border border-solid border-[rgba(150,171,254,0.6)] bg-[#0029ce] px-[14px] text-[14px] text-[#e7e7e0] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] transition-colors transition-opacity hover:text-[#000000] hover:opacity-90 lg:h-[40px] lg:px-[20px] lg:text-[15px]'
          >
            {HERO.primary.label}
          </Link>
          <a
            href={HERO.secondary.href}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex h-[32px] items-center justify-center gap-[10px] rounded-[8px] border border-solid border-[#bfbfbf] bg-white px-[14px] text-[14px] text-[#717171] transition-colors hover:text-[#202020] lg:h-[40px] lg:px-[20px] lg:text-[15px]'
          >
            <GithubMark />
            {HERO.secondary.label}
          </a>
        </div>
      </div>
    </section>
  )
}
