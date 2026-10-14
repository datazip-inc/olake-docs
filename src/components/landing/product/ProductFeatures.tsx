import React, { useRef, useState } from 'react'
import { cn } from '@site/src/lib/utils'

/** A capability behind the tab strip. `tab` is the pill label, `title` the card heading. */
export interface ProductFeature {
  id: string
  tab: string
  title: string
  /** Line breaks ("\n") are kept. */
  body: string
}

/**
 * A tab's picture (one design frame): the background field, the glow at the bottom left, where the
 * copy sits from lg up (its top, and the body's width) and the editor mock-up with its lg position.
 */
export interface ProductFeatureArt {
  background: React.ReactNode
  glow: React.ReactNode
  copyTop: number
  bodyWidth: number
  Mock: React.ComponentType<{ className?: string }>
  mockClassName: string
}

/**
 * "Features": a pill tab strip over the blue feature card. Each tab shows its own picture of the
 * product; the heading and copy follow the selected capability. Every capability's heading and copy
 * stay in the DOM (the inactive ones hidden), as ProductFaq keeps its answers; only the selected
 * tab's picture is rendered, since the text is cheap and the picture is not. Arrow keys, Home and
 * End move between tabs.
 */
export default function ProductFeatures({
  idPrefix,
  intro,
  features,
  art,
  className
}: {
  /** Prefix of the tab and panel ids, e.g. 'go-feature'. */
  idPrefix: string
  intro: { eyebrow: string; title: string }
  features: ProductFeature[]
  art: Record<string, ProductFeatureArt>
  /** Section overrides, e.g. the gap to the next section. */
  className?: string
}) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    setActive(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = features.length - 1
    if (event.key === 'ArrowRight') select(index === last ? 0 : index + 1)
    else if (event.key === 'ArrowLeft') select(index === 0 ? last : index - 1)
    else if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(last)
    else return
    event.preventDefault()
  }

  const frame = art[features[active].id]

  return (
    <section
      id='features'
      className={cn('px-[16px] pb-[48px] lg:px-[24px] lg:pb-[96px]', className)}
    >
      <div className='mx-auto max-w-[1018px] rounded-[20px] border border-solid border-olake-line-rule bg-olake-surface px-[12px] pt-[40px] pb-[12px] lg:rounded-[24px] lg:px-[19px] lg:pt-[70px] lg:pb-[20px]'>
        <div className='px-[8px] text-center'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
            {intro.eyebrow}
          </p>
          <h2 className='mx-auto mt-[10px] max-w-[596px] text-[30px] leading-[1.2] font-normal text-balance text-olake-ink lg:mt-[12px] lg:text-[48px] lg:leading-[56px]'>
            {intro.title}
          </h2>
        </div>

        <div
          role='tablist'
          aria-label={intro.title}
          className='mt-[28px] flex [scrollbar-width:none] overflow-x-auto lg:mt-[62px] lg:justify-center'
        >
          {features.map((item, i) => {
            const selected = i === active
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type='button'
                role='tab'
                id={`${idPrefix}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${idPrefix}-panel-${item.id}`}
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

        <div className='relative isolate mt-[24px] flex flex-col overflow-hidden rounded-[24px] border border-solid border-[#f4f4f4] bg-(--product-blue-deep) shadow-[1px_2px_4px_0_rgba(0,0,0,0.05)] lg:mt-[47px] lg:block lg:h-[526px] lg:rounded-[30px]'>
          <React.Fragment key={`field-${features[active].id}`}>{frame.background}</React.Fragment>
          {frame.glow}

          {features.map((item, i) => {
            const selected = i === active
            return (
              <div
                key={item.id}
                role='tabpanel'
                id={`${idPrefix}-panel-${item.id}`}
                aria-labelledby={`${idPrefix}-tab-${item.id}`}
                hidden={!selected}
                className={cn(
                  'product-fade-in px-[24px] pt-[28px] lg:absolute lg:top-(--copy-top) lg:left-[49px] lg:w-[323px] lg:p-0',
                  !selected && 'hidden'
                )}
                style={{ '--copy-top': `${art[item.id].copyTop}px` } as React.CSSProperties}
              >
                <h3 className='text-[22px] leading-[1.3] font-medium text-[#fdfdfc] lg:w-[258px] lg:text-[24px]'>
                  {item.title}
                </h3>
                <p
                  className='mt-[8px] text-[14px] leading-[1.3] whitespace-pre-line text-white lg:max-w-(--body-width)'
                  style={{ '--body-width': `${art[item.id].bodyWidth}px` } as React.CSSProperties}
                >
                  {item.body}
                </p>
              </div>
            )
          })}

          <frame.Mock
            key={`mock-${features[active].id}`}
            className={cn(
              'product-fade-in mx-auto mt-[28px] mb-[16px] w-[calc(100%-32px)] lg:absolute lg:m-0',
              frame.mockClassName
            )}
          />
        </div>
      </div>
    </section>
  )
}
