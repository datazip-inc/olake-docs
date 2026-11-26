// The record of what was asked, in the `questions` table (schema.sql). It shows what the docs are
// missing, holds the readers' votes, and adds up what the day's answers have cost.

import type { Answer } from './answer.ts'

export type Entry = Answer & {
  id: string
  channel: 'web' | 'slack'
  question: string
  /** What the model calls for this question cost, in US dollars. */
  cost: number
}

/** Saves a question and its answer. A failure is logged and not passed on: the answer still stands. */
export async function record(db: D1Database, entry: Entry): Promise<void> {
  await db
    .prepare(
      `INSERT INTO questions (id, at, channel, question, answer, sources, uncertain, cost)
       VALUES (?1, unixepoch(), ?2, ?3, ?4, ?5, ?6, ?7)`
    )
    .bind(
      entry.id,
      entry.channel,
      entry.question,
      entry.answer,
      JSON.stringify(entry.sources.map((source) => source.url)),
      entry.uncertain ? 1 : 0,
      entry.cost
    )
    .run()
    .catch((error) => console.error('could not log the question:', error))
}

/** What today's answers have cost so far, in US dollars. The day changes at midnight UTC. */
export async function spentToday(db: D1Database): Promise<number> {
  const row = await db
    .prepare(
      'SELECT coalesce(sum(cost), 0) AS cost FROM questions WHERE at >= unixepoch() - unixepoch() % 86400'
    )
    .first<{ cost: number }>()
  return row?.cost ?? 0
}

/** Saves a reader's vote on an answer: 1 or -1, with the reason picked for a -1. */
export async function saveVote(
  db: D1Database,
  id: string,
  vote: 1 | -1,
  reason: string
): Promise<void> {
  await db
    .prepare('UPDATE questions SET vote = ?2, reason = ?3 WHERE id = ?1')
    .bind(id, vote, reason)
    .run()
}
