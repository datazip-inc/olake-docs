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
 * Input: the `image:` front-matter path of every post in blog/, customer-stories/, learn/ and compare/
 * (a local path under static/). Output: static/img/og/<cover path under static/img>.jpg, for example
 * /img/blog/2025/10/x.webp -> /img/og/blog/2025/10/x.jpg. The mapping is a pure function of the
 * cover path (ogPath below), so the page can compute the URL without a manifest.
 * Posts without a local raster cover use the site card (static/img/logo/olake-og-card.png).
 *
 * Freshness is decided by content, never by file times (mtimes mean nothing on a CI clone): the
 * SHA-256 of the source cover that a committed JPEG was rendered from is stored, and an output is
 * current when it exists and that hash equals the cover's hash now. A hash lives in its own file
 * under scripts/og-hashes/ (same path as the card, .sha256 instead of .jpg), so a post pull request
 * only adds files and two of them never edit the same one. The older shared manifest
 * scripts/og-images.manifest.json is read as a fallback for covers rendered before that change and
 * is no longer written.
 *
 * Usage (not part of `npm run build`; run it by hand after adding or changing a cover):
 *   npm run og-images                  render only the missing or stale images, write their hash files
 *   npm run og-images -- --force       re-render every image
 *   npm run og-images -- --check       write nothing; exit 1 if an image is missing or stale (CI)
 *   npm run og-images -- --adopt-existing
 *                                      write hash files for images that already exist without
 *                                      re-rendering them (one-off)
 * Generated files and hash files are committed so `npm start` works without running the script.
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const STATIC = path.join(ROOT, 'static')
const MANIFEST = path.join(__dirname, 'og-images.manifest.json')
const HASH_DIR = path.join(__dirname, 'og-hashes')
const CONTENT_DIRS = ['blog', 'customer-stories', 'learn', 'compare']
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

function listFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? listFiles(p) : /\.jpe?g$/i.test(e.name) ? [p] : []
  })
}

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return {}
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).covers || {}
  } catch (e) {
    console.warn(`og images: ${path.relative(ROOT, MANIFEST)} is not valid JSON, treating it as empty`)
    return {}
  }
}

/** '/img/blog/a/b.webp' -> scripts/og-hashes/blog/a/b.sha256 */
const hashFile = (cover) =>
  path.join(HASH_DIR, ogPath(cover).replace(/^\/img\/og\//, '').replace(/\.jpg$/, '.sha256'))

function readStoredHash(cover, legacy) {
  const file = hashFile(cover)
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : legacy[cover] || ''
}

function writeStoredHash(cover, hash) {
  const file = hashFile(cover)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, hash + '\n')
}

async function main() {
  const force = process.argv.includes('--force')
  const check = process.argv.includes('--check')
  const adopt = process.argv.includes('--adopt-existing')
  const covers = readCovers()
  const legacy = readManifest()
  let made = 0
  let adopted = 0
  let current = 0
  const problems = []

  for (const [cover, post] of covers) {
    const srcFile = path.join(STATIC, cover)
    const outFile = path.join(STATIC, ogPath(cover))
    if (!fs.existsSync(srcFile)) {
      problems.push(`${post}: cover ${cover} does not exist`)
      continue
    }
    const hash = sha256(srcFile)
    const exists = fs.existsSync(outFile)
    if (!force && exists && readStoredHash(cover, legacy) === hash) {
      current++
      continue
    }
    if (adopt && exists) {
      writeStoredHash(cover, hash)
      adopted++
      continue
    }
    if (check) {
      problems.push(
        `${post}: ${ogPath(cover)} is ${exists ? 'stale (cover content changed since it was rendered)' : 'missing'}; run npm run og-images`
      )
      continue
    }
    await render(srcFile, outFile)
    writeStoredHash(cover, hash)
    made++
  }

  // Images no post uses any more: reported, never deleted or failed on
  const wanted = new Set([...covers.keys()].map((c) => path.join(STATIC, ogPath(c))))
  const orphans = listFiles(path.join(STATIC, 'img', 'og')).filter((f) => !wanted.has(f))
  for (const f of orphans) {
    console.warn(`og images: unused ${path.relative(STATIC, f)} (no post cover maps to it)`)
  }

  console.log(
    `og images: ${covers.size} covers, ${made} written, ${adopted} adopted, ${current} up to date`
  )
  for (const p of problems) console.warn(`og images: ${p}`)
  if (check && problems.length) process.exit(1)
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}

module.exports = { readCovers, render, ogPath }
