import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Env } from '../src/guard.ts'
import { report } from '../src/report.ts'
import { testDb } from './helpers.ts'

const DB = testDb([])
const add = (id: string, question: string, uncertain: number, vote: number | null, age = 0) =>
  DB.sqlite
    .prepare(
      `INSERT INTO questions (id, at, channel, question, answer, sources, uncertain, cost, vote, reason)
       VALUES (?, unixepoch() - ?, 'web', ?, 'a', '[]', ?, 0.25, ?, ?)`
    )
    .run(id, age * 86400, question, uncertain, vote, vote === -1 ? 'Outdated Info' : null)
add('1', 'Does OLake support Cassandra?', 1, null)
add('2', 'does olake support cassandra?', 1, null, 2)
add('3', 'How do I set up CDC?', 0, 1)
add('4', '<script>alert(1)</script>', 0, -1)
add('5', 'An old question nobody answered', 1, null, 40)

const env = (fields: object = {}) =>
  ({
    DB,
    RATE_LIMIT: { limit: async () => ({ success: true }) },
    ADMIN_TOKEN: 's3cret-token',
    ...fields
  }) as unknown as Env
const open = (password?: string, e = env()) =>
  report(
    new Request('https://api.test/admin', {
      headers:
        password === undefined ? {} : { Authorization: `Basic ${btoa(`anyone:${password}`)}` }
    }),
    e
  )

test('is there only for the team: no page without the secret, no content without the password', async () => {
  assert.equal((await open('s3cret-token', env({ ADMIN_TOKEN: undefined }))).status, 404)
  for (const password of [undefined, '', 'wrong', 's3cret-token ']) {
    const response = await open(password)
    assert.equal(response.status, 401)
    assert.match(response.headers.get('WWW-Authenticate')!, /^Basic realm=/)
    assert.ok(!(await response.text()).includes('Cassandra'))
  }
  const limited = env({ RATE_LIMIT: { limit: async () => ({ success: false }) } })
  assert.equal((await open('s3cret-token', limited)).status, 429)
  const post = new Request('https://api.test/admin', { method: 'POST' })
  assert.equal((await report(post, env())).status, 404)
})

test('shows the totals, and the unanswered questions grouped and counted', async () => {
  const response = await open('s3cret-token')
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  const html = await response.text()
  assert.match(html, /<b>4<\/b>questions/)
  assert.match(html, /<b>50%<\/b>answered from the docs/)
  assert.match(html, /<b>1 \/ 1<\/b>thumbs up \/ down/)
  assert.match(html, /<b>\$1\.00<\/b>model cost/)
  assert.match(html, /<td>Does OLake support Cassandra\?<\/td><td>2<\/td>/, 'asked twice, one row')
  assert.match(html, /<td>Outdated Info<\/td>/)
  assert.ok(!html.includes('An old question'), 'older than 30 days')
})

test('shows what visitors typed as text, never as HTML', async () => {
  const html = await (await open('s3cret-token')).text()
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
})
