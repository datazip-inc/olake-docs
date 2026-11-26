import assert from 'node:assert/strict'
import { test } from 'node:test'
import { search, toQuery } from '../src/search.ts'
import { testDb } from './helpers.ts'

test('turns a question into its topic words, joined by OR', () => {
  assert.equal(
    toQuery('How do I enable CDC for Postgres in OLake?'),
    '"enable" OR "cdc" OR "postgres"'
  )
  assert.equal(
    toQuery('What does max_threads do in source.json?'),
    '"max_threads" OR "source.json"'
  )
  assert.equal(toQuery('cdc CDC Cdc'), '"cdc"', 'a word is searched once')
  assert.equal(
    toQuery('"; DROP TABLE chunks; --'),
    '"drop" OR "table" OR "chunks"',
    'no query syntax gets through'
  )
  assert.equal(
    toQuery('What is OLake?'),
    '"what" OR "is" OR "olake"',
    'only common words: all are kept'
  )
  assert.equal(toQuery('?!'), '')
})

const DOCS = 'https://olake.io/docs'
const db = testDb([
  {
    url: `${DOCS}/postgres/#cdc`,
    title: 'Postgres > CDC',
    text: 'Set wal_level to logical and create a replication slot.'
  },
  {
    url: `${DOCS}/postgres/#slots`,
    title: 'Postgres > Slots',
    text: 'A replication slot keeps WAL until it is read. Replication slot lag grows when a slot is unused.'
  },
  { url: `${DOCS}/mysql/#cdc`, title: 'MySQL > CDC', text: 'Enable the binlog with row format.' },
  {
    url: `${DOCS}/pg-to-x/#prepare`,
    title: 'Postgres to X > Prepare',
    text: 'Set wal_level to logical and create a replication slot.'
  },
  {
    url: 'https://olake.io/blog/slots/',
    title: 'Replication slots explained',
    text: 'A replication slot is a replication slot: slot, slot, replication.'
  }
])

test('finds the chunks that match, best first, and nothing for a question with no match', async () => {
  const hits = await search(db, 'how do I enable the binlog?')
  assert.deepEqual(
    hits.map((hit) => hit.url),
    [`${DOCS}/mysql/#cdc`]
  )
  assert.ok(
    hits[0].score > 0 && hits[0].title === 'MySQL > CDC' && hits[0].text.startsWith('Enable')
  )
  assert.deepEqual(await search(db, 'kubernetes helm chart'), [])
  assert.deepEqual(await search(db, '?'), [])
})

test('keeps one chunk per page and one copy of a repeated text', async () => {
  const urls = (await search(db, 'postgres replication slot wal_level')).map((hit) => hit.url)
  assert.equal(urls.filter((url) => url.startsWith(`${DOCS}/postgres/`)).length, 1)
  assert.ok(!urls.includes(`${DOCS}/pg-to-x/#prepare`), 'the same text as the Postgres CDC chunk')
  const all = (await search(db, 'postgres replication slot wal_level', { perPage: 5 })).map(
    (hit) => hit.url
  )
  assert.ok(all.includes(`${DOCS}/postgres/#cdc`) && all.includes(`${DOCS}/postgres/#slots`))
})

test('ranks the docs above a blog post that matches better', async () => {
  const plain = await search(db, 'replication slot', { blogWeight: 1 })
  assert.equal(plain[0].url, 'https://olake.io/blog/slots/')
  const weighted = await search(db, 'replication slot', { blogWeight: 0.3 })
  assert.equal(weighted[0].url, `${DOCS}/postgres/#slots`)
  assert.equal((await search(db, 'replication slot', { limit: 1 })).length, 1)
})
