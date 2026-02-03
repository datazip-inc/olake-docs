import React, { useRef, useEffect } from 'react'

const FeatureCard = ({
  title,
  description,
  illustration,
  bgColor,
  href
}: {
  title: string
  description: string
  illustration: React.ReactNode
  bgColor: string
  href?: string
}) => {
  // Get the appropriate blur color based on background color
  const getBlurColor = () => {
    if (bgColor.includes('#C7ECFF')) return '#92d3f5'
    if (bgColor.includes('indigo')) return '#c4caf9'
    if (bgColor.includes('blue-100')) return '#bae6fd'
    return '#bae6fd' // default
  }

  const cardContent = (
    <div
      className={`${bgColor} relative flex min-h-[370px] min-w-[80vw] flex-shrink-0 snap-center flex-col overflow-hidden rounded-[20px] p-6 sm:h-[461px] sm:min-w-128 sm:rounded-[40px] sm:p-8 md:p-10 ${
        href ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''
      }`}
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
        <div className='relative z-20 md:-mb-12'>
          <h3 className='mb-2 text-xs font-bold text-gray-900 dark:text-white md:text-2xl'>
            {title}
          </h3>
          <p className='text-[7px] text-gray-700 dark:text-gray-200 sm:text-sm'>{description}</p>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className='block h-full'>
        {cardContent}
      </a>
    )
  }

  return cardContent
}

const FeatureShowcase: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to center the third card on mobile on initial load
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 640) {
      const container = scrollContainerRef.current
      const cards = container.children
      if (cards.length >= 3) {
        const thirdCard = cards[2] as HTMLElement
        const scrollPosition =
          thirdCard.offsetLeft - (container.offsetWidth - thirdCard.offsetWidth) / 2
        container.scrollTo({ left: scrollPosition, behavior: 'auto' })
      }
    }
  }, [])

  return (
    <section className='w-full bg-white py-12 dark:bg-gray-900 sm:py-16 md:py-24'>
      {/* Heading container - centered */}
      <div className='container mx-auto mb-8 px-4 text-center sm:mb-12 md:mb-24 md:px-6'>
        <div className='mb-2 text-xs font-semibold text-primary-600 sm:mb-3 sm:text-2xl'>
          Why OLake?
        </div>
        <h2 className='text-brand-gray-900 text-xl font-medium dark:text-white sm:text-4xl md:text-[64px]'>
          We know how to stand out
        </h2>
      </div>

      {/* Cards container - full width scrollable with snap on mobile */}
      <div
        ref={scrollContainerRef}
        className='flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:snap-none sm:gap-8 md:px-6'
      >
        <FeatureCard
          title='Faster Resumable Full Load'
          description='Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.'
          illustration={
            <div className='flex h-24 w-full items-center justify-center sm:h-28 md:h-32'>
              <img
                src='/img/site/why-olake-1.svg'
                alt='schema connecting to data lake with faster resumable full load'
                loading='lazy'
                decoding='async'
                className='h-full w-auto max-w-full scale-125 object-contain'
              />
            </div>
          }
          bgColor='bg-[#C7ECFF] dark:bg-blue-900/20'
          href='/docs/features/#3-stateful-resumable-syncs'
        />

        <FeatureCard
          title='Schema-Aware Logs and Alerts for Integrity '
          description='Actively monitors sync failures, schema changes, and data type modifications, ensuring that issues like incompatible updates or ingestion errors are swiftly detected, clearly logged, and immediately surfaced through real-time alerts'
          illustration={
            <div className='flex h-28 w-full items-center justify-center sm:h-28 md:h-32'>
              <img
                src='/img/site/why-olake-2.svg'
                alt='Schema-aware logs and alerts for data integrity'
                loading='lazy'
                decoding='async'
                className='h-full w-auto max-w-full scale-125 object-contain'
              />
            </div>
          }
          bgColor='bg-[#E9EBFD] dark:bg-indigo-900/20'
          href='/blog/olake-architecture'
        />

        <FeatureCard
          title='CDC Cursor Preservation'
          description='When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.'
          illustration={
            <div className='flex h-44 w-full items-center justify-end pr-11 sm:h-28 md:h-44'>
              <img
                src='/img/site/why-olake-3.svg'
                alt='CDC cursor preservation with MongoDB source'
                loading='lazy'
                decoding='async'
                className='h-full w-auto max-w-full scale-125 object-contain'
              />
            </div>
          }
          bgColor='bg-[#E9EBFD] dark:bg-indigo-900/20'
          href='/blog/olake-architecture-deep-dive/#cdc-sync'
        />

        <FeatureCard
          title='Achieve near real-time latency'
          description='Using Databases change stream logs (binglogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronization and ensures that data is consistently updated with near real-time updates.'
          illustration={
            <div className='flex h-36 w-full items-center justify-center sm:h-28 md:h-44'>
              <img
                src='/img/site/why-olake-4.svg'
                alt='Connector selection for real-time database sync'
                loading='lazy'
                decoding='async'
                className='h-full w-auto max-w-full scale-125 object-contain'
              />
            </div>
          }
          bgColor='bg-[#DDF3FF] dark:bg-blue-900/20'
          href='/blog/what-makes-olake-fast'
        />
      </div>
    </section>
  )
}

export default FeatureShowcase
