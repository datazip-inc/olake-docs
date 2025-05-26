import React, { useState } from 'react'
import MobileBenchmarkCards from './MobileBenchmarkCards'
import { FULL_LOAD, CDC_SYNC, TOOLS, METRIC_LABELS } from '../../data/benchmarkData'
import Link from '@docusaurus/Link'

interface BenchmarkRowProps {
  metric: string
  olakeValue: React.ReactNode
  airbyteValue: React.ReactNode
  fivetranValue: React.ReactNode
  debeziumValue: React.ReactNode
  estuaryValue: React.ReactNode
}

const BenchmarkRow: React.FC<BenchmarkRowProps> = ({
  metric,
  olakeValue,
  airbyteValue,
  fivetranValue,
  debeziumValue,
  estuaryValue
}) => {
  return (
    <div className='grid grid-cols-6 border-b border-gray-200 dark:border-gray-700'>
      <div className='p-5 font-medium text-gray-700 dark:text-gray-300 md:p-6'>{metric}</div>
      <div className='bg-green-50/70 p-5 text-center font-medium text-green-600 dark:text-green-400 md:p-6'>
        {olakeValue}
      </div>
      <div className='p-5 text-center text-gray-600 dark:text-gray-400 md:p-6'>{airbyteValue}</div>
      <div className='p-5 text-center text-gray-600 dark:text-gray-400 md:p-6'>{fivetranValue}</div>
      <div className='p-5 text-center text-gray-600 dark:text-gray-400 md:p-6'>{debeziumValue}</div>
      <div className='p-5 text-center text-gray-600 dark:text-gray-400 md:p-6'>{estuaryValue}</div>
    </div>
  )
}

interface AdvantageRowProps {
  advantage: React.ReactNode
  isVisible?: boolean
}

const AdvantageRow: React.FC<AdvantageRowProps> = ({ advantage, isVisible = true }) => {
  if (!isVisible) {
    return <div className='border-b border-gray-200 p-5 dark:border-gray-700 md:p-6'></div>
  }

  return (
    <div className='border-b border-gray-200 p-5 text-center font-bold text-blue-600 dark:border-gray-700 dark:text-blue-400 md:p-6'>
      {advantage}
    </div>
  )
}

const BenchmarkHeader: React.FC = () => {
  return (
    <div className='grid grid-cols-6 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5 font-medium text-gray-700 dark:text-gray-300 md:p-6'>Metrics</div>
      <div className='p-5 md:p-6'>
        <div className='rounded-lg bg-green-50/70 p-3 text-center dark:bg-green-900/10'>
          <div className='font-semibold text-gray-800 dark:text-gray-200'>OLake</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>Open Source</div>
        </div>
      </div>
      <div className='p-5 md:p-6'>
        <div className='flex items-center justify-center'>
          {/* <svg
            className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 6v12M8 12h8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          </svg>
           */}

          <img src='/img/site/airbyte.svg' alt='' />

          <span className='text-sm text-gray-800 dark:text-white'>Airbyte</span>
        </div>
      </div>
      <div className='p-5 md:p-6'>
        <div className='flex items-center justify-center'>
          <svg
            className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 6v12M8 12h8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          </svg>
          <span className='text-sm text-gray-800 dark:text-white'>Fivetran</span>
        </div>
      </div>
      <div className='p-5 md:p-6'>
        <div className='flex items-center justify-center'>
          <svg
            className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 6v12M8 12h8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          </svg>
          <span className='text-sm text-gray-800 dark:text-white'>Debezium</span>
        </div>
      </div>
      <div className='p-5 md:p-6'>
        <div className='flex items-center justify-center'>
          <svg
            className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 6v12M8 12h8' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          </svg>
          <span className='text-sm text-gray-800 dark:text-white'>Estuary</span>
        </div>
      </div>
    </div>
  )
}

const AdvantageHeader: React.FC = () => {
  return (
    <div className='border-b border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-800 md:p-6'>
      <div className='text-gray-800 dark:text-white'>
        <div className='text-sm font-medium'>The</div>
        <div className='font-semibold'>OLake</div>
        <div className='text-sm font-medium'>Advantage</div>
      </div>
    </div>
  )
}

type BenchmarkTab = 'full-load' | 'cdc-sync'

const BenchmarkSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BenchmarkTab>('full-load')

  // Generate benchmark data for component use from our constants
  const generateBenchmarkData = (data: typeof FULL_LOAD | typeof CDC_SYNC) => {
    return Object.entries(data).map(([key, value]) => {
      const metricKey = key as keyof typeof METRIC_LABELS

      // Check if this is a comparison metric (comparisonFull or comparisonCDC)
      const isComparisonMetric = key === 'comparisonFull' || key === 'comparisonCDC'

      // Handle uniform values (when all tools have the same value)
      if ('isUniform' in value && value.isUniform) {
        return {
          metric: METRIC_LABELS[metricKey],
          olake: value.value,
          airbyte: value.value,
          fivetran: value.value,
          debezium: value.value,
          estuary: value.value,
          isComparisonMetric
        }
      }

      // Handle regular metric data
      return {
        metric: METRIC_LABELS[metricKey],
        olake: (value as any).olake,
        airbyte: (value as any).airbyte,
        fivetran: (value as any).fivetran,
        debezium: (value as any).debezium,
        estuary: (value as any).estuary,
        isComparisonMetric
      }
    })
  }

  // Process the data for both tabs
  const fullLoadData = generateBenchmarkData(FULL_LOAD)
  const cdcSyncData = generateBenchmarkData(CDC_SYNC)

  return (
    <section className='w-full bg-white py-16 dark:bg-gray-900 md:py-24'>
      <div className='mx-auto mb-12 w-full text-center md:mb-16'>
        <div className='mb-3 text-xl font-bold text-[#203FDD]'>Benchmarks</div>
        <h2 className='text-5xl font-bold leading-relaxed tracking-wider text-[#333333] dark:text-white md:text-5xl'>
          Get the <span className='text-[#203FDD]'>best</span>
          <span className='md:ml-2'>with OLake</span>
        </h2>
      </div>

      <div className='mb-8 flex w-full justify-center'>
        <div className='inline-flex gap-2 overflow-hidden rounded-lg'>
          <button
            onClick={() => setActiveTab('full-load')}
            className={`rounded-xl border-none px-10 py-3 text-sm font-medium transition-all ${activeTab === 'full-load'
              ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-transparent text-gray-600 dark:text-gray-400 hover:dark:text-gray-300'
              }`}
          >
            Full Load
          </button>
          <button
            onClick={() => setActiveTab('cdc-sync')}
            className={`rounded-xl border-none px-10 py-3 text-sm font-medium transition-all ${activeTab === 'cdc-sync'
              ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-transparent text-gray-600 dark:text-gray-400 hover:dark:text-gray-300'
              }`}
          >
            CDC Sync
          </button>
        </div>
      </div>

      {/* Mobile view */}
      <div className='px-4 md:hidden'>
        {activeTab === 'full-load' && (
          <MobileBenchmarkCards data={fullLoadData} isFullLoad={true} />
        )}
        {activeTab === 'cdc-sync' && <MobileBenchmarkCards data={cdcSyncData} isFullLoad={false} />}
      </div>

      {/* Desktop view */}
      <div className='hidden w-full overflow-x-auto md:block'>
        <div className='px-4 sm:px-6 lg:px-8'>
          {activeTab === 'full-load' && (
            <div className='flex justify-center'>
              <table className='table-fixed border-collapse'>
                <thead>
                  <tr className='border-t border-gray-200 dark:border-gray-700'>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left text-xl font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      Metrics
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-green-50/70 px-16 py-6 dark:border-gray-700 dark:bg-green-900/20'>
                      <div className='flex flex-col items-center justify-center'>
                        <div className='text-xl font-bold text-gray-800 dark:text-gray-200'>
                          {TOOLS.olake.name}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {TOOLS.olake.description}
                        </div>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/airbyte.svg' alt='' />
                        <span className='text-xl'>{TOOLS.airbyte.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/fivetran.svg' alt='' />
                        <span className='text-xl'>{TOOLS.fivetran.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/debezium.svg' alt='' />
                        <span className='text-xl'>{TOOLS.debezium.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/estuary.svg' alt='' />
                        <span className='text-xl'>{TOOLS.estuary.name}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fullLoadData.map((row) => (
                    <tr key={row.metric}>
                      <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300'>
                        {row.metric}
                      </td>
                      <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:border-gray-700 dark:bg-green-900/20 dark:text-green-400'>
                        {row.olake}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.airbyte}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.fivetran}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.debezium}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.estuary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'cdc-sync' && (
            <div className='flex justify-center'>
              <table className='table-fixed border-collapse'>
                <thead>
                  <tr className='border-t border-gray-200 dark:border-gray-700'>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left text-xl font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      Metrics
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-green-50/70 px-16 py-6 dark:border-gray-700 dark:bg-green-900/20'>
                      <div className='flex flex-col items-center justify-center'>
                        <div className='text-xl font-bold text-gray-800 dark:text-gray-200'>
                          {TOOLS.olake.name}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {TOOLS.olake.description}
                        </div>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/airbyte.svg' alt='' />
                        <span className='text-xl'>{TOOLS.airbyte.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/fivetran.svg' alt='' />

                        <span className='text-xl'>{TOOLS.fivetran.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/debezium.svg' alt='' />

                        <span className='text-xl'>{TOOLS.debezium.name}</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 px-16 py-6 text-left font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <img src='/img/site/estuary.svg' alt='' />

                        <span className='text-xl'>{TOOLS.estuary.name}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cdcSyncData.map((row) => (
                    <tr key={row.metric}>
                      <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300'>
                        {row.metric}
                      </td>
                      <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:border-gray-700 dark:bg-green-900/20 dark:text-green-400'>
                        {row.olake}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.airbyte}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.fivetran}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.debezium}
                      </td>
                      <td
                        className={`border border-gray-200 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {row.estuary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-2 flex w-full flex-col space-y-4 2xl:px-40 md:flex-row md:space-x-2 md:space-y-0">
            <Link
              to="https://olake.io/docs/connectors/postgres/benchmarks"
              className="inline-flex items-center font-medium text-[#203FDD] hover:text-blue-700 ml-auto"
            >
              View all Performance Benchmarks
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>

        </div>


      </div>



    </section>
  )
}

export default BenchmarkSection
