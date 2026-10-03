import React, { useCallback, useEffect, useRef, useState } from 'react'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import FeatureVisual from './FeatureVisual'
import {
  FEATURES,
  FEATURES_EYEBROW,
  FEATURES_TITLE,
  FEATURE_STEPS,
  FEATURE_TICK_MS
} from '@site/src/data/landing/fusion/features'
import { cn } from '@site/src/lib/utils'

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue'

/**
 * Feature selector with auto-advance: the active feature's underline fills over 10 s and then the
 * next feature takes over. The rotation starts once the section is 40% visible and stops for good
 * when a visitor picks a feature (or when they prefer reduced motion).
 */
function useFeatureRotation(count: number) {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setStarted(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || paused) return
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= FEATURE_STEPS) {
          setActive((a) => (a + 1) % count)
          return 0
        }
        return p + 1
      })
    }, FEATURE_TICK_MS)
    return () => clearInterval(timer)
  }, [started, paused, count])

  const select = useCallback((i: number) => {
    setActive(i)
    setProgress(FEATURE_STEPS)
    setPaused(true)
  }, [])

  return { active, progress, select, sectionRef }
}

export default function Features() {
  const { active, progress, select, sectionRef } = useFeatureRotation(FEATURES.length)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = FEATURES.length - 1
    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next < 0) return
    e.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <Section id='features'>
      <div ref={sectionRef}>
        <SectionHeading eyebrow={FEATURES_EYEBROW} title={FEATURES_TITLE} />

        <div className='mt-[28px] grid gap-[20px] lg:mt-[44px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[40px]'>
          <div
            role='tablist'
            aria-label={FEATURES_TITLE}
            aria-orientation='vertical'
            onKeyDown={onKeyDown}
            className='flex flex-col'
          >
            {FEATURES.map((feature, i) => {
              const selected = i === active
              return (
                <button
                  key={feature.kind}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type='button'
                  role='tab'
                  id={`fusion-tab-${feature.kind}`}
                  aria-selected={selected}
                  aria-controls={`fusion-panel-${feature.kind}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    'relative w-full cursor-pointer appearance-none border-0 border-b border-solid border-olake-line bg-transparent px-0 py-[18px] text-left text-[17px] transition-colors hover:text-olake-ink lg:py-[22px] lg:text-[20px]',
                    selected ? 'text-olake-ink' : 'text-olake-muted',
                    FOCUS
                  )}
                >
                  {feature.title}
                  <span
                    aria-hidden='true'
                    className='absolute bottom-[-1px] left-0 h-[2px] bg-olake-blue transition-[width] duration-100 ease-linear'
                    style={{ width: selected ? `${progress}%` : 0 }}
                  />
                </button>
              )
            })}
          </div>

          {/* Every panel sits in the same grid cell so the card keeps the height of the tallest one. */}
          <div className='grid min-w-0'>
            {FEATURES.map((feature, i) => (
              <div
                key={feature.kind}
                role='tabpanel'
                id={`fusion-panel-${feature.kind}`}
                aria-labelledby={`fusion-tab-${feature.kind}`}
                aria-hidden={i !== active}
                className={cn(
                  'col-start-1 row-start-1 min-w-0',
                  i === active ? 'visible' : 'invisible'
                )}
              >
                <Card className='flex h-full flex-col'>
                  <FeatureVisual kind={feature.kind} />
                  <div className='flex-1 border-0 border-t border-solid border-olake-line px-[20px] pb-[24px] pt-[20px] lg:px-[32px] lg:pb-[30px] lg:pt-[26px]'>
                    <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[22px]'>
                      {feature.title}
                    </h3>
                    <p className='mt-[10px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                      {feature.body}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
