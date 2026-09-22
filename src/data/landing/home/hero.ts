/** Hero copy and calls to action for the lakeside home page. */
import { GITHUB_REPO_URL } from '@site/src/components/landing/Navbar/navData'

export const HERO = {
  /** Rendered as one heading; `tail` picks up the design's grey clause. */
  headline: 'Open Source Ingestion & Maintenance Tool for ',
  headlineTail: 'Apache Iceberg',
  body: 'Achieve zero-effort Apache Iceberg table maintenance and the fastest ingestion into Iceberg and Parquet on S3 with OLake',
  primary: { label: 'Try OLake', href: '/docs/getting-started/quickstart/' },
  secondary: { label: 'Github', href: GITHUB_REPO_URL, external: true }
}
