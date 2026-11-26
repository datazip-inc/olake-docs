// A page for the team: what was asked, what the docs could not answer, and what it cost.
//
//   GET /admin   behind the browser's sign-in box. The password is the ADMIN_TOKEN secret, with
//                any user name. Without that secret there is no page.

import type { Env } from './guard.ts'
import { sign } from './hmac.ts'

const DAY = 86400
const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}
/** Text as it may stand in HTML. Everything a visitor typed goes through this. */
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ENTITIES[char])
const day = (seconds: number) => new Date(seconds * 1000).toISOString().slice(0, 10)
const table = (head: string[], rows: unknown[][]) =>
  rows.length
    ? `<table><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr>${rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join('')}</tr>`)
        .join('')}</table>`
    : '<p class="none">Nothing yet.</p>'

async function isTeam(request: Request, token: string): Promise<boolean> {
  const sent = /^Basic (.+)$/.exec(request.headers.get('Authorization') ?? '')?.[1] ?? ''
  let password = ''
  try {
    password = atob(sent).replace(/^[^:]*:/, '')
  } catch {
    // not base64: no password
  }
  // Signed before they are compared, so the time taken says nothing about the token.
  return (await sign(token, password)) === (await sign(token, token))
}

const STYLE = `body{font:15px/1.5 system-ui,sans-serif;max-width:60rem;margin:2rem auto;padding:0 1rem;color:#1a1a1a}
h1{font-size:1.4rem}h2{font-size:1.1rem;margin-top:2rem}table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:.35rem .6rem;border-bottom:1px solid #e3e3e3;vertical-align:top}
th{font-size:.85rem;color:#666}.totals{display:flex;gap:2rem;flex-wrap:wrap}
.totals b{display:block;font-size:1.5rem}.none{color:#666}`

export async function report(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_TOKEN || request.method !== 'GET')
    return new Response('Not found.', { status: 404 })
  const visitor = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (!(await env.RATE_LIMIT.limit({ key: `admin:${visitor}` })).success)
    return new Response('Too many tries. Please wait a minute.', { status: 429 })
  if (!(await isTeam(request, env.ADMIN_TOKEN)))
    return new Response('Sign in to see this page.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Ask OLake", charset="UTF-8"' }
    })

  const since = Math.floor(Date.now() / 1000) - 30 * DAY
  const rows = <T>(sql: string) =>
    env.DB.prepare(sql)
      .bind(since)
      .all<T>()
      .then(({ results }) => results)
  const [[totals], days, gaps, disliked, recent] = await Promise.all([
    rows<{ asked: number; unanswered: number; up: number; down: number; cost: number }>(
      `SELECT count(*) AS asked, coalesce(sum(uncertain), 0) AS unanswered,
              coalesce(sum(vote = 1), 0) AS up, coalesce(sum(vote = -1), 0) AS down,
              coalesce(sum(cost), 0) AS cost
       FROM questions WHERE at >= ?1`
    ),
    rows<{ at: number; asked: number; unanswered: number; cost: number }>(
      `SELECT min(at) AS at, count(*) AS asked, sum(uncertain) AS unanswered, sum(cost) AS cost
       FROM questions WHERE at >= ?1 GROUP BY at / ${DAY} ORDER BY at DESC`
    ),
    rows<{ question: string; asked: number; at: number }>(
      `SELECT min(question) AS question, count(*) AS asked, max(at) AS at
       FROM questions WHERE at >= ?1 AND (uncertain = 1 OR vote = -1)
       GROUP BY lower(question) ORDER BY asked DESC, at DESC LIMIT 50`
    ),
    rows<{ at: number; question: string; reason: string }>(
      `SELECT at, question, reason FROM questions
       WHERE at >= ?1 AND vote = -1 ORDER BY at DESC LIMIT 30`
    ),
    rows<{ at: number; channel: string; question: string; uncertain: number; vote: number }>(
      `SELECT at, channel, question, uncertain, vote FROM questions
       WHERE at >= ?1 ORDER BY at DESC LIMIT 50`
    )
  ])
  const answered = totals.asked ? Math.round(100 * (1 - totals.unanswered / totals.asked)) : 0
  const sections = [
    `<h1>Ask OLake: the last 30 days</h1>
<div class="totals"><div><b>${totals.asked}</b>questions</div>
<div><b>${answered}%</b>answered from the docs</div>
<div><b>${totals.up} / ${totals.down}</b>thumbs up / down</div>
<div><b>$${totals.cost.toFixed(2)}</b>model cost</div></div>`,
    `<h2>What the docs could not answer</h2>
<p>Questions the bot could not answer, or whose answer got a thumbs down. Most asked first.</p>`,
    table(
      ['Question', 'Asked', 'Last'],
      gaps.map((gap) => [gap.question, gap.asked, day(gap.at)])
    ),
    '<h2>Thumbs down</h2>',
    table(
      ['Day', 'Question', 'Reason'],
      disliked.map((row) => [day(row.at), row.question, row.reason])
    ),
    '<h2>By day</h2>',
    table(
      ['Day', 'Questions', 'Not answered', 'Cost'],
      days.map((row) => [day(row.at), row.asked, row.unanswered, `$${row.cost.toFixed(3)}`])
    ),
    '<h2>Latest questions</h2>',
    table(
      ['Day', 'From', 'Question', 'Answered', 'Vote'],
      recent.map((row) => [
        day(row.at),
        row.channel,
        row.question,
        row.uncertain ? 'no' : 'yes',
        row.vote === 1 ? 'up' : row.vote === -1 ? 'down' : ''
      ])
    )
  ]
  const html = `<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ask OLake: questions</title><style>${STYLE}</style>${sections.join('\n')}</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  })
}
