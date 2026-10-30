import React from 'react'
import JsonLd from '@site/src/components/JsonLd'
import { useIntegration } from './useIntegration'
import { plainText, renderInline } from './inline'

/**
 * FAQ items as native <details> (answers stay in the DOM) plus a FAQPage JSON-LD block built from
 * the same strings, so the structured data can never say something the page does not.
 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
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

/** The pair page FAQ, from the front matter `integration.faq` list. */
export default function IntegrationFaq() {
  const { frontMatter } = useIntegration()
  return <FaqList items={frontMatter.faq ?? []} />
}
