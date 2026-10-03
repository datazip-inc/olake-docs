import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { PiArrowRight, PiCaretDown } from 'react-icons/pi'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { BENCHMARK, BENCHMARK_INFO } from '@site/src/data/landing/fusion/benchmark'
import { cn } from '@site/src/lib/utils'

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'
const RULE = 'border-0 border-r border-solid border-olake-line-rule bg-transparent'

/** The "How Fusion does this" disclosure under the table. */
function HowFusionDoesThis() {
  const [open, setOpen] = useState(false)
  return (
    <div className='mt-[16px] rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[16px] py-[6px] lg:mt-[20px] lg:px-[24px]'>
      <h3 className='mb-0 text-[15px] font-normal text-olake-ink lg:text-[16px]'>
        <button
          type='button'
          aria-expanded={open}
          aria-controls='fusion-how-it-works'
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex w-full cursor-pointer appearance-none items-center gap-[14px] border-0 bg-transparent px-0 py-[14px] text-left text-inherit [font:inherit]',
            FOCUS
          )}
        >
          <span className='flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue-tint'>
            <img
              src='/img/landing/shared/benchmark-info-icon.webp'
              alt=''
              width={22}
              height={22}
              loading='lazy'
              decoding='async'
              className='block h-[22px] w-[22px] object-contain'
            />
          </span>
          <span className='flex-1'>{BENCHMARK_INFO.title}</span>
          <PiCaretDown
            size={16}
            aria-hidden='true'
            className={cn('shrink-0 text-olake-muted transition-transform', open && 'rotate-180')}
          />
        </button>
      </h3>
      {open && (
        <ul
          id='fusion-how-it-works'
          className='flex flex-col gap-[10px] border-0 border-t px-0 border-solid border-olake-line py-[16px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'
        >
          {BENCHMARK_INFO.items.map((item) => (
            <li key={item.term}>
              <span className='font-medium text-olake-ink'>{item.term}</span> — {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Benchmark() {
  const b = BENCHMARK
  return (
    <Section id='benchmarks'>
      <SectionHeading
        eyebrow={b.eyebrow}
        title={b.title}
        body={
          <>
            {b.lead.before}
            <b className='font-medium text-olake-ink'>{b.lead.boldSpeed}</b>
            {b.lead.middle}
            <b className='font-medium text-olake-ink'>{b.lead.boldCost}</b>
            {b.lead.after}
          </>
        }
      />

      <div className='mt-[24px] overflow-hidden rounded-[16px] bg-olake-surface-muted lg:mt-[36px]'>
        <table className='w-full border-collapse border-none bg-transparent text-left'>
          <thead>
            <tr className='border-0 bg-transparent'>
              <th
                className={cn(
                  RULE,
                  'w-[36%] px-[14px] pb-[12px] pt-[22px] text-[12px] font-normal text-olake-muted lg:px-[36px] lg:text-[14px]'
                )}
              >
                {b.headers.metric}
              </th>
              <th
                className={cn(
                  RULE,
                  'px-[10px] pb-[12px] pt-[22px] text-center text-[12px] font-normal text-olake-text-2 lg:text-[14px]'
                )}
              >
                {b.headers.spark}
              </th>
              <th className='border-0 bg-transparent px-[10px] pb-[12px] pt-[22px] text-center text-[12px] font-normal text-olake-ink lg:text-[14px]'>
                {b.headers.fusionBrand}
                <span className='text-olake-blue'>{b.headers.fusionProduct}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {b.rows.map((row, i) => {
              const last = i === b.rows.length - 1
              return (
                <tr key={row.metric} className='border-0 bg-transparent'>
                  <th
                    className={cn(
                      RULE,
                      'px-[14px] py-[16px] text-left text-[13px] font-normal text-olake-text lg:px-[36px] lg:py-[18px] lg:text-[14px]',
                      last && 'pb-[26px] lg:pb-[34px]'
                    )}
                  >
                    {row.metric}
                  </th>
                  <td
                    className={cn(
                      RULE,
                      'px-[10px] py-[16px] text-center text-[13px] text-olake-text-2 lg:py-[18px] lg:text-[14px]',
                      last && 'pb-[26px] lg:pb-[34px]'
                    )}
                  >
                    {row.spark}
                  </td>
                  <td
                    className={cn(
                      'border-0 bg-transparent px-[10px] py-[16px] text-center lg:py-[18px]',
                      last && 'pb-[26px] lg:pb-[34px]'
                    )}
                  >
                    <span className='inline-flex flex-col items-center gap-[6px] text-[13px] text-olake-ink lg:flex-row lg:gap-[10px] lg:text-[14px]'>
                      {row.fusion}
                      <span className='rounded-[6px] bg-olake-success-bg px-[8px] py-[3px] text-[11px] text-olake-success-text lg:text-[12px]'>
                        {row.delta}
                      </span>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <HowFusionDoesThis />

      <Link
        to={b.link.href}
        className={cn(
          'mt-[20px] inline-flex items-center gap-[6px] text-[14px] text-olake-blue transition-opacity hover:opacity-80 lg:mt-[24px]',
          FOCUS
        )}
      >
        {b.link.label}
        <PiArrowRight size={14} aria-hidden='true' />
      </Link>
    </Section>
  )
}
