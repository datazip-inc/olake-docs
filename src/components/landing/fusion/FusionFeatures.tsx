import React from 'react'
import ProductFeatures, { type ProductFeatureArt } from '../product/ProductFeatures'
import Glow from '../product/Glow'
import { FEATURES, FEATURES_INTRO } from '@site/src/data/landing/fusion/features'

const IMG = '/img/landing/fusion'

/** The dark wave every tab shares, mirrored as in the design. */
const Field = () => (
  <img
    src={`${IMG}/feature-background.webp`}
    alt=''
    width={2172}
    height={1000}
    loading='lazy'
    decoding='async'
    className='pointer-events-none absolute top-[-41px] right-[-1px] -z-10 block h-[638px] w-[1386px] max-w-none -scale-x-100 object-cover'
  />
)

/** The deep blue glow at the bottom left. */
const FeatureGlow = () => (
  <Glow
    width={1112}
    height={802}
    rx={360}
    ry={205}
    blur={98}
    color='#05039c'
    className='bottom-[-321px] left-[-391px] -z-10'
  />
)

/** Every tab's panel sits where the design's fusion-1 to fusion-4 frames put it; only the copy moves. */
const MOCK = 'lg:top-[52.22px] lg:right-[42.07px] lg:w-[507px]'

const ART: Record<string, ProductFeatureArt> = {
  tiered: {
    background: <Field />,
    glow: <FeatureGlow />,
    copyTop: 332,
    bodyWidth: 323,
    image: {
      src: `${IMG}/feature-tiered.webp`,
      alt: 'OLake Fusion tables, with the last run of each compaction tier',
      width: 507,
      height: 437.4
    },
    mockClassName: MOCK
  },
  decay: {
    background: <Field />,
    glow: <FeatureGlow />,
    copyTop: 377,
    bodyWidth: 323,
    image: {
      src: `${IMG}/feature-decay.webp`,
      alt: 'OLake Fusion maintenance steps completed on a table',
      width: 507,
      height: 437.4
    },
    mockClassName: MOCK
  },
  config: {
    background: <Field />,
    glow: <FeatureGlow />,
    copyTop: 395,
    bodyWidth: 323,
    image: {
      src: `${IMG}/feature-config.webp`,
      alt: 'OLake Fusion cleanup schedule settings',
      width: 507,
      height: 437.4
    },
    mockClassName: MOCK
  },
  hosted: {
    background: <Field />,
    glow: <FeatureGlow />,
    copyTop: 395,
    bodyWidth: 323,
    image: {
      src: `${IMG}/feature-hosted.webp`,
      alt: 'OLake Fusion deployment running on your own infrastructure',
      width: 507,
      height: 437.4
    },
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
