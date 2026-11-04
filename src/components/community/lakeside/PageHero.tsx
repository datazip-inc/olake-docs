import React from 'react'
import { cn } from '@site/src/lib/utils'

/**
 * Hero for the community, webinar and event pages. It is rendered inside `.lakeside-hero-bg` by
 * LakesidePage (so the streak background sits behind the pill navbar), exactly like GoHero.
 * `size='md'` is for the detail pages, whose titles are long sentences.
 */
export default function PageHero({
  badge,
  breadcrumbs,
  title,
  description,
  actions,
  size = 'lg'
}: {
  badge?: React.ReactNode
  breadcrumbs?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  size?: 'lg' | 'md'
}) {
  return (
    <section className='relative px-[32px] pt-[150px] pb-[56px] lg:px-[24px] lg:pt-[176px] lg:pb-[64px] [&_:is(h1,p,ul,ol)]:mb-0 [&_:is(ul,ol)]:pl-0'>
      <div className='mx-auto w-full max-w-[1016px] lg:text-center'>
        {breadcrumbs}
        {badge && (
          <p className='inline-flex items-center gap-[8px] rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[12px] py-[5px] text-[12px] tracking-wide text-olake-text-2 lg:text-[13px]'>
            {/* First image on the page and above the fold, so it is not lazy-loaded. */}
            <img
              src='/img/landing/shared/olake-mark-mono.svg'
              alt=''
              width={12}
              height={12}
              decoding='async'
              className='block h-[12px] w-[12px]'
            />
            {badge}
          </p>
        )}
        <h1
          className={cn(
            'olake-h1 mt-[16px] lg:mx-auto lg:mt-[22px]',
            size === 'lg' ? 'lg:max-w-[820px]' : 'lg:max-w-[860px]'
          )}
        >
          {title}
        </h1>
        {description && (
          <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-olake-text lg:mx-auto lg:mt-[20px] lg:text-[15px]'>
            {description}
          </p>
        )}
        {actions && (
          <div className='mt-[24px] flex flex-wrap items-center gap-[8px] lg:mt-[34px] lg:justify-center lg:gap-[12px]'>
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
