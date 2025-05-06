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
    <section className='relative overflow-hidden py-20'>
      {/* Background image placeholder - this will be replaced later */}
      <div className='absolute inset-0 z-0 bg-gradient-to-b from-blue-500 to-blue-900'>
        {/* Placeholder for the actual image that will be added later */}
      </div>

      <div className='container relative z-10 mx-auto px-4 md:px-6'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid items-center gap-8 md:grid-cols-2 lg:gap-16'>
            {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
            <div className='rounded-3xl bg-white p-8 shadow-xl dark:bg-gray-800 md:p-10'>
              <div className='mb-8'>
                <h3 className='mb-2 text-xl font-bold text-blue-600'>OLake</h3>
                <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl'>
                  Register for Pilot Program
                </h2>
                <p className='text-gray-600 dark:text-gray-300'>
                  Set up your account to get started
                </p>
              </div>

              {/* added the form here */}

              <div
                id='olake-form-product'
                ref={formRef}
                className='flex w-full flex-col md:my-8 md:max-w-[90%] md:flex-row'
              >
                <div className='flex-1 shrink-0 pl-[50px] pt-[50px] md:w-1/2'>
                  {/* Logo and Title Row */}
                  <div className='flex items-center gap-2 text-[24px] font-semibold text-gray-900 dark:text-white'>
                    {/* Light Mode Logo */}
                    <img
                      src='/img/logo/olake-black.svg'
                      alt='OLake logo (light)'
                      className='h-auto w-12 dark:hidden'
                    />

                    {/* Dark Mode Logo */}
                    <img
                      src='/img/logo/olake-white.svg'
                      alt='OLake logo (dark)'
                      className='hidden h-auto w-12 dark:block'
                    />

                    <span>OLake</span>
                  </div>

                  {/* Headline */}
                  <div className='mt-4 text-4xl font-normal text-gray-900 dark:text-white'>
                    Interested?
                    <br /> Get Early Access.
                  </div>
                </div>

                <div className='m-8 min-h-[300px] flex-1 shrink-0 rounded border border-[#f5f5f5] p-5 dark:bg-white md:w-1/2 md:p-10'>
                  <div id='olake-product-form'></div>
                </div>
              </div>

              <div className='mt-8 text-sm text-gray-600 dark:text-gray-400'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>
            </div>

            {/* Right side - Feature Text */}
            <div className='text-white'>
              <div className='mb-2'>
                <h3 className='mb-3 text-2xl font-medium'>OLake</h3>
                <h2 className='mb-10 text-4xl font-bold md:text-6xl'>
                  Interested?
                  <br />
                  Register Now.
                </h2>
              </div>

              <div className='space-y-10'>
                {/* Feature 1 */}
                <div>
                  <div className='mb-3 flex items-center'>
                    <svg
                      className='mr-3 h-6 w-6'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M20 7L12 3L4 7L12 11L20 7ZM20 7V17L12 21L4 17V7'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <h3 className='text-xl font-semibold md:text-2xl'>Iceberg Native</h3>
                  </div>
                  <p className='text-gray-100'>
                    Instead of directly transforming data from Databases during extraction, we first
                    pull it in its native format.
                  </p>
                </div>

                {/* Feature 2 */}
                <div>
                  <div className='mb-3 flex items-center'>
                    <svg
                      className='mr-3 h-6 w-6'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M13 10V3L4 14H11V21L20 10H13Z'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <h3 className='text-xl font-semibold md:text-2xl'>Faster & More Efficient</h3>
                  </div>
                  <p className='text-gray-100'>
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
