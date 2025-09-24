import React, { useEffect, useRef, useState } from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'

const FEATURE_BADGES = [
  'Built for teams looking to modernize without rewriting',
  'Transformations auto-mapped, validated, and production-ready',
  'Support for HiveQL, PySpark, SQL, and CDC pipelines'
] as const

interface GlaceProps {
  subtitle?: string
}

interface TallyFormProps {
  src: string
  title: string
}

const TallyForm: React.FC<TallyFormProps> = ({ src, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (isVisible && !scriptLoadedRef.current) {
      const script = document.createElement('script')
      script.src = 'https://tally.so/widgets/embed.js'
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
      }
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isVisible])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { root: null, rootMargin: '600px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <iframe
          data-tally-src={src}
          width='100%'
          height='700'
          title={title}
          loading="lazy"
          className='w-full rounded-xl'
          style={{ border: 'none', minHeight: '600px', margin: 0 }}
        />
      ) : (
        <div style={{ minHeight: '600px' }} className='w-full rounded-xl bg-gray-100 dark:bg-gray-800' />
      )}
    </div>
  )
}

const Glace: React.FC<GlaceProps> = ({
  subtitle = 'Join the waitlist for our AI-powered Hive, Snowflake & Databricks migration service.'
}) => {
  return (
    <div className='min-h-screen w-full bg-[#A9E2FF] bg-opacity-40 p-4 dark:bg-blue-950/30 md:p-8 lg:p-12'>
      <div className='mx-auto rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-900 md:p-8 lg:p-12'>
        <div className='flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:items-start'>
          {/* Left Column - Content */}
          <div className='flex w-full flex-col items-center lg:w-1/2 lg:items-start lg:pr-8'>
            {/* Coming Soon Badge */}
            <div className='mb-4 flex items-center justify-center lg:justify-start'>
              <span className='bg-gradient-to-r from-[#009fee] to-[#bce9ff] bg-clip-text text-xl font-bold text-transparent'>
                AILake is Coming Soon
              </span>
            </div>

            {/* Main Heading */}
            <h4 className='mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:text-left lg:text-5xl'>
              <span className='font-thin'>Migrate to Iceberg </span> In Days, Not Months
            </h4>

            {/* Subtitle */}
            <p className='mb-8 text-center text-lg text-[#000000] dark:text-gray-300 lg:text-left'>
              {subtitle}
            </p>

            {/* Hero Image */}
            <div className='mb-8 flex w-full items-center justify-center'>
              <img
                src='/img/site/glace-cards.svg'
                alt='Glace Illustration'
                className='max-w-full lg:max-w-[90%]'
                width="960" height="540"
                loading="lazy" decoding="async"
              />
            </div>

            {/* Feature List */}
            <div className='w-full space-y-4 px-4'>
              {FEATURE_BADGES.map((feature, index) => (
                <div key={feature} className='flex items-center justify-center space-x-3'>
                  <CheckCircleOutlined />
                  <span className='text-lg text-gray-800 dark:text-gray-200'>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className='w-full lg:w-1/2'>
            <div className='rounded-xl bg-[#f5f5f5] p-4 dark:bg-gray-800/50'>
              <TallyForm src='https://tally.so/r/nrQ8gX' title='Join Waitlist' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Glace
