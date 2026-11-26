import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { afterEach, mock, test } from 'node:test'
import type { Env } from '../src/guard.ts'
import { plain, slackEvents, threadTurns } from '../src/slack.ts'
import { modelReply, sentTo, testDb } from './helpers.ts'

const SECRET = 'signing-secret'
const BOT = 'UBOT'
const newEnv = (limit = async (_: { key: string }) => ({ success: true })) => ({
  DB: testDb([
    {
      url: 'https://olake.io/docs/postgres/#cdc',
      title: 'Postgres > CDC [beta]',
      text: 'Set wal_level to logical.'
    },
    { url: 'https://olake.io/docs/mysql/#cdc', title: 'MySQL > CDC', text: 'Enable the binlog.' }
  ]),
  RATE_LIMIT: { limit } as unknown as RateLimit,
  OPENROUTER_API_KEY: 'test-key',
  ALLOWED_ORIGINS: 'https://olake.io',
  DAILY_BUDGET_USD: '3',
  SLACK_SIGNING_SECRET: SECRET,
  SLACK_BOT_TOKEN: 'xoxb-test'
})
let env: Env & { DB: ReturnType<typeof testDb> } = newEnv()

/** Sends a payload to the Worker the way Slack does, and waits for the reply written after the response. */
async function deliver(
  payload: unknown,
  { secret = SECRET, age = 0, headers = {} as Record<string, string> } = {}
) {
  const body = JSON.stringify(payload)
  const timestamp = String(Math.floor(Date.now() / 1000) - age)
  const signature = createHmac('sha256', secret).update(`v0:${timestamp}:${body}`).digest('hex')
  const pending: Promise<unknown>[] = []
  const response = await slackEvents(
    new Request('https://api.test/slack/events', {
      method: 'POST',
      headers: {
        'X-Slack-Request-Timestamp': timestamp,
        'X-Slack-Signature': `v0=${signature}`,
        ...headers
      },
      body
    }),
    env,
    {
      waitUntil: (promise: Promise<unknown>) => pending.push(promise)
    } as unknown as ExecutionContext
  )
  await Promise.all(pending)
  return response
}
const event = (fields: Record<string, unknown>) => ({
  type: 'event_callback',
  authorizations: [{ user_id: BOT }],
  event: { type: 'app_mention', user: 'U1', channel: 'C1', ts: '100.1', ...fields }
})

/** Fakes OpenRouter and Slack's Web API. Returns what was sent to each Slack method. */
function fakeServices(thread: unknown[] = []) {
  const slack: Array<{ method: string; args: Record<string, string>; token: string }> = []
  const fetched = mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    if (!url.startsWith('https://slack.com/api/')) {
      const task: string = JSON.parse(init.body as string).messages[0].content
      return task.startsWith('You make follow-up')
        ? modelReply(['How do I enable the binlog for MySQL?'])
        : modelReply(['Set `wal_level` [1].'], 0.002)
    }
    const method = url.split('/').pop()!
    slack.push({
      method,
      args: Object.fromEntries(init.body as URLSearchParams),
      token: (init.headers as Record<string, string>).Authorization
    })
    return Response.json(
      method === 'conversations.replies'
        ? { ok: true, messages: thread }
        : { ok: true, ts: '200.5' }
    )
  })
  return { slack, fetched }
}

afterEach(() => {
  mock.restoreAll()
  env = newEnv()
})

test('accepts only requests signed by Slack, and not old ones', async () => {
  const { fetched } = fakeServices()
  const mention = event({ text: '<@UBOT> postgres cdc' })
  assert.equal((await deliver(mention, { secret: 'wrong' })).status, 401)
  assert.equal((await deliver(mention, { age: 301 })).status, 401, 'older than five minutes')
  assert.equal((await deliver(mention, { headers: { 'X-Slack-Signature': 'v0=zz' } })).status, 401)
  const unsigned = new Request('https://api.test/slack/events', { method: 'POST', body: '{}' })
  assert.equal((await slackEvents(unsigned, env, {} as ExecutionContext)).status, 401)
  assert.equal(fetched.mock.callCount(), 0)

  env.SLACK_BOT_TOKEN = undefined
  assert.equal((await deliver(mention)).status, 401, 'Slack is not set up')
})

test('answers the check Slack makes when the URL is saved', async () => {
  const response = await deliver({ type: 'url_verification', challenge: 'abc123' })
  assert.deepEqual(await response.json(), { challenge: 'abc123' })
})

test('answers a mention in a thread under it, with the sources as links', async () => {
  const { slack, fetched } = fakeServices()
  const response = await deliver(event({ text: '<@UBOT> how do I set up postgres cdc?' }))
  assert.equal(response.status, 200)
  assert.equal(slack.length, 1)
  const [{ method, args, token }] = slack
  assert.equal(method, 'chat.postMessage')
  assert.equal(token, 'Bearer xoxb-test')
  assert.equal(args.channel, 'C1')
  assert.equal(args.thread_ts, '100.1')
  const text =
    'Set `wal_level`.\n\nSources: [Postgres > CDC beta](https://olake.io/docs/postgres/#cdc)'
  assert.equal(args.text, text)
  assert.deepEqual(JSON.parse(args.blocks), [{ type: 'markdown', text }])
  assert.match(
    sentTo(fetched).messages.at(-1).content,
    /Question: how do I set up postgres cdc\?\n\n---\n/
  )

  const [row] = env.DB.sqlite.prepare('SELECT * FROM questions').all()
  assert.deepEqual(
    [row.id, row.channel, row.question, row.answer, row.cost],
    ['slack:C1:200.5', 'slack', 'how do I set up postgres cdc?', 'Set `wal_level`.', 0.002]
  )
})

test('answers a follow-up in a thread with the thread as its context', async () => {
  const { slack, fetched } = fakeServices([
    { user: 'U1', text: '<@UBOT> how do I set up postgres cdc?', ts: '100.1' },
    { user: BOT, bot_id: 'B1', text: 'Set `wal_level`.', ts: '100.2' },
    { user: 'U2', text: 'thanks', ts: '100.3' }
  ])
  await deliver(
    event({ text: '<@UBOT> and for the other database?', ts: '100.4', thread_ts: '100.1' })
  )
  assert.deepEqual(
    slack.map((call) => call.method),
    ['conversations.replies', 'chat.postMessage']
  )
  assert.deepEqual(slack[0].args, { channel: 'C1', ts: '100.1', latest: '100.4', limit: '50' })
  assert.equal(slack[1].args.thread_ts, '100.1')
  // The calls, in order: the thread, the rewrite, the answer, the post.
  assert.match(
    sentTo(fetched, 1).messages[1].content,
    /User: how do I set up postgres cdc\?\nAssistant: Set `wal_level`\./
  )
  const answered = sentTo(fetched, 2)
  assert.match(answered.messages.at(-1).content, /^Sources:\n\n\[1\] MySQL > CDC\n/)
  assert.deepEqual(answered.messages.slice(1, 3), [
    { role: 'user', content: 'how do I set up postgres cdc?' },
    { role: 'assistant', content: 'Set `wal_level`.' }
  ])
})

test('answers a direct message, and leaves alone what is not a question to it', async () => {
  const { slack } = fakeServices()
  await deliver(event({ type: 'message', channel_type: 'im', channel: 'D1', text: 'postgres cdc' }))
  assert.equal(slack.length, 1)
  assert.equal(slack[0].args.channel, 'D1')

  for (const ignored of [
    event({ type: 'message', channel_type: 'channel', text: 'postgres cdc' }),
    event({ type: 'message', channel_type: 'im', text: 'postgres cdc', bot_id: 'B1' }),
    event({ type: 'message', channel_type: 'im', text: 'postgres cdc', user: BOT }),
    event({
      type: 'message',
      channel_type: 'im',
      text: 'postgres cdc',
      subtype: 'message_changed'
    }),
    event({ type: 'reaction_added' }),
    { type: 'event_callback' }
  ])
    assert.equal((await deliver(ignored)).status, 200)
  const retry = await deliver(event({ text: 'postgres cdc' }), {
    headers: { 'X-Slack-Retry-Num': '1' }
  })
  assert.equal(retry.status, 200)
  assert.equal(slack.length, 1, 'none of these was answered')
})

test('tells the asker when they ask too fast, masks credentials, and reports a failure', async () => {
  const keys: string[] = []
  env = newEnv(async ({ key }) => ({ success: keys.push(key) > 1 }))
  const { slack, fetched } = fakeServices()
  await deliver(event({ text: '<@UBOT> postgres cdc' }))
  assert.deepEqual(keys, ['slack:U1'])
  assert.match(slack[0].args.text, /wait a minute/)
  assert.equal(fetched.mock.callCount(), 1, 'no model call')

  await deliver(event({ text: '<@UBOT> postgres cdc with password=hunter22' }))
  assert.ok(!JSON.stringify(sentTo(fetched, 1)).includes('hunter22'))
  assert.equal(
    env.DB.sqlite.prepare('SELECT question FROM questions').get()!.question,
    'postgres cdc with password=[redacted]'
  )

  await deliver(event({ text: '<@UBOT>' }))
  assert.equal(slack.at(-1)!.args.text, 'Ask me a question about OLake.')

  mock.restoreAll()
  mock.method(console, 'error', () => {})
  const posted: string[] = []
  mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    if (!url.startsWith('https://slack.com/')) return new Response('down', { status: 502 })
    posted.push((init.body as URLSearchParams).get('text')!)
    return Response.json({ ok: true })
  })
  await deliver(event({ text: '<@UBOT> postgres cdc' }))
  assert.deepEqual(posted, ["Couldn't write an answer right now. Please try again in a moment."])
})

test('reads a Slack message as plain text', () => {
  assert.equal(
    plain(
      '<@UBOT> see <https://olake.io/docs|the docs> or <https://x.io> &amp; a &lt;tag&gt; in <#C1|general>'
    ),
    'see the docs or https://x.io & a <tag> in general'
  )
  assert.equal(plain(undefined), '')
})

test('turns a thread into turns: what people wrote, then what the bot answered', () => {
  assert.deepEqual(
    threadTurns(
      [
        { user: 'U1', text: 'first', ts: '1' },
        { user: 'U2', text: 'with token=abcdef123', ts: '2' },
        { user: BOT, text: 'answer one', ts: '3' },
        { user: BOT, text: 'a second message of the bot', ts: '4' },
        { user: 'U1', text: 'not answered yet', ts: '5' }
      ],
      BOT
    ),
    [{ question: 'first\nwith token=[redacted]', answer: 'answer one' }]
  )
})

test('saves a thumbs reaction on an answer as a vote on it', async () => {
  fakeServices()
  await deliver(event({ text: '<@UBOT> postgres cdc' }))
  const row = () => env.DB.sqlite.prepare('SELECT id, vote FROM questions').get()!
  assert.deepEqual({ ...row() }, { id: 'slack:C1:200.5', vote: null })
  const react = (reaction: string, fields: object = {}) =>
    deliver({
      type: 'event_callback',
      authorizations: [{ user_id: BOT }],
      event: {
        type: 'reaction_added',
        user: 'U1',
        reaction,
        item_user: BOT,
        item: { type: 'message', channel: 'C1', ts: '200.5' },
        ...fields
      }
    })
  await react('eyes')
  await react('-1', { item_user: 'U2' })
  await react('+1', { item: { type: 'message', channel: 'C1', ts: '999.9' } })
  assert.equal(row().vote, null, 'not a thumb, not on the bot, not on this answer')
  await react('+1::skin-tone-3')
  assert.equal(row().vote, 1)
  await react('thumbsdown')
  assert.equal(row().vote, -1, 'a later thumb replaces the earlier one')
})
