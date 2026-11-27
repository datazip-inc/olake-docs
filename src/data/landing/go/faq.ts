import type { ProductFaqItem } from '@site/src/components/landing/product/ProductFaq'
import {
  GITHUB_REPO_URL,
  GO_QUICKSTART,
  SLACK_URL
} from '@site/src/components/landing/chrome/navItems'

export const GO_FAQ_EYEBROW = 'FAQs'

export const GO_FAQ_TITLE = 'You might have some questions'

/** The visible FAQ, in display order. The page's FAQPage JSON-LD (seo.ts) is built from it. */
export const GO_FAQS: ProductFaqItem[] = [
  {
    q: 'How to get started?',
    a: 'Check the Quickstart Guide. With a single Docker command you can spin up OLake Go and access the UI.',
    links: [{ text: 'Quickstart Guide', href: GO_QUICKSTART }]
  },
  {
    q: 'Is OLake Go really open source?',
    a: 'Yes. OLake Go is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 2,300+ developers) and use it freely without hidden costs.',
    links: [{ text: 'GitHub repository', href: GITHUB_REPO_URL }]
  },
  {
    q: 'Is there any enterprise plan?',
    a: 'Yes. We offer enterprise support based on your governance, risk and compliance (GRC) requirements, from professional assistance and pilot programs to helping teams scale OLake Go in production. You can reach out at hello@olake.io or request a callback to learn more.',
    links: [{ text: 'request a callback', href: '/contact/' }]
  },
  {
    q: 'How can I contribute?',
    a: 'Join our Slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building an open-source, Iceberg-native ingestion tool.',
    links: [{ text: 'Slack community', href: SLACK_URL }]
  },
  {
    q: 'Why should I use OLake Go?',
    a: 'OLake Go makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, and full and incremental syncs, all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics. Pair it with OLake Fusion for compaction and table maintenance.'
  },
  {
    q: 'What data platforms and tools does OLake Go integrate with?',
    a: 'OLake Go writes Apache Iceberg tables (on S3, GCS, Azure ADLS Gen2 or MinIO) or plain Parquet (on S3, GCS, Azure Blob Storage or a local filesystem). You can query the Iceberg tables using popular query engines like Spark, AWS Athena, Snowflake, Databricks, and BigQuery.'
  }
]
