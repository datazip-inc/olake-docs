import type { ProductFaqItem } from '@site/src/components/landing/product/ProductFaq'

export const GO_FAQ_EYEBROW = 'FAQs'

export const GO_FAQ_TITLE = 'You might have some questions'

/** The visible FAQ, in display order. The page's FAQPage JSON-LD (seo.ts) is built from it. */
export const GO_FAQS: ProductFaqItem[] = [
  {
    q: 'How to get started?',
    a: 'Check the Quickstart Guide. With a single Docker command you can spin up OLake Go and access the UI.'
  },
  {
    q: 'Is OLake Go really open source?',
    a: 'Yes. OLake Go is fully open source under the Apache 2.0 license. You can explore the GitHub repository (already starred by 1K+ developers) and use it freely without hidden costs.'
  },
  {
    q: 'Is there any enterprise plan?',
    a: "We're actively working on providing enterprise support, from professional assistance and pilot programs to helping teams scale OLake Go in production. You can reach out at hello@olake.io to learn more."
  },
  {
    q: 'How can I contribute?',
    a: 'Join our Slack community, review the Contribution Guide, and explore "Good First Issues" on GitHub. Contributors can get their pull requests merged and be part of building the fastest open-source Iceberg-native ingestion tool.'
  },
  {
    q: 'Why should I use OLake Go?',
    a: 'OLake Go makes data replication into Apache Iceberg seamless, faster, and cost-efficient. It handles real-time CDC, schema and partition evolution, full and incremental syncs, and compaction, all without vendor lock-in, so your Iceberg tables stay open, scalable, and ready for analytics.'
  },
  {
    q: 'What data platforms and tools does OLake Go integrate with?',
    a: 'As of now, we integrate with Apache Iceberg and S3 as destinations. You can query it using popular query engines like Spark, AWS Athena, Snowflake, Databricks, and BigQuery.'
  }
]
