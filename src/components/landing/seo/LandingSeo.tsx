import React from 'react'
import Head from '@docusaurus/Head'

export interface JsonLdSchema {
  id: string
  data: Record<string, unknown>
}

interface LandingSeoProps {
  title: string
  description: string
  canonicalUrl: string
  ogImage: string
  twitterTitle?: string
  twitterDescription?: string
  jsonLdSchemas: JsonLdSchema[]
}

/**
 * Shared SEO head block for the three landing pages, following the pattern
 * already used by src/pages/index.jsx and other pages in this repo.
 *
 * Note: as of this port, `<script type="application/ld+json"
 * dangerouslySetInnerHTML>` inside `<Head>` renders nothing in this site's
 * production build (verified with a minimal repro — pre-existing on
 * `master`, not introduced here; `about-us.jsx`'s identical block has the
 * same issue). Kept for consistency with the rest of the site and so it
 * starts working the moment that separate bug is fixed.
 */
export default function LandingSeo({
  title,
  description,
  canonicalUrl,
  ogImage,
  twitterTitle,
  twitterDescription,
  jsonLdSchemas
}: LandingSeoProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={canonicalUrl} />

      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:site_name' content='OLake' />
      <meta property='og:locale' content='en_US' />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:type' content='image/webp' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={twitterTitle ?? title} />
      <meta name='twitter:description' content={twitterDescription ?? description} />
      <meta name='twitter:image' content={ogImage} />

      {jsonLdSchemas.map((schema) => (
        <script
          key={schema.id}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.data) }}
        />
      ))}
    </Head>
  )
}
