import React from 'react'
import Button from '../ui/Button'
import { cn } from '@site/src/lib/utils'
import {
  GO_HERO,
  GO_SOURCES,
  GO_SOURCES_LABEL,
  type GoSourceId
} from '@site/src/data/landing/go/hero'
import GoDashboardMock from './GoDashboardMock'

const IMG = '/img/landing/go'

/** Each source's logo as the design places it: some are SVGs at their own size, the rest are cropped PNGs. */
const LOGOS: Record<GoSourceId, React.ReactNode> = {
  kafka: (
    <span className='block h-[17.306px] w-[10.656px] -scale-y-100'>
      <img
        src={`${IMG}/source-kafka.png`}
        alt=''
        width={44}
        height={71}
        decoding='async'
        className='block h-full w-full object-cover'
      />
    </span>
  ),
  postgres: (
    <span className='relative block h-[20.8125px] w-[20.8125px]'>
      <img
        src={`${IMG}/source-postgres.svg`}
        alt=''
        width={16.7779}
        height={17.2977}
        decoding='async'
        className='absolute top-[8.49%] left-[8.48%] block'
      />
    </span>
  ),
  mysql: (
    <img
      src={`${IMG}/source-mysql.svg`}
      alt=''
      width={20.8125}
      height={20.8125}
      decoding='async'
      className='block'
    />
  ),
  mongodb: (
    <img
      src={`${IMG}/source-mongodb.svg`}
      alt=''
      width={20.8125}
      height={20.8125}
      decoding='async'
      className='block'
    />
  ),
  s3: (
    <img
      src={`${IMG}/source-s3.svg`}
      alt=''
      width={23.6607}
      height={23.6607}
      decoding='async'
      className='block'
    />
  ),
  mssql: (
    <span className='relative block h-[20px] w-[20px] overflow-hidden'>
      <img
        src={`${IMG}/source-mssql.png`}
        alt=''
        width={120}
        height={67}
        decoding='async'
        className='absolute top-0 left-[-42.62%] block h-full w-[184.43%] max-w-none'
      />
    </span>
  ),
  db2: (
    <span className='relative block h-[24px] w-[27px] overflow-hidden mix-blend-multiply'>
      <img
        src={`${IMG}/source-db2.png`}
        alt=''
        width={160}
        height={93}
        decoding='async'
        className='absolute top-[-9.38%] left-[-41.67%] block h-[119.97%] w-[184.46%] max-w-none'
      />
    </span>
  ),
  oracle: (
    <span className='relative block h-[21px] w-[21px] overflow-hidden'>
      <img
        src={`${IMG}/source-oracle.png`}
        alt=''
        width={72}
        height={72}
        decoding='async'
        className='absolute top-[0.72%] left-[0.71%] block h-[100.33%] w-[100.33%] max-w-none object-cover'
      />
    </span>
  )
}

const SourceList = ({ hidden }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden || undefined} className='flex shrink-0 items-center gap-[32px] pr-[32px]'>
    {GO_SOURCES.map((source) => (
      <li key={source.id} className='flex shrink-0 items-center gap-[9px]'>
        {LOGOS[source.id]}
        <span className='text-[16px] leading-[1.3] whitespace-nowrap text-[#231f20]'>
          {source.name}
        </span>
      </li>
    ))}
  </ul>
)

/**
 * "Available Sources": a tab-shaped strip whose logos scroll by (paused on hover and for reduced
 * motion). From md up the label is pinned left and the logos run in their own lane after it, fading
 * in past the label and out at the right edge as in the design; below md the label sits above a
 * full-width lane.
 */
function SourcesStrip() {
  return (
    <div className='go-marquee relative mx-auto flex w-[calc(100%-24px)] flex-col gap-[10px] overflow-hidden rounded-t-[16px] bg-[#f7f7f7] pt-[14px] pb-[24px] md:block md:h-[80px] md:w-[calc(100%-84px)] md:max-w-[934px] md:rounded-t-[20px] md:p-0'>
      <p className='flex items-center justify-center gap-[9px] text-[16px] leading-[1.3] whitespace-nowrap text-olake-muted md:absolute md:top-[calc(50%-4.5px)] md:left-[24px] md:-translate-y-1/2'>
        {/* The live dot: a 12px circle in a 4px halo */}
        <span
          aria-hidden='true'
          className='block size-[12px] shrink-0 rounded-full bg-[#389e0d] shadow-[0_0_0_4px_rgba(125,217,87,0.33)]'
        />
        {GO_SOURCES_LABEL}
      </p>
      <div className='relative h-[24px] [mask-image:linear-gradient(to_right,transparent,#000_40px,#000_calc(100%-40px),transparent)] md:absolute md:top-[23px] md:right-0 md:left-[199px] md:[mask-image:linear-gradient(to_right,transparent,#000_40px,#000_calc(100%-120px),transparent_calc(100%-41px))]'>
        {/* The strip's grey behind the logos lets the DB2 mark multiply onto it, as in the design. */}
        <div className='go-marquee-track bg-[#f7f7f7]'>
          <SourceList />
          <SourceList hidden />
        </div>
      </div>
    </div>
  )
}

const BUTTON = 'h-[36px] px-[10px] text-[16px] leading-[1.3]'

/** Hero of the OLake Go page: strata background, copy, the two calls to action, sources and the product shot. */
export default function GoHero() {
  return (
    <section className='relative isolate overflow-hidden px-[16px] pt-[132px] pb-[72px] lg:px-[24px] lg:pt-[209px] lg:pb-[141px]'>
      {/* Background: the strata lines, cleared behind the copy by a soft white glow. */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[810px] overflow-hidden'
      >
        <img
          src={`${IMG}/hero-strata-lines.svg`}
          alt=''
          width={1511.67}
          height={778.254}
          decoding='async'
          className='absolute top-[22px] left-1/2 block h-auto w-[max(1511.67px,105%)] max-w-none -translate-x-1/2'
        />
        <img
          src={`${IMG}/hero-glow.svg`}
          alt=''
          width={2180}
          height={1580}
          decoding='async'
          className='absolute top-[-199.5px] left-[calc(50%-28.69px)] block max-w-none -translate-x-1/2'
        />
      </div>

      <div className='mx-auto w-full max-w-[1018px]'>
        <div className='mx-auto max-w-[664px] text-center'>
          <p className='text-[15px] leading-[1.3] text-olake-muted lg:text-[16px]'>
            {GO_HERO.eyebrow}
          </p>
          <h1 className='mt-[10px] text-[34px] leading-[1.2] font-normal text-balance text-olake-ink sm:text-[40px] lg:mt-[12px] lg:text-[48px] lg:leading-[1.3]'>
            {GO_HERO.headline}
          </h1>
          <p className='mx-auto mt-[14px] max-w-[468px] text-[15px] leading-[1.4] text-olake-ink lg:text-[16px] lg:leading-[1.3]'>
            {GO_HERO.body}
          </p>
          <div className='mt-[32px] flex items-center justify-center gap-[16px] lg:mt-[42px]'>
            <Button
              href={GO_HERO.primary.href}
              external
              className={cn(
                BUTTON,
                'rounded-[10px] border-[rgba(150,171,254,0.6)] bg-(--go-blue) text-[#fcfcfb] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] hover:border-[rgba(150,171,254,0.6)] hover:bg-(--go-blue-hover)'
              )}
            >
              <img
                src={`${IMG}/icon-github.svg`}
                alt=''
                width={16}
                height={16}
                decoding='async'
                className='block'
              />
              {GO_HERO.primary.label}
            </Button>
            <Button
              href={GO_HERO.secondary.href}
              variant='secondary'
              className={cn(
                BUTTON,
                'border-[#d0d0d0] bg-transparent text-[#565656] hover:bg-olake-surface hover:text-olake-ink'
              )}
            >
              {GO_HERO.secondary.label}
            </Button>
          </div>
        </div>

        <div className='mt-[56px] lg:mt-[89px]'>
          <SourcesStrip />
          <div className='relative -mt-[8px] md:-mt-[15px]'>
            <GoDashboardMock />
          </div>
        </div>
      </div>
    </section>
  )
}
