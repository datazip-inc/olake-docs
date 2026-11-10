#!/usr/bin/env node
// Keeps the hashed files of earlier deploys in the new build for a few days.
//
//   node scripts/cloudflare/carry-assets.mjs [buildDir] [--from https://olake.io] [--days 7]
//
// Why: every Docusaurus build renames the JS and CSS files whose content changed
// (main.<hash>.js and so on), and a deploy replaces the whole site. A browser tab that still holds
// the HTML of the previous deploy then asks for files that are gone, and the page stops working
// until it is reloaded. Cloudflare Workers does not keep old assets, so this script does:
//
// 1. It reads <from>/asset-manifest.json, the list the previous deploy published.
// 2. Every /assets/ file on that list that the new build no longer has, and that was part of a
//    fresh build in the last <days> days, is downloaded from the live site into the new build.
// 3. It writes the new asset-manifest.json.
//
// Nothing here can fail a deploy: when the live site has no manifest yet, or a file cannot be
// fetched, the script warns and carries on.
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
const files = Object.fromEntries(current.map((file) => [file, new Date(now).toISOString()]))

// Only names we would have produced ourselves: under assets/, no "..", no odd characters
const SAFE = /^assets\/[A-Za-z0-9._~@/-]+$/

async function fetchPrevious() {
  try {
    const response = await fetch(`${from}/${MANIFEST}`, {
      headers: { 'cache-control': 'no-cache' }
    })
    if (!response.ok) return { note: `${from}/${MANIFEST} answered ${response.status}` }
    const manifest = await response.json()
    if (!manifest || typeof manifest.files !== 'object')
      return { note: 'the manifest has no "files" object' }
    return { manifest }
  } catch (error) {
    return { note: `could not read ${from}/${MANIFEST}: ${error.message}` }
  }
}

async function download(file) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${from}/${file}`)
      const type = response.headers.get('content-type') || ''
      // A missing file answers with the HTML 404 page
      if (!response.ok || type.includes('text/html')) return false
      const target = path.join(buildDir, file)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()))
      return true
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  return false
}

const { manifest, note } = await fetchPrevious()
let carried = 0
let expired = 0
let failed = 0
if (!manifest) {
  console.log(`[cloudflare] no assets carried forward: ${note}`)
} else {
  const wanted = []
  for (const [file, lastCurrent] of Object.entries(manifest.files)) {
    if (file in files || !SAFE.test(file) || file.includes('..')) continue
    const age = now - Date.parse(lastCurrent)
    if (!Number.isFinite(age) || age > days * 86400000) {
      expired += 1
      continue
    }
    wanted.push([file, lastCurrent])
  }
  // Newest first, so the guard drops the oldest files
  wanted.sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]))
  const queue = wanted.slice(0, MAX_CARRIED)
  let next = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < queue.length) {
        const [file, lastCurrent] = queue[next]
        next += 1
        if (await download(file)) {
          files[file] = lastCurrent
          carried += 1
        } else {
          failed += 1
        }
      }
    })
  )
  console.log(
    `[cloudflare] assets: ${current.length} in this build, ${carried} carried forward from ${from}, ` +
      `${expired} older than ${days} days dropped, ${failed} could not be fetched`
  )
}

fs.writeFileSync(
  path.join(buildDir, MANIFEST),
  JSON.stringify({ generated: new Date(now).toISOString(), retentionDays: days, files }, null, 0) +
    '\n'
)
