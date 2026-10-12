import React, { useRef, useState } from 'react'
import { cn } from '@site/src/lib/utils'
import { GO_FEATURES, GO_FEATURES_INTRO } from '@site/src/data/landing/go/features'
import GoFeatureMock from './GoFeatureMock'

const IMG = '/img/landing/go'

/**
 * "Features": a pill tab strip over the blue feature card. The card keeps the job-editor picture
 * for every tab; its heading and copy follow the selected capability.
 */
export default function GoFeatures() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    setActive(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = GO_FEATURES.length - 1
    if (event.key === 'ArrowRight') select(index === last ? 0 : index + 1)
    else if (event.key === 'ArrowLeft') select(index === 0 ? last : index - 1)
    else if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(last)
    else return
    event.preventDefault()
  }

  const feature = GO_FEATURES[active]

  return (
    <section id='features' className='px-[16px] pb-[48px] lg:px-[24px] lg:pb-[96px]'>
      <div className='mx-auto max-w-[1018px] rounded-[20px] border border-solid border-olake-line-rule bg-olake-surface px-[12px] pt-[40px] pb-[12px] lg:rounded-[24px] lg:px-[19px] lg:pt-[70px] lg:pb-[20px]'>
        <div className='px-[8px] text-center'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
            {GO_FEATURES_INTRO.eyebrow}
          </p>
          <h2 className='mx-auto mt-[10px] max-w-[596px] text-[30px] leading-[1.2] font-normal text-balance text-olake-ink lg:mt-[12px] lg:text-[48px] lg:leading-[56px]'>
            {GO_FEATURES_INTRO.title}
          </h2>
        </div>

        <div
          role='tablist'
          aria-label='OLake Go features'
          className='mt-[28px] flex [scrollbar-width:none] overflow-x-auto lg:mt-[62px] lg:justify-center'
        >
          {GO_FEATURES.map((item, i) => {
            const selected = i === active
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type='button'
                role='tab'
                id={`go-feature-tab-${item.id}`}
                aria-selected={selected}
                aria-controls='go-feature-panel'
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
                className={cn(
                  'shrink-0 cursor-pointer rounded-[16px] border-0 px-[18px] py-[4px] text-[16px] leading-[1.3] whitespace-nowrap transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue',
                  selected
                    ? 'bg-[#eeeeee] text-[rgba(0,0,0,0.88)]'
                    : 'bg-transparent text-olake-muted hover:text-olake-ink'
                )}
              >
                {item.tab}
              </button>
            )
          })}
        </div>

        <div
          role='tabpanel'
          id='go-feature-panel'
          aria-labelledby={`go-feature-tab-${feature.id}`}
          className='relative isolate mt-[24px] flex flex-col overflow-hidden rounded-[24px] border border-solid border-[#f4f4f4] bg-(--go-blue-deep) shadow-[1px_2px_4px_0_rgba(0,0,0,0.05)] lg:mt-[47px] lg:block lg:h-[526px] lg:rounded-[30px]'
        >
          {/* Dithered blue field, anchored to the top right, and the blue glow at the bottom left */}
          <img
            src={`${IMG}/feature-cdc-background.png`}
            alt=''
            width={2384}
            height={1000}
            loading='lazy'
            decoding='async'
            className='pointer-events-none absolute top-[-41px] right-[-1px] -z-10 block h-[1107px] w-[2639px] max-w-none object-cover'
          />
          <img
            src={`${IMG}/feature-glow.svg`}
            alt=''
            width={1112}
            height={802}
            loading='lazy'
            decoding='async'
            className='pointer-events-none absolute bottom-[-321px] left-[-391px] -z-10 block max-w-none'
          />

          <div
            key={feature.id}
            className='go-fade-in px-[24px] pt-[28px] lg:absolute lg:bottom-[63px] lg:left-[49px] lg:w-[323px] lg:p-0'
          >
            <h3 className='text-[22px] leading-[1.3] font-medium text-[#fdfdfc] lg:w-[258px] lg:text-[24px]'>
              {feature.title}
            </h3>
            <p className='mt-[8px] text-[14px] leading-[1.3] text-white'>{feature.body}</p>
          </div>

          <GoFeatureMock className='mx-auto mt-[28px] mb-[16px] w-[calc(100%-32px)] lg:absolute lg:top-[52px] lg:right-[36px] lg:m-0 lg:w-[514px]' />
        </div>
      </div>
    </section>
  )
}
