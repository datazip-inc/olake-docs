import React from 'react'
import ProductFaq from '../product/ProductFaq'
import { FAQS, FAQ_EYEBROW, FAQ_TITLE } from '@site/src/data/landing/fusion/faqs'

/** The OLake Fusion FAQ. Its questions are mirrored word for word by the FAQPage JSON-LD in seo.ts. */
export default function FusionFaq() {
  return <ProductFaq idPrefix='fusion-faq' eyebrow={FAQ_EYEBROW} title={FAQ_TITLE} faqs={FAQS} />
}
