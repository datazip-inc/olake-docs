// Embeds the chunks for meaning search, with Workers AI over Cloudflare's REST API.

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { DIMS, EMBEDDING_MODEL } from '../src/search.ts'
import type { Chunk } from './chunk.ts'

const BATCH = 32
const PARALLEL = 4
const ATTEMPTS = 4

/** The first DIMS numbers of an embedding, scaled to length 127 and rounded to 8-bit integers. */
export function compact(embedding: number[]): Int8Array {
  const head = embedding.slice(0, DIMS)
  const length = Math.hypot(...head) || 1
  return Int8Array.from(head, (value) => Math.round((value / length) * 127))
}

/**
 * The vectors of the chunks, one after the other, DIMS numbers each.
 * @param token a Cloudflare API token that may run Workers AI
 * @param cacheFile keeps the vector of every text between builds, so that only new and changed
 *   chunks are embedded again
 */
export async function embedChunks(
  chunks: Chunk[],
  account: string,
  token: string,
  cacheFile?: string
): Promise<Int8Array> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${EMBEDDING_MODEL}`
  async function embed(texts: string[]): Promise<number[][]> {
    for (let attempt = 1; ; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: texts }),
          // A stalled connection is given up and tried again.
          signal: AbortSignal.timeout(60_000)
        })
        const reply = (await response.json()) as {
          result?: { data?: number[][] }
          errors?: unknown
        }
        const vectors = reply.result?.data
        if (vectors?.length !== texts.length)
          throw new Error(`Workers AI answered ${response.status}: ${JSON.stringify(reply.errors)}`)
        return vectors
      } catch (error) {
        if (attempt === ATTEMPTS) throw error
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
      }
    }
  }
  // The title is part of what a chunk is about, so it is embedded with the text.
  const texts = chunks.map((chunk) => `${chunk.title}\n\n${chunk.text}`)
  // The cache: the vector of a text, as base64, under the hash of the model and the text.
  const known: Record<string, string> =
    cacheFile && existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, 'utf8')) : {}
  const keys = texts.map((text) =>
    createHash('sha256').update(`${EMBEDDING_MODEL}/${DIMS}\n${text}`).digest('base64')
  )
  const todo = [...new Set(keys.filter((key) => !known[key]))].map((key) => keys.indexOf(key))
  for (let from = 0; from < todo.length; from += BATCH * PARALLEL) {
    const starts = Array.from({ length: PARALLEL }, (_, i) => from + i * BATCH)
    await Promise.all(
      starts
        .filter((start) => start < todo.length)
        .map(async (start) => {
          const batch = todo.slice(start, start + BATCH)
          const vectors = await embed(batch.map((i) => texts[i]))
          vectors.forEach((vector, n) => {
            known[keys[batch[n]]] = Buffer.from(compact(vector).buffer).toString('base64')
          })
        })
    )
  }
  const out = new Int8Array(chunks.length * DIMS)
  keys.forEach((key, i) => out.set(new Int8Array(Buffer.from(known[key], 'base64')), i * DIMS))
  // Only what this build uses is kept, so the cache does not grow with every change.
  if (cacheFile) {
    const used = Object.fromEntries(keys.map((key) => [key, known[key]]))
    writeFileSync(cacheFile, JSON.stringify(used))
  }
  return out
}
