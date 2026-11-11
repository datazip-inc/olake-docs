/** Hero copy and calls to action for the lakeside home page. */
import { GITHUB_REPO_URL } from '@site/src/components/landing/chrome/navItems'

export const HERO = {
  /** Rendered as one heading; `tail` picks up the design's grey clause. */
  headline: 'Open Source Ingestion & Maintenance Tool for ',
  headlineTail: 'Apache Iceberg',
  body: 'Achieve zero-effort Apache Iceberg table maintenance and high-throughput ingestion into Iceberg and Parquet on S3 with OLake',
  /** Shown above the buttons with a copy button. */
  installCommand: 'curl -sSL https://raw.githubusercontent.com/datazip-inc/olake-ui/master/docker-compose-v1.yml | ENABLE_OPTIMIZATION="true" docker compose --profile fusion -f - up -d',
  primary: { label: 'Try OLake', href: '/docs/getting-started/quickstart/' },
  secondary: { label: 'Github', href: GITHUB_REPO_URL, external: true }
}
