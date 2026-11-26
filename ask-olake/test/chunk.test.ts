import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MAX_CHARS, MIN_CHARS, chunkSections } from '../ingest/chunk.ts'
import type { Section } from '../ingest/html.ts'

const PAGE = 'https://olake.io/docs/a/'
const section = (heading: string, text: string, pageUrl = PAGE): Section => ({
  pageUrl,
  url: heading ? `${pageUrl}#${heading.toLowerCase()}` : pageUrl,
  pageTitle: 'Page A',
  heading,
  text
})
const words = (n: number, word = 'lorem') => Array.from({ length: n }, () => word).join(' ')
const medium = words(60) // 359 characters: above MIN_CHARS, far below MAX_CHARS

test('one chunk per section, with the heading in the title and the anchor in the URL', () => {
  const chunks = chunkSections([section('', medium), section('Setup', medium)])
  assert.deepEqual(
    chunks.map((c) => [c.title, c.url, c.pageUrl]),
    [
      ['Page A', PAGE, PAGE],
      ['Page A > Setup', `${PAGE}#setup`, PAGE]
    ]
  )
  assert.equal(chunks[1].text, medium)
})

test('a short section joins its neighbour on the same page, heading kept as a bold line', () => {
  assert.ok('Short intro.'.length < MIN_CHARS)
  const forward = chunkSections([section('', 'Short intro.'), section('Setup', medium)])
  assert.equal(forward.length, 1)
  assert.equal(forward[0].url, PAGE)
  assert.equal(forward[0].text, `Short intro.\n\n**Setup**\n\n${medium}`)

  const backward = chunkSections([section('Setup', medium), section('Note', 'Tiny note.')])
  assert.equal(backward.length, 1)
  assert.equal(backward[0].title, 'Page A > Setup')
  assert.equal(backward[0].text, `${medium}\n\n**Note**\n\nTiny note.`)
})

test('short sections are not joined across pages, or when the result would be too long', () => {
  const other = 'https://olake.io/docs/b/'
  assert.equal(chunkSections([section('', 'Short.'), section('', medium, other)]).length, 2)
  const nearlyFull = words(Math.floor(MAX_CHARS / 6) - 5)
  assert.ok(nearlyFull.length <= MAX_CHARS && nearlyFull.length + 40 > MAX_CHARS)
  assert.equal(
    chunkSections([
      section('', 'Short text, forty chars long, more or less.'),
      section('Big', nearlyFull)
    ]).length,
    2
  )
})

test('a long section is split at paragraph breaks into numbered parts within the limit', () => {
  const paragraphs = Array.from({ length: 12 }, (_, i) => `Paragraph ${i}. ${words(60)}`)
  const chunks = chunkSections([section('Long', paragraphs.join('\n\n'))])
  assert.ok(chunks.length > 1)
  assert.ok(chunks.every((c) => c.text.length <= MAX_CHARS))
  assert.deepEqual(
    chunks.map((c) => c.title),
    chunks.map((_, i) => (i ? `Page A > Long (part ${i + 1})` : 'Page A > Long'))
  )
  assert.ok(chunks.every((c) => c.url === `${PAGE}#long`))
  // nothing lost, nothing duplicated, every paragraph whole
  assert.equal(chunks.map((c) => c.text).join('\n\n'), paragraphs.join('\n\n'))
})

test('a code block with blank lines inside is kept in one piece', () => {
  const code = '```yaml\na: 1\n\nb: 2\n\nc: 3\n```'
  const text = [words(170), code, words(170)].join('\n\n')
  assert.ok(text.length > MAX_CHARS)
  const chunks = chunkSections([section('Code', text)])
  assert.equal(chunks.filter((c) => c.text.includes(code)).length, 1)
  assert.ok(
    chunks.every((c) => (c.text.match(/```/g) ?? []).length % 2 === 0),
    'no unclosed fence'
  )
})

test('a code block longer than the limit is split by lines, and every part is fenced', () => {
  const lines = Array.from({ length: 120 }, (_, i) => `key_${i}: ${words(4)}`)
  const chunks = chunkSections([section('Config', `\`\`\`yaml\n${lines.join('\n')}\n\`\`\``)])
  assert.ok(chunks.length > 1)
  assert.ok(
    chunks.every(
      (c) =>
        c.text.startsWith('```yaml\n') && c.text.endsWith('\n```') && c.text.length <= MAX_CHARS
    )
  )
  const seen = chunks.flatMap((c) => c.text.split('\n').slice(1, -1))
  assert.deepEqual(seen, lines, 'every line appears exactly once, in order')
})

test('a long list of steps is split between the steps, never inside a code block', () => {
  const steps = Array.from(
    { length: 30 },
    (_, i) => `- Step ${i}: ${words(8)}\n  \`\`\`bash\n  run --step ${i}\n\n  check\n  \`\`\``
  )
  const chunks = chunkSections([section('Steps', steps.join('\n'))])
  assert.ok(chunks.length > 1 && chunks.every((c) => c.text.length <= MAX_CHARS))
  assert.ok(
    chunks.every((c) => (c.text.match(/```/g) ?? []).length % 2 === 0),
    'no unclosed fence'
  )
  assert.ok(
    chunks.every((c) => c.text.startsWith('- Step')),
    'every part starts at a step'
  )
  assert.equal(chunks.map((c) => c.text).join('\n'), steps.join('\n'))
})

test('a long table is split by rows and every part repeats the header', () => {
  const header = '| Key | Description |\n| --- | --- |'
  const rows = Array.from({ length: 60 }, (_, i) => `| key_${i} | ${words(8)} |`)
  const chunks = chunkSections([section('Table', `${header}\n${rows.join('\n')}`)])
  assert.ok(chunks.length > 1)
  assert.ok(chunks.every((c) => c.text.startsWith(header) && c.text.length <= MAX_CHARS))
  const seen = chunks.flatMap((c) => c.text.split('\n').slice(2))
  assert.deepEqual(seen, rows, 'every row appears exactly once, in order')
})

test('a block with no blank lines is split at line ends, and one endless line is cut', () => {
  const lines = Array.from({ length: 80 }, (_, i) => `line ${i} ${words(6)}`)
  const byLine = chunkSections([section('Lines', lines.join('\n'))])
  assert.ok(byLine.length > 1 && byLine.every((c) => c.text.length <= MAX_CHARS))
  assert.equal(byLine.map((c) => c.text).join('\n'), lines.join('\n'))

  const endless = 'x'.repeat(MAX_CHARS * 2 + 10)
  const cut = chunkSections([section('Endless', endless)])
  assert.deepEqual(
    cut.map((c) => c.text.length),
    [MAX_CHARS, MAX_CHARS, 10]
  )
})

test('empty input gives no chunks', () => {
  assert.deepEqual(chunkSections([]), [])
})
