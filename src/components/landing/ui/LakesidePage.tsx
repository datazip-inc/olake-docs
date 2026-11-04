import React from 'react'
import Layout from '@theme/Layout'
import LakesideNavbar from '../chrome/LakesideNavbar'
import LakesideFooter from '../chrome/LakesideFooter'
import LightModeEnforcer from '@site/src/components/LightModeEnforcer'
import useRevealOnScroll from '@site/src/hooks/useRevealOnScroll'
import '../chrome/chrome.css'

/**
 * The shell for the marketing pages (home, OLake Go, OLake Fusion): Docusaurus' Layout without its
 * navbar and footer, the floating pill navbar over the hero, the Lakeside footer, and the light
 * palette pinned. `children` goes between the navbar and the footer; put the hero first and give
 * its wrapper the negative top margin so the pill floats over it (see HomePage).
 */
export default function LakesidePage({
  title,
  description,
  activePath,
  heroBackground,
  children
}: {
  title: string
  description: string
  /** Nav entry to mark as current, e.g. '/olake-go'. */
  activePath: string
  /** Hero node, rendered inside `.lakeside-hero-bg` so the streak background sits behind the pill. */
  heroBackground?: React.ReactNode
  children?: React.ReactNode
}) {
  useRevealOnScroll()
  return (
    <Layout title={title} description={description} wrapperClassName='landing-page' noFooter>
      <LightModeEnforcer />
      <div className='lakeside-page'>
        <LakesideNavbar activePath={activePath} />
        {/* The one <main> of the page. Docusaurus' skip link focuses `main:first-of-type`, so it
            lands here, after the navbar. Pages that use this shell must not render their own <main>. */}
        <main id='lakeside-main'>
          {heroBackground && (
            <div className='lakeside-hero-bg mt-[-68px] lg:mt-[-82px]'>{heroBackground}</div>
          )}
          {children}
        </main>
        <LakesideFooter />
      </div>
    </Layout>
  )
}
