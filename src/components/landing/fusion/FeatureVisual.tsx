import React from 'react'
import {
  CONFIG_COMPARE,
  DECAY_LABELS,
  HOSTS,
  TIERS,
  type FeatureKind
} from '@site/src/data/landing/fusion/features'
import { cn } from '@site/src/lib/utils'

/** Fragment sizes (px) for the "fragmented files" cluster. */
const FRAGMENTS = [14, 10, 16, 9, 13, 11, 15, 8]
const TIER_FILL = ['bg-olake-blue/40', 'bg-olake-blue/70', 'bg-olake-blue']
const CAPTION = 'text-[11px] text-olake-muted'

const Tiered = () => (
  <ul className='flex flex-col gap-[12px] p-0'>
    {TIERS.map((tier, i) => (
      <li key={tier.label} className='flex items-center gap-[12px]'>
        <span className='w-[56px] shrink-0 text-[11px] text-olake-blue'>{tier.label}</span>
        <span className='h-[8px] flex-1 overflow-hidden rounded-[4px] bg-olake-line'>
          <span
            className={cn('block h-full rounded-[4px]', TIER_FILL[i])}
            style={{ width: `${tier.fill}%` }}
          />
        </span>
        <span className={cn(CAPTION, 'w-[72px] shrink-0 text-right')}>{tier.note}</span>
      </li>
    ))}
  </ul>
)

const Decay = () => (
  <div className='flex items-center justify-between gap-[20px]'>
    <div className='text-center'>
      <div className='mx-auto mb-[10px] flex w-[110px] flex-wrap items-center justify-center gap-[4px]'>
        {FRAGMENTS.map((size, i) => (
          <span
            key={i}
            className='block rounded-[3px] bg-olake-line-strong'
            style={{ width: size, height: size }}
          />
        ))}
      </div>
      <p className={CAPTION}>{DECAY_LABELS.before}</p>
    </div>
    <span aria-hidden='true' className='text-[20px] text-olake-blue'>
      →
    </span>
    <div className='text-center'>
      <div className='mb-[10px] flex justify-center gap-[6px]'>
        <span className='block h-[26px] w-[26px] rounded-[5px] bg-olake-blue' />
        <span className='block h-[26px] w-[26px] rounded-[5px] bg-olake-blue' />
      </div>
      <p className={CAPTION}>{DECAY_LABELS.after}</p>
    </div>
  </div>
)

const Config = () => (
  <div className='flex items-center gap-[16px]'>
    <div className='flex-1 rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt py-[16px] text-center'>
      <p className='text-[28px] leading-none text-olake-ink'>{CONFIG_COMPARE.fusion.value}</p>
      <p className={cn(CAPTION, 'mt-[6px]')}>{CONFIG_COMPARE.fusion.label}</p>
    </div>
    <div className='flex-1 rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt py-[16px] text-center opacity-60'>
      <p className='text-[28px] leading-none text-olake-muted'>{CONFIG_COMPARE.spark.value}</p>
      <p className={cn(CAPTION, 'mt-[6px]')}>{CONFIG_COMPARE.spark.label}</p>
    </div>
  </div>
)

const Hosted = () => (
  <ul className='flex items-center justify-center gap-[24px] p-0'>
    {HOSTS.map((host) => (
      <li key={host} className='flex items-center gap-[8px] text-[13px] text-olake-ink'>
        <span aria-hidden='true' className='block h-[8px] w-[8px] rounded-full bg-olake-blue' />
        {host}
      </li>
    ))}
  </ul>
)

const VISUALS: Record<FeatureKind, React.ComponentType> = {
  tiered: Tiered,
  decay: Decay,
  config: Config,
  hosted: Hosted
}

/** The small product mock-up above each feature's copy. Values are the page's sample content. */
export default function FeatureVisual({ kind }: { kind: FeatureKind }) {
  const Visual = VISUALS[kind]
  return (
    <div className='flex min-h-[170px] items-center justify-center bg-olake-surface-muted px-[16px] py-[24px] lg:min-h-[220px] lg:px-[24px]'>
      <div className='w-full max-w-[380px] rounded-[8px] bg-olake-surface px-[16px] py-[20px] shadow-[0_0_10px_0_rgba(0,0,0,0.15)]'>
        <Visual />
      </div>
    </div>
  )
}
