#!/usr/bin/env node
// Redirect and routing test for the Cloudflare deployment (local emulator, preview URL or production).
//
//   node scripts/cloudflare/test-deploy.mjs <buildDir> <baseUrl> [--json out.json]
//
// <buildDir> is the build after prepare-build.mjs, so it holds the _redirects that was deployed.
//
// Checks:
//  1. every source in <siteDir>/_redirects answers 301 with a Location equal to its target,
//     and the target itself answers 200 (internal) with no second hop (no chains, no loops)
//  2. every <loc> in <siteDir>/sitemap.xml answers 200 at its slash form (path taken from the loc,
//     host replaced by <baseUrl>), and its no-slash form answers 301 to the slash form
//  3. unknown paths answer 404 with the Docusaurus 404 page
//  4. semantics probes: query string passthrough, anchors, /index.html, redirect versus real file
import fs from 'node:fs'
import path from 'node:path'

const [siteDir, baseArg] = process.argv.slice(2)
if (!siteDir || !baseArg) {
  console.error('usage: test-deploy.mjs <buildDir> <baseUrl> [--json out.json]')
  process.exit(2)
}
const base = baseArg.replace(/\/$/, '')
const jsonOut = process.argv.includes('--json')
  ? process.argv[process.argv.indexOf('--json') + 1]
  : null
const CONC = 16

async function get(p, headers = {}) {
  const url = p.startsWith('http') ? p : base + p
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers })
      const body = await r.text()
      return {
        status: r.status,
        location: r.headers.get('location'),
        headers: Object.fromEntries(r.headers),
        body
      }
    } catch (e) {
      if (i >= 3) return { status: 0, location: null, headers: {}, body: String(e) }
      await new Promise((r) => setTimeout(r, 300))
    }
  }
}
async function pool(items, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < items.length) {
        const k = i++
        out[k] = await fn(items[k], k)
      }
    })
  )
  return out
}
// Location may be absolute (same host) or relative; normalise to what the rule's target looks like
const norm = (loc) => (!loc ? loc : loc.startsWith(base) ? loc.slice(base.length) : loc)
const tally = (arr) => arr.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {})

const report = { base, when: new Date().toISOString() }
const fails = []

// 1. _redirects
const rules = fs
  .readFileSync(path.join(siteDir, '_redirects'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => {
    const [from, to, code] = l.split(/\s+/)
    return { from, to, code: Number(code || 302) }
  })
const targetCache = new Map()
const r1 = await pool(rules, async (rule) => {
  const a = await get(rule.from)
  const loc = norm(a.location)
  let ok = a.status === rule.code && loc === rule.to,
    why = ''
  if (!ok) why = `got ${a.status} -> ${loc}, want ${rule.code} -> ${rule.to}`
  let second = null
  if (ok && rule.to.startsWith('/')) {
    const tp = rule.to.replace(/#.*$/, '')
    if (!targetCache.has(tp)) targetCache.set(tp, get(tp))
    second = (await targetCache.get(tp)).status
    if (second !== 200) {
      ok = false
      why = `target ${tp} answered ${second} (chain or missing)`
    }
  }
  if (!ok) fails.push(`redirect ${rule.from}: ${why}`)
  return { ok, status: a.status, external: !rule.to.startsWith('/'), second }
})
report.redirects = {
  rules: rules.length,
  pass: r1.filter((x) => x.ok).length,
  fail: r1.filter((x) => !x.ok).length,
  firstHopStatus: tally(r1.map((x) => x.status)),
  internalTargets: r1.filter((x) => !x.external).length,
  externalTargets: r1.filter((x) => x.external).length,
  targetStatus: tally(r1.filter((x) => x.second !== null).map((x) => x.second)),
  withAnchor: rules.filter((r) => r.to.includes('#')).length,
  withQuery: rules.filter((r) => r.to.includes('?')).length
}

// 2. sitemap
const locs = [
  ...fs.readFileSync(path.join(siteDir, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)
].map((m) => new URL(m[1].replace(/&amp;/g, '&')).pathname)
const r2 = await pool(locs, async (p) => {
  const a = await get(p)
  if (a.status !== 200) fails.push(`sitemap ${p}: ${a.status} -> ${norm(a.location)}`)
  let ns = null
  if (p.endsWith('/') && p !== '/') {
    const b = await get(p.slice(0, -1))
    ns = `${b.status}${norm(b.location) === p ? ' to slash form' : ' OTHER ' + norm(b.location)}`
    if (ns !== '301 to slash form') fails.push(`no-slash ${p.slice(0, -1)}: ${ns}`)
  }
  return { status: a.status, ns, cc: a.headers['cache-control'] || '(none)' }
})
report.sitemap = {
  urls: locs.length,
  status: tally(r2.map((x) => x.status)),
  noSlashForm: tally(r2.filter((x) => x.ns).map((x) => x.ns)),
  htmlCacheControl: tally(r2.map((x) => x.cc))
}

// 3. unknown paths
const unknown = [
  '/nonexistent-xyz/',
  '/nonexistent-xyz',
  '/docs/nope-nope/',
  '/blog/nope.html',
  '/assets/js/nope.js',
  '/img/nope.png'
]
const nav = { 'sec-fetch-mode': 'navigate', 'accept': 'text/html' }
report.unknown = {}
for (const p of unknown)
  for (const [label, h] of [
    ['plain', {}],
    ['navigate', nav]
  ]) {
    const a = await get(p, h)
    const is404page = /Page Not Found|page-not-found|404/i.test(a.body) && /<html/i.test(a.body)
    report.unknown[`${p} (${label})`] =
      `${a.status}${is404page ? ' docusaurus-404-page' : ' body=' + a.body.length + 'b'}`
    if (a.status !== 404) fails.push(`unknown ${p} (${label}): ${a.status}`)
  }

// 4. semantics probes (informational)
const firstInternal = rules.find(
  (r) => r.to.startsWith('/') && !/[?#]/.test(r.to) && !r.from.endsWith('/')
)
const probe = async (p, h) => {
  const a = await get(p, h)
  return `${a.status}${a.location ? ' -> ' + norm(a.location) : ''}`
}
report.probes = {
  [`${firstInternal.from}?utm_source=x&b=2`]: await probe(`${firstInternal.from}?utm_source=x&b=2`),
  [`${firstInternal.from}/?utm_source=x`]: await probe(`${firstInternal.from}/?utm_source=x`),
  [`${firstInternal.from.toUpperCase()}`]: await probe(firstInternal.from.toUpperCase()),
  '/docs?x=1': await probe('/docs?x=1'),
  '/docs/index.html': await probe('/docs/index.html'),
  '/docs/index': await probe('/docs/index'),
  '/index.html': await probe('/index.html'),
  '/404.html': await probe('/404.html'),
  '/404': await probe('/404'),
  '/404/': await probe('/404/'),
  '//docs/': await probe('//docs/'),
  '/docs//': await probe('/docs//'),
  '/_redirects': await probe('/_redirects'),
  '/_headers': await probe('/_headers')
}
const anchorRule = rules.find((r) => r.to.includes('#'))
if (anchorRule) report.probes[`anchor rule ${anchorRule.from}`] = await probe(anchorRule.from)
const queryRule = rules.find((r) => r.to.includes('?'))
if (queryRule) {
  report.probes[`query rule ${queryRule.from}`] = await probe(queryRule.from)
  report.probes[`query rule ${queryRule.from}?a=1`] = await probe(queryRule.from + '?a=1')
}
const extRule = rules.find((r) => !r.to.startsWith('/'))
if (extRule) report.probes[`external rule ${extRule.from}?a=1`] = await probe(extRule.from + '?a=1')
// sample asset headers
for (const p of ['/', '/robots.txt', '/sitemap.xml']) {
  const a = await get(p, { 'accept-encoding': 'br, gzip, zstd' })
  report.probes[`headers ${p}`] =
    `${a.status} cc=${a.headers['cache-control']} etag=${a.headers['etag']} enc=${a.headers['content-encoding']} ct=${a.headers['content-type']} xrobots=${a.headers['x-robots-tag']}`
}

report.failures = fails.length
report.failureSample = fails.slice(0, 25)
console.log(JSON.stringify(report, null, 2))
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ ...report, allFailures: fails }, null, 2))
process.exit(fails.length ? 1 : 0)
