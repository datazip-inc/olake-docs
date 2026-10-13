import React from 'react'
import ProductHero from '../product/ProductHero'
import { HERO } from '@site/src/data/landing/fusion/hero'
import FusionDashboardMock from './FusionDashboardMock'

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
      src={`${IMG}/hero-contours.svg`}
      alt=''
      width={3294.52}
      height={2141.44}
      decoding='async'
      className='absolute top-[-791.39px] left-[calc(50%-8.26px)] block max-w-none -translate-x-1/2 -scale-y-100'
    />
    <img
      src={`${IMG}/hero-glow.svg`}
      alt=''
      width={1766}
      height={1150}
      decoding='async'
      className='absolute top-[-48px] left-1/2 block max-w-none -translate-x-1/2'
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
        <FusionDashboardMock />
      </div>
    </ProductHero>
  )
}
