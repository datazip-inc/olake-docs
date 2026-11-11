import React, { useEffect, useRef, useState } from 'react'
import Button from '../../ui/Button'
import { PiCheckLight, PiCopyLight, PiGithubLogo } from 'react-icons/pi'
import { HERO } from '@site/src/data/landing/home/hero'
import { copyText } from '@site/src/lib/utils'
/** Same outlined mark the navbar and footer use. */
const GithubMark = () => <PiGithubLogo size={17} aria-hidden='true' />

/** The install command in a box with a copy button, set in the design's blue and lavender glow. */
function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    if (!(await copyText(HERO.installCommand))) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  const Icon = copied ? PiCheckLight : PiCopyLight
  return (
    <div className='relative isolate mt-[24px] w-full max-w-[522px] lg:mx-auto lg:mt-[37px]'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute -top-[12px] right-0 left-[40%] -z-10 h-[51px] bg-linear-to-r from-transparent to-(--olake-glow-blue) blur-[7px]'
      />
      <span
        aria-hidden='true'
        className='pointer-events-none absolute right-[45%] -bottom-[10px] -left-[5px] -z-10 h-[40px] rounded-full bg-linear-to-l from-transparent to-(--olake-glow-lavender) blur-[8px]'
      />
      <div className='flex h-[40px] items-center justify-between gap-[6px] rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface-alt pr-[8px] pl-[8px] shadow-[var(--olake-shadow-command)] sm:gap-[8px] sm:pl-[16px] lg:h-[48px] lg:pr-[24px] lg:pl-[30px]'>
        {/* Scrolls sideways only; spans the box's height so the scrollbar sits on its bottom edge, clear of the text */}
        <span className='flex min-w-0 items-center self-stretch overflow-x-auto overflow-y-hidden [scrollbar-width:thin]'>
          {/* Trimmed to cap height so the line centres in the box whatever the font; py keeps descenders unclipped */}
          <span className='py-[5px] font-mono text-[9px] whitespace-nowrap text-olake-muted [text-box:trim-both_cap_alphabetic] min-[375px]:text-[10px] sm:text-[13px] lg:text-[15px]'>
            {HERO.installCommand}
          </span>
        </span>
        {/* 44px tap target below lg, with negative margins so it takes only the icon's width */}
        <button
          type='button'
          onClick={copy}
          aria-label='Copy install command'
          className='-mx-[14px] flex size-[44px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-olake-muted transition-colors hover:text-olake-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue lg:mx-0 lg:size-auto'
        >
          <Icon aria-hidden='true' className='size-[16px] lg:size-[22px]' />
        </button>
        <span role='status' aria-live='polite' className='sr-only'>
          {copied ? 'Copied install command' : ''}
        </span>
      </div>
    </div>
  )
}

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
        <InstallCommand />
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
