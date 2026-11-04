import React from 'react'
import { cn } from '@site/src/lib/utils'
import BenchmarkShell, { RULE } from '../product/BenchmarkShell'
import { BENCHMARK, BENCHMARK_HOW } from '@site/src/data/landing/fusion/benchmark'

/** Column widths of the design's table (254, 380 and 367 of its 1001px). */
/** Column widths: the design's from sm up, a wider label column on phones so the table fits. */
const COLUMNS = ['w-[34%] sm:w-[25.37%]', 'w-[36%] sm:w-[37.96%]', 'w-[30%] sm:w-[36.67%]']

/** "Benchmarks" of the OLake Fusion page: Fusion against Spark compaction on the same workload. */
export default function FusionBenchmark() {
  const { headers } = BENCHMARK
  return (
    <BenchmarkShell
      eyebrow={BENCHMARK.eyebrow}
      title={BENCHMARK.title}
      summary={BENCHMARK.summary.map((part, i) => (
        <span key={i} className={part.bright ? 'text-[#f6f6f6]' : 'text-olake-muted-on-dark'}>
          {part.text}
        </span>
      ))}
      how={{
        title: BENCHMARK_HOW.title,
        className: 'lg:pt-[38px] lg:pb-[62px]',
        body: (
          <div className='flex max-w-[901px] flex-col gap-[16px]'>
            <p>{BENCHMARK_HOW.lead}</p>
            <ul role='list' className='m-0 ml-[2px]'>
              {BENCHMARK_HOW.tiers.map((tier) => (
                <li
                  key={tier.name}
                  className="before:mr-[6px] before:text-white before:content-['•']"
                >
                  <span className='text-white'>{tier.name}</span> {tier.text}
                </li>
              ))}
            </ul>
            <div>
              {BENCHMARK_HOW.outro.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        )
      }}
      link={BENCHMARK.link}
    >
      <div className={cn(RULE, 'mt-[33px] border-t lg:mt-[46px]')}>
        <h3 className='max-w-[426px] px-[20px] pt-[24px] pb-[24px] text-[18px] leading-[1.3] font-normal text-[#fdfdfc] lg:max-w-[447px] lg:pt-[27px] lg:pb-[25px] lg:pl-[41px] lg:text-[20px]'>
          {BENCHMARK.caption}
        </h3>
        <div className={cn(RULE, 'overflow-x-auto border-y')}>
          <table className='w-full table-fixed border-collapse border-0 text-left'>
            <colgroup>
              {COLUMNS.map((width) => (
                <col key={width} className={width} />
              ))}
            </colgroup>
            <thead>
              <tr className='h-[69px] border-0 bg-transparent'>
                <th
                  className={cn(
                    RULE,
                    'border-r bg-transparent pt-[21px] pr-[8px] pl-[12px] align-top text-[14px] leading-[1.3] font-normal text-olake-muted-on-dark sm:px-[20px] lg:pl-[41px]'
                  )}
                >
                  {headers.metric}
                </th>
                <th
                  className={cn(
                    RULE,
                    'border-r bg-transparent px-[8px] pt-[16px] text-center align-top leading-[1.3] font-normal'
                  )}
                >
                  <span className='block text-[14px] text-olake-blue-on-dark'>
                    {headers.fusionBrand}{' '}
                    <span className='font-light'>{headers.fusionProduct}</span>
                  </span>
                  <span className='block text-[12px] text-olake-muted-on-dark'>
                    {headers.fusionSub}
                  </span>
                </th>
                <th
                  className={cn(
                    RULE,
                    'bg-transparent px-[8px] pt-[23px] text-center align-top text-[14px] leading-[1.3] font-normal text-olake-muted-on-dark'
                  )}
                >
                  {headers.spark}
                </th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARK.rows.map((row, r) => {
                const cell = 'px-[8px] pt-[22px] align-top text-[14px] leading-[1.3]'
                return (
                  <tr
                    key={row.metric}
                    className={cn(
                      'border-0 bg-transparent',
                      r === BENCHMARK.rows.length - 1 ? 'h-[82px]' : 'h-[74px]'
                    )}
                  >
                    <th
                      className={cn(
                        RULE,
                        cell,
                        'border-r bg-transparent pl-[12px] text-left font-normal text-white sm:pl-[20px] lg:pl-[41px]'
                      )}
                    >
                      {row.metric}
                    </th>
                    <td className={cn(RULE, cell, 'border-r pt-[20px] text-center text-white')}>
                      <span className='inline-flex flex-col items-center gap-[6px] whitespace-nowrap sm:flex-row sm:gap-[14px]'>
                        {row.fusion}
                        <span className='rounded-[6px] bg-[rgba(7,14,53,0.59)] px-[5px] leading-[22px] text-olake-blue-on-dark'>
                          {row.delta}
                        </span>
                      </span>
                    </td>
                    <td className={cn(RULE, cell, 'text-center text-olake-muted-on-dark')}>
                      {row.spark}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </BenchmarkShell>
  )
}
