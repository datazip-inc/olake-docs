import React from 'react'
import ProductCta from '../product/ProductCta'
import { GO_CTA } from '@site/src/data/landing/go/cta'

/** Closing call to action of the OLake Go page: the blue card with a field of dots rising behind the buttons. */
export default function GoCta() {
  return (
    <ProductCta
      {...GO_CTA}
      className='bg-(--product-blue-deep)'
      art={
        // The dot wave, upside down as in the design, its top 267px showing under the buttons.
        <img
          src='/img/landing/go/cta-dot-wave.svg'
          alt=''
          width={1018}
          height={534.97}
          loading='lazy'
          decoding='async'
          className='pointer-events-none absolute bottom-[-268px] left-1/2 -z-10 block max-w-none -translate-x-1/2 -scale-y-100'
        />
      }
    />
  )
}
