// components/WebinarGrid.tsx

import React from 'react'
import Link from '@docusaurus/Link'
import { CARD_CLASS } from '@site/src/components/landing/ui/Card'
import { cn } from '@site/src/lib/utils'
import { PiArrowRight, PiCalendarBlank } from 'react-icons/pi'

interface Webinar {
  title: string
  subtitle: string
  route: string
  img: string
  alt: string
  status: string
  button: string
  CTA: string
  date: string
  /** Kept for the callers' data; the card always shows the same arrow. */
  icon?: unknown
}

interface WebinarGridProps {
  webinars: Webinar[]
}

/** Outlined cards: cover, date, title, summary and a watch/register line. Each card is one link. */
const WebinarGrid: React.FC<WebinarGridProps> = ({ webinars }) => {
  return (
    <ul className='grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[16px]'>
      {webinars.map((webinar) => (
        <li key={webinar.route} className='flex'>
          <Link
            to={webinar.route}
            className={cn(
              CARD_CLASS,
              'group lk-lift flex w-full flex-col gap-[16px] p-[12px] text-olake-ink lg:p-[16px]'
            )}
          >
            <img
              src={webinar.img}
              alt={webinar.alt}
              width={640}
              height={360}
              loading='lazy'
              decoding='async'
              className='block aspect-[16/9] h-auto w-full rounded-[10px] border border-solid border-olake-line object-cover'
            />
            <div className='flex grow flex-col px-[4px] pb-[4px]'>
              <p className='flex items-center gap-[6px] text-[13px] text-olake-muted'>
                <PiCalendarBlank aria-hidden='true' />
                <span>{webinar.date}</span>
              </p>
              <h3 className='mt-[10px] line-clamp-2 text-[17px] leading-[1.35] font-normal text-olake-ink'>
                {webinar.title}
              </h3>
              <p className='mt-[8px] line-clamp-3 grow text-[14px] leading-[1.6] text-olake-text-2'>
                {webinar.subtitle}
              </p>
              <p className='mt-[16px] flex items-center justify-between text-[14px] font-medium text-olake-muted transition-colors group-hover:text-olake-blue lg:text-[15px]'>
                <span>{webinar.status === 'upcoming' ? 'Register Now' : 'Watch Recording'}</span>
                <PiArrowRight
                  aria-hidden='true'
                  className='transition-transform duration-200 group-hover:translate-x-[3px]'
                />
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default WebinarGrid
