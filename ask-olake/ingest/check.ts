// Checks a freshly built index before it replaces the live one: searches it for every test
// question, and fails when too few of them find a page that answers them.
//
//   npm run ask-olake:check
//
// With CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN set the questions are embedded too, so the
// search is the one the Worker runs. Without them it is by keyword only.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { search } from '../src/search.ts'
import { asD1 } from '../test/helpers.ts'

const ASK_OLAKE = join(import.meta.dirname, '..')
/** The share of the questions that must find one of their pages in the top results. */
const MUST_FIND = 0.9

const questions: Array<{ question: string; pages: string[] }> = JSON.parse(
  readFileSync(join(ASK_OLAKE, 'test/questions.json'), 'utf8')
)
const sqlite = new DatabaseSync(':memory:')
sqlite.exec(readFileSync(join(ASK_OLAKE, '.wrangler/ingest/index.sql'), 'utf8'))

const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = process.env
// Workers AI over its REST API, in the shape of the binding the Worker has.
const AI = {
  run: async (model: string, input: unknown) => {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${model}`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      }
    )
    return ((await response.json()) as { result: unknown }).result
  }
} as unknown as Ai
const env = { DB: asD1(sqlite), AI: account && token ? AI : undefined }

// A question with no pages is one the bot must decline. Search has no part in that.
const answerable = questions.filter(({ pages }) => pages.length)
let found = 0
for (const { question, pages } of answerable) {
  const hits = await search(env, question)
  if (hits.some((hit) => pages.includes(hit.url.replace(/^https:\/\/olake\.io|#.*$/g, '')))) found++
  else console.log(`no page found for: ${question}`)
}
console.log(
  `${found} of ${answerable.length} questions found their page (${env.AI ? 'keyword and meaning' : 'keyword only'})`
)
if (found < answerable.length * MUST_FIND) {
  console.error(`That is under ${MUST_FIND * 100}%: this index must not go live.`)
  process.exit(1)
}
