import React, { useState } from 'react'

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
          <div className='font-semibold text-gray-800'>OLake</div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>Open Source</div>
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
            className={`rounded-xl border-none px-10 py-3 text-sm font-medium transition-all ${
              activeTab === 'full-load'
                ? 'bg-[#E8EBFD] text-blue-700'
                : 'bg-transparent text-gray-600'
            }`}
          >
            Full Load
          </button>
          <button
            onClick={() => setActiveTab('cdc-sync')}
            className={`rounded-xl border-none px-10 py-3 text-sm font-medium transition-all ${
              activeTab === 'cdc-sync'
                ? 'bg-[#E8EBFD] text-blue-700'
                : 'bg-transparent text-gray-600'
            }`}
          >
            CDC Sync
          </button>
        </div>
      </div>

      <div className='w-full overflow-x-auto'>
        <div className='mx-auto max-w-full px-4'>
          {activeTab === 'full-load' && (
            <div className='flex w-full justify-center'>
              <table className='w-full max-w-7xl table-fixed border-collapse'>
                <thead>
                  <tr className='border-t border-gray-200'>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      Metrics
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-green-50/70 p-6'>
                      <div className='flex flex-col items-center justify-center'>
                        <div className='font-bold text-gray-800'>OLake</div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>Open Source</div>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M12 6v12M8 12h8'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                          />
                        </svg>
                        <span>Airbyte</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M4 12h16M12 4v16'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                          />
                        </svg>
                        <span>Fivetran</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path d='M4 4h16v16H4z' stroke='currentColor' strokeWidth='2' />
                        </svg>
                        <span>Debezium</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M3 6l9 4 9-4M3 12l9 4 9-4M3 18l9 4 9-4'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span>Estuary</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Rows synced
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      50 Million
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      50 Million
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      50 Million
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      50 Million
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      50 Million
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Elapsed time
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      22.5 minutes
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      23 hours
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      31 minutes
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      60 minutes
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      4.5 hours
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Speed (Rows/Sec)
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      36,982 RPS
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      585 RPS
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      26,910 RPS
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      13,808 RPS
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      3,085 RPS
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Comparison
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium dark:bg-green-900/10 dark:text-gray-400'>
                      -
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      63 X slower
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      1.4 X slower
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      2.7 X slower
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      12 X slower
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Cost
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      $1.02
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $ 148.95
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $ 2,257
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $1.02
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $ 22.72
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'cdc-sync' && (
            <div className='flex w-full justify-center'>
              <table className='w-full max-w-7xl table-fixed border-collapse'>
                <thead>
                  <tr className='border-t border-gray-200'>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      Metrics
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-green-50/70 p-6'>
                      <div className='flex flex-col items-center justify-center'>
                        <div className='font-bold text-gray-800'>OLake</div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>Open Source</div>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M12 6v12M8 12h8'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                          />
                        </svg>
                        <span>Airbyte</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M4 12h16M12 4v16'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                          />
                        </svg>
                        <span>Fivetran</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path d='M4 4h16v16H4z' stroke='currentColor' strokeWidth='2' />
                        </svg>
                        <span>Debezium</span>
                      </div>
                    </th>
                    <th className='w-1/6 border border-gray-200 bg-gray-50 p-6 text-left font-medium text-gray-700 dark:text-gray-300'>
                      <div className='flex items-center justify-center space-x-2'>
                        <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
                          <path
                            d='M3 6l9 4 9-4M3 12l9 4 9-4M3 18l9 4 9-4'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span>Estuary</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      CDC Latency
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      &lt;3 seconds
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      5-10 seconds
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      5-10 seconds
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      5-10 seconds
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      5-10 seconds
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      CPU Usage
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      30%
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      90% +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      90% +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      90% +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      90% +
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Memory Usage
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      1.5 GB
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      4GB +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      4GB +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      4GB +
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      4GB +
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Infrastructure Cost
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium text-green-600 dark:bg-green-900/10 dark:text-green-400'>
                      $
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $$$
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $$$
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $$$
                    </td>
                    <td className='border border-gray-200 p-6 text-center text-gray-600 dark:text-gray-400'>
                      $$$
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-200 p-6 font-medium text-gray-700 dark:text-gray-300'>
                      Comparison
                    </td>
                    <td className='border border-gray-200 bg-green-50/70 p-6 text-center font-medium dark:bg-green-900/10 dark:text-gray-400'>
                      -
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      3X more resources
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      3X more resources
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      3X more resources
                    </td>
                    <td className='border border-gray-200 p-6 text-center font-medium text-blue-600 dark:text-blue-400'>
                      3X more resources
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BenchmarkSection
