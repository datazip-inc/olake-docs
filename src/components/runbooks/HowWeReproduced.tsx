import React from 'react'
import { useRunbook } from './useRunbook'

const REPO = 'https://github.com/datazip-inc/olake-docs/tree/master/'

/**
 * "How we reproduced this": the lab behind the page, from front matter. The date, the exact
 * versions, what the run showed, and where to get the lab to run it again.
 */
export default function HowWeReproduced() {
  const { frontMatter, reviewer } = useRunbook()
  const r = frontMatter.reproduced
  if (!r) return null
  return (
    <aside
      className='olake-how-tested my-[24px] rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt p-[18px]'
      aria-label='How we reproduced this'
    >
      <p className='mb-[8px] text-[13px] font-medium uppercase tracking-[0.04em] text-olake-muted'>
        How we reproduced this
      </p>
      <ul className='mb-0 list-disc pl-[20px] text-[14px] leading-[1.6] text-olake-ink'>
        <li>
          Run on <strong>{r.date}</strong> with {r.versions.join(', ')}.
        </li>
        {r.summary ? <li>{r.summary}</li> : null}
        <li>
          The lab is in the docs repository at <a href={`${REPO}${r.lab}`}>{r.lab}</a>: one Docker Compose file, one
          script, and the logs this page quotes.
        </li>
        {reviewer ? <li>Reviewed by {reviewer.name}.</li> : null}
      </ul>
    </aside>
  )
}
