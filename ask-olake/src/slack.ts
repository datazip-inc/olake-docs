// The Slack bot. It answers when it is mentioned in a channel and when it gets a direct message,
// always in a thread, and a follow-up in that thread is answered with the thread as its context.
// A thumbs up or thumbs down reaction on an answer is saved as a vote on it.
//
// Slack app setup: bot events `app_mention`, `message.im` and `reaction_added`, sent to
// {this Worker}/slack/events, and the bot scopes app_mentions:read, chat:write, channels:history,
// groups:history, im:history, reactions:read.

import { answer } from './answer.ts'
import { MAX_QUESTION_CHARS, readBody, whyNot, type Env } from './guard.ts'
import { isSignatureOf } from './hmac.ts'
import { record, saveVote } from './log.ts'
import { SUMMARISE_ABOVE, type Turn } from './memory.ts'
import { redactSecrets } from './redact.ts'

type Message = { user?: string; bot_id?: string; subtype?: string; text?: string; ts: string }
type Event = Message & { type: string; channel: string; channel_type?: string; thread_ts?: string }
type Reaction = {
  type: string
  reaction: string
  item_user?: string
  item: { type: string; channel: string; ts: string }
}

// The names Slack gives the two thumbs, with any skin tone ("+1::skin-tone-3").
const VOTES: Record<string, 1 | -1> = { '+1': 1, 'thumbsup': 1, '-1': -1, 'thumbsdown': -1 }
/** An answer in the log is found again by where Slack put it. */
const answerId = (channel: string, ts: string) => `slack:${channel}:${ts}`

const MAX_TURN_CHARS = 2000

/** Whether the request carries Slack's signature of its body, made with our signing secret. */
async function isFromSlack(request: Request, body: string, secret: string): Promise<boolean> {
  const timestamp = request.headers.get('X-Slack-Request-Timestamp') ?? ''
  const signature = request.headers.get('X-Slack-Signature') ?? ''
  // An old request may be a recorded one that is sent again.
  if (!(Math.abs(Date.now() / 1000 - Number(timestamp)) <= 300)) return false
  return (
    signature.startsWith('v0=') &&
    isSignatureOf(secret, `v0:${timestamp}:${body}`, signature.slice(3))
  )
}

/** Calls a method of Slack's Web API. Slack answers 200 with `ok: false` when it refuses. */
async function slack(token: string, method: string, args: Record<string, unknown>): Promise<any> {
  // Sent as a form, which every method accepts. A list or an object goes in as JSON.
  const form = new URLSearchParams()
  for (const [name, value] of Object.entries(args))
    form.set(name, typeof value === 'object' ? JSON.stringify(value) : String(value))
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  })
  const result = (await response.json()) as { ok: boolean; error?: string }
  if (!result.ok) throw new Error(`Slack ${method}: ${result.error}`)
  return result
}

/** A Slack message as plain text: without mentions, with links as their label, and unescaped. */
export const plain = (text = '') =>
  text
    .replace(/<@\w+>/g, '')
    .replace(/<[^|>]+\|([^>]+)>/g, '$1')
    .replace(/<([^>]+)>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()

/** The messages of a thread as turns: what people wrote, then what the bot answered. */
export function threadTurns(messages: Message[], bot: string): Turn[] {
  const turns: Turn[] = []
  let question: string[] = []
  for (const message of messages) {
    if (message.user !== bot) question.push(plain(message.text))
    else if (question.length) {
      turns.push({
        question: redactSecrets(question.join('\n').slice(0, MAX_TURN_CHARS)),
        answer: plain(message.text).slice(0, MAX_TURN_CHARS)
      })
      question = []
    }
  }
  return turns
}

async function reply(env: Env, event: Event, bot: string): Promise<void> {
  const token = env.SLACK_BOT_TOKEN!
  const thread_ts = event.thread_ts ?? event.ts
  const say = (text: string): Promise<{ ts: string }> =>
    slack(token, 'chat.postMessage', {
      channel: event.channel,
      thread_ts,
      // Slack renders the Markdown of the block. `text` is what a notification shows.
      text,
      blocks: [{ type: 'markdown', text }]
    })
  try {
    const question = redactSecrets(plain(event.text)).slice(0, MAX_QUESTION_CHARS)
    if (!question) return void (await say('Ask me a question about OLake.'))
    const blocked = await whyNot(env, `slack:${event.user}`)
    if (blocked) return void (await say(blocked))
    const earlier: Message[] = event.thread_ts
      ? (
          await slack(token, 'conversations.replies', {
            channel: event.channel,
            ts: event.thread_ts,
            latest: event.ts,
            limit: 50
          })
        ).messages
      : []
    const spent = { cost: 0 }
    const result = await answer(
      env,
      // A thread is not summarised: nothing is kept between requests, so only its last turns are used.
      { question, history: threadTurns(earlier, bot).slice(-SUMMARISE_ABOVE), summary: '' },
      { apiKey: env.OPENROUTER_API_KEY, spent }
    )
    const links = result.sources.map(({ url, title }) => `[${title.replace(/[[\]]/g, '')}](${url})`)
    const { ts } = await say(
      links.length ? `${result.answer}\n\nSources: ${links.join(' · ')}` : result.answer
    )
    const id = answerId(event.channel, ts)
    await record(env.DB, { id, channel: 'slack', question, cost: spent.cost, ...result })
  } catch (error) {
    console.error('slack reply failed:', error)
    await say("Couldn't write an answer right now. Please try again in a moment.").catch(() => {})
  }
}

export async function slackEvents(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const body = await readBody(request)
  if (
    body === null ||
    request.method !== 'POST' ||
    !env.SLACK_SIGNING_SECRET ||
    !env.SLACK_BOT_TOKEN ||
    !(await isFromSlack(request, body, env.SLACK_SIGNING_SECRET))
  )
    return new Response('Not from Slack.', { status: 401 })
  const payload = JSON.parse(body)
  // Slack sends this once, when the URL is entered in the app's settings.
  if (payload.type === 'url_verification') return Response.json({ challenge: payload.challenge })

  const event: (Event & Reaction) | undefined = payload.event
  const bot: string = payload.authorizations?.[0]?.user_id ?? ''
  // A thumb on one of the bot's messages. On any other message it matches no answer.
  const vote = event?.type === 'reaction_added' && VOTES[String(event.reaction).split(':')[0]]
  if (event && vote && event.item_user === bot && event.item?.type === 'message')
    ctx.waitUntil(saveVote(env.DB, answerId(event.item.channel, event.item.ts), vote, ''))
  const isQuestion =
    event?.type === 'app_mention' || (event?.type === 'message' && event.channel_type === 'im')
  // Not answered: the bot's own messages, edits and joins (they have a subtype), and a retry,
  // which repeats an event that is already being answered.
  if (
    event &&
    isQuestion &&
    !event.bot_id &&
    !event.subtype &&
    event.user !== bot &&
    !request.headers.has('X-Slack-Retry-Num')
  )
    ctx.waitUntil(reply(env, event, bot))
  // Slack wants its answer within three seconds, so the reply is written after it.
  return new Response(null, { status: 200 })
}
