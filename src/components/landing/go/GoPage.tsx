import React from 'react'
import LakesidePage from '../ui/LakesidePage'
import GoHero from './GoHero'
import GoArchitecture from './GoArchitecture'
import GoProblem from './GoProblem'
import GoFeatures from './GoFeatures'
import GoBenchmark from './GoBenchmark'
import GoFaq from './GoFaq'
import GoCta from './GoCta'

/** The OLake Go product page: hero, diagram, problem, features, benchmarks, FAQ and a closing CTA. */
export default function GoPage({ title, description }: { title: string; description: string }) {
  return (
    <LakesidePage
      title={title}
      description={description}
      activePath='/olake-go'
      heroBackground={<GoHero />}
    >
      {/* Infima gives headings, paragraphs and lists bottom margins and lists a left padding;
          the lakeside reset is zero-specificity and loses, so it is undone here for the whole page. */}
      <div className='[&_:is(h2,h3,p,ul)]:mb-0 [&_ul]:pl-0'>
        <GoArchitecture />
        <GoProblem />
        <GoFeatures />
        <div className='lakeside-benchmark-suite'>
          <div className='lakeside-benchmark-suite-frame'>
            <GoBenchmark />
          </div>
        </div>
        <GoFaq />
        <GoCta />
      </div>
    </LakesidePage>
  )
}
