// Embeds the chunks for meaning search, with Workers AI over Cloudflare's REST API.

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
 */
export async function embedChunks(
  chunks: Chunk[],
  account: string,
  token: string
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
  const out = new Int8Array(chunks.length * DIMS)
  for (let from = 0; from < texts.length; from += BATCH * PARALLEL) {
    const starts = Array.from({ length: PARALLEL }, (_, i) => from + i * BATCH)
    await Promise.all(
      starts
        .filter((start) => start < texts.length)
        .map(async (start) => {
          const vectors = await embed(texts.slice(start, start + BATCH))
          vectors.forEach((vector, i) => out.set(compact(vector), (start + i) * DIMS))
        })
    )
  }
  return out
}
