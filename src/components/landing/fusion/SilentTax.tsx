import React from 'react'
import Section from '../ui/Section'
import Card from '../ui/Card'
import { cn } from '@site/src/lib/utils'
import {
  PROBLEMS,
  PROBLEMS_CLOSING,
  PROBLEMS_EYEBROW,
  type ProblemCard
} from '@site/src/data/landing/fusion/problems'

const Statement = ({ card }: { card: ProblemCard }) => (
  <Card as='li' className='p-[20px] lg:p-[24px]'>
    <p className='text-[22px] leading-[1.25] tracking-[-0.01em] lg:text-[26px]'>
      {card.words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            className={cn(
              card.emphasis.includes(word) ? 'text-olake-ink' : 'text-olake-muted',
              word.includes(' ') && 'whitespace-nowrap'
            )}
          >
            {word}
          </span>
          {i < card.words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </p>
  </Card>
)

export default function SilentTax() {
  return (
    <Section>
      <p className='text-center text-[15px] font-medium tracking-wide text-olake-muted lg:text-[16px]'>
        {PROBLEMS_EYEBROW}
      </p>
      <ul className='mt-[20px] grid p-0 grid-cols-1 gap-[16px] sm:grid-cols-2 lg:mt-[28px] lg:grid-cols-4 lg:gap-[20px]'>
        {PROBLEMS.map((card) => (
          <Statement key={card.words.join(' ')} card={card} />
        ))}
      </ul>
      <h2 className='mx-auto mt-[40px] max-w-[620px] text-center text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-olake-ink lg:mt-[64px] lg:text-[38px]'>
        {PROBLEMS_CLOSING}
      </h2>
    </Section>
  )
}
