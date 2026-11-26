import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import worker, { type Env } from '../src/index.ts'
import { modelReply, testDb } from './helpers.ts'

const env: Env = {
  DB: testDb([
    {
      url: 'https://olake.io/docs/postgres/#cdc',
      title: 'Postgres > CDC',
      text: 'Set wal_level to logical.'
    },
    { url: 'https://olake.io/docs/mysql/#cdc', title: 'MySQL > CDC', text: 'Enable the binlog.' }
  ]),
  OPENROUTER_API_KEY: 'test-key',
  ALLOWED_ORIGINS: 'https://olake.io,http://localhost:3000'
}

/** Calls the Worker and waits for the work it does after it has started to answer. */
async function call(request: Request) {
  const pending: Promise<unknown>[] = []
  const ctx = {
    waitUntil: (promise: Promise<unknown>) => pending.push(promise)
  } as unknown as ExecutionContext
  const response = await worker.fetch(request, env, ctx)
  const text = await response.text()
  await Promise.all(pending)
  const isStream = response.headers.get('Content-Type') === 'text/event-stream'
  const events = (isStream ? text.split('\n\n').filter(Boolean) : []).map((block) => ({
    event: /^event: (.*)$/m.exec(block)![1],
    data: JSON.parse(/^data: (.*)$/m.exec(block)![1])
  }))
  return { response, text, events }
}
const ask = (body: unknown, origin = 'https://olake.io') =>
  call(
    new Request('https://api.test/ask', {
      method: 'POST',
      headers: { Origin: origin },
      body: JSON.stringify(body)
    })
  )

afterEach(() => mock.restoreAll())

test('streams the answer without citation marks, then the final answer with its sources', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () =>
    modelReply(['Set `wal_level`', ' to logical', ' [1', '].'])
  )
  const { response, events } = await ask({ question: 'How do I enable CDC on Postgres?' })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Content-Type'), 'text/event-stream')
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://olake.io')
  const deltas = events.filter((e) => e.event === 'delta').map((e) => e.data)
  assert.equal(deltas.join(''), 'Set `wal_level` to logical.')
  const final = events.at(-1)!
  assert.equal(final.event, 'final')
  assert.match(final.data.id, /^[0-9a-f-]{36}$/)
  assert.deepEqual(
    { ...final.data, id: '' },
    {
      id: '',
      answer: 'Set `wal_level` to logical.',
      sources: [{ url: 'https://olake.io/docs/postgres/#cdc', title: 'Postgres > CDC' }],
      uncertain: false
    }
  )

  const [url, init] = fetched.mock.calls[0].arguments as [string, RequestInit]
  assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions')
  assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer test-key')
  const sent = JSON.parse(init.body as string)
  assert.equal(sent.stream, true)
  assert.match(
    sent.messages.at(-1).content,
    /\[1\] Postgres > CDC\n.*\n\nSet wal_level to logical\.[\s\S]*Question: How do I enable CDC on Postgres\?$/
  )
})

test('passes the earlier turns to the model, and only well-formed ones', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () =>
    modelReply(['Enable the binlog [1].'])
  )
  const history = [
    { question: 'How for Postgres?', answer: 'Set wal_level.' },
    { question: 5 },
    'junk'
  ]
  await ask({ question: 'And the binlog for MySQL?', history })
  const sent = JSON.parse((fetched.mock.calls[0].arguments[1] as RequestInit).body as string)
  assert.deepEqual(sent.messages.slice(1, -1), [
    { role: 'user', content: 'How for Postgres?' },
    { role: 'assistant', content: 'Set wal_level.' }
  ])
})

test('says it found nothing, without calling the model, when no chunk matches', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['unused']))
  const { events } = await ask({ question: 'kubernetes autoscaling' })
  assert.equal(fetched.mock.callCount(), 0)
  assert.deepEqual(
    events.map((e) => e.event),
    ['final']
  )
  assert.equal(events[0].data.answer, "I couldn't find this in the OLake documentation.")
  assert.equal(events[0].data.uncertain, true)
  assert.deepEqual(events[0].data.sources, [])
})

test('sends an error event when the model fails, without the cause', async () => {
  mock.method(console, 'error', () => {})
  mock.method(
    globalThis,
    'fetch',
    async () => new Response('{"error":{"message":"secret detail"}}', { status: 502 })
  )
  const { text, events } = await ask({ question: 'postgres cdc' })
  assert.deepEqual(
    events.map((e) => e.event),
    ['error']
  )
  assert.ok(events[0].data.message.startsWith("Couldn't write an answer"))
  assert.ok(!text.includes('secret detail') && !text.includes('502'))
})

test('refuses a request that is not a question', async () => {
  mock.method(globalThis, 'fetch', async () => modelReply(['unused']))
  for (const body of [
    {},
    { question: '   ' },
    { question: 7 },
    'not json{',
    { question: 'x'.repeat(4001) }
  ]) {
    const { response, text } = await ask(body)
    assert.equal(response.status, 400)
    assert.equal(typeof JSON.parse(text).error.message, 'string')
  }
  const get = await call(new Request('https://api.test/ask'))
  assert.equal(get.response.status, 404)
  const other = await call(new Request('https://api.test/other', { method: 'POST', body: '{}' }))
  assert.equal(other.response.status, 404)
})

test('answers the preflight request, and allows only the listed sites', async () => {
  const preflight = (origin: string) =>
    worker.fetch(
      new Request('https://api.test/ask', { method: 'OPTIONS', headers: { Origin: origin } }),
      env,
      {} as ExecutionContext
    )
  const allowed = await preflight('http://localhost:3000')
  assert.equal(allowed.status, 204)
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), 'http://localhost:3000')
  assert.equal(allowed.headers.get('Access-Control-Allow-Headers'), 'Content-Type')
  assert.equal(
    (await preflight('https://evil.example')).headers.get('Access-Control-Allow-Origin'),
    null
  )
  mock.method(globalThis, 'fetch', async () => modelReply(['Hi [1].']))
  const { response } = await ask({ question: 'postgres cdc' }, 'https://evil.example')
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null)
})
