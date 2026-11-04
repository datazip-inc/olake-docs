// @ts-check
/**
 * Adds the real width and height to local content images at build time.
 *
 * Markdown images (`![alt](/img/x.webp)`) and raw `<img src="/img/x.webp">` in MDX had no
 * dimensions, so the browser could not reserve space for them and the page jumped as each image
 * loaded (layout shift). The dimensions are read from the files under static/. Together with
 * `height: auto` (src/css/custom.css) the image keeps its responsive behaviour and only gains a
 * reserved aspect ratio.
 *
 * A `<Figure src="/...">` gets `imgWidth`/`imgHeight` the same way.
 *
 * Only absolute site paths that resolve to a file in static/ are touched. Relative paths (handled
 * by webpack/ideal-image) and external URLs are left alone, as are images that already have an
 * explicit width or height.
 *
 * Runs BEFORE Docusaurus's own image plugin (use `beforeDefaultRemarkPlugins`), because that plugin
 * replaces markdown image nodes and would drop attributes added later.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { visit } = require('unist-util-visit')

const STATIC_DIR = path.join(__dirname, '../../static')
const IMAGE_EXT = /\.(webp|png|jpe?g|gif|avif|svg)$/i
/** @type {Map<string, Promise<{width: number, height: number} | null>>} */
const cache = new Map()

function readDimensions(url) {
  const clean = decodeURI(url.split('#')[0].split('?')[0])
  if (!clean.startsWith('/') || clean.startsWith('//') || !IMAGE_EXT.test(clean)) return Promise.resolve(null)
  const file = path.join(STATIC_DIR, clean)
  if (!file.startsWith(STATIC_DIR) || !fs.existsSync(file)) return Promise.resolve(null)
  if (!cache.has(file)) {
    cache.set(
      file,
      sharp(file)
        .metadata()
        .then((m) => {
          // animated images report the full strip height; pageHeight is one frame
          const height = m.pageHeight || m.height
          return m.width && height ? { width: m.width, height } : null
        })
        .catch(() => null)
    )
  }
  return cache.get(file)
}

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value: String(value) })
const hasAttr = (node, name) => (node.attributes || []).some((a) => a.type === 'mdxJsxAttribute' && a.name === name)
const getAttr = (node, name) => (node.attributes || []).find((a) => a.type === 'mdxJsxAttribute' && a.name === name)

function imageDimensionsRemarkPlugin() {
  return async (tree) => {
    /** @type {Array<() => Promise<void>>} */
    const jobs = []

    visit(tree, (node, index, parent) => {
      // 1. Markdown image: becomes an <img> JSX node carrying width and height.
      if (node.type === 'image' && typeof node.url === 'string' && parent && typeof index === 'number') {
        jobs.push(async () => {
          const dim = await readDimensions(node.url)
          if (!dim) return
          const attributes = [attr('src', node.url)]
          if (node.alt != null) attributes.push(attr('alt', node.alt))
          if (node.title) attributes.push(attr('title', node.title))
          attributes.push(attr('width', dim.width), attr('height', dim.height))
          parent.children[parent.children.indexOf(node)] = {
            type: 'mdxJsxTextElement',
            name: 'img',
            attributes,
            children: []
          }
        })
      }
      // 2. Raw <img src="/..."> in MDX: add the missing dimensions.
      if (
        (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') &&
        node.name === 'img' &&
        !hasAttr(node, 'width') &&
        !hasAttr(node, 'height')
      ) {
        const src = getAttr(node, 'src')
        if (src && typeof src.value === 'string') {
          jobs.push(async () => {
            const dim = await readDimensions(src.value)
            if (!dim) return
            node.attributes.push(attr('width', dim.width), attr('height', dim.height))
          })
        }
      }
      // 3. <Figure src="/..."> (src/components/Figure.tsx): its own `width` prop is a display cap, so the
      // file's real size goes in imgWidth/imgHeight, which Figure puts on its <img>.
      if (
        (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') &&
        node.name === 'Figure' &&
        !hasAttr(node, 'imgWidth')
      ) {
        const src = getAttr(node, 'src')
        if (src && typeof src.value === 'string') {
          jobs.push(async () => {
            const dim = await readDimensions(src.value)
            if (!dim) return
            node.attributes.push(attr('imgWidth', dim.width), attr('imgHeight', dim.height))
          })
        }
      }
    })

    await Promise.all(jobs.map((job) => job()))
  }
}

module.exports = imageDimensionsRemarkPlugin
