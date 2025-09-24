import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const RegistrationSection = () => {
  const childRef = useRef()
  const formRef = useRef(null)
  const sectionRef = useRef(null)
  const scriptLoadedRef = useRef(false)
  const formInitializedRef = useRef(false)
  const history = useHistory()
  // const isMobile = useIsMobile()

  // Defer HubSpot script & form creation until near viewport or anchor requested
  useEffect(() => {
    if (childRef.current && childRef.current.init) {
      childRef.current.init()
    }

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

    // If user arrived with anchor, load immediately and scroll
    if (window.location.hash === '#olake-form-product') {
      loadHubSpot()
      requestAnimationFrame(() => {
        window.scrollTo(0, targetEl.offsetTop)
        history.replace({ pathname: window.location.pathname, search: window.location.search })
      })
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
      return () => observer.disconnect()
    }

    // Fallback for very old browsers
    loadHubSpot()
  }, [history])

  return (
    <section
      id='olake-form-product'
      ref={sectionRef}
      className='w-5/5 relative mx-auto overflow-hidden rounded-xl p-6 2xl:w-4/5'
    >
      {/* Background lake image */}
      <div className='absolute inset-0 z-0'>
        <img
          src='/img/site/registration-bg.webp'
          alt='Lake background'
          className='h-full w-full object-cover'
          role='presentation'
          loading="lazy" decoding="async"
        />
        {/* <div className='absolute inset-0 bg-blue-900/70'></div> */}
      </div>

      <div className='container relative z-10 mx-auto py-8 md:py-16'>
        <div className='mx-auto'>
          <div className='grid items-center gap-8 md:grid-cols-[50%_50%] lg:grid-cols-[60%_40%] lg:gap-16'>
            {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
            <div className='order-2 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800 sm:rounded-2xl sm:p-6 sm:shadow-xl md:order-1 md:rounded-3xl md:p-8 lg:p-10'>
              <div className='mb-4 sm:mb-6 md:mb-8'>
                <h3 className='mb-1 text-lg font-bold text-blue-600 dark:text-blue-400 sm:mb-2 sm:text-xl'>
                  OLake
                </h3>
                <h2 className='mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl md:text-3xl'>
                  Register for Pilot Program
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-300 sm:text-base'>
                  Set up your account to get started
                </p>
              </div>

              {/* added the form here */}
              <div
                id='olake-form-product2'
                ref={formRef}
                className='flex w-full flex-col rounded-2xl bg-white md:flex-row'
              >
                <div className='m-1 min-h-[250px] flex-1 shrink-0 rounded border border-[#f5f5f5] p-2 dark:border-gray-700 sm:m-2 sm:min-h-[300px] sm:p-3 md:m-3'>
                  <div id='olake-product-form' className='bg-white'></div>
                </div>
              </div>

              <div className='mt-4 text-xs text-gray-600 dark:text-gray-400 sm:mt-6 sm:text-sm md:mt-8'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>


            </div>

            {/* Right side - Feature Text */}
            <div className='order-1 text-white md:order-2'>
              <div className='mb-6 md:mb-8'>
                <h3 className='mb-2 text-xl font-medium md:mb-3 md:text-2xl'>OLake</h3>
                <h2 className='mb-6 text-3xl font-medium md:mb-10 md:text-3xl lg:text-5xl'>
                  Discover more
                  <br />
                  Join us now
                </h2>
              </div>

              <div className='space-y-6 md:space-y-10'>
                {/* Feature 1 */}
                <div>
                  <div className='mb-3 flex items-start gap-4'>
                    <img
                      src='/img/site/iceberg-logo.svg'
                      className='mt-1'
                      alt='Apache Iceberg logo'
                      loading="lazy" decoding="async"
                    />
                    <div className='flex max-w-[90%] flex-col gap-2'>
                      <div className='text-lg font-semibold md:text-xl lg:text-xl'>
                        Iceberg Native
                      </div>
                      <div className='break-words pr-4 text-sm text-gray-100 md:text-sm'>
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
                      className='mt-1 h-5 w-5 flex-shrink-0 md:h-6 md:w-6'
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
                    <div className='flex max-w-[90%] flex-col gap-2'>
                      <div className='text-lg font-semibold md:text-xl lg:text-xl'>
                        Faster & More Efficient
                      </div>
                      <div className='break-words pr-4 text-sm text-gray-100 md:text-sm'>
                        Engineered for high-throughput EL with adaptive chunking, parallel execution
                        for historical loads, and CDC for optimized data pipeline.
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
