import React from 'react'
import CtaBanner from '../../ui/CtaBanner'

/** Copy matches the design; the CTA keeps the site's existing /contact route. */
const ENTERPRISE = {
  eyebrow: 'For Enterprises',
  title: 'Want to bring OLake to your enterprise?',
  body: 'While we are open source, we offer custom support for enterprises based on your GRC requirements. Leave your contact information and our team will get in touch.',
  cta: { label: 'Request a callback', href: '/contact/' }
}

export default function EnterpriseCta() {
  return (
    <CtaBanner
      eyebrow={ENTERPRISE.eyebrow}
      title={ENTERPRISE.title}
      body={ENTERPRISE.body}
      cta={ENTERPRISE.cta}
      image={{ src: '/img/landing/lakeside/enterprise-dots.png', width: 860, height: 250 }}
    />
  )
}
