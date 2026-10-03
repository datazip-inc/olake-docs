import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import SectionHeading from '../ui/SectionHeading'
import { cn } from '@site/src/lib/utils'
import {
  GO_BENCHMARK_INFO,
  GO_BENCHMARK_INTRO,
  GO_BENCHMARK_LINK,
  GO_BENCHMARK_MODES,
  GO_BENCHMARK_SUMMARY
} from '@site/src/data/landing/go/benchmark'
import { useGoBenchmark } from './useGoBenchmark'

const ExternalMark = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
    <polyline points='15 3 21 3 21 9' />
    <line x1='10' y1='14' x2='21' y2='3' />
  </svg>
)

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width='12'
    height='8'
    viewBox='0 0 10 6'
    fill='none'
    aria-hidden='true'
    className={cn('shrink-0 text-olake-muted transition-transform', open && 'rotate-180')}
  >
    <path d='M1 1L5 5L9 1' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
  </svg>
)

const FOCUS =
  'focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olake-blue-on-dark'

const BenchLink = ({ className }: { className?: string }) => (
  <Link
    to={GO_BENCHMARK_LINK.href}
    className={cn(
      'inline-flex items-center gap-[6px] text-[14px] text-olake-blue-on-dark transition-colors hover:text-olake-blue-on-dark-hover lg:text-[15px]',
      FOCUS,
      className
    )}
  >
    {GO_BENCHMARK_LINK.label}
    <ExternalMark />
  </Link>
)

/** The "OLake Advantage" block: the dark benchmark card with mode and source switching, and the "how" disclosure. */
export default function GoBenchmark() {
  const t = useGoBenchmark()
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <section id='benchmarks' className='px-0 pb-0 pt-[24px] lg:pt-[40px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <div className='px-[20px] lg:px-[34px]'>
          <SectionHeading
            eyebrow={GO_BENCHMARK_INTRO.eyebrow}
            title={GO_BENCHMARK_INTRO.title}
            body={GO_BENCHMARK_SUMMARY.map((part, i) =>
              part.strong ? (
                <strong key={i} className='font-medium text-olake-ink'>
                  {part.text}
                </strong>
              ) : (
                <React.Fragment key={i}>{part.text}</React.Fragment>
              )
            )}
            className='[&_p:last-child]:max-w-[640px]'
          />
        </div>

        <div className='lakeside-benchmark-panel mt-[24px] p-[12px] lg:mt-[32px] lg:p-[14px]'>
          <div className='overflow-hidden rounded-[16px] bg-olake-surface-dark-2'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-[28px] lg:pt-[22px] lg:pb-[14px]'>
              <div className='flex items-center gap-[16px] px-[20px] pb-[14px] pt-[22px] lg:p-0'>
                {GO_BENCHMARK_MODES.map((m) => (
                  <button
                    key={m.id}
                    type='button'
                    onClick={() => t.setMode(m.id)}
                    aria-pressed={t.mode === m.id}
                    className={cn(
                      'cursor-pointer border-none bg-transparent p-0 text-[14px] transition-colors lg:text-[15px]',
                      FOCUS,
                      t.mode === m.id
                        ? 'text-olake-on-blue'
                        : 'text-olake-muted-on-dark hover:text-olake-line-strong'
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <BenchLink className='hidden lg:inline-flex' />
            </div>

            <div className='flex items-center gap-[14px] overflow-x-auto border-0 border-t border-solid border-olake-line-dark px-[20px] py-[14px] lg:px-[28px]'>
              {t.connectors.map((c) => (
                <button
                  key={c.id}
                  type='button'
                  onClick={() => t.setActiveConnector(c.id)}
                  aria-pressed={t.activeConnector === c.id}
                  className={cn(
                    'shrink-0 cursor-pointer border-none bg-transparent p-0 text-[14px] transition-colors lg:text-[15px]',
                    FOCUS,
                    t.activeConnector === c.id
                      ? 'text-olake-on-blue'
                      : 'text-olake-muted-on-dark hover:text-olake-line-strong'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {t.hasData ? (
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[720px] border-0 border-collapse border-none text-left'>
                  <thead>
                    <tr className='border-0 border-y border-solid border-olake-line-dark bg-transparent'>
                      <th className='w-[210px] border-0 border-r border-solid border-olake-line-dark bg-transparent px-[20px] py-[16px] text-[14px] font-normal text-olake-muted-on-dark lg:px-[28px] lg:text-[15px]'>
                        Metrics
                      </th>
                      <th className='border-0 border-x border-solid border-olake-line-dark bg-transparent px-[16px] py-[14px] text-center font-normal'>
                        <span className='block text-[14px] text-olake-blue-on-dark lg:text-[15px]'>
                          {t.olakeLabel}
                        </span>
                        <span className='block text-[12px] text-olake-muted-on-dark lg:text-[13px]'>
                          {t.olakeSub}
                        </span>
                      </th>
                      {t.competitors.map((name) => (
                        <th
                          key={name}
                          className='border-0 border-r border-solid border-olake-line-dark bg-transparent px-[16px] py-[16px] text-center text-[14px] font-normal text-olake-muted-on-dark lg:text-[15px]'
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row) => (
                      <tr
                        key={row.label}
                        className='border-0 border-b border-solid border-olake-line-dark bg-transparent'
                      >
                        <th className='border-0 border-r border-solid border-olake-line-dark bg-transparent px-[20px] py-[18px] text-left align-top font-normal lg:px-[28px]'>
                          <span className='block text-[14px] text-olake-line-strong lg:text-[15px]'>
                            {row.label}
                          </span>
                          {row.note && (
                            <span className='mt-[6px] block max-w-[170px] text-[12px] leading-[1.45] text-olake-muted-on-dark lg:text-[13px]'>
                              {row.note}
                            </span>
                          )}
                        </th>
                        <td className='border-0 border-x border-solid border-olake-line-dark px-[16px] py-[18px] text-center align-top text-[14px] text-olake-on-blue lg:text-[15px]'>
                          {row.olake}
                        </td>
                        {row.competitors.map((value, i) => (
                          <td
                            key={`${row.label}-${t.competitors[i]}`}
                            className={cn(
                              'border-0 border-r border-solid border-olake-line-dark px-[16px] py-[18px] text-center align-top text-[14px] lg:text-[15px]',
                              row.highlight
                                ? 'text-olake-blue-on-dark'
                                : 'text-olake-line-strong/80'
                            )}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='flex flex-col items-center border-0 border-t border-solid border-olake-line-dark px-[24px] py-[48px] text-center lg:py-[64px]'>
                <img
                  src='/img/landing/shared/olake-mark-small.svg'
                  alt=''
                  width={28}
                  height={28}
                  loading='lazy'
                  decoding='async'
                  className='block h-[28px] w-[28px]'
                />
                <p className='mt-[16px] text-[16px] text-olake-on-blue lg:text-[20px]'>
                  {t.sourceName} benchmarks coming soon
                </p>
                <p className='mt-[8px] max-w-[420px] text-[13px] leading-[1.6] text-olake-muted-on-dark lg:text-[14px]'>
                  We&apos;re running head-to-head {t.sourceName} ingestion tests now. Check back
                  shortly for the full comparison.
                </p>
              </div>
            )}

            <div className='flex items-center justify-center border-0 border-t border-solid border-olake-line-dark py-[20px] lg:hidden'>
              <BenchLink />
            </div>
          </div>

          <div className='mt-[12px] overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface'>
            <button
              type='button'
              aria-expanded={infoOpen}
              aria-controls='go-benchmark-info'
              onClick={() => setInfoOpen((open) => !open)}
              className='flex w-full cursor-pointer items-center gap-[12px] border-0 bg-transparent px-[16px] py-[16px] text-left text-olake-ink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olake-blue lg:px-[24px]'
            >
              <img
                src={GO_BENCHMARK_INFO.icon.src}
                alt=''
                width={GO_BENCHMARK_INFO.icon.width}
                height={GO_BENCHMARK_INFO.icon.height}
                loading='lazy'
                decoding='async'
                className='block h-[28px] w-[28px] shrink-0 rounded-[8px]'
              />
              <span className='flex-1 text-[15px] lg:text-[16px]'>{GO_BENCHMARK_INFO.title}</span>
              <Chevron open={infoOpen} />
            </button>
            <div
              id='go-benchmark-info'
              hidden={!infoOpen}
              className={cn(
                'flex-col gap-[10px] border-0 border-t border-solid border-olake-line px-[16px] py-[16px] text-[13px] leading-[1.6] text-olake-text-2 lg:px-[24px] lg:text-[14px]',
                infoOpen ? 'flex' : 'hidden'
              )}
            >
              {GO_BENCHMARK_INFO.items.map((item) => (
                <p key={item.term}>
                  <span className='font-medium text-olake-ink'>{item.term}</span> {item.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
