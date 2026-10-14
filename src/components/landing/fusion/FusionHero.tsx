import React from 'react'
import ProductHero from '../product/ProductHero'
import Glow from '../product/Glow'
import { HERO } from '@site/src/data/landing/fusion/hero'

const IMG = '/img/landing/fusion'

/**
 * The contour rings around the heading (drawn upside down, as the design places them), cleared
 * behind the copy by a soft white glow and faded out above the problem section.
 */
const Background = () => (
  <div
    aria-hidden='true'
    className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1116px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_934px,transparent_1116px)]'
  >
    <img
      src={`${IMG}/hero-contours.webp`}
      alt=''
      width={3294.52}
      height={2141.44}
      decoding='async'
      className='absolute top-[-791.39px] left-[calc(50%-8.26px)] block max-w-none -translate-x-1/2 -scale-y-100'
    />
    <Glow
      width={1766}
      height={1150}
      rx={679}
      ry={371}
      blur={102}
      color='#fff'
      className='top-[-48px] left-1/2 -translate-x-1/2'
    />
  </div>
)

/** Hero of the OLake Fusion page. The headline is the PostHog A/B variant the page picked. */
export default function FusionHero({ headline }: { headline: string }) {
  return (
    <ProductHero
      copy={{ ...HERO, headline }}
      background={<Background />}
      className='lg:pt-[257px] lg:pb-[150px]'
    >
      <div className='mt-[48px] lg:mt-[58px]'>
        {/* The run-metrics card reaches 75px past the 1018px screen: below 1200px the whole picture
            is fitted to the width; from 1200px up it is drawn full size, so the card hangs past
            the 1018px column the way the design has it. */}
        <img
          src={`${IMG}/hero-dashboard.webp`}
          alt='OLake Fusion run history dashboard'
          width={1093}
          height={510}
          fetchPriority='high'
          decoding='async'
          className='block h-auto w-full max-w-[1093px] min-[1200px]:w-[1093px] min-[1200px]:max-w-none'
        />
      </div>
    </ProductHero>
  )
}
