import React from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ensureTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value : `${value}/`;
};

const stripTrailingSlash = (value) => {
  if (!value) {
    return value;
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
};

export default function BlogPostPageWrapper(props) {
  const { content: BlogPostContent } = props;
  const { metadata } = BlogPostContent;
  const { siteConfig } = useDocusaurusContext();
  
  // Extract author name and reading time
  const authorName = metadata.authors?.[0]?.name || 'OLake Team';
  const readingTime = metadata.readingTime || '5 minutes';

  const baseUrl = stripTrailingSlash(siteConfig?.url || 'https://olake.io');
  const permalink = metadata.permalink || '';
  const canonicalUrl = permalink ? ensureTrailingSlash(`${baseUrl}${permalink}`) : null;
  const normalizedPermalink = ensureTrailingSlash(permalink || '');
  const imageUrl = metadata.image ? `${baseUrl}${metadata.image}` : 'https://olake.io/img/logo/olake-blue.svg';

  const organizationSchema = {
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
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hello@olake.io'
      }
    ],
    sameAs: [
      'https://github.com/datazip-inc/olake',
      'https://x.com/_olake',
      'https://www.linkedin.com/company/datazipio/',
      'https://www.youtube.com/@olakeio'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '16192 COASTAL HWY',
      addressLocality: 'LEWES',
      addressRegion: 'DE',
      postalCode: '19958',
      addressCountry: 'USA'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://olake.io/',
    name: 'Fastest Open Source Data Replication Tool',
    description:
      'Fastest open-source tool for replicating Databases to Data Lake in Open Table Formats like Apache Iceberg. Efficient, quick and scalable data ingestion for real-time analytics. Supporting Postgres, MongoDB, MySQL, Oracle and Kafka with 5-500x faster than alternatives.',
    publisher: {
      '@type': 'Organization',
      name: 'OLake'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://olake.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const publisher = {
    '@type': 'Organization',
    name: 'OLake',
    url: 'https://olake.io/',
    logo: {
      '@type': 'ImageObject',
      url: 'https://olake.io/img/logo/olake-blue.svg',
      width: 32,
      height: 32
    }
  };

  const schemaByPermalink = {
    '/blog/2025/10/03/iceberg-metadata/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Shruti Mantri',
          jobTitle: 'Staff Software Engineer',
          url: 'https://olake.io/blog/authors/shruti/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT43M',
        articleSection: ['Apache Iceberg', 'Metadata', 'Snapshots', 'Manifests', 'Data Lakehouse'],
        keywords: 'Apache Iceberg, metadata, manifests, snapshots, data lakehouse, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apache Iceberg Metadata Explained: Snapshots & Manifests',
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Iceberg a replacement for Parquet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. This is the most fundamental misconception. Iceberg does not replace Parquet; it organizes it. They operate at two different architectural layers to solve two completely different problems.\n\nLet\'s make this concrete. Think of your data lake as a massive digital music library.\n\nParquet files are the individual MP3 files. Each one is a perfectly encoded, high-fidelity container for the actual music—your data. It is the raw asset.\n\nIceberg is the playlist. The playlist file itself contains no music. It is a simple metadata file that points to the specific MP3s that constitute your "Workout Mix". It provides the logical grouping, the name, and the order.\n\nYou can add or remove a song from the playlist (a transaction) or see what the playlist looked like last week (time travel) without ever altering the underlying MP3 files. Iceberg is the management layer; Parquet is the storage layer.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can you use Iceberg with other file formats like ORC or Avro?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, absolutely. The Iceberg specification is file-format-agnostic. While it is most commonly used with Apache Parquet for analytical workloads due to Parquet\'s columnar performance benefits, it is fully capable of managing tables composed of Apache ORC or Apache Avro files. This flexibility is a core design principle, ensuring that the table format does not lock you into a single storage format.'
            }
          },
          {
            '@type': 'Question',
            name: 'What are the main differences between Iceberg, Delta Lake, and Hudi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All three are open table formats designed to solve similar problems (ACID transactions, schema evolution, time travel). The primary differences lie in their design philosophy and underlying implementation.\n\nApache Iceberg: Prioritizes a universal, open specification with zero engine dependencies. Its greatest strengths are fast query planning at massive scale (via its manifest file indexes) and guaranteed interoperability. It is architected to avoid the "list-then-filter" problem that can plague other formats on petabyte-scale tables, making it a robust choice for multi-engine, large-scale data lakehouses.\n\nDelta Lake: Originated at Databricks and is deeply integrated with the Apache Spark ecosystem. It uses a chronological JSON transaction log (_delta_log) to track table state. It is often considered the most straightforward to adopt if your organization is already standardized on Databricks and Spark.\n\nApache Hudi: Originated at Uber with a strong focus on low-latency streaming ingest and incremental processing. It offers more granular control over the trade-off between write performance and read performance through its explicit Copy-on-Write and Merge-on-Read storage types.\n\nThe choice is one of architectural trade-offs. Iceberg is built for interoperability and scale, Delta for deep integration with Spark, and Hudi for fine-grained control over streaming workloads.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does using Iceberg add significant performance overhead?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'On the contrary, for any non-trivial table, Iceberg provides a significant performance improvement.\n\nThe perceived "overhead" is the storage of a few extra kilobytes of metadata files. The problem it solves is the primary performance bottleneck in cloud data lakes: recursively listing the millions of files that make up a large table. This LIST operation is notoriously slow and expensive.\n\nIceberg avoids this entirely by using its manifest files as a pre-built index of the table\'s data files. The query engine reads this small index to find the exact files it needs to scan, transforming a slow file-system operation into a fast metadata lookup. It trades a negligible amount of storage for a massive gain in query planning speed.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does Iceberg handle row-level deletes on Parquet files?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It\'s critical to remember that Parquet files are immutable. Iceberg never changes an existing Parquet file. Instead, it handles deletes using a metadata-driven, merge-on-read approach.\n\nWhen a DELETE command is issued, Iceberg creates lightweight delete files. These files store the path to a data file and the specific row positions within that file that are marked for deletion. At query time, the engine reads both the original Parquet data file and its associated delete file, merging them on the fly to present a view of the data where the deleted rows are filtered out.\n\nThink of it as an errata slip published for a book. The original book text is not altered, but the slip tells the reader to ignore a specific sentence on a specific page. The process of making this deletion permanent by rewriting the data files is handled by a separate, asynchronous compaction job.'
            }
          }
        ]
      }
    ],
    '/blog/apache-iceberg-hive-comparison/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Shruti Mantri',
          jobTitle: 'Staff Software Engineer',
          url: 'https://olake.io/blog/authors/shruti/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT32M',
        articleSection: ['Apache Iceberg', 'Hive', 'Data Lakehouse', 'Metadata', 'Architecture'],
        keywords: 'Apache Iceberg, Apache Hive, data lakehouse, schema evolution, metadata, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apache Iceberg vs Hive: Data Lakehouse Comparison Guide',
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is Apache Iceberg better than Hive for analytics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Iceberg generally offers stronger advantages for analytics workloads, especially those involving ad hoc queries, BI dashboards, or interactive exploration. Its metadata-driven pruning and hidden partitioning allow query engines to skip irrelevant files, dramatically reducing scan times. Hive, by contrast, relies on directory-based partitioning, which is slower and less flexible. That said, Hive remains perfectly adequate for batch-oriented ETL jobs in legacy Hadoop environments where performance is less critical.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I use Hive Metastore with Iceberg?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. In fact, many organizations start their Iceberg journey this way. Iceberg supports multiple catalogs, including Hive Metastore, AWS Glue, and REST catalogs. Using the Hive Metastore allows incremental adoption—teams can register Iceberg tables alongside Hive tables and gradually migrate workloads. The limitation is that Hive Metastore itself was not designed for high-scale metadata operations, so as adoption grows, some organizations eventually move to more scalable options like Glue or REST-based catalogs.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does Iceberg handle schema changes compared to Hive?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Schema evolution is one of Iceberg\'s standout features. It tracks columns by IDs rather than by name or position, which means you can rename, add, or drop columns without rewriting underlying data. Type changes are also supported in many cases. Hive, on the other hand, handles schema changes less gracefully. Renaming or dropping columns can cause inconsistencies, and type changes often require rewriting the table. For teams working in fast-moving domains, Iceberg\'s approach provides far more agility.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do I need ORC for Hive ACID?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, typically. Hive\'s ACID compliance relies on ORC files for transactional tables. These tables maintain base and delta files that must be periodically compacted. While Hive also supports other formats like Parquet or Avro for non-transactional tables, ORC remains the default and most reliable choice for ACID operations. This reliance on ORC is one reason why Hive feels more constrained compared to Iceberg, which supports multiple formats more flexibly.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is Iceberg only for the cloud?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not at all. While Iceberg is popular in cloud-native lakehouse architectures, it can also be deployed on-premise. What makes it cloud-friendly is its separation of storage and compute, plus support for object stores like S3, ADLS, and GCS. On-prem deployments often use Iceberg with distributed file systems like HDFS, though the benefits of time travel, schema evolution, and multi-engine compatibility are equally valuable regardless of environment.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can Hive and Iceberg coexist in the same environment?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes—and in many cases, they do. Organizations often run Hive and Iceberg side by side during migration. Some workloads remain on Hive where stability and legacy integration matter, while new workloads adopt Iceberg for flexibility and performance. Over time, the balance often shifts toward Iceberg, but coexistence provides a practical path to transition without disrupting critical pipelines.'
            }
          }
        ]
      }
    ],
    '/blog/apache-iceberg-vs-delta-lake-guide/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Shubham Satish Baldava',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/shubham/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT10M',
        articleSection: ['Apache Iceberg', 'Delta Lake', 'Data Lakehouse', 'Performance', 'Catalogs', 'Governance'],
        keywords: 'Apache Iceberg, Delta Lake, table formats, lakehouse, metadata, performance, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apache Iceberg vs Delta Lake: Ultimate Guide for Data Lakes',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/creating-job-olake-docker-cli/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Create OLake Replication Jobs: Postgres to Iceberg Docker CLI',
        description:
          'Step-by-step guide to creating OLake replication jobs via Docker CLI. Configure Postgres sources, Iceberg destinations, CDC, partitioning, and scheduling.',
        url: canonicalUrl,
        author: [
          {
            '@type': 'Person',
            name: 'Akshay Kumar Sharma',
            jobTitle: 'DevRel',
            url: 'https://olake.io/blog/authors/akshay/'
          },
          {
            '@type': 'Person',
            name: 'Vishal',
            jobTitle: 'OLake Maintainer',
            url: 'https://olake.io/blog/authors/vishal/'
          }
        ],
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT10M',
        articleSection: ['OLake UI', 'OLake CLI', 'Postgres', 'Apache Iceberg', 'Replication', 'CDC'],
        keywords: 'OLake, replication jobs, Postgres, Apache Iceberg, Docker CLI, CDC, normalization'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Create OLake Replication Jobs: Postgres to Iceberg Docker CLI',
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'UI or CLI—how should I choose?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If you’re new to OLake or prefer a guided setup, start with UI. If you’re automating, versioning configs, or scripting in CI, use CLI.'
            }
          },
          {
            '@type': 'Question',
            name: 'Why "Full Refresh + CDC"?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You get a baseline snapshot and continuous changes—ideal for keeping downstream analytics fresh.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I change partitioning later?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'UI: unselect the stream → save → re-add with updated partitioning/filter/normalization.\n\nCLI: edit streams.json and re-run.'
            }
          }
        ]
      }
    ],
    '/blog/data-lake-vs-delta-lake/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Data Lake vs Delta Lake: Key Differences & Use Cases Explained',
        description:
          'Compare Data Lakes and Delta Lake on data structure, ACID support, performance, governance, and use cases for effective big data management.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake Devrel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT3M',
        articleSection: ['Data Lake', 'Tools Comparison'],
        keywords: 'Data Lake, Delta Lake, data lakehouse, ACID, time travel, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/data-lake-vs-delta-lake-cover-6f96a9fbbf08b31fa59833574cb2998e.webp',
          width: 2050,
          height: 1186
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/data-lake-vs-delta-lake-cover-6f96a9fbbf08b31fa59833574cb2998e.webp',
          width: 2050,
          height: 1186
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Data Lake vs Delta Lake: Key Differences & Use Cases Explained',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/debezium-vs-olake/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake vs Debezium + Kafka | CDC Performance & Ease of Use',
        description:
          'Compare OLake and Debezium+Kafka CDC tools on speed, setup ease, scalability, and cost. OLake offers faster, simpler, and cheaper real-time replication.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT7M',
        articleSection: ['Change Data Capture', 'Debezium', 'Kafka', 'OLake', 'Performance', 'Cost'],
        keywords: 'Debezium, Kafka, OLake, CDC, replication, performance, cost',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/debezium-vs-olake-cover-92cb75ed3d455c14380f2f44f65b9861.webp',
          width: 1490,
          height: 898
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/debezium-vs-olake-cover-92cb75ed3d455c14380f2f44f65b9861.webp',
          width: 1490,
          height: 898
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake vs Debezium + Kafka | CDC Performance & Ease of Use',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/deploying-olake-on-kubernetes-helm/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Deploy OLake on Kubernetes Helm - Fast, Scalable Data Pipelines',
        description:
          'Quickly deploy OLake on Kubernetes with Helm for scalable, reliable data replication and pipeline orchestration in minutes.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Schitiz Sharma',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/schitiz/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT13M',
        articleSection: ['Kubernetes', 'Helm', 'OLake', 'Temporal', 'Deployment', 'Storage', 'Scheduling'],
        keywords: 'OLake, Kubernetes, Helm, Helm chart, Temporal, NFS, EFS, deployment, data pipelines',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-on-kubernetes-2ed813e883e26aabaabe8c4575b714cb.webp',
          width: 1068,
          height: 674
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-on-kubernetes-2ed813e883e26aabaabe8c4575b714cb.webp',
          width: 1068,
          height: 674
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Deploy OLake on Kubernetes Helm - Fast, Scalable Data Pipelines',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/flatten-array/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'How to Flatten Object Types & Query Arrays in Semi-Structured Data',
        description:
          'Discover multiple methods to flatten nested JSON and query arrays for effective data extraction using Python, PySpark, pandas, and popular ETL tools.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT21M',
        articleSection: ['Flattening JSON', 'Array Handling', 'Pandas', 'PySpark', 'Normalization', 'Best Practices'],
        keywords:
          'flatten json, pandas.json_normalize, pyspark, nested JSON, MongoDB, array explode, data normalization, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'How to Flatten Object Types & Query Arrays in Semi-Structured Data',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/handling-changing-data-type-during-semi-structured-data-ingestion/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Handling Changing Data Types in Semi-Structured Data Ingestion',
        description:
          'Explore 7 techniques to manage polymorphic keys and evolving data types in semi-structured data ingestion. Learn schema enforcement, type promotion, and more.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT32M',
        articleSection: [
          'Semi-structured Data',
          'Schema Evolution',
          'Polymorphic Fields',
          'DLQ',
          'Normalization',
          'Connector Behaviour'
        ],
        keywords:
          'polymorphic data, schema evolution, type promotion, dead letter queue, normalization, Airbyte, Fivetran, Hevodata, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/handling-changing-data-type-during-semi-structured-data-ingestion-cover-8b410f46e81221383c3b518a7c62b4a4.webp',
          width: 4480,
          height: 2520
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/handling-changing-data-type-during-semi-structured-data-ingestion-cover-8b410f46e81221383c3b518a7c62b4a4.webp',
          width: 4480,
          height: 2520
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Handling Changing Data Types in Semi-Structured Data Ingestion',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/how-to-set-up-mongodb-apache-iceberg/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Rohan Khameshra',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/rohan/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT15M',
        articleSection: ['MongoDB', 'Apache Iceberg', 'Replication', 'CDC', 'OLake'],
        keywords: 'MongoDB, Apache Iceberg, replication, CDC, OLake, change streams, upsert',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/how-to-set-up-postgres-apache-iceberg/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Rohan Khameshra',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/rohan/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT11M',
        articleSection: ['PostgreSQL', 'Apache Iceberg', 'Replication', 'CDC', 'OLake', 'Data Lakehouse'],
        keywords: 'PostgreSQL, Apache Iceberg, replication, CDC, OLake, logical replication, Glue catalog, S3',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/how-to-set-up-postgresql-cdc-on-aws-rds/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Shubham Satish Baldava',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/shubham/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT10M',
        articleSection: ['PostgreSQL', 'CDC', 'AWS RDS', 'Replication', 'OLake'],
        keywords: 'PostgreSQL CDC, RDS logical replication, replication slots, publications, OLake, WAL, rds.logical_replication',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does OLake handle PostgreSQL CDC data extraction and what are the performance considerations?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "OLake uses PostgreSQL's logical replication to capture change data in real-time. The tool connects to your RDS instance using the configured replication slot and extracts INSERT, UPDATE, and DELETE operations. Performance impact is minimal when properly configured - OLake only reads WAL (Write-Ahead Log) entries, not the actual data files."
            }
          },
          {
            '@type': 'Question',
            name: 'What are the best practices for configuring OLake with PostgreSQL CDC on AWS RDS?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Key best practices include:\n\n• Set rds.logical_replication = 1 and configure appropriate max_replication_slots\n• Use dedicated database users with minimal required privileges\n• Create replication slots with pgoutput plugin (currently supported by OLake)\n• Monitor replication lag and adjust max_wal_senders as needed\n• Use separate replication slots for different OLake jobs to avoid conflicts'
            }
          },
          {
            '@type': 'Question',
            name: 'How does OLake transform and load PostgreSQL CDC data into data lake-house (Apache-iceberg)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'OLake processes the CDC data through its ELT engine, which can handle schema evolution, data type conversions, and business logic transformations (Coming soon). The tool supports multiple destination formats including Apache Iceberg, Parquet (On top of all popular cloud providers). OLake automatically handles the orchestration, logging of ETL pipeline runs from PostgreSQL CDC with near-real-time latency.'
            }
          },
          {
            '@type': 'Question',
            name: 'What are the common troubleshooting steps for OLake PostgreSQL CDC integration?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Common issues and solutions:\n\n• Replication lag: Check max_wal_senders and max_replication_slots settings\n• Connection failures: Verify VPC security groups and network connectivity\n• Permission errors: Ensure the database user has rds_replication role and proper schema permissions\n• Slot conflicts: Use unique replication slot names for different OLake jobs\n• Data consistency: Monitor OLake\'s checkpoint mechanism to ensure no data loss (Coming soon in monitoring dashboard feature)'
            }
          },
          {
            '@type': 'Question',
            name: 'How does OLake compare to other ETL tools for PostgreSQL CDC workflows?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'OLake offers several advantages for PostgreSQL CDC:\n\n• Real-time processing: Native support for streaming CDC data as low as 1 minute latency (continuous-batching coming soon)\n• Schema evolution: Automatic handling of table schema changes during replication\n• Multi-destination support: Write to multiple formats (Iceberg, Parquet, etc.)\n• Built-in monitoring & alerting: Comprehensive metrics, alerting and logging for CDC pipeline health (Coming soon)\n• Cloud-native: Optimized for AWS RDS and other cloud database services'
            }
          },
          {
            '@type': 'Question',
            name: 'What monitoring and alerting should be set up for OLake PostgreSQL CDC pipelines?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Essential monitoring includes:\n\n• Replication lag metrics from OLake dashboard (Coming soon)\n• Alerting for sync failures (Coming soon)\n• WAL generation rate and replication slot status (Coming soon)\n• Destination write performance and error rates (Coming soon)\n\nSet up alerts for replication lag exceeding thresholds and connection failures (Coming soon).'
            }
          },
          {
            '@type': 'Question',
            name: 'Does OLake take care of Full-historical snapshot/replication before CDC? How fast is it?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'OLake has fastest optimised historical load:\n\n• OLake has Historical-load + CDC mode for this\n• Tables are chunked into smaller pieces to make it parallel and recoverable from failures\n• Any new table additions is also taken care of automatically.'
            }
          }
        ]
      }
    ],
    '/blog/json-vs-bson-vs-jsonb/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake Devrel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT18M',
        articleSection: ['JSON', 'BSON', 'JSONB', 'Data Formats', 'MongoDB', 'PostgreSQL'],
        keywords: 'JSON, BSON, JSONB, data formats, MongoDB, PostgreSQL, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/mysql-apache-iceberg-replication/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Akshay Kumar Sharma',
          jobTitle: 'DevRel',
          url: 'https://olake.io/blog/authors/akshay/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: ['MySQL', 'Apache Iceberg', 'Replication', 'CDC', 'OLake'],
        keywords: 'MySQL, Apache Iceberg, replication, CDC, OLake, binlog, data lakehouse',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/binlogs/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT13M',
        articleSection: ['MySQL', 'Binlogs', 'Replication', 'Recovery', 'Data Engineering'],
        keywords: 'MySQL binlogs, binlog recovery, replication, mysqlbinlog, point-in-time recovery',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'What Are Binlogs? | MySQL Replication & Data Recovery Guide',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/building-modern-data-lakehouse-with-olake-iceberg-lakekeeper-trino/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Akshay Kumar Sharma',
          jobTitle: 'DevRel',
          url: 'https://olake.io/blog/authors/akshay/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT15M',
        articleSection: ['Apache Iceberg', 'Lakekeeper', 'OLake', 'Trino', 'Data Lakehouse'],
        keywords: 'Iceberg, Lakekeeper, OLake, Trino, lakehouse, ingestion, metadata, object storage',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Building Modern Lakehouse with Iceberg, OLake, Lakekeeper & Trino',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/building-open-data-lakehouse-with-olake-presto/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Akshay Kumar Sharma',
          jobTitle: 'DevRel',
          url: 'https://olake.io/blog/authors/akshay/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: ['Apache Iceberg', 'Lakehouse', 'PrestoDB', 'MinIO', 'OLake'],
        keywords: 'open data lakehouse, OLake, PrestoDB, MinIO, MySQL CDC, Iceberg, docker compose, lakehouse',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Building an Open Data Lakehouse with OLake, PrestoDB & MinIO',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/iceberg-delta-lake-delete-methods-comparison/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Comparing Delete Methods in Apache Iceberg & Delta Lake',
        description:
          'Explore the differences between deletion vectors, position deletes, and copy-on-write vs merge-on-read strategies in Apache Iceberg and Delta Lake for efficient data lakehouses.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Akshay Kumar Sharma',
          jobTitle: 'DevRel',
          url: 'https://olake.io/blog/authors/akshay/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT14M',
        articleSection: [
          'Apache Iceberg',
          'Delta Lake',
          'Deletion Vectors',
          'Merge-on-Read',
          'Copy-on-Write',
          'Data Lakehouse'
        ],
        keywords:
          'Iceberg, Delta Lake, deletion vectors, position deletes, equality deletes, merge-on-read, copy-on-write, Puffin, Roaring Bitmap',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Comparing Delete Methods in Apache Iceberg & Delta Lake',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/issues-debezium-kafka/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Debezium Kafka Challenges & How OLake Solves Them: Explained',
        description:
          'Explore common Debezium and Kafka CDC challenges including setup complexity, overhead, schema changes, and why OLake is a faster, simpler alternative.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT21M',
        articleSection: [
          'Debezium',
          'Kafka',
          'Change Data Capture',
          'Operational Overhead',
          'Schema Evolution',
          'Data Ingestion'
        ],
        keywords: 'Debezium, Kafka, CDC, snapshot, schema evolution, deduplication, OLake, connectors',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/issues-debezium-kafka-cover-e6fd22f51ca8accbe70bf3f999008ec1.webp',
          width: 2134,
          height: 1168
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/issues-debezium-kafka-cover-e6fd22f51ca8accbe70bf3f999008ec1.webp',
          width: 2134,
          height: 1168
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Debezium Kafka Challenges & How OLake Solves Them: Explained',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/mongodb-cdc-using-debezium-and-kafka/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'MongoDB CDC with Debezium & Kafka | Real-Time Data Streaming',
        description:
          'Learn how Debezium and Kafka enable real-time Change Data Capture (CDC) from MongoDB for efficient, scalable data integration pipelines.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT31M',
        articleSection: ['MongoDB', 'Debezium', 'Kafka', 'Change Data Capture', 'Data Engineering'],
        keywords: 'MongoDB CDC, Debezium, Kafka, oplog, change streams, CDC, data lakehouse',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mongodb-cdc-using-debezium-and-kafka-cover-2e31f379f017580667e02aa242bd0102.webp',
          width: 1635,
          height: 904
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mongodb-cdc-using-debezium-and-kafka-cover-2e31f379f017580667e02aa242bd0102.webp',
          width: 1635,
          height: 904
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'MongoDB CDC with Debezium & Kafka | Real-Time Data Streaming',
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does Debezium use Kafka Connect?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Debezium uses Kafka Connect. Debezium operates as a Kafka Connect connector. Kafka Connect is a framework that simplifies the integration of Apache Kafka with other data systems. By using Kafka Connect, Debezium can capture changes from databases and stream them into Kafka topics without requiring custom code.\n\nExample:\n\nDebezium Connector: Acts as a bridge between your MongoDB database and Kafka.\n\nKafka Connect Framework: Manages the connector, handling tasks like starting, stopping, and scaling the Debezium connector as needed.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is Kafka and Kafka Connect different?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Kafka and Kafka Connect are different components, but they work together.\n\nApache Kafka: A distributed streaming platform that handles publishing/subscribing to streams, storing them, and processing in real-time.\n\nKafka Connect: A tool within the Kafka ecosystem that simplifies connecting Kafka with external systems using connectors (source or sink).\n\nHow they work together: Kafka manages the data streams; Kafka Connect facilitates moving data between Kafka and other systems using connectors like Debezium.\n\nExample:\nWithout Kafka Connect: you would need custom code to move data from MongoDB to Kafka.\nWith Kafka Connect: use Debezium as a Kafka Connect connector to capture and stream changes without extra code.'
            }
          }
        ]
      }
    ],
    '/blog/mongodb-etl-challenges/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'MongoDB ETL Challenges: Key Issues & Best Practices 2025',
        description:
          'Explore critical MongoDB ETL challenges including schema flexibility, data consistency, incremental loads, and nested data transformations.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Sandeep Devarapalli',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/sandeep/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT22M',
        articleSection: ['MongoDB', 'ETL', 'Change Data Capture', 'Oplog', 'Schema Evolution', 'Monitoring'],
        keywords:
          'MongoDB, ETL, CDC, oplog, schema evolution, nested JSON, arrays, deduplication, monitoring, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mongodb-etl-challenges-cover-bc628d1819a561e1ada1b54589ab872b.webp',
          width: 4480,
          height: 2520
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mongodb-etl-challenges-cover-bc628d1819a561e1ada1b54589ab872b.webp',
          width: 4480,
          height: 2520
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'MongoDB ETL Challenges: Key Issues & Best Practices 2025',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/mongodb-synchronization-strategies/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'MongoDB Sync Strategies | Real-Time Data Replication & Challenges',
        description:
          'Learn about MongoDB real-time sync strategies incremental, oplog-based, change streams, and how to overcome common data engineering challenges.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Ankit Sharma',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/ankit/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT6M',
        articleSection: [
          'MongoDB',
          'Sync Strategy',
          'Incremental Sync',
          'Oplog',
          'Change Streams',
          'Real-time Replication'
        ],
        keywords: 'MongoDB sync strategies, oplog, change streams, incremental sync, real-time replication, OLake',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'MongoDB Sync Strategies | Real-Time Data Replication & Challenges',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/olake-airflow/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Run OLake Sync on Kubernetes Using Apache Airflow | Guide',
        description:
          'Automate OLake data sync on Kubernetes with Apache Airflow DAGs. Includes setup for ConfigMaps, StorageClass, PVC, and Airflow configuration tips.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Schitiz Sharma',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/schitiz/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT8M',
        articleSection: ['Kubernetes', 'Apache Airflow', 'OLake', 'Orchestration', 'Deployment'],
        keywords: 'Airflow, Kubernetes, OLake, DAG, ConfigMap, PVC, ReadWriteMany, RWX, olake sync',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-airflow-cover-dc6f110ccf22abdc6b1d20c91e3e87f4.webp',
          width: 1768,
          height: 1026
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-airflow-cover-dc6f110ccf22abdc6b1d20c91e3e87f4.webp',
          width: 1768,
          height: 1026
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Run OLake Sync on Kubernetes Using Apache Airflow | Guide',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/olake-airflow-on-ec2/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Run OLake Sync on EC2 with Apache Airflow Automation',
        description:
          'Automate OLake data sync on AWS EC2 using Apache Airflow. Manage EC2 lifecycle, S3 configs, and Docker containers for seamless data integration.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Schitiz Sharma',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/schitiz/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: ['Apache Airflow', 'AWS EC2', 'OLake', 'Automation', 'Orchestration', 'S3', 'IAM'],
        keywords: 'Airflow, EC2, OLake, automation, DAG, SSH, S3, IAM, Docker, orchestration',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-airflow-on-ec2-cover-88597cc60507ff0d35a94de8a617cfb8.webp',
          width: 1812,
          height: 1006
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-airflow-on-ec2-cover-88597cc60507ff0d35a94de8a617cfb8.webp',
          width: 1812,
          height: 1006
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Run OLake Sync on EC2 with Apache Airflow Automation',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/olake-architecture/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake Architecture - Fast, Modular & Scalable Data Pipeline',
        description:
          "Explore OLake's architecture for real-time MongoDB to Iceberg replication. Learn about snapshotting, CDC, parallel processing, and open data formats.",
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake Devrel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT9M',
        articleSection: ['Architecture', 'Drivers', 'Destinations', 'Core', 'Performance', 'Lakehouse'],
        keywords: 'OLake, architecture, MongoDB, CDC, Chunked snapshot, Parquet, Apache Iceberg, data lakehouse, replication',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-architecture-cover-ed8026f3b57af0d0f7667add17cab3f5.webp',
          width: 1999,
          height: 1171
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-architecture-cover-ed8026f3b57af0d0f7667add17cab3f5.webp',
          width: 1999,
          height: 1171
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake Architecture - Fast, Modular & Scalable Data Pipeline',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/olake-architecture-deep-dive/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Sandeep Devarapalli',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/sandeep/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT8M',
        articleSection: ['OLake', 'Architecture', 'Data Replication', 'Scalability', 'Open Source'],
        keywords: 'OLake, architecture, data replication, CDC, lakehouse, open source',
        image: imageUrl,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.title,
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/olake-ingestion-filters-explained/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake Ingestion Filters: Smart SQL-Style Data Filtering Guide',
        description:
          "Learn how OLake's ingestion filters optimize data pipelines with SQL-style WHERE clauses for Postgres, MySQL, and MongoDB for efficient ingestion.",
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Duke',
          jobTitle: 'Olake Maintainer',
          url: 'https://olake.io/blog/authors/duke/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT14M',
        articleSection: ['Data Ingestion', 'Filtering', 'Postgres', 'MySQL', 'MongoDB', 'Chunking', 'Performance'],
        keywords: 'ingestion filters, SQL filter, MongoDB BSON, Postgres filtering, MySQL filtering, chunking, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/filter-ingestion-cover-11f30e97ac0f2f834d5b1b8670a968ec.webp',
          width: 1256,
          height: 708
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/filter-ingestion-cover-11f30e97ac0f2f834d5b1b8670a968ec.webp',
          width: 1256,
          height: 708
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake Ingestion Filters: Smart SQL-Style Data Filtering Guide',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/querying-json-in-snowflake/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'How to Query Semi-Structured JSON Data in Snowflake | OLake Guide',
        description:
          'Learn to query JSON in Snowflake using VARIANT, FLATTEN, LATERAL FLATTEN, and JSON functions. Includes loading methods and best practices for nested data.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex OLake DevRel',
          url: 'https://olake.io/blog/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT45M',
        articleSection: ['Snowflake', 'JSON', 'VARIANT', 'PARSE_JSON', 'FLATTEN', 'SnowSQL', 'Data Engineering'],
        keywords:
          'Snowflake, JSON, VARIANT, PARSE_JSON, TRY_PARSE_JSON, FLATTEN, LATERAL FLATTEN, SnowSQL, ETL, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/querying-json-in-snowflake-cover-178f72c3435e5fd9b0b8b26fb6841d79.webp',
          width: 800,
          height: 450
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/querying-json-in-snowflake-cover-178f72c3435e5fd9b0b8b26fb6841d79.webp',
          width: 800,
          height: 450
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'How to Query Semi-Structured JSON Data in Snowflake | OLake Guide',
            item: canonicalUrl
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What file formats does Snowflake support for loading semi-structured data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Snowflake supports several file formats for loading semi-structured data. These include:\n\nJSON (classic for handling key-value pairs)\n\nAvro (used in data pipelines)\n\nParquet (for analytics)\n\nORC (efficient storage for large datasets)\n\nXML (even though it\'s messy, it works)\n\nCSV (yup, plain old text files too)'
            }
          },
          {
            '@type': 'Question',
            name: 'Which data formats are supported by Snowflake when unloading semi-structured data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When you\'re unloading semi-structured data, Snowflake supports:\n\nJSON\n\nParquet\n\nCSV\n\nSo if you\'re looking to move your data out in a semi-structured format, those are your go-to options. Parquet is especially handy when you need something lightweight for analytics.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does Snowflake charge a premium for storing semi-structured data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, Snowflake doesn\'t charge extra for storing semi-structured data. The costs are based on the compressed storage size, so whether it\'s JSON or Parquet, you\'re not paying a premium just because it\'s not structured.'
            }
          },
          {
            '@type': 'Question',
            name: 'Why is Snowflake good for working with JSON and semi-structured data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Snowflake handles JSON and semi-structured data well. Here\'s why:\n\nNative VARIANT type: Snowflake stores JSON as a VARIANT data type, which can handle nested and flexible schemas.\n\nBuilt-in Functions: You get functions like FLATTEN() and JSON path expressions, making it easy to query nested data.\n\nColumnar Storage: Even though it\'s JSON, Snowflake stores it in a way that still supports fast analytics (without slow JSON parsing).\n\nSchema-less Storage: You don\'t have to worry about rigid schemas."
            }
          },
          {
            '@type': 'Question',
            name: 'What is the recommended Snowflake data type to store semi-structured data like JSON?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The recommended data type is VARIANT. It\'s Snowflake\'s magic box for semi-structured data. You can throw JSON, Avro, Parquet, etc., into this column, and Snowflake will handle it all.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does Snowflake support semi-structured data such as JSON and Parquet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Snowflake has a native semi-structured data architecture, which means you can:\n\nIngest data: Load JSON, Parquet, Avro, or whatever into VARIANT columns.\n\nQuery it: Use SQL (and JSON path expressions) to extract the exact data you need.\n\nAnalyze it: Snowflake\'s columnar storage makes querying this data fast, even with complex, nested structures.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does Snowflake handle semi-structured JSON data for fast analytics?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Snowflake uses columnar storage even for semi-structured data like JSON. This means:\n\nIt stores JSON efficiently by breaking it into columns behind the scenes.\n\nWhen you run queries, it doesn\'t need to parse through the entire JSON structure — it can just take the parts you need.\n\nSo, even though it\'s semi-structured, you still get analytics speeds similar to structured data!'
            }
          },
          {
            '@type': 'Question',
            name: 'Why is JSON considered semi-structured data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "JSON is considered semi-structured because:\n\nIt doesn\'t have a rigid schema like a relational database.\n\nThe structure can vary between records (you can have optional fields, nested objects, etc.).\n\nIt\'s more flexible than CSVs or relational tables but still has some structure — it\'s not a random string of text, after all!\n\nThat\'s why we call it \"semi-structured\" — it\'s structured, but loosely."
            }
          },
          {
            '@type': 'Question',
            name: 'Can I ingest BSON or JSONB or XML directly into Snowflake?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can ingest JSON and XML directly into Snowflake, no problem. As for BSON and JSONB, you\'d need to convert those into regular JSON before loading them. Snowflake likes its JSONs pure and simple.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the difference between flatten and lateral flatten in Snowflake?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'FLATTEN handles basic unnesting of arrays or objects. LATERAL FLATTEN lets you dig deeper, applying flattening row by row in more complex scenarios.'
            }
          }
        ]
      }
    ],
    '/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Troubleshooting MongoDB ETL Errors: Solutions & Best Practices',
        description:
          'Discover common MongoDB ETL errors, causes, and practical troubleshooting tips to optimize ETL workflows for MongoDB and data warehouse integration.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Sandeep Devarapalli',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/blog/authors/sandeep/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT17M',
        articleSection: ['MongoDB', 'ETL', 'Troubleshooting', 'Connectivity', 'Schema Discovery', 'Best Practices'],
        keywords:
          'MongoDB, ETL, troubleshooting, Atlas, connection timeout, schema discovery, Airbyte, Fivetran, Datazip, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/img/blog/cover/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors-cover.webp',
          width: 900,
          height: 630
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/img/blog/cover/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors-cover.webp',
          width: 900,
          height: 630
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Troubleshooting MongoDB ETL Errors: Solutions & Best Practices',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/blog/what-makes-olake-fast/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'What Makes OLake Fast? | High-Throughput Data Replication',
        description:
          "Discover OLake's data ingestion speed secrets-adaptive chunking, parallel execution, and CDC strategies for scalable, low-latency replication performance.",
        url: canonicalUrl,
        author: [
          {
            '@type': 'Person',
            name: 'Vaibhav Verma',
            jobTitle: 'OLake Maintainer',
            url: 'https://olake.io/blog/authors/vaibhav/'
          },
          {
            '@type': 'Person',
            name: 'Vikash Choudhary',
            jobTitle: 'OLake Maintainer',
            url: 'https://olake.io/blog/authors/vikash/'
          }
        ],
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: ['Chunking Strategies', 'MongoDB', 'MySQL', 'PostgreSQL', 'CDC', 'Performance', 'Concurrency'],
        keywords:
          'OLake, chunking, MongoDB splitVector, bucketAuto, timestamp chunking, MySQL chunking, PostgreSQL CTID, high-throughput replication, OLake performance',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/what-makes-olake-fast-cover-a49a7adc59bf189c1380ce5f5ccb2100.webp',
          width: 1726,
          height: 942
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/what-makes-olake-fast-cover-a49a7adc59bf189c1380ce5f5ccb2100.webp',
          width: 1726,
          height: 942
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://olake.io/blog/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'What Makes OLake Fast? | High-Throughput Data Replication',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/data-partitioning-in-s3/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Data Partitioning in AWS S3, how we did it and why?',
        description:
          "Data management has come a long way since the early days of Hadoop. If you're running queries on petabyte-scale data lakes or managing real-time pipelines, partitioning becomes critical. Dive into how OLake tackles S3 data partitioning for performance and reliability.",
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex DevRel',
          url: 'https://olake.io/iceberg/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT9M',
        articleSection: ['AWS S3', 'Data Partitioning', 'Iceberg', 'Glue', 'Best Practices', 'Time-based Partitioning'],
        keywords:
          'data partitioning, S3 partitioning, partition_regex, OLake, AWS Glue, ISO8601 partitioning, time-based partitioning, S3 folder structure',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/data-partitioning-in-s3-cover-d4aa8b7a17f4c755fe7fb49ecd2275db.webp',
          width: 1026,
          height: 584
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/data-partitioning-in-s3-cover-d4aa8b7a17f4c755fe7fb49ecd2275db.webp',
          width: 1026,
          height: 584
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Data Partitioning in AWS S3, how we did it and why?',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/hive-partitioning-vs-iceberg-partitioning/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Iceberg Partitioning vs. Hive Partitioning',
        description:
          'Compare metadata-driven partitioning in Apache Iceberg with the classic Hive approach. Understand performance trade-offs, governance improvements, and practical migration tips.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Sandeep Devarapalli',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/sandeep/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT30M',
        articleSection: ['Partitioning', 'Apache Iceberg', 'Hive', 'Data Lakehouse', 'Performance', 'Best Practices'],
        keywords:
          'Iceberg, Hive, partitioning, metadata-driven partitioning, Hive partitioning, data lakehouse, partition pruning, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/hive-partitioning-vs-iceberg-partitioning-cover-5eb086f55c4e368297558fa23988449e.webp',
          width: 1300,
          height: 718
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/hive-partitioning-vs-iceberg-partitioning-cover-5eb086f55c4e368297558fa23988449e.webp',
          width: 1300,
          height: 718
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Iceberg Partitioning vs. Hive Partitioning',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/iceberg-partitioning-and-writing-strategies/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'All about Iceberg Partitioning and Partitioning Writing Strategies',
        description:
          'Explore Iceberg partition specs, writer strategies, and how OLake balances fanout, clustered, and partitioned writers for efficient data layout.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Badal Prasad Singh',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/badal/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT9M',
        articleSection: [
          'Apache Iceberg',
          'Partitioning',
          'Writing Strategies',
          'Fanout Writer',
          'Clustered Writer',
          'Partitioned Writer'
        ],
        keywords:
          'Iceberg, partitioning, partition spec, fanout writer, clustered writer, partitioned writer, partitioned-fanout, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/iceberg-partitioning-and-writing-strategies-cover-f1109be929ddac66267038534f09ce17.webp',
          width: 1798,
          height: 1010
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/iceberg-partitioning-and-writing-strategies-cover-f1109be929ddac66267038534f09ce17.webp',
          width: 1798,
          height: 1010
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'All about Iceberg Partitioning and Partitioning Writing Strategies',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/mor-vs-cow/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Merge-on-Read vs Copy-on-Write in Apache Iceberg',
        description:
          'Understand how Apache Iceberg handles updates with Merge-on-Read and Copy-on-Write. Learn the differences, performance impacts, and best-fit use cases.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Aakash Chouksey',
          jobTitle: 'Community Member',
          url: 'https://olake.io/iceberg/authors/aakash/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT9M',
        articleSection: [
          'Apache Iceberg',
          'Merge-on-Read',
          'Copy-on-Write',
          'Equality Deletes',
          'Performance',
          'Upserts'
        ],
        keywords:
          'Iceberg, MOR, COW, merge-on-read, copy-on-write, equality deletes, positional deletes, upserts, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mor-vs-cow-cover-5a6ec0dcee5ab94b41d1be6876544c36.webp',
          width: 1886,
          height: 1030
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/mor-vs-cow-cover-5a6ec0dcee5ab94b41d1be6876544c36.webp',
          width: 1886,
          height: 1030
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Merge-on-Read vs Copy-on-Write in Apache Iceberg',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/move-to-iceberg/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Why move to Apache Iceberg - A Practical Guide to Building an Open, Multi-Engine Data Lake?',
        description:
          'Explore why modern data teams adopt Apache Iceberg: multi-engine support, schema evolution, time travel, and open governance. Learn the migration blueprint.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex DevRel',
          url: 'https://olake.io/iceberg/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT11M',
        articleSection: ['Apache Iceberg', 'Data Lakehouse', 'Comparison', 'Best Practices', 'Deployment'],
        keywords:
          'Apache Iceberg, data lakehouse, multi-engine, time travel, schema evolution, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/move-to-iceberg-cover-23e2b8d5d1cbd35aaffa71b6db7f95df.webp',
          width: 2000,
          height: 1052
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/move-to-iceberg-cover-23e2b8d5d1cbd35aaffa71b6db7f95df.webp',
          width: 2000,
          height: 1052
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Why move to Apache Iceberg - A Practical Guide to Building an Open, Multi-Engine Data Lake?',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/olake-glue-snowflake/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake + Glue + Snowflake - A Deep Dive into Modern Data Partitioning',
        description:
          'See how OLake works with AWS Glue and Snowflake to deliver fast partition-aware ingestion, metadata sync, and analytics-ready Iceberg tables.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Merlyn Mathew',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/merlyn/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT10M',
        articleSection: ['Apache Iceberg', 'AWS Glue', 'Snowflake', 'Data Lakehouse', 'S3', 'OLake'],
        keywords:
          'OLake, AWS Glue, Snowflake, Iceberg, Glue Catalog, external volume, S3, data partitioning, lakehouse',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-glue-snowflake-cover-2b2af9a129046f52a4a3ee31ff1e6727.webp',
          width: 1498,
          height: 892
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-glue-snowflake-cover-2b2af9a129046f52a4a3ee31ff1e6727.webp',
          width: 1498,
          height: 892
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake + Glue + Snowflake - A Deep Dive into Modern Data Partitioning',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/olake-iceberg-athena/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Athena for Query',
        description:
          'Build a serverless Iceberg pipeline with OLake, AWS Glue Data Catalog, and Amazon Athena. Learn ingestion, schema management, and query patterns.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Merlyn Mathew',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/merlyn/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT7M',
        articleSection: ['Apache Iceberg', 'AWS Glue', 'Amazon Athena', 'Data Lakehouse', 'S3', 'OLake'],
        keywords: 'OLake, Iceberg, Glue Catalog, Athena, data ingestion, S3, lakehouse',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-iceberg-athena-cover-b730d4ac55d4d65e9c74b69fa591ca6a.webp',
          width: 2096,
          height: 1204
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-iceberg-athena-cover-b730d4ac55d4d65e9c74b69fa591ca6a.webp',
          width: 2096,
          height: 1204
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Athena for Query',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/olake-iceberg-trino/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Trino for Query',
        description:
          'Combine OLake, AWS Glue, and Trino to ingest and query Iceberg tables with minimal setup. Step through configuration, ingestion, and interactive querying.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Merlyn Mathew',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/merlyn/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: ['Apache Iceberg', 'AWS Glue', 'Trino', 'Data Lakehouse', 'S3', 'OLake'],
        keywords: 'OLake, Iceberg, Glue Catalog, Trino, data ingestion, S3, lakehouse',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-iceberg-trino-cover-89e6ead8984e0fda23e783e0fde9a0ee.webp',
          width: 1638,
          height: 894
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/olake-iceberg-trino-cover-89e6ead8984e0fda23e783e0fde9a0ee.webp',
          width: 1638,
          height: 894
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'OLake for Simple Iceberg Ingestion using Glue Catalog, Trino for Query',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/paimon-vs-iceberg/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Apache Paimon vs. Apache Iceberg - A Detailed Comparison',
        description:
          'Discover how Apache Paimon and Apache Iceberg differ across streaming, batch, partitions, and ecosystem support. Choose the right lakehouse format.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex Devrel',
          url: 'https://olake.io/iceberg/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT12M',
        articleSection: [
          'Apache Paimon',
          'Apache Iceberg',
          'Streaming',
          'Batch',
          'Performance',
          'Partitioning',
          'Ecosystem'
        ],
        keywords:
          'Apache Paimon, Apache Iceberg, Paimon vs Iceberg, data lakehouse, Flink, Trino, Snowflake, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/paimon-vs-iceberg-cover-918c953d77eaea1f4cdef27004ccf8c0.webp',
          width: 1048,
          height: 618
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/paimon-vs-iceberg-cover-918c953d77eaea1f4cdef27004ccf8c0.webp',
          width: 1048,
          height: 618
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apache Paimon vs. Apache Iceberg - A Detailed Comparison',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/postgres-to-iceberg-using-glue/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Step-by-Step Guide - Replicating PostgreSQL to Iceberg with OLake & AWS Glue',
        description:
          'Replicate PostgreSQL to Apache Iceberg using OLake and AWS Glue. Configure logical replication, manage schemas, and keep analytics workloads fresh.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Rohan Khameshra',
          jobTitle: 'OLake Maintainer',
          url: 'https://olake.io/iceberg/authors/rohan/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT11M',
        articleSection: [
          'PostgreSQL',
          'Apache Iceberg',
          'AWS Glue',
          'CDC',
          'Data Lakehouse',
          'OLake'
        ],
        keywords:
          'Postgres to Iceberg, OLake, AWS Glue, CDC, logical replication, streams.json, state.json, full load, sync',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/postgres-to-iceberg-using-glue-cover-3f1914394dd56be5153de4df81f6c6f3.webp',
          width: 1640,
          height: 908
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/postgres-to-iceberg-using-glue-cover-3f1914394dd56be5153de4df81f6c6f3.webp',
          width: 1640,
          height: 908
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Step-by-Step Guide - Replicating PostgreSQL to Iceberg with OLake & AWS Glue',
            item: canonicalUrl
          }
        ]
      }
    ],
    '/iceberg/why-iceberg/': () => [
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: 'Apache Iceberg: What It Is and Why It Matters',
        description:
          'Explore the history of big data, the Iceberg metadata layer, governance features, and example workflows that make Iceberg the lakehouse standard.',
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Priyansh Khodiyar',
          jobTitle: 'Ex Devrel',
          url: 'https://olake.io/iceberg/authors/priyansh/'
        },
        publisher,
        datePublished: metadata.date,
        timeRequired: 'PT6M',
        articleSection: [
          'A Brief History of Big Data',
          'Apache Iceberg - The Metadata Layer',
          'Catalog - Fine-Grained Metadata',
          'Powerful Data Governance Features',
          'Example Workflow: Spark and S3',
          'Why Iceberg Continues to Shine'
        ],
        keywords: 'Apache Iceberg, metadata, time travel, schema evolution, data lakehouse, OLake',
        image: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/why-iceberg-cover-ae52acf8156586e6e900a19fcdaccc3e.webp',
          width: 2000,
          height: 1052
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://olake.io/assets/images/why-iceberg-cover-ae52acf8156586e6e900a19fcdaccc3e.webp',
          width: 2000,
          height: 1052
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://olake.io/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Iceberg',
            item: 'https://olake.io/iceberg/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apache Iceberg: What It Is and Why It Matters',
            item: canonicalUrl
          }
        ]
      }
    ]
  };

  const additionalSchemas = canonicalUrl && schemaByPermalink[normalizedPermalink]
    ? schemaByPermalink[normalizedPermalink]()
    : [];

  const jsonLdSchemas = [
    { id: 'organization', data: organizationSchema },
    { id: 'website', data: websiteSchema },
    ...additionalSchemas.map((schema, index) => ({ id: `additional-${index}`, data: schema }))
  ];
  
  return (
    <>
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        
        {/* Enhanced Open Graph for Blog Posts */}
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:secure_url" content="https://olake.io/img/logo/olake-blue.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="OLake" />
        
        {/* Enhanced Twitter Cards for Blog Posts */}
        <meta name="twitter:creator" content="@cappybaradeploy" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image:alt" content="OLake" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={authorName} />
        <meta name="twitter:label2" content="Time to read" />
        <meta name="twitter:data2" content={readingTime} />
        {jsonLdSchemas.map((schema) => (
          <script
            key={schema.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema.data)
            }}
          />
        ))}
      </Head>
      <BlogPostPage {...props} />
    </>
  );
}