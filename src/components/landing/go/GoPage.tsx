import React from 'react'
import ProductPage from '../product/ProductPage'
import GoHero from './GoHero'
import GoProblem from './GoProblem'
import GoFeatures from './GoFeatures'
import GoBenchmark from './GoBenchmark'
import GoCta from './GoCta'
import GoFaq from './GoFaq'
import './go.css'

/** The OLake Go product page: hero, problem, features, benchmarks, a closing CTA and the FAQ. */
export default function GoPage({ title, description }: { title: string; description: string }) {
  return (
    <ProductPage title={title} description={description} activePath='/olake-go'>
      <GoHero />
      <GoProblem />
      <GoFeatures />
      <GoBenchmark />
      <GoCta />
      <GoFaq />
    </ProductPage>
  )
}
