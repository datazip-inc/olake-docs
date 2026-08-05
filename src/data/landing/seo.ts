import type { JsonLdSchema } from '@site/src/components/landing/seo/LandingSeo'

const SITE_URL = 'https://olake.io'
// The design's helmet references https://olake.io/olake-go-og.png / olake-fusion-og.png,
// neither of which ships in the bundle or exists in this repo. Falling back to the
// existing site OG image rather than a broken reference.
const FALLBACK_OG_IMAGE = `${SITE_URL}/img/logo/olake-blue.webp`

export const GO_SEO = {
  title: 'OLake Go — Fastest Open-Source Data Replication to Apache Iceberg & S3',
  description:
    'Open-source data replication tool that streams databases and streaming sources into Apache Iceberg and S3 with CDC, schema evolution and parallel chunking.',
  twitterDescription: 'Stream any source into your lakehouse with CDC, schema evolution and parallel chunking — up to 12.5× faster than Fivetran.',
  canonicalUrl: `${SITE_URL}/olake-go`,
  ogImage: FALLBACK_OG_IMAGE,
  jsonLdSchemas: [
    {
      id: 'software-application',
      data: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'OLake Go',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        description: 'Open-source data replication tool that streams databases and streaming sources into Apache Iceberg and S3 with CDC, schema evolution and parallel chunking.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: 'https://www.apache.org/licenses/LICENSE-2.0',
        url: `${SITE_URL}/olake-go`,
        publisher: { '@type': 'Organization', name: 'Datazip', url: SITE_URL }
      }
    },
    {
      id: 'faq-page',
      data: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How to get started?', acceptedAnswer: { '@type': 'Answer', text: 'Follow the OLake quickstart guide to run your first sync in minutes.' } },
          {
            '@type': 'Question',
            name: 'Is OLake really open source?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. OLake is fully open source under the Apache 2.0 license. You can explore the GitHub repository and use it freely.' }
          },
          {
            '@type': 'Question',
            name: 'Is there any enterprise plan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "We're actively working on providing enterprise support, from professional assistance and pilot programs to helping teams scale OLake in production."
            }
          },
          {
            '@type': 'Question',
            name: 'How can I contribute?',
            acceptedAnswer: { '@type': 'Answer', text: 'Join our Slack community, review the Contribution Guide, and explore Good First Issues on GitHub.' }
          },
          {
            '@type': 'Question',
            name: 'Why should I use OLake?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'OLake makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, and full and incremental syncs.'
            }
          },
          {
            '@type': 'Question',
            name: 'What data platforms and tools does OLake integrate with?',
            acceptedAnswer: { '@type': 'Answer', text: 'As of now, we integrate with Apache Iceberg as a destination. You can query it from most big data platforms like Snowflake, Databricks and others.' }
          }
        ]
      }
    }
  ] as JsonLdSchema[]
}

// v2's own <helmet> ships no SEO metadata at all — only @font-face + CSS.
// Since v2 takes over `/`, this carries the title/OG/canonical and all
// five JSON-LD objects from the legacy homepage (src/legacy/home-v1/index.jsx)
// rather than shipping the site root with no structured data.
export const HOME_SEO = {
  title: 'Fastest Open Source Data Replication Tool',
  description:
    'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
  canonicalUrl: `${SITE_URL}/`,
  ogImage: `${SITE_URL}/img/logo/olake-blue.webp`,
  jsonLdSchemas: [
    {
      id: 'organization',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'OLake',
        url: `${SITE_URL}/`,
        logo: { '@type': 'ImageObject', url: 'https://olake.io/img/logo/olake-blue.svg', width: 32, height: 32 },
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: 'hello@olake.io' }],
        sameAs: ['https://github.com/datazip-inc/olake', 'https://x.com/_olake', 'https://www.linkedin.com/company/datazipio/', 'https://www.youtube.com/@olakeio'],
        address: { '@type': 'PostalAddress', streetAddress: '16192 COASTAL HWY', addressLocality: 'LEWES', addressRegion: 'DE', postalCode: '19958', addressCountry: 'US' }
      }
    },
    {
      id: 'website',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: `${SITE_URL}/`,
        name: 'Fastest Open Source Data Replication Tool',
        description:
          'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
        publisher: { '@type': 'Organization', name: 'OLake' },
        potentialAction: { '@type': 'SearchAction', target: 'https://olake.io/search?q={search_term_string}', 'query-input': 'required name=search_term_string' }
      }
    },
    {
      id: 'webpage',
      data: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `${SITE_URL}/`,
        name: 'OLake - Fastest Open Source Data Replication Tool',
        isPartOf: { '@type': 'WebSite', name: 'OLake' },
        description:
          'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
        publisher: { '@type': 'Organization', name: 'OLake', logo: { '@type': 'ImageObject', url: 'https://olake.io/img/site/hero-section.svg' } },
        primaryImageOfPage: { '@type': 'ImageObject', url: 'https://olake.io/img/site/hero-section.svg', width: 516, height: 605 }
      }
    },
    {
      id: 'breadcrumb',
      data: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }]
      }
    }
  ] as JsonLdSchema[]
}

export const FUSION_SEO = {
  title: 'OLake Fusion — Automated Apache Iceberg Table Maintenance & Compaction',
  description: 'Keep Apache Iceberg tables consistently performant and scalable with automated compaction, delete-file cleanup, and metadata trimming.',
  twitterDescription: 'Automated Iceberg table maintenance — compaction, cleanup, and metadata trimming, up to 2× faster than Apache Spark.',
  canonicalUrl: `${SITE_URL}/olake-fusion`,
  ogImage: FALLBACK_OG_IMAGE,
  jsonLdSchemas: [
    {
      id: 'software-application',
      data: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'OLake Fusion',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        description: 'Automated Apache Iceberg table maintenance: compaction, delete-file cleanup, and metadata trimming.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: `${SITE_URL}/olake-fusion`,
        publisher: { '@type': 'Organization', name: 'Datazip', url: SITE_URL }
      }
    }
  ] as JsonLdSchema[]
}
