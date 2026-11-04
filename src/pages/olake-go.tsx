import React from 'react'
import LandingSeo from '@site/src/components/landing/seo/LandingSeo'
import GoPage from '@site/src/components/landing/go/GoPage'
import { GO_SEO } from '@site/src/data/landing/seo'

export default function OLakeGoPage() {
  return (
    <>
      <LandingSeo
        title={GO_SEO.title}
        description={GO_SEO.description}
        twitterDescription={GO_SEO.twitterDescription}
        canonicalUrl={GO_SEO.canonicalUrl}
        ogImage={GO_SEO.ogImage}
        jsonLdSchemas={GO_SEO.jsonLdSchemas}
      />
      <GoPage title={GO_SEO.title} description={GO_SEO.description} />
    </>
  )
}
