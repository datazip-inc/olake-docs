import React from 'react'
import LakesideNavbar from '../chrome/LakesideNavbar'
import LakesideFooter from '../chrome/LakesideFooter'
import Hero from './sections/Hero'
import TrustedBy from './sections/TrustedBy'
import GoBenchmark from './sections/GoBenchmark'
import FusionBenchmark from './sections/FusionBenchmark'
import TwoEngines from './sections/TwoEngines'
import Features from './sections/Features'
import Architecture from './sections/Architecture'
import Bulletin from './sections/Bulletin'
import CustomerStories from './sections/CustomerStories'
import EnterpriseCta from './sections/EnterpriseCta'
import useRevealOnScroll from '@site/src/hooks/useRevealOnScroll'
import '../chrome/chrome.css'

export interface HomePageProps {
  /** Latest OLake Go release, derived at build time in docusaurus.config.js. */
  latestReleaseLabel?: string
  latestReleasePath?: string
}

export default function HomePage({ latestReleaseLabel, latestReleasePath }: HomePageProps) {
  useRevealOnScroll()
  return (
    <div className='lakeside-page'>
      <LakesideNavbar activePath='/' />
      {/* Same single <main> as LakesidePage; the skip link focuses it. */}
      <main id='lakeside-main'>
        <div className='lakeside-hero-bg mt-[-68px] lg:mt-[-82px]'>
          <Hero />
        </div>
        <TrustedBy />
        <div className='lakeside-benchmark-suite'>
          <div className='lakeside-benchmark-suite-frame'>
            <GoBenchmark />
            <FusionBenchmark />
          </div>
        </div>
        <TwoEngines />
        <Features />
        <Architecture />
        <Bulletin latestReleaseLabel={latestReleaseLabel} latestReleasePath={latestReleasePath} />
        <CustomerStories />
        <EnterpriseCta />
      </main>
      <LakesideFooter />
    </div>
  )
}
