import React from 'react'
import Marquee from 'react-fast-marquee'
import SectionHeading from '../ui/SectionHeading'
import FeatureArt from '../ui/FeatureArt'
import { FEATURES, type FeatureCard } from '@site/src/data/landing/home/features'

const Card = ({ feature }: { feature: FeatureCard }) => (
  <article className='mx-[10px] flex h-full w-[300px] shrink-0 flex-col self-stretch overflow-hidden rounded-[16px] border border-solid border-[#e6e6e6] bg-white lg:mx-[12px] lg:w-[643px]'>
    <FeatureArt kind={feature.art} />
    <div className='flex flex-1 flex-col px-[18px] pb-[22px] pt-[20px] lg:px-[46px] lg:pb-[30px] lg:pt-[26px]'>
      <p className='text-[13px] text-[#616161]'>{feature.kicker}</p>
      <h3 className='mt-[6px] text-[17px] font-normal leading-[1.3] text-[#242424] lg:text-[22px]'>
        {feature.title}
      </h3>
      <p className='mt-[10px] text-[12px] leading-[1.6] text-[#7b7b7b] lg:text-[14px]'>
        {feature.body}
      </p>
    </div>
  </article>
)

/**
 * The design lays the four cards out as a horizontal rail that runs past the
 * right edge of the content column, so it loops right to left instead of
 * needing a scrollbar. Same marquee the logo row uses.
 */
export default function Features() {
  return (
    <section className='py-[56px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px] px-[32px] lg:px-[24px]'>
        <SectionHeading eyebrow='Features' title='Why teams pick OLake.' />
      </div>

      <div className='olakehome-feature-marquee mt-[24px] lg:mt-[36px]'>
        <Marquee
          autoFill
          direction='left'
          pauseOnHover
          speed={38}
          gradient={false}
          className='items-stretch'
        >
          {FEATURES.map((feature) => (
            <Card key={feature.kicker} feature={feature} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
