import { useMemo, useState } from 'react'
import {
  CONNECTORS,
  CONNECTOR_BENCHMARKS,
  CONNECTOR_CDC_BENCHMARKS,
  CONNECTOR_METRIC_LABELS,
  TOOLS,
  type BenchmarkMode,
  type ConnectorBenchmark,
  type ConnectorId
} from '@site/src/data/benchmarkData'

/** Row order of the benchmark table, top to bottom. */
const METRICS = ['rowsSynced', 'elapsedTime', 'speed', 'comparison', 'cost'] as const
type Metric = (typeof METRICS)[number]

/**
 * Four competitor columns. Kafka is benchmarked against Apache Flink rather
 * than Debezium, so the set is per-connector — same rule the OLake Go page
 * uses (`landing/pages/useGoLogic.ts`).
 */
const competitorKeys = (bench: Partial<ConnectorBenchmark>): string[] =>
  bench.rowsSynced?.flink !== undefined
    ? ['airbyte', 'fivetran', 'estuary', 'flink']
    : ['airbyte', 'fivetran', 'debezium', 'estuary']

const COST_NOTE = 'OLake is OSS and self-hosted — only pay for your infrastructure.'

export interface BenchmarkRow {
  label: string
  note?: string
  /** OLake's value; the comparison row shows a dash against itself. */
  olake: string
  competitors: string[]
  /** The comparison row is tinted in the design. */
  highlight: boolean
}

export interface GoBenchmarkTable {
  connectors: { id: ConnectorId; name: string }[]
  activeConnector: ConnectorId
  setActiveConnector: (id: ConnectorId) => void
  mode: BenchmarkMode
  setMode: (mode: BenchmarkMode) => void
  /** Competitor column headers, in order. */
  competitors: string[]
  olakeLabel: string
  olakeSub: string
  rows: BenchmarkRow[]
  /** True when the selected connector/mode pair has no published numbers. */
  comingSoon: boolean
  sourceName: string
}

/**
 * Shapes `src/data/benchmarkData.ts` into the design's comparison table.
 * Values are rendered as they are stored — cells with no published figure
 * come through as '-'.
 */
export function useGoBenchmarkTable(): GoBenchmarkTable {
  const [activeConnector, setActiveConnector] = useState<ConnectorId>(CONNECTORS[0].id)
  const [mode, setMode] = useState<BenchmarkMode>('full_load')

  return useMemo(() => {
    const connector = CONNECTORS.find((c) => c.id === activeConnector) ?? CONNECTORS[0]
    const dataset = mode === 'cdc' ? CONNECTOR_CDC_BENCHMARKS : CONNECTOR_BENCHMARKS
    const bench = (dataset[connector.id] ?? {}) as Partial<ConnectorBenchmark>
    const comps = competitorKeys(bench)

    const rows: BenchmarkRow[] = METRICS.map((metric: Metric) => {
      const row = (bench[metric] ?? {}) as Record<string, string | undefined>
      const isComparison = metric === 'comparison'
      return {
        label: CONNECTOR_METRIC_LABELS[metric],
        note: metric === 'cost' ? COST_NOTE : undefined,
        olake: isComparison ? '–' : (row.olake ?? '-'),
        competitors: comps.map((key) => row[key] ?? '-'),
        highlight: isComparison
      }
    })

    return {
      connectors: CONNECTORS.map(({ id, name }) => ({ id, name })),
      activeConnector: connector.id,
      setActiveConnector,
      mode,
      setMode,
      competitors: comps.map((key) => TOOLS[key as keyof typeof TOOLS].name),
      olakeLabel: 'OLake Go',
      olakeSub: TOOLS.olake.description ?? '',
      rows,
      comingSoon: !bench.hasData,
      sourceName: connector.name
    }
  }, [activeConnector, mode])
}
