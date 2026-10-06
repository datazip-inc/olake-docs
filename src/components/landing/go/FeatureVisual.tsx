import React from 'react'
import { cn } from '@site/src/lib/utils'
import type { GoFeatureArt } from '@site/src/data/landing/go/features'

/**
 * The small product mock-ups inside the feature card, drawn in the same grey panel + white sheet
 * the home page uses for its feature cards. They are decorative (aria-hidden); the card's heading
 * and body say the same thing in words.
 */

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden='true'
    className='flex min-h-[170px] items-center justify-center bg-olake-surface-muted px-[10px] py-[22px] lg:min-h-[220px] lg:px-[32px]'
  >
    <div className='w-full max-w-[460px] rounded-[8px] bg-olake-surface p-[10px] shadow-[0_0_10px_0_rgba(0,0,0,0.12)] lg:p-[16px]'>
      {children}
    </div>
  </div>
)

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className='whitespace-nowrap text-[9px] uppercase tracking-[0.02em] text-olake-muted lg:text-[10px] lg:tracking-[0.06em]'>{children}</p>
)

const Bar = ({ className }: { className?: string }) => (
  <span className={cn('block flex-1 rounded-[3px] bg-olake-blue', className)} />
)

const Tiered = () => (
  <Panel>
    <div className='grid grid-cols-3 gap-[10px]'>
      <div className='rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] lg:p-[10px]'>
        <Caption>Full</Caption>
        <div className='mt-[10px] flex h-[34px] items-end gap-[4px]'>
          <Bar className='h-full' />
          <Bar className='h-full' />
          <Bar className='h-full' />
        </div>
        <p className='mt-[8px] text-[10px] text-olake-text-2'>one-time load</p>
      </div>
      <div className='rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] lg:p-[10px]'>
        <Caption>Incremental</Caption>
        <div className='mt-[10px] flex h-[34px] items-end gap-[4px]'>
          <Bar className='h-[40%] bg-olake-blue/60' />
          <Bar className='h-[75%] bg-olake-blue/60' />
          <Bar className='h-[55%] bg-olake-blue/60' />
        </div>
        <p className='mt-[8px] text-[10px] text-olake-text-2'>on schedule</p>
      </div>
      <div className='rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] lg:p-[10px]'>
        <Caption>CDC</Caption>
        <div className='mt-[10px] flex h-[34px] items-center gap-[4px]'>
          <span className='go-live-dot block h-[7px] w-[7px] shrink-0 rounded-full bg-olake-blue' />
          <span className='block h-[2px] flex-1 bg-linear-to-r from-olake-blue to-transparent' />
        </div>
        <p className='mt-[8px] text-[10px] text-olake-text-2'>real-time</p>
      </div>
    </div>
  </Panel>
)

const Row = ({ className }: { className?: string }) => (
  <span className={cn('block h-[8px] rounded-[3px] bg-olake-line', className)} />
)

const Decay = () => (
  <Panel>
    <div className='flex items-center gap-[14px]'>
      <div className='flex-1 rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] lg:p-[10px]'>
        <Caption>Source table</Caption>
        <div className='mt-[10px] flex flex-col gap-[6px]'>
          <Row />
          <Row className='w-[80%]' />
          <Row className='w-[60%]' />
        </div>
      </div>
      <span aria-hidden='true' className='text-[18px] text-olake-muted'>
        →
      </span>
      <div className='flex-1 rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt p-[8px] lg:p-[10px]'>
        <Caption>Iceberg table</Caption>
        <div className='mt-[10px] flex flex-col gap-[6px]'>
          <Row />
          <Row className='w-[80%]' />
          <div className='flex items-center gap-[6px]'>
            <Row className='w-[60%] bg-olake-blue/30' />
            <span className='rounded-[4px] bg-olake-blue-tint px-[5px] py-[1px] text-[9px] text-olake-blue'>
              + NEW
            </span>
          </div>
        </div>
      </div>
    </div>
  </Panel>
)

const Chunk = () => (
  <Panel>
    <div className='h-[10px] w-full rounded-[3px] bg-olake-line' />
    <div className='mx-auto my-[8px] h-[12px] w-[2px] bg-olake-line-strong' />
    <div className='grid grid-cols-4 gap-[8px]'>
      {['chunk 1', 'chunk 2', 'chunk 3', 'chunk 4'].map((label) => (
        <div
          key={label}
          className='rounded-[6px] border border-solid border-olake-blue/30 bg-olake-blue-tint py-[8px] text-center text-[10px] text-olake-blue'
        >
          {label}
        </div>
      ))}
    </div>
    <p className='mt-[10px] text-center text-[10px] text-olake-text-2'>read in parallel</p>
  </Panel>
)

const Resume = () => (
  <Panel>
    <div className='flex items-center gap-[6px]'>
      <span className='block h-[10px] flex-1 rounded-[3px] bg-olake-blue' />
      <span className='block h-[10px] flex-1 rounded-[3px] bg-olake-blue' />
      <span className='rounded-[4px] bg-olake-success-bg px-[6px] py-[2px] text-[10px] text-olake-success-text'>
        ✓ checkpoint
      </span>
      <span className='block h-[10px] flex-[2] rounded-[3px] bg-olake-line' />
    </div>
    <div className='mt-[12px] flex items-center justify-between text-[10px] text-olake-text-2'>
      <span>interrupted</span>
      <span className='text-olake-blue'>resumes here →</span>
    </div>
  </Panel>
)

const VISUALS: Record<GoFeatureArt, () => React.JSX.Element> = {
  tiered: Tiered,
  decay: Decay,
  chunk: Chunk,
  resume: Resume
}

export default function FeatureVisual({ art }: { art: GoFeatureArt }) {
  const Visual = VISUALS[art]
  return <Visual />
}
