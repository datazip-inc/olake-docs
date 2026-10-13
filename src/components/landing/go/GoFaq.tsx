import React from 'react'
import ProductFaq from '../product/ProductFaq'
import { GO_FAQS, GO_FAQ_EYEBROW, GO_FAQ_TITLE } from '@site/src/data/landing/go/faq'

/** The OLake Go FAQ. Its questions are mirrored word for word by the FAQPage JSON-LD in seo.ts. */
export default function GoFaq() {
  return (
    <ProductFaq idPrefix='go-faq' eyebrow={GO_FAQ_EYEBROW} title={GO_FAQ_TITLE} faqs={GO_FAQS} />
  )
}
