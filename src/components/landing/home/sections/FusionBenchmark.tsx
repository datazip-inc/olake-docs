import React from 'react'
import Link from '@docusaurus/Link'
import SectionHeading from '../ui/SectionHeading'
import { FUSION_BENCHMARK } from '@site/src/data/landing/home/fusionBenchmark'

const ExternalMark = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
    <polyline points='15 3 21 3 21 9' />
    <line x1='10' y1='14' x2='21' y2='3' />
  </svg>
)

export default function FusionBenchmark() {
  const b = FUSION_BENCHMARK

  return (
    <section className='px-0 pb-[56px] lg:pb-[96px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <div className='px-[20px] lg:px-[34px]'>
          <SectionHeading
            className='[&_h2]:text-[28px]'
            title={
              <>
                1 Parameter, 1.8 billion rows compacted
                <br className='hidden lg:block' /> in 27 minutes.
              </>
            }
          />
        </div>

        <div className='mt-[24px] p-[12px] lg:mt-[32px] lg:p-[14px]'>
          {/* One flat grey card: a header band, then columns split by vertical
              rules only — no row lines, which is what the design shows. */}
          <div className='overflow-hidden rounded-[16px] bg-[#f4f4f4]'>
            <div className='flex flex-col gap-[8px] border-0 border-b border-solid border-[#e3e3e3] px-[20px] py-[18px] lg:flex-row lg:items-center lg:justify-between lg:px-[28px] lg:py-[22px]'>
              <p className='text-[15px] text-[#202020] lg:text-[17px]'>{b.title}</p>
              <Link
                to={b.linkHref}
                className='inline-flex items-center gap-[6px] text-[13px] text-[#2b5bf0] transition-opacity hover:opacity-80 lg:text-[14px]'
              >
                {b.linkLabel}
                <ExternalMark />
              </Link>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full min-w-[560px] border-collapse border-none bg-transparent text-left'>
                <thead>
                  <tr className='bg-transparent'>
                    <th className='w-[34%] border-0 border-r border-solid border-[#e3e3e3] bg-transparent px-[20px] pb-[10px] pt-[26px] lg:px-[36px]' />
                    <th className='border-0 border-r border-solid border-[#e3e3e3] bg-transparent px-[16px] pb-[10px] pt-[26px] text-center text-[14px] font-normal text-[#2b5bf0]'>
                      {b.fusionLabel}
                    </th>
                    <th className='bg-transparent px-[16px] pb-[10px] pt-[26px] text-center text-[14px] font-normal text-[#494949]'>
                      {b.sparkLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, i) => (
                    <tr key={row.metric} className='bg-transparent'>
                      <th className='border-0 border-r border-solid border-[#e3e3e3] bg-transparent px-[20px] py-[18px] text-left text-[14px] font-normal text-[#3d3d3d] lg:px-[36px]'>
                        {row.metric}
                      </th>
                      <td className='border-0 border-r border-solid border-[#e3e3e3] px-[16px] py-[18px] text-center'>
                        <span className='inline-flex items-center gap-[10px] text-[14px] text-[#202020]'>
                          {row.fusion}
                          <span className='rounded-[6px] bg-[#dff5d0] px-[8px] py-[3px] text-[12px] text-[#2f6b1f]'>
                            {row.delta}
                          </span>
                        </span>
                      </td>
                      <td
                        className={`px-[16px] py-[18px] text-center text-[14px] text-[#5d5d5d] ${
                          i === b.rows.length - 1 ? 'pb-[34px]' : ''
                        }`}
                      >
                        {row.spark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
