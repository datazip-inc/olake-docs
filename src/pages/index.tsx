import React from 'react'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'
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
      <Head>
        {/* The lakeside design is set in Geist. */}
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap'
        />
      </Head>
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
