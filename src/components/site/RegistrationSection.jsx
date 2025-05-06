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
    <section className='relative mx-auto w-4/5 overflow-hidden rounded-xl p-6'>
      {/* Background lake image */}
      <div className='absolute inset-0 z-0'>
        <img
          src='/img/site/registration-bg.svg'
          alt='Lake background'
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-blue-900/70'></div>
      </div>

      <div className='container relative z-10 mx-auto py-16'>
        <div className='mx-auto'>
          <div className='grid items-center gap-8 md:grid-cols-2 lg:gap-16'>
            {/* Left side - Registration Form Card */}
            <div className='rounded-xl bg-white p-8 shadow-xl'>
              <div className='mb-6'>
                <h3 className='mb-2 text-xl font-bold text-blue-600'>OLake</h3>
                <h2 className='mb-2 text-2xl font-bold text-gray-900'>
                  Register for Pilot Program
                </h2>
                <p className='text-gray-600'>Set up your account to get started</p>
              </div>

              {/* Custom form to match image */}
              <div className='mb-4'>
                <label htmlFor='fullName' className='mb-1 block text-sm font-medium text-gray-700'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='fullName'
                  placeholder='Full Name'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='emailID' className='mb-1 block text-sm font-medium text-gray-700'>
                  Email ID
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    id='emailID'
                    placeholder='Email ID'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  />
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400'>
                    0 / 20
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='companyName'
                  className='mb-1 block text-sm font-medium text-gray-700'
                >
                  Company Name
                </label>
                <input
                  type='text'
                  id='companyName'
                  placeholder='Company Name'
                  className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                />
              </div>

              <button className='w-32 rounded-md bg-blue-600 px-6 py-2 text-center font-medium text-white hover:bg-blue-700'>
                Talk to us
              </button>

              <div className='mt-8 text-xs text-gray-600'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>

              {/* Hidden element for HubSpot form (kept for functionality but not displayed) */}
              <div id='olake-product-form' ref={formRef} className='hidden'></div>
            </div>

            {/* Right side - Feature Text */}
            <div className='text-white'>
              <div className='mb-8'>
                <h3 className='mb-3 text-2xl font-medium'>OLake</h3>
                <h2 className='mb-10 text-4xl font-medium md:text-6xl'>
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
