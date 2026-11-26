// Conversation state for the Ask OLake panel, and the calls to its backend.
//
// The backend is a small HTTP API:
//
//   POST {apiUrl}/ask       { question, history, summary }
//     answers with a stream of server-sent events:
//       event: delta   data: "<next piece of the answer>"
//       event: final   data: { id, answer, sources, uncertain, summary?, summarized_turns? }
//       event: error   data: { message }
//     or, when it refuses the request, an HTTP error with { error: { message } }
//
//   POST {apiUrl}/feedback  { id, vote, reason }
//
// The server keeps nothing between requests. The browser holds the conversation and sends the
// turns the server has not yet folded into `summary`, so follow-up questions have their context.
// Conversations are saved in this browser (localStorage), so a reader can go back to an old one.

import { useCallback, useEffect, useRef, useState } from 'react'

export type Source = { url: string; title: string }

export type Turn = {
  question: string
  answer: string
  sources: Source[]
  /** Set by the server when the answer is complete. Null while it is written, or if it failed. */
  id: string | null
  /** The docs did not cover the question. */
  uncertain: boolean
  /** The reader stopped the answer before it finished. */
  stopped: boolean
  vote: 1 | -1 | null
}

type Memory = { summary: string; summarized: number }
type ServerEvent = { event: string; data: any }

/** A saved conversation. `updated` is when its last question was asked. */
export type Conversation = Memory & { id: string; updated: number; turns: Turn[] }

const STORAGE_KEY = 'ask-olake-conversations'
const MAX_CONVERSATIONS = 20
const FALLBACK_ERROR = "Couldn't reach AskOlake right now. Please try again in a moment."
// The most unsummarised turns sent with a question. The server summarises long before this.
const MAX_HISTORY_TURNS = 8

/** Splits the complete events out of a server-sent-events buffer and returns what is left over. */
export function parseEvents(buffer: string): { events: ServerEvent[]; rest: string } {
  const blocks = buffer.split('\n\n')
  const rest = blocks.pop() ?? ''
  const events: ServerEvent[] = []
  for (const block of blocks) {
    const event = /^event: ?(.*)$/m.exec(block)?.[1]
    const data = /^data: ?(.*)$/m.exec(block)?.[1]
    if (!event || data === undefined) continue
    try {
      events.push({ event, data: JSON.parse(data) })
    } catch {
      // not valid JSON: skip the event
    }
  }
  return { events, rest }
}

/** The saved conversations, the latest first. */
function loadAll(): Conversation[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    return saved
      .filter((c) => typeof c?.id === 'string' && Array.isArray(c.turns) && c.turns.length)
      .map((c) => ({
        id: c.id,
        updated: Number(c.updated) || 0,
        turns: c.turns,
        summary: String(c.summary || ''),
        summarized: Number(c.summarized) || 0
      }))
  } catch {
    return []
  }
}

function storeAll(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {
    // storage is full or switched off: the conversation still works for this page view
  }
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/**
 * @param restore bring back the latest conversation saved in this browser. False when the panel
 *   is opened with a question from elsewhere on the page, which starts a new conversation.
 */
export function useAskOlake(apiUrl: string, restore: boolean) {
  const [conversations, setConversations] = useState(loadAll)
  const [latest] = useState(() => (restore ? conversations[0] : undefined))
  const [turns, setTurns] = useState<Turn[]>(latest?.turns ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const id = useRef(latest?.id ?? newId())
  const memory = useRef<Memory>({
    summary: latest?.summary ?? '',
    summarized: latest?.summarized ?? 0
  })
  const request = useRef<AbortController | null>(null)

  // Saves the conversation after every answer and vote. The list is read again first, so a
  // conversation held in another tab is not lost.
  useEffect(() => {
    if (isLoading) return
    const finished = turns.filter((turn) => turn.id)
    const all = loadAll()
    const saved = all.find((c) => c.id === id.current)
    if (!finished.length && !saved) return
    const others = all.filter((c) => c.id !== id.current)
    // Only a new answer moves a conversation to the top, not a vote or opening it again.
    const grew = finished.length !== saved?.turns.length
    const mine: Conversation = {
      id: id.current,
      updated: grew || !saved ? Date.now() : saved.updated,
      turns: finished,
      ...memory.current
    }
    const list = !finished.length
      ? others
      : grew
        ? [mine, ...others].slice(0, MAX_CONVERSATIONS)
        : all.map((c) => (c.id === id.current ? mine : c))
    storeAll(list)
    setConversations(list)
  }, [turns, isLoading])

  const updateLast = useCallback(
    (change: (turn: Turn) => Turn) =>
      setTurns((all) => all.map((turn, i) => (i === all.length - 1 ? change(turn) : turn))),
    []
  )

  const ask = useCallback(
    async (question: string) => {
      if (request.current) return
      const controller = new AbortController()
      request.current = controller
      // Failed and stopped turns have no id and are not part of what the server should know.
      const unsummarised = turns.filter((turn) => turn.id).slice(memory.current.summarized)
      const history = unsummarised
        .slice(-MAX_HISTORY_TURNS)
        .map(({ question, answer }) => ({ question, answer }))
      // Turns cut off by the cap are left behind for good once the server sends a new summary.
      const skipped = unsummarised.length - history.length

      setError(null)
      setIsLoading(true)
      setTurns((all) => [
        ...all,
        {
          question,
          answer: '',
          sources: [],
          id: null,
          uncertain: false,
          stopped: false,
          vote: null
        }
      ])

      try {
        const response = await fetch(`${apiUrl}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            history,
            summary: memory.current.summary
          }),
          signal: controller.signal
        })
        if (!response.ok || !response.body) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error?.message || FALLBACK_ERROR)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let finished = false
        while (!finished) {
          const { value, done } = await reader.read()
          if (done) break
          const parsed = parseEvents(buffer + decoder.decode(value, { stream: true }))
          buffer = parsed.rest
          for (const { event, data } of parsed.events) {
            if (event === 'delta') {
              updateLast((turn) => ({ ...turn, answer: turn.answer + data }))
            } else if (event === 'final') {
              if (typeof data.summary === 'string') {
                memory.current = {
                  summary: data.summary,
                  summarized:
                    memory.current.summarized + skipped + (Number(data.summarized_turns) || 0)
                }
              }
              updateLast((turn) => ({
                ...turn,
                id: data.id,
                answer: data.answer,
                sources: Array.isArray(data.sources) ? data.sources : [],
                uncertain: Boolean(data.uncertain)
              }))
              finished = true
            } else if (event === 'error') {
              throw new Error(data?.message || FALLBACK_ERROR)
            }
          }
        }
        if (!finished) throw new Error(FALLBACK_ERROR)
      } catch (err) {
        // A stop or a restart aborts the request on purpose and has already updated the state.
        if (!controller.signal.aborted) {
          setError(err instanceof Error && err.message ? err.message : FALLBACK_ERROR)
        }
      } finally {
        if (request.current === controller) {
          request.current = null
          setIsLoading(false)
        }
      }
    },
    [apiUrl, turns, updateLast]
  )

  const stop = useCallback(() => {
    if (!request.current) return
    request.current.abort()
    request.current = null
    setIsLoading(false)
    updateLast((turn) => (turn.id ? turn : { ...turn, stopped: true }))
  }, [updateLast])

  /** Shows a conversation: a saved one, or a new and empty one. An answer being written is dropped. */
  const show = useCallback((conversation?: Conversation) => {
    request.current?.abort()
    request.current = null
    id.current = conversation?.id ?? newId()
    memory.current = {
      summary: conversation?.summary ?? '',
      summarized: conversation?.summarized ?? 0
    }
    setIsLoading(false)
    setError(null)
    setTurns(conversation?.turns ?? [])
  }, [])

  const newChat = useCallback(() => show(), [show])

  const open = useCallback(
    (conversationId: string) => {
      const saved = loadAll().find((c) => c.id === conversationId)
      if (saved) show(saved)
    },
    [show]
  )

  const remove = useCallback(
    (conversationId: string) => {
      const list = loadAll().filter((c) => c.id !== conversationId)
      storeAll(list)
      setConversations(list)
      if (conversationId === id.current) show()
    },
    [show]
  )

  const vote = useCallback(
    (id: string, value: 1 | -1, reason = '') => {
      setTurns((all) => all.map((turn) => (turn.id === id ? { ...turn, vote: value } : turn)))
      fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, vote: value, reason })
      }).catch(() => {
        // feedback is best effort
      })
    },
    [apiUrl]
  )

  return { turns, isLoading, error, ask, stop, vote, conversations, newChat, open, remove }
}
