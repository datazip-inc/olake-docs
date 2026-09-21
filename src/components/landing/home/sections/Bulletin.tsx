import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { BULLETIN_TABS, type BulletinItem } from '@site/src/data/landing/home/bulletin'

const ItemLink = ({
  item,
  className,
  children
}: {
  item: BulletinItem
  className?: string
  children: React.ReactNode
}) =>
  item.external ? (
    <a href={item.href} target='_blank' rel='noopener noreferrer' className={className}>
      {children}
    </a>
  ) : (
    <Link to={item.href} className={className}>
      {children}
    </Link>
  )

export interface BulletinProps {
  latestReleaseLabel?: string
  latestReleasePath?: string
}

export default function Bulletin({ latestReleaseLabel, latestReleasePath }: BulletinProps) {
  const [activeTab, setActiveTab] = useState(BULLETIN_TABS[0].id)
  const tab = BULLETIN_TABS.find((t) => t.id === activeTab) ?? BULLETIN_TABS[0]

  return (
    <section className='bg-[#141414] px-[32px] lg:px-[24px]'>
      <div className='mx-auto w-full max-w-[1016px] border-0 border-x border-solid border-[#2b2b2b] text-[#e7e7e0]'>
        <div className='flex flex-col'>
          {latestReleaseLabel && (
            <div className='flex flex-col gap-[6px] rounded-b-[12px] bg-[#1c1c1c] px-[18px] py-[14px] lg:flex-row lg:items-center lg:gap-[18px] lg:px-[24px]'>
              <span className='text-[12px] text-[#8a8a8a] lg:text-[13px]'>Latest Release</span>
              <span className='text-[14px] lg:text-[15px]'>
                We just released our {latestReleaseLabel}
              </span>
              <Link
                to={latestReleasePath || '/docs/release/ingestion'}
                className='text-[13px] text-[#6b8afd] transition-colors hover:text-[#9ab0ff] lg:ml-auto'
              >
                Read More
              </Link>
            </div>
          )}

          <div className='p-[20px] pb-[56px] pt-[32px] lg:p-[32px] lg:pb-[96px] lg:pt-[48px]'>
            <p className='text-[13px] text-[#8a8a8a] lg:text-[14px]'>
              Latest News
            </p>
            <h2 className='mt-[6px] text-[26px] font-normal tracking-[-0.01em] lg:text-[38px]'>
              OLake Bulletin
            </h2>

          <div className='mt-[24px] flex flex-col gap-[20px] lg:mt-[36px] lg:flex-row lg:gap-0'>
            <div
              role='tablist'
              aria-label='Bulletin categories'
              className='flex gap-[8px] overflow-x-auto border-0 border-solid border-[#2b2b2b] lg:w-[260px] lg:shrink-0 lg:flex-col lg:gap-0 lg:border-r'
            >
              {BULLETIN_TABS.map((t) => (
                <button
                  key={t.id}
                  role='tab'
                  type='button'
                  aria-selected={t.id === tab.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'cursor-pointer whitespace-nowrap rounded-[8px] border-none px-[14px] py-[10px] text-left text-[14px] transition-colors lg:rounded-none',
                    t.id === tab.id
                      ? 'bg-[#1f1f1f] text-[#6b8afd]'
                      : 'bg-transparent text-[#b5b5b5] hover:text-[#e7e7e0]'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className='flex-1 lg:pl-[36px]'>
              <h3 className='text-[18px] font-normal lg:text-[22px]'>{tab.heading}</h3>
              <ul className='mt-[16px] flex flex-col'>
                {tab.items.map((item) => (
                  <li
                    key={item.href}
                    className='border-0 border-b border-solid border-[#2b2b2b] py-[16px] first:pt-0'
                  >
                    <ItemLink item={item} className='flex items-start gap-[16px] text-[#e7e7e0]'>
                      <img
                        src={item.img}
                        alt=''
                        width={160}
                        height={160}
                        loading='lazy'
                        decoding='async'
                        className='h-[74px] w-[74px] shrink-0 rounded-[10px] object-cover lg:h-[96px] lg:w-[96px]'
                      />
                      <span className='block'>
                        <span className='block text-[12px] text-[#8a8a8a]'>{item.tag}</span>
                        <span className='mt-[4px] block text-[14px] leading-[1.4] lg:text-[16px]'>
                          {item.title}
                        </span>
                        <span className='mt-[6px] block text-[13px] text-[#6b8afd]'>Read More</span>
                      </span>
                    </ItemLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}
