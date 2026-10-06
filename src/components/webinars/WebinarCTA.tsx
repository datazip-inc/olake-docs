// components/WebinarCTA.jsx

import React from 'react'
import { PiVideoCamera } from 'react-icons/pi'
import CTAButton from './CTAButton'

type WebinarCTAProps = {
  CTAText: string
}

/** Closing card of a webinar, event or meetup page, pointing at the webinars page. */
const WebinarCTA: React.FC<WebinarCTAProps> = ({ CTAText }) => {
  return (
    <div className='rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[24px] py-[36px] text-left lg:px-[64px] lg:py-[56px]'>
      {/* CTA Title */}
      <h2 className='max-w-[560px] text-[26px] leading-[1.15] font-normal tracking-[-0.01em] text-olake-ink lg:text-[40px]'>
        {CTAText}
      </h2>

      {/* Description */}
      <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-olake-text-2 lg:text-[15px]'>
        Secure your spot by registering below.
      </p>

      {/* CTA Button */}
      <div className='mt-[22px] flex lg:mt-[28px]'>
        <CTAButton
          buttonText='Watch Our Webinar & Events Page!'
          icon={PiVideoCamera}
          href='/webinar/'
          variant='primary'
        />
      </div>
    </div>
  )
}

export default WebinarCTA
