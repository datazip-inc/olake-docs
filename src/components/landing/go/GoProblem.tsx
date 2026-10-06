import React from 'react'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { cn } from '@site/src/lib/utils'
import { GO_PROBLEM } from '@site/src/data/landing/go/problem'

/** The cloud outline, stretched to the box it sits in. */
const CLOUD_PATH =
  'M205,278 C150,278 108,246 100,206 C60,200 34,168 34,132 C34,96 62,66 100,60 C108,26 146,2 192,2 C224,2 253,15 272,37 C296,16 331,4 370,4 C424,4 470,32 486,72 C505,58 530,50 557,50 C607,50 650,80 662,120 C712,120 752,152 752,192 C752,228 720,258 678,262 C670,290 636,310 596,310 C572,310 550,303 533,290 C512,306 481,316 447,316 C420,316 396,310 377,299 C356,314 328,323 297,323 C258,323 224,308 205,278 Z'

/**
 * "The Problem": four statements tilted inside a cloud, the key words larger and in the brand blue,
 * then the answer headline under the cloud. Each statement drifts up and down slowly (go.css).
 */
export default function GoProblem() {
  return (
    <Section className='pt-[32px] lg:pt-[56px]'>
      <p className='text-center text-[15px] font-medium tracking-wide text-olake-muted lg:text-[16px]'>
        {GO_PROBLEM.eyebrow}
      </p>
      <div className='go-cloud mt-[40px] lg:mt-[56px]'>
        <svg
          aria-hidden='true'
          viewBox='0 0 820 330'
          preserveAspectRatio='none'
          className='go-cloud-shape'
        >
          <path
            d={CLOUD_PATH}
            strokeWidth='1.5'
            style={{ fill: 'var(--go-cloud-fill)', stroke: 'var(--go-cloud-line)' }}
          />
        </svg>
        <ul className='absolute inset-0 m-0 list-none p-0'>
          {GO_PROBLEM.sentences.map((sentence) => {
            const { top, left, rot, delay, size } = sentence.layout
            return (
              <li
                key={sentence.words.join(' ')}
                className='go-cloud-line'
                style={
                  {
                    'top': `${top}%`,
                    'left': `${left}%`,
                    '--go-rot': `${rot}deg`,
                    '--go-size': size,
                    '--go-delay': `${delay}s`
                  } as React.CSSProperties
                }
              >
                <p className='go-cloud-float'>
                  {sentence.words.map((word, i) => (
                    <React.Fragment key={`${word}-${i}`}>
                      {i > 0 && ' '}
                      <span
                        className={cn(
                          sentence.emphasis.includes(word)
                            ? 'go-key font-semibold text-olake-blue'
                            : 'font-medium text-olake-text-2'
                        )}
                      >
                        {word}
                      </span>
                    </React.Fragment>
                  ))}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
      <SectionHeading
        title={GO_PROBLEM.headline}
        align='center'
        className='mx-auto mt-[40px] max-w-[760px] lg:mt-[56px]'
      />
    </Section>
  )
}
