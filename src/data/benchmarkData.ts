// Benchmark data constants

// Full Load benchmark data
export const CDC_SYNC = {
    rowsSyncedCDC: {
        value: '50 Million',
        isUniform: true // All tools have the same value
    },
    elapsedTimeCDC: {
        olake: '22.5 minutes',
        airbyte: '23 hours',
        fivetran: '31 minutes',
        debezium: '60 minutes',
        estuary: '4.5 hours'
    },
    speedCDC: {
        olake: '36,982 RPS',
        airbyte: '585 RPS',
        fivetran: '26,910 RPS',
        debezium: '13,808 RPS',
        estuary: '3,085 RPS'
    },
    comparisonCDC: {
        olake: '-',
        airbyte: '63 X slower',
        fivetran: '1.4 X slower',
        debezium: '2.7 X slower',
        estuary: '12 X slower'
    },
    costCDC: {
        olake: '$2.02',
        airbyte: '$ 148.95',
        fivetran: '$ 2,257',
        debezium: '$ 2.02',
        estuary: '$ 17.63'
    }
}

// CDC Sync benchmark data
export const FULL_LOAD = {

    rowsSyncedFull: {
        olake: '4.01 Billion',
        airbyte: '12.7 Million',
        fivetran: '4.01 Billion',
        debezium: '1.28 Billion',
        estuary: '0.34 Billion'
    },
    elapsedTimeFull: {
        olake: '24 hours',
        airbyte: '7.5 hours (failed sync)',
        fivetran: '24 hours',
        debezium: '24 hours',
        estuary: '24 hours'
    },
    speedFull: {
        olake: '46,262 RPS',
        airbyte: '457 RPS',
        fivetran: '46,395 RPS',
        debezium: '14,839 RPS',
        estuary: '3,982 RPS'
    },
    comparisonFull: {
        olake: '-',
        airbyte: '101× slower',
        fivetran: 'same',
        debezium: '3.1× slower',
        estuary: '11.6× slower'
    },
    costFull: {
        olake: '$ 75',
        airbyte: '$ 5,560',
        fivetran: '$ 0 (Free full load)',
        debezium: '$ 75',
        estuary: '$1,668'
    },
   
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