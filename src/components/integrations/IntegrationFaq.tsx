import React from 'react'
import JsonLd from '@site/src/components/JsonLd'
import { useIntegration } from './useIntegration'
import { plainText, renderInline } from './inline'

/**
 * The page FAQ: native <details> items (answers stay in the DOM) plus a FAQPage JSON-LD block
 * built from the same strings, so the structured data can never say something the page does not.
 * Questions and answers live in the front matter `integration.faq` list.
 */
export default function IntegrationFaq() {
  const { frontMatter } = useIntegration()
  const items = frontMatter.faq ?? []
  if (!items.length) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: plainText(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) }
    }))
  }
  return (
    <>
      <JsonLd data={schema} />
      <div className='olake-faq'>
        {items.map((f, i) => (
          <details key={i} className='alert olake-faq__item'>
            <summary>
              <span className='olake-faq__question'>{f.q}</span>
            </summary>
            <div className='olake-faq__answer'>
              <p>{renderInline(f.a)}</p>
            </div>
          </details>
        ))}
      </div>
    </>
  )
}
