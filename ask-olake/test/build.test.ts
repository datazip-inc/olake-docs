import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import { siteChunks, toSql } from '../ingest/build.ts'

const SCHEMA = readFileSync(join(import.meta.dirname, '../schema.sql'), 'utf8')
const chunk = (title: string, text: string) => ({
  url: 'https://olake.io/docs/a/#x',
  pageUrl: 'https://olake.io/docs/a/',
  title,
  text
})

test('reads every index.html under the build folder, in a fixed order', () => {
  const dir = mkdtempSync(join(tmpdir(), 'build-'))
  const page = (path: string, text: string) => {
    mkdirSync(join(dir, path), { recursive: true })
    const html = `<link rel=canonical href=https://olake.io/${path}/ /><div class=theme-doc-markdown><h1>T</h1><p>${text}</p></div>`
    writeFileSync(join(dir, path, 'index.html'), html)
  }
  page('docs/b', 'Second.')
  page('docs/a', 'First.')
  writeFileSync(join(dir, 'docs/a/other.html'), '<p>Not a page.</p>')
  assert.deepEqual(
    siteChunks(dir).map((c) => [c.url, c.text]),
    [
      ['https://olake.io/docs/a/', 'First.'],
      ['https://olake.io/docs/b/', 'Second.']
    ]
  )
})

test('the SQL loads into SQLite, keeps quotes and semicolons, and the text is searchable', () => {
  const tricky =
    "It's a `WHERE name = 'x';` filter;\n-- not a comment\n```sql\nDROP TABLE chunks;\n```"
  const chunks = [
    chunk("Postgres > Filter's syntax", tricky),
    chunk('MySQL > Setup', 'Enable binlog replication.')
  ]
  const db = new DatabaseSync(':memory:')
  db.exec(toSql(chunks, SCHEMA))
  assert.deepEqual(
    db
      .prepare('SELECT id, url, title, text FROM chunks ORDER BY id')
      .all()
      .map((row) => ({ ...row })),
    chunks.map(({ url, title, text }, i) => ({ id: i + 1, url, title, text }))
  )
  const search = (query: string) =>
    db
      .prepare('SELECT rowid FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY rank')
      .all(query)
      .map((row) => row.rowid)
  assert.deepEqual(search('replicating'), [2], 'word forms match')
  assert.deepEqual(search('title:postgres'), [1])
  assert.deepEqual(search('kafka'), [])

  db.exec(toSql([chunks[1]], SCHEMA))
  assert.deepEqual(search('filter'), [], 'loading again replaces the index')
  assert.deepEqual(search('binlog'), [1])
})
