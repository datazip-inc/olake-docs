import React from 'react'

interface IcebergBadgeProps {
  text?: string
}

const IcebergBadge: React.FC<IcebergBadgeProps> = ({ text = 'Exclusively for Apache Iceberg' }) => {
  return (
    <div className='inline-flex items-center rounded-xl bg-white px-4 py-1 shadow-md'>
      <img src='/img/site/iceberg-logo.svg' alt='Iceberg' className='mr-1.5 size-10' />
      <span className='text-sm font-bold text-gray-800'>{text}</span>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  image: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image }) => {
  return (
    <div className='h-full overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-gray-800'>
      <div className='flex h-full flex-col p-1 md:px-2'>
        <div className='mb-6 flex items-center justify-center rounded-xl'>
          <img src={image} alt={title} className='w-full object-contain' />
        </div>
        <div className='md:p-4'>
          <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>{title}</h3>
          <p className='flex-grow text-sm text-gray-600 dark:text-gray-300'>{description}</p>
        </div>
      </div>
    </div>
  )
}

const IcebergHero: React.FC = () => {
  // Background URL
  const bgUrl = '/img/site/iceberg-bg.svg'

  return (
    <section className='relative overflow-hidden rounded-t-3xl py-20 md:py-32'>
      <div
        className='absolute inset-0 left-0 right-0 z-0 mx-auto flex w-full translate-y-[-180px] items-center justify-center rounded-xl'
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '6px'
        }}
      />

      {/* Rest of your section content goes here, likely needs position relative and z-index > 0 */}
      {/* <div className="relative z-10"> ... your content ... </div> */}

      {/* Overlay */}
      <div className='absolute inset-0 z-0' />

      <div className='container relative z-10 mx-auto px-4 md:px-6'>
        <div className='mb-16 text-center md:mb-28'>
          <div className='mb-8'>
            <IcebergBadge />
          </div>
          <h2 className='mb-6 text-4xl font-bold leading-relaxed tracking-wide text-white md:text-5xl lg:text-6xl'>
            Built on Iceberg.
            <br />
            Born for Scale.
          </h2>
        </div>

        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          <FeatureCard
            title='Schema evolution'
            description='Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new columns, renaming fields, or changing data types.'
            image='/img/site/iceberg-1.svg'
          />
          <FeatureCard
            title='Schema datatype changes'
            description='Schema evolution allows you to safely change data types of your fields without data loss or downtime. Upgrade from smaller to larger types as your data needs evolve while maintaining backward compatibility.'
            image='/img/site/iceberg-2.svg'
          />
          <FeatureCard
            title='Partitioning and partition evolution'
            description='Schema evolution allows you to modify your partitioning strategy over time. Easily add, remove, or transform partition fields to optimize performance based on your evolving query patterns.'
            image='/img/site/iceberg-3.svg'
          />
        </div>
      </div>
    </section>
  )
}

export default IcebergHero
