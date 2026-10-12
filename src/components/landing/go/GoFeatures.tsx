import React, { useRef, useState } from 'react'
import { cn } from '@site/src/lib/utils'
import { GO_FEATURES, GO_FEATURES_INTRO } from '@site/src/data/landing/go/features'
import GoFeatureMock from './GoFeatureMock'
import { ChunkingMock, ResumableMock, SchemaMock } from './GoFeaturePanels'

const IMG = '/img/landing/go'

/** The dotted field shared by the last three tabs, placed and flipped as each of their frames has it. */
const field = (className: string) => (
  <img
    src={`${IMG}/feature-background.png`}
    alt=''
    width={2172}
    height={1000}
    decoding='async'
    className={cn(
      'pointer-events-none absolute top-[-1px] -z-10 block h-[711px] w-[1545px] max-w-none object-cover',
      className
    )}
  />
)

/**
 * Each tab's picture (the design's go-1 to go-4 frames): the background field, where the copy sits
 * from lg up (its top, and the body's width) and the editor panel with its lg position.
 */
const ART: Record<
  string,
  {
    background: React.ReactNode
    copyTop: number
    bodyWidth: number
    Mock: React.ComponentType<{ className?: string }>
    mockClassName: string
  }
> = {
  'cdc': {
    background: (
      <img
        src={`${IMG}/feature-cdc-background.png`}
        alt=''
        width={2384}
        height={1000}
        loading='lazy'
        decoding='async'
        className='pointer-events-none absolute top-[-41px] right-[-1px] -z-10 block h-[1107px] w-[2639px] max-w-none object-cover'
      />
    ),
    copyTop: 338,
    bodyWidth: 323,
    Mock: GoFeatureMock,
    mockClassName: 'lg:top-[52px] lg:right-[36px] lg:w-[514px]'
  },
  'schema-evolution': {
    background: field('right-[-281px]'),
    copyTop: 338,
    bodyWidth: 323,
    Mock: SchemaMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  },
  'parallel-chunking': {
    background: field('right-[-129px] -scale-x-100'),
    copyTop: 354,
    bodyWidth: 288,
    Mock: ChunkingMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  },
  'resumable-syncs': {
    background: field('right-[-129px] -scale-y-100'),
    copyTop: 333,
    bodyWidth: 288,
    Mock: ResumableMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  }
}

/**
 * "Features": a pill tab strip over the blue feature card. Each tab shows its own picture of the
 * job editor; the heading and copy follow the selected capability.
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
  const art = ART[feature.id]

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
          {/* The tab's dotted field, and the blue glow at the bottom left that every tab shares */}
          <React.Fragment key={`field-${feature.id}`}>{art.background}</React.Fragment>
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
            key={`copy-${feature.id}`}
            className='go-fade-in px-[24px] pt-[28px] lg:absolute lg:top-(--copy-top) lg:left-[49px] lg:w-[323px] lg:p-0'
            style={{ '--copy-top': `${art.copyTop}px` } as React.CSSProperties}
          >
            <h3 className='text-[22px] leading-[1.3] font-medium text-[#fdfdfc] lg:w-[258px] lg:text-[24px]'>
              {feature.title}
            </h3>
            <p
              className='mt-[8px] text-[14px] leading-[1.3] text-white lg:max-w-(--body-width)'
              style={{ '--body-width': `${art.bodyWidth}px` } as React.CSSProperties}
            >
              {feature.body}
            </p>
          </div>

          <art.Mock
            key={`mock-${feature.id}`}
            className={cn(
              'go-fade-in mx-auto mt-[28px] mb-[16px] w-[calc(100%-32px)] lg:absolute lg:m-0',
              art.mockClassName
            )}
          />
        </div>
      </div>
    </section>
  )
}
