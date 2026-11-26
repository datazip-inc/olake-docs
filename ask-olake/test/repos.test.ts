import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { markdownSections, readRepo, specSections, yamlSections } from '../ingest/repos.ts'

const PAGE = 'https://github.com/datazip-inc/olake-go/blob/HEAD/README.md'

test('splits Markdown at headings, with the heading path and the GitHub anchor', () => {
  const markdown = [
    '# OLake Go',
    'Intro.',
    '## Quick start',
    'Run it.',
    '### With Docker (CLI)',
    'Pull the image.',
    '## Sources',
    'Postgres.'
  ].join('\n')
  assert.deepEqual(
    markdownSections(markdown, PAGE, 'olake-go / README.md').map((s) => [s.heading, s.url, s.text]),
    [
      ['OLake Go', `${PAGE}#olake-go`, 'Intro.'],
      ['OLake Go > Quick start', `${PAGE}#quick-start`, 'Run it.'],
      ['OLake Go > Quick start > With Docker (CLI)', `${PAGE}#with-docker-cli`, 'Pull the image.'],
      ['OLake Go > Sources', `${PAGE}#sources`, 'Postgres.']
    ]
  )
})

test('a # line inside a code block is not a heading, and text before the first heading is kept', () => {
  const markdown = 'Before.\n\n```bash\n# install\nmake\n```\n\n## Next\nAfter.'
  const sections = markdownSections(markdown, PAGE, 'T')
  assert.deepEqual(
    sections.map((s) => [s.heading, s.url]),
    [
      ['', PAGE],
      ['Next', `${PAGE}#next`]
    ]
  )
  assert.equal(sections[0].text, 'Before.\n\n```bash\n# install\nmake\n```')
  assert.equal(sections[0].pageTitle, 'T')
})

test('removes front matter, HTML tags, comments and images, and keeps the words', () => {
  const markdown = [
    '---',
    'title: "Deployment"',
    '---',
    '<h1 align="center"><img alt="olake" src="x.png" width="100"/><br>OLake Go</h1>',
    '<!-- a note for maintainers -->',
    '[![Build](https://img.shields.io/badge.svg)](https://ci) See the <a href="https://olake.io/docs">docs</a>.',
    '',
    '```html',
    '<div>kept as code</div>',
    '```'
  ].join('\n')
  assert.deepEqual(
    markdownSections(markdown, PAGE, 'T').map((s) => s.text),
    ['OLake Go\n\nSee the docs.\n\n```html\n<div>kept as code</div>\n```']
  )
})

test('splits a values file at its top-level keys, each with the comment above it', () => {
  const yaml = [
    '# -- Name override',
    'nameOverride: ""',
    '',
    '# -- Global settings',
    '# used by every component',
    'global:',
    '  # -- Storage class',
    '  storageClass: ""',
    'olakeUI:',
    '  enabled: true'
  ].join('\n')
  assert.deepEqual(
    yamlSections(yaml, PAGE, 'T').map((s) => [s.heading, s.text]),
    [
      ['nameOverride', '```yaml\n# -- Name override\nnameOverride: ""\n```'],
      [
        'global',
        '```yaml\n# -- Global settings\n# used by every component\nglobal:\n  # -- Storage class\n  storageClass: ""\n```'
      ],
      ['olakeUI', '```yaml\nolakeUI:\n  enabled: true\n```']
    ]
  )
})

test('lists the fields of a config spec with label, type, default and whether required', () => {
  const spec = {
    type: 'object',
    required: ['host'],
    properties: {
      host: { type: 'string', title: 'Postgres Host', description: 'Database host address' },
      port: { type: 'integer', title: 'Postgres Port', default: 5432 },
      ssl: {
        type: 'object',
        title: 'SSL',
        properties: { mode: { type: 'string', enum: ['disable', 'require'] } }
      }
    },
    dependencies: {
      update_method: {
        oneOf: [
          {
            properties: {
              update_method: { const: 'CDC' },
              slot: { type: 'string', title: 'Replication Slot' },
              host: { description: 'Must be the primary' }
            },
            required: ['slot']
          }
        ]
      }
    }
  }
  assert.deepEqual(
    specSections(JSON.stringify(spec), PAGE, 'T').map((s) => s.text),
    [
      [
        '- `host` ("Postgres Host", string, required): Database host address',
        '- `port` ("Postgres Port", integer, default 5432)',
        '- `ssl` ("SSL", object)',
        '- `ssl.mode` (string, one of "disable", "require")',
        '- When `update_method` is "CDC":',
        '- `slot` ("Replication Slot", string, required)',
        '- `host`: Must be the primary'
      ].join('\n')
    ]
  )
  const wrapped = specSections(JSON.stringify({ jsonschema: spec, uischema: '{}' }), PAGE, 'T')
  assert.ok(wrapped[0].text.startsWith('- `host`'), 'the UI wraps the same schema in "jsonschema"')
})

test('reads the documentation files of a repository and links them on GitHub', () => {
  const dir = mkdtempSync(join(tmpdir(), 'repo-'))
  const git = (...args: string[]) => execFileSync('git', ['-C', dir, ...args], { stdio: 'pipe' })
  const files: Record<string, string> = {
    'README.md': '# Demo\nHello.',
    'helm/values.yaml': 'replicas: 1',
    'drivers/pg/resources/spec.json': '{"properties":{"host":{"type":"string"}}}',
    '.github/pull_request_template.md': '# Template',
    'CLAUDE.md': '# Agent notes',
    'LICENSE':
      '\n      Apache License\n   Version 2.0, January 2004\n   http://www.apache.org/licenses/\n\n   TERMS',
    'vendor/LICENSE': 'MIT License',
    'docs/upstream.md': '# Upstream',
    'main.go': 'package main',
    'untracked.md': '# Not committed'
  }
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, file)), { recursive: true })
    writeFileSync(join(dir, file), text)
  }
  git('init', '-q')
  git('remote', 'add', 'origin', 'git@github.com:datazip-inc/demo.git')
  git('add', '--', ...Object.keys(files).filter((file) => file !== 'untracked.md'))

  assert.deepEqual(
    readRepo(dir, ['docs']).map((s) => [s.pageTitle, s.url]),
    [
      ['demo / LICENSE', 'https://github.com/datazip-inc/demo/blob/HEAD/LICENSE'],
      ['demo / README.md', 'https://github.com/datazip-inc/demo/blob/HEAD/README.md#demo'],
      [
        'demo / drivers/pg/resources/spec.json',
        'https://github.com/datazip-inc/demo/blob/HEAD/drivers/pg/resources/spec.json'
      ],
      ['demo / helm/values.yaml', 'https://github.com/datazip-inc/demo/blob/HEAD/helm/values.yaml']
    ]
  )
  assert.equal(
    readRepo(dir)[0].text,
    'demo is released under this licence: Apache License, Version 2.0, January 2004.'
  )
})
