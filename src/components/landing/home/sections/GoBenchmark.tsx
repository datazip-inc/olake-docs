import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { useGoBenchmarkTable } from '../useGoBenchmarkTable'
import SectionHeading from '../ui/SectionHeading'

const ExternalMark = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
    <path
      d='M4 2h6v6M10 2 3 9'
      stroke='currentColor'
      strokeWidth='1.2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const MODES = [
  { id: 'full_load', label: 'Full Load' },
  { id: 'cdc', label: 'CDC' }
] as const

export default function GoBenchmark() {
  const t = useGoBenchmarkTable()
  const rowsSynced = t.rows[0]?.olake ?? '-'
  const modeLabel = t.mode === 'cdc' ? 'CDC' : 'full load'

  return (
    <section className='lakeside-benchmark-section px-0 pb-[56px] pt-[56px] lg:pb-[72px] lg:pt-[96px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <div className='px-[20px] lg:px-[34px]'>
          <SectionHeading
            eyebrow='Benchmarks'
            title={
              <>
                4.01 billion rows processed in
                <br className='hidden lg:block' /> less than 2 hours. For $6
              </>
            }
          />
        </div>

        <div className='lakeside-benchmark-panel mt-[24px] p-[12px] lg:mt-[32px] lg:p-[14px]'>
          <div className='border-0 overflow-hidden rounded-[16px] bg-[#1a1a1a]'>
          <div className='flex flex-col gap-[12px] px-[20px] pb-[16px] pt-[22px] lg:flex-row lg:items-start lg:justify-between lg:px-[28px] lg:pt-[26px]'>
            <p className='text-[14px] leading-[1.45] text-[#e7e7e0] lg:text-[16px]'>
              Time to move {rowsSynced} rows,
              <br className='hidden lg:block' /> {t.sourceName} to Apache Iceberg, {modeLabel}
            </p>
            <Link
              to='/docs/benchmarks/ingestion/'
              className='inline-flex items-center gap-[6px] text-[13px] text-[#6b8afd] transition-colors hover:text-[#9ab0ff] lg:text-[14px]'
            >
              View OLake Go benchmarks
              <ExternalMark />
            </Link>
          </div>

          <div className='flex flex-col gap-[10px] px-[20px] pb-[14px] lg:flex-row lg:items-center lg:justify-between lg:px-[28px]'>
            <div className='flex items-center gap-[16px]'>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type='button'
                  onClick={() => t.setMode(m.id)}
                  aria-pressed={t.mode === m.id}
                  className={cn(
                    'cursor-pointer border-none bg-transparent p-0 text-[13px] transition-colors',
                    t.mode === m.id ? 'text-[#e7e7e0]' : 'text-[#6f6f6f] hover:text-[#b5b5b5]'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className='-mx-[4px] flex items-center gap-[14px] overflow-x-auto px-[4px]'>
              {t.connectors.map((c) => (
                <button
                  key={c.id}
                  type='button'
                  onClick={() => t.setActiveConnector(c.id)}
                  aria-pressed={t.activeConnector === c.id}
                  className={cn(
                    'shrink-0 cursor-pointer border-none bg-transparent p-0 text-[13px] transition-colors',
                    t.activeConnector === c.id
                      ? 'text-[#e7e7e0]'
                      : 'text-[#6f6f6f] hover:text-[#b5b5b5]'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full min-w-[720px] border-0 border-collapse border-none text-left'>
              <thead>
                <tr className='border-0 border-y border-solid border-[#2b2b2b] bg-transparent'>
                  <th className='w-[210px] border-0 border-r border-solid border-[#2b2b2b] bg-transparent px-[20px] py-[16px] text-[13px] font-normal text-[#8a8a8a] lg:px-[28px]'>
                    Metrics
                  </th>
                  <th className='border-0 border-x border-solid border-[#2b2b2b] bg-transparent px-[16px] py-[14px] text-center font-normal'>
                    <span className='block text-[13px] text-[#6b8afd]'>{t.olakeLabel}</span>
                    <span className='block text-[11px] text-[#8a8a8a]'>{t.olakeSub}</span>
                  </th>
                  {t.competitors.map((name) => (
                    <th
                      key={name}
                      className='border-0 border-r border-solid border-[#2b2b2b] bg-transparent px-[16px] py-[16px] text-center text-[13px] font-normal text-[#8a8a8a]'
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
                    className='border-0 border-b border-solid border-[#2b2b2b] bg-transparent'
                  >
                    <th className='border-0 border-r border-solid border-[#2b2b2b] bg-transparent px-[20px] py-[18px] text-left align-top font-normal lg:px-[28px]'>
                      <span className='block text-[13px] text-[#d4d4d4]'>{row.label}</span>
                      {row.note && (
                        <span className='mt-[6px] block max-w-[170px] text-[11px] leading-[1.45] text-[#6f6f6f]'>
                          {row.note}
                        </span>
                      )}
                    </th>
                    <td className='border-0 border-x border-solid border-[#2b2b2b] px-[16px] py-[18px] text-center align-top text-[13px] text-[#e7e7e0]'>
                      {row.olake}
                    </td>
                    {row.competitors.map((value, i) => (
                      <td
                        key={`${row.label}-${t.competitors[i]}`}
                        className={cn(
                          'border-0 border-r border-solid border-[#2b2b2b] px-[16px] py-[18px] text-center align-top text-[13px]',
                          row.highlight ? 'text-[#6b8afd]' : 'text-[#9b9b9b]'
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

            {t.comingSoon && (
              <p className='px-[20px] py-[18px] text-[12px] text-[#8a8a8a] lg:px-[28px]'>
                {t.sourceName} {t.mode === 'cdc' ? 'CDC' : 'full load'} benchmarks are in progress.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
