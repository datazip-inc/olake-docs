import React from 'react'
import Card from '../ui/Card'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { cn } from '@site/src/lib/utils'
import {
  FONTS,
  SPECIMEN_ALPHABET,
  SPECIMEN_SENTENCE,
  TYPE_SCALE
} from '@site/src/data/landing/branding'

/** Specimen size for each row of the type scale, in the same order as TYPE_SCALE. */
const SCALE_SAMPLE = [
  'text-[28px] lg:text-[46px] leading-[1.24] tracking-[-0.01em]',
  'text-[24px] lg:text-[38px] leading-[1.2] tracking-[-0.01em]',
  'text-[17px] lg:text-[22px] leading-[1.3]',
  'text-[20px] leading-[1.4]',
  'text-[15px] leading-[1.55]',
  'text-[14px] leading-[1.55]',
  'text-[12px] leading-normal'
]

export default function TypographySection() {
  return (
    <Section
      id='typography'
      className='scroll-mt-[90px] border-0 border-t border-solid border-olake-line-rule'
    >
      <SectionHeading
        eyebrow='Typography'
        title='Fonts'
        body='OLake uses Geist for text and JetBrains Mono for code. Both are self-hosted on olake.io.'
      />
      <div className='mt-[32px] grid gap-[16px] lg:mt-[44px] lg:grid-cols-2 lg:gap-[20px]'>
        {FONTS.map((font) => (
          <Card key={font.id} className='flex flex-col'>
            <div
              className={cn(
                'border-0 border-b border-solid border-olake-line bg-olake-surface-alt px-[24px] py-[28px] lg:px-[32px]',
                font.id === 'mono' ? 'font-mono' : 'font-sans'
              )}
            >
              <p className='mb-0 text-[72px] font-normal leading-none text-olake-blue lg:text-[96px]' aria-hidden='true'>
                Aa
              </p>
              <p className='mb-0 mt-[20px] break-words text-[13px] leading-[1.7] tracking-[0.02em] text-olake-text lg:text-[14px]'>
                {SPECIMEN_ALPHABET}
              </p>
            </div>
            <div className='flex flex-1 flex-col px-[24px] pb-[24px] pt-[20px] lg:px-[32px]'>
              <h3 className='mb-0 text-[22px] font-normal leading-[1.3] text-olake-ink'>{font.name}</h3>
              <p className='mb-0 mt-[6px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[14px]'>
                {font.role}
              </p>
              <ul
                className={cn(
                  'm-0 mt-[16px] flex list-none flex-col gap-[8px] p-0 text-[16px] text-olake-ink',
                  font.id === 'mono' ? 'font-mono' : 'font-sans'
                )}
              >
                {font.weights.map((weight) => (
                  <li
                    key={weight.value}
                    className='flex flex-col gap-[2px]'
                  >
                    <span style={{ fontWeight: weight.value }}>{SPECIMEN_SENTENCE}</span>
                    <span className='font-sans text-[12px] font-normal text-olake-muted'>
                      {weight.label}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={font.licenseHref}
                className='mt-[18px] text-[13px] text-olake-blue hover:text-olake-blue-hover'
              >
                {font.name} licence
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div className='mt-[40px] lg:mt-[56px]'>
        <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[22px]'>
          Type scale
        </h3>
        <Card className='mt-[18px]'>
          <ul className='m-0 list-none p-0'>
            {TYPE_SCALE.map((row, i) => (
              <li
                key={row.role}
                className='flex flex-col gap-[4px] border-0 border-t border-solid border-olake-line px-[20px] py-[16px] first:border-t-0 lg:flex-row lg:items-baseline lg:gap-[24px] lg:px-[28px]'
              >
                <div className='shrink-0 lg:w-[190px]'>
                  <p className='mb-0 text-[13px] font-medium text-olake-ink'>{row.role}</p>
                  <p className='mb-0 text-[12px] text-olake-muted'>
                    {row.size}
                    {row.note && ` (${row.note})`}
                  </p>
                </div>
                <p className={cn('mb-0 min-w-0 break-words text-olake-ink', SCALE_SAMPLE[i])}>
                  Open source Apache Iceberg ingestion
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  )
}
