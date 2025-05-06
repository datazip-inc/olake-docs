import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const RegistrationSection = () => {
  const childRef = useRef()
  const formRef = useRef(null)
  const history = useHistory()
  // const isMobile = useIsMobile()

  useEffect(() => {
    if (childRef.current && childRef.current.init) {
      childRef.current.init()
    }
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    script.async = true
    script.onload = () => {
      window.hbspt.forms.create({
        target: '#olake-product-form',
        portalId: '21798546',
        formId: '86391f69-48e0-4b35-8ffd-13ac212d8208'
      })
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#olake-product-form') {
      setTimeout(() => {
        window.scrollTo(0, formRef.current.offsetTop)
      }, 0)
      console.log('hereee', window.location.pathname, window.location.search)
      history.replace({
        pathname: window.location.pathname,
        search: window.location.search
      })
    }
  }, [history, history.location.hash])

  return (
    <section className='relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20'>
      {/* Background image placeholder - this will be replaced later */}
      <div className='absolute inset-0 z-0 bg-gradient-to-b from-blue-500 to-blue-900 dark:from-blue-700 dark:to-blue-950'>
        {/* Placeholder for the actual image that will be added later */}
      </div>

      <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto'>
          <div className='grid items-center gap-6 sm:gap-8 md:grid-cols-2 lg:gap-12 xl:gap-16'>
            {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
            <div className='rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-lg sm:shadow-xl dark:bg-gray-800 p-4 sm:p-6 md:p-8 lg:p-10'>
              <div className='mb-4 sm:mb-6 md:mb-8'>
                <h3 className='mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400'>OLake</h3>
                <h2 className='mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                  Register for Pilot Program
                </h2>
                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300'>
                  Set up your account to get started
                </p>
              </div>

              {/* added the form here */}
              <div
                id='olake-form-product'
                ref={formRef}
                className='flex w-full flex-col bg-white rounded-2xl md:flex-row'
              >
                <div className='m-2 sm:m-4 md:m-6 lg:m-8 min-h-[250px] sm:min-h-[300px] flex-1 shrink-0 rounded border border-[#f5f5f5] dark:border-gray-700 p-3 sm:p-4 md:p-5 lg:p-10  md:w-1/2'>
                  <div id='olake-product-form' className='bg-white'></div>
                </div>
              </div>

              <div className='mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>
            </div>

            {/* Right side - Feature Text */}
            <div className='text-white order-first md:order-last'>
              <div className='mb-2 sm:mb-4'>
                <h3 className='mb-2 sm:mb-3 text-xl sm:text-2xl font-medium'>OLake</h3>
                <h2 className='mb-6 sm:mb-8 md:mb-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'>
                  Interested?
                  <br />
                  Register Now.
                </h2>
              </div>

              <div className='space-y-6 sm:space-y-8 md:space-y-10'>
                {/* Feature 1 */}
                <div>
                  <div className='mb-2 sm:mb-3 flex items-center'>
                    <svg
                      className='mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M20 7L12 3L4 7L12 11L20 7ZM20 7V17L12 21L4 17V7'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <h3 className='text-lg sm:text-xl md:text-2xl font-semibold'>Iceberg Native</h3>
                  </div>
                  <p className='text-sm sm:text-base text-gray-100 dark:text-gray-200'>
                    Instead of directly transforming data from Databases during extraction, we first
                    pull it in its native format.
                  </p>
                </div>

                {/* Feature 2 */}
                <div>
                  <div className='mb-2 sm:mb-3 flex items-center'>
                    <svg
                      className='mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M13 10V3L4 14H11V21L20 10H13Z'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <h3 className='text-lg sm:text-xl md:text-2xl font-semibold'>Faster & More Efficient</h3>
                  </div>
                  <p className='text-sm sm:text-base text-gray-100 dark:text-gray-200'>
                    Instead of directly transforming data from Databases during extraction, we first
                    pull it in its native format.
                  </p>
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
