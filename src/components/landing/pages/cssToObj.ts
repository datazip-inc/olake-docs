import type { CSSProperties } from 'react'

/**
 * Parses a raw CSS declaration string into a React style object.
 *
 * The designs build some styles as strings in their logic block (e.g.
 * `icebergStyle`), and JSX `style` needs an object — this converts at the
 * consumption point so the generated markup can stay a literal copy.
 */
export function cssToObj(css: string | CSSProperties | undefined | null): CSSProperties {
  if (!css) return {}
  if (typeof css !== 'string') return css

  const out: Record<string, string> = {}
  let depth = 0
  let quote: string | null = null
  let cur = ''
  const decls: string[] = []

  for (const ch of css) {
    if (quote) {
      cur += ch
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      cur += ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ';' && depth === 0) {
      if (cur.trim()) decls.push(cur.trim())
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur.trim()) decls.push(cur.trim())

  for (const d of decls) {
    const i = d.indexOf(':')
    if (i < 0) continue
    const name = d.slice(0, i).trim()
    const value = d.slice(i + 1).trim()
    if (!name) continue
    const key = name.startsWith('--') ? name : name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = value
  }
  return out as CSSProperties
}
