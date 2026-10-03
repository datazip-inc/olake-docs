import React from 'react'
import Button from '../ui/Button'
import Section from '../ui/Section'
import { FUSION_CTA } from '@site/src/data/landing/fusion/cta'

/** Closing call to action: headline and button beside the iceberg picture. */
export default function FusionCta() {
  return (
    <Section flush className='pb-[56px] lg:pb-[96px]'>
      <div className='grid overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface lg:grid-cols-2'>
        <div className='flex flex-col items-start justify-center px-[24px] py-[36px] lg:px-[64px] lg:py-[56px]'>
          <h2 className='mb-0 max-w-[420px] text-[26px] font-normal leading-[1.15] tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
            {FUSION_CTA.title}
          </h2>
          <Button href={FUSION_CTA.cta.href} className='mt-[22px] lg:mt-[28px]'>
            {FUSION_CTA.cta.label}
          </Button>
        </div>
        <img
          src={FUSION_CTA.image.src}
          alt=''
          width={FUSION_CTA.image.width}
          height={FUSION_CTA.image.height}
          loading='lazy'
          decoding='async'
          className='block h-[200px] w-full object-cover lg:h-full lg:min-h-[280px]'
        />
      </div>
    </Section>
  )
}
