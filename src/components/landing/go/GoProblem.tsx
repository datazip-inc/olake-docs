import React from 'react'
import { GO_PROBLEMS, GO_PROBLEM_INTRO, type GoProblemArt } from '@site/src/data/landing/go/problem'

const IMG = '/img/landing/go'

/** Each problem's line drawing, at its own size and where the design places it in the card's 203px art column. */
const ART: Record<GoProblemArt, React.ReactNode> = {
  'slow-syncs': (
    <img
      src={`${IMG}/problem-slow-syncs.webp`}
      alt=''
      width={121}
      height={79}
      loading='lazy'
      decoding='async'
      className='absolute top-[25px] left-[29px] block'
    />
  ),
  'legacy-costs': (
    <img
      src={`${IMG}/problem-legacy-etl-costs.webp`}
      alt=''
      width={134}
      height={87.1}
      loading='lazy'
      decoding='async'
      className='absolute top-[22px] left-[27px] block'
    />
  ),
  'cdc-breaks': (
    <>
      <img
        src={`${IMG}/problem-cdc-pipeline.webp`}
        alt=''
        width={74.0245}
        height={48.1159}
        loading='lazy'
        decoding='async'
        className='absolute top-[43.17px] left-[66.45px] block'
      />
      {/* The stale-source mark stands upright in the design: rotated a quarter turn in its 48 × 74 slot. */}
      <span className='absolute top-[29.39px] left-[33.99px] flex h-[74.024px] w-[48.116px] items-center justify-center'>
        <img
          src={`${IMG}/problem-cdc-stale.webp`}
          alt=''
          width={74.0245}
          height={48.1159}
          loading='lazy'
          decoding='async'
          className='block max-w-none shrink-0 rotate-90'
        />
      </span>
    </>
  ),
  'schema-drift': (
    <img
      src={`${IMG}/problem-schema-drift.webp`}
      alt=''
      width={120.291}
      height={78.1892}
      loading='lazy'
      decoding='async'
      className='absolute top-[26px] left-[35px] block'
    />
  )
}

/** The frame's dashed outline (22px dashes, as in the design), drawn on the pixel grid so it stays crisp. */
const DashedFrame = () => (
  <svg
    aria-hidden='true'
    className='pointer-events-none absolute top-0 left-0 h-[calc(100%-1px)] w-[calc(100%-1px)] overflow-visible'
  >
    <rect
      x='0.5'
      y='0.5'
      width='100%'
      height='100%'
      rx='19.5'
      fill='none'
      strokeDasharray='22 22'
      className='stroke-olake-line-strong'
    />
  </svg>
)

/** One of the frame's two vertical dashed guides. */
const Guide = ({ className }: { className: string }) => (
  <span
    aria-hidden='true'
    className={`pointer-events-none absolute inset-y-0 hidden w-px bg-[linear-gradient(to_bottom,var(--olake-line-strong)_50%,transparent_50%)] bg-[length:1px_43px] bg-[position:0_-10.75px] lg:block ${className}`}
  />
)

/** "Problem Statement": the four pain points as cards inside a dashed frame with two vertical guides. */
export default function GoProblem() {
  return (
    <section className='px-[16px] pb-[48px] lg:px-[24px] lg:pb-[96px]'>
      <div className='relative mx-auto max-w-[1018px] overflow-hidden rounded-[20px] bg-[rgba(248,248,248,0.8)] px-[16px] pt-[32px] pb-[24px] sm:px-[24px] lg:pt-[55px] lg:pr-[24px] lg:pb-[57px] lg:pl-[112px]'>
        <DashedFrame />
        <Guide className='left-[89px]' />
        <Guide className='left-[776px]' />

        <p className='relative text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
          {GO_PROBLEM_INTRO.eyebrow}
        </p>
        <h2 className='relative mt-[10px] max-w-[599px] text-[30px] leading-[1.2] font-normal text-olake-ink lg:mt-[12px] lg:text-[48px] lg:leading-[1.3]'>
          {GO_PROBLEM_INTRO.title}
        </h2>

        <ul className='relative mt-[28px] flex max-w-[636px] flex-col gap-[16px] lg:mt-[39px] lg:gap-[24px]'>
          {GO_PROBLEMS.map((problem) => (
            <li
              key={problem.label}
              className='flex min-h-[96px] items-center overflow-hidden rounded-[16px] border border-solid border-olake-line-strong bg-olake-surface pr-[16px] sm:h-[128px]'
            >
              {/* The art column: the design's 203 × 128 slot, shown at 5/8 size on phones. */}
              <span
                aria-hidden='true'
                className='relative h-[80px] w-[127px] shrink-0 sm:h-[128px] sm:w-[203px]'
              >
                <span className='absolute top-0 left-0 h-[128px] w-[203px] origin-top-left scale-[0.625] sm:scale-100'>
                  {ART[problem.art]}
                </span>
              </span>
              <span className='flex flex-col gap-[8px] py-[16px]'>
                <span className='text-[12px] leading-[1.3] text-olake-muted'>{problem.label}</span>
                <span className='text-[16px] leading-[1.3] text-black sm:text-[20px]'>
                  {problem.title}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
