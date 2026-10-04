import React, { useEffect, useRef, useState } from 'react'
import { PiArrowClockwise, PiChartBar, PiColumns, PiTable } from 'react-icons/pi'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { cn } from '@site/src/lib/utils'
import {
  GO_FEATURES,
  GO_FEATURES_INTRO,
  type GoFeatureArt
} from '@site/src/data/landing/go/features'
import FeatureVisual from './FeatureVisual'
import { useFeatureCycle } from './useFeatureCycle'

const ICONS: Record<GoFeatureArt, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  tiered: PiChartBar,
  decay: PiTable,
  chunk: PiColumns,
  resume: PiArrowClockwise
}

/** The feature selector: four tabs on the left, the active capability's card on the right. */
export default function GoFeatures() {
  const { ref, active, progress, select } = useFeatureCycle(GO_FEATURES.length)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  // The card slides in when the feature changes, but not on the first paint.
  const [changed, setChanged] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setChanged(true)
  }, [active])

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = GO_FEATURES.length - 1
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  const feature = GO_FEATURES[active]
  const Icon = ICONS[feature.art]

  return (
    <Section id='features' className='go-features-tint'>
      <SectionHeading eyebrow={GO_FEATURES_INTRO.eyebrow} title={GO_FEATURES_INTRO.title} />
      <div
        ref={ref}
        className='mt-[24px] grid grid-cols-1 gap-[20px] lg:mt-[44px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[40px]'
      >
        <div role='tablist' aria-label={GO_FEATURES_INTRO.title} className='flex flex-col'>
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
                onClick={() => select(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
                className={cn(
                  'go-tab group cursor-pointer border-0 bg-transparent p-0 text-left',
                  'rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'
                )}
              >
                <span
                  className={cn(
                    'block py-[16px] text-[17px] leading-[1.3] transition-colors lg:py-[22px] lg:text-[20px]',
                    selected ? 'text-olake-ink' : 'text-olake-muted group-hover:text-olake-text'
                  )}
                >
                  {item.title}
                </span>
                <span aria-hidden='true' className='block h-px w-full bg-olake-line-rule'>
                  <span
                    className='go-tab-fill block h-px w-full origin-left bg-olake-blue'
                    style={{ transform: `scaleX(${selected ? progress / 100 : 0})` }}
                  />
                </span>
              </button>
            )
          })}
        </div>

        <Card className='flex flex-col'>
          <div
            role='tabpanel'
            id='go-feature-panel'
            aria-labelledby={`go-feature-tab-${feature.id}`}
            className={cn('flex flex-1 flex-col', changed && 'go-card-in')}
            key={feature.id}
          >
            <span
              aria-hidden='true'
              className='go-feature-tile m-[16px] mb-0 flex h-[40px] w-[40px] items-center justify-center rounded-[10px] text-olake-on-blue lg:mx-[24px] lg:mt-[24px]'
            >
              <Icon size={22} aria-hidden />
            </span>
            <div className='mt-[16px]'>
              <FeatureVisual art={feature.art} />
            </div>
            <div className='flex-1 border-0 border-t border-solid border-olake-line px-[18px] pb-[22px] pt-[20px] lg:px-[36px] lg:pb-[30px] lg:pt-[26px]'>
              <h3 className='text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[22px]'>
                {feature.title}
              </h3>
              <p className='mt-[10px] min-h-[66px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[14px] lg:leading-[1.65]'>
                {feature.body}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  )
}
