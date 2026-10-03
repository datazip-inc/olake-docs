import React from 'react'
import { PiCheckBold } from 'react-icons/pi'
import Section from '../ui/Section'
import { FLOW } from '@site/src/data/landing/fusion/hero'

const NODE_LABEL = 'mt-[10px] text-[11px] leading-[1.35] lg:text-[13px]'

const Connector = () => (
  <span
    aria-hidden='true'
    className='mt-[35px] block h-[2px] min-w-[16px] flex-1 bg-linear-to-r from-olake-line-strong via-olake-blue to-olake-line-strong lg:mt-[43px]'
  />
)

/** Iceberg tables go in, OLake Fusion works on them, optimized Iceberg tables come out. */
export default function ProductFlow() {
  return (
    <Section className='pb-[24px] pt-0 lg:pb-[24px] lg:pt-0'>
      <div className='mx-auto max-w-[760px]'>
        <div className='flex items-start justify-center'>
          <div className='flex w-[96px] shrink-0 flex-col items-center text-center lg:w-[150px]'>
            <span className='flex h-[72px] w-[72px] items-center justify-center rounded-full border border-solid border-olake-line bg-olake-surface lg:h-[88px] lg:w-[88px]'>
              <img
                src='/img/landing/shared/iceberg-icon.webp'
                alt='Iceberg'
                width={73}
                height={20}
                decoding='async'
                className='block h-[16px] w-auto lg:h-[20px]'
              />
            </span>
            <p className={`${NODE_LABEL} text-olake-muted`}>{FLOW.inputLabel}</p>
          </div>

          <Connector />

          <div className='flex w-[96px] shrink-0 flex-col items-center text-center lg:w-[150px]'>
            <span className='flex h-[72px] w-[72px] items-center justify-center rounded-[16px] border border-solid border-olake-blue-ring bg-olake-blue shadow-[var(--olake-shadow-btn)] lg:h-[88px] lg:w-[88px]'>
              <img
                src='/img/landing/shared/olake-mark-small.svg'
                alt='OLake Fusion'
                width={42}
                height={42}
                decoding='async'
                className='block h-[32px] w-[32px] lg:h-[40px] lg:w-[40px]'
              />
            </span>
            <p className={`${NODE_LABEL} text-olake-ink`}>
              {FLOW.engineName.brand}
              <span className='text-olake-blue'>{FLOW.engineName.product}</span>
            </p>
          </div>

          <Connector />

          <div className='flex w-[96px] shrink-0 flex-col items-center text-center lg:w-[150px]'>
            <span className='relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-solid border-olake-blue bg-olake-blue-tint lg:h-[88px] lg:w-[88px]'>
              <img
                src='/img/landing/shared/iceberg-icon.webp'
                alt='Iceberg'
                width={73}
                height={20}
                decoding='async'
                className='block h-[16px] w-auto lg:h-[20px]'
              />
              <span className='absolute bottom-[-2px] right-[-2px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-olake-blue text-olake-on-blue'>
                <PiCheckBold size={11} aria-hidden='true' />
              </span>
            </span>
            <p className={`${NODE_LABEL} text-olake-blue`}>{FLOW.outputLabel}</p>
          </div>
        </div>

        <ul className='mt-[20px] flex p-0 flex-wrap items-center justify-center gap-[8px] lg:mt-[24px] lg:gap-[10px]'>
          {FLOW.capabilities.map((item) => (
            <li
              key={item.label}
              className='inline-flex items-center gap-[8px] rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[12px] py-[6px] text-[12px] text-olake-text lg:text-[13px]'
            >
              {item.label}
              {item.badge && (
                <span className='rounded-[6px] bg-olake-blue-tint px-[6px] py-[1px] text-[10px] text-olake-blue lg:text-[11px]'>
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
