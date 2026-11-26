import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import type { Env } from '../src/guard.ts'
import worker from '../src/index.ts'
import { modelReply, sentTo, testDb } from './helpers.ts'

const CHUNKS = [
  {
    url: 'https://olake.io/docs/postgres/#cdc',
    title: 'Postgres > CDC',
    text: 'Set wal_level to logical.'
  },
  { url: 'https://olake.io/docs/mysql/#cdc', title: 'MySQL > CDC', text: 'Enable the binlog.' }
]
/** A fresh Worker environment: its own index and log, and a rate limit that lets everything through. */
const newEnv = (limit = async (_: { key: string }) => ({ success: true })) => ({
  DB: testDb(CHUNKS),
  RATE_LIMIT: { limit } as unknown as RateLimit,
  OPENROUTER_API_KEY: 'test-key',
  ALLOWED_ORIGINS: 'https://olake.io,http://localhost:3000',
  DAILY_BUDGET_USD: '3'
})
let env: Env & { DB: ReturnType<typeof testDb> } = newEnv()
const logged = () =>
  env.DB.sqlite.prepare('SELECT * FROM questions ORDER BY at').all() as Array<Record<string, any>>

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
const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  call(
    new Request(`https://api.test/${path}`, {
      method: 'POST',
      headers: { 'Origin': 'https://olake.io', 'CF-Connecting-IP': '203.0.113.7', ...headers },
      body: JSON.stringify(body)
    })
  )
const ask = (body: unknown, headers?: Record<string, string>) => post('ask', body, headers)

afterEach(() => {
  mock.restoreAll()
  env = newEnv()
})

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
  assert.deepEqual(sent.reasoning, { effort: 'none' })
  assert.match(
    sent.messages.at(-1).content,
    /\[1\] Postgres > CDC\n.*\n\nSet wal_level to logical\.[\s\S]*Question: How do I enable CDC on Postgres\?\n\n---\n/
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
  const sent = sentTo(fetched, 1)
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
  assert.equal((await post('other', {})).response.status, 404)
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
})

test('refuses another site, and a request with no Origin, before any work is done', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['Hi [1].']))
  for (const origin of ['https://evil.example', '']) {
    for (const path of ['ask', 'feedback']) {
      const { response } = await post(path, { question: 'postgres cdc' }, { Origin: origin })
      assert.equal(response.status, 403)
      assert.equal(response.headers.get('Access-Control-Allow-Origin'), null)
    }
  }
  assert.equal(fetched.mock.callCount(), 0)
  assert.equal(logged().length, 0)
})

test('limits how fast one visitor asks, by the address Cloudflare reports', async () => {
  const keys: string[] = []
  env = newEnv(async ({ key }) => ({ success: keys.push(key) <= 2 }))
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['Hi [1].']))
  const spoofed = { 'X-Forwarded-For': '198.51.100.1' }
  assert.equal((await ask({ question: 'postgres cdc' }, spoofed)).response.status, 200)
  assert.equal((await ask({ question: 'postgres cdc' }, spoofed)).response.status, 200)
  const third = await ask({ question: 'postgres cdc' }, spoofed)
  assert.equal(third.response.status, 429)
  assert.match(JSON.parse(third.text).error.message, /wait a minute/)
  assert.deepEqual(
    keys,
    ['203.0.113.7', '203.0.113.7', '203.0.113.7'],
    'a forged header is not read'
  )
  assert.equal(fetched.mock.callCount(), 2)
})

test('stops answering when the day has cost its budget, and starts again the next day', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['Hi [1].'], 1.6))
  const spend = (id: string, at: string, cost: number) =>
    env.DB.sqlite.exec(
      `INSERT INTO questions (id, at, channel, question, answer, sources, uncertain, cost) VALUES ('${id}', ${at}, 'web', 'q', 'a', '[]', 0, ${cost})`
    )
  spend('yesterday', 'unixepoch() - unixepoch() % 86400 - 1', 50)
  assert.equal((await ask({ question: 'postgres cdc' })).response.status, 200, 'costs 1.6')
  assert.equal((await ask({ question: 'postgres cdc' })).response.status, 200, 'now 3.2 spent')
  const refused = await ask({ question: 'postgres cdc' })
  assert.equal(refused.response.status, 429)
  assert.match(JSON.parse(refused.text).error.message, /all it can for today/)
  assert.equal(fetched.mock.callCount(), 2)
})

test('logs each question with its answer, sources and cost, and saves the vote on it', async () => {
  mock.method(globalThis, 'fetch', async () => modelReply(['Set it [1].'], 0.002))
  const { events } = await ask({ question: 'postgres cdc with PASSWORD=hunter22' })
  const { id } = events.at(-1)!.data
  const [row] = logged()
  assert.deepEqual(
    { ...row, at: 0 },
    {
      id,
      at: 0,
      channel: 'web',
      question: 'postgres cdc with PASSWORD=[redacted]',
      answer: 'Set it.',
      sources: '["https://olake.io/docs/postgres/#cdc"]',
      uncertain: 0,
      cost: 0.002,
      vote: null,
      reason: null
    }
  )
  assert.ok(Math.abs(row.at - Date.now() / 1000) < 5)

  const voted = await post('feedback', { id, vote: -1, reason: 'Outdated Info' })
  assert.equal(voted.response.status, 204)
  assert.equal(voted.response.headers.get('Access-Control-Allow-Origin'), 'https://olake.io')
  assert.deepEqual([logged()[0].vote, logged()[0].reason], [-1, 'Outdated Info'])
  for (const body of [{ id, vote: 5 }, { vote: 1 }, { id: 7, vote: 1 }, 'junk'])
    assert.equal((await post('feedback', body)).response.status, 400)
  assert.equal((await post('feedback', { id: 'no-such-answer', vote: 1 })).response.status, 204)
})

test('masks credentials before the model sees them, in the question and in earlier turns', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['Hi [1].']))
  await ask({
    question: 'why does postgres://olake:s3cr3t@db:5432/app fail with cdc?',
    history: [{ question: 'my token=abcdef123456', answer: 'Noted.' }]
  })
  const everything = fetched.mock.calls.map((c) => (c.arguments[1] as RequestInit).body).join('\n')
  assert.ok(!everything.includes('s3cr3t') && !everything.includes('abcdef123456'))
  assert.ok(everything.includes('postgres://olake:[redacted]@db:5432/app'))
})

test('searches for what a follow-up means, and answers the follow-up as it was asked', async () => {
  const fetched = mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) =>
    JSON.parse(init.body as string).messages[0].content.startsWith('You make follow-up')
      ? modelReply(['How do I enable the binlog for MySQL?'])
      : modelReply(['Enable it [1].'])
  )
  const history = [{ question: 'How do I set up Postgres?', answer: 'Set wal_level.' }]
  const { events } = await ask({ question: 'and the other database?', history })
  assert.equal(fetched.mock.callCount(), 2)
  const answered = sentTo(fetched, 1)
  assert.match(answered.messages.at(-1).content, /^Sources:\n\n\[1\] MySQL > CDC\n/)
  assert.match(
    answered.messages.at(-1).content,
    /Question: and the other database\?\n\(In full: How do I enable the binlog for MySQL\?\)\n\n---\n/
  )
  assert.deepEqual(events.at(-1)!.data.sources, [
    { url: 'https://olake.io/docs/mysql/#cdc', title: 'MySQL > CDC' }
  ])
  assert.equal(logged()[0].cost, 0.002, 'both model calls are counted')
})

test('summarises a long conversation and tells the browser how many turns that covers', async () => {
  const fetched = mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    const task: string = JSON.parse(init.body as string).messages[0].content
    if (task.startsWith('You make follow-up')) return modelReply(['postgres cdc'])
    if (task.startsWith('Summarise')) return modelReply(['They set up Postgres CDC.'])
    return modelReply(['Set it [1].'])
  })
  const history = Array.from({ length: 7 }, (_, i) => ({ question: `Q${i}`, answer: `A${i}` }))
  const long = await ask({ question: 'and then?', history, summary: 'Runs on Kubernetes.' })
  assert.equal(long.events.at(-1)!.data.summary, 'They set up Postgres CDC.')
  assert.equal(long.events.at(-1)!.data.summarized_turns, 4)
  const answered = fetched.mock.calls
    .map((_, n) => sentTo(fetched, n))
    .find((sent) => sent.messages[0].content.startsWith('You are Ask OLake'))
  assert.ok(answered.messages[0].content.endsWith('turns below:\nRuns on Kubernetes.'))
  assert.equal(answered.messages.length, 1 + 7 * 2 + 1)

  const short = await ask({ question: 'and then?', history: history.slice(0, 3) })
  assert.ok(!('summary' in short.events.at(-1)!.data))
})

test('refuses a request that is too large to be a question', async () => {
  const { response } = await ask({ question: 'postgres' }, { 'Content-Length': '100001' })
  assert.equal(response.status, 413)
  // Sent in pieces, with no length given: the bytes are counted, and the rest is not read.
  let pieces = 0
  const endless = new ReadableStream<Uint8Array>({
    pull(controller) {
      pieces++
      controller.enqueue(new TextEncoder().encode('x'.repeat(30_000)))
    }
  })
  const request = new Request('https://api.test/ask', {
    method: 'POST',
    headers: { Origin: 'https://olake.io' },
    body: endless,
    duplex: 'half'
  } as RequestInit)
  const refused = await worker.fetch(request, env, {
    waitUntil() {}
  } as unknown as ExecutionContext)
  assert.equal(refused.status, 413)
  assert.ok(pieces < 10, `read ${pieces} pieces`)
})

test('with a captcha set up, answers only a visitor who holds a pass of their own', async () => {
  env.TURNSTILE_SECRET = 'turnstile-secret'
  const siteverify: string[] = []
  mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    if (!url.includes('/turnstile/')) return modelReply(['Set it [1].'])
    siteverify.push(String(init.body))
    return Response.json({
      success: (init.body as URLSearchParams).get('response') === 'good-token'
    })
  })
  const refused = await ask({ question: 'postgres cdc' })
  assert.equal(refused.response.status, 401)
  assert.equal(logged().length, 0)

  assert.equal((await post('verify', { token: 'bad-token' })).response.status, 403)
  assert.equal((await post('verify', {})).response.status, 403)
  const verified = await post('verify', { token: 'good-token' })
  const { pass } = JSON.parse(verified.text)
  assert.match(pass, /^\d+\.[0-9a-f]{64}$/)
  assert.equal(siteverify[1], 'secret=turnstile-secret&response=good-token&remoteip=203.0.113.7')

  assert.equal((await ask({ question: 'postgres cdc', pass })).response.status, 200)
  // The pass of one address is no use from another, nor is a changed or a run-out one.
  const elsewhere = await ask(
    { question: 'postgres cdc', pass },
    { 'CF-Connecting-IP': '198.51.100.9' }
  )
  assert.equal(elsewhere.response.status, 401)
  const [expires, signature] = pass.split('.')
  for (const forged of [
    `${Number(expires) + 60}.${signature}`,
    `${expires}.${'0'.repeat(64)}`,
    `1.${signature}`,
    7
  ])
    assert.equal((await ask({ question: 'postgres cdc', pass: forged })).response.status, 401)
})
