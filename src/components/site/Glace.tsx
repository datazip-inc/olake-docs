import React, { useEffect } from 'react'

const FEATURE_BADGES = [
  'Proactive Reliability',
  'Reduced Costs',
  'Operational Efficiency',
  'Optimised Performance'
] as const

interface GlaceProps {
  subtitle?: string
}

interface TallyFormProps {
  src: string
  title: string
}

const TallyForm: React.FC<TallyFormProps> = ({ src, title }) => {
  useEffect(() => {
    // Load Tally script
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <iframe
      data-tally-src={src}
      width='100%'
      height='500'
      frameBorder='0'
      title={title}
      className='w-full'
      style={{ border: 'none', minHeight: '500px', margin: 0 }}
    />
  )
}

const Glace: React.FC<GlaceProps> = ({
  subtitle = 'See inside your Iceberg tables — snapshots, small files, and storage waste — before it costs you.'
}) => {
  return (
    <div className='min-h-screen w-full bg-[#A9E2FF] bg-opacity-40 p-4 dark:bg-blue-950/30 md:p-8 lg:p-12'>
      <div className='mx-auto rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-900 md:p-8 lg:p-12'>
        <div className='flex w-full flex-col items-center justify-center'>
          {/* Hero Image */}
          <div className='mb-8 flex w-full items-center justify-center'>
            <img src='/img/site/glace-cards.svg' alt='Glace Illustration' />
          </div>

          {/* Coming Soon Badge */}
          <div className='mb-4 flex items-center justify-center'>
            <span className='bg-gradient-to-r from-[#009fee] to-[#bce9ff] bg-clip-text text-xl font-bold text-transparent'>
              Glace is Coming Soon
            </span>
          </div>

          {/* Main Heading */}
          <h4 className='mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-5xl'>
            <span className='font-thin'>Observability</span> for Apache Iceberg Tables
          </h4>

          {/* Subtitle */}
          <p className='text-center text-lg text-[#000000] dark:text-gray-300'>{subtitle}</p>

          {/* Waitlist Form */}
          <div className='mb-12 w-full max-w-xl'>
            <TallyForm src='https://tally.so/r/nrQ8gX' title='Join Waitlist' />
          </div>

          {/* Feature Badges */}
          <div className='flex flex-wrap items-center justify-center gap-2 font-bold text-[#363636] dark:text-gray-400'>
            {FEATURE_BADGES.map((badge, index) => (
              <React.Fragment key={badge}>
                <span className='rounded-full px-4 py-2 dark:bg-gray-800'>{badge}</span>
                {index < FEATURE_BADGES.length - 1 && (
                  <span className='hidden size-[9px] rounded-full bg-[#e5e5e5] md:block' />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Glace
