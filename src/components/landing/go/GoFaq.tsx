import React, { useState } from 'react'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { cn } from '@site/src/lib/utils'
import { GO_FAQS, GO_FAQ_TITLE } from '@site/src/data/landing/go/faq'

const Plus = ({ open }: { open: boolean }) => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 14 14'
    fill='none'
    aria-hidden='true'
    className={cn('shrink-0 text-olake-muted transition-transform duration-200', open && 'rotate-45')}
  >
    <path d='M7 1v12M1 7h12' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
  </svg>
)

/**
 * Accordion, one answer open at a time. Answers stay in the DOM (hidden) so the text the FAQPage
 * JSON-LD describes is always on the page.
 */
export default function GoFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Section id='faq'>
      <div className='grid grid-cols-1 gap-[24px] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[40px]'>
        <SectionHeading title={GO_FAQ_TITLE} />
        <ul className='border-0 border-t border-solid border-olake-line-rule'>
          {GO_FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <li key={faq.q} className='border-0 border-b border-solid border-olake-line-rule'>
                <h3>
                  <button
                    type='button'
                    id={`go-faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`go-faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className='flex w-full cursor-pointer items-center justify-between gap-[16px] border-0 bg-transparent px-0 py-[18px] text-left text-[16px] font-normal leading-[1.4] text-olake-ink focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue lg:py-[22px] lg:text-[18px]'
                  >
                    {faq.q}
                    <Plus open={isOpen} />
                  </button>
                </h3>
                <div
                  id={`go-faq-a-${i}`}
                  role='region'
                  aria-labelledby={`go-faq-q-${i}`}
                  hidden={!isOpen}
                  className={cn(!isOpen && 'hidden')}
                >
                  <p className='max-w-[640px] pb-[22px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                    {faq.a}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
