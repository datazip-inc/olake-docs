import React from 'react'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { cn } from '@site/src/lib/utils'
import { GO_PROBLEM } from '@site/src/data/landing/go/problem'

/** "The Problem": four pain points, with the key words in ink and the rest muted. */
export default function GoProblem() {
  return (
    <Section>
      <SectionHeading eyebrow={GO_PROBLEM.eyebrow} title={GO_PROBLEM.headline} align='center' />
      <ul className='mt-[28px] grid grid-cols-1 gap-[12px] lg:mt-[44px] lg:grid-cols-2 lg:gap-[16px]'>
        {GO_PROBLEM.sentences.map((sentence) => (
          <Card
            as='li'
            key={sentence.words.join(' ')}
            className='px-[20px] py-[22px] lg:px-[32px] lg:py-[32px]'
          >
            <p className='text-[20px] leading-[1.3] tracking-[-0.01em] lg:text-[26px]'>
              {sentence.words.map((word, i) => (
                <React.Fragment key={`${word}-${i}`}>
                  {i > 0 && ' '}
                  <span
                    className={cn(
                      sentence.emphasis.includes(word) ? 'text-olake-ink' : 'text-olake-muted'
                    )}
                  >
                    {word}
                  </span>
                </React.Fragment>
              ))}
            </p>
          </Card>
        ))}
      </ul>
    </Section>
  )
}
