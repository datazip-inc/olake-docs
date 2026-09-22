import React from 'react'
import Link from '@docusaurus/Link'
import {
  ARCHITECTURE_GROUPS,
  ARCHITECTURE_GRAPH,
  ARCHITECTURE_INTRO
} from '@site/src/data/landing/home/architecture'
//TODO: Fix image for mobile view
export default function Architecture() {
  return (
    <section className='px-[32px] py-[56px] lg:px-[24px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px] overflow-hidden rounded-[16px] border border-solid border-[#ececec] bg-white'>
        <div className='px-[20px] pb-[26px] pt-[24px] lg:px-[64px] lg:pb-[34px] lg:pt-[44px]'>
          <p className='text-[13px] text-[#8a8a8a] lg:text-[14px]'>{ARCHITECTURE_INTRO.eyebrow}</p>
          <h2 className='mt-[6px] text-[38px] lg:text-[44px] font-normal leading-[1.2] tracking-[-0.01em] text-[#202020]'>
            Works with what
            <br className='lg:hidden' /> you run
          </h2>
          <p className='mt-[12px] max-w-[660px] text-[13px] leading-[1.6] text-[#5d5d5d] lg:text-[15px]'>
            {ARCHITECTURE_INTRO.body}
          </p>
          <Link
            to={ARCHITECTURE_INTRO.cta.href}
            className='mt-[18px] inline-flex h-[34px] items-center rounded-[8px] border border-solid border-[rgba(150,171,254,0.6)] bg-[#0029ce] px-[14px] text-[13px] text-[#e7e7e0] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] transition-all hover:bg-[#0021a3] hover:text-white lg:mt-[24px]'
          >
            {ARCHITECTURE_INTRO.cta.label}
          </Link>
        </div>

        <div className='border-0 border-t border-solid border-[#ececec] px-[20px] lg:px-[64px]'>
          {ARCHITECTURE_GROUPS.map((group, i) => (
            <div
              key={group.title}
              className={`relative py-[20px] pl-[18px] lg:py-[26px] ${
                i > 0 ? 'border-0 border-t border-solid border-[#f0f0f0]' : ''
              }`}
            >
              <span aria-hidden='true' className='absolute left-0 top-0 h-full w-px bg-[#ececec]' />
              <span
                aria-hidden='true'
                className='absolute left-[-3px] top-[26px] h-[7px] w-[7px] rounded-full bg-[#c9c9c9]'
              />
              <p className='text-[15px] text-[#202020] lg:text-[17px]'>{group.title}</p>
              <ul className='mt-[12px] flex flex-wrap gap-[8px] lg:mt-[14px] lg:gap-[10px]'>
                {group.chips.map((chip) => (
                  <li
                    key={chip}
                    className='rounded-[8px] border border-solid border-[#ececec] bg-[#fafafa] px-[12px] py-[6px] text-[12px] text-[#393939] lg:text-[13px]'
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='px-[12px] pb-[12px] lg:px-[26px] lg:pb-[26px]'>
          <img
            src={ARCHITECTURE_GRAPH.src}
            alt={ARCHITECTURE_GRAPH.alt}
            width={ARCHITECTURE_GRAPH.width}
            height={ARCHITECTURE_GRAPH.height}
            loading='lazy'
            decoding='async'
            className='block w-full rounded-[14px]'
          />
        </div>
      </div>
    </section>
  )
}
