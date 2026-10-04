import React, { useRef, useEffect } from 'react'
import Section from '@site/src/components/landing/ui/Section'
import Card from '@site/src/components/landing/ui/Card'
import '@site/src/components/pages-misc/pages-misc.css'

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create: (config: any) => void
      }
    }
  }
}

/**
 * The "Get in touch" block of the contact page: a card holding the HubSpot form, next to the
 * "Interested?" pitch. The HubSpot script and form are created only when the section is near the
 * viewport (or at once when the URL carries #olake-form-product); portal and form ids are unchanged.
 */
const RegistrationSection: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef<boolean>(false)
  const formInitializedRef = useRef<boolean>(false)

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
    <Section id='olake-form-product' flush className='pb-[40px] pt-[16px] lg:pb-[64px] lg:pt-[24px]'>
      <div
        ref={sectionRef}
        className='grid grid-cols-1 gap-[32px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[56px]'
      >
        <Card className='p-[24px] lg:p-[40px]'>
          <h2 className='mb-0 text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-olake-ink lg:text-[32px]'>
            Get in touch
          </h2>
          <p className='mb-0 mt-[10px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
            Send a query and our team will reach out to you
          </p>
          <div className='olake-hs-form mt-[24px] min-h-[440px] lg:mt-[32px]'>
            <div id='olake-product-form' ref={formRef}></div>
          </div>
        </Card>

        <div className='lg:pt-[12px]'>
          <h2 className='mb-0 text-[24px] font-normal leading-[1.2] tracking-[-0.01em] text-olake-ink lg:text-[38px]'>
            Interested?
          </h2>
          <ul className='mb-0 list-none p-0 mt-[24px] flex flex-col gap-[24px] border-0 border-t border-solid border-olake-line-rule pt-[24px] lg:mt-[32px] lg:pt-[32px]'>
            <li className='flex items-start gap-[16px]'>
              <img
                src='/img/site/iceberg-logo.svg'
                alt='Iceberg catalog logo'
                width={24}
                height={24}
                loading='lazy'
                decoding='async'
                className='mt-[2px] size-[24px] shrink-0'
              />
              <div>
                <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[20px]'>
                  Iceberg Native
                </h3>
                <p className='mb-0 mt-[6px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                  Instead of directly transforming data from Databases during extraction, we first
                  pull it in its native format.
                </p>
              </div>
            </li>
            <li className='flex items-start gap-[16px]'>
              <svg
                className='mt-[1px] size-[24px] shrink-0 text-olake-blue'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                aria-label='Lightning bolt icon representing speed'
              >
                <path
                  d='M13 10V3L4 14H11V21L20 10H13Z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div>
                <h3 className='mb-0 text-[17px] font-normal leading-[1.3] text-olake-ink lg:text-[20px]'>
                  Faster &amp; More Efficient
                </h3>
                <p className='mb-0 mt-[6px] text-[14px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
                  OLake makes data replication faster by parallelising full loads, leveraging
                  change streams for real-time sync, and pulling data in a lake house.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}

export default RegistrationSection
