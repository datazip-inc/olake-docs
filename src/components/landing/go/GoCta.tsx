import React from 'react'
import Button from '../ui/Button'
import Section from '../ui/Section'
import { GO_CTA } from '@site/src/data/landing/go/cta'

/**
 * Closing call-to-action. It follows the shared CtaBanner (outlined card, copy on top, one primary
 * button) but crops its 16:9 iceberg picture into a band, which CtaBanner's image slot cannot do.
 */
export default function GoCta() {
  return (
    <Section flush className='pb-[56px] pt-[56px] lg:pb-[96px] lg:pt-[96px]'>
      <div className='overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface'>
        <div className='px-[24px] pb-[28px] pt-[36px] text-left lg:px-[64px] lg:pb-[40px] lg:pt-[56px]'>
          <h2 className='max-w-[520px] text-[26px] font-normal leading-[1.15] tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
            {GO_CTA.title}
          </h2>
          <Button href={GO_CTA.cta.href} className='mt-[22px] lg:mt-[28px]'>
            {GO_CTA.cta.label}
          </Button>
        </div>
        <img
          src={GO_CTA.image.src}
          alt=''
          width={GO_CTA.image.width}
          height={GO_CTA.image.height}
          loading='lazy'
          decoding='async'
          className='block h-[140px] w-full object-cover object-[50%_58%] lg:h-[260px]'
        />
      </div>
    </Section>
  )
}
