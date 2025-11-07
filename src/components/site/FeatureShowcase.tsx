import React from 'react'

const FeatureCard = ({
  title,
  description,
  illustration,
  bgColor
}: {
  title: string
  description: string
  illustration: React.ReactNode
  bgColor: string
}) => {
  // Get the appropriate blur color based on background color
  const getBlurColor = () => {
    if (bgColor.includes('#C7ECFF')) return '#92d3f5'
    if (bgColor.includes('indigo')) return '#c4caf9'
    if (bgColor.includes('blue-100')) return '#bae6fd'
    return '#bae6fd' // default
  }

  return (
    <div
      className={`${bgColor} relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10`}
    >
      <div className='relative z-10'>
        <div className='relative mb-10 pt-4 sm:mb-12'>
          <div className='z-10 scale-125 transform'>{illustration}</div>
          <div
            className='absolute -bottom-4 left-0 right-0 h-16 blur-xl'
            style={{
              background: `linear-gradient(to top, ${getBlurColor()}, transparent)`,
              opacity: 0.7,
              zIndex: 5
            }}
          ></div>
        </div>
        <div className='relative md:-mb-12 z-20'>
          <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white sm:mb-3 sm:text-xl md:text-2xl'>
            {title}
          </h3>
          <p className='text-xs text-gray-700 dark:text-gray-200 sm:text-sm md:text-sm'>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

const FeatureShowcase: React.FC = () => {
  return (
    <section className='bg-white py-12 dark:bg-gray-900 sm:py-16 md:py-24'>
      <div className='container mx-auto px-4 md:px-6 lg:max-w-7xl'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-8 text-center sm:mb-12 md:mb-16'>
            <div className='mb-2 font-semibold text-[#193AE6] sm:mb-3'>Why OLake?</div>
            <h2 className='text-3xl font-medium text-[#333333] dark:text-white sm:text-4xl md:text-5xl'>
              We know how to stand out
            </h2>
          </div>

          <div className='mx-auto grid max-w-7xl gap-6 sm:grid-cols-1 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-12'>
            <FeatureCard
              title='Faster Resumable Full Load'
              description='Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.'
              illustration={
                <div className='flex h-24 w-full items-center justify-center sm:h-28 md:h-32'>
                  <img
                    src='/img/site/why-olake-1.svg'
                    alt='schema connecting to data lake with faster resumable full load'
                    loading="lazy" decoding="async"
                    className='h-full w-auto max-w-full scale-125 object-contain'
                  />
                </div>
              }
              bgColor='bg-[#C7ECFF] dark:bg-blue-900/20'
            />

            <FeatureCard
              title='Schema-Aware Logs and Alerts for Integrity '
              description='Actively monitors sync failures, schema changes, and data type modifications, ensuring that issues like incompatible updates or ingestion errors are swiftly detected, clearly logged, and immediately surfaced through real-time alerts'
              illustration={
                <div className='flex h-28 w-full items-center justify-center sm:h-28 md:h-32'>
                  <img
                    src='/img/site/why-olake-2.svg'
                    alt='Schema-aware logs and alerts for data integrity'
                    loading="lazy" decoding="async"
                    className='h-full w-auto max-w-full scale-125 object-contain'
                  />
                </div>
              }
              bgColor='bg-[#E9EBFD] dark:bg-indigo-900/20'
            />

            <FeatureCard
              title='CDC Cursor Preservation'
              description='When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.'
              illustration={
                <div className='flex h-44 w-full items-center pr-11 justify-end sm:h-28 md:h-44'>
                  <img
                    src='/img/site/why-olake-3.svg'
                    alt='CDC cursor preservation with MongoDB source'
                    loading="lazy" decoding="async"
                    className='h-full w-auto max-w-full scale-125 object-contain'
                  />
                </div>
              }
              bgColor='bg-[#E9EBFD] dark:bg-indigo-900/20'
            />

            <FeatureCard
              title='Achieve near real-time latency'
              description='Using Databases change stream logs (binglogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronization and ensures that data is consistently updated with near real-time updates.'
              illustration={
                <div className='flex h-36 w-full items-center justify-center sm:h-28 md:h-44'>
                  <img
                    src='/img/site/why-olake-4.svg'
                    alt='Connector selection for real-time database sync'
                    loading="lazy" decoding="async"
                    className='h-full w-auto max-w-full scale-125 object-contain'
                  />
                </div>
              }
              bgColor='bg-[#DDF3FF] dark:bg-blue-900/20'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase