import React, { type ReactNode } from 'react'
import Link from '@docusaurus/Link'

/**
 * Renders a plain string with two inline marks: `code` in backticks and [text](/route) links.
 * Used for FAQ answers and data-layer notes, which are kept as strings so the same text can go
 * into JSON-LD unchanged.
 */
export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(`[^`]+`)|(\[([^\]]+)\]\(([^)\s]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) {
      out.push(<code key={key++}>{m[1].slice(1, -1)}</code>)
    } else {
      out.push(
        <Link key={key++} to={m[4]}>
          {m[3]}
        </Link>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** The same string with the marks removed, for JSON-LD and meta text. */
export function plainText(text: string): string {
  return text.replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
}
