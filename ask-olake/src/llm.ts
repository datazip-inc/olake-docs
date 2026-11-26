// Calls chat models through OpenRouter.

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
// In order of preference. OpenRouter moves to the next model when one is down. Every model here
// must accept `reasoning: none`: a model that refuses it fails the request instead of being skipped.
export const MODELS = [
  'deepseek/deepseek-v4.1-flash',
  'google/gemini-2.5-flash-lite',
  'moonshotai/kimi-k2.6'
]

export type Message = { role: 'system' | 'user' | 'assistant'; content: string }

export type Call = {
  apiKey: string
  maxTokens?: number
  signal?: AbortSignal
  /** Adds up what the calls of one request cost, in US dollars. */
  spent?: { cost: number }
}

/** Yields the reply piece by piece, as the model writes it. */
export async function* streamChat(messages: Message[], call: Call): AsyncGenerator<string> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${call.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      models: MODELS,
      messages,
      stream: true,
      max_tokens: call.maxTokens ?? 1200,
      temperature: 0.2,
      // The answer is read from the sources, not worked out. Hidden reasoning would only add
      // seconds and cost, and it counts against max_tokens.
      reasoning: { effort: 'none' },
      usage: { include: true }
    }),
    signal: call.signal
  })
  if (!response.ok || !response.body) throw new Error(`OpenRouter answered ${response.status}`)
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) return
    const lines = (buffer + value).split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      // Other lines are blank or keep-alive comments.
      if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
      const chunk = JSON.parse(line.slice(6))
      if (chunk.error) throw new Error(`OpenRouter: ${chunk.error.message}`)
      if (call.spent) call.spent.cost += chunk.usage?.cost ?? 0
      const piece = chunk.choices?.[0]?.delta?.content
      if (piece) yield piece
    }
  }
}

/** The whole reply at once. */
export async function chat(messages: Message[], call: Call): Promise<string> {
  let reply = ''
  for await (const piece of streamChat(messages, call)) reply += piece
  return reply.trim()
}
