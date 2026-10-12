import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { cn } from '@site/src/lib/utils'
import {
  GO_BENCHMARK_HOW,
  GO_BENCHMARK_INTRO,
  GO_BENCHMARK_LINK,
  GO_BENCHMARK_MODES,
  GO_BENCHMARK_SUMMARY,
  GO_RELEASE_STRIP
} from '@site/src/data/landing/go/benchmark'
import { useGoBenchmark } from './useGoBenchmark'

const FOCUS =
  'focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue-on-dark'

/** Mode and source switches: 12px labels with a 24px tall hit area. */
const Switch = ({
  pressed,
  onClick,
  children
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type='button'
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      '-my-[4px] shrink-0 cursor-pointer border-0 bg-transparent px-0 py-[4px] text-[12px] leading-[1.3] transition-colors',
      FOCUS,
      pressed ? 'text-white' : 'text-olake-muted-on-dark hover:text-olake-line-strong'
    )}
  >
    {children}
  </button>
)

/** "7.5 hours (failed sync)" reads as the figure with its remark on a smaller second line. */
const Figure = ({ value }: { value: string }) => {
  const at = value.indexOf(' (')
  if (at < 0) return <>{value}</>
  return (
    <>
      {value.slice(0, at)}
      <span className='block text-[12px]'>{value.slice(at + 1)}</span>
    </>
  )
}

/** Column widths of the design's table (198, 172, 147, 148, 147 and 145 of its 957px); it leaves 45px free on the right. */
const COLUMNS = ['20.69%', '17.97%', '15.36%', '15.47%', '15.36%', '15.15%']
/** Rules on the dark section. It goes first in cn(): a later border-0 would drop the side classes. */
const RULE = 'border-0 border-solid border-olake-line-dark'

/**
 * "Benchmarks": the dark full-bleed section with the latest-release strip, the comparison table
 * (switchable between full load and CDC and across sources), how OLake Go gets there, and a bar
 * linking to the full benchmarks.
 */
export default function GoBenchmark() {
  const t = useGoBenchmark()
  const { siteConfig } = useDocusaurusContext()
  const releaseLabel = siteConfig.customFields?.latestOlakeReleaseLabel as string | undefined
  const releasePath =
    (siteConfig.customFields?.latestOlakeReleasePath as string | undefined) ||
    '/docs/release/ingestion'

  return (
    <section id='benchmarks' className='bg-olake-surface-dark px-[16px] lg:px-[24px]'>
      <div className={cn(RULE, 'mx-auto max-w-[1004px] border-x text-white')}>
        {releaseLabel && (
          <div className='flex flex-col gap-[4px] rounded-b-[14px] bg-olake-surface-dark-2 px-[20px] py-[14px] text-[15px] leading-[1.3] lg:h-[64px] lg:flex-row lg:items-center lg:gap-[20px] lg:px-[40px] lg:py-0 lg:text-[16px]'>
            <span className='text-olake-muted-on-dark'>{GO_RELEASE_STRIP.eyebrow}</span>
            <span className='text-[#eaeae3]'>
              {GO_RELEASE_STRIP.lead} {releaseLabel}
            </span>
            <Link
              to={releasePath}
              className={cn(
                'text-[14px] text-olake-blue-on-dark transition-colors hover:text-olake-blue-on-dark-hover lg:ml-auto',
                FOCUS
              )}
            >
              {GO_RELEASE_STRIP.cta}
            </Link>
          </div>
        )}

        <div className='px-[20px] pt-[40px] lg:px-[31px] lg:pt-[49px]'>
          <p className='text-[15px] leading-[1.3] text-olake-muted-on-dark lg:text-[16px]'>
            {GO_BENCHMARK_INTRO.eyebrow}
          </p>
          <h2 className='mt-[8px] text-[30px] leading-[1.2] font-normal text-balance text-white lg:text-[48px] lg:leading-[1.3]'>
            {GO_BENCHMARK_INTRO.title}
          </h2>
          <p className='mt-[10px] max-w-[499px] text-[15px] leading-[1.3] text-[#fdfdfb] lg:text-[16px]'>
            {GO_BENCHMARK_SUMMARY.map((part, i) =>
              part.muted ? (
                <span key={i} className='text-olake-muted-on-dark'>
                  {part.text}
                </span>
              ) : (
                <React.Fragment key={i}>{part.text}</React.Fragment>
              )
            )}
          </p>
        </div>

        <div className={cn(RULE, 'mt-[33px] border-t')}>
          <div className='px-[20px] pt-[36px] lg:pt-[43px] lg:pr-[45px] lg:pl-[41px]'>
            <h3 className='text-[18px] leading-[1.3] font-normal text-[#fdfdfc] lg:text-[20px]'>
              {t.caption[0]}
              <br />
              {t.caption[1]}
            </h3>
            <div className='mt-[28px] flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[12px] pb-[18px] lg:mt-[39px]'>
              <div className='flex items-center gap-[16px]' role='group' aria-label='Load type'>
                {GO_BENCHMARK_MODES.map((m) => (
                  <Switch key={m.id} pressed={t.mode === m.id} onClick={() => t.setMode(m.id)}>
                    {m.label}
                  </Switch>
                ))}
              </div>
              <div
                className='flex items-center gap-[20px] overflow-x-auto'
                role='group'
                aria-label='Source'
              >
                {t.connectors.map((c) => (
                  <Switch
                    key={c.id}
                    pressed={t.activeConnector === c.id}
                    onClick={() => t.setActiveConnector(c.id)}
                  >
                    {c.name}
                  </Switch>
                ))}
              </div>
            </div>
          </div>

          {t.hasData ? (
            <div className={cn(RULE, 'overflow-x-auto border-y lg:pr-[45px]')}>
              <table className='w-full min-w-[800px] table-fixed border-collapse border-0 text-left'>
                <colgroup>
                  {COLUMNS.map((width, i) => (
                    <col key={i} style={{ width }} />
                  ))}
                </colgroup>
                <thead>
                  <tr className='h-[60px] border-0 bg-transparent'>
                    <th
                      className={cn(
                        RULE,
                        'border-r bg-transparent px-[20px] py-0 align-middle text-[14px] leading-[1.3] font-normal text-olake-muted-on-dark lg:pl-[41px]'
                      )}
                    >
                      Metrics
                    </th>
                    <th
                      className={cn(
                        RULE,
                        'border-r bg-transparent px-[8px] py-0 text-center align-middle leading-[1.3] font-normal'
                      )}
                    >
                      <span className='block text-[14px] text-olake-blue-on-dark'>
                        OLake<span className='sr-only'> </span>
                        <span className='font-light'>Go</span>
                      </span>
                      <span className='block text-[12px] text-olake-muted-on-dark'>
                        {t.olakeSub}
                      </span>
                    </th>
                    {t.competitors.map((name, i) => (
                      <th
                        key={name}
                        className={cn(
                          RULE,
                          'bg-transparent px-[8px] py-0 text-center align-middle text-[14px] leading-[1.3] font-normal text-olake-muted-on-dark',
                          i < t.competitors.length - 1 && 'border-r'
                        )}
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, r) => {
                    const cell = 'px-[8px] pt-[29px] pb-0 align-top text-[14px] leading-[1.3]'
                    return (
                      <tr
                        key={row.label}
                        className={cn(
                          'border-0 bg-transparent',
                          // Rows keep the design's 74px pitch even when a figure takes two lines;
                          // the last one runs on to the table's bottom rule.
                          r === t.rows.length - 1 ? 'h-[170px]' : 'h-[74px]'
                        )}
                      >
                        <th
                          className={cn(
                            RULE,
                            cell,
                            'border-r bg-transparent pl-[20px] text-left font-normal text-white lg:pl-[41px]'
                          )}
                        >
                          {row.label}
                          {row.note && (
                            <span className='mt-[8px] block max-w-[133px] text-[12px] leading-[1.3] text-olake-muted-on-dark'>
                              {row.note}
                            </span>
                          )}
                        </th>
                        <td className={cn(RULE, cell, 'border-r text-center text-white')}>
                          <Figure value={row.olake} />
                        </td>
                        {row.competitors.map((value, i) => (
                          <td
                            key={`${row.label}-${t.competitors[i]}`}
                            className={cn(
                              RULE,
                              cell,
                              'text-center',
                              row.highlight
                                ? 'text-olake-blue-on-dark'
                                : 'text-olake-muted-on-dark',
                              i < row.competitors.length - 1 && 'border-r'
                            )}
                          >
                            <Figure value={value} />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className={cn(
                RULE,
                'flex flex-col items-center border-y px-[24px] py-[56px] text-center lg:py-[96px]'
              )}
            >
              <p className='text-[16px] leading-[1.3] text-white lg:text-[20px]'>
                {t.sourceName} benchmarks coming soon
              </p>
              <p className='mt-[8px] max-w-[420px] text-[13px] leading-[1.6] text-olake-muted-on-dark lg:text-[14px]'>
                We&apos;re running head-to-head {t.sourceName} ingestion tests now. Check back
                shortly for the full comparison.
              </p>
            </div>
          )}
        </div>

        <div className='go-mono px-[20px] pt-[33px] pb-[48px] lg:pb-[53px] lg:pl-[41px]'>
          <p className='text-[15px] leading-[1.3] text-[#fdfdfd] lg:text-[16px]'>
            {GO_BENCHMARK_HOW.title}
          </p>
          <div className='mt-[16px] flex flex-col gap-[16px]'>
            {GO_BENCHMARK_HOW.items.map((item) => (
              <p
                key={item.term}
                className='max-w-[476px] text-[13px] leading-[1.3] font-light text-[#9e9e9e] lg:text-[14px]'
              >
                <span className='text-[#e5e5e5]'>{item.term}</span> / {item.body}
              </p>
            ))}
          </div>
        </div>

        <Link
          to={GO_BENCHMARK_LINK.href}
          className={cn(
            'flex h-[64px] items-center justify-center gap-[9px] rounded-t-[14px] bg-olake-surface-dark-2 text-[15px] leading-[1.3] text-[#eaeae3] transition-colors hover:text-white lg:text-[16px]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olake-blue-on-dark'
          )}
        >
          {GO_BENCHMARK_LINK.label}
          <img
            src='/img/landing/go/benchmark-arrow-square-out.svg'
            alt=''
            width={18}
            height={18}
            loading='lazy'
            decoding='async'
            className='block'
          />
        </Link>
      </div>
    </section>
  )
}
