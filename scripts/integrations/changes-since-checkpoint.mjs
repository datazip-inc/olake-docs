#!/usr/bin/env node
// Prints what changed in OLake Go and OLake UI since the last integration docs sweep, limited to
// the paths that decide what a guide tells the reader: form labels, required fields, defaults
// and stream behaviour. The sweep's starting point is scripts/integrations/CHECKPOINT.json.
//
// Usage:
//   node scripts/integrations/changes-since-checkpoint.mjs [--olake ../olake] [--olake-ui ../olake-ui] [--ref origin/master] [--patch] [--checkpoint <file>]
//
// Fetches both repos first. `--patch` also prints the diffs of the spec.json files. After the
// sweep, update CHECKPOINT.json (date, tag and commit of each repo) in the same docs change.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const REF = opt('--ref', 'origin/master')
const PATCH = args.includes('--patch')
const here = dirname(fileURLToPath(import.meta.url))
const checkpoint = JSON.parse(readFileSync(resolve(opt('--checkpoint', join(here, 'CHECKPOINT.json'))), 'utf8'))

const REPOS = [
  {
    key: 'olake',
    dir: resolve(opt('--olake', '../olake')),
    paths: [
      'destination/*/resources/spec.json',
      'drivers/*/resources/spec.json',
      'constants/',
      'types/stream*.go',
      'drivers/abstract/',
    ],
    patch: ['destination/*/resources/spec.json', 'drivers/*/resources/spec.json'],
  },
  {
    key: 'olake_ui',
    dir: resolve(opt('--olake-ui', '../olake-ui')),
    paths: ['ui/src/modules/ingestion/'],
    patch: [],
  },
]

const git = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 })

console.log(`Last docs sweep: ${checkpoint.last_reviewed}\n`)
for (const repo of REPOS) {
  const since = checkpoint[repo.key]
  try {
    git(repo.dir, 'fetch', '--quiet', '--tags', 'origin')
  } catch {
    console.log(`(${repo.key}: fetch failed, using local refs)`)
  }
  const head = git(repo.dir, 'rev-parse', '--short', REF).trim()
  console.log(`== ${repo.key} (${repo.dir})`)
  console.log(`   checkpoint ${since.tag} ${since.commit.slice(0, 8)}, now ${REF} ${head}`)

  const tags = git(repo.dir, 'tag', '--contains', since.commit, '--sort=v:refname')
    .split('\n')
    .filter((t) => t && t !== since.tag)
  console.log(`   new tags: ${tags.length ? tags.join(', ') : 'none'}`)

  const log = git(
    repo.dir,
    'log',
    '--no-merges',
    '--date=short',
    '--format=   %h %ad %s',
    `${since.commit}..${REF}`,
    '--',
    ...repo.paths.map((p) => `:(glob)${p.endsWith('/') ? `${p}**` : p}`),
  ).trimEnd()
  console.log(log ? `   commits touching ${repo.paths.join(', ')}:\n${log}` : '   no commits touching the watched paths')

  if (PATCH && repo.patch.length) {
    const diff = git(repo.dir, 'diff', `${since.commit}..${REF}`, '--', ...repo.patch.map((p) => `:(glob)${p}`)).trim()
    if (diff) console.log(`\n${diff}`)
  }
  console.log('')
}
console.log('For each commit: check labels against node scripts/integrations/spec-labels.mjs, defaults and required fields in the spec, and stream defaults in drivers/abstract.')
