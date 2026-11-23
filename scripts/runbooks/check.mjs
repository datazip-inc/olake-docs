#!/usr/bin/env node
/**
 * Checks for the runbooks under docs/runbooks.
 *
 *   node scripts/runbooks/check.mjs            errors fail (exit 1)
 *   node scripts/runbooks/check.mjs --report   also list every page with its state
 *
 * A runbook is published only when a failure was reproduced and a second person has read it:
 *   - the `runbook:` front matter names a family, an author from the people registry, the date and
 *     versions of the run, and a lab folder that exists with its script, read-me and logs;
 *   - if the page also names runs on managed services or with other tools (`reproduced.services`),
 *     those have a date, versions and folders under labs/runbooks/service-runs that exist;
 *   - the page stays `unlisted: true` until `runbook.reviewer` names a second person;
 *   - the page follows the writing rules the integration pages use (no em dashes or curly quotes,
 *     title and description lengths).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const yaml = require('js-yaml')

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'docs', 'runbooks')
const REPORT = process.argv.includes('--report')
const TITLE_MAX = 60
const DESC_MIN = 120
const DESC_MAX = 160

const read = (p) => fs.readFileSync(p, 'utf8')
const ids = (file, re) => [...read(path.join(ROOT, file)).matchAll(re)].map((m) => m[1])
const people = new Set(ids('src/data/integrations/people.ts', /^\s{2}(\w+): \{$/gm))
const families = new Set(ids('src/data/runbooks/index.ts', /^\s{4}id: '([\w-]+)',$/gm))

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.mdx?$/.test(e.name)) out.push(p)
  }
  return out
}

const errors = []
const rows = []
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`)

for (const file of fs.existsSync(DIR) ? walk(DIR) : []) {
  const raw = read(file)
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) {
    err(file, 'no front matter')
    continue
  }
  const fm = yaml.load(m[1]) || {}
  const body = raw.slice(m[0].length)
  const isHub = path.basename(file).startsWith('index.')

  if (!fm.title || fm.title.length > TITLE_MAX) err(file, `title must be 1 to ${TITLE_MAX} characters (is ${(fm.title || '').length})`)
  const d = (fm.description || '').length
  if (d < DESC_MIN || d > DESC_MAX) err(file, `description must be ${DESC_MIN} to ${DESC_MAX} characters (is ${d})`)
  for (const [n, line] of raw.split('\n').entries()) {
    if (/[—–‘’“”]/.test(line)) err(file, `line ${n + 1}: em dash, en dash or curly quote`)
  }

  if (isHub) {
    rows.push({ file, state: fm.unlisted ? 'hub, unlisted' : 'hub, live' })
    continue
  }

  const r = fm.runbook
  if (!r) {
    err(file, 'no `runbook:` block in front matter')
    continue
  }
  if (!families.has(r.family)) err(file, `unknown family "${r.family}"`)
  if (path.basename(path.dirname(file)) !== r.family) err(file, `page is not in the folder of its family "${r.family}"`)
  if (!people.has(r.author)) err(file, `author "${r.author}" is not in src/data/integrations/people.ts`)
  if (r.reviewer && !people.has(r.reviewer)) err(file, `reviewer "${r.reviewer}" is not in src/data/integrations/people.ts`)
  if (r.reviewer && r.reviewer === r.author) err(file, 'reviewer must be a second person, not the author')

  const run = r.reproduced || {}
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(run.date || ''))) err(file, 'reproduced.date must be an ISO date')
  if (!Array.isArray(run.versions) || !run.versions.length) err(file, 'reproduced.versions must list the versions the lab ran')
  const lab = run.lab ? path.join(ROOT, run.lab) : ''
  if (!lab || !fs.existsSync(lab)) {
    err(file, `lab folder "${run.lab}" does not exist`)
  } else {
    for (const need of ['run.sh', 'README.md', 'docker-compose.yml']) {
      if (!fs.existsSync(path.join(lab, need))) err(file, `lab is missing ${need}`)
    }
    const logs = path.join(lab, 'logs')
    if (!fs.existsSync(logs) || !walk(logs, []).length && !fs.readdirSync(logs).length) err(file, 'lab has no captured logs')
  }
  // Runs on managed services and with other tools: an optional block with its own date and folders.
  const svc = run.services
  if (svc) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(svc.date || ''))) err(file, 'reproduced.services.date must be an ISO date')
    if (!Array.isArray(svc.versions) || !svc.versions.length) err(file, 'reproduced.services.versions must list what was run')
    if (!Array.isArray(svc.labs) || !svc.labs.length) err(file, 'reproduced.services.labs must list the folders of the runs')
    for (const dir of Array.isArray(svc.labs) ? svc.labs : []) {
      const d = path.join(ROOT, dir)
      if (!dir.startsWith('labs/runbooks/service-runs/') || !fs.existsSync(d)) {
        err(file, `service-run folder "${dir}" does not exist under labs/runbooks/service-runs`)
        continue
      }
      if (!fs.existsSync(path.join(d, 'README.md'))) err(file, `service-run folder "${dir}" has no README.md`)
      const l = path.join(d, 'logs')
      if (!fs.existsSync(l) || !fs.readdirSync(l).length) err(file, `service-run folder "${dir}" has no captured logs`)
    }
  }

  for (const tag of ['<R.Disclosure', '<R.Byline', '<R.HowWeReproduced']) {
    if (!body.includes(tag)) err(file, `page does not render ${tag} />`)
  }
  if (!fm.unlisted && !r.reviewer) err(file, 'page is listed but has no reviewer: keep `unlisted: true` until a second person has reviewed it')

  rows.push({ file, state: fm.unlisted ? (r.reviewer ? 'unlisted, reviewed' : 'unlisted, awaiting review') : 'live' })
}

// A redirect from an old URL into the runbooks hands that URL's ranking to the target page. An unlisted
// target is noindex, so the ranking would be lost: the target must be listed first.
const config = read(path.join(ROOT, 'docusaurus.config.js'))
for (const m of config.matchAll(/to:\s*'(\/docs\/runbooks\/[^'#?]*)[^']*'\s*,\s*from:\s*'([^']+)'/g)) {
  const rel = m[1].replace(/^\/docs\//, '').replace(/\/$/, '')
  const file = ['.mdx', '.md', '/index.mdx', '/index.md'].map((x) => path.join(ROOT, 'docs', rel + x)).find((f) => fs.existsSync(f))
  if (!file) {
    errors.push(`docusaurus.config.js: redirect from ${m[2]} points at ${m[1]}, which has no page`)
    continue
  }
  const fm = yaml.load((read(file).match(/^---\n([\s\S]*?)\n---\n/) || [])[1] || '') || {}
  if (fm.unlisted) errors.push(`docusaurus.config.js: redirect from ${m[2]} points at ${m[1]}, which is unlisted; list that page in the same change`)
}

if (REPORT) for (const r of rows) console.log(`${r.state.padEnd(26)} ${path.relative(ROOT, r.file)}`)
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`)
  console.error(`\n${errors.length} error(s) in ${rows.length} runbook page(s)`)
  process.exit(1)
}
console.log(`runbooks: ${rows.length} page(s) checked, no errors`)
