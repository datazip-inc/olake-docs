import React from 'react'
import ProductHero from '../product/ProductHero'
import Glow from '../product/Glow'
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
        src={`${IMG}/source-kafka.webp`}
        alt=''
        width={44}
        height={71}
        loading='lazy'
        decoding='async'
        className='block h-full w-full object-cover'
      />
    </span>
  ),
  postgres: (
    <span className='relative block h-[20.8125px] w-[20.8125px]'>
      <img
        src={`${IMG}/source-postgres.webp`}
        alt=''
        width={16.7779}
        height={17.2977}
        loading='lazy'
        decoding='async'
        className='absolute top-[8.49%] left-[8.48%] block'
      />
    </span>
  ),
  mysql: (
    <img
      src={`${IMG}/source-mysql.webp`}
      alt=''
      width={20.8125}
      height={20.8125}
      loading='lazy'
      decoding='async'
      className='block'
    />
  ),
  mongodb: (
    <img
      src={`${IMG}/source-mongodb.webp`}
      alt=''
      width={20.8125}
      height={20.8125}
      loading='lazy'
      decoding='async'
      className='block'
    />
  ),
  s3: (
    <img
      src={`${IMG}/source-s3.webp`}
      alt=''
      width={23.6607}
      height={23.6607}
      loading='lazy'
      decoding='async'
      className='block'
    />
  ),
  mssql: (
    <span className='relative block h-[20px] w-[20px] overflow-hidden'>
      <img
        src={`${IMG}/source-mssql.webp`}
        alt=''
        width={120}
        height={67}
        loading='lazy'
        decoding='async'
        className='absolute top-0 left-[-42.62%] block h-full w-[184.43%] max-w-none'
      />
    </span>
  ),
  db2: (
    <span className='relative block h-[24px] w-[27px] overflow-hidden mix-blend-multiply'>
      <img
        src={`${IMG}/source-db2.webp`}
        alt=''
        width={160}
        height={93}
        loading='lazy'
        decoding='async'
        className='absolute top-[-9.38%] left-[-41.67%] block h-[119.97%] w-[184.46%] max-w-none'
      />
    </span>
  ),
  oracle: (
    <span className='relative block h-[21px] w-[21px] overflow-hidden'>
      <img
        src={`${IMG}/source-oracle.webp`}
        alt=''
        width={72}
        height={72}
        loading='lazy'
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

/** The strata lines, cleared behind the copy by a soft white glow. */
const Background = () => (
  <div
    aria-hidden='true'
    className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[810px] overflow-hidden'
  >
    <img
      src={`${IMG}/hero-strata-lines.webp`}
      alt=''
      width={1511.67}
      height={778.254}
      decoding='async'
      className='absolute top-[22px] left-1/2 block h-auto w-[max(1511.67px,105%)] max-w-none -translate-x-1/2'
    />
    <Glow
      width={2180}
      height={1580}
      rx={811.5}
      ry={511.5}
      blur={139.25}
      color='#fffefe'
      className='top-[-199.5px] left-[calc(50%-28.69px)] -translate-x-1/2'
    />
  </div>
)

/** Hero of the OLake Go page: strata background, copy, the two calls to action, sources and the product shot. */
export default function GoHero() {
  return (
    <ProductHero copy={GO_HERO} background={<Background />} className='lg:pt-[209px]'>
      <div className='mt-[56px] lg:mt-[89px]'>
        <SourcesStrip />
        <div className='relative -mt-[8px] md:-mt-[15px]'>
          <GoDashboardMock />
        </div>
      </div>
    </ProductHero>
  )
}
