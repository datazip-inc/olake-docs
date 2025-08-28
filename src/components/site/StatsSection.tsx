import React from 'react'
import Link from '@docusaurus/Link'

interface StatItemProps {
  value: string
  label: string
  isLast?: boolean
}

const StatItem: React.FC<StatItemProps> = ({ value, label, isLast = false }) => (
  <div
    className={`flex flex-col items-center px-4 py-6 text-center md:items-start md:px-6 md:text-left ${!isLast ? 'border-b border-gray-300 dark:border-gray-700 md:border-b-0 md:border-r' : ''}`}
  >
    <div className='text-4xl font-extrabold text-[#333333] dark:text-white sm:text-5xl md:text-6xl'>
      {value}
    </div>
    <div className='mt-2 text-base text-[#858585] dark:text-gray-400 sm:text-lg'>{label}</div>
  </div>
)

interface StatsSectionProps {
  title?: string
  linkText?: string
  linkUrl?: string
  stats?: Array<{ value: string; label: string }>
}

const StatsSection: React.FC<StatsSectionProps> = ({
  title = 'Get the OLake Advantage',
  linkText = 'View all Performance Benchmarks',
  linkUrl = '/docs/benchmarks',
  stats = [
    { value: '3 - 100X', label: 'Faster than traditional tools' },
    { value: '90%', label: 'Cost Savings with OSS' },
    // { value: '3x', label: 'Less CPU' }
  ]
}) => {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-2'>
      <div className='mb-6 md:mb-8'>
        <h2 className='mb-2 text-xl font-medium text-[#333333] dark:text-white sm:text-2xl md:mb-2 md:text-2xl'>
          {title}
        </h2>
        <Link
          to={linkUrl}
          className='inline-flex items-center font-medium text-[#203FDD] hover:text-blue-700'
        >
          {linkText}
          <svg className='ml-1 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
            />
          </svg>
        </Link>
      </div>

      <div className='flex flex-col justify-between border-t border-gray-300 dark:border-gray-700 md:flex-row md:border-b'>
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className='hidden h-auto w-px self-stretch bg-gray-300 dark:bg-gray-700 md:block'></div>
            )}
            <div className='flex flex-col items-center px-4 py-6 text-center'>
              <div className='text-4xl font-medium text-[#333333] dark:text-white sm:text-3xl md:text-4xl'>
                {stat.value}
              </div>
              <div className='mt-2 text-center text-base text-[#858585] dark:text-gray-400 sm:text-lg'>
                {stat.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default StatsSection
