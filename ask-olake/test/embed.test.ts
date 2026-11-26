import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { compact, embedChunks } from '../ingest/embed.ts'
import { DIMS } from '../src/search.ts'

afterEach(() => mock.restoreAll())

test('keeps the first numbers of an embedding, as 8-bit integers of one length', () => {
  const vector = compact([3, 4, ...new Array(1022).fill(0)])
  assert.equal(vector.length, DIMS)
  assert.deepEqual([...vector.slice(0, 3)], [76, 102, 0], '3-4-5 triangle scaled to 127')
  assert.deepEqual([...compact(new Array(1024).fill(0))], new Array(DIMS).fill(0))
})

test('embeds every chunk with its title, in batches, and keeps the order', async () => {
  // The fake model answers each text with a vector that points along the number in the text.
  const fetched = mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    const { text } = JSON.parse(init.body as string) as { text: string[] }
    const data = text.map((t) => {
      const vector = new Array(1024).fill(0)
      vector[Number(/chunk (\d+)/.exec(t)![1])] = 1
      return vector
    })
    return Response.json({ success: true, result: { data } })
  })
  const chunks = Array.from({ length: 70 }, (_, i) => ({
    url: 'https://olake.io/docs/a/',
    pageUrl: 'https://olake.io/docs/a/',
    title: `Title ${i}`,
    text: `chunk ${i}`
  }))
  const vectors = await embedChunks(chunks, 'account-1', 'token-1')
  assert.equal(vectors.length, 70 * DIMS)
  for (let i = 0; i < 70; i++) assert.equal(vectors[i * DIMS + i], 127, `chunk ${i}`)
  assert.equal(fetched.mock.callCount(), 3, '32 + 32 + 6')
  const [url, init] = fetched.mock.calls[0].arguments as [string, RequestInit]
  assert.match(url, /\/accounts\/account-1\/ai\/run\/@cf\/qwen\/qwen3-embedding-0\.6b$/)
  assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer token-1')
  assert.equal(JSON.parse(init.body as string).text[0], 'Title 0\n\nchunk 0')
})
