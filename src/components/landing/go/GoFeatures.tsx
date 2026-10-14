import React from 'react'
import { cn } from '@site/src/lib/utils'
import ProductFeatures, { type ProductFeatureArt } from '../product/ProductFeatures'
import Glow from '../product/Glow'
import { GO_FEATURES, GO_FEATURES_INTRO } from '@site/src/data/landing/go/features'
import GoFeatureMock from './GoFeatureMock'
import { ChunkingMock, ResumableMock, SchemaMock } from './GoFeaturePanels'

const IMG = '/img/landing/go'

/** The dotted field shared by the last three tabs, placed and flipped as each of their frames has it. */
const field = (className: string) => (
  <img
    src={`${IMG}/feature-background.webp`}
    alt=''
    width={2172}
    height={1000}
    decoding='async'
    className={cn(
      'pointer-events-none absolute top-[-1px] -z-10 block h-[711px] w-[1545px] max-w-none object-cover',
      className
    )}
  />
)

/** The blue glow at the bottom left that every tab shares. */
const FeatureGlow = () => (
  <Glow
    width={1112}
    height={802}
    rx={360}
    ry={205}
    blur={98}
    color='#0301ff'
    className='bottom-[-321px] left-[-391px] -z-10'
  />
)

/**
 * Each tab's picture (the design's go-1 to go-4 frames): the background field, where the copy sits
 * from lg up (its top, and the body's width) and the editor panel with its lg position.
 */
const ART: Record<string, ProductFeatureArt> = {
  'cdc': {
    background: (
      <img
        src={`${IMG}/feature-cdc-background.webp`}
        alt=''
        width={2384}
        height={1000}
        loading='lazy'
        decoding='async'
        className='pointer-events-none absolute top-[-41px] right-[-1px] -z-10 block h-[1107px] w-[2639px] max-w-none object-cover'
      />
    ),
    glow: <FeatureGlow />,
    copyTop: 338,
    bodyWidth: 323,
    Mock: GoFeatureMock,
    mockClassName: 'lg:top-[52px] lg:right-[36px] lg:w-[514px]'
  },
  'schema-evolution': {
    background: field('right-[-281px]'),
    glow: <FeatureGlow />,
    copyTop: 338,
    bodyWidth: 323,
    Mock: SchemaMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  },
  'parallel-chunking': {
    background: field('right-[-129px] -scale-x-100'),
    glow: <FeatureGlow />,
    copyTop: 354,
    bodyWidth: 288,
    Mock: ChunkingMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  },
  'resumable-syncs': {
    background: field('right-[-129px] -scale-y-100'),
    glow: <FeatureGlow />,
    copyTop: 333,
    bodyWidth: 288,
    Mock: ResumableMock,
    mockClassName: 'lg:top-[67.3px] lg:right-[36.1px] lg:w-[514.1px]'
  }
}

/** "Features" of the OLake Go page: the design's go-1 to go-4 frames behind a pill tab strip. */
export default function GoFeatures() {
  return (
    <ProductFeatures
      idPrefix='go-feature'
      intro={GO_FEATURES_INTRO}
      features={GO_FEATURES}
      art={ART}
    />
  )
}
