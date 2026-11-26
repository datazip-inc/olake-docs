import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import { toSql } from '../ingest/build.ts'

const SCHEMA = readFileSync(join(import.meta.dirname, '../schema.sql'), 'utf8')

/** A SQLite database behind the part of the D1 API the Worker uses. */
export function asD1(sqlite: DatabaseSync): D1Database {
  const statement = (sql: string, values: SQLInputValue[] = []) => ({
    bind: (...bound: SQLInputValue[]) => statement(sql, bound),
    all: async () => ({
      results: sqlite
        .prepare(sql)
        .all(...values)
        .map((row) => ({ ...row }))
    }),
    first: async () => sqlite.prepare(sql).get(...values) ?? null,
    run: async () => sqlite.prepare(sql).run(...values)
  })
  return { prepare: (sql: string) => statement(sql) } as unknown as D1Database
}

/**
 * An index with these chunks, in SQLite in memory. `vectors` are the chunks' vectors as
 * embedChunks returns them.
 */
export function testDb(
  chunks: Array<{ url: string; title: string; text: string }>,
  vectors?: Int8Array
): D1Database & { sqlite: DatabaseSync } {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(
    toSql(
      chunks.map((chunk) => ({ ...chunk, pageUrl: chunk.url.split('#')[0] })),
      SCHEMA,
      vectors
    )
  )
  return Object.assign(asD1(sqlite), { sqlite })
}

/** A streamed OpenRouter reply made of these pieces, as `fetch` would return it. */
export function modelReply(pieces: string[], cost = 0.001): Response {
  const events = pieces.map(
    (content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
  )
  const usage = `data: ${JSON.stringify({ choices: [], usage: { cost } })}\n\n`
  return new Response(
    [': OPENROUTER PROCESSING\n\n', ...events, usage, 'data: [DONE]\n\n'].join('')
  )
}

/** What a mocked `fetch` was asked to send to the model in its call number `n`. */
export const sentTo = (fetched: { mock: { calls: Array<{ arguments: unknown[] }> } }, n = 0) =>
  JSON.parse((fetched.mock.calls[n].arguments[1] as RequestInit).body as string)
