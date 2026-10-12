import { useMemo, useState } from 'react'
import {
  CONNECTORS,
  CONNECTOR_BENCHMARKS,
  CONNECTOR_CDC_BENCHMARKS,
  TOOLS,
  type BenchmarkMode,
  type ConnectorId
} from '@site/src/data/benchmarkData'
import {
  GO_BENCHMARK_CONNECTORS,
  GO_BENCHMARK_COST_NOTE,
  GO_BENCHMARK_METRIC_LABELS,
  goBenchmarkCaption
} from '@site/src/data/landing/go/benchmark'

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
  /** The comparison row is set in blue. */
  highlight: boolean
}

/**
 * State and table data of the OLake Go benchmark block. Like the home page's table, a source only
 * gets a tab in the modes it has published numbers for (Kafka and MSSQL have full-load numbers but
 * no CDC ones), and switching to a mode the selected source lacks falls back to the first source
 * that has them.
 */
export function useGoBenchmark() {
  const [selectedConnector, setActiveConnector] = useState<ConnectorId>(GO_BENCHMARK_CONNECTORS[0])
  const [mode, setMode] = useState<BenchmarkMode>('full_load')

  return useMemo(() => {
    const dataset = mode === 'cdc' ? CONNECTOR_CDC_BENCHMARKS : CONNECTOR_BENCHMARKS
    const all = GO_BENCHMARK_CONNECTORS.map((id) => CONNECTORS.find((c) => c.id === id)!)
    const withData = all.filter((c) => dataset[c.id]?.hasData)
    const connectors = withData.length ? withData : all
    const connector = connectors.find((c) => c.id === selectedConnector) ?? connectors[0]
    const bench = dataset[connector.id]
    const keys = competitorKeys(bench.rowsSynced.flink !== undefined)

    const rows: GoBenchmarkRow[] = METRICS.map((metric) => {
      const row = bench[metric] as unknown as Record<string, string | undefined>
      const isComparison = metric === 'comparison'
      return {
        label: GO_BENCHMARK_METRIC_LABELS[metric],
        note: metric === 'cost' ? GO_BENCHMARK_COST_NOTE : undefined,
        // OLake is the baseline of the comparison row, so it shows a dash instead of a multiplier.
        olake: isComparison ? '-' : (row.olake ?? '-'),
        competitors: keys.map((key) => row[key] ?? '-'),
        highlight: isComparison
      }
    })

    return {
      connectors: connectors.map(({ id, name }) => ({ id, name })),
      activeConnector: connector.id,
      setActiveConnector,
      mode,
      setMode,
      competitors: keys.map((key) => TOOLS[key].name),
      olakeSub: TOOLS.olake.description ?? '',
      caption: goBenchmarkCaption(mode, bench.rowsSynced.olake, connector.name),
      rows,
      hasData: bench.hasData,
      sourceName: connector.name
    }
  }, [selectedConnector, mode])
}
