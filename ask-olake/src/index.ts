// Ask OLake, the backend of the chat widget. The API is described in
// src/components/AskOlake/useAskOlake.ts, which is its only client.

import { buildMessages, finish, NOT_FOUND, withoutMarks, type Turn } from './answer.ts'
import { streamChat } from './llm.ts'
import { search } from './search.ts'

export type Env = {
  DB: D1Database
  /** A secret: in .env.local for `wrangler dev`, set with `wrangler secret put` when deployed. */
  OPENROUTER_API_KEY: string
  /** The sites whose pages may call this API, separated by commas. */
  ALLOWED_ORIGINS: string
}

const MAX_QUESTION_CHARS = 4000
// What is kept of the earlier turns: enough for a follow-up question to make sense.
const MAX_HISTORY_TURNS = 8
const MAX_TURN_CHARS = 2000

const refusal = (status: number, message: string, headers: HeadersInit) =>
  Response.json({ error: { message } }, { status, headers })

/** The earlier turns the browser sent, cut to size. Anything that is not a turn is dropped. */
function readHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((turn) => typeof turn?.question === 'string' && typeof turn?.answer === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      question: turn.question.slice(0, MAX_TURN_CHARS),
      answer: turn.answer.slice(0, MAX_TURN_CHARS)
    }))
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const cors: Record<string, string> = env.ALLOWED_ORIGINS.split(',').includes(origin)
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Headers': 'Content-Type',
          'Vary': 'Origin'
        }
      : {}
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST' || !new URL(request.url).pathname.endsWith('/ask'))
      return refusal(404, 'Not found.', cors)

    const body = (await request.json().catch(() => null)) as {
      question?: unknown
      history?: unknown
    } | null
    const question = typeof body?.question === 'string' ? body.question.trim() : ''
    if (!question) return refusal(400, 'Ask a question.', cors)
    if (question.length > MAX_QUESTION_CHARS)
      return refusal(400, `Keep the question under ${MAX_QUESTION_CHARS} characters.`, cors)

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()
    const send = (event: string, data: unknown) =>
      writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
    // Stops the model when the reader closes the panel or presses stop.
    const upstream = new AbortController()

    const answer = async () => {
      const hits = await search(env.DB, question)
      let reply = ''
      if (hits.length) {
        const visible = withoutMarks()
        for await (const piece of streamChat(
          env.OPENROUTER_API_KEY,
          buildMessages(question, hits, readHistory(body?.history)),
          upstream.signal
        )) {
          reply += piece
          const text = visible(piece)
          if (text) await send('delta', text)
        }
      }
      await send('final', { id: crypto.randomUUID(), ...finish(reply || NOT_FOUND, hits) })
    }
    ctx.waitUntil(
      answer()
        .catch((error) => {
          console.error('ask failed:', error)
          return send('error', {
            message: "Couldn't write an answer right now. Please try again in a moment."
          })
        })
        // A write fails when the reader has gone. There is nobody left to tell.
        .catch(() => upstream.abort())
        .finally(() => writer.close().catch(() => {}))
    )
    return new Response(readable, {
      headers: { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
    })
  }
} satisfies ExportedHandler<Env>
