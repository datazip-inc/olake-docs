#!/usr/bin/env node
// Lists the OLake UI field labels, as the connector spec.json files define them, and flags
// required fields without a default whose label never appears in the shared docs.
//
// The OLake UI renders each form field from the `title` in the connector's spec.json, so these
// titles are the names a reader sees. Required fields with no default are the ones a guide must
// tell the reader to fill in.
//
// Usage:
//   node scripts/integrations/spec-labels.mjs [--olake ../olake] [--ref origin/master] [--json] [--all]
//
// Reads the spec files from git at `--ref` (default origin/master), so the local checkout's
// current branch does not matter. Run `git -C ../olake fetch` first.

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const OLAKE = resolve(opt('--olake', '../olake'))
const REF = opt('--ref', 'origin/master')
const AS_JSON = args.includes('--json')
// SSH tunnel fields live on the connector pages, not in the integration guides.
const SKIP = args.includes('--all') ? null : /^ssh_config\./
const DOCS = ['docs/shared/integrations', 'docs/shared/config']

const git = (...a) => execFileSync('git', ['-C', OLAKE, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 })

const specPaths = git('ls-tree', '-r', '--name-only', REF)
  .split('\n')
  .filter((p) => /^(destination|drivers)\/[^/]+\/resources\/spec\.json$/.test(p))

// Walks a JSON schema and returns every titled field with its path, whether it is required
// in its object, and its default. `oneOf` branches keyed by a `const` (catalog_type, update
// method type) are reported as their own groups.
function collect(schema, group, path, out, required = []) {
  if (!schema || typeof schema !== 'object') return
  const props = schema.properties ?? {}
  const req = new Set([...(schema.required ?? []), ...required])
  for (const [key, field] of Object.entries(props)) {
    if (!field || typeof field !== 'object') continue
    if (field.title) {
      out.push({
        group,
        field: path ? `${path}.${key}` : key,
        title: field.title,
        required: req.has(key),
        default: field.default,
      })
    }
    if (field.properties || field.oneOf) collect(field, group, path ? `${path}.${key}` : key, out)
  }
  for (const branch of schema.oneOf ?? []) {
    const constEntry = Object.entries(branch.properties ?? {}).find(([, v]) => v && v.const !== undefined)
    const name = constEntry ? `${group} [${constEntry[0]}=${constEntry[1].const}]` : group
    collect(branch, name, path, out)
  }
  for (const [key, dep] of Object.entries(schema.dependencies ?? {})) {
    for (const branch of dep.oneOf ?? []) {
      const c = branch.properties?.[key]?.const
      // A branch may repeat a parent field (to override its description) without a title;
      // its own `required` list still applies to the parent's titled fields.
      const name = `${group} [${key}=${c}]`
      collect({ ...branch, properties: mergeTitles(props, branch.properties) }, name, path, out, [])
    }
  }
}

// For dependency branches, keep the parent's title on fields the branch repeats without one.
function mergeTitles(parent, branch = {}) {
  const merged = {}
  for (const [k, v] of Object.entries(branch)) {
    merged[k] = v.title || !parent[k]?.title ? v : { ...v, title: parent[k].title }
  }
  return merged
}

function docsText() {
  const files = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(mdx?|[jt]sx?)$/.test(name)) files.push(p)
    }
  }
  DOCS.forEach(walk)
  return files.map((f) => readFileSync(f, 'utf8')).join('\n')
}

const text = docsText().toLowerCase()
const report = []
for (const p of specPaths) {
  const connector = p.split('/')[1]
  const kind = p.startsWith('destination') ? 'destination' : 'source'
  const spec = JSON.parse(git('show', `${REF}:${p}`))
  const root = kind === 'destination' ? spec.properties?.writer ?? spec : spec
  const fields = []
  collect(root, `${kind} ${connector}`, '', fields)
  for (const f of fields) {
    f.mustFill = f.required && f.default === undefined
    f.inDocs = text.includes(f.title.toLowerCase())
  }
  report.push(...fields)
}

if (AS_JSON) {
  console.log(JSON.stringify({ ref: REF, commit: git('rev-parse', REF).trim(), fields: report }, null, 2))
  process.exit(0)
}

console.log(`OLake spec labels at ${REF} (${git('rev-parse', '--short', REF).trim()})\n`)
let group = ''
for (const f of report) {
  if (f.group !== group) {
    group = f.group
    console.log(`\n${group}`)
  }
  const flags = [f.mustFill ? 'REQUIRED, no default' : f.required ? 'required' : '', f.default !== undefined ? `default ${JSON.stringify(f.default)}` : '']
    .filter(Boolean)
    .join(', ')
  console.log(`  ${f.title.padEnd(42)} ${f.field.padEnd(34)} ${flags}`)
}

const missing = report.filter((f) => f.mustFill && !f.inDocs && !(SKIP && SKIP.test(f.field)))
console.log(`\n${missing.length} required field label(s) with no default never appear in ${DOCS.join(' or ')}${SKIP ? ' (SSH fields skipped, --all to include)' : ''}:`)
for (const f of missing) console.log(`  ${f.group}: "${f.title}" (${f.field})`)
