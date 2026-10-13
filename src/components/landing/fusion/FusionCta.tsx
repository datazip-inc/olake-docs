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
        <>
          {/* A navy glow that softens the points under the heading */}
          <img
            src={`${IMG}/cta-glow.webp`}
            alt=''
            width={1466}
            height={745}
            loading='lazy'
            decoding='async'
            className='pointer-events-none absolute top-[-211px] left-1/2 -z-20 block max-w-none -translate-x-1/2'
          />
          <img
            src={`${IMG}/cta-quantity-skew.webp`}
            alt=''
            width={1330.33}
            height={886.886}
            loading='lazy'
            decoding='async'
            className='pointer-events-none absolute bottom-[-509px] left-[calc(50%+1.8px)] -z-10 block max-w-none -translate-x-1/2 -rotate-[0.61deg]'
          />
        </>
      }
    />
  )
}
