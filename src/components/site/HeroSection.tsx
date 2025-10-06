import React from 'react'

import Link from '@docusaurus/Link'
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
    <div className='xl:container mx-auto flex w-full flex-col-reverse items-center lg:flex-row justify-between overflow-hidden px-4 py-8 md:px-6 md:py-16 lg:px-0 lg:py-20'>
      {/* Mobile Image - Only visible on mobile */}

      <div className='md:hidden'>
        <StatsSection />
      </div>

      <div className='w-full mb-8 lg:hidden'>
        <div className='flex justify-center'>
          <img
            src='/img/site/hero-section.svg'
            alt='O.Lake Data Pipeline'
            className='max-w-[80%] h-auto dark:filter dark:brightness-90'
            loading="eager" fetchPriority="high" decoding="async"
          />
        </div>
      </div>

      {/* Left Column - contains 2 rows */}
      <div className='mt-0 container lg:mt-0 flex w-full flex-col lg:w-3/5'>
        {/* Row 1: "Fastest way to replicate..." section */}
        <div className='mb-8'>

          <div className='flex flex-col gap-4'>
            <h2 className='mb-6 text-[28px] font-medium text-center lg:text-left text-gray-800  dark:text-white md:text-3xl lg:text-2xl xl:text-3xl'>
              {title}
            </h2>
 
            <h3 className='text-2xl text-center leading-8 lg:text-left font-normal sm:text[32px] md:text-[32px] lg:text-[28px] xl:text-[41px] 2xl:text-[50px]'>
              <span className='rounded-3xl leading-8 bg-[#E9EBFC] px-2 py-1 md:py-1.5 tracking-wider text-[#193ae6] dark:bg-gray-800/80 dark:text-blue-400'>
                Database
              </span>
              <span className='text-[#193AE6] dark:text-blue-400'>→</span>
              <span className='rounded-3xl leading-8 bg-[#E9EBFC] px-2 py-1 md:py-1.5 tracking-widest text-[#193AE6] dark:bg-gray-800/80 dark:text-blue-400'>
                Data Lakehouse
              </span>
            </h3>
          </div>

          <div className='mt-6 px-2 mx-auto lg:mx-0 max-w-full flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <Link
              to='#olake-form-product'
              className='inline-flex items-center justify-center rounded-md bg-[#203FDD] px-4 sm:px-6 py-2.5 font-medium text-white transition-colors hover:text-gray-200 dark:bg-blue-600 dark:hover:bg-blue-700 text-sm sm:text-base'
            >
              Talk to us
            </Link>

            <Link
              to='https://github.com/datazip-inc/olake'
              className='inline-flex items-center justify-center rounded-full bg-[#f0f0f0] px-4 sm:px-6 py-2.5 font-medium text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 text-sm sm:text-base whitespace-nowrap'
              style={{
                border: '1px solid rgba(191, 191, 191, 0.8)',
                borderColor: 'rgba(191, 191, 191, 0.8)'
              }}
            >
              <svg className='mr-2 h-4 w-4 sm:h-5 sm:w-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12' />
              </svg>
              Live on Github. Contribute
            </Link>
          </div>
        </div>

        {/* Row 2: Stats Section */}
        <div className='hidden lg:flex w-full lg:w-3/5 justify-center lg:justify-start'>
          <StatsSection />
        </div>
      </div>

      {/* Desktop Image - Only visible on desktop */}
      <div className='hidden lg:flex w-full lg:w-2/5 justify-center items-center'>
        <div className='flex justify-center w-full'>
          <img src='/img/site/hero-section.svg' alt='OLake Data Pipeline' className='max-w-full h-auto dark:filter dark:brightness-90' loading="eager" fetchPriority="high" decoding="async" />
        </div>
      </div>


    </div>
  )
}

export default HeroSection
