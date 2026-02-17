import React from 'react'
import { TOOLS } from '../../data/benchmarkData'

interface BenchmarkData {
  metric: string
  olake: string
  airbyte: string
  fivetran: string
  debezium: string
  estuary: string
  flink?: string
  isComparisonMetric?: boolean
}

interface MobileBenchmarkCardsProps {
  data: BenchmarkData[]
  isKafka: boolean
}

// Tool keys for dynamic iteration (excludes OLake which is handled separately)
type ToolKey = 'airbyte' | 'fivetran' | 'debezium' | 'estuary' | 'flink'

// Tool configuration with icons for dynamic rendering
const TOOL_CONFIG: { key: ToolKey; icon: string }[] = [
  { key: 'airbyte', icon: '/img/site/airbyte.svg' },
  { key: 'fivetran', icon: '/img/site/fivetran.svg' },
  { key: 'debezium', icon: '/img/site/debezium.svg' },
  { key: 'estuary', icon: '/img/site/estuary.svg' },
  { key: 'flink', icon: '/img/site/flink.svg' }
]

// Single Benchmark Card Component
const SimpleBenchmarkCard: React.FC<{
  title: string
  rowData: BenchmarkData
  isKafka: boolean
}> = ({ title, rowData, isKafka }) => {
  // Filter tools based on isKafka (hide debezium for Kafka, hide flink for non-Kafka)
  const visibleTools = TOOL_CONFIG.filter((tool) => {
    if (isKafka && tool.key === 'debezium') return false
    if (!isKafka && tool.key === 'flink') return false
    return true
  })

  return (
    <div
      className='min-w-[260px] flex-shrink-0 rounded-2xl bg-white p-4 py-8 dark:bg-gray-800'
      style={{ boxShadow: '2px 3px 20px 1px #00000014' }}
    >
      {/* Card Title */}
      <h3 className='mb-4 pb-1 pt-2 font-space text-base font-bold leading-[23.02px] text-brand-gray-900 dark:text-white'>
        {title}
      </h3>

      {/* OLake Row - Highlighted */}
      <div className='mb-3 flex items-center justify-between rounded-lg bg-[#E6F4E0] px-3 py-2 dark:bg-green-900/20'>
        <div className='flex items-baseline gap-1'>
          <span className='font-space text-[12px] font-medium leading-none text-brand-gray-900 dark:text-white'>
            {TOOLS.olake.name}
          </span>
          <span className='font-space text-[8px] font-medium leading-none text-[#525252] dark:text-gray-400'>
            /{TOOLS.olake.description}
          </span>
        </div>
        <span className='font-space text-[10px] font-bold leading-6 tracking-[0.02em] text-brand-green-600 dark:text-green-400'>
          {rowData.olake}
        </span>
      </div>

      {/* Other Tools - Dynamic Rendering */}
      <div className='space-y-3'>
        {visibleTools.map((tool) => {
          const value = rowData[tool.key as keyof BenchmarkData]
          // Skip if value doesn't exist
          if (!value) return null

          return (
            <div key={tool.key} className='flex items-center justify-between px-3 py-2'>
              <div className='flex items-center gap-2'>
                <img
                  src={tool.icon}
                  alt={TOOLS[tool.key].name}
                  className='h-3 w-3'
                  loading='lazy'
                />
                <span className='font-space text-[10px] font-medium leading-none text-brand-gray-900 dark:text-gray-300'>
                  {TOOLS[tool.key].name}
                </span>
              </div>
              <span className='font-space text-[10px] font-medium leading-none text-brand-gray-900 dark:text-gray-300'>
                {value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MobileBenchmarkCards: React.FC<MobileBenchmarkCardsProps> = ({ data, isKafka }) => {
  if (!data || data.length === 0) {
    return (
      <div className='mt-4 text-center text-gray-500 dark:text-gray-400'>
        No benchmark data available.
      </div>
    )
  }

  // Get specific metrics for the cards
  const rowsSynced = data.find((d) => d.metric === 'Rows synced')
  const elapsedTime = data.find((d) => d.metric === 'Elapsed time')

  return (
    <div className='flex gap-4 overflow-x-auto pb-4'>
      {rowsSynced && (
        <SimpleBenchmarkCard title='Rows synced' rowData={rowsSynced} isKafka={isKafka} />
      )}
      {elapsedTime && (
        <SimpleBenchmarkCard title='Elapsed Time' rowData={elapsedTime} isKafka={isKafka} />
      )}
    </div>
  )
}

export default MobileBenchmarkCards
