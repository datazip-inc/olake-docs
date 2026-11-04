import React from 'react'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import ColorSwatch from './ColorSwatch'
import { PALETTE } from '@site/src/data/landing/branding'

export default function ColorSection() {
  return (
    <Section
      id='colors'
      className='scroll-mt-[90px] border-0 border-t border-solid border-olake-line-rule'
    >
      <SectionHeading
        eyebrow='Colors'
        title='Color Palette'
        body='Select a hex value to copy it.'
      />
      <div className='mt-[32px] flex flex-col gap-[40px] lg:mt-[44px] lg:gap-[56px]'>
        {PALETTE.map((group) => (
          <div key={group.title}>
            <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[22px]'>
              {group.title}
            </h3>
            <ul className='m-0 mt-[18px] list-none p-0 grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[20px]'>
              {group.swatches.map((swatch) => (
                <ColorSwatch key={swatch.hex} swatch={swatch} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
