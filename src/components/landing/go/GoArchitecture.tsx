import React, { useRef } from 'react'
import Section from '../ui/Section'
import Card from '../ui/Card'
import { cn } from '@site/src/lib/utils'
import {
  GO_ARCHITECTURE_LABELS,
  GO_DESTINATIONS,
  GO_SOURCES,
  GO_SYNC_MODES
} from '@site/src/data/landing/go/architecture'
import { useDiagramLinks } from './useDiagramLinks'

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className='text-center text-[11px] uppercase tracking-[0.09em] text-olake-muted'>{children}</p>
)

const DownArrow = () => (
  <svg
    width='14'
    height='18'
    viewBox='0 0 14 18'
    fill='none'
    aria-hidden='true'
    className='mx-auto block text-olake-line-strong lg:hidden'
  >
    <path
      d='M7 1v15M2 11l5 5 5-5'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

/** Sources, the OLake Go node and the two destinations. The lines are drawn after mount (see useDiagramLinks). */
export default function GoArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const diagram = useDiagramLinks(containerRef, nodeRef)

  return (
    <Section className='pt-[8px] lg:pt-[32px]'>
      <Card className='px-[16px] py-[28px] lg:px-[56px] lg:py-[44px]'>
        <div
          ref={containerRef}
          className='relative isolate flex flex-col gap-[14px] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-0'
        >
          {diagram && (
            <svg
              aria-hidden='true'
              viewBox={`0 0 ${diagram.width} ${diagram.height}`}
              className='pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible'
            >
              {diagram.links.map((link) => (
                <path
                  key={link.d}
                  d={link.d}
                  strokeWidth='1.5'
                  className='fill-none stroke-olake-line-strong'
                />
              ))}
              {diagram.animate &&
                diagram.links.map((link) => (
                  <circle key={`dot-${link.d}`} r={link.side === 'in' ? 3 : 3.5} className='fill-olake-blue'>
                    <animateMotion dur='2.4s' begin={`${link.begin}s`} repeatCount='indefinite' path={link.d} />
                  </circle>
                ))}
            </svg>
          )}

          <div className='flex flex-col gap-[8px] lg:items-start lg:justify-self-start'>
            <Label>{GO_ARCHITECTURE_LABELS.sources}</Label>
            <ul className='flex flex-wrap justify-center gap-[8px] lg:flex-col lg:flex-nowrap lg:justify-start'>
              {GO_SOURCES.map((name) => (
                <li
                  key={name}
                  data-src
                  className='inline-flex h-[34px] items-center gap-[9px] rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[12px] text-[13px] text-olake-ink lg:w-[132px]'
                >
                  <span aria-hidden='true' className='h-[6px] w-[6px] shrink-0 rounded-full bg-olake-line-strong' />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <DownArrow />

          <div className='flex flex-col items-center lg:mx-[72px]'>
            <div
              ref={nodeRef}
              className='go-node flex h-[104px] w-[104px] items-center justify-center rounded-[22px] border border-solid border-olake-blue-ring bg-olake-blue shadow-[var(--olake-shadow-btn)] lg:h-[116px] lg:w-[116px]'
            >
              <img
                src='/img/landing/shared/olake-mark-small.svg'
                alt={GO_ARCHITECTURE_LABELS.node}
                width={42}
                height={42}
                loading='lazy'
                decoding='async'
                className='block h-[42px] w-[42px]'
              />
            </div>
            <p className='mt-[12px] text-[15px] text-olake-ink'>{GO_ARCHITECTURE_LABELS.node}</p>
            <ul className='mt-[12px] flex flex-wrap justify-center gap-[6px]'>
              {GO_SYNC_MODES.map((mode, i) => (
                <li
                  key={mode}
                  className={`go-chip go-chip-${i + 1} rounded-[8px] border border-solid border-olake-line bg-olake-surface-alt px-[10px] py-[4px] text-[12px] text-olake-text`}
                >
                  {mode}
                </li>
              ))}
            </ul>
          </div>

          <DownArrow />

          <div className='flex flex-col gap-[10px] lg:justify-self-end'>
            <Label>{GO_ARCHITECTURE_LABELS.destinations}</Label>
            <ul className='flex flex-col items-center gap-[12px] lg:items-stretch'>
              {GO_DESTINATIONS.map((dest) => (
                <li
                  key={dest.label}
                  data-dest
                  className={cn(
                    'inline-flex h-[52px] items-center gap-[12px] rounded-[12px] border border-solid bg-olake-surface px-[16px] text-[14px] text-olake-ink lg:w-[232px] whitespace-nowrap',
                    dest.primary
                      ? 'border-olake-blue ring-4 ring-olake-blue/10'
                      : 'border-olake-line'
                  )}
                >
                  <img
                    src={dest.icon.src}
                    alt={dest.icon.alt}
                    width={dest.icon.width}
                    height={dest.icon.height}
                    loading='lazy'
                    decoding='async'
                    className={cn('block w-auto', dest.primary ? 'h-[20px]' : 'h-[24px]')}
                  />
                  {dest.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </Section>
  )
}
