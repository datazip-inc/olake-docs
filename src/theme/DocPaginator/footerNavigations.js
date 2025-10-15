export const paginationConfig = {
  // Introduction
  '/docs': {
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  //Benchmarks
  '/docs/benchmarks': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  //Quickstart
  '/docs/getting-started/quickstart': {
    previous: {
      title: 'Benchmarks',
      permalink: '/docs/benchmarks'
    },
    next: {
      title: 'Create first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    }
  },

  // creating your first job pipeline
  '/docs/getting-started/creating-first-pipeline': {
    previous: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    },
    next: {
      title: 'Compatability with Query Engines',
      permalink: '/docs/understanding/compatibility-engines'
    }
  },

  //Playground
  '/docs/getting-started/playground': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Install Docker Compose UI
  '/docs/install/olake-ui': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Create first job pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    }
  },

  // Helm on Kubernetes
  '/docs/install/kubernetes': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Create first job pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    }
  },

  // Install Docker Compose CLI
  '/docs/install/docker-cli': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Create first job pipeline in OLake CLI',
      permalink: '/blog/creating-job-olake-docker-cli#option-b--olake-cli-docker'
    }
  },

  //source mongodb
  '/docs/connectors/mongodb': {
    previous: {
      title: 'Create your first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    },
    next: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    }
  },

  //source mysql
  '/docs/connectors/mysql': {
    previous: {
      title: 'Create your first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    },
    next: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    }
  },

  //source postgres
  '/docs/connectors/postgres': {
    previous: {
      title: 'Create your first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    },
    next: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    }
  },

  //source oracle
  '/docs/connectors/oracle': {
    previous: {
      title: 'Create your first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    },
    next: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    }
  },

  //source kafka
  '/docs/connectors/kafka': {
    previous: {
      title: 'Create your first job Pipeline',
      permalink: '/docs/getting-started/creating-first-pipeline'
    },
    next: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    }
  },

  // Glue catalog
  '/docs/writers/iceberg/catalog/glue': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Rest catalog
  '/docs/writers/iceberg/catalog/rest': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // JDBC catalog
  '/docs/writers/iceberg/catalog/jdbc': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Hive catalog
  '/docs/writers/iceberg/catalog/hive': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Iceberg partitioning
  '/docs/writers/iceberg/partitioning': {
    previous: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    },
    next: {
      title: 'Schedule Job',
      permalink: '/docs/getting-started/creating-first-pipeline#5-schedule-job'
    }
  },

  // Iceberg on Azure
  '/docs/writers/iceberg/azure': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Iceberg on Azure
  '/docs/writers/iceberg/azure': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Iceberg on GCP
  '/docs/writers/iceberg/gcp': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Iceberg on GCP
  '/docs/writers/iceberg/gcp': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Iceberg Troubleshooting
  '/docs/writers/iceberg/troubleshooting-local': {
    previous: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Parquet Config and Setup
  '/docs/writers/parquet/config': {
    previous: {
      title: 'Configure Source',
      permalink: '/docs/getting-started/creating-first-pipeline#2-configure-source'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // IAM Permissions
  '/docs/writers/parquet/permission': {
    previous: {
      title: 'Setup & Config',
      permalink: '/docs/writers/parquet/config'
    },
    next: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    }
  },

  // Parquet Partitioning
  '/docs/writers/parquet/partitioning': {
    previous: {
      title: 'Configure Streams',
      permalink: '/docs/getting-started/creating-first-pipeline#4-configure-streams'
    },
    next: {
      title: 'Schedule Job',
      permalink: '/docs/getting-started/creating-first-pipeline#5-schedule-job'
    }
  },

  // Parquet Troubleshooting
  '/docs/writers/parquet/troubleshoot': {
    previous: {
      title: 'Configure Destination',
      permalink: '/docs/getting-started/creating-first-pipeline#3-configure-destination'
    },
    next: {
      title: 'Schedule Job',
      permalink: '/docs/getting-started/creating-first-pipeline#5-schedule-job'
    }
  },

  // General terminologies
  '/docs/understanding/terminologies/general': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // OLake terminologies
  '/docs/understanding/terminologies/olake': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Features
  '/docs/features': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Architechture
  '/docs/core/architecture': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Compatablitity to Iceberg Catalogs
  '/docs/understanding/compatibility-catalogs': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Compatablitity with Query Engines
  '/docs/understanding/compatibility-engines': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Use Cases
  '/docs/core/use-cases': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'Quickstart',
      permalink: '/docs/getting-started/quickstart'
    }
  },

  // Contributing
  '/docs/community/contributing': {
    previous: {
      title: 'Introduction',
      permalink: '/docs'
    },
    next: {
      title: 'How to Raise a PR',
      permalink: '/docs/community/issues-and-prs'
    }
  },

  // Issues and PRs
  '/docs/community/issues-and-prs': {
    previous: {
      title: 'Contribute to Olake',
      permalink: '/docs/community/contributing'
    },
    next: {
      title: 'Seting up a Development Environment',
      permalink: '/docs/community/setting-up-a-dev-env'
    }
  },

  // Setting up a Development Environment
  '/docs/community/setting-up-a-dev-env': {
    previous: {
      title: 'How to Raise a PR',
      permalink: '/docs/community/issues-and-prs'
    },
    next: {
      title: 'Code of Conduct',
      permalink: '/docs/community/code-of-conduct'
    }
  },

  // Code of Conduct
  '/docs/community/code-of-conduct': {
    previous: {
      title: 'Setting up a Development Environment',
      permalink: '/docs/community/setting-up-a-dev-env'
    },
    next: {
      title: 'Channels',
      permalink: '/docs/community/channels'
    }
  },

  // Channels
  '/docs/community/channels': {
    previous: {
      title: 'Code of Conduct',
      permalink: '/docs/community/code-of-conduct'
    },
    next: {
      title: 'Release Notes',
      permalink: '/docs/release/overview'
    }
  },

  // Release Notes
  '/docs/release/overview': {
    previous: {
      title: 'Channels',
      permalink: '/docs/community/channels'
    },
    next: {
      title: 'OLake v0.2.8',
      permalink: '/docs/release/v0.2.8'
    }
  }
}
