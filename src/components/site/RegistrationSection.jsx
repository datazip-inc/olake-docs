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
    <section id='olake-form-product' className='relative mx-auto w-5/5 2xl:w-4/5 overflow-hidden rounded-xl p-6'>
      {/* Background lake image */}
      <div className='absolute inset-0 z-0'>
        <img
          src='/img/site/registration-bg.jpg'
          alt='Lake background'
          className='h-full w-full object-cover'
        />
        {/* <div className='absolute inset-0 bg-blue-900/70'></div> */}
      </div>



      <div className='container relative z-10 mx-auto py-8 md:py-16'>
        <div className='mx-auto'>

          <div className='grid items-center gap-8 md:grid-cols-[50%_50%] lg:grid-cols-[60%_40%] lg:gap-16'>
            
            
            {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
            <div className='rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-lg sm:shadow-xl dark:bg-gray-800 p-4 sm:p-6 md:p-8 lg:p-10 order-2 md:order-1'>
             
             
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
                id='olake-form-product2'
                ref={formRef}
                className='flex w-full flex-col bg-white rounded-2xl md:flex-row'
              >
                <div className='m-1 sm:m-2 md:m-3 min-h-[250px] sm:min-h-[300px] flex-1 shrink-0 rounded border border-[#f5f5f5] dark:border-gray-700 p-2 sm:p-3'>
                  <div id='olake-product-form' className='bg-white'></div>
                </div>
              </div>

              <div className='mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                OLake makes data replication faster by parallelising full loads, leveraging change
                streams for real-time sync, and pulling data in a lake house
              </div>
            </div>





     

            {/* Right side - Feature Text */}
            <div className='text-white order-1 md:order-2'>
              <div className='mb-6 md:mb-8'>
                <h3 className='mb-2 md:mb-3 text-xl md:text-2xl font-medium'>OLake</h3>
                <h2 className='mb-6 md:mb-10  text-3xl md:text-3xl lg:text-5xl font-medium'>
                  Interested?
                  <br />
                  Register Now.
                </h2>
              </div>

              <div className='space-y-6 md:space-y-10'>
                {/* Feature 1 */}
                <div>
                  <div className='mb-3 flex items-center'>
                    <svg
                      className='mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6'
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
                    <h3 className='text-lg md:text-xl lg:text-2xl font-semibold'>Iceberg Native</h3>
                  </div>
                  <p className='text-sm md:text-base text-gray-100'>
                    Instead of directly transforming data from Databases during extraction, we first
                    pull it in its native format.
                  </p>
                </div>

                {/* Feature 2 */}
                <div>
                  <div className='mb-2 md:mb-3 flex items-center'>
                    <svg
                      className='mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6'
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
                    <h3 className='text-lg md:text-xl lg:text-2xl font-semibold'>Faster & More Efficient</h3>
                  </div>
                  <p className='text-sm md:text-base text-gray-100'>
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
