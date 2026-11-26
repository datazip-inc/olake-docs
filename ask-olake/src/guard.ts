// Who may ask, and how much: the limits that keep a public bot from running up a bill.

import { spentToday } from './log.ts'

export type Env = {
  DB: D1Database
  /** Counts the questions of one visitor. Its limit is set in wrangler.jsonc. */
  RATE_LIMIT: RateLimit
  /** Workers AI, for meaning search. Without it the search is by keyword only. */
  AI?: Ai
  /** The sites whose pages may call this API, separated by commas. */
  ALLOWED_ORIGINS: string
  /** The most the model calls of one day may cost, in US dollars. */
  DAILY_BUDGET_USD: string
  // Secrets: in .env.local for `wrangler dev`, set with `wrangler secret put` when deployed.
  OPENROUTER_API_KEY: string
  /** The two Slack secrets are set only once the Slack app exists. */
  SLACK_SIGNING_SECRET?: string
  SLACK_BOT_TOKEN?: string
}

export const MAX_QUESTION_CHARS = 4000

/**
 * Why this visitor cannot ask right now, or null. `who` is the visitor's address, or the Slack
 * user. The day's budget is what stops a flood from many addresses from running up a bill.
 */
export async function whyNot(env: Env, who: string): Promise<string | null> {
  if (!(await env.RATE_LIMIT.limit({ key: who })).success)
    return 'You are asking faster than I can answer. Please wait a minute and try again.'
  if ((await spentToday(env.DB)) >= Number(env.DAILY_BUDGET_USD))
    return 'AskOlake has answered all it can for today. Please come back tomorrow.'
  return null
}
