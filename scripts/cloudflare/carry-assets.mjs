#!/usr/bin/env node
// Keeps the hashed files of earlier deploys in the new build for a few days.
//
//   node scripts/cloudflare/carry-assets.mjs [buildDir] [--from https://olake.io] [--days 7] [--lenient]
//
// Why: every Docusaurus build renames the JS and CSS files whose content changed
// (main.<hash>.js and so on), and a deploy replaces the whole site. A browser tab that still holds
// the HTML of the previous deploy then asks for files that are gone, and the page stops working
// until it is reloaded. Cloudflare Workers does not keep old assets, so this script does:
//
// 1. It reads <from>/asset-manifest.json, the list the previous deploy published.
// 2. Every /assets/ file on that list that the new build no longer has, and that was replaced in
//    the last <days> days, is downloaded from the live site into the new build.
// 3. It writes the new asset-manifest.json: null for a file of this build, and for a carried file
//    the time of the deploy that replaced it.
//
// A site with no manifest yet (404) is fine: nothing is carried. Any other failure to read the
// manifest or an older asset stops the deploy, because publishing without them would drop them
// for good, and a rerun can still fetch them. --lenient turns that into a warning.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const flag = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback)
const positional = args.filter(
  (arg, i) => !arg.startsWith('--') && !(args[i - 1] || '').startsWith('--')
)

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const buildDir = path.resolve(positional[0] || path.join(repoRoot, 'build'))
const from = flag('--from', process.env.CARRY_ASSETS_FROM || 'https://olake.io').replace(/\/$/, '')
const days = Number(flag('--days', process.env.CARRY_ASSETS_DAYS || 7))
const lenient = args.includes('--lenient')
const MANIFEST = 'asset-manifest.json'
const MAX_CARRIED = 5000 // far below the Workers file limit; a guard against runaway growth
const CONCURRENCY = 12
const now = Date.now()

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const assetsDir = path.join(buildDir, 'assets')
const current = walk(assetsDir).map((file) =>
  path.relative(buildDir, file).split(path.sep).join('/')
)
const files = Object.fromEntries(current.map((file) => [file, null]))

// Only names we would have produced ourselves: under assets/, no "..", no odd characters
const SAFE = /^assets\/[A-Za-z0-9._~@/-]+$/

const TIMEOUT_MS = 30000
const ATTEMPTS = 4

// One GET with a timeout. Network errors, 429 and 5xx are retried: they say nothing about
// whether the file exists.
async function get(url, headers = {}) {
  let last = 'no answer'
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (attempt) await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)))
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) })
      if (response.status === 429 || response.status >= 500) {
        last = `status ${response.status}`
        continue
      }
      const body = Buffer.from(await response.arrayBuffer())
      return { status: response.status, type: response.headers.get('content-type') || '', body }
    } catch (error) {
      last = error.message
    }
  }
  return { error: last }
}

// Stops the deploy: publishing now would drop the older assets for good, a rerun can still get them.
function stop(message) {
  if (lenient) {
    console.log(`[cloudflare] WARNING (--lenient): ${message}`)
    return
  }
  console.error(
    `[cloudflare] ${message}\n` +
      '[cloudflare] Not deploying, because the assets of earlier deploys would be lost. ' +
      'Run the job again, or pass --lenient to deploy without them.'
  )
  process.exit(1)
}

let manifest = null
const previous = await get(`${from}/${MANIFEST}`, { 'cache-control': 'no-cache' })
if (previous.status === 404) {
  // The first deploy, or a site that is not served from this Worker yet
  console.log(`[cloudflare] no assets carried forward: ${from}/${MANIFEST} does not exist yet`)
} else if (previous.status === 200) {
  try {
    manifest = JSON.parse(previous.body.toString('utf8'))
  } catch {
    manifest = null
  }
  if (!manifest || typeof manifest.files !== 'object' || manifest.files === null) {
    manifest = null
    stop(`${from}/${MANIFEST} is not a valid manifest`)
  }
} else {
  stop(`could not read ${from}/${MANIFEST}: ${previous.error || `status ${previous.status}`}`)
}

let carried = 0
let expired = 0
let gone = 0
const unreachable = []
if (manifest) {
  const wanted = []
  for (const [file, replacedAt] of Object.entries(manifest.files)) {
    if (file in files || !SAFE.test(file) || file.includes('..')) continue
    // null = a file of the previous build: it was live until now, so its days start now
    const since = replacedAt ?? new Date(now).toISOString()
    const age = now - Date.parse(since)
    if (!Number.isFinite(age) || age > days * 86400000) {
      expired += 1
      continue
    }
    wanted.push([file, since])
  }
  // Newest first, so the guard drops the oldest files
  wanted.sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]))
  const queue = wanted.slice(0, MAX_CARRIED)
  let next = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < queue.length) {
        const [file, since] = queue[next]
        next += 1
        const answer = await get(`${from}/${file}`)
        if (answer.error) {
          unreachable.push(`${file} (${answer.error})`)
        } else if (answer.status !== 200 || answer.type.includes('text/html')) {
          // A missing file answers 404 with the HTML not-found page: it is really gone
          gone += 1
        } else {
          const target = path.join(buildDir, file)
          fs.mkdirSync(path.dirname(target), { recursive: true })
          fs.writeFileSync(target, answer.body)
          files[file] = since
          carried += 1
        }
      }
    })
  )
  console.log(
    `[cloudflare] assets: ${current.length} in this build, ${carried} carried forward from ${from}, ` +
      `${expired} older than ${days} days dropped, ${gone} no longer on the site`
  )
  if (unreachable.length)
    stop(
      `${unreachable.length} older asset(s) could not be fetched after ${ATTEMPTS} attempts:\n  ` +
        unreachable.slice(0, 10).join('\n  ')
    )
}

fs.writeFileSync(
  path.join(buildDir, MANIFEST),
  JSON.stringify({ generated: new Date(now).toISOString(), retentionDays: days, files }, null, 0) +
    '\n'
)
