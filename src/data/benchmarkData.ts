// Benchmark data constants
// Tool names and display info
export const TOOLS = {
  olake: {
    name: 'OLake',
    description: 'Open Source'
  },
  airbyte: {
    name: 'Airbyte'
  },
  fivetran: {
    name: 'Fivetran'
  },
  debezium: {
    name: 'Debezium'
  },
  estuary: {
    name: 'Estuary'
  },
  flink: {
    name: 'Apache Flink'
  }
}

// Formatted metric names for display
export const METRIC_LABELS = {
  // CDC Load
  rowsSyncedCDC: 'Rows synced',
  elapsedTimeCDC: 'Elapsed time',
  speedCDC: 'Speed (Rows/Sec)',
  comparisonCDC: 'Comparison',
  costCDC: 'Cost',

  // Full Load
  // latency: 'CDC Latency',
  rowsSyncedFull: 'Rows synced',
  elapsedTimeFull: 'Elapsed time',
  speedFull: 'Speed (Rows/Sec)',
  comparisonFull: 'Comparison',
  costFull: 'Cost'
}

// =============================================================================
// CONNECTOR-BASED BENCHMARK DATA
// =============================================================================

// Connector identifiers (used as keys and for tab rendering)
export type ConnectorId =
  | 'mongodb'
  | 'kafka'
  | 'oracle'
  | 'mysql'
  | 'postgres'
  | 's3'
  | 'mssql'
  | 'db2'

// Benchmark mode type
export type BenchmarkMode = 'full_load' | 'cdc'

// Connector display configuration
export interface ConnectorConfig {
  id: ConnectorId
  name: string
  icon?: string // Optional path to connector icon
}

// List of connectors in display order
export const CONNECTORS: ConnectorConfig[] = [
  { id: 'postgres', name: 'Postgres', icon: '/img/site/connectors/postgres.svg' },
  { id: 'mysql', name: 'MySQL', icon: '/img/site/connectors/mysql.svg' },
  { id: 'kafka', name: 'Kafka', icon: '/img/site/connectors/kafka.svg' },
  { id: 'mongodb', name: 'MongoDB', icon: '/img/site/connectors/mongodb.svg' },
  { id: 'oracle', name: 'Oracle', icon: '/img/site/connectors/oracle.svg' },
  { id: 's3', name: 'S3', icon: '/img/site/connectors/s3.svg' },
  { id: 'mssql', name: 'MSSQL', icon: '/img/site/connectors/mssql.svg' },
  { id: 'db2', name: 'DB2', icon: '/img/site/connectors/db2.svg' }
]

// Benchmark metric structure for each connector
export interface ConnectorBenchmark {
  hasData: boolean // Whether benchmark data is available for this connector
  rowsSynced: {
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
    flink?: string // Optional: used for Kafka benchmark
  }
  elapsedTime: {
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
    flink?: string // Optional: used for Kafka benchmark
  }
  speed: {
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
    flink?: string // Optional: used for Kafka benchmark
  }
  comparison: {
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
    flink?: string // Optional: used for Kafka benchmark
  }
  cost: {
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
    flink?: string // Optional: used for Kafka benchmark
  }
}

// Metric labels for connector benchmarks
export const CONNECTOR_METRIC_LABELS = {
  rowsSynced: 'Rows synced',
  elapsedTime: 'Elapsed time',
  speed: 'Speed (Rows/Sec)',
  comparison: 'Comparison',
  cost: 'Cost'
}

// =============================================================================
// CONNECTOR BENCHMARK DATA (Full Load)
// Edit the values below to update benchmark numbers for each connector
// =============================================================================

export const CONNECTOR_BENCHMARKS: Record<ConnectorId, ConnectorBenchmark> = {
  mongodb: {
    hasData: true,
    rowsSynced: {
      olake: '230 Million',
      airbyte: '-',
      fivetran: '230 Million',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '1 hour 42 mins',
      airbyte: '-',
      fivetran: '4 hours 20 mins',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '37,879 RPS',
      airbyte: '-',
      fivetran: '14,997 RPS',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '2.5x slower',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '< $ 5',
      airbyte: '-',
      fivetran: '$ 0 (Free full load)',
      debezium: '-',
      estuary: '-'
    }
  },

  kafka: {
    hasData: true,
    rowsSynced: {
      olake: '1.0 Billion',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    },
    elapsedTime: {
      olake: '1.8 hours',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '3.25 hours'
    },
    speed: {
      olake: '1,54,320 MPS',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '85,470 MPS'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '1.8x slower'
    },
    cost: {
      olake: '$ 14.08',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '$ 26.13'
    }
  },

  oracle: {
    hasData: true,
    rowsSynced: {
      olake: '4.01 Billion',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '2 hours 6 mins',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '5,26,337 RPS',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '< $ 6',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  mysql: {
    hasData: true,
    rowsSynced: {
      olake: '4.0 Billion',
      airbyte: '-',
      fivetran: '4.0 Billion',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '3.3 hours',
      airbyte: '-',
      fivetran: '9.34 hours',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '3,38,005 RPS',
      airbyte: '-',
      fivetran: '1,19,106 RPS',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '2.83x slower',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '< $ 11',
      airbyte: '-',
      fivetran: '$ 0 (free full sync)',
      debezium: '-',
      estuary: '-'
    }
  },

  postgres: {
    hasData: true,
    rowsSynced: {
      olake: '4.01 Billion',
      airbyte: '12.7 Million',
      fivetran: '4.01 Billion',
      debezium: '1.28 Billion',
      estuary: '0.34 Billion'
    },
    elapsedTime: {
      olake: '1.91 hours',
      airbyte: '7.5 hours (failed sync)',
      fivetran: '24 hours',
      debezium: '24 hours',
      estuary: '24 hours'
    },
    speed: {
      olake: '5,80,113 RPS',
      airbyte: '457 RPS',
      fivetran: '46,395 RPS',
      debezium: '14,839 RPS',
      estuary: '3,982 RPS'
    },
    comparison: {
      olake: '-',
      airbyte: '1270x slower',
      fivetran: '12.5x slower',
      debezium: '39.1x slower',
      estuary: '146x slower'
    },
    cost: {
      olake: '< $ 6',
      airbyte: '$ 5,560',
      fivetran: '$ 0 (free full load)',
      debezium: '$ 75',
      estuary: '$ 1,668'
    }
  },

  s3: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  mssql: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  db2: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  }
}

// =============================================================================
// CONNECTOR CDC BENCHMARK DATA
// Edit the values below to update CDC benchmark numbers for each connector
// =============================================================================

export const CONNECTOR_CDC_BENCHMARKS: Record<ConnectorId, ConnectorBenchmark> = {
  mongodb: {
    hasData: true,
    rowsSynced: {
      olake: '25 Million',
      airbyte: '-',
      fivetran: '25 Million',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '38 mins 58 sec',
      airbyte: '-',
      fivetran: '1 hour 12 mins',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '10,692 RPS',
      airbyte: '-',
      fivetran: '5,787 RPS',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '1.85x slower',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  kafka: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-',
      flink: '-'
    }
  },

  oracle: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  mysql: {
    hasData: true,
    rowsSynced: {
      olake: '50 Million',
      airbyte: '-',
      fivetran: '50 Million',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '16.06 min',
      airbyte: '-',
      fivetran: '29.86 min',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '51,867 RPS',
      airbyte: '-',
      fivetran: '27,901 RPS',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '1.85x slower',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  postgres: {
    hasData: true,
    rowsSynced: {
      olake: '50 Million',
      airbyte: '50 Million',
      fivetran: '50 Million',
      debezium: '50 Million',
      estuary: '50 Million'
    },
    elapsedTime: {
      olake: '15 min',
      airbyte: '23 hours',
      fivetran: '31 min',
      debezium: '60 min',
      estuary: '4.5 hours'
    },
    speed: {
      olake: '55,555 RPS',
      airbyte: '585 RPS',
      fivetran: '26,910 RPS',
      debezium: '13,808 RPS',
      estuary: '3,085 RPS'
    },
    comparison: {
      olake: '-',
      airbyte: '95x slower',
      fivetran: '2x slower',
      debezium: '4x slower',
      estuary: '18x slower'
    },
    cost: {
      olake: '$ 1',
      airbyte: '$ 148.95',
      fivetran: '$ 2,257.80',
      debezium: '$ 2.02',
      estuary: '$ 17.63'
    }
  },

  s3: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  mssql: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  },

  db2: {
    hasData: false,
    rowsSynced: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    elapsedTime: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    speed: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    comparison: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    },
    cost: {
      olake: '-',
      airbyte: '-',
      fivetran: '-',
      debezium: '-',
      estuary: '-'
    }
  }
}
