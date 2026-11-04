import React from 'react'
import ProductHero from '../product/ProductHero'
import Glow from '../product/Glow'
import { GO_HERO, GO_SOURCES, GO_SOURCES_LABEL } from '@site/src/data/landing/go/hero'
import { GO_LOGOS } from './logos'

const IMG = '/img/landing/go'

const SourceList = ({ hidden }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden || undefined} className='flex shrink-0 items-center gap-[32px] pr-[32px]'>
    {GO_SOURCES.map((source) => (
      <li key={source.id} className='flex shrink-0 items-center gap-[9px]'>
        <img {...GO_LOGOS[source.id]} alt='' decoding='async' className='block' />
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
        <div className='go-marquee-track'>
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
          <img
            src={`${IMG}/hero-dashboard.webp`}
            alt='OLake Go jobs dashboard'
            width={1018}
            height={471}
            fetchPriority='high'
            decoding='async'
            className='mx-auto block h-auto w-full max-w-[1018px]'
          />
        </div>
      </div>
    </ProductHero>
  )
}
