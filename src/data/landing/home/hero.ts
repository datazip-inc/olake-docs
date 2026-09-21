/** Hero copy and calls to action for the lakeside home page. */
import { GITHUB_REPO_URL } from '@site/src/components/landing/Navbar/navData'

export const HERO = {
  /** Rendered as one heading; `tail` picks up the design's grey clause. */
  headline: 'Open Source Ingestion & Maintenance Tool for ',
  headlineTail: 'Apache Iceberg',
  body: 'Open-source replication from Postgres, MySQL, MongoDB, Oracle and Kafka into Apache Iceberg, and the maintenance engine that keeps those tables fast as they grow. Runs entirely in your own cloud. Apache 2.0.',
  primary: { label: 'Try OLake', href: '/docs/getting-started/quickstart/' },
  secondary: { label: 'Github', href: GITHUB_REPO_URL, external: true }
}
