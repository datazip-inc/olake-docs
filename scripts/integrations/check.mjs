#!/usr/bin/env node
/**
 * Checks the integration pages against the data layer. It never rewrites a page.
 *
 *   node scripts/integrations/check.mjs            # all pages
 *   node scripts/integrations/check.mjs --report   # which pages consume each shared block
 *
 * Needs Node 23.6 or later (it imports the TypeScript data files directly).
 *
 * What it verifies, per page under docs/integrations/*.mdx:
 *   1. an `integration:` block whose source, engine, catalogs, default, author and reviewer
 *      resolve in src/data/integrations, and that matches the pair in pairs.ts
 *   2. every catalog the page offers is one the engine can read, and the tested catalogs are a
 *      subset of the offered ones
 *   3. every `<I.Partial id="...">` exists in docs/shared/integrations/registry.ts
 *   4. the page's own words (outside component tags, code and front matter) outnumber the words
 *      it pulls in from partials, and no `TODO:` marker is left
 *   5. a `live` pair is not `unlisted`, a `draft` pair is, and every pair with a page is listed
 *   6. title and description are unique across docs and blog
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { register } from 'node:module'

// Node prints experimental-feature warnings for the TypeScript imports; they are noise here.
process.emitWarning = () => {}
register('./_hooks.mjs', import.meta.url)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PAGES_DIR = path.join(ROOT, 'docs', 'integrations')
const SHARED_DIR = path.join(ROOT, 'docs', 'shared', 'integrations')
const REPORT = process.argv.includes('--report')

const { SOURCES, ENGINES, CATALOGS, PAIRS, PEOPLE } = await import('../../src/data/integrations/index.ts')

const registrySource = fs.readFileSync(path.join(SHARED_DIR, 'registry.ts'), 'utf8')
const registry = new Map()
for (const m of registrySource.matchAll(/'([a-z0-9/-]+)':\s*(\w+)/g)) registry.set(m[1], m[2])
const registryFiles = new Map()
for (const m of registrySource.matchAll(/import\s+(\w+)\s+from\s+'\.\/([^']+)'/g)) registryFiles.set(m[1], m[2])

const errors = []
const warnings = []
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`)
const warn = (file, msg) => warnings.push(`${path.relative(ROOT, file)}: ${msg}`)

function parseFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { fm: null, body: raw }
  // Minimal YAML reader for the keys this script needs; the build validates the rest.
  const yaml = m[1]
  const get = (key) => {
    const r = new RegExp(`^${key}:\\s*(.*)$`, 'm').exec(yaml)
    return r ? r[1].trim().replace(/^"|"$/g, '') : undefined
  }
  const block = /^integration:\n([\s\S]*?)(?=^\S|\Z)/m.exec(yaml)?.[1] ?? ''
  const sub = (key) => {
    const r = new RegExp(`^  ${key}:\\s*(.*)$`, 'm').exec(block)
    return r ? r[1].trim() : undefined
  }
  const list = (v) => (v ? v.replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean) : [])
  const testedBlock = /^  tested:\n([\s\S]*?)(?=^  \S|\Z)/m.exec(block)?.[1] ?? ''
  const testedCatalogs = /^    catalogs:\s*(.*)$/m.exec(testedBlock)?.[1]
  const faqCount = (block.match(/^    - q:/gm) ?? []).length
  return {
    fm: {
      title: get('title'),
      description: get('description'),
      unlisted: get('unlisted') === 'true',
      integration: block
        ? {
            source: sub('source'),
            engine: sub('engine'),
            catalogs: list(sub('catalogs')),
            default: sub('default'),
            author: sub('author'),
            reviewer: sub('reviewer'),
            testedCatalogs: list(testedCatalogs),
            faqCount
          }
        : undefined
    },
    body: raw.slice(m[0].length)
  }
}

function countWords(text) {
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []).length
}

/** Words the page writes itself: strip code fences, JSX tags, import lines and front matter. */
function ownWords(body) {
  const noCode = body.replace(/```[\s\S]*?```/g, ' ')
  const noJsx = noCode.replace(/<[^>]+>/g, ' ').replace(/^import .*$/gm, ' ')
  return countWords(noJsx)
}

const partialWordCache = new Map()
function partialWords(id) {
  if (partialWordCache.has(id)) return partialWordCache.get(id)
  const file = registryFiles.get(registry.get(id))
  let words = 0
  if (file) {
    const raw = fs.readFileSync(path.join(SHARED_DIR, file), 'utf8')
    words = ownWords(raw)
  }
  partialWordCache.set(id, words)
  return words
}

const pages = fs.existsSync(PAGES_DIR) ? fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.mdx') && f !== 'index.mdx') : []
const seenTitles = new Map()
const seenDescriptions = new Map()
const usage = new Map()

// titles and descriptions elsewhere, for the uniqueness check
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!e.name.startsWith('.') && e.name !== 'node_modules') yield* walk(p)
    } else if (/\.mdx?$/.test(e.name)) yield p
  }
}
for (const dir of ['docs', 'blog', 'learn', 'compare']) {
  const d = path.join(ROOT, dir)
  if (!fs.existsSync(d)) continue
  for (const file of walk(d)) {
    if (file.startsWith(PAGES_DIR)) continue
    const { fm } = parseFrontMatter(fs.readFileSync(file, 'utf8'))
    if (!fm) continue
    if (fm.title) seenTitles.set(fm.title.toLowerCase(), file)
    if (fm.description) seenDescriptions.set(fm.description.toLowerCase(), file)
  }
}

const pagesBySlug = new Map()
for (const name of pages) {
  const file = path.join(PAGES_DIR, name)
  const slug = name.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(file, 'utf8')
  const { fm, body } = parseFrontMatter(raw)
  pagesBySlug.set(slug, file)
  if (!fm) {
    err(file, 'no front matter')
    continue
  }
  const it = fm.integration
  if (!it) {
    err(file, 'missing `integration:` block in front matter')
    continue
  }
  const source = SOURCES[it.source]
  const engine = ENGINES[it.engine]
  if (!source) err(file, `unknown source "${it.source}"`)
  if (!engine) err(file, `unknown engine "${it.engine}"`)
  if (!PEOPLE[it.author]) err(file, `unknown author "${it.author}" (add to src/data/integrations/people.ts)`)
  if (!PEOPLE[it.reviewer]) err(file, `unknown reviewer "${it.reviewer}" (add to src/data/integrations/people.ts)`)
  for (const c of it.catalogs) {
    if (!CATALOGS[c]) err(file, `unknown catalog "${c}"`)
    else if (engine && !engine.catalogs[c]) err(file, `${engine.label} has no entry for catalog "${c}" in engines.ts`)
    else if (engine && engine.catalogs[c].reads === 'no') err(file, `${engine.label} cannot read catalog "${c}" (engines.ts)`)
  }
  if (it.default && !it.catalogs.includes(it.default)) err(file, `default catalog "${it.default}" is not in catalogs`)
  for (const c of it.testedCatalogs) {
    if (!it.catalogs.includes(c)) err(file, `tested catalog "${c}" is not offered on the page`)
  }
  if (it.testedCatalogs.length === 0) err(file, 'no tested catalog: every page needs a real run behind it (integration.tested.catalogs)')
  if (it.faqCount < 4) warn(file, `only ${it.faqCount} FAQ entries (aim for 4 to 8)`)

  const pair = PAIRS.find((p) => p.slug === slug)
  if (!pair) err(file, 'no entry in src/data/integrations/pairs.ts for this slug')
  else {
    if (pair.source !== it.source || pair.engine !== it.engine) err(file, 'source/engine differ from pairs.ts')
    const offered = [...it.catalogs].sort().join(',')
    const expected = [...pair.catalogs].sort().join(',')
    if (offered !== expected) err(file, `catalogs [${offered}] differ from pairs.ts [${expected}]`)
    if (pair.status === 'live' && fm.unlisted) err(file, 'pair is live in pairs.ts but the page is unlisted')
    if (pair.status !== 'live' && !fm.unlisted) err(file, `pair is ${pair.status} in pairs.ts; the page must stay unlisted`)
  }

  // partials
  let pulled = 0
  for (const m of body.matchAll(/<I\.Partial\s+id=["']([^"']+)["']/g)) {
    const id = m[1]
    if (!registry.has(id)) err(file, `unknown partial id "${id}"`)
    else {
      pulled += partialWords(id)
      if (!usage.has(id)) usage.set(id, new Set())
      usage.get(id).add(slug)
    }
  }
  const own = ownWords(body)
  if (/\bTODO:/.test(body)) err(file, 'leftover TODO: marker')
  if (own < 1200) err(file, `only ${own} words of the page's own prose (minimum 1200)`)
  if (own <= pulled) err(file, `shared blocks (${pulled} words) outweigh the page's own prose (${own} words)`)
  if (!/```mermaid/.test(body)) warn(file, 'no mermaid diagram')
  if ((body.match(/<Figure\s/g) ?? []).length < 4) warn(file, 'fewer than 4 screenshots')
  for (const tag of ['IntegrationByline', 'HowWeTested', 'IntegrationFaq', 'IntegrationJsonLd', 'RelatedIntegrations']) {
    if (!body.includes(`<I.${tag}`)) err(file, `missing <I.${tag} />`)
  }

  // uniqueness
  if (fm.title) {
    const k = fm.title.toLowerCase()
    if (seenTitles.has(k)) err(file, `title duplicates ${path.relative(ROOT, seenTitles.get(k))}`)
    seenTitles.set(k, file)
  } else err(file, 'missing title')
  if (fm.description) {
    const k = fm.description.toLowerCase()
    if (seenDescriptions.has(k)) err(file, `description duplicates ${path.relative(ROOT, seenDescriptions.get(k))}`)
    if (fm.description.length < 120 || fm.description.length > 160) warn(file, `description is ${fm.description.length} characters (aim 120 to 160)`)
    seenDescriptions.set(k, file)
  } else err(file, 'missing description')
  if (fm.title && fm.title.length > 52) warn(file, `title is ${fm.title.length} characters; over 52 it exceeds 60 with the site suffix`)

  if (!REPORT) console.log(`${name}: own ${own} words, shared ${pulled} words, ${it.catalogs.length} catalogs, tested ${it.testedCatalogs.join(',') || 'none'}`)
}

// pairs without a page
for (const p of PAIRS) {
  if (p.status !== 'planned' && !pagesBySlug.has(p.slug)) {
    errors.push(`pairs.ts: ${p.slug} is ${p.status} but docs/integrations/${p.slug}.mdx does not exist`)
  }
}

if (REPORT) {
  console.log('Shared block usage (edit the block, then re-read these pages):')
  for (const [id, slugs] of [...usage.entries()].sort()) console.log(`  ${id}: ${[...slugs].sort().join(', ')}`)
}

for (const w of warnings) console.log(`warn  ${w}`)
for (const e of errors) console.log(`error ${e}`)
console.log(`${pages.length} page(s), ${errors.length} error(s), ${warnings.length} warning(s)`)
process.exit(errors.length ? 1 : 0)
