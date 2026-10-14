import type { GoSourceId } from '@site/src/data/landing/go/hero'

/** A logo as a plain image: its file and the size the design shows it at. */
export interface GoLogo {
  src: string
  width: number
  height: number
}

/**
 * The logo of each source OLake Go reads from, and of Apache Iceberg (a destination), shared by the
 * hero's sources strip and the dashboard under it. Most reuse the site's existing logo files; MSSQL
 * and DB2 are the design's own artwork, cropped to the mark.
 */
export const GO_LOGOS: Record<GoSourceId | 'iceberg', GoLogo> = {
  kafka: { src: '/img/site/kafka.png', width: 10.44, height: 17.31 },
  postgres: { src: '/img/site/postgres.svg', width: 20.81, height: 20.81 },
  mysql: { src: '/img/site/mysql.svg', width: 20.81, height: 20.81 },
  mongodb: { src: '/img/site/mongodb.svg', width: 20.81, height: 20.81 },
  s3: { src: '/img/landing/v2/connector-s3.webp', width: 15.55, height: 18.6 },
  mssql: { src: '/img/landing/go/source-mssql.webp', width: 18.51, height: 20 },
  db2: { src: '/img/landing/go/source-db2.webp', width: 17.74, height: 17.74 },
  oracle: { src: '/img/site/oracle.png', width: 21, height: 21 },
  iceberg: { src: '/img/landing/go/destination-iceberg.webp', width: 20, height: 20 }
}
