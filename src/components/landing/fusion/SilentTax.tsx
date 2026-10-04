import React from 'react'
import Section from '../ui/Section'
import {
  PROBLEMS,
  PROBLEMS_CLOSING,
  PROBLEMS_EYEBROW,
  type ProblemCard
} from '@site/src/data/landing/fusion/problems'
import { cn } from '@site/src/lib/utils'

/**
 * Each sentence is a small cloud of words: a recipe of sizes, weights, tones and tilts that repeats
 * along the sentence, with the key words of the sentence large, bold and straight. The words bob
 * gently out of step with each other (fusion.css, motion allowed only).
 */
const SIZES = [34, 22, 27, 24, 31, 21, 25]
const WEIGHTS = [600, 500, 600, 500, 600, 500, 600]
const TONES = ['ink', 'muted', 'ink', 'blue', 'ink', 'muted', 'ink'] as const
const TILTS = [-3, 2, -1, 3, -2, 1, 0]
const EMPHASIS_SIZE = 33

const normalise = (word: string) => word.toLowerCase().replace(/[^a-z']/g, '')

interface Word {
  text: string
  size: number
  weight: number
  tone: (typeof TONES)[number]
  opacity: number
  tilt: number
  delay: number
}

function layoutWords(card: ProblemCard): Word[] {
  const emphasis = card.emphasis.map(normalise)
  const big = (card.big ?? []).map(normalise)
  return card.words.map((text, i) => {
    const key = normalise(text)
    const isEmphasis = emphasis.includes(key)
    const isBig = big.includes(key)
    const slot = card.recipeAt?.[i] ?? i
    const tone = isEmphasis ? 'ink' : TONES[slot % TONES.length]
    return {
      text,
      size: isEmphasis || isBig ? EMPHASIS_SIZE : SIZES[slot % SIZES.length],
      weight: isEmphasis ? 600 : WEIGHTS[slot % WEIGHTS.length],
      tone,
      // Only the ink words fade a little; the lighter tones keep full strength so they stay readable.
      opacity: isEmphasis || tone !== 'ink' ? 1 : 0.8 + (0.2 * ((slot * 37) % 10)) / 10,
      tilt: isEmphasis ? 0 : TILTS[slot % TILTS.length],
      delay: (i % 5) * 0.3
    }
  })
}

const Statement = ({ card }: { card: ProblemCard }) => (
  <li className='rounded-[16px] border-[1.5px] border-solid border-(--fusion-lavender) bg-olake-surface px-[20px] py-[28px] min-h-[200px] lg:min-h-[250px] lg:py-[32px]'>
    <p className='flex flex-wrap content-start gap-x-[10px] gap-y-[8px]'>
      {layoutWords(card).map((word, i) => (
        <span
          key={`${word.text}-${i}`}
          className={cn('fusion-word', `fusion-word--${word.tone}`)}
          style={
            {
              fontSize: word.size,
              fontWeight: word.weight,
              opacity: word.opacity,
              '--r': `${word.tilt}deg`,
              '--d': `${word.delay}s`
            } as React.CSSProperties
          }
        >
          {word.text}
        </span>
      ))}
    </p>
  </li>
)

export default function SilentTax() {
  return (
    <Section>
      <p className='text-center text-[12px] font-medium uppercase tracking-[0.08em] text-olake-blue'>
        {PROBLEMS_EYEBROW}
      </p>
      <ul className='mt-[28px] grid grid-cols-1 gap-[16px] p-0 min-[640px]:grid-cols-2 min-[900px]:grid-cols-4 lg:mt-[32px] lg:gap-[22px]'>
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
