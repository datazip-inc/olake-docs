// @ts-check
/**
 * Marks the cover/intro image of a post as the priority image.
 *
 * Measured with the Largest Contentful Paint API: on blog, Iceberg and customer-story posts the
 * LCP element is the cover image at the top of the post, and it was rendered `loading="lazy"`
 * (the theme's default for every content image), which delays it. This plugin gives the FIRST
 * image of a document `loading="eager"` and `fetchPriority="high"` when it appears before the
 * first H2, so it is a cover or intro image, not a diagram further down.
 *
 * Use it only on the blog instances. On docs the LCP is text, so there it would only compete
 * with the real LCP for bandwidth.
 *
 * Works on the MDX 3 tree: images arrive as `mdxJsxTextElement` / `mdxJsxFlowElement` nodes named
 * `img` (Docusaurus and image-dimensions-remark-plugin turn markdown images into those), and as
 * plain hast `img` elements for any other source.
 */
const { visit } = require('unist-util-visit')

function imageFetchPriorityRehypePluginFactory() {
  return (tree) => {
    let passedFirstSection = false
    let done = false

    visit(tree, (node) => {
      if (done) return
      if (node.type === 'element' && node['tagName'] === 'h2') {
        passedFirstSection = true
        return
      }

      const isHastImg = node.type === 'element' && node['tagName'] === 'img'
      const isJsxImg =
        (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') && node['name'] === 'img'
      if (!isHastImg && !isJsxImg) return

      done = true // only the first image is ever a candidate
      if (passedFirstSection) return

      if (isHastImg) {
        node['properties'] = { ...node['properties'], loading: 'eager', fetchPriority: 'high' }
        return
      }
      const attributes = (node['attributes'] || []).filter(
        (a) => !(a.type === 'mdxJsxAttribute' && (a.name === 'loading' || a.name === 'fetchPriority'))
      )
      attributes.push(
        { type: 'mdxJsxAttribute', name: 'loading', value: 'eager' },
        { type: 'mdxJsxAttribute', name: 'fetchPriority', value: 'high' }
      )
      node['attributes'] = attributes
    })
  }
}

module.exports = imageFetchPriorityRehypePluginFactory
