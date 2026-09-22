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
    <section className='bg-[#171717] px-[32px] lg:px-[24px]'>
      <div className='mx-auto w-full max-w-[1016px] text-[#e7e7e0]'>
        <div className='flex flex-col'>
          <div className='border border-solid border-[#2b2b2b]'>
            {latestReleaseLabel && (
            <div className='flex flex-col gap-[6px] rounded-b-[12px] bg-[#202020] px-[18px] py-[14px] lg:flex-row lg:items-center lg:gap-[18px] lg:px-[24px]'>
              <span className='whitespace-nowrap text-[13px] font-medium text-[#7a7a7a]'>Latest Release</span>
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

            <div className='pt-[32px] lg:pt-[48px]'>
              <div className='px-[20px] lg:px-[24px]'>
                <p className='text-[13px] text-[#8a8a8a] lg:text-[14px]'>
                  Latest News
                </p>
                <h2 className='mt-[6px] text-[26px] font-normal tracking-[-0.01em] lg:text-[38px]'>
                  OLake Bulletin
                </h2>
              </div>
            </div>

            <div className='mt-[24px] lg:mt-[36px] border-0 border-t border-solid border-[#2b2b2b]'>
              <div className='flex flex-col pb-[56px] lg:flex-row lg:pb-[96px]'>
                <div
                role='tablist'
              aria-label='Bulletin categories'
              className='flex overflow-x-auto border-0 border-b border-solid border-[#2b2b2b] lg:w-[260px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r'
            >
              {BULLETIN_TABS.map((t) => (
                <button
                  key={t.id}
                  role='tab'
                  type='button'
                  aria-selected={t.id === tab.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex items-center justify-center cursor-pointer whitespace-nowrap border-0 border-r last:border-r-0 lg:border-r-0 lg:border-b border-solid border-[#2b2b2b] px-[20px] py-[14px] text-left text-[14px] transition-colors lg:w-full lg:px-[24px] lg:py-[18px]',
                    t.id === tab.id
                      ? 'bg-[#1a1a1a] text-[#6b8afd]'
                      : 'bg-transparent text-[#8a8a8a] hover:text-[#e7e7e0]'
                  )}
                >
                  <span className={cn('mr-[8px] text-[16px] hidden lg:inline-block', t.id === tab.id ? 'opacity-100' : 'opacity-0')}>&bull;</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div className='flex-1 pt-[24px] lg:pt-[24px] min-h-[480px] lg:min-h-[520px]'>
              <h3 className='text-[18px] font-normal px-[20px] lg:text-[22px] lg:px-[36px]'>{tab.heading}</h3>
              <ul className='m-0 flex flex-col list-none p-0 mt-[16px]'>
                {tab.items.map((item) => (
                  <li
                    key={item.href}
                    className='border-0 border-b border-solid border-[#2b2b2b] py-[16px] first:pt-0 last:border-b-0'
                  >
                    <ItemLink item={item} className='flex items-start gap-[16px] text-[#e7e7e0] px-[20px] lg:px-[36px] w-full'>
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
                        <span className='mt-[6px] block text-[13px] text-[#6b8afd]'>{tab.id === 'webinars' ? 'Watch Now' : 'Read More'}</span>
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
      </div>
    </section>
  )
}
