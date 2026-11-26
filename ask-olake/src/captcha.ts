// The captcha in front of the website bot: Cloudflare Turnstile. It is checked once per visit,
// not once per question. A visitor who passes gets a signed pass that is good for an hour from
// the same address, and sends it with every question. Without TURNSTILE_SECRET there is no
// captcha: that is how the bot runs on a laptop.

import type { Env } from './guard.ts'
import { isSignatureOf, sign } from './hmac.ts'

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const PASS_SECONDS = 3600

/** A pass for this visitor, if Turnstile confirms the token their browser got. Null if not. */
export async function passFor(env: Env, token: unknown, visitor: string): Promise<string | null> {
  if (!env.TURNSTILE_SECRET || typeof token !== 'string' || !token) return null
  const response = await fetch(SITEVERIFY, {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: visitor })
  })
  const { success } = (await response.json()) as { success: boolean }
  if (!success) return null
  const expires = Math.floor(Date.now() / 1000) + PASS_SECONDS
  return `${expires}.${await sign(env.TURNSTILE_SECRET, `${expires}:${visitor}`)}`
}

/** Whether the visitor may ask: they hold a pass of their own that has not run out. */
export async function hasPass(env: Env, pass: unknown, visitor: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true
  const [expires, signature] = typeof pass === 'string' ? pass.split('.') : []
  if (!(Number(expires) > Date.now() / 1000) || !signature) return false
  return isSignatureOf(env.TURNSTILE_SECRET, `${expires}:${visitor}`, signature)
}
