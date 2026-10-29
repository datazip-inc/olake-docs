import React from 'react'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import FusionPage from '@site/src/components/landing/fusion/FusionPage'
import { FUSION_SEO } from '@site/src/data/landing/seo'
import { HERO_HEADLINE_FLAG, HERO_HEADLINES } from '@site/src/data/landing/fusion/hero'
import { useFeatureFlagVariant } from '@site/src/lib/posthog/useFeatureFlagVariant'

export default function OLakeFusionPage() {
  // PostHog A/B test on the hero headline; 'performance' is the server-rendered default.
  const headline = useFeatureFlagVariant(HERO_HEADLINE_FLAG, HERO_HEADLINES, 'performance')

  return (
    <>
      <LandingSeo
        title={FUSION_SEO.title}
        description={FUSION_SEO.description}
        twitterDescription={FUSION_SEO.twitterDescription}
        canonicalUrl={FUSION_SEO.canonicalUrl}
        ogImage={FUSION_SEO.ogImage}
        jsonLdSchemas={FUSION_SEO.jsonLdSchemas}
      />
      <FusionPage
        title={FUSION_SEO.title}
        description={FUSION_SEO.description}
        headline={headline}
      />
    </>
  )
}
