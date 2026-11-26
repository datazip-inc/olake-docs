import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { KEEP_TURNS, standalone, summarise, SUMMARISE_ABOVE } from '../src/memory.ts'
import { modelReply, sentTo } from './helpers.ts'

const call = { apiKey: 'test-key' }
const turns = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    question: `Question ${i + 1}?`,
    answer: `Answer ${i + 1}.`
  }))

afterEach(() => mock.restoreAll())

test('the first question of a conversation is searched as it is, without a model call', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['unused']))
  assert.equal(await standalone('How do I set up CDC?', [], '', call), 'How do I set up CDC?')
  assert.equal(fetched.mock.callCount(), 0)
})

test('rewrites a follow-up from the summary and the earlier turns', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () =>
    modelReply(['How do I set up CDC ', 'for MySQL?\n'])
  )
  const long = { question: 'How for Postgres?', answer: 'x'.repeat(5000) }
  const spent = { cost: 0 }
  assert.equal(
    await standalone('and for MySQL?', [long], 'The user runs OLake on Kubernetes.', {
      ...call,
      spent
    }),
    'How do I set up CDC for MySQL?'
  )
  const sent = sentTo(fetched)
  assert.match(sent.messages[0].content, /^You make follow-up questions searchable/)
  const asked: string = sent.messages[1].content
  assert.ok(
    asked.startsWith('Summary of the earlier conversation: The user runs OLake on Kubernetes.')
  )
  assert.ok(asked.endsWith('Follow-up: and for MySQL?'))
  assert.ok(asked.length < 1000, 'a long earlier answer is cut')
  assert.equal(spent.cost, 0.001, 'the call is added to what the request cost')
})

test('keeps the question as asked when the rewrite fails or comes back empty', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('down', { status: 502 }))
  assert.equal(await standalone('and for MySQL?', turns(1), '', call), 'and for MySQL?')
  mock.restoreAll()
  mock.method(globalThis, 'fetch', async () => modelReply([' ']))
  assert.equal(await standalone('and for MySQL?', turns(1), '', call), 'and for MySQL?')
})

test('keeps a follow-up that the model says stands alone', async () => {
  mock.method(globalThis, 'fetch', async () => modelReply(['SAME']))
  assert.equal(
    await standalone('What is the state file?', turns(1), '', call),
    'What is the state file?'
  )
})

test('summarises a long conversation, except its last turns', async () => {
  const fetched = mock.method(globalThis, 'fetch', async () => modelReply(['The user set up CDC.']))
  assert.equal(await summarise(turns(SUMMARISE_ABOVE), '', call), null, 'still short')
  assert.equal(fetched.mock.callCount(), 0)

  const result = await summarise(turns(SUMMARISE_ABOVE + 1), 'Earlier: Postgres.', call)
  assert.deepEqual(result, {
    summary: 'The user set up CDC.',
    summarized_turns: SUMMARISE_ABOVE + 1 - KEEP_TURNS
  })
  const asked: string = sentTo(fetched).messages[1].content
  assert.ok(asked.startsWith('Summary of the earlier conversation: Earlier: Postgres.'))
  assert.ok(
    asked.includes('Question 4?') && !asked.includes('Question 5?'),
    'the last turns stay out'
  )
})

test('gives no summary when the model fails: the turns are then sent again next time', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('down', { status: 502 }))
  assert.equal(await summarise(turns(SUMMARISE_ABOVE + 1), '', call), null)
})
