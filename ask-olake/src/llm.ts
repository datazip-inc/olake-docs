// Streams a chat answer from OpenRouter.

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
// In order of preference. OpenRouter moves to the next model when one is down or refuses.
export const MODELS = [
  'deepseek/deepseek-v4.1-flash',
  'google/gemini-2.5-flash-lite',
  'z-ai/glm-5.3-flash'
]

export type Message = { role: 'system' | 'user' | 'assistant'; content: string }

/** Yields the answer piece by piece, as the model writes it. */
export async function* streamChat(
  apiKey: string,
  messages: Message[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      models: MODELS,
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.2
    }),
    signal
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
      const piece = chunk.choices?.[0]?.delta?.content
      if (piece) yield piece
    }
  }
}
