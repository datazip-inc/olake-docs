import React from 'react'
import ProductFeatures, { type ProductFeatureArt } from '../product/ProductFeatures'
import { FEATURES, FEATURES_INTRO } from '@site/src/data/landing/fusion/features'
import { ConfigMock, DecayMock, HostedMock, TieredMock } from './FusionFeaturePanels'

const IMG = '/img/landing/fusion'

/** The dark wave every tab shares, mirrored as in the design. */
const Field = () => (
  <img
    src={`${IMG}/feature-background.webp`}
    alt=''
    width={2172}
    height={1000}
    decoding='async'
    className='pointer-events-none absolute top-[-41px] right-[-1px] -z-10 block h-[638px] w-[1386px] max-w-none -scale-x-100 object-cover'
  />
)

/** The deep blue glow at the bottom left. */
const Glow = () => (
  <img
    src={`${IMG}/feature-glow.webp`}
    alt=''
    width={1112}
    height={802}
    loading='lazy'
    decoding='async'
    className='pointer-events-none absolute bottom-[-321px] left-[-391px] -z-10 block max-w-none'
  />
)

/** Every tab's panel sits where the design's fusion-1 to fusion-4 frames put it; only the copy moves. */
const MOCK = 'lg:top-[52.22px] lg:right-[42.07px] lg:w-[507px]'

const ART: Record<string, ProductFeatureArt> = {
  tiered: {
    background: <Field />,
    glow: <Glow />,
    copyTop: 332,
    bodyWidth: 323,
    Mock: TieredMock,
    mockClassName: MOCK
  },
  decay: {
    background: <Field />,
    glow: <Glow />,
    copyTop: 377,
    bodyWidth: 323,
    Mock: DecayMock,
    mockClassName: MOCK
  },
  config: {
    background: <Field />,
    glow: <Glow />,
    copyTop: 395,
    bodyWidth: 323,
    Mock: ConfigMock,
    mockClassName: MOCK
  },
  hosted: {
    background: <Field />,
    glow: <Glow />,
    copyTop: 395,
    bodyWidth: 323,
    Mock: HostedMock,
    mockClassName: MOCK
  }
}

/** "Features" of the OLake Fusion page: the design's fusion-1 to fusion-4 frames behind a pill tab strip. */
export default function FusionFeatures() {
  return (
    <ProductFeatures
      idPrefix='fusion-feature'
      intro={FEATURES_INTRO}
      features={FEATURES}
      art={ART}
      className='lg:pb-[107px]'
    />
  )
}
