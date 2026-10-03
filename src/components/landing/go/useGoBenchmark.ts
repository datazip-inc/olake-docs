import { useMemo, useState } from 'react'
import {
  CONNECTORS,
  CONNECTOR_BENCHMARKS,
  CONNECTOR_CDC_BENCHMARKS,
  CONNECTOR_METRIC_LABELS,
  TOOLS,
  type BenchmarkMode,
  type ConnectorId
} from '@site/src/data/benchmarkData'
import { GO_BENCHMARK_COST_NOTE } from '@site/src/data/landing/go/benchmark'

/** Row order of the table, top to bottom. */
const METRICS = ['rowsSynced', 'elapsedTime', 'speed', 'comparison', 'cost'] as const

/**
 * Four competitor columns. Kafka is benchmarked against Apache Flink rather than Debezium, so the
 * set depends on the connector.
 */
const competitorKeys = (hasFlink: boolean) =>
  hasFlink
    ? (['airbyte', 'fivetran', 'estuary', 'flink'] as const)
    : (['airbyte', 'fivetran', 'debezium', 'estuary'] as const)

export interface GoBenchmarkRow {
  label: string
  note?: string
  olake: string
  competitors: string[]
  /** The comparison row is tinted. */
  highlight: boolean
}

/**
 * State and table data of the OLake Go benchmark block. Unlike the home page's table, every
 * connector keeps its tab: the ones without published numbers show a "coming soon" panel.
 */
export function useGoBenchmark() {
  const [activeConnector, setActiveConnector] = useState<ConnectorId>(CONNECTORS[0].id)
  const [mode, setMode] = useState<BenchmarkMode>('full_load')

  return useMemo(() => {
    const dataset = mode === 'cdc' ? CONNECTOR_CDC_BENCHMARKS : CONNECTOR_BENCHMARKS
    const connector = CONNECTORS.find((c) => c.id === activeConnector) ?? CONNECTORS[0]
    const bench = dataset[connector.id]
    const keys = competitorKeys(bench.rowsSynced.flink !== undefined)

    const rows: GoBenchmarkRow[] = METRICS.map((metric) => {
      const row = bench[metric] as unknown as Record<string, string | undefined>
      const isComparison = metric === 'comparison'
      return {
        label: CONNECTOR_METRIC_LABELS[metric],
        note: metric === 'cost' ? GO_BENCHMARK_COST_NOTE : undefined,
        // OLake is the baseline of the comparison row, so it shows a dash instead of a multiplier.
        olake: isComparison ? '–' : (row.olake ?? '-'),
        competitors: keys.map((key) => row[key] ?? '-'),
        highlight: isComparison
      }
    })

    return {
      connectors: CONNECTORS.map(({ id, name }) => ({ id, name })),
      activeConnector: connector.id,
      setActiveConnector,
      mode,
      setMode,
      competitors: keys.map((key) => TOOLS[key].name),
      olakeLabel: 'OLake Go',
      olakeSub: TOOLS.olake.description ?? '',
      rows,
      hasData: bench.hasData,
      sourceName: connector.name
    }
  }, [activeConnector, mode])
}
