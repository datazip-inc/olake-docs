import React from 'react'
import { cn } from '@site/src/lib/utils'
import {
  PROBLEMS,
  PROBLEM_INTRO,
  type FusionProblemArt
} from '@site/src/data/landing/fusion/problems'

const IMG = '/img/landing/fusion'

/**
 * Where each problem's copy and line drawing sit in its row, from lg up (offsets from the left of
 * the ruled column, and from the top of the row), and the row's height. The design zig-zags them.
 */
const LAYOUT: Record<
  FusionProblemArt,
  {
    height: number
    text: [number, number]
    /** Wrap width of the title, where the design wraps it. */
    textWidth?: number
    art: [number, number]
    image: React.ReactNode
  }
> = {
  'small-files': {
    height: 173,
    text: [181, 80],
    art: [22, 65],
    image: (
      <img
        src={`${IMG}/problem-small-files.svg`}
        alt=''
        width={120}
        height={78}
        loading='lazy'
        decoding='async'
        className='block'
      />
    )
  },
  'slower-queries': {
    height: 140,
    text: [53, 44],
    art: [410, 26],
    image: (
      <img
        src={`${IMG}/problem-slower-queries.svg`}
        alt=''
        width={156.923}
        height={102}
        loading='lazy'
        decoding='async'
        className='block'
      />
    )
  },
  'invisible-costs': {
    height: 137,
    text: [173, 44],
    art: [22, 26],
    image: (
      <img
        src={`${IMG}/problem-invisible-costs.svg`}
        alt=''
        width={136}
        height={89}
        loading='lazy'
        decoding='async'
        className='block'
      />
    )
  },
  'debugging': {
    height: 177,
    text: [53, 43],
    textWidth: 324,
    art: [469, 34.7],
    // Drawn upright in the design: rotated a quarter turn in its 112 × 95 slot (96 × 81 below lg).
    image: (
      <span className='flex h-[81px] w-[96px] items-center justify-center lg:h-[95px] lg:w-[112px]'>
        <img
          src={`${IMG}/problem-compaction-debugging.svg`}
          alt=''
          width={96.0688}
          height={113.353}
          loading='lazy'
          decoding='async'
          className='block h-auto w-[81px] max-w-none shrink-0 -rotate-90 lg:w-[96.0688px]'
        />
      </span>
    )
  }
}

/** "Problem Statement": the four pain points down a ruled column between two guides. */
export default function FusionProblem() {
  return (
    <section className='px-[16px] pb-[48px] lg:px-[24px] lg:pb-[149px]'>
      <div className='relative mx-auto max-w-[1018px] overflow-hidden rounded-[20px] border border-solid border-olake-line-strong px-[16px] pt-[32px] sm:px-[24px] lg:h-[840px] lg:p-0'>
        {/* The column's guides */}
        <span
          aria-hidden='true'
          className='absolute inset-y-0 left-[89px] hidden border-0 border-l border-solid border-olake-line-strong lg:block'
        />
        <span
          aria-hidden='true'
          className='absolute inset-y-0 left-[740px] hidden border-0 border-l border-solid border-olake-line-strong lg:block'
        />

        <div className='lg:absolute lg:top-[55px] lg:left-[112px]'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
            {PROBLEM_INTRO.eyebrow}
          </p>
          <h2 className='mt-[10px] max-w-[599px] text-[30px] leading-[1.2] font-normal text-olake-ink lg:mt-[12px] lg:text-[48px] lg:leading-[1.3]'>
            {PROBLEM_INTRO.title}
          </h2>
        </div>

        <ul className='mt-[24px] lg:absolute lg:top-[213px] lg:left-[90px] lg:mt-0 lg:w-[649px]'>
          {PROBLEMS.map((problem, i) => {
            const layout = LAYOUT[problem.art]
            return (
              <li
                key={problem.label}
                className={cn(
                  'relative flex items-center gap-[16px] border-0 border-solid border-olake-line-strong py-[20px] lg:block lg:h-(--row-h) lg:py-0',
                  i < PROBLEMS.length - 1 && 'border-b'
                )}
                style={{ '--row-h': `${layout.height}px` } as React.CSSProperties}
              >
                <span
                  aria-hidden='true'
                  className='w-[96px] shrink-0 lg:absolute lg:top-(--art-y) lg:left-(--art-x) lg:w-auto [&>img]:h-auto [&>img]:max-w-full lg:[&>img]:max-w-none'
                  style={
                    {
                      '--art-x': `${layout.art[0]}px`,
                      '--art-y': `${layout.art[1]}px`
                    } as React.CSSProperties
                  }
                >
                  {layout.image}
                </span>
                <span
                  className='flex flex-col gap-[8px] lg:absolute lg:top-(--text-y) lg:left-(--text-x)'
                  style={
                    {
                      '--text-x': `${layout.text[0]}px`,
                      '--text-y': `${layout.text[1]}px`,
                      '--text-w': layout.textWidth ? `${layout.textWidth}px` : 'none'
                    } as React.CSSProperties
                  }
                >
                  <span className='text-[12px] leading-[1.3] text-olake-muted'>
                    {problem.label}
                  </span>
                  <span className='text-[16px] leading-[1.3] text-black sm:text-[20px] lg:max-w-(--text-w)'>
                    {problem.title}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
