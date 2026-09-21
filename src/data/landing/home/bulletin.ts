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
        title: 'Issues with Debezium & how OLake solved them',
        href: '/blog/issues-debezium-kafka/',
        img: '/img/landing/v2/bull-engineering.webp'
      },
      {
        tag: 'Benchmark',
        title: 'Iceberg compaction: Spark vs OLake Fusion',
        href: '/blog/iceberg-compaction-spark-vs-fusion-benchmark/',
        img: '/img/landing/v2/bull-benchmark.webp'
      },
      {
        tag: 'Blog',
        title: 'Schema evolution without breaking pipelines',
        href: '/blog/schema-evolution-without-breaking-pipelines/',
        img: '/img/landing/v2/bull-release.webp'
      }
    ]
  },
  {
    id: 'webinars',
    label: 'Webinars',
    heading: 'Webinars',
    items: [
      {
        tag: 'Webinar',
        title: 'Iceberg for Agents',
        href: '/webinar/w-14-iceberg-for-agents',
        img: '/img/landing/v2/bull-engineering.webp'
      },
      {
        tag: 'Webinar',
        title: 'Apache Arrow + ADBC & Apache Iceberg',
        href: 'https://www.youtube.com/watch?v=shrS0qdOPis&list=PL0H6rlkVhiiGSaO_xr1xBJ16dQKI-jvF_&index=14',
        img: '/img/landing/v2/bull-benchmark.webp',
        external: true
      },
      {
        tag: 'Demo',
        title: 'OLake quickstart: your first ingestion pipeline',
        href: 'https://youtu.be/IcAJmW72d2A?si=bAmaDOdEDy6vbKt8',
        img: '/img/landing/v2/bull-release.webp',
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
        title: 'OLake Fusion: compaction, scheduling and maintenance',
        href: '/docs/fusion/getting-started/compaction/',
        img: '/img/landing/v2/bull-benchmark.webp'
      }
    ]
  }
]
