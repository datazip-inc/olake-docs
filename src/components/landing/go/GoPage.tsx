import React from 'react'
import LakesidePage from '../ui/LakesidePage'
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
    <LakesidePage title={title} description={description} activePath='/olake-go'>
      {/* The negative top margin slides the page (and its grain) under the floating navbar, as the
          other landing heroes do. Infima gives headings, paragraphs and lists bottom margins and
          lists a left padding; the lakeside reset is zero-specificity and loses, so it is undone
          here for the whole page. */}
      <div className='go-page mt-[-68px] lg:mt-[-82px] [&_:is(h1,h2,h3,p,ul)]:mb-0 [&_ul]:pl-0'>
        <GoHero />
        <GoProblem />
        <GoFeatures />
        <GoBenchmark />
        <GoCta />
        <GoFaq />
      </div>
    </LakesidePage>
  )
}
