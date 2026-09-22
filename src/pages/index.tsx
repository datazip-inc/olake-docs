import React from 'react'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import LightModeEnforcer from '@site/src/components/LightModeEnforcer'
import HomePage from '@site/src/components/landing/home/HomePage'
import { HOME_SEO } from '@site/src/data/landing/seo'

export default function Home() {
  // Derived at build time from docs/release/ingestion — see getLatestOlakeRelease()
  // in docusaurus.config.js. Keeps the bulletin release banner from going stale.
  const { siteConfig } = useDocusaurusContext()
  const latestReleaseLabel = siteConfig.customFields?.latestOlakeReleaseLabel as string | undefined
  const latestReleasePath = siteConfig.customFields?.latestOlakeReleasePath as string | undefined

  return (
    <Layout
      title={HOME_SEO.title}
      description={HOME_SEO.description}
      wrapperClassName='landing-page'
      noFooter
    >
      {/* The lakeside design uses Geist (loaded async via font-loading-optimizer.js) */}
      <LandingSeo
        title={HOME_SEO.title}
        description={HOME_SEO.description}
        canonicalUrl={HOME_SEO.canonicalUrl}
        ogImage={HOME_SEO.ogImage}
        jsonLdSchemas={HOME_SEO.jsonLdSchemas}
      />
      <LightModeEnforcer />
      <HomePage latestReleaseLabel={latestReleaseLabel} latestReleasePath={latestReleasePath} />
    </Layout>
  )
}
