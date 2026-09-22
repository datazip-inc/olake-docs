import React from 'react'
import Link from '@docusaurus/Link'
import SectionHeading from '../ui/SectionHeading'
import { ENGINES } from '@site/src/data/landing/home/engines'

export default function TwoEngines() {
  return (
    <section className='px-[32px] py-[56px] lg:px-[24px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px]'>
        <SectionHeading
          eyebrow='Two Engines'
          title={
            <span className='text-[38px] lg:text-[44px] leading-[1.2]'>
              Move data fast,
              <br className='lg:hidden' /> keep it fast
            </span>
          }
          align='center'
        />

        <div className='mt-[28px] lg:mt-[44px]'>
          <div className='mx-auto grid w-full max-w-[1016px] grid-cols-1 gap-[20px] lg:grid-cols-2 lg:gap-[24px]'>
            {ENGINES.map((engine) => (
              <article
                key={engine.name}
                className='flex h-full w-full flex-col overflow-hidden rounded-[14px] border border-solid border-[#ececec] bg-white'
              >
                <img
                  src={engine.art}
                  alt=''
                  width={490}
                  height={281}
                  loading='lazy'
                  decoding='async'
                  className='block h-[186px] w-full object-cover lg:h-[290px]'
                />
                <div className='flex flex-1 flex-col px-[16px] pb-[20px] pt-[18px] lg:px-[24px] lg:pb-[24px] lg:pt-[22px]'>
                  <p className='text-[18px] text-[#202020] lg:text-[20px]'>
                    {engine.brand} <span className='text-[#7a7a7a]'>{engine.name}</span>
                  </p>
                  <p className='mt-[8px] text-[13px] leading-[1.55] text-[#5d5d5d] lg:text-[14px]'>
                    {engine.body}
                  </p>

                  <div className='mt-[18px] grid grid-cols-2 gap-[16px] pb-[18px]'>
                    {engine.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className='text-[18px] text-[#202020] lg:text-[20px]'>{stat.value}</p>
                        <p className='mt-[4px] text-[12px] leading-[1.4] text-[#8a8a8a]'>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className='mt-auto h-px w-full bg-[#ececec]' aria-hidden='true' />
                  <div className='flex items-center gap-[10px] pt-[18px]'>
                    <Link
                      to={engine.href}
                      className='inline-flex h-[32px] items-center rounded-[8px] border border-solid border-[rgba(150,171,254,0.6)] bg-[#0029ce] px-[14px] text-[13px] text-[#e7e7e0] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] transition-all hover:bg-[#0021a3] hover:text-white'
                    >
                      {engine.linkLabel}
                    </Link>
                    {engine.note && (
                      <span className='inline-flex h-[28px] items-center rounded-[8px] border border-solid border-[#ececec] px-[10px] text-[12px] text-[#8a8a8a]'>
                        {engine.note}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
