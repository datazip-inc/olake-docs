import React from 'react'
import Link from '@docusaurus/Link'
import Card from '@site/src/components/landing/ui/Card'
import { CustomerStory } from '../../types/customer'

type CustomerCardProps = Pick<
  CustomerStory,
  'title' | 'description' | 'route' | 'img' | 'imgWidth' | 'imgHeight' | 'alt' | 'companyName' | 'category'
> & {
  /** First card on the page: its cover is above the fold, so it loads eagerly. */
  priority?: boolean
}

const Arrow = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden='true' className='shrink-0 transition-transform group-hover:translate-x-[2px]'>
    <path d='M1 7h12M8 2l5 5-5 5' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

/**
 * One story tile on the list: cover, company and category, headline, summary. The headline is the
 * link and its ::after stretches over the whole card, so the card is clickable and crawlable.
 */
export default function CustomerCard({
  title,
  description,
  route,
  img,
  imgWidth,
  imgHeight,
  alt,
  companyName,
  category,
  priority
}: CustomerCardProps) {
  return (
    <Card
      as='article'
      className='group relative flex h-full flex-col gap-[16px] p-[12px] lg:p-[16px] lk-lift'
    >
      <div className='overflow-hidden rounded-[10px] border border-solid border-olake-line bg-white'>
        <img
          src={img}
          alt={alt}
          width={imgWidth}
          height={imgHeight}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding='async'
          className='block aspect-[2/1] h-auto w-full object-contain'
        />
      </div>

      <div className='flex grow flex-col px-[4px] pb-[4px]'>
        <div className='flex items-center justify-between gap-[12px]'>
          <span className='text-[14px] font-medium text-olake-ink'>{companyName}</span>
          <span className='rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[8px] py-[2px] text-[12px] leading-[1.5] text-olake-text-2'>
            {category}
          </span>
        </div>

        <h3 className='mt-[12px] text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[18px]'>
          <Link
            to={route}
            className='text-olake-ink no-underline hover:text-olake-ink hover:no-underline focus-visible:outline-none after:absolute after:inset-0 after:rounded-[16px] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-olake-blue'
          >
            <span className='line-clamp-4'>{title}</span>
          </Link>
        </h3>

        <p className='mt-[10px] line-clamp-3 text-[13px] leading-[1.6] text-olake-text-2 lg:text-[14px]'>
          {description}
        </p>

        <div className='min-h-[16px] grow' aria-hidden='true' />

        <span className='flex items-center justify-between pt-[4px] text-[14px] font-medium text-olake-muted transition-colors group-hover:text-olake-blue lg:text-[15px]'>
          Read story
          <Arrow />
        </span>
      </div>
    </Card>
  )
}
