import React, { type ReactNode } from 'react'
import { PiLightning } from 'react-icons/pi'

interface TLDRProps {
  /** The label. "TL;DR" by default; use "Key takeaways" or "The short answer" where it reads better. */
  title?: string
  /** Markdown: a few bullets, or one to three short paragraphs (or a lead paragraph then bullets). */
  children: ReactNode
}

/**
 * The summary at the top of a post. Use it once, right after the opening paragraph:
 *
 *   <TLDR>
 *   - **Point one** that stands on its own.
 *   - **Point two** that stands on its own.
 *   </TLDR>
 *
 * (leave a blank line after the opening tag and before the closing tag so MDX parses the content as
 * markdown). It is registered globally for MDX, so no import is needed.
 *
 * The label is a paragraph, not a heading, so it adds nothing to the table of contents and does not
 * disturb the heading outline; the content stays real list and paragraph markup in the HTML, which
 * is what search and answer engines read. Styles: `.olake-tldr*` in src/css/content-elements.css.
 */
export default function TLDR({ title = 'TL;DR', children }: TLDRProps) {
  return (
    <section className='olake-tldr' aria-label={title}>
      <p className='olake-tldr__label'>
        <PiLightning aria-hidden='true' size={14} />
        <span>{title}</span>
      </p>
      <div className='olake-tldr__body'>{children}</div>
    </section>
  )
}
