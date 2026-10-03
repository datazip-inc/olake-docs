import React from 'react'
import Marquee from '@site/src/components/ui/Marquee'
import { TRUSTED_LOGOS } from '@site/src/data/landing/home/logos'

/**
 * The design draws vertical rules at the content edges and a row of greyscale
 * marks. The complete logo set loops continuously so the section stays compact
 * while more companies pass through the viewport.
 */
export default function TrustedBy() {
  return (
    <section className='border-0 border-y border-solid border-olake-line-rule bg-white'>
      <div className='relative mx-auto w-full max-w-[1016px] px-[32px] py-[28px] lg:px-[24px] lg:py-[34px]'>
        <span
          aria-hidden='true'
          className='absolute inset-y-0 left-[32px] w-px bg-olake-line-rule lg:left-0'
        />
        <span
          aria-hidden='true'
          className='absolute inset-y-0 right-[32px] w-px bg-olake-line-rule lg:right-0'
        />
        <p className='text-center text-[14px] text-olake-text lg:text-[20px]'>
          Trusted by Engineers at
        </p>
        <div className='olakehome-marquee mt-[20px] overflow-hidden lg:mt-[26px] lg:mx-[-24px]'>
          <Marquee
            autoFill
            direction='left'
            pauseOnHover
            speed={32}
            className='items-center overflow-hidden'
            style={{ overflowY: 'hidden' }}
          >
            {TRUSTED_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className='mx-[14px] flex h-[34px] items-center justify-center overflow-hidden lg:mx-[23px]'
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={logo.w}
                  height={logo.h}
                  loading='lazy'
                  decoding='async'
                  style={{ maxHeight: logo.maxH, maxWidth: logo.maxW }}
                  className='h-auto w-auto object-contain'
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
