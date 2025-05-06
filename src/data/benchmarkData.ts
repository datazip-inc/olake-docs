// Benchmark data constants

// Full Load benchmark data
export const FULL_LOAD = {
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
        olake: '$1.02',
        airbyte: '$ 148.95',
        fivetran: '$ 2,257',
        debezium: '$1.02',
        estuary: '$ 22.72'
    }
}

// CDC Sync benchmark data
export const CDC_SYNC = {
    latency: {
        olake: '<3 seconds',
        airbyte: '5-10 seconds',
        fivetran: '5-10 seconds',
        debezium: '5-10 seconds',
        estuary: '5-10 seconds'
    },
    cpuUsage: {
        olake: '30%',
        airbyte: '90% +',
        fivetran: '90% +',
        debezium: '90% +',
        estuary: '90% +'
    },
    memoryUsage: {
        olake: '1.5 GB',
        airbyte: '4GB +',
        fivetran: '4GB +',
        debezium: '4GB +',
        estuary: '4GB +'
    },
    infrastructureCost: {
        olake: '$',
        airbyte: '$$$',
        fivetran: '$$$',
        debezium: '$$$',
        estuary: '$$$'
    },
    comparison: {
        olake: '-',
        airbyte: '3X more resources',
        fivetran: '3X more resources',
        debezium: '3X more resources',
        estuary: '3X more resources'
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
    // Full Load
    rowsSynced: 'Rows synced',
    elapsedTime: 'Elapsed time',
    speed: 'Speed (Rows/Sec)',
    comparison: 'Comparison',
    cost: 'Cost',

    // CDC Sync
    latency: 'CDC Latency',
    cpuUsage: 'CPU Usage',
    memoryUsage: 'Memory Usage',
    infrastructureCost: 'Infrastructure Cost'
} 