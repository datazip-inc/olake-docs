import React from 'react'
import ProductCta from '../product/ProductCta'
import { FUSION_CTA } from '@site/src/data/landing/fusion/cta'

const IMG = '/img/landing/fusion'

/** Closing call to action of the OLake Fusion page: the navy card with skewed data points under the buttons. */
export default function FusionCta() {
  return (
    <ProductCta
      {...FUSION_CTA}
      className='bg-[#0a0923]'
      art={
        // The design's navy glow under the heading is the card's own colour, so it is left out.
        <img
          src={`${IMG}/cta-quantity-skew.webp`}
          alt=''
          width={1330.33}
          height={886.886}
          loading='lazy'
          decoding='async'
          className='pointer-events-none absolute bottom-[-509px] left-[calc(50%+1.8px)] -z-10 block max-w-none -translate-x-1/2 -rotate-[0.61deg]'
        />
      }
    />
  )
}
