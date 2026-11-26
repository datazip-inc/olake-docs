import assert from 'node:assert/strict'
import { mock, test } from 'node:test'
import { DIMS, search, toQuery } from '../src/search.ts'
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
  const hits = await search({ DB: db }, 'how do I enable the binlog?')
  assert.deepEqual(
    hits.map((hit) => hit.url),
    [`${DOCS}/mysql/#cdc`]
  )
  assert.ok(
    hits[0].score > 0 && hits[0].title === 'MySQL > CDC' && hits[0].text.startsWith('Enable')
  )
  assert.deepEqual(await search({ DB: db }, 'kubernetes helm chart'), [])
  assert.deepEqual(await search({ DB: db }, '?'), [])
})

test('limits the chunks of one page, and keeps one copy of a repeated text', async () => {
  const question = 'postgres replication slot wal_level'
  const urls = (await search({ DB: db }, question, { perPage: 1 })).map((hit) => hit.url)
  assert.equal(urls.filter((url) => url.startsWith(`${DOCS}/postgres/`)).length, 1)
  assert.ok(!urls.includes(`${DOCS}/pg-to-x/#prepare`), 'the same text as the Postgres CDC chunk')
  const all = (await search({ DB: db }, question)).map((hit) => hit.url)
  assert.ok(all.includes(`${DOCS}/postgres/#cdc`) && all.includes(`${DOCS}/postgres/#slots`))
})

test('ranks the docs above a blog post that matches better', async () => {
  const plain = await search({ DB: db }, 'replication slot', { blogWeight: 1 })
  assert.equal(plain[0].url, 'https://olake.io/blog/slots/')
  const weighted = await search({ DB: db }, 'replication slot', { blogWeight: 0.3 })
  assert.equal(weighted[0].url, `${DOCS}/postgres/#slots`)
  assert.equal((await search({ DB: db }, 'replication slot', { limit: 1 })).length, 1)
})

// A vector that points along one axis, and the AI binding that embeds every question as `axis`.
const along = (axis: number) => Int8Array.from({ length: DIMS }, (_, k) => (k === axis ? 127 : 0))
const ai = (axis: number) =>
  ({
    run: async () => ({ data: [Array.from(along(axis), (value) => value / 127)] })
  }) as unknown as Ai
const vectorsOf = (axes: number[]) => {
  const vectors = new Int8Array(axes.length * DIMS)
  axes.forEach((axis, i) => vectors.set(along(axis), i * DIMS))
  return vectors
}
const PAGES = [
  { url: `${DOCS}/mysql/`, title: 'MySQL', text: 'Enable the binlog with row format.' },
  { url: `${DOCS}/slots/`, title: 'Slots', text: 'A slot keeps WAL until it is read.' },
  { url: `${DOCS}/kafka/`, title: 'Kafka', text: 'Topics are read as streams.' }
]

test('adds the chunks closest in meaning to the ones that match by keyword', async () => {
  const withVectors = testDb(PAGES, vectorsOf([0, 1, 2]))
  withVectors.sqlite.exec('UPDATE index_info SET built = 101')
  const urls = async (AI?: Ai) =>
    (await search({ DB: withVectors, AI }, 'how do I enable the binlog?')).map((hit) => hit.url)
  assert.deepEqual(await urls(), [`${DOCS}/mysql/`], 'by keyword alone')
  // The question means what the Kafka chunk means, which shares no word with it.
  assert.deepEqual(await urls(ai(2)), [`${DOCS}/mysql/`, `${DOCS}/kafka/`, `${DOCS}/slots/`])
  // Found by both searches: first, however many others there are.
  assert.equal((await urls(ai(0)))[0], `${DOCS}/mysql/`)
})

test('reads the vectors again when the index has been replaced', async () => {
  const replaced = testDb(PAGES, vectorsOf([0, 1, 2]))
  replaced.sqlite.exec('UPDATE index_info SET built = 201')
  const second = async () => (await search({ DB: replaced, AI: ai(2) }, 'binlog'))[1].url
  assert.equal(await second(), `${DOCS}/kafka/`)
  const data = Buffer.from(vectorsOf([0, 2, 1]).buffer).toString('base64')
  replaced.sqlite.exec(`UPDATE vectors SET data = '${data}'; UPDATE index_info SET built = 202`)
  assert.equal(await second(), `${DOCS}/slots/`)
})

test('searches by keyword alone when the index has no vectors or Workers AI fails', async () => {
  const noVectors = testDb(PAGES)
  noVectors.sqlite.exec('UPDATE index_info SET built = 301')
  assert.deepEqual(
    (await search({ DB: noVectors, AI: ai(2) }, 'binlog')).map((hit) => hit.url),
    [`${DOCS}/mysql/`]
  )
  const logged = mock.method(console, 'error', () => {})
  const failing = { run: async () => Promise.reject(new Error('down')) } as unknown as Ai
  assert.deepEqual(
    (await search({ DB: noVectors, AI: failing }, 'binlog')).map((hit) => hit.url),
    [`${DOCS}/mysql/`]
  )
  assert.equal(logged.mock.callCount(), 1)
  mock.restoreAll()
})
