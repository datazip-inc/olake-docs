#!/usr/bin/env node

/**
 * Generates a 1200x630 Open Graph image for every blog post cover.
 *
 * Posts carry covers of many shapes (about 50 different aspect ratios, from 1.34 to 2.53). Social
 * networks crop anything that is not 1.91:1 and read og:image dimensions to pick the card size, so
 * the post page (src/theme/BlogPostPage) points og:image and twitter:image at a 1200x630 JPEG made
 * here instead of at the raw cover.
 *
 *  - cover within 5% of 1.91:1  -> scaled and centre-cropped to 1200x630
 *  - any other shape            -> the whole cover is scaled to fit inside 1200x630 (nothing is cut
 *                                  off, so diagrams and text stay readable); the bars are the cover's
 *                                  own edge colour (plain covers) or a blurred copy of it (busy ones)
 *
 * Input: the `image:` front-matter path of every post in blog/, iceberg/ and customer-stories/
 * (a local path under static/). Output: static/img/og/<cover path under static/img>.jpg, for example
 * /img/blog/2025/10/x.webp -> /img/og/blog/2025/10/x.jpg. The mapping is a pure function of the
 * cover path (ogPath below), so the page can compute the URL without a manifest.
 * Posts without a local raster cover use the site card (static/img/logo/olake-og-card.png).
 *
 * Usage: node scripts/generate-og-images.js [--force] [--check]
 *   (default) create missing or outdated images; --force rebuilds all; --check writes nothing and
 *   exits 1 if an image is missing or outdated.
 * Wired into `npm run build` before docusaurus build. Generated files are committed so `npm start`
 * works without running the script.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const STATIC = path.join(ROOT, 'static')
const CONTENT_DIRS = ['blog', 'iceberg', 'customer-stories']
const W = 1200
const H = 630
const TARGET_RATIO = W / H
const RATIO_TOLERANCE = 0.05
const RASTER = /\.(webp|png|jpe?g|avif)$/i

/** '/img/blog/a/b.webp' -> '/img/og/blog/a/b.jpg'. Keep in sync with src/theme/BlogPostPage. */
const ogPath = (cover) => cover.replace(/^\/img\//, '/img/og/').replace(/\.[^./]+$/, '.jpg')

function readCovers() {
  const covers = new Map() // cover path -> first post that uses it
  for (const dir of CONTENT_DIRS) {
    const abs = path.join(ROOT, dir)
    if (!fs.existsSync(abs)) continue
    for (const file of fs.readdirSync(abs)) {
      if (!/\.mdx?$/.test(file)) continue
      const text = fs.readFileSync(path.join(abs, file), 'utf8')
      const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
      if (!m) continue
      let fm
      try {
        fm = yaml.load(m[1])
      } catch (e) {
        continue
      }
      const image = fm && typeof fm.image === 'string' ? fm.image : ''
      if (image.startsWith('/img/') && RASTER.test(image) && !covers.has(image)) {
        covers.set(image, `${dir}/${file}`)
      }
    }
  }
  return covers
}

async function render(srcFile, outFile) {
  const meta = await sharp(srcFile).metadata()
  // Flatten transparency onto white first: JPEG has no alpha
  const flat = () => sharp(srcFile).flatten({ background: '#ffffff' })
  let pipeline
  if (Math.abs(meta.width / meta.height / TARGET_RATIO - 1) <= RATIO_TOLERANCE) {
    pipeline = flat().resize(W, H, { fit: 'cover', position: 'centre' })
  } else {
    const foreground = await flat()
      .resize(W, H, { fit: 'inside', withoutEnlargement: false })
      .toBuffer({ resolveWithObject: true })
    const { width: fw, height: fh } = foreground.info
    const left = Math.floor((W - fw) / 2)
    const top = Math.floor((H - fh) / 2)
    // Look at the edges that will touch the bars: a plain edge (white or solid-colour covers) is
    // continued as is, a busy one gets a blurred copy of the cover behind it
    const edge =
      fw < W
        ? { left: 0, top: 0, width: 4, height: fh }
        : { left: 0, top: 0, width: fw, height: 4 }
    const stats = await sharp(foreground.data).extract(edge).stats()
    const spread = stats.channels.slice(0, 3).reduce((n, c) => n + c.stdev, 0) / 3
    if (spread < 12) {
      pipeline = sharp(foreground.data).extend({
        top,
        bottom: H - fh - top,
        left,
        right: W - fw - left,
        extendWith: 'copy'
      })
    } else {
      const background = await flat()
        .resize(W, H, { fit: 'cover', position: 'centre' })
        .blur(40)
        .toBuffer()
      pipeline = sharp(background).composite([{ input: foreground.data, left, top }])
    }
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  await pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(outFile)
}

async function main() {
  const force = process.argv.includes('--force')
  const check = process.argv.includes('--check')
  const covers = readCovers()
  let made = 0
  let current = 0
  const problems = []

  for (const [cover, post] of covers) {
    const srcFile = path.join(STATIC, cover)
    const outFile = path.join(STATIC, ogPath(cover))
    if (!fs.existsSync(srcFile)) {
      problems.push(`${post}: cover ${cover} does not exist`)
      continue
    }
    const fresh =
      !force && fs.existsSync(outFile) && fs.statSync(outFile).mtimeMs >= fs.statSync(srcFile).mtimeMs
    if (fresh) {
      current++
      continue
    }
    if (check) {
      problems.push(`${post}: ${ogPath(cover)} is missing or older than ${cover}`)
      continue
    }
    await render(srcFile, outFile)
    made++
  }

  console.log(`og images: ${covers.size} covers, ${made} written, ${current} up to date`)
  for (const p of problems) console.warn(`og images: ${p}`)
  if (check && problems.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
