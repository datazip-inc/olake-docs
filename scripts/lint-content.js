#!/usr/bin/env node

/**
 * Content lint for blog posts, docs and customer stories.
 *
 *   npm run lint:content              errors fail (exit 1), warnings are listed
 *   npm run lint:content -- --strict  warnings fail too
 *   npm run lint:content -- --quiet   only print the summary and errors
 *   npm run lint:content -- docs/install blog/2026-10-01-foo.mdx   limit to paths
 *
 * Why it exists: with strict MDX (future.v4) old syntax does not always fail the build, it can
 * render as plain text instead, so those patterns are errors here. Broken links, anchors and
 * undefined tags already fail the CI build (see ON_CONTENT_ERROR in docusaurus.config.js).
 *
 * ERROR = fix before merging. WARN = existing debt or style; fix when you touch the file.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const ROOT = path.join(__dirname, '..')
const args = process.argv.slice(2)
const STRICT = args.includes('--strict')
const QUIET = args.includes('--quiet')
const onlyPaths = args.filter((a) => !a.startsWith('--'))

const POST_DIRS = ['blog', 'customer-stories', 'learn']
// Author and tag definitions per post folder: learn shares the blog's files (see docusaurus.config.js)
const AUTHOR_FILES = { learn: 'blog/authors.yml' }
const TAG_FILES = { learn: 'blog/tags.yml' }
const DOC_DIRS = ['docs']
const TITLE_MAX = 70
const DESC_MIN = 120
const DESC_MAX = 160
const TAGS_MAX = 8
// Category tags (blog filter: src/components/blog/categories.js) are not counted against TAGS_MAX
const CATEGORY_TAGS = new Set(['how-to', 'benchmarks', 'product-updates', 'thought-leadership', 'alternatives'])

const findings = [] // { level, file, line, rule, msg }
const add = (level, file, line, rule, msg) =>
  findings.push({ level, file: path.relative(ROOT, file), line, rule, msg })

const readYaml = (p) => (fs.existsSync(p) ? yaml.load(fs.readFileSync(p, 'utf8')) || {} : {})

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      walk(p, out)
    } else if (/\.mdx?$/.test(e.name)) out.push(p)
  }
  return out
}

/** Splits a file into frontmatter object, and body lines with their real line numbers. */
function parse(file) {
  const raw = fs.readFileSync(file, 'utf8')
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  let fm = null
  let fmError = null
  let bodyStart = 0
  if (m) {
    try {
      fm = yaml.load(m[1]) || {}
    } catch (e) {
      fmError = e.message.split('\n')[0]
    }
    bodyStart = raw.slice(0, m[0].length).split('\n').length - 1
  }
  const lines = raw.slice(m ? m[0].length : 0).split('\n')
  return { fm, fmError, lines, bodyStart, raw }
}

/** Yields body lines outside fenced code, with line numbers; also reports fence problems. */
function* proseLines(file, lines, bodyStart) {
  let fence = null
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i]
    const f = /^\s*(`{3,}|~{3,})(.*)$/.exec(ln)
    if (f) {
      if (!fence) {
        fence = { ch: f[1][0], len: f[1].length, line: i + bodyStart + 1 }
        if (!f[2].trim()) {
          add('warn', file, i + bodyStart + 1, 'fence-language', 'code fence has no language')
        }
      } else if (f[1][0] === fence.ch && f[1].length >= fence.len && !f[2].trim()) {
        fence = null
      }
      continue
    }
    if (!fence) yield [ln, i + bodyStart + 1]
  }
  if (fence) add('error', file, fence.line, 'unclosed-fence', 'code fence is never closed')
}

function lintMarkdown(file, kind) {
  const { fm, fmError, lines, bodyStart } = parse(file)
  const rel = path.relative(ROOT, file)

  if (fmError) {
    add('error', file, 1, 'frontmatter-yaml', `frontmatter is not valid YAML: ${fmError}`)
    return { fm: null }
  }

  // ---- legacy MDX 1 syntax (strict MDX): these break silently or fail to compile ----
  let h1 = 0
  let lastLevel = 0
  for (const [ln, no] of proseLines(file, lines, bodyStart)) {
    const noInline = ln.replace(/`[^`]*`/g, '')
    if (/<!--/.test(noInline) && !/<!--\s*truncate\s*-->/.test(noInline)) {
      add('error', file, no, 'html-comment', 'HTML comment: use {/* comment */} (MDX 3)')
    }
    if (/^\s{0,3}#{1,6}\s.*\s\{#[\w:.-]+\}\s*$/.test(ln)) {
      add('error', file, no, 'heading-id', 'legacy heading id {#id}: use "## Title {/* #id */}"')
    }
    if (/^\s*(?:>\s*)?:{3,}(note|tip|info|warning|danger|caution|important|success|secondary|details)[ \t]+[^[{\s]/.test(ln)) {
      add('error', file, no, 'admonition-title', 'legacy admonition title: use ":::tip[Title]"')
    }
    // a summary at the top of a post is the <TLDR> component, not an admonition or a heading
    if (/^\s*:{3,}[a-z]+\[(?:TL;?DR|Key takeaways|Summary)\]/i.test(ln)) {
      add('warn', file, no, 'tldr-admonition', 'summary written as an admonition: use the <TLDR> component (blank line after <TLDR> and before </TLDR>)')
    }
    // (only near the top: a "Key takeaways" list at the end of a long post is a conclusion, not a summary)
    if (no <= 60 && /^#{2,3}\s+(?:TL;?DR|Key takeaways)\s*:?\s*$/i.test(ln)) {
      add('warn', file, no, 'tldr-heading', 'summary written as a heading: use the <TLDR> component')
    }
    // absolute internal links with a file extension never resolve
    if (/\]\(\/(?:docs|blog|customer-stories|learn)[^)\s]*\.mdx?(?:[#)])/.test(ln)) {
      add('warn', file, no, 'link-extension', 'internal link ends in .md/.mdx: it resolves, but link to the route instead')
    }
    if (/\]\(\/blog\/\d{4}\/\d{2}\/\d{2}\//.test(ln)) {
      add('error', file, no, 'old-blog-url', 'old date-style /blog/YYYY/MM/DD/ URL: use the post slug')
    }
    if (/https:\/\/olake\.io\/(?:docs|blog|customer-stories|learn)\//.test(ln) && !/^\s*(?:import|export)\b/.test(ln)) {
      add('warn', file, no, 'self-link', 'absolute olake.io link: prefer a relative /path/')
    }
    if (kind === 'post' && /<h1[\s>]/i.test(noInline)) {
      add('error', file, no, 'second-h1', 'second H1 (<h1>): the page title comes from the front matter; use "##" or an <h2>')
    }
    // headings
    const h = /^(#{1,6})\s+\S/.exec(ln)
    if (h) {
      const level = h[1].length
      if (level === 1) {
        h1++
        // a post's title is its front-matter title, rendered as the page H1: a "# Heading" in the body is a second H1
        if (kind === 'post') add('error', file, no, 'second-h1', 'second H1: the page title comes from the front matter. Delete a duplicate of it, or make this "##"')
        else if (h1 === 2) add('warn', file, no, 'multiple-h1', 'more than one H1 (the page title is already the H1)')
      }
      if (lastLevel && level > lastLevel + 1) {
        add('warn', file, no, 'heading-skip', `heading jumps from H${lastLevel} to H${level}`)
      }
      lastLevel = level
      if (/^#{1,6}\s+(\*\*|__).*(\*\*|__)\s*$/.test(ln)) {
        add('warn', file, no, 'bold-heading', 'heading is wrapped in bold: use a plain heading')
      }
    }
    // a short bold line on its own, with blank lines around it and no closing punctuation, is a heading
    // typed by hand: it is missing from the table of contents and from the outline
    else if (/^(\*\*|__)[^*_`]{2,70}[^*_`.:!?,;\s](\*\*|__)$/.test(ln.trim()) && !/^\s/.test(ln)) {
      const i = no - bodyStart - 1
      const prev = (lines[i - 1] || '').trim()
      const next = (lines[i + 1] || '').trim()
      if (prev === '' && next === '' && ln.trim().split(/\s+/).length <= 8) {
        add('warn', file, no, 'bold-pseudo-heading', 'bold line on its own looks like a heading: use a real heading (## / ###) at the right level, or keep it as a label with a colon')
      }
    }
    // <br> outside a table row: use a paragraph break (a blank line) instead
    if (/<br\s*\/?>|<br><\/br>/i.test(noInline) && !/^\s*\|/.test(ln)) {
      add('warn', file, no, 'br-tag', '<br> outside a table: use a blank line (paragraph break) instead')
    }
    // pathname:/// image paths skip the image-dimensions plugin: use a normal /img/... path
    if (/pathname:\/\/\//.test(ln)) {
      add('warn', file, no, 'pathname-path', 'pathname:/// path: use a normal /img/... path (files in static/ need no pathname:// prefix)')
    }
  }

  // ---- filename ----
  const base = path.basename(file)
  if (/\s/.test(base)) add('error', file, 1, 'filename-space', `filename contains a space: "${base}"`)

  if (!fm) {
    if (kind === 'doc' && !/\/shared\//.test(rel)) {
      add('warn', file, 1, 'no-frontmatter', 'no frontmatter')
    }
    return { fm }
  }

  if (fm.draft === true) return { fm } // drafts are not published
  const title = fm.title == null ? '' : String(fm.title)
  const desc = fm.description == null ? '' : String(fm.description)

  if (/\/shared\//.test(rel)) {
    add('warn', file, 1, 'partial-frontmatter', 'files in docs/shared are partials: remove the frontmatter (it fails CI builds as soon as the partial is imported)')
    return { fm }
  }

  if (!desc) add('error', file, 1, 'description-missing', 'missing description')
  else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    add('warn', file, 1, 'description-length', `description is ${desc.length} characters (aim ${DESC_MIN}-${DESC_MAX})`)
  }
  if (kind === 'post') {
    if (!title) add('error', file, 1, 'title-missing', 'missing title')
    else if (title.length > TITLE_MAX) add('error', file, 1, 'title-length', `title is ${title.length} characters (max ${TITLE_MAX})`)
    if (/&amp;|&#\d+;/.test(title)) add('error', file, 1, 'title-entity', 'title contains an HTML entity: use the plain character')
  }
  return { fm }
}

function lintPosts() {
  for (const dir of POST_DIRS) {
    const authors = readYaml(path.join(ROOT, AUTHOR_FILES[dir] ?? `${dir}/authors.yml`))
    const tagsDef = readYaml(path.join(ROOT, TAG_FILES[dir] ?? `${dir}/tags.yml`))
    const slugs = new Map()
    for (const file of walk(path.join(ROOT, dir))) {
      if (onlyPaths.length && !onlyPaths.some((p) => path.join(ROOT, p) === file || file.startsWith(path.join(ROOT, p)))) continue
      const { fm } = lintMarkdown(file, 'post')
      const { lines } = parse(file)
      const base = path.basename(file)
      if (!fm) continue

      if (fm.draft) continue
      // authors
      const as = Array.isArray(fm.authors) ? fm.authors : fm.authors ? [fm.authors] : []
      if (!as.length) add('error', file, 1, 'authors-missing', 'missing authors')
      for (const a of as) {
        if (typeof a === 'string' && !(a in authors)) add('error', file, 1, 'author-unknown', `author "${a}" is not in ${AUTHOR_FILES[dir] ?? `${dir}/authors.yml`}`)
      }
      // tags
      const tags = Array.isArray(fm.tags) ? fm.tags : []
      if (!tags.length) add('error', file, 1, 'tags-missing', 'missing tags')
      const topicTags = tags.filter((t) => !CATEGORY_TAGS.has(t))
      if (topicTags.length > TAGS_MAX) add('error', file, 1, 'tags-count', `${topicTags.length} topic tags (max ${TAGS_MAX})`)
      for (const t of tags) {
        if (typeof t === 'string' && !(t in tagsDef)) add('error', file, 1, 'tag-undefined', `tag "${t}" is not defined in ${TAG_FILES[dir] ?? `${dir}/tags.yml`}`)
      }
      // image
      if (!fm.image) add('error', file, 1, 'image-missing', 'missing image (used as the social card)')
      else if (typeof fm.image === 'string') {
        if (!/^(\/|https?:\/\/)/.test(fm.image)) add('error', file, 1, 'image-path', `image "${fm.image}" must start with "/" (otherwise no og:image is emitted)`)
        else if (fm.image.startsWith('/') && !fs.existsSync(path.join(ROOT, 'static', fm.image))) {
          add('error', file, 1, 'image-not-found', `image ${fm.image} does not exist under static/`)
        }
      }
      // slug
      const slug = fm.slug == null ? null : String(fm.slug)
      if (slug) {
        if (/[A-Z]/.test(slug)) add('warn', file, 1, 'slug-case', `slug "${slug}" has uppercase letters`)
        if (/\s/.test(slug)) add('error', file, 1, 'slug-space', 'slug contains a space')
        if (slugs.has(slug)) add('error', file, 1, 'slug-duplicate', `slug "${slug}" is also used by ${slugs.get(slug)}`)
        slugs.set(slug, path.relative(ROOT, file))
      }
      // date: filename date prefix vs frontmatter date
      const dm = /^(\d{4}-\d{2}-\d{2})-/.exec(base)
      if (!dm) add('warn', file, 1, 'filename-date', 'filename does not start with YYYY-MM-DD-')
      else if (fm.date) {
        const d = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date).slice(0, 10)
        if (d !== dm[1]) add('warn', file, 1, 'date-mismatch', `frontmatter date ${d} differs from filename date ${dm[1]}`)
      }
      // CTA
      const last = lines.filter((l) => l.trim()).pop() || ''
      if (dir !== 'customer-stories' && !/^<(?:Fusion)?BlogCTA\s*\/>$/.test(last.trim())) {
        add('warn', file, lines.length, 'cta-last-line', 'last line should be <BlogCTA/> (or <FusionBlogCTA/>)')
      }
    }
  }
}

function lintDocs() {
  for (const dir of DOC_DIRS) {
    for (const file of walk(path.join(ROOT, dir))) {
      if (onlyPaths.length && !onlyPaths.some((p) => path.join(ROOT, p) === file || file.startsWith(path.join(ROOT, p)))) continue
      lintMarkdown(file, 'doc')
    }
  }
}

lintPosts()
lintDocs()

const errors = findings.filter((f) => f.level === 'error')
const warns = findings.filter((f) => f.level === 'warn')

const byRule = (list) => {
  const m = new Map()
  for (const f of list) m.set(f.rule, (m.get(f.rule) || 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

const show = (list, label) => {
  for (const f of list) console.log(`${label} ${f.file}:${f.line}  [${f.rule}] ${f.msg}`)
}

show(errors, 'ERROR')
if (!QUIET) show(warns, 'warn ')

console.log('')
console.log(`content lint: ${errors.length} error(s), ${warns.length} warning(s)`)
if (errors.length) console.log('  errors  :', byRule(errors).map(([r, n]) => `${r} ${n}`).join(', '))
if (warns.length) console.log('  warnings:', byRule(warns).map(([r, n]) => `${r} ${n}`).join(', '))

process.exit(errors.length || (STRICT && warns.length) ? 1 : 0)
