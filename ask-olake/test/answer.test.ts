import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildMessages, finish, withoutMarks } from '../src/answer.ts'

const hit = (n: number) => ({
  url: `https://olake.io/docs/p${n}/`,
  title: `Page ${n}`,
  text: `Text ${n}.`,
  score: 1
})

test('builds the conversation: rules, earlier turns, then numbered sources and the question', () => {
  const messages = buildMessages(
    'And for MySQL?',
    [hit(1), hit(2)],
    [{ question: 'How for Postgres?', answer: 'Use a slot.' }]
  )
  assert.deepEqual(
    messages.map((m) => m.role),
    ['system', 'user', 'assistant', 'user']
  )
  assert.equal(messages[1].content, 'How for Postgres?')
  assert.equal(messages[2].content, 'Use a slot.')
  assert.equal(
    messages[3].content,
    'Sources:\n\n[1] Page 1\nhttps://olake.io/docs/p1/\n\nText 1.\n\n---\n\n[2] Page 2\nhttps://olake.io/docs/p2/\n\nText 2.\n\n---\n\nQuestion: And for MySQL?'
  )
})

test('removes citation marks from a stream, however the pieces are cut', () => {
  const reply =
    'Set `wal_level` [1]. Then create a slot [2][3], see args[0] and [SOURCE-TYPE] [1, 2].\n\n1. Run it [12]'
  const clean = 'Set `wal_level`. Then create a slot, see args[0] and [SOURCE-TYPE].\n\n1. Run it'
  for (const size of [1, 2, 3, 5, 8, 200]) {
    const visible = withoutMarks()
    let shown = ''
    for (let i = 0; i < reply.length; i += size) shown += visible(reply.slice(i, i + size))
    assert.equal(shown, clean, `pieces of ${size}`)
  }
})

test('shows text as soon as it cannot be part of a mark', () => {
  const visible = withoutMarks()
  assert.equal(visible('Use a slot'), 'Use a slot')
  assert.equal(visible(' ['), '', 'may be the start of a mark')
  assert.equal(visible('optional] flag'), ' [optional] flag')
})

test('finishes an answer: marks removed, cited sources in the order of citing, once each', () => {
  const result = finish('Create a slot [2]. Set the level [1][2]. Ignore [9] and [0].', [
    hit(1),
    hit(2),
    hit(3)
  ])
  assert.deepEqual(result, {
    answer: 'Create a slot. Set the level. Ignore and.',
    sources: [
      { url: 'https://olake.io/docs/p2/', title: 'Page 2' },
      { url: 'https://olake.io/docs/p1/', title: 'Page 1' }
    ],
    uncertain: false
  })
})

test('an answer that cites nothing is marked uncertain', () => {
  assert.deepEqual(finish("I couldn't find this in the OLake documentation.", [hit(1)]), {
    answer: "I couldn't find this in the OLake documentation.",
    sources: [],
    uncertain: true
  })
})
