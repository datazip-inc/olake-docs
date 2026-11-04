#!/usr/bin/env node

/**
 * Generates build/image-sitemap.xml from the BUILT site.
 *
 * For every page listed in build/sitemap.xml it reads the page's HTML and collects the images that
 * page actually shows (<img src> plus og:image), so each <url> is a real page URL with its own
 * images. Images that appear on most pages (logo, nav and footer art) are skipped, and so are
 * data: URIs and images hosted on other sites. Pages that are noindex or client-redirect stubs are
 * skipped.
 *
 * Google only reads <image:loc> (image:title and image:caption were dropped in 2022), so that is
 * all that is written. A page can list at most 1000 images.
 *
 * Usage: node scripts/generate-image-sitemap.js [buildDir]   (default: ./build)
 * Run after `docusaurus build`; robots.txt points crawlers at /image-sitemap.xml.
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://olake.io'
const MAX_IMAGES_PER_PAGE = 1000
// An image shown on more than this share of pages is site chrome, not page content
const CHROME_SHARE = 0.3

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")

/** Reads <loc>/<lastmod> pairs from build/sitemap.xml. */
function readPages(buildDir) {
  const xml = fs.readFileSync(path.join(buildDir, 'sitemap.xml'), 'utf8')
  const pages = []
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)
    if (!loc) continue
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)
    pages.push({ url: decodeEntities(loc[1]), lastmod: lastmod ? lastmod[1] : null })
  }
  return pages
}

/** Maps a page URL to its built index.html, or null if it is not a built page. */
function htmlPathFor(buildDir, pageUrl) {
  if (!pageUrl.startsWith(SITE_URL)) return null
  const pathname = decodeURIComponent(new URL(pageUrl).pathname)
  const file = path.join(buildDir, pathname, pathname.endsWith('.html') ? '' : 'index.html')
  return fs.existsSync(file) ? file : null
}

/** Absolute, percent-encoded URLs of the images in one HTML document (same site only). */
function extractImages(html) {
  const found = new Set()
  const add = (raw) => {
    if (!raw) return
    const src = decodeEntities(raw.trim())
    if (!src || src.startsWith('data:')) return
    let url
    try {
      url = new URL(src, SITE_URL + '/')
    } catch {
      return
    }
    if (url.origin !== SITE_URL) return
    if (!/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url.pathname)) return
    found.add(url.href) // URL#href percent-encodes spaces and other unsafe characters
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const m = /\ssrc=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag)
    if (m) add(m[1] ?? m[2] ?? m[3])
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (!/\bproperty=(?:"og:image"|'og:image'|og:image)(?=[\s/>])/i.test(tag)) continue
    const m = /\scontent=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag)
    if (m) add(m[1] ?? m[2] ?? m[3])
  }
  return [...found]
}

function generateImageSitemap(buildDir = path.join(__dirname, '../build')) {
  const pages = readPages(buildDir)

  const perPage = []
  const pageCountByImage = new Map()
  for (const page of pages) {
    const file = htmlPathFor(buildDir, page.url)
    if (!file) continue
    const html = fs.readFileSync(file, 'utf8')
    // Defensive: a noindex page or a client-redirect stub must not be advertised, even if it slipped
    // into sitemap.xml
    if (/<meta\b[^>]*name=["']?robots["']?[^>]*noindex/i.test(html) || /http-equiv=["']?refresh/i.test(html)) continue
    const images = extractImages(html)
    perPage.push({ ...page, images })
    for (const img of images) pageCountByImage.set(img, (pageCountByImage.get(img) || 0) + 1)
  }

  const chromeLimit = Math.max(3, Math.floor(perPage.length * CHROME_SHARE))
  const isChrome = (img) => pageCountByImage.get(img) > chromeLimit

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

  let pagesWithImages = 0
  let imageCount = 0
  for (const page of perPage) {
    let images = page.images.filter((img) => !isChrome(img))
    if (images.length === 0) continue
    if (images.length > MAX_IMAGES_PER_PAGE) {
      console.warn(`image-sitemap: ${page.url} has ${images.length} images, keeping ${MAX_IMAGES_PER_PAGE}`)
      images = images.slice(0, MAX_IMAGES_PER_PAGE)
    }
    pagesWithImages++
    imageCount += images.length
    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(page.url)}</loc>\n`
    if (page.lastmod) xml += `    <lastmod>${escapeXml(page.lastmod)}</lastmod>\n`
    for (const img of images) {
      xml += `    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n    </image:image>\n`
    }
    xml += '  </url>\n'
  }
  xml += '</urlset>\n'

  const out = path.join(buildDir, 'image-sitemap.xml')
  fs.writeFileSync(out, xml, 'utf8')
  console.log(
    `image-sitemap: ${imageCount} images on ${pagesWithImages} of ${perPage.length} pages ` +
      `(skipped ${[...pageCountByImage.keys()].filter(isChrome).length} site-wide images) -> ${out}`
  )
}

if (require.main === module) {
  try {
    generateImageSitemap(process.argv[2] ? path.resolve(process.argv[2]) : undefined)
  } catch (error) {
    console.error('Error generating image sitemap:', error)
    process.exit(1)
  }
}

module.exports = generateImageSitemap
