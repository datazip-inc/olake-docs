import React, { useState } from 'react'
import { cn } from '@site/src/lib/utils'

export interface ProductFaqItem {
  q: string
  a: string
}

/**
 * The FAQ card of a product page: accordion, one answer open at a time (the first one to start
 * with). Answers stay in the DOM (hidden) so the text the page's FAQPage JSON-LD describes is
 * always on the page.
 */
export default function ProductFaq({
  idPrefix,
  eyebrow,
  title,
  faqs
}: {
  /** Prefix of the question and answer ids, e.g. 'go-faq'. */
  idPrefix: string
  eyebrow: string
  title: string
  faqs: ProductFaqItem[]
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id='faq' className='px-[16px] pb-[72px] lg:px-[24px] lg:pb-[116px]'>
      <div className='mx-auto max-w-[1018px] overflow-hidden rounded-[20px] border border-solid border-olake-line-rule bg-olake-surface'>
        <div className='px-[20px] pt-[32px] lg:px-[32px] lg:pt-[39px]'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>{eyebrow}</p>
          <h2 className='mt-[8px] text-[26px] leading-[1.3] font-normal text-[#000e55] lg:text-[32px]'>
            {title}
          </h2>
        </div>

        <ul className='mt-[16px] flex flex-col gap-[8px] lg:mt-[24px]'>
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <li
                key={faq.q}
                className='relative border-0 border-b border-solid border-olake-line-rule last:border-b-0'
              >
                <h3>
                  <button
                    type='button'
                    id={`${idPrefix}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${idPrefix}-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={cn(
                      'block w-full cursor-pointer border-0 bg-transparent pr-[52px] pl-[20px] text-left text-[16px] leading-[24px] font-normal text-[#2f2f2f] lg:pr-[120px] lg:pl-[40px] lg:text-[18px]',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olake-blue',
                      isOpen ? 'pt-[24px] pb-0' : 'py-[24px] lg:py-[32px]'
                    )}
                  >
                    {faq.q}
                    {/* Centred on the whole item, so it sits between question and answer when open. */}
                    <img
                      src={`/img/landing/product/faq-arrow-${isOpen ? 'open' : 'closed'}.webp`}
                      alt=''
                      width={16}
                      height={16}
                      decoding='async'
                      className={cn(
                        'absolute top-1/2 right-[20px] block -translate-y-1/2 lg:right-[40px]',
                        isOpen && '-scale-y-100'
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`${idPrefix}-a-${i}`}
                  role='region'
                  aria-labelledby={`${idPrefix}-q-${i}`}
                  hidden={!isOpen}
                  className={cn('product-fade-in', !isOpen && 'hidden')}
                >
                  <p className='max-w-[858px] pt-[16px] pr-[52px] pb-[24px] pl-[20px] text-[15px] leading-[24px] text-[#626262] lg:pr-0 lg:pl-[40px] lg:text-[16px]'>
                    {faq.a}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
