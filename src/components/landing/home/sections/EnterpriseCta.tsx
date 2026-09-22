import React from 'react'
import Link from '@docusaurus/Link'

/** Copy matches the design; the CTA keeps the site's existing /contact route. */
const ENTERPRISE = {
  eyebrow: 'For Enterprises',
  title: 'Want to bring OLake to your enterprise?',
  body: 'While we are open source, we offer custom support for enterprises based on your GRC requirements. Leave your contact information and our team will get in touch.',
  cta: { label: 'Request a callback', href: '/contact' }
}

export default function EnterpriseCta() {
  return (
    <section className='px-[32px] pb-[56px] lg:px-[24px] lg:pb-[96px]'>
      <div className='mx-auto w-full max-w-[1016px] overflow-hidden rounded-[16px] border border-solid border-[#ececec] bg-white'>
        <div className='px-[24px] pt-[36px] text-left lg:px-[64px] lg:pt-[56px]'>
          <p className='text-[13px] text-[#8a8a8a] lg:text-[14px]'>{ENTERPRISE.eyebrow}</p>
          <h2 className='mt-[8px] max-w-[520px] text-[26px] font-normal leading-[1.15] tracking-[-0.01em] text-[#202020] lg:text-[40px]'>
            {ENTERPRISE.title}
          </h2>
          <p className='mt-[14px] max-w-[640px] text-[13px] leading-[1.6] text-[#5d5d5d] lg:text-[15px]'>
            {ENTERPRISE.body}
          </p>
          <Link
            to={ENTERPRISE.cta.href}
            className='mt-[22px] inline-flex h-[38px] items-center rounded-[8px] border border-solid border-[rgba(150,171,254,0.6)] bg-[#0029ce] px-[18px] text-[14px] text-[#e7e7e0] shadow-[0_2px_2px_0_rgba(0,0,0,0.14)] transition-all hover:bg-[#0021a3] hover:text-white lg:mt-[28px]'
          >
            {ENTERPRISE.cta.label}
          </Link>
        </div>
        <img
          src='/img/landing/lakeside/enterprise-dots.png'
          alt=''
          width={860}
          height={250}
          loading='lazy'
          decoding='async'
          className='mx-auto mt-[18px] block w-full max-w-[860px] lg:mt-[24px]'
        />
      </div>
    </section>
  )
}
