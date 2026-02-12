import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

const STEPS = [
  {
    step: 'Step I',
    title: 'Job Config',
    video: '/videos/config.mp4'
  },
  {
    step: 'Step II',
    title: 'Source',
    video: '/videos/source.mp4'
  },
  {
    step: 'Step III',
    title: 'Destination',
    video: '/videos/destination.mp4'
  },
  {
    step: 'Step IV',
    title: 'Schema',
    video: '/videos/schema.mp4'
  }
]

// Animated connector (reusable for vertical/horizontal)
const Connector: React.FC<{
  index: number
  activeStep: number
  orientation?: 'vertical' | 'horizontal'
}> = ({ index, activeStep, orientation = 'vertical' }) => {
  // Logic from WorkflowDiagram:
  // Fills when we move TO the next step.
  // Connector i connects Step i to Step i+1.
  // It should animate when activeStep becomes i+1.
  const isFullyFilled = activeStep > index + 1
  const isAnimating = activeStep === index + 1
  const isActive = isFullyFilled || isAnimating

  const isVertical = orientation === 'vertical'

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-neutral-200',
        isVertical ? 'h-full w-0.5' : 'h-0.5 w-full'
      )}
    >
      <div
        className={clsx(
          'duration-[800ms] absolute inset-0 transition-transform ease-out',
          isVertical
            ? 'from-brand-blue-500 to-brand-blue-400 origin-top bg-gradient-to-b'
            : 'from-brand-blue-500 to-brand-blue-400 origin-left bg-gradient-to-r',
          isActive
            ? isVertical
              ? 'scale-y-100'
              : 'scale-x-100'
            : isVertical
              ? 'scale-y-0'
              : 'scale-x-0'
        )}
      />
    </div>
  )
}

const SetupStepsSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)

  // Handle manual step selection
  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  // Handle video completion
  const handleVideoEnded = () => {
    setActiveStep((prev) => (prev + 1) % STEPS.length)
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to active step on mobile
  useEffect(() => {
    const container = scrollContainerRef.current
    const activeElement = document.getElementById(`step-indicator-${activeStep}`)

    if (container && activeElement && window.innerWidth < 640) {
      const scrollLeft =
        activeElement.offsetLeft - container.clientWidth / 2 + activeElement.clientWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [activeStep])

  return (
    <section className='py-16 dark:bg-gray-900 md:py-24'>
      <div className='container mx-auto px-4 md:px-6 md:w-[70%]'>
        <div className='mx-auto flex flex-col gap-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-center'>
          {/* Left Side - Steps Navigation */}
          <div className='w-full'>
            <div className='text-brand-blue-500 mb-3 text-xs font-medium tracking-wide sm:text-2xl'>
              The OLake Experience
            </div>
            <h2 className='mb-16 text-xl font-medium leading-tight tracking-[-0.05em] text-gray-900 dark:text-white sm:text-[40px] sm:tracking-wider md:text-5xl'>
              Fast & Efficient
              <span className='sm:hidden'>, </span>
              <br className='hidden sm:block' />
              That is OLake
            </h2>

            <div
              ref={scrollContainerRef}
              className='scrollbar-hide relative -mx-4 flex flex-row overflow-x-auto px-4 sm:mx-0 sm:flex-col sm:overflow-visible sm:px-0'
            >
              {STEPS.map((item, index) => {
                const isActive = activeStep === index
                // const isPast = activeStep > index

                return (
                  <div
                    key={index}
                    id={`step-indicator-${index}`}
                    className='group flex min-w-max flex-shrink-0 cursor-pointer items-center transition-opacity duration-300 sm:w-auto sm:min-w-0 sm:items-stretch'
                    onClick={() => handleStepClick(index)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleStepClick(index)}
                  >
                    <div className='mr-3 flex flex-col items-center sm:mr-6'>
                      {/* Circle Indicator */}
                      <div
                        className={clsx(
                          'z-10 h-[7px] w-[7px] rounded-full border-[3px] border-solid transition-all duration-300 sm:h-4 sm:w-4',
                          isActive
                            ? 'border-primary-600 bg-primary-600 shadow-[0_0_0_4px_#EEF2FF]'
                            : index < activeStep
                              ? 'border-primary-600 bg-white'
                              : 'border-neutral-200 bg-white group-hover:border-neutral-400'
                        )}
                      />
                      {/* Vertical Connector Line (Desktop Only) */}
                      {index < STEPS.length - 1 && (
                        <div className='hidden h-20 w-0.5 sm:block'>
                          <Connector index={index} activeStep={activeStep} orientation='vertical' />
                        </div>
                      )}
                    </div>

                    <div className='flex items-center pb-0 transition-all duration-300 sm:block sm:pb-2'>
                      {/* Mobile Text: Inline */}
                      <div className='flex items-center whitespace-nowrap sm:hidden'>
                        <span className='mr-1 font-helvetica text-xs font-medium text-[#8A8A8A]'>
                          {item.step} /
                        </span>
                        <span
                          className={clsx(
                            'font-helvetica text-sm font-medium leading-none transition-colors',
                            isActive ? 'text-brand-blue-500' : 'text-black dark:text-white'
                          )}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Desktop Text: Stacked (Original) */}
                      <div className='hidden sm:block'>
                        <div className='mb-0.5 font-helvetica text-base font-medium leading-[30.37px] text-[#8A8A8A]'>
                          {item.step}
                        </div>
                        <div
                          className={clsx(
                            'font-helvetica text-xl font-medium leading-none transition-colors',
                            isActive ? 'text-brand-blue-500' : 'text-black dark:text-white'
                          )}
                        >
                          {item.title}
                        </div>
                      </div>

                      {/* Horizontal Connector Line (Mobile Only) */}
                      {index < STEPS.length - 1 && (
                        <div className='mx-4 block w-24 flex-shrink-0 sm:hidden'>
                          <Connector
                            index={index}
                            activeStep={activeStep}
                            orientation='horizontal'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Side - Video Player */}
          <div
            className='relative mx-auto w-[90vw] overflow-hidden rounded-2xl bg-gray-100 shadow-xl dark:bg-gray-800 sm:w-full'
            style={{ aspectRatio: '1/1' }}
          >
            {/* Map over steps to create persistent video elements for smooth transitions */}
            {STEPS.map((step, index) => (
              <VideoPlayer
                key={step.video}
                src={step.video}
                isActive={activeStep === index}
                onEnded={handleVideoEnded}
                alt={step.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Separate component to handle video logic efficiently
const VideoPlayer: React.FC<{
  src: string
  isActive: boolean
  onEnded: () => void
  alt: string
}> = ({ src, isActive, onEnded, alt }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Lazy loading logic: only set src when it first becomes active
  useEffect(() => {
    if (isActive && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isActive, hasLoaded])

  // Play/Pause control
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Video play prevented:', error)
        })
      }
    } else {
      video.pause()
    }
  }, [isActive, hasLoaded])

  return (
    <div
      className={clsx(
        'absolute inset-0 h-full w-full transition-opacity duration-500',
        isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
      )}
    >
      {hasLoaded && (
        <video
          ref={videoRef}
          className='h-full w-full object-cover'
          muted
          playsInline
          onEnded={onEnded}
          src={src}
          aria-label={alt}
        />
      )}
    </div>
  )
}

export default SetupStepsSection
