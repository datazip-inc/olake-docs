import React from 'react'
import Head from '@docusaurus/Head'

/**
 * For call sites that already sit inside a <Head> (a component cannot be nested in <Head>):
 *   <script type='application/ld+json'>{serializeJsonLd(schema)}</script>
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

type JsonLdProps = {
  /** One schema.org object, or an array of them. */
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

/**
 * Renders JSON-LD into <head>.
 *
 * `<Head><script dangerouslySetInnerHTML={...} /></Head>` silently renders nothing: Docusaurus's
 * <Head> (react-helmet-async) drops that prop, so the schema must be passed as a string child.
 * `<` is escaped so a "</script>" inside a value cannot close the tag early.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <Head>
      {items.map((item, index) => (
        <script key={index} type='application/ld+json'>
          {JSON.stringify(item).replace(/</g, '\\u003c')}
        </script>
      ))}
    </Head>
  )
}
