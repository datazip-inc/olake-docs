/**
 * JSON-LD schemas for the query engine intro page.
 * Kept in .js so MDX parser does not see '@' in object literals.
 */

export const queryEngineIntroSchemas = [
  {
    id: 'organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'OLake',
      url: 'https://olake.io/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://olake.io/img/logo/olake-blue.svg',
        width: 32,
        height: 32
      },
      sameAs: [
        'https://github.com/datazip-inc/olake',
        'https://x.com/_olake',
        'https://www.linkedin.com/company/datazipio/',
        'https://www.youtube.com/@olakeio'
      ]
    }
  },
  {
    id: 'website',
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://olake.io/',
      name: 'Fastest Open Source Data Replication Tool',
      description: 'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
      publisher: { '@type': 'Organization', name: 'OLake' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://olake.io/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  },
  {
    id: 'techArticle',
    data: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://olake.io/iceberg/query-engine/' },
      headline: 'Apache Iceberg Query Engine Support Matrix',
      description: 'Comprehensive comparison of 16 query engines supporting Apache Iceberg table format with detailed feature analysis (catalogs, DML, MoR/CoW, streaming, format v3, time travel and security).',
      url: 'https://olake.io/iceberg/query-engine/',
      author: { '@type': 'Organization', name: 'OLake' },
      publisher: {
        '@type': 'Organization',
        name: 'OLake',
        url: 'https://olake.io/',
        logo: { '@type': 'ImageObject', url: 'https://olake.io/img/logo/olake-blue.svg', width: 32, height: 32 }
      },
      datePublished: '2025-10-17',
      articleSection: ['Apache Iceberg', 'Query Engine', 'Support Matrix', 'Spark', 'Flink', 'Trino', 'Athena', 'BigQuery', 'Snowflake'],
      keywords: 'Apache Iceberg, query engines, support matrix, Spark, Flink, Trino, Athena, BigQuery, Snowflake, OLake'
    }
  },
  {
    id: 'breadcrumb',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://olake.io/' },
        { '@type': 'ListItem', position: 2, name: 'Iceberg', item: 'https://olake.io/iceberg/' },
        { '@type': 'ListItem', position: 3, name: 'Query Engine', item: 'https://olake.io/iceberg/query-engine/' }
      ]
    }
  }
];
