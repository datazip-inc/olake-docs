// Ask OLake, the backend of the chat widget and of the Slack bot.
//
//   POST /ask, POST /feedback   the widget's API, described in src/components/AskOlake/useAskOlake.ts
//   POST /slack/events          events from the Slack app, see slack.ts

import { answer, withoutMarks } from './answer.ts'
import { MAX_QUESTION_CHARS, whyNot, type Env } from './guard.ts'
import { record, saveVote } from './log.ts'
import type { Turn } from './memory.ts'
import { redactSecrets } from './redact.ts'
import { slackEvents } from './slack.ts'

// What is kept of the earlier turns: enough for a follow-up question to make sense.
const MAX_HISTORY_TURNS = 8
const MAX_TURN_CHARS = 2000
// A request of the widget at its limits is well under this.
const MAX_BODY_BYTES = 100_000

/** The earlier turns the browser sent, cut to size. Anything that is not a turn is dropped. */
function readHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((turn) => typeof turn?.question === 'string' && typeof turn?.answer === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      question: redactSecrets(turn.question.slice(0, MAX_TURN_CHARS)),
      answer: turn.answer.slice(0, MAX_TURN_CHARS)
    }))
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname.endsWith('/slack/events')) return slackEvents(request, env, ctx)

    const origin = request.headers.get('Origin') ?? ''
    const allowed = env.ALLOWED_ORIGINS.split(',').includes(origin)
    const cors: Record<string, string> = allowed
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Headers': 'Content-Type',
          'Vary': 'Origin'
        }
      : {}
    const refusal = (status: number, message: string) =>
      Response.json({ error: { message } }, { status, headers: cors })

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    const route = request.method === 'POST' ? pathname.split('/').pop() : ''
    if (route !== 'ask' && route !== 'feedback') return refusal(404, 'Not found.')
    // Only pages of our own sites may use the bot. A browser cannot fake this header.
    if (!allowed) return refusal(403, 'This site may not use AskOlake.')
    if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES)
      return refusal(413, 'The request is too large.')
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
    // The address Cloudflare saw the request come from. Headers such as X-Forwarded-For are not read.
    const visitor = request.headers.get('CF-Connecting-IP') ?? 'unknown'

    if (route === 'feedback') {
      const { id, vote, reason } = body ?? {}
      if (typeof id !== 'string' || (vote !== 1 && vote !== -1)) return refusal(400, 'Not a vote.')
      if (!(await env.RATE_LIMIT.limit({ key: `vote:${visitor}` })).success)
        return refusal(429, 'Too many votes. Please wait a minute.')
      await saveVote(
        env.DB,
        id.slice(0, 36),
        vote,
        typeof reason === 'string' ? reason.slice(0, 100) : ''
      )
      return new Response(null, { status: 204, headers: cors })
    }

    const question = typeof body?.question === 'string' ? redactSecrets(body.question.trim()) : ''
    if (!question) return refusal(400, 'Ask a question.')
    if (question.length > MAX_QUESTION_CHARS)
      return refusal(400, `Keep the question under ${MAX_QUESTION_CHARS} characters.`)
    const blocked = await whyNot(env, visitor)
    if (blocked) return refusal(429, blocked)
    const conversation = {
      question,
      history: readHistory(body?.history),
      summary: typeof body?.summary === 'string' ? body.summary.slice(0, MAX_TURN_CHARS) : ''
    }

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()
    const send = (event: string, data: unknown) =>
      writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
    // Stops the model when the reader closes the panel or presses stop.
    const upstream = new AbortController()
    const spent = { cost: 0 }

    const reply = async () => {
      // The reader sees the sources as links under the answer, so the marks are not shown.
      const visible = withoutMarks()
      const result = await answer(
        env,
        conversation,
        { apiKey: env.OPENROUTER_API_KEY, signal: upstream.signal, spent },
        (piece) => {
          const text = visible(piece)
          if (text) return send('delta', text)
        }
      )
      const id = crypto.randomUUID()
      // Logged first, so that a vote on this answer always finds it.
      await record(env.DB, { id, channel: 'web', question, cost: spent.cost, ...result })
      await send('final', { id, ...result })
    }
    ctx.waitUntil(
      reply()
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
