import React from 'react'
import SectionHeader from '../SectionHeader'

const Benchmarks = () => {
  return (
    <div className='mx-auto mt-10 flex flex-col sm:p-8 md:max-w-[90%] md:p-6'>
      <SectionHeader
        heading={
          <>
            Overtaking all the <span className='font-normal'>benchmarks</span>
          </>
        }
        subheading='Reimagining CDC without the hassle of maintaining Kafka.'
      />
      <div className='mt-6 flex flex-col gap-4 md:flex-row md:gap-6'>
        <div className='flex-1 rounded border border-gray-300 p-4'>
          <img
            className='mx-auto w-full object-contain dark:block hidden'
            src='/img/olake/olake-benchmark-1.svg'
            alt='benchmark-graph'
            loading="lazy" decoding="async"
          />
          <img
            className='mx-auto w-full object-contain dark:hidden'
            src='/img/olake/olake-benchmark-white-1.svg'
            alt='benchmark-graph-white theme'
            loading="lazy" decoding="async"
          />
        </div>
        <div className='flex-1 rounded border border-gray-300 p-4'>
          <img
            className='mx-auto w-full object-contain dark:block hidden'
            src='/img/olake/olake-benchmark-2.svg'
            alt='benchmark-graph'
            loading="lazy" decoding="async"
          />

          <img
            className='mx-auto w-full object-contain dark:hidden'
            src='/img/olake/olake-benchmark-white-2.svg'
            alt='benchmark-graph white theme'
            loading="lazy" decoding="async"
          />
        </div>
      </div>
    </div>
  )
}

export default Benchmarks
