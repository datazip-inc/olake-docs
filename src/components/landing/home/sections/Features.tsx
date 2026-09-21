import React from 'react'
import SectionHeading from '../ui/SectionHeading'
import FeatureArt from '../ui/FeatureArt'
import { FEATURES } from '@site/src/data/landing/home/features'

/**
 * The design lays the four cards out as a horizontal rail that runs past the
 * right edge of the content column, so it scrolls on every breakpoint.
 */
export default function Features() {
  return (
    <section className='py-[56px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px] px-[32px] lg:px-[24px]'>
        <SectionHeading eyebrow='Features' title='Why teams pick OLake.' />
      </div>

      <div className='mt-[24px] overflow-x-auto pb-[8px] lg:mt-[36px]'>
        <div className='mx-auto flex w-max gap-[20px] px-[32px] lg:gap-[24px] lg:pl-[max(24px,calc((100vw-1016px)/2))] lg:pr-[24px]'>
          {FEATURES.map((feature) => (
            <article
              key={feature.kicker}
              className='flex w-[300px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-solid border-[#e6e6e6] bg-white lg:w-[643px]'
            >
              <FeatureArt kind={feature.art} />
              <div className='px-[18px] pb-[22px] pt-[20px] lg:px-[46px] lg:pb-[30px] lg:pt-[26px]'>
                <p className='text-[13px] text-[#616161]'>{feature.kicker}</p>
                <h3 className='mt-[6px] text-[17px] font-normal leading-[1.3] text-[#242424] lg:text-[22px]'>
                  {feature.title}
                </h3>
                <p className='mt-[10px] text-[12px] leading-[1.6] text-[#7b7b7b] lg:text-[14px]'>
                  {feature.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
