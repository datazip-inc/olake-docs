import React, { useState, useRef, useEffect, useCallback } from 'react'
import MobileBenchmarkCards from './MobileBenchmarkCards'
import {
  TOOLS,
  CONNECTORS,
  CONNECTOR_BENCHMARKS,
  CONNECTOR_CDC_BENCHMARKS,
  CONNECTOR_METRIC_LABELS,
  ConnectorId,
  BenchmarkMode
} from '../../data/benchmarkData'
import Link from '@docusaurus/Link'

const BenchmarkSection: React.FC = () => {
  const [activeConnector, setActiveConnector] = useState<ConnectorId>('postgres')
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>('full_load')
  const isKafka = activeConnector === 'kafka'

  // Refs for dynamic border positioning
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const olakeHeaderRef = useRef<HTMLTableCellElement>(null)
  const metricsHeaderRef = useRef<HTMLTableCellElement>(null)
  const airbyteHeaderRef = useRef<HTMLTableCellElement>(null)
  const fivetranHeaderRef = useRef<HTMLTableCellElement>(null)
  const debeziumHeaderRef = useRef<HTMLTableCellElement>(null)
  const estuaryHeaderRef = useRef<HTMLTableCellElement>(null)
  const flinkHeaderRef = useRef<HTMLTableCellElement>(null)

  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0, height: 0 })
  const [dividerPositions, setDividerPositions] = useState<number[]>([])

  // Calculate border position based on OLake column and other columns
  const updateBorderPosition = useCallback(() => {
    if (olakeHeaderRef.current && tableWrapperRef.current) {
      const headerRect = olakeHeaderRef.current.getBoundingClientRect()
      const wrapperRect = tableWrapperRef.current.getBoundingClientRect()

      setBorderStyle({
        left: headerRect.left - wrapperRect.left - 1,
        width: headerRect.width + 1,
        height: wrapperRect.height
      })

      // Calculate positions for other gray separators
      const separators: number[] = []

      // Helper to get relative right position
      const getRelativeRight = (ref: React.RefObject<HTMLTableCellElement>) => {
        if (ref.current) {
          return ref.current.getBoundingClientRect().right - wrapperRect.left
        }
        return null
      }

      // Helper to get relative left position
      const getRelativeLeft = (ref: React.RefObject<HTMLTableCellElement>) => {
        if (ref.current) {
          return ref.current.getBoundingClientRect().left - wrapperRect.left
        }
        return null
      }

      // 1. Left of Metrics (Table start)
      const metricsLeft = getRelativeLeft(metricsHeaderRef)
      if (metricsLeft !== null) separators.push(metricsLeft)

      // 2. Right of Airbyte
      const airbyteRight = getRelativeRight(airbyteHeaderRef)
      if (airbyteRight !== null) separators.push(airbyteRight)

      // 3. Right of Fivetran
      const fivetranRight = getRelativeRight(fivetranHeaderRef)
      if (fivetranRight !== null) separators.push(fivetranRight)

      // 4. Right of Debezium (only if NOT Kafka)
      if (!isKafka) {
        const debeziumRight = getRelativeRight(debeziumHeaderRef)
        if (debeziumRight !== null) separators.push(debeziumRight)
      }

      // 5. Right of Estuary (if Flink not present, this is end. If Flink present, this is separator)
      const estuaryRight = getRelativeRight(estuaryHeaderRef)
      if (estuaryRight !== null) separators.push(estuaryRight)

      // 6. Right of Flink (Table end if visible)
      if (isKafka) {
        const flinkRight = getRelativeRight(flinkHeaderRef)
        if (flinkRight !== null) separators.push(flinkRight)
      }

      setDividerPositions(separators)
    }
  }, [isKafka]) // isKafka dependency needed for Flink column

  useEffect(() => {
    // Initial calculation needs a small delay to ensure DOM is fully laid out especially with images
    const timer = setTimeout(updateBorderPosition, 100)
    window.addEventListener('resize', updateBorderPosition)
    return () => {
      window.removeEventListener('resize', updateBorderPosition)
      clearTimeout(timer)
    }
  }, [activeConnector, updateBorderPosition])

  // Get benchmark data based on current mode
  const currentBenchmarkSource =
    benchmarkMode === 'full_load' ? CONNECTOR_BENCHMARKS : CONNECTOR_CDC_BENCHMARKS

  // Check if current connector has data for the selected mode
  const currentConnectorData = currentBenchmarkSource[activeConnector]
  const hasData = currentConnectorData.hasData

  // Calculate column width based on number of columns
  // Both Kafka and non-Kafka show 6 columns:
  // Non-Kafka: Metrics, OLake, Airbyte, Fivetran, Debezium, Estuary
  // Kafka: Metrics, OLake, Airbyte, Fivetran, Estuary, Flink
  const columnCount = 6
  const columnWidth = `${100 / columnCount}%`

  // Generate benchmark data for the selected connector
  const generateBenchmarkData = (connectorId: ConnectorId) => {
    const benchmarkData = currentBenchmarkSource[connectorId]

    return Object.entries(CONNECTOR_METRIC_LABELS).map(([key, label]) => {
      const metricKey = key as keyof typeof CONNECTOR_METRIC_LABELS
      const metricData = benchmarkData[metricKey]

      return {
        metric: label,
        olake: metricData.olake,
        airbyte: metricData.airbyte,
        fivetran: metricData.fivetran,
        debezium: metricData.debezium,
        estuary: metricData.estuary,
        flink: metricData.flink, // Optional field, only populated for Kafka
        isComparisonMetric: metricKey === 'comparison'
      }
    })
  }

  // Process the data for the active connector
  const benchmarkData = generateBenchmarkData(activeConnector)

  // Coming Soon component
  const ComingSoon = () => (
    <div className='flex min-h-[54vh] flex-col items-center justify-center py-20'>
      <span className='font-space text-5xl font-normal tracking-wider'>Coming Soon</span>
      <p className='mt-5 text-center text-sm text-gray-600 dark:text-gray-400'>
        We're currently running benchmarks for this connector.
        <br />
        Check back soon for performance data.
      </p>
    </div>
  )

  return (
    <section className='w-full bg-white py-16 dark:bg-gray-900 md:py-24'>
      <div className='mx-auto mb-12 w-full text-center md:mb-16'>
        <div className='text-brand-blue-500 mb-3 text-xs font-medium sm:text-2xl'>Benchmarks</div>
        <h2 className='text-brand-gray-900 mx-auto w-[85%] font-space text-[20px] font-medium leading-[120%] tracking-[-0.05em] dark:text-white sm:w-full sm:text-5xl sm:leading-relaxed sm:tracking-normal'>
          Designed for engineers who want to <br className='hidden sm:block' /> control complexity
        </h2>
      </div>

      {/* Benchmark Mode Toggle - Full Load / CDC with sliding animation */}
      <div className='mb-4 flex w-full justify-center sm:mb-6'>
        <div className='relative inline-flex h-7 items-center rounded-md bg-gray-100 p-[2px] dark:bg-gray-800 sm:h-auto sm:rounded-xl sm:p-1'>
          {/* Sliding background indicator */}
          <div
            className='absolute bottom-[2px] top-[2px] w-[calc(50%-2px)] rounded-[4px] bg-white shadow-sm transition-all duration-300 ease-in-out dark:bg-gray-700 sm:bottom-1 sm:top-1 sm:w-[calc(50%-4px)] sm:rounded-lg'
            style={{
              left: benchmarkMode === 'full_load' ? '2px' : 'calc(50%)'
            }}
          />
          <button
            onClick={() => setBenchmarkMode('full_load')}
            className={`relative z-10 flex h-6 w-24 items-center justify-center rounded-[4px] border-none bg-transparent text-center font-space text-xs font-medium transition-colors duration-300 sm:h-auto sm:w-28 sm:rounded-lg sm:px-4 sm:py-2 sm:text-base ${
              benchmarkMode === 'full_load'
                ? 'text-primary-600 dark:text-blue-400'
                : 'text-brand-gray-400 hover:text-brand-gray-600 dark:text-gray-400 hover:dark:text-gray-300'
            }`}
          >
            Full Load
          </button>
          <button
            onClick={() => setBenchmarkMode('cdc')}
            className={`relative z-10 flex h-6 w-24 items-center justify-center rounded-[4px] border-none bg-transparent text-center font-space text-xs font-medium transition-colors duration-300 sm:h-auto sm:w-28 sm:rounded-lg sm:px-4 sm:py-2 sm:text-base ${
              benchmarkMode === 'cdc'
                ? 'text-primary-600 dark:text-blue-400'
                : 'text-brand-gray-400 hover:text-brand-gray-600 dark:text-gray-400 hover:dark:text-gray-300'
            }`}
          >
            CDC
          </button>
        </div>
      </div>

      {/* Connector Filter Buttons */}
      <div className='mb-16 flex w-full overflow-x-auto pb-4 sm:justify-center sm:overflow-visible sm:pb-0'>
        <div className='flex flex-nowrap gap-2 px-4 sm:flex-wrap sm:justify-center sm:px-0'>
          {CONNECTORS.map((connector) => (
            <button
              key={connector.id}
              onClick={() => setActiveConnector(connector.id)}
              className={`flex-shrink-0 rounded-xl border-none px-3 py-1 text-center font-space text-xs font-medium leading-[120%] tracking-[-0.05em] transition-all sm:px-6 sm:py-3 sm:font-sans sm:text-lg sm:font-normal sm:leading-normal sm:tracking-normal ${
                activeConnector === connector.id
                  ? 'bg-white text-primary-600 dark:bg-blue-900/30 dark:text-blue-400 sm:bg-[#E8EBFD]'
                  : 'text-brand-gray-400 bg-transparent dark:text-gray-400 hover:dark:text-gray-300 sm:text-neutral-700'
              }`}
            >
              {connector.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile view */}
      <div className='px-4 md:hidden'>
        {hasData ? <MobileBenchmarkCards data={benchmarkData} isKafka={isKafka} /> : <ComingSoon />}
        {/* Mobile benchmark footer */}
        <div className='mt-4 flex flex-col items-center space-y-2'>
          <span className='text-center text-[8px] text-gray-400 dark:text-gray-500 sm:text-[10px]'>
            We are currently running benchmarks, numbers will be updated soon.
          </span>
          <Link
            to='/docs/benchmarks'
            className='text-brand-blue-500 inline-flex items-center text-xs font-medium hover:text-blue-700'
          >
            View all Benchmarks
            <svg className='ml-1 h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Desktop view */}
      <div className='hidden overflow-visible md:block'>
        <div className='px-4 sm:px-6 lg:px-0'>
          {hasData ? (
            <>
              <div className='overflow-visible'>
                <div ref={tableWrapperRef} className='relative w-full overflow-visible'>
                  {/* Gray Gradient Vertical Dividers for other columns */}
                  {dividerPositions.map((leftPos, index) => {
                    const extension = index === 2 ? 50 : index === 3 ? 120 : 0
                    return (
                      <div
                        key={`divider-${index}`}
                        className='pointer-events-none absolute z-10 w-[1.15px] bg-[linear-gradient(180deg,#D1D1D1_0%,#FFFFFF_100%)]'
                        style={{
                          left: leftPos,
                          top: -extension,
                          height: borderStyle.height + extension
                        }}
                      />
                    )
                  })}

                  {/* Top full-width border */}
                  <div className='bg-brand-gray-250 pointer-events-none absolute left-0 top-0 z-10 h-px w-full' />

                  {/* Gradient border overlay for OLake column - using individual border lines */}
                  {/* Left border */}
                  <div
                    className='pointer-events-none absolute -top-[50px] z-10 w-px bg-[linear-gradient(180deg,#389E0D_0%,rgba(56,158,13,0.1)_100%)]'
                    style={{
                      left: borderStyle.left,
                      height: borderStyle.height + 50
                    }}
                  />
                  {/* Right border */}
                  <div
                    className='pointer-events-none absolute top-0 z-10 w-px bg-[linear-gradient(180deg,#389E0D_0%,rgba(56,158,13,0.1)_100%)]'
                    style={{
                      left: borderStyle.left + borderStyle.width,
                      height: borderStyle.height
                    }}
                  />
                  {/* Top border - extends to the right */}
                  <div
                    className='bg-brand-green-600 pointer-events-none absolute top-0 z-10 h-px'
                    style={{
                      left: borderStyle.left,
                      width: borderStyle.width + 50
                    }}
                  />
                  <table
                    className='benchmark-table-no-border'
                    style={{
                      tableLayout: 'fixed',
                      width: '100%',
                      display: 'table',
                      border: 'none',
                      borderCollapse: 'separate',
                      borderSpacing: 0
                    }}
                  >
                    {/* Column definitions using colgroup - the semantic way to style columns */}
                    <colgroup>
                      <col style={{ width: columnWidth }} /> {/* Metrics column */}
                      <col
                        style={{ width: columnWidth }}
                        className='bg-[linear-gradient(177.62deg,rgba(56,158,13,0.08)_4.09%,rgba(255,255,255,0.08)_100.5%)]'
                      />
                      {/* OLake column */}
                      <col style={{ width: columnWidth }} /> {/* Airbyte */}
                      <col style={{ width: columnWidth }} /> {/* Fivetran */}
                      {!isKafka && <col style={{ width: columnWidth }} />} {/* Debezium */}
                      <col style={{ width: columnWidth }} /> {/* Estuary */}
                      {isKafka && <col style={{ width: columnWidth }} />}{' '}
                      {/* Flink - only for Kafka */}
                    </colgroup>
                    <thead>
                      <tr>
                        <th
                          ref={metricsHeaderRef}
                          className='text-brand-gray-900 border-0 bg-white px-6 py-12 text-center text-xl font-medium'
                          style={{ minWidth: 0, border: 'none' }}
                        >
                          Metrics
                        </th>
                        <th
                          ref={olakeHeaderRef}
                          className='text-brand-gray-900 border-0 bg-transparent px-4 py-12 text-left font-medium'
                          style={{ minWidth: 0, border: 'none' }}
                        >
                          <div className='flex items-center justify-center space-x-2'>
                            <img
                              src='/img/site/olake.svg'
                              alt='OLake platform logo'
                              loading='lazy'
                              decoding='async'
                            />
                            <span className='text-xl font-bold'>{TOOLS.olake.name}</span>
                          </div>
                          <div className='text-center text-sm font-medium text-neutral-600 dark:text-gray-400'>
                            {TOOLS.olake.description}
                          </div>
                        </th>
                        <th
                          ref={airbyteHeaderRef}
                          className='text-brand-gray-900 border-0 bg-white px-4 py-12 text-left font-medium'
                          style={{ minWidth: 0, border: 'none' }}
                        >
                          <div className='flex items-center justify-center space-x-2'>
                            <img
                              src='/img/site/airbyte.svg'
                              alt='Airbyte logo'
                              loading='lazy'
                              decoding='async'
                            />
                            <span className='text-xl'>{TOOLS.airbyte.name}</span>
                          </div>
                        </th>
                        <th
                          ref={fivetranHeaderRef}
                          className='text-brand-gray-900 border-0 bg-white px-4 py-12 text-left font-medium'
                          style={{ minWidth: 0, border: 'none' }}
                        >
                          <div className='flex items-center justify-center space-x-2'>
                            <img
                              src='/img/site/fivetran.svg'
                              alt='Fivetran logo'
                              loading='lazy'
                              decoding='async'
                            />
                            <span className='text-xl'>{TOOLS.fivetran.name}</span>
                          </div>
                        </th>
                        {!isKafka && (
                          <th
                            ref={debeziumHeaderRef}
                            className='text-brand-gray-900 border-0 bg-white px-4 py-12 text-left font-medium'
                            style={{ minWidth: 0, border: 'none' }}
                          >
                            <div className='flex items-center justify-center space-x-2'>
                              <img
                                src='/img/site/debezium.svg'
                                alt='Debezium logo'
                                loading='lazy'
                                decoding='async'
                              />
                              <span className='text-xl'>{TOOLS.debezium.name}</span>
                            </div>
                          </th>
                        )}
                        <th
                          ref={estuaryHeaderRef}
                          className='text-brand-gray-900 border-0 bg-white px-4 py-12 text-left font-medium'
                          style={{ minWidth: 0, border: 'none' }}
                        >
                          <div className='flex items-center justify-center space-x-2'>
                            <img
                              src='/img/site/estuary.svg'
                              alt='Estuary logo'
                              loading='lazy'
                              decoding='async'
                            />
                            <span className='text-xl'>{TOOLS.estuary.name}</span>
                          </div>
                        </th>
                        {/* Flink column - only shown for Kafka */}
                        {isKafka && (
                          <th
                            ref={flinkHeaderRef}
                            className='text-brand-gray-900 border-0 bg-white px-4 py-12 text-left font-medium'
                            style={{ minWidth: 0, border: 'none' }}
                          >
                            <div className='flex items-center justify-center space-x-2'>
                              <img
                                src='/img/site/flink.svg'
                                alt='Flink logo'
                                loading='lazy'
                                decoding='async'
                              />
                              <span className='text-xl'>{TOOLS.flink.name}</span>
                            </div>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkData.map((row) => (
                        <tr key={row.metric}>
                          <td
                            className='border-0 p-6 font-medium text-gray-700 dark:text-gray-300'
                            style={{ border: 'none' }}
                          >
                            {row.metric}
                            {row.metric === 'Cost' && (
                              <div className='mt-1 text-xs font-normal text-gray-400 dark:text-gray-500'>
                                OLake is OSS and self-hosted - only pay for your infrastructure.
                              </div>
                            )}
                          </td>
                          <td
                            className='text-brand-green-600 border-0 bg-transparent p-6 text-center font-bold'
                            style={{ border: 'none' }}
                          >
                            {row.olake}
                          </td>
                          <td
                            className={`border-0 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            style={{ border: 'none' }}
                          >
                            {row.airbyte}
                          </td>
                          <td
                            className={`border-0 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            style={{ border: 'none' }}
                          >
                            {row.fivetran}
                          </td>
                          {!isKafka && (
                            <td
                              className={`border-0 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                              style={{ border: 'none' }}
                            >
                              {row.debezium}
                            </td>
                          )}
                          <td
                            className={`border-0 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            style={{ border: 'none' }}
                          >
                            {row.estuary}
                          </td>
                          {/* Flink data - only shown for Kafka */}
                          {isKafka && (
                            <td
                              className={`border-0 p-6 text-center ${row.isComparisonMetric ? 'text-lg font-medium text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                              style={{ border: 'none' }}
                            >
                              {row.flink}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='mt-2 flex w-full flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 2xl:pl-10 2xl:pr-40'>
                <span className='ml-5 text-xs text-gray-400 dark:text-gray-500'>
                  We are currently running benchmarks, numbers will be updated soon.
                </span>
                <Link
                  to='/docs/benchmarks'
                  className='mr-5  text-brand-blue-500 inline-flex items-center font-medium hover:text-blue-700'
                >
                  View all Performance Benchmarks
                  <svg
                    className='ml-1 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <ComingSoon />
          )}
        </div>
      </div>
    </section>
  )
}

export default BenchmarkSection
