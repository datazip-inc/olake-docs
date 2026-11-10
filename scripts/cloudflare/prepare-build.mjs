#!/usr/bin/env node
// Turns a Docusaurus build folder into what Cloudflare Workers static assets should serve.
//
//   node scripts/cloudflare/prepare-build.mjs [buildDir]
//
// 1. Redirects. Every meta-refresh stub written by the client-redirects plugin becomes a 301 rule
//    in <buildDir>/_redirects (one for /old and one for /old/, because Cloudflare matches the
//    trailing slash exactly), and the stub file is deleted. The build output is the source of truth,
//    so `docusaurus.config.js` stays the only place where redirects are edited.
// 2. Trailing slash. Workers answers /docs with a 307 to /docs/. One explicit "/docs /docs/ 301"
//    rule per page keeps the permanent redirect GitHub Pages gave us, with no Worker code.
// 3. Headers. cloudflare/_headers is copied to <buildDir>/_headers.
// 4. Files that only GitHub Pages needs (CNAME, .nojekyll) are removed.
//
// The script fails the build when a redirect loops, points at a page that is not in the build,
// or when the rule count passes Cloudflare's limit of 2,000 static rules.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const STATIC_RULE_LIMIT = 2000 // https://developers.cloudflare.com/workers/static-assets/redirects/
const RULE_CHAR_LIMIT = 1000
const WARN_AT = 0.9

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const buildDir = path.resolve(process.argv[2] || path.join(repoRoot, 'build'))
const STUB = /<meta http-equiv="?refresh"? content="?0;\s*url=([^"'>\s]+)/i

if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error(`[cloudflare] ${buildDir} has no index.html. Run "npm run build" first.`)
  process.exit(1)
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name === 'index.html') out.push(full)
  }
  return out
}

const urlOf = (file) => {
  const rel = path.relative(buildDir, path.dirname(file)).split(path.sep).join('/')
  return rel ? `/${rel}/` : '/'
}
// Cloudflare reads a space as the field separator, and "*" and ":name" as wildcards
const encodeSource = (p) =>
  p
    .split('/')
    .map((s) => encodeURIComponent(s).replace(/\*/g, '%2A'))
    .join('/')

const stubs = new Map() // "/old/" -> target
const stubFiles = []
const pages = [] // "/docs/" for every real page
for (const file of walk(buildDir)) {
  let target = null
  if (fs.statSync(file).size <= 2000) {
    const match = STUB.exec(fs.readFileSync(file, 'utf8'))
    if (match) target = match[1]
  }
  if (target) {
    stubs.set(urlOf(file), target)
    stubFiles.push(file)
  } else {
    pages.push(urlOf(file))
  }
}

const pathOf = (target) => target.replace(/[#?].*$/, '')
const problems = []
const redirectRules = []
for (const [source, firstTarget] of [...stubs].sort()) {
  // A -> B -> C becomes A -> C, so an old link always takes one hop
  let target = firstTarget
  const seen = new Set([source])
  while (target.startsWith('/') && stubs.has(pathOf(target))) {
    const next = pathOf(target)
    if (seen.has(next)) {
      problems.push(`redirect loop: ${source} -> ${target}`)
      break
    }
    seen.add(next)
    target = stubs.get(next)
  }
  if (target.startsWith('/')) {
    const targetPath = pathOf(target)
    const onDisk = path.join(buildDir, decodeURIComponent(targetPath))
    const exists = targetPath.endsWith('/')
      ? fs.existsSync(path.join(onDisk, 'index.html'))
      : fs.existsSync(onDisk)
    if (!exists) problems.push(`redirect target is not in the build: ${source} -> ${target}`)
    else if (!targetPath.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(targetPath))
      problems.push(`redirect target has no trailing slash (second hop): ${source} -> ${target}`)
  }
  if (/\s/.test(target)) problems.push(`redirect target contains a space: ${source} -> ${target}`)
  const encoded = encodeSource(source)
  redirectRules.push(`${encoded.slice(0, -1)} ${target} 301`, `${encoded} ${target} 301`)
}

const slashRules = pages
  .filter((page) => page !== '/')
  .sort()
  .map((page) => {
    const encoded = encodeSource(page)
    return `${encoded.slice(0, -1)} ${encoded} 301`
  })

const rules = [...redirectRules, ...slashRules]
for (const rule of rules)
  if (rule.length > RULE_CHAR_LIMIT)
    problems.push(`rule is over ${RULE_CHAR_LIMIT} characters: ${rule.slice(0, 80)}...`)
const sources = new Set()
for (const rule of rules) {
  const source = rule.split(' ')[0]
  if (sources.has(source)) problems.push(`two rules for the same source: ${source}`)
  sources.add(source)
}
if (rules.length > STATIC_RULE_LIMIT)
  problems.push(
    `${rules.length} rules is over Cloudflare's limit of ${STATIC_RULE_LIMIT} static rules. ` +
      'Move the old-URL redirects to an account Bulk Redirect list, or drop slash rules for low-traffic sections.'
  )

if (problems.length) {
  console.error(`[cloudflare] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

fs.writeFileSync(
  path.join(buildDir, '_redirects'),
  [
    '# Generated by scripts/cloudflare/prepare-build.mjs. Do not edit: change docusaurus.config.js instead.',
    `# Old URLs (${stubs.size} redirects, both slash forms)`,
    ...redirectRules,
    `# Trailing slash for every page (${slashRules.length} pages). Without these Workers answers with a 307.`,
    ...slashRules
  ].join('\n') + '\n'
)

for (const file of stubFiles) {
  fs.rmSync(file)
  let dir = path.dirname(file)
  while (dir !== buildDir && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir)
    dir = path.dirname(dir)
  }
}

fs.copyFileSync(path.join(repoRoot, 'cloudflare', '_headers'), path.join(buildDir, '_headers'))
for (const name of ['CNAME', '.nojekyll']) fs.rmSync(path.join(buildDir, name), { force: true })

const used = `${rules.length} of ${STATIC_RULE_LIMIT}`
console.log(
  `[cloudflare] _redirects: ${stubs.size} old URLs and ${slashRules.length} pages, ${used} static rules used`
)
if (rules.length > STATIC_RULE_LIMIT * WARN_AT) {
  const message = `_redirects uses ${used} static rules. Plan the move of old-URL redirects to a Bulk Redirect list.`
  console.log(
    process.env.GITHUB_ACTIONS ? `::warning::${message}` : `[cloudflare] WARNING: ${message}`
  )
}
