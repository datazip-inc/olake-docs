// Benchmark data constants

// Full Load benchmark data
export const CDC_SYNC = {
    rowsSynced: {
        value: '50 Million',
        isUniform: true // All tools have the same value
    },
    elapsedTime: {
        olake: '22.5 minutes',
        airbyte: '23 hours',
        fivetran: '31 minutes',
        debezium: '60 minutes',
        estuary: '4.5 hours'
    },
    speed: {
        olake: '36,982 RPS',
        airbyte: '585 RPS',
        fivetran: '26,910 RPS',
        debezium: '13,808 RPS',
        estuary: '3,085 RPS'
    },
    comparison: {
        olake: '-',
        airbyte: '63 X slower',
        fivetran: '1.4 X slower',
        debezium: '2.7 X slower',
        estuary: '12 X slower'
    },
    cost: {
        olake: '$2.02',
        airbyte: '$ 148.95',
        fivetran: '$ 2,257',
        debezium: '$ 2.02',
        estuary: '$ 22.72'
    }
}

// CDC Sync benchmark data
export const FULL_LOAD = {
    // latency: {
    //     olake: '<3 seconds',
    //     airbyte: '5-10 seconds',
    //     fivetran: '5-10 seconds',
    //     debezium: '5-10 seconds',
    //     estuary: '5-10 seconds'
    // },
    throughput: {
        olake: '46,262 RPS',
        airbyte: '457 RPS',
        fivetran: '46,395 RPS',
        debezium: '14,839 RPS',
        estuary: '3,982 RPS'
    },
    rowsSyncedfull: {
        olake: '4.01 Billion',
        airbyte: '12.7 Million',
        fivetran: '4.01 Billion',
        debezium: '1.28 Billion',
        estuary: '0.34 Billion'
    },
    infrastructureCost: {
        olake: '$ 75',
        airbyte: '$ 5,560',
        fivetran: '$ 7,446',
        debezium: '$ 75',
        estuary: '$ 4,462'
    },
    comparison: {
        olake: '-',
        airbyte: '101× slower',
        fivetran: 'same',
        debezium: '3.1× slower',
        estuary: '11.6× slower'
    }
}

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
    }
}

// Formatted metric names for display
export const METRIC_LABELS = {
    // CDC Load
    rowsSynced: 'Rows synced',
    elapsedTime: 'Elapsed time',
    speed: 'Speed (Rows/Sec)',
    comparison: 'Comparison',
    cost: 'Cost',

    // Full Load
    // latency: 'CDC Latency',
    throughput: 'Throughput (RPS)',
    rowsSyncedfull: 'Rows synced',
    infrastructureCost: 'Infrastructure Cost'
} 