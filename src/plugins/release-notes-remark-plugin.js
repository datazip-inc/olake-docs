// @ts-check
/**
 * Release notes polish (docs/release/** only):
 *
 * 1. Strips the leading emoji from heading text ("## 🎯 What's New" renders as "What's New"), in
 *    the page and in the table of contents.
 * 2. Keeps every heading id exactly as it was. Docusaurus derives ids from the heading text, so
 *    removing the emoji would rename "-whats-new" to "whats-new" and break bookmarks. The plugin
 *    therefore computes each id from the ORIGINAL text with Docusaurus' own slugger, in document
 *    order, and sets it before the stock heading plugin runs (that plugin keeps an id that is
 *    already set). Headings with an explicit id ({/* #id *\/} or {#id}) are skipped, the stock
 *    plugin handles them and they do not use the slugger.
 * 3. Marks the date line right under the h1 (for example "July 12, 2026 to Aug 28, 2026") with the class
 *    `release-dates` so it can be styled.
 *
 * Register with `beforeDefaultRemarkPlugins` so it runs before the stock heading plugin.
 */
const { visit } = require('unist-util-visit')
const { toString } = require('mdast-util-to-string')
const { createSlugger } = require('@docusaurus/utils')

const RELEASE_PATH = /[\\/]docs[\\/]release[\\/]/
const LEADING_EMOJI = /^[\s\p{Extended_Pictographic}️‍]+/u
const DATE_LINE = /^[A-Za-z0-9 ,.\-\u2013\u2014]+$/
const HAS_YEAR = /\b20\d\d\b/

/** @param {any} heading */
function hasExplicitId(heading) {
  const last = heading.children.at(-1)
  if (!last) return false
  if (last.type === 'mdxTextExpression') return true
  if (last.type === 'html' && /^<!--/.test(last.value)) return true
  return last.type === 'text' && /\{#[^}]+\}\s*$/.test(last.value)
}

/** @param {any} heading */
function headingText(heading) {
  const nodes = heading.children.filter((/** @type {any} */ c) => !['html', 'jsx'].includes(c.type))
  return toString(nodes.length > 0 ? nodes : heading)
}

module.exports = function releaseNotesRemarkPlugin() {
  return (/** @type {any} */ root, /** @type {any} */ file) => {
    if (!RELEASE_PATH.test(file.path || '')) return

    const slugs = createSlugger()
    /** @type {any} */
    let h1 = null

    visit(root, 'heading', (/** @type {any} */ heading) => {
      if (heading.depth === 1 && !h1) h1 = heading
      if (hasExplicitId(heading)) return

      // Same id the stock plugin would produce, taken from the text as written.
      const id = slugs.slug(headingText(heading))
      const data = heading.data ?? (heading.data = {})
      const properties = data.hProperties ?? (data.hProperties = {})
      if (!properties.id) properties.id = id

      const first = heading.children[0]
      if (first && first.type === 'text' && LEADING_EMOJI.test(first.value)) {
        first.value = first.value.replace(LEADING_EMOJI, '')
      }
    })

    // The date line: the first paragraph right after the h1, short, plain text, with a year.
    if (h1) {
      const index = root.children.indexOf(h1)
      const next = root.children[index + 1]
      if (next && next.type === 'paragraph') {
        const text = toString(next).trim()
        if (text.length <= 80 && HAS_YEAR.test(text) && DATE_LINE.test(text)) {
          const data = next.data ?? (next.data = {})
          const properties = data.hProperties ?? (data.hProperties = {})
          properties.className = ['release-dates']
        }
      }
    }
  }
}
