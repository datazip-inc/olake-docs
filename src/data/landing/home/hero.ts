/** Hero copy and calls to action for the lakeside home page. */
import { GITHUB_REPO_URL } from '@site/src/components/landing/chrome/navItems'

export const HERO = {
  /** Rendered as one heading; `tail` picks up the design's grey clause. */
  headline: 'Open Source Ingestion & Maintenance Tool for ',
  headlineTail: 'Apache Iceberg',
  body: 'High-throughput ingestion into Apache Iceberg and Parquet with OLake Go, and automated Iceberg table maintenance with OLake Fusion',
  /** Shown above the buttons with a copy button. */
  installCommand: 'curl -sSL https://raw.githubusercontent.com/datazip-inc/olake-ui/master/docker-compose-v1.yml | ENABLE_OPTIMIZATION="true" docker compose --profile fusion -f - up -d',
  primary: { label: 'Try OLake', href: '/docs/getting-started/quickstart/' },
  secondary: { label: 'Github', href: GITHUB_REPO_URL, external: true }
}
