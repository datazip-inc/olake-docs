import React from 'react'
import ProductPage from '../product/ProductPage'
import FusionHero from './FusionHero'
import FusionProblem from './FusionProblem'
import FusionFeatures from './FusionFeatures'
import FusionBenchmark from './FusionBenchmark'
import FusionCta from './FusionCta'
import FusionFaq from './FusionFaq'

/** The OLake Fusion product page: hero, problem, features, benchmarks, a closing CTA and the FAQ. */
export default function FusionPage({
  title,
  description,
  headline
}: {
  title: string
  description: string
  /** The hero headline, from the PostHog A/B test. */
  headline: string
}) {
  return (
    <ProductPage title={title} description={description} activePath='/olake-fusion'>
      <FusionHero headline={headline} />
      <FusionProblem />
      <FusionFeatures />
      <FusionBenchmark />
      <FusionCta />
      <FusionFaq />
    </ProductPage>
  )
}
