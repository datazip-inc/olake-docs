import React from 'react'

import Link from '@docusaurus/Link'
// import OLakeDashboard from './OLakeDashboard';
import StatsSection from './StatsSection'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  showIcebergBadge?: boolean
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Fastest way to replicate your data from',
  subtitle = 'DataDases → Data Lakes',
  showIcebergBadge = true
}) => {
  return (
    <div className='mx-6 flex w-full items-start justify-between overflow-hidden px-4 py-12 md:px-6 md:py-16 lg:flex-row lg:px-8 lg:py-20'>
      {/* Left Column - contains 2 rows */}
      <div className='mb-8 flex w-full flex-col lg:mb-0 lg:w-3/5'>
        {/* Row 1: "Fastest way to replicate..." section */}
        <div className='mb-8'>
          {showIcebergBadge && (
            <div className='mb-6 inline-flex items-center rounded-xl bg-[#EEF8FF] px-4 py-2.5 dark:bg-gray-800'>
              <span className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                Now Supporting
              </span>
              <span className='ml-2 flex items-center'>
                <img src='/img/site/iceberg-logo.svg' alt='Iceberg' className='mr-1 h-5 w-5' />
                <span className='text-sm font-bold uppercase text-gray-800 dark:text-gray-200'>
                  ICEBERG
                </span>
              </span>
            </div>
          )}
          <div className='flex flex-col gap-4'>
            <h1 className='mb-4 text-[32px] font-medium text-gray-800 dark:text-white md:text-4xl lg:text-5xl'>
              {title}
            </h1>

            <h2 className='text-3xl font-bold md:text-4xl lg:text-6xl'>
              <span className='rounded-full bg-[#E9EBFC] px-2 py-1.5 tracking-wider text-[#193ae6]'>
                Database
              </span>
              <span className='text-[#193AE6]'>→</span>
              <span className='rounded-full bg-[#E9EBFC] px-2 py-1.5 tracking-widest text-[#193AE6]'>
                Data Lakehouse
              </span>
            </h2>
          </div>

          <div className='mt-6 flex gap-4'>
            <Link
              to='#talk-to-us'
              className='inline-flex items-center justify-center rounded-md bg-[#203FDD] px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700'
            >
              Talk to us
            </Link>

            <Link
              to='https://github.com/olakeio/olake'
              className='inline-flex items-center justify-center rounded-full bg-[#f0f0f0] px-6 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              style={{
                border: '1px solid #bfbfbf'
              }}
            >
              <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12' />
              </svg>
              Live on Github. Contribute
            </Link>
          </div>
        </div>

        {/* Row 2: Stats Section */}
        <div>
          <StatsSection />
        </div>
      </div>

      {/* Right Column - contains the image */}
      <div className='flex w-full justify-end lg:w-2/5'>
        <div className='relative'>
          <img src='/img/site/hero-section.svg' alt='' />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
