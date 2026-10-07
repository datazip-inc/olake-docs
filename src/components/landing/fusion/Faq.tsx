import React, { useState } from 'react'
import { PiCaretDown } from 'react-icons/pi'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { FAQS, FAQ_TITLE } from '@site/src/data/landing/fusion/faqs'
import { cn } from '@site/src/lib/utils'

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'

/** One-open-at-a-time accordion. Answers stay in the DOM (hidden) so they remain readable to crawlers. */
export default function Faq() {
  const [open, setOpen] = useState(-1)
  return (
    <Section id='faq'>
      <div className='grid gap-[24px] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[48px]'>
        <SectionHeading title={FAQ_TITLE} />
        <ul className='border-0 border-t border-solid border-olake-line p-0'>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <li key={faq.q} className='border-0 border-b border-solid border-olake-line'>
                <h3 className='mb-0 text-[16px] font-normal leading-[1.4] text-olake-ink lg:text-[18px]'>
                  <button
                    type='button'
                    id={`fusion-faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`fusion-faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className={cn(
                      'flex w-full cursor-pointer appearance-none items-center justify-between gap-[16px] border-0 bg-transparent px-0 py-[18px] text-left text-inherit [font:inherit] lg:py-[22px]',
                      FOCUS
                    )}
                  >
                    <span>{faq.q}</span>
                    <PiCaretDown
                      size={18}
                      aria-hidden='true'
                      className={cn(
                        'shrink-0 text-olake-muted transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`fusion-faq-a-${i}`}
                  role='region'
                  aria-labelledby={`fusion-faq-q-${i}`}
                  hidden={!isOpen}
                >
                  <p className='pb-[20px] pr-[32px] text-[13px] leading-[1.65] text-olake-text-2 lg:pb-[24px] lg:text-[15px]'>
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
