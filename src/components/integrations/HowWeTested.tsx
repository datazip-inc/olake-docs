import React from 'react'
import { useIntegration } from './useIntegration'
import { renderInline } from './inline'

/**
 * "How we tested this": the run behind the page, from front matter. Drafting with AI help is
 * stated plainly; what makes the page trustworthy is the named person who ran and checked it.
 */
export default function HowWeTested() {
  const { frontMatter, author, reviewer } = useIntegration()
  const t = frontMatter.tested
  if (!t) return null
  return (
    <aside
      className='olake-how-tested my-[24px] rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt p-[18px]'
      aria-label='How we tested this'
    >
      <p className='mb-[8px] text-[13px] font-medium uppercase tracking-[0.04em] text-olake-muted'>How we tested this</p>
      <ul className='mb-0 list-disc pl-[20px] text-[14px] leading-[1.6] text-olake-ink'>
        <li>
          Run on <strong>{t.date}</strong> with <strong>OLake Go {t.olake}</strong>.
        </li>
        <li>Read back with {t.engines.join(', ')}.</li>
        {t.summary ? <li>{renderInline(t.summary)}</li> : null}
        <li>
          Drafted with AI help. {author ? `${author.name} ran the pipeline and wrote the page` : 'The pipeline was run by the author'}
          {reviewer ? `; ${reviewer.name} checked every command, number and screenshot.` : '.'}
        </li>
      </ul>
    </aside>
  )
}
