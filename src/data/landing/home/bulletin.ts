/**
 * OLake Bulletin — curated, because the blog plugin does not expose post
 * metadata to components today. Every entry points at content that already
 * exists on the site (seeded from `landing/pages/useHomeLogic.ts`).
 * The "Latest Release" banner above the tabs is dynamic: it reads
 * `customFields.latestOlakeReleaseLabel/Path` from docusaurus.config.js.
 */
export interface BulletinItem {
  tag: string
  title: string
  href: string
  img: string
  external?: boolean
}

export interface BulletinTab {
  id: string
  label: string
  /** Heading shown next to the tab rail. */
  heading: string
  items: BulletinItem[]
}

export const BULLETIN_TABS: BulletinTab[] = [
  {
    id: 'blogs',
    label: 'Blogs',
    heading: 'Blogs & Docs',
    items: [
      {
        tag: 'Blog',
        title: 'DLTHub Alternatives: 8 Best Competitors in 2026',
        href: '/blog/dlthub-alternatives/',
        img: '/img/landing/v2/bull-debezium-blue.png'
      },
      {
        tag: 'Benchmark',
        title: 'The Iceberg Interoperability Myth',
        href: '/blog/iceberg-interoperability-myth-row-level-deletes/',
        img: '/img/landing/v2/bull-debezium-green.png'
      },

    ]
  },
  {
    id: 'webinars',
    label: 'Webinars',
    heading: 'Webinars',
    items: [
      {
        tag: 'Webinar',
        title: 'Apache Iceberg for Beginners: Build a Lakehouse Anywhere ft. MinIO',
        href: '/webinar/w-15-iceberg-for-beginners-minio/',
        img: '/img/landing/v2/brenna-buuck.webp'
      },
      {
        tag: 'Webinar',
        title: 'Apache Arrow + ADBC & Apache Iceberg',
        href: 'https://www.youtube.com/watch?v=shrS0qdOPis&list=PL0H6rlkVhiiGSaO_xr1xBJ16dQKI-jvF_&index=14',
        img: '/img/landing/v2/matt-topol.webp',
        external: true
      }
    ]
  },
  {
    id: 'product-updates',
    label: 'Product Updates',
    heading: 'Product Updates',
    items: [
      {
        tag: 'Release notes',
        title: 'OLake Go release notes',
        href: '/docs/release/ingestion/overview',
        img: '/img/landing/v2/bull-release.webp'
      },
      {
        tag: 'Docs',
        title: 'OLake Fusion compaction benchmark: 2.06x faster than Spark',
        href: '/docs/fusion/getting-started/compaction/',
        img: '/img/landing/v2/bull-benchmark.webp'
      }
    ]
  }
]
