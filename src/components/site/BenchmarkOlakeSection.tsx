import Link from '@docusaurus/Link'
import React from 'react'

const BenchmarkOlakeSection = () => {
  return (
    <div className='relative w-full'>
      {/* Full-width background layer - visible on mobile, hidden on desktop */}
      <div className='absolute inset-0 bg-[#FCFCFC] sm:hidden' />

      <section className='container relative mb-16 flex h-[50vh] flex-col py-16'>
        {/* Main wrapper for all expanding borders */}
        <div className='relative px-8 sm:px-24'>
          {/* Top horizontal line - full viewport width */}
          <div className='absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-neutral-300' />
          {/* Bottom horizontal line - full viewport width */}
          <div className='absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-neutral-300' />
          {/* Left vertical line - full height with extensions (hidden on mobile) */}
          <div className='absolute left-8 top-0 hidden h-[calc(100%+4rem)] w-px -translate-y-8 bg-neutral-300 sm:left-24 sm:block' />
          {/* Right vertical line - full height with extensions (hidden on mobile) */}
          <div className='absolute right-8 top-0 hidden h-[calc(100%+4rem)] w-px -translate-y-8 bg-neutral-300 sm:right-24 sm:block' />

          {/* Main content container */}
          <div className='flex h-[50vh] flex-col items-center justify-center bg-[#FCFCFC] py-16'>
            <div className='text-brand-gray-900 relative text-lg font-medium sm:text-[40px]'>
              Benchmark<span className='text-primary-600'> OLake</span>
            </div>
            <div className='mt-4 text-center font-sans text-[9px] text-neutral-700 sm:text-xl'>
              Run your benchmarks with OLake and see the difference. Our open-source EL <br />
              engine is optimized for Apache Iceberg, ensuring top-tier performance.
            </div>
            <Link
              to='/docs/getting-started/quickstart'
              className='mt-5 flex w-36 items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-[9px] font-medium text-white hover:text-white hover:no-underline sm:mt-12 sm:h-12 sm:w-60 sm:text-base'
            >
              Test Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BenchmarkOlakeSection
