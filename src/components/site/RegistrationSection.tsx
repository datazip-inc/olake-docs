import React, { useRef, useEffect } from 'react'

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create: (config: any) => void
      }
    }
  }
}

const RegistrationSection: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scriptLoadedRef = useRef<boolean>(false)
  const formInitializedRef = useRef<boolean>(false)

  // const isMobile = useIsMobile()

  // Defer HubSpot script & form creation until near viewport or anchor requested
  useEffect(() => {
    const loadHubSpot = () => {
      if (formInitializedRef.current) return
      const initialize = () => {
        if (formInitializedRef.current) return
        if (window.hbspt?.forms?.create) {
          window.hbspt.forms.create({
            target: '#olake-product-form',
            portalId: '21798546',
            formId: '86391f69-48e0-4b35-8ffd-13ac212d8208'
          })
          formInitializedRef.current = true
        }
      }

      if (!scriptLoadedRef.current) {
        const script = document.createElement('script')
        script.src = 'https://js.hsforms.net/forms/v2.js'
        script.async = true
        script.onload = () => {
          scriptLoadedRef.current = true
          initialize()
        }
        document.body.appendChild(script)
      } else {
        initialize()
      }
    }

    const targetEl = sectionRef.current
    if (!targetEl) return

    // If user arrived with anchor, load HubSpot immediately
    if (window.location.hash === '#olake-form-product') {
      loadHubSpot()
      return
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadHubSpot()
              observer.disconnect()
            }
          })
        },
        { root: null, rootMargin: '600px', threshold: 0 }
      )
      observer.observe(targetEl)
      return () => {
        observer.disconnect()
      }
    }

    // Fallback for very old browsers
    loadHubSpot()
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative mx-auto h-auto min-h-[80vh] w-full overflow-visible p-0 pb-12 sm:h-[80vh] sm:w-[90%] sm:overflow-hidden sm:rounded-4xl sm:p-6'
    >
      {/* Background lake image (Desktop only) */}
      <div className='absolute inset-0 z-0 hidden sm:block'>
        <img
          src='/img/site/registration-bg.webp'
          alt='Lake background'
          className='h-full w-full object-cover'
          role='presentation'
          loading='lazy'
          decoding='async'
        />

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#012348]/0 via-[#012348]/40 to-[#012348]' />
      </div>

      <div className='relative z-10 mx-auto w-full px-0 py-0 sm:container sm:px-4 md:py-16'>
        <div className='mx-auto'>
          <div className='flex flex-col gap-0 md:grid md:grid-cols-[50%_50%] md:items-center md:gap-8 lg:grid-cols-[50%_40%] lg:gap-16'>
            {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
            <div className='order-2 mx-auto mt-8 w-[95%] rounded-3xl bg-white p-6 shadow-[0.72px_0.72px_5.06px_0px_#0000001A] dark:bg-gray-800 sm:mt-0 sm:w-auto sm:rounded-2xl sm:p-6 md:order-1 md:ml-0 md:rounded-3xl md:p-8 lg:ml-36 lg:p-10'>
              <div className='mb-4 sm:mb-6 md:mb-8'>
                <h3 className='mb-1 text-sm font-bold text-blue-600 dark:text-blue-400 sm:mb-2 sm:text-xl'>
                  OLake
                </h3>
                <h2 className='mb-2 text-lg font-bold text-gray-900 dark:text-white sm:text-2xl md:text-3xl'>
                  Get in touch
                </h2>
                <p className='text-[10px] text-[#696969] dark:text-gray-300 sm:text-base'>
                  Send a query and our team will reach out to you
                </p>
              </div>

              <div className='min-h-[400px] sm:h-[40vh]'>
                <div id='olake-product-form' ref={formRef}></div>
              </div>

              {/* HubSpot form container - hidden, will be used for actual form submission */}

              <div className='mt-6 text-[7px] text-gray-500 sm:text-xs'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>
            </div>

            {/* Right side - Feature Text */}
            <div className='relative order-1 mx-auto flex h-[70vh] w-full flex-col justify-end px-4 pb-16 pt-10 text-white md:order-2 md:ml-0 md:mt-10 md:h-auto md:px-0 md:pb-16 lg:ml-24'>
              {/* Mobile Background Image */}
              <div className='absolute inset-0 -z-10 sm:hidden'>
                <img
                  src='/img/site/registration-bg.webp'
                  alt='Lake background'
                  className='h-full w-full object-cover'
                  role='presentation'
                  loading='lazy'
                  decoding='async'
                />
                <div className='absolute inset-0 bg-gradient-to-b from-[#012348]/0 via-[#012348]/40 to-[#012348]' />
              </div>

              <div className='mb-6 md:mb-8'>
                <h3 className='mb-2 text-sm font-medium md:mb-6 md:text-2xl'>OLake</h3>
                <h2 className='mb-6 text-[32px] font-medium md:mb-16 md:text-3xl lg:text-5xl'>
                  Interested?
                </h2>
              </div>

              <div className='space-y-6 md:space-y-10'>
                {/* Feature 1 */}
                <div>
                  <div className='mb-3 flex items-start gap-4'>
                    <img
                      src='/img/site/iceberg-logo.svg'
                      className='mt-1 size-[10px] sm:size-6'
                      alt='Iceberg catalog logo'
                      loading='lazy'
                      decoding='async'
                    />
                    <div className='flex max-w-[90%] flex-col gap-2'>
                      <div className='text-[11px] font-bold md:text-xl lg:text-xl'>
                        Iceberg Native
                      </div>
                      <div className='break-words pr-4 text-[8px] text-gray-100 md:text-sm'>
                        Instead of directly transforming data from Databases during extraction, we
                        first pull it in its native format.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div>
                  <div className='flex items-start gap-4 md:mb-3'>
                    <svg
                      className='mt-1 size-[11px] flex-shrink-0 sm:size-6'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      aria-label='Lightning bolt icon representing speed'
                    >
                      <path
                        d='M13 10V3L4 14H11V21L20 10H13Z'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div className='flex flex-col gap-2'>
                      <div className='text-[10px] font-bold md:text-xl lg:text-xl'>
                        Faster & More Efficient
                      </div>
                      <div className='break-words pr-4 text-[8px] text-gray-100 md:text-sm'>
                        Instead of directly transforming data from Databases during extraction, we
                        first pull it in its native format.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegistrationSection
