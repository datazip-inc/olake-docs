import React from 'react'
import { PiArrowSquareOut, PiReadCvLogo } from 'react-icons/pi'

interface IcebergBadgeProps {
  text?: string
}

const IcebergBadge: React.FC<IcebergBadgeProps> = () => {
  return (
    <div className='inline-flex items-center justify-center gap-1 rounded-xl bg-white px-4 py-1 pr-7 shadow-md'>
      <img
        src='/img/site/iceberg-logo.svg'
        alt='Iceberg catalog logo'
        className='mr-1.5 size-10'
        loading='lazy'
        decoding='async'
      />
      <span className='text-base font-bold text-gray-800'>Exclusively for</span>
      <span className='relative text-base font-normal text-gray-800'>
        Apache Iceberg
        <span className='absolute -right-2 -top-[10px] text-[10px] font-medium'>TM</span>
      </span>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  image: string
  imageAlt: string
  blogLink?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  blogLink
}) => {
  return (
    <div className='h-full overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-gray-800'>
      <div className='flex h-full flex-col p-1 md:px-2'>
        <div className='mb-4 flex max-w-full items-center justify-center rounded-xl md:mb-6'>
          <img
            src={image}
            alt={imageAlt}
            className='w-full object-contain'
            loading='lazy'
            decoding='async'
          />
        </div>
        <div className='flex flex-grow flex-col p-4 md:p-6'>
          {/* Title: Space Grotesk, 14px mobile, 24px desktop */}
          <h3 className='mb-2 font-space text-sm font-medium leading-none text-gray-900 dark:text-white md:mb-3 md:text-2xl md:font-bold md:leading-normal'>
            {title}
          </h3>
          {/* Description: ~10px mobile, 16px desktop, 150% line height */}
          <p className='flex-grow text-[10px] leading-normal text-gray-600 dark:text-gray-300 md:text-base'>
            {description}
          </p>
          {blogLink && (
            <a
              href={blogLink}
              className='mt-auto flex items-center pt-3 text-black hover:underline dark:text-blue-400 md:pt-4'
            >
              <div className='flex w-full items-center justify-between gap-2 rounded-lg bg-[#F6F8FF] px-3 py-2 md:px-4 md:py-3'>
                <div className='flex min-w-0 items-center gap-x-1.5 overflow-hidden md:gap-x-2'>
                  <PiReadCvLogo className='size-4 shrink-0 text-primary-600 md:size-5' />
                  {/* Blog link: Space Grotesk, 8px mobile, 14px desktop */}
                  <span className='truncate font-space text-[8px] font-medium leading-none md:text-sm md:leading-normal'>
                    Learn more
                  </span>
                </div>
                <PiArrowSquareOut className='size-3 text-black md:size-[14px]' />
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const IcebergHero: React.FC = () => {
  // Background URL
  const bgUrl = '/img/site/iceberg-bg.webp'

  return (
    <section className='relative h-auto overflow-hidden rounded-t-none py-20 pb-32 md:rounded-t-[32px] md:py-32'>
      <div className='absolute inset-x-0 top-0 z-0 mx-0 flex h-[80vh] w-full overflow-hidden rounded-none sm:h-[500px] md:mx-auto md:h-[780px] md:w-[90%] md:rounded-[32px]'>
        <img
          src={bgUrl}
          alt='Background'
          className='h-full w-full object-cover object-top'
          loading='lazy'
          decoding='async'
        />
        {/* Blue gradient overlay */}
        <div
          className='absolute inset-0 opacity-40'
          style={{ background: 'linear-gradient(180deg, #1E70B9 0%, #1D6EB9 100%)' }}
        />
      </div>

      {/* Rest of your section content goes here, likely needs position relative and z-index > 0 */}
      {/* <div className="relative z-10"> ... your content ... </div> */}

      {/* Overlay */}
      <div className='absolute inset-0 z-0' />

      <div className='container relative z-10 mx-auto mt-20 px-4 md:mt-32 md:px-6'>
        <div className='mb-16 text-center md:mb-16'>
          <div className='mb-10'>
            <IcebergBadge />
          </div>
          <h2 className='mb-6 text-4xl font-medium leading-relaxed tracking-wide text-white md:text-5xl lg:text-6xl'>
            Built on Iceberg.
            <br />
            Born for Scale.
          </h2>
        </div>

        <div className='mx-auto grid max-w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          <FeatureCard
            title='Schema evolution'
            description='Apache Iceberg enables seamless schema evolution by supporting column additions, deletions, renames, and reordering ensuring reliable analytics on evolving datasets without rewriting historical data.'
            image='/img/site/iceberg-1.svg'
            imageAlt='Schema evolution'
            blogLink='/docs/features/?tab=schema-evolution'
          />
          <FeatureCard
            title='Schema datatype changes'
            description='Apache Iceberg enables safe and forward-compatible data type evolutions. This guarantees robust schema evolution without the need to rewrite existing data or disrupt downstream queries.'
            image='/img/site/iceberg-2.svg'
            imageAlt='Schema type mapping migration'
            blogLink='/docs/features/?tab=overview#3-schema-evolution--data-types-changes'
          />
          <FeatureCard
            title='Partitioning and partition evolution'
            description='Apache Iceberg supports flexible partitioning without requiring data to be physically rewritten. Partition evolution allows you to safely change partition strategies over time without impacting existing data.'
            image='/img/site/iceberg-3.svg'
            imageAlt='Database partitions data flow'
            blogLink='/docs/writers/iceberg/partitioning/'
          />
        </div>
      </div>
    </section>
  )
}

export default IcebergHero
