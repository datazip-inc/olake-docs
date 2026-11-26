// Turns one built page of the site into sections of plain, Markdown-like text.
//
// The index is built from the site's own build output (the `build` folder), not from the MDX
// sources: shared snippets, tabs and components are only expanded at build time, so the built
// page is what a reader actually sees.
//
// The pages are minified HTML (unquoted attributes, omitted closing tags), which only a parser
// that follows the HTML standard reads correctly. parse5 is one.

import { parse, type DefaultTreeAdapterMap } from 'parse5'

type Node = DefaultTreeAdapterMap['node']
type Element = DefaultTreeAdapterMap['element']

export type Section = {
  /** Canonical URL of the page. */
  pageUrl: string
  /** `pageUrl`, or `pageUrl#anchor` for the section under an h2 or h3. */
  url: string
  /** The h1, after the breadcrumb trail on a docs page: "Sources / Postgres: Overview". */
  pageTitle: string
  /** "Prerequisites", or "Setup > Config file" for an h3 under an h2. Empty for the page intro. */
  heading: string
  text: string
}

const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b)
// The page title (h1) is kept apart from the text, the rest is page furniture.
const NOT_CONTENT = new Set([
  'h1',
  'script',
  'style',
  'svg',
  'button',
  'nav',
  'img',
  'header',
  'footer',
  'noscript',
  'iframe',
  'video'
])
const BLOCKS = new Set([
  'p',
  'div',
  'section',
  'blockquote',
  'details',
  'summary',
  'figure',
  'dl',
  'dt',
  'dd'
])

const isElement = (node: Node): node is Element => 'tagName' in node
const attr = (el: Element, name: string) => el.attrs.find((a) => a.name === name)?.value ?? ''
const hasClass = (el: Element, name: string) => attr(el, 'class').split(/\s+/).includes(name)
const rawText = (node: Node): string =>
  node.nodeName === '#text'
    ? (node as DefaultTreeAdapterMap['textNode']).value
    : 'childNodes' in node
      ? node.childNodes.map(rawText).join('')
      : ''

/** The elements under `node` that pass the test, in page order. It does not look inside a match. */
function find(node: Node, test: (el: Element) => boolean): Element[] {
  if (!('childNodes' in node)) return []
  return node.childNodes.flatMap((child) =>
    isElement(child) ? (test(child) ? [child] : find(child, test)) : []
  )
}

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()

/** Removes stray spaces and extra blank lines. Code blocks are not in the text at this point. */
const tidy = (text: string) =>
  text
    .replaceAll(ZERO_WIDTH_SPACE, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export function parsePage(html: string): Section[] {
  const root = parse(html)
  const first = (test: (el: Element) => boolean): Element | undefined => find(root, test)[0]
  const canonical = first((el) => el.tagName === 'link' && attr(el, 'rel') === 'canonical')
  const robots = first((el) => el.tagName === 'meta' && attr(el, 'name') === 'robots')
  // Docs pages and blog-style posts (blog, compare, learn, customer stories) keep their content here.
  const content = first(
    (el) => hasClass(el, 'theme-doc-markdown') || attr(el, 'id') === '__blog-post-container'
  )
  if (!canonical || !content || /noindex/i.test(robots ? attr(robots, 'content') : '')) return []
  const pageUrl = attr(canonical, 'href')

  const trail = find(root, (el) => hasClass(el, 'breadcrumbs__item'))
    .map((el) => oneLine(rawText(el)))
    .filter(Boolean)
  // A page without an h1 is named by its <title>, which ends in the site name.
  const named = first((el) => el.tagName === 'h1') ?? first((el) => el.tagName === 'title')
  const h1 = oneLine(named ? rawText(named) : '').replace(/ \| OLake$/, '')
  // The last breadcrumb is the short name of the page in the sidebar. An h1 that only extends it
  // ("Postgres to ClickHouse: CDC via Apache Iceberg") takes its place, another h1 follows it.
  const last = trail.pop() ?? ''
  const name = h1.toLowerCase().startsWith(last.toLowerCase()) ? h1 : `${last}: ${h1}`
  const pageTitle = [...trail, name].join(' / ')

  // Headings and code blocks are lifted out of the text while it is built and tidied, and
  // referenced by a marker (the parser never lets a NUL character through). Headings then become
  // the section breaks, and code is put back untouched. The indent of a list item is a marker
  // too, because tidying removes the spaces at the start of a line.
  const headings: Array<{ level: number; id: string; text: string }> = []
  const codeBlocks: string[] = []

  const children = (el: Element) => el.childNodes.map(render).join('')

  function render(node: Node): string {
    if (node.nodeName === '#text') return rawText(node).replace(/\s+/g, ' ')
    if (!isElement(node)) return ''
    const el = node
    const tag = el.tagName
    if (NOT_CONTENT.has(tag) || hasClass(el, 'hash-link')) return ''
    // The language label above a code block (the fence carries it), and call-to-action cards.
    if (hasClass(el, 'olake-code__lang') || (tag === 'aside' && hasClass(el, 'not-prose')))
      return ''

    if (tag === 'h2' || tag === 'h3') {
      headings.push({ level: Number(tag[1]), id: attr(el, 'id'), text: oneLine(children(el)) })
      return `\n\n\0H${headings.length - 1}\0\n\n`
    }
    if (/^h[4-6]$/.test(tag)) return `\n\n**${oneLine(children(el))}**\n\n`
    if (tag === 'pre') {
      const lines = find(el, (e) => hasClass(e, 'token-line')).map(rawText)
      const language = /language-([\w-]+)/.exec(attr(el, 'class'))?.[1] ?? ''
      const code = (lines.length ? lines.join('\n') : rawText(el)).replace(/\s+$/, '')
      codeBlocks.push(`\`\`\`${language}\n${code}\n\`\`\``)
      return `\n\n\0C${codeBlocks.length - 1}\0\n\n`
    }
    if (tag === 'code') return `\`${rawText(el)}\``
    if (tag === 'strong' || tag === 'b') {
      const inner = children(el).trim()
      return inner ? `**${inner}**` : ''
    }
    if (tag === 'br') return '\n'
    if (tag === 'ul' || tag === 'ol') {
      const items = el.childNodes.filter(
        (child): child is Element => isElement(child) && child.tagName === 'li'
      )
      // Whatever a list item holds (paragraphs, a nested list) is indented under its bullet.
      return `\n\n${items.map((li) => `- ${tidy(children(li)).replace(/\n+/g, '\n\0>')}`).join('\n')}\n\n`
    }
    if (tag === 'table') {
      const rows = find(el, (e) => e.tagName === 'tr').map((tr) =>
        find(tr, (e) => e.tagName === 'th' || e.tagName === 'td').map((cell) =>
          // A table row is one line, so a code block in a cell becomes inline code.
          oneLine(children(cell))
            .replace(
              /\0C(\d+)\0/g,
              (_, n) => `\`${oneLine(codeBlocks[Number(n)].split('\n').slice(1, -1).join(' '))}\``
            )
            .replace(/\|/g, '\\|')
        )
      )
      if (!rows.length) return ''
      const lines = rows.map((cells) => `| ${cells.join(' | ')} |`)
      lines.splice(1, 0, `|${' --- |'.repeat(rows[0].length)}`)
      return `\n\n${lines.join('\n')}\n\n`
    }
    if (hasClass(el, 'tabs-container')) {
      // `find` stops at each panel, so the tabs of a tab group nested in a panel stay with that group.
      const parts = find(el, (e) => ['tab', 'tabpanel'].includes(attr(e, 'role')))
      const labels = parts
        .filter((e) => attr(e, 'role') === 'tab')
        .map((tab) => oneLine(rawText(tab)))
      const panels = parts.filter((e) => attr(e, 'role') === 'tabpanel').map(children)
      return `${panels.map((panel, i) => (panel.trim() ? `\n\n**${labels[i] ?? `Tab ${i + 1}`}:**\n\n${panel}` : '')).join('')}\n\n`
    }
    if (hasClass(el, 'theme-admonition')) {
      const heading = find(el, (e) => attr(e, 'class').includes('admonitionHeading'))[0]
      const body = find(el, (e) => attr(e, 'class').includes('admonitionContent'))[0]
      const label = heading ? oneLine(children(heading)) : 'Note'
      return `\n\n**${label.charAt(0).toUpperCase()}${label.slice(1)}:** ${tidy(children(body ?? el))}\n\n`
    }
    return BLOCKS.has(tag) ? `\n\n${children(el)}\n\n` : children(el)
  }

  const parts = children(content).split(/\0H(\d+)\0/)
  const sections: Section[] = []
  let h2 = ''
  let heading = ''
  let anchor = ''
  for (let i = 0; i < parts.length; i += 2) {
    if (i > 0) {
      const { level, id, text } = headings[Number(parts[i - 1])]
      if (level === 2) h2 = text
      heading = level === 2 || !h2 ? text : `${h2} > ${text}`
      anchor = id
    }
    // A code block in a list item is indented under its bullet, like the rest of the item.
    const text = tidy(parts[i])
      .replaceAll('\0>', '  ')
      .replace(/(^ *(?:- )?)?\0C(\d+)\0/gm, (_, lead = '', n) =>
        (lead + codeBlocks[Number(n)]).replaceAll('\n', `\n${' '.repeat(lead.length)}`)
      )
    if (text)
      sections.push({
        pageUrl,
        url: anchor ? `${pageUrl}#${anchor}` : pageUrl,
        pageTitle,
        heading,
        text
      })
  }
  return sections
}
