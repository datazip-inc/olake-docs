import React from 'react'
import Button from '../ui/Button'
import { GO_CTA } from '@site/src/data/landing/go/cta'

const BUTTON = 'h-[36px] rounded-[8px] px-[10px] text-[16px] leading-[1.3]'

/** Closing call to action: the blue card with a field of dots rising behind the buttons. */
export default function GoCta() {
  return (
    <section className='px-[16px] py-[48px] lg:px-[24px] lg:py-[96px]'>
      <div className='relative isolate mx-auto max-w-[1018px] overflow-hidden rounded-[28px] bg-(--go-blue-deep) px-[20px] pt-[48px] pb-[200px] text-center lg:rounded-[36px] lg:pt-[64px] lg:pb-[274px]'>
        {/* The dot wave, upside down as in the design, its top 267px showing under the buttons. */}
        <img
          src='/img/landing/go/cta-dot-wave.svg'
          alt=''
          width={1018}
          height={534.97}
          loading='lazy'
          decoding='async'
          className='pointer-events-none absolute bottom-[-268px] left-1/2 -z-10 block max-w-none -translate-x-1/2 -scale-y-100'
        />
        <p className='text-[15px] leading-[1.3] text-[#fefefd] lg:text-[16px]'>{GO_CTA.eyebrow}</p>
        <h2 className='mt-[6px] text-[28px] leading-[1.3] font-normal text-balance text-white lg:text-[40px]'>
          {GO_CTA.title}
        </h2>
        <div className='mt-[24px] flex flex-wrap items-center justify-center gap-[16px] lg:mt-[29px]'>
          <Button
            href={GO_CTA.primary.href}
            variant='secondary'
            className={`${BUTTON} border-[#d0d0d0] bg-[#fcfcfb] text-(--go-blue-deep) hover:bg-olake-surface hover:text-(--go-blue)`}
          >
            {GO_CTA.primary.label}
          </Button>
          <Button
            href={GO_CTA.secondary.href}
            className={`${BUTTON} border-[#315ef2] bg-(--go-blue-deep) text-[#fdfdfd] shadow-none hover:border-[#5b7ff5] hover:bg-(--go-blue-deep) hover:text-white`}
          >
            {GO_CTA.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
