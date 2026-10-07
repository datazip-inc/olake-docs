import React from 'react'
import LakesidePage from '@site/src/components/landing/ui/LakesidePage'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import Hero from '@site/src/components/landing/fusion/Hero'
import ProductFlow from '@site/src/components/landing/fusion/ProductFlow'
import SilentTax from '@site/src/components/landing/fusion/SilentTax'
import Features from '@site/src/components/landing/fusion/Features'
import Benchmark from '@site/src/components/landing/fusion/Benchmark'
import FusionCta from '@site/src/components/landing/fusion/FusionCta'
import Faq from '@site/src/components/landing/fusion/Faq'
import { FUSION_SEO } from '@site/src/data/landing/seo'
import { HERO_HEADLINE_FLAG, HERO_HEADLINES } from '@site/src/data/landing/fusion/hero'
import '@site/src/components/landing/fusion/fusion.css'
import { useFeatureFlagVariant } from '@site/src/lib/posthog/useFeatureFlagVariant'

export default function OLakeFusionPage() {
  // PostHog A/B test on the hero headline; 'performance' is the server-rendered default.
  const headline = useFeatureFlagVariant(HERO_HEADLINE_FLAG, HERO_HEADLINES, 'performance')

  return (
    <LakesidePage
      title={FUSION_SEO.title}
      description={FUSION_SEO.description}
      activePath='/olake-fusion'
      heroBackground={<Hero headline={headline} />}
    >
      <LandingSeo
        title={FUSION_SEO.title}
        description={FUSION_SEO.description}
        twitterDescription={FUSION_SEO.twitterDescription}
        canonicalUrl={FUSION_SEO.canonicalUrl}
        ogImage={FUSION_SEO.ogImage}
        jsonLdSchemas={FUSION_SEO.jsonLdSchemas}
      />
      <ProductFlow />
      <SilentTax />
      <Features />
      <Benchmark />
      <FusionCta />
      <Faq />
    </LakesidePage>
  )
}
