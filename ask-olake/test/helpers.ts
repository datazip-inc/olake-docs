import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import { toSql } from '../ingest/build.ts'

const SCHEMA = readFileSync(join(import.meta.dirname, '../schema.sql'), 'utf8')

/** An index with these chunks, in SQLite in memory, behind the part of the D1 API the Worker uses. */
export function testDb(chunks: Array<{ url: string; title: string; text: string }>): D1Database {
  const db = new DatabaseSync(':memory:')
  db.exec(
    toSql(
      chunks.map((chunk) => ({ ...chunk, pageUrl: chunk.url.split('#')[0] })),
      SCHEMA
    )
  )
  const prepare = (sql: string) => ({
    bind: (...values: SQLInputValue[]) => ({
      all: async () => ({
        results: db
          .prepare(sql)
          .all(...values)
          .map((row) => ({ ...row }))
      })
    })
  })
  return { prepare } as unknown as D1Database
}

/** A streamed OpenRouter reply made of these pieces, as `fetch` would return it. */
export function modelReply(pieces: string[]): Response {
  const events = pieces.map(
    (content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
  )
  return new Response([': OPENROUTER PROCESSING\n\n', ...events, 'data: [DONE]\n\n'].join(''))
}
