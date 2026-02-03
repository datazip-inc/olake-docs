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
    <div className='text-brand-gray-900 text-4xl font-extrabold dark:text-white sm:text-5xl md:text-6xl'>
      {value}
    </div>
    <div className='text-brand-gray-500 mt-2 text-base dark:text-gray-400 sm:text-lg'>{label}</div>
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
    { value: '5 - 500X', label: 'Faster than traditional tools' },
    { value: '90%', label: 'Cost Savings with OSS' }
    // { value: '3x', label: 'Less CPU' }
  ]
}) => {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-2'>
      <div className='mb-6 flex flex-col items-center md:mb-8'>
        <h2 className='text-brand-gray-900 mb-2 mt-10 text-lg font-medium dark:text-white sm:mt-0 sm:text-xl'>
          {title}
        </h2>
        <Link
          to={linkUrl}
          className='text-brand-blue-500 inline-flex items-center text-xs font-medium hover:text-blue-700 sm:hidden'
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
              <div className='my-2 h-px w-full self-stretch bg-neutral-200 dark:bg-gray-700 sm:my-0 sm:h-auto sm:w-px'></div>
            )}
            <div className='flex flex-col items-center px-4 py-2 text-center sm:py-6'>
              <div className='text-brand-gray-900 text-[28px] font-medium dark:text-white sm:text-4xl md:text-4xl'>
                {stat.value}
              </div>
              <div className='text-brand-gray-500 text-center text-[9px] dark:text-gray-400 sm:text-lg'>
                {stat.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Link
        to={'/docs/benchmarks'}
        className='border-brand-blue-500 text-brand-blue-500 mx-auto mt-16 hidden h-12 w-[415px] items-center justify-center rounded-lg border-solid px-4 py-1 text-center font-helvetica font-medium sm:flex sm:text-base'
      >
        View all performance benchmarks
      </Link>
    </div>
  )
}

export default StatsSection
