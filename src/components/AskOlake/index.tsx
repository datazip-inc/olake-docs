import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {Highlight, themes} from 'prism-react-renderer'
import {useColorMode} from '@docusaurus/theme-common'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  PiCheck,
  PiChatCircleDots,
  PiCopy,
  PiPaperPlaneRight,
  PiArrowClockwise,
  PiX,
  PiThumbsUp,
  PiThumbsDown,
  PiSparkle,
  PiArrowRight,
  PiSlackLogo,
  PiGithubLogo,
  PiBookOpen,
  PiCode,
  PiGitBranch,
  PiChatCircle
} from 'react-icons/pi'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Citation = {
  n: number
  url: string
  section_url?: string
  title: string
  source_type?: string
}

export type ChatMessage = {
  id?: string
  role: 'assistant' | 'user'
  content: string
  sources?: string[]
  citations?: Citation[]
  suggestions?: string[]
  isError?: boolean
  isStreaming?: boolean
  feedback?: {vote: number; category?: string}
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUGGESTIONS = [
  'How do I set up CDC for Postgres on RDS?',
  'Which Iceberg catalogs does OLake support?',
  'What does OLake Fusion compaction do?'
]

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm **AskOlake**. Ask me anything about database CDC, Iceberg replication, connectors, " +
    'or OLake Fusion table maintenance — I answer from the official documentation and cite my sources.'
}

const FEEDBACK_CATEGORIES = ['Wrong Answer', 'Incorrect Code', 'Outdated Info', 'Missing Steps', 'Other']
const STORAGE_KEY = 'ask-olake-messages'
const SESSION_KEY = 'ask-olake-session'

function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}
const CITE_PLACEHOLDER = '\x00CITE:'

const IDK_PATTERNS = [
  "couldn't find",
  'could not find',
  'i don\'t have',
  'not covered',
  'no information',
  'outside my knowledge',
  'daily usage limit',
  'try again tomorrow'
]

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------

function saveMessages(messages: ChatMessage[]): void {
  try {
    const serializable = messages.filter(m => !m.isStreaming).map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      sources: m.sources,
      citations: m.citations,
      suggestions: m.suggestions,
      isError: m.isError,
      feedback: m.feedback
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
  } catch {
    // quota exceeded or private mode
  }
}

function loadMessages(): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ChatMessage[]
    if (!Array.isArray(parsed) || parsed.length < 2) return null
    return parsed
  } catch {
    return null
  }
}

function clearMessages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Source type inference from URL
// ---------------------------------------------------------------------------

const SOURCE_TYPE_MAP: Array<{pattern: RegExp; label: string; icon: typeof PiBookOpen}> = [
  {pattern: /olake\.io\/docs\//, label: 'Docs', icon: PiBookOpen},
  {pattern: /olake\.io\/blog\//, label: 'Blog', icon: PiBookOpen},
  {pattern: /olake\.io\/compare\//, label: 'Compare', icon: PiBookOpen},
  {pattern: /olake\.io\/learn\//, label: 'Learn', icon: PiBookOpen},
  {pattern: /github\.com\/.*\/issues\//, label: 'Issue', icon: PiChatCircle},
  {pattern: /github\.com\//, label: 'Repo', icon: PiGitBranch}
]

function inferSourceType(url: string, explicitType?: string): {label: string; icon: typeof PiBookOpen} {
  if (explicitType) {
    switch (explicitType) {
      case 'docs':
        return {label: 'Docs', icon: PiBookOpen}
      case 'blog':
        return {label: 'Blog', icon: PiBookOpen}
      case 'repo':
        return {label: 'Repo', icon: PiCode}
      case 'issue':
        return {label: 'Issue', icon: PiChatCircle}
    }
  }
  for (const {pattern, label, icon} of SOURCE_TYPE_MAP) {
    if (pattern.test(url)) return {label, icon}
  }
  return {label: 'Docs', icon: PiBookOpen}
}

// ---------------------------------------------------------------------------
// IDK detection
// ---------------------------------------------------------------------------

function isIdkAnswer(content: string): boolean {
  const lower = content.toLowerCase()
  return IDK_PATTERNS.some(p => lower.includes(p))
}

// ---------------------------------------------------------------------------
// Citation title formatting
// ---------------------------------------------------------------------------

function formatCitationTitle(title: string): string {
  const clean = title.replace(/ \(part \d+\)$/, '')
  const parts = clean.split(' > ')
  const page = parts[0].split(/: | \/ /).pop() || parts[0]
  return parts.length > 1 ? `${page} › ${parts[parts.length - 1]}` : page
}

// ---------------------------------------------------------------------------
// Markdown rendering with citation support
// ---------------------------------------------------------------------------

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  yml: 'yaml',
  sh: 'bash',
  shell: 'bash',
  conf: 'ini',
  toml: 'ini',
  hcl: 'json',
  dockerfile: 'docker'
}

function useSafeColorMode() {
  try {
    return useColorMode().colorMode
  } catch {
    return 'light'
  }
}

function CodeSnippet({lang, code}: {lang: string; code: string}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const colorMode = useSafeColorMode()
  const prismTheme = colorMode === 'dark' ? themes.vsDark : themes.vsLight
  const resolvedLang = LANG_ALIASES[lang.toLowerCase()] || lang.toLowerCase() || 'text'

  const onCopy = () => {
    const mark = () => {
      window.clearTimeout(timer.current)
      setCopied(true)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(mark).catch(() => {})
    } else {
      mark()
    }
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div className="olake-code my-[8px] rounded-[8px] border border-solid border-olake-line overflow-hidden">
      <div className="flex items-center justify-between border-0 border-b border-solid border-olake-line px-[10px] py-[6px] text-[11px] text-olake-muted bg-olake-surface-muted">
        <span className="font-mono uppercase">{lang || 'text'}</span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-[4px] rounded-[4px] border-0 bg-transparent px-[6px] py-[2px] text-olake-muted hover:text-olake-ink cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <PiCheck size={13} className="text-olake-blue" /> : <PiCopy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <Highlight theme={prismTheme} code={code} language={resolvedLang}>
        {({style, tokens, getLineProps, getTokenProps}) => (
          <pre
            className="m-0 overflow-x-auto p-[10px] font-mono text-[12.5px] leading-[1.6]"
            style={{...style, background: 'transparent'}}
          >
            {tokens.map((line, li) => (
              <div key={li} {...getLineProps({line})}>
                {line.map((token, ti) => (
                  <span key={ti} {...getTokenProps({token})} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

/**
 * Process React children to replace citation placeholders with interactive links.
 * Citations were pre-replaced from [n] to CITE_PLACEHOLDER+n before markdown parsing.
 */
function processCiteChildren(
  children: React.ReactNode,
  citeMap: Map<number, Citation>
): React.ReactNode {
  return React.Children.map(children, child => {
    if (typeof child === 'string') {
      const parts = child.split(new RegExp(`(${CITE_PLACEHOLDER.replace('\x00', '\\x00')}\\d+)`, 'g'))
      if (parts.length === 1) return child
      return parts.map((part, i) => {
        if (part.startsWith(CITE_PLACEHOLDER)) {
          const num = parseInt(part.slice(CITE_PLACEHOLDER.length), 10)
          const cite = citeMap.get(num)
          const targetUrl = cite?.section_url || cite?.url
          return (
            <sup key={i} className="group/cite relative ml-[2px] font-semibold text-olake-blue">
              {targetUrl ? (
                <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  [{num}]
                </a>
              ) : (
                `[${num}]`
              )}
              {cite && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-[6px] hidden w-[220px] -translate-x-1/2 rounded-[8px] border border-solid border-olake-line bg-olake-surface p-[8px] text-[11px] font-normal leading-[1.4] text-olake-ink shadow-[var(--olake-shadow-menu)] group-hover/cite:block">
                  <span className="block truncate font-semibold">{formatCitationTitle(cite.title)}</span>
                  <span className="mt-[2px] block truncate text-olake-muted">{targetUrl}</span>
                </span>
              )}
            </sup>
          )
        }
        return part
      })
    }
    if (React.isValidElement<{children?: React.ReactNode}>(child) && child.props?.children) {
      return React.cloneElement(child as React.ReactElement<{children?: React.ReactNode}>, {
        children: processCiteChildren(child.props.children, citeMap)
      })
    }
    return child
  })
}

function MarkdownContent({text, citations}: {text: string; citations?: Citation[]}) {
  const citeMap = useMemo(
    () => new Map((citations || []).map(c => [c.n, c])),
    [citations]
  )

  // Replace [n] and [^n] citation markers with a placeholder that survives markdown parsing.
  // The placeholder uses a NUL byte prefix so it never collides with real content.
  const processed = useMemo(
    () => text.replace(/\[\^?(\d+)\]/g, (_, n) => `${CITE_PLACEHOLDER}${n}`),
    [text]
  )

  const components = useMemo(
    () => ({
      p: ({children, ...props}: any) => (
        <p className="m-0 mb-[6px] leading-[1.55]" {...props}>
          {processCiteChildren(children, citeMap)}
        </p>
      ),
      li: ({children, ...props}: any) => (
        <li className="mb-[3px] leading-[1.5]" {...props}>
          {processCiteChildren(children, citeMap)}
        </li>
      ),
      ul: ({children, ...props}: any) => (
        <ul className="m-0 mb-[6px] pl-[18px] list-disc" {...props}>{children}</ul>
      ),
      ol: ({children, ...props}: any) => (
        <ol className="m-0 mb-[6px] pl-[18px] list-decimal" {...props}>{children}</ol>
      ),
      strong: ({children, ...props}: any) => (
        <strong className="font-semibold text-olake-ink" {...props}>
          {processCiteChildren(children, citeMap)}
        </strong>
      ),
      a: ({href, children, ...props}: any) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-olake-blue hover:underline"
          {...props}
        >
          {children}
        </a>
      ),
      code: ({className, children, ...props}: any) => {
        const match = /language-(\w+)/.exec(className || '')
        const isBlock = match || (typeof children === 'string' && children.includes('\n'))
        if (isBlock) {
          const lang = match?.[1] || ''
          const code = String(children).replace(/\n$/, '')
          return <CodeSnippet lang={lang} code={code} />
        }
        return (
          <code
            className="rounded-[4px] bg-olake-surface-muted px-[4px] py-[1px] font-mono text-[12.5px] text-olake-ink"
            {...props}
          >
            {children}
          </code>
        )
      },
      pre: ({children}: any) => <>{children}</>,
      h3: ({children, ...props}: any) => (
        <h3 className="m-0 mt-[8px] mb-[4px] text-[13.5px] font-semibold text-olake-ink" {...props}>
          {processCiteChildren(children, citeMap)}
        </h3>
      ),
      h4: ({children, ...props}: any) => (
        <h4 className="m-0 mt-[6px] mb-[3px] text-[13px] font-semibold text-olake-ink" {...props}>
          {processCiteChildren(children, citeMap)}
        </h4>
      ),
      table: ({children, ...props}: any) => (
        <div className="my-[8px] overflow-x-auto rounded-[8px] border border-solid border-olake-line">
          <table className="m-0 w-full border-collapse text-[12.5px]" {...props}>{children}</table>
        </div>
      ),
      th: ({children, ...props}: any) => (
        <th className="border-0 border-b border-solid border-olake-line bg-olake-surface-muted px-[10px] py-[6px] text-left text-[12px] font-semibold" {...props}>
          {children}
        </th>
      ),
      td: ({children, ...props}: any) => (
        <td className="border-0 border-b border-solid border-olake-line px-[10px] py-[5px]" {...props}>
          {processCiteChildren(children, citeMap)}
        </td>
      ),
      hr: () => <hr className="my-[10px] border-0 border-t border-solid border-olake-line" />
    }),
    [citeMap]
  )

  return <Markdown remarkPlugins={[remarkGfm]} components={components}>{processed}</Markdown>
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

const DEFAULT_SIZE = {w: 400, h: 560}
const EXPANDED_SIZE = {w: 720, h: 720}
const MIN_SIZE = {w: 320, h: 360}

function clampSize(w: number, h: number) {
  const maxW = Math.max(MIN_SIZE.w, window.innerWidth - 40)
  const maxH = Math.max(MIN_SIZE.h, window.innerHeight - 104)
  return {
    w: Math.round(Math.min(maxW, Math.max(MIN_SIZE.w, w))),
    h: Math.round(Math.min(maxH, Math.max(MIN_SIZE.h, h)))
  }
}

const BUTTON =
  'lk-press flex h-[52px] w-[52px] items-center justify-center rounded-[999px] border border-solid ' +
  'border-olake-btn-border bg-olake-blue text-olake-on-blue shadow-[var(--olake-shadow-menu)] ' +
  'transition-all hover:bg-olake-blue-hover hover:scale-105 active:scale-95'

function useIsMac() {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return true
    return /mac|iphone|ipad|ipod/i.test(navigator.userAgent)
  }, [])
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

function usePageContext() {
  const [pageTitle, setPageTitle] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [isDocsPage, setIsDocsPage] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => {
      const path = window.location.pathname
      const onDocs =
        path.startsWith('/docs') ||
        path.startsWith('/blog') ||
        path.startsWith('/compare') ||
        path.startsWith('/learn')
      setIsDocsPage(onDocs)
      setPageUrl(window.location.href.replace(/#.*$/, ''))
      if (onDocs) {
        const raw = document.title || ''
        const title = raw
          .replace(/\s*[|·—]\s*[Oo][Ll]ake.*$/, '')
          .replace(/\s*[|·—]\s*olake\.io.*$/, '')
          .trim()
        setPageTitle(title)
      } else {
        setPageTitle('')
      }
    }
    update()
    // Docusaurus SPA navigation uses pushState (no popstate fired).
    // Observe <title> mutations as a reliable proxy for route changes.
    window.addEventListener('popstate', update)
    const titleEl = document.querySelector('title')
    let observer: MutationObserver | undefined
    if (titleEl) {
      observer = new MutationObserver(update)
      observer.observe(titleEl, {childList: true, characterData: true, subtree: true})
    }
    return () => {
      window.removeEventListener('popstate', update)
      observer?.disconnect()
    }
  }, [])

  return {pageTitle, pageUrl, isDocsPage}
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AskOlake() {
  const {siteConfig} = useDocusaurusContext()
  const apiUrl = (siteConfig.customFields?.askAssistantApiUrl as string) || 'http://localhost:8000'

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadMessages()
    return saved || [WELCOME]
  })
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null)
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  const [size, setSize] = useState(DEFAULT_SIZE)
  const drag = useRef<{x: number; y: number; w: number; h: number; moved: boolean} | null>(null)
  const dragged = useRef(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sendRef = useRef<(q: string) => void>(() => {})

  const {pageTitle, pageUrl, isDocsPage} = usePageContext()
  const isMac = useIsMac()
  const isMobile = useIsMobile()
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K'

  // Persist messages to localStorage on every change (skip streaming states)
  useEffect(() => {
    const hasStreaming = messages.some(m => m.isStreaming)
    if (!hasStreaming && messages.length > 1) {
      saveMessages(messages)
    }
  }, [messages])

  const onResizeStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {x: e.clientX, y: e.clientY, w: size.w, h: size.h, moved: false}
    dragged.current = false
  }

  const onResizeMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return
    const dx = d.x - e.clientX
    const dy = d.y - e.clientY
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 4) return
    d.moved = true
    setSize(clampSize(d.w + dx, d.h + dy))
  }

  const onResizeEnd = () => {
    dragged.current = drag.current?.moved ?? false
    drag.current = null
  }

  const onResizeClick = () => {
    if (dragged.current) {
      dragged.current = false
      return
    }
    const expanded = clampSize(EXPANDED_SIZE.w, EXPANDED_SIZE.h)
    setSize(prev => (prev.w >= expanded.w && prev.h >= expanded.h ? DEFAULT_SIZE : expanded))
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Cmd+K / Ctrl+K to open or focus; Escape closes
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => {
          if (!prev) return true
          inputRef.current?.focus()
          return true
        })
      }
    }
    window.addEventListener('keydown', onGlobalKey)
    return () => window.removeEventListener('keydown', onGlobalKey)
  }, [])

  useEffect(() => {
    const handleOpen = (e?: Event) => {
      setIsOpen(true)
      const q = (e as CustomEvent)?.detail?.question
      if (q) {
        sendRef.current(q)
      }
    }
    window.addEventListener('open-ask-olake', handleOpen)
    ;(window as any).AskOLake = {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      ask: (q: string) => {
        setIsOpen(true)
        sendRef.current(q)
      }
    }
    return () => {
      window.removeEventListener('open-ask-olake', handleOpen)
    }
  }, [])

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const resetChat = () => {
    setMessages([WELCOME])
    setQuestion('')
    setActiveFeedbackId(null)
    setCopiedAnswerId(null)
    setIsLoading(false)
    clearMessages()
    inputRef.current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  const copyAnswer = (text: string, id: string) => {
    const stripped = text.replace(/```[\w]*\n[\s\S]*?```/g, match => {
      const lines = match.split('\n')
      return lines.slice(1, -1).join('\n')
    })
    const mark = () => {
      window.clearTimeout(copyTimer.current)
      setCopiedAnswerId(id)
      copyTimer.current = window.setTimeout(() => setCopiedAnswerId(null), 2000)
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(stripped).then(mark).catch(() => {})
    } else {
      mark()
    }
  }

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const sendQuestion = useCallback(
    async (queryText: string) => {
      const trimmed = queryText.trim()
      if (!trimmed || isLoading) return

      // Prepare multi-turn history (omitting initial welcome message)
      const historyPayload = messages
        .slice(1)
        .filter(m => !m.isError)
        .map(m => ({role: m.role, content: m.content}))

      const userMessage: ChatMessage = {role: 'user', content: trimmed}
      const assistantPlaceholder: ChatMessage = {
        role: 'assistant',
        content: '',
        isStreaming: true
      }

      setMessages(prev => [...prev, userMessage, assistantPlaceholder])
      setQuestion('')
      setIsLoading(true)

      // Build request body with page context and session ID for server-side thread persistence
      const requestBody: Record<string, unknown> = {
        question: trimmed,
        history: historyPayload,
        session_id: getOrCreateSessionId()
      }
      if (pageUrl) {
        requestBody.page_url = pageUrl
      }

      try {
        const res = await fetch(`${apiUrl}/ask/stream`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(requestBody)
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let streamBuffer = ''
        let fullAnswer = ''

        if (reader) {
          while (true) {
            const {value, done} = await reader.read()
            if (done) break
            streamBuffer += decoder.decode(value, {stream: true})
            const parts = streamBuffer.split('\n\n')
            streamBuffer = parts.pop() || ''

            for (const part of parts) {
              const evMatch = part.match(/^event:\s*(.*)$/m)
              const dataMatch = part.match(/^data:\s*(.*)$/m)
              if (!evMatch || !dataMatch) continue

              const eventType = evMatch[1].trim()
              let eventData: any
              try {
                eventData = JSON.parse(dataMatch[1])
              } catch {
                continue
              }

              if (eventType === 'delta') {
                fullAnswer += eventData
                setMessages(prev => {
                  const next = [...prev]
                  const last = next[next.length - 1]
                  if (last && last.role === 'assistant') {
                    last.content = fullAnswer
                  }
                  return next
                })
              } else if (eventType === 'final') {
                setMessages(prev => {
                  const next = [...prev]
                  const last = next[next.length - 1]
                  if (last && last.role === 'assistant') {
                    last.id = eventData.id
                    last.content = eventData.answer
                    last.sources = eventData.sources || []
                    last.citations = eventData.citations || []
                    last.suggestions = eventData.suggestions || []
                    last.isStreaming = false
                  }
                  return next
                })
              } else if (eventType === 'error') {
                throw new Error(eventData)
              }
            }
          }
        }
      } catch {
        // Fallback: try non-streaming /ask endpoint
        try {
          const fallbackRes = await fetch(`${apiUrl}/ask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
          })
          const data = await fallbackRes.json().catch(() => null)
          if (data?.answer) {
            setMessages(prev => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.role === 'assistant') {
                last.content = data.answer
                last.sources = data.sources ?? []
                last.citations = data.citations ?? []
                last.suggestions = data.suggestions ?? []
                last.isStreaming = false
                last.isError = !fallbackRes.ok
              }
              return next
            })
          } else {
            throw new Error('empty response')
          }
        } catch {
          setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'assistant') {
              last.isError = true
              last.isStreaming = false
              last.content = "Couldn't reach AskOlake right now. Please try again in a moment."
            }
            return next
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, isLoading, messages, pageUrl]
  )
  sendRef.current = sendQuestion

  const submitFeedback = async (messageId: string, vote: number, category?: string) => {
    try {
      await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: messageId, vote, category: category || ''})
      })
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? {...m, feedback: {vote, category}} : m))
      )
      setActiveFeedbackId(null)
    } catch {
      // ignore
    }
  }

  const isLastAssistantMessage = (idx: number) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i === idx
    }
    return false
  }

  // Panel dimensions: full-screen on mobile, resizable on desktop
  const panelStyle = isMobile
    ? {position: 'fixed' as const, inset: 0, width: '100%', height: '100%'}
    : {width: size.w, height: size.h}

  const panelClass = isMobile
    ? 'flex flex-col overflow-hidden bg-olake-surface z-[10000]'
    : 'relative flex max-h-[calc(100vh-104px)] max-w-[calc(100vw-40px)] flex-col ' +
      'overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface ' +
      'shadow-[var(--olake-shadow-menu)] transition-shadow'

  return (
    <div className={clsx(
      'fixed z-[9999]',
      isMobile ? 'bottom-[16px] right-[16px]' : 'bottom-[20px] right-[20px]',
      !isMobile && 'flex flex-col items-end gap-[12px]'
    )}>
      {isOpen && (
        <div
          role="dialog"
          aria-label="AskOlake"
          onKeyDown={onKeyDown}
          style={panelStyle}
          className={panelClass}
        >
          {/* Resize Gripper (desktop only) */}
          {!isMobile && (
            <button
              type="button"
              aria-label="Resize chat (drag, or click to toggle expanded view)"
              title="Drag to resize, click to expand"
              onPointerDown={onResizeStart}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              onPointerCancel={onResizeEnd}
              onClick={onResizeClick}
              className="absolute left-0 top-0 z-[1] h-[22px] w-[22px] cursor-nwse-resize touch-none border-0 bg-transparent p-0 text-olake-muted hover:text-olake-ink"
            >
              <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true" className="block">
                <path d="M6 14 L14 6 M6 10 L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-0 border-b border-solid border-olake-line bg-olake-surface-alt py-[10px] pl-[26px] pr-[14px]">
            <div className="flex items-center gap-[6px]">
              <PiSparkle className="text-olake-blue" size={16} />
              <p className="m-0 text-[14px] font-semibold text-olake-ink">AskOlake</p>
              {isDocsPage && pageTitle && (
                <span className="hidden sm:inline-block ml-[6px] max-w-[160px] truncate rounded-[4px] bg-olake-surface px-[6px] py-[1px] text-[11px] text-olake-muted">
                  {pageTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-[4px]">
              <button
                type="button"
                onClick={resetChat}
                className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-ink cursor-pointer"
                title="Restart chat"
                aria-label="Restart chat"
              >
                <PiArrowClockwise size={16} />
              </button>
              <button
                type="button"
                onClick={close}
                className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-ink cursor-pointer"
                title="Close assistant"
                aria-label="Close assistant"
              >
                <PiX size={16} />
              </button>
            </div>
          </div>

          {/* Message Log */}
          <div ref={scrollRef} aria-live="polite" className="flex-1 overflow-y-auto px-[16px] py-[14px]">
            <div className="flex flex-col gap-[14px]">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={clsx(
                    'flex flex-col gap-[8px] rounded-[12px] px-[14px] py-[10px] text-[13.5px]',
                    m.role === 'user'
                      ? 'self-end bg-olake-blue text-olake-on-blue max-w-[85%]'
                      : m.isError
                        ? 'self-start border border-solid border-olake-line bg-olake-surface-alt text-olake-danger max-w-[92%]'
                        : 'self-start border border-solid border-olake-line bg-olake-surface-alt text-olake-text max-w-[92%]'
                  )}
                >
                  {m.role === 'user' ? (
                    <p className="m-0 leading-[1.5]">{m.content}</p>
                  ) : (
                    <MarkdownContent text={m.content} citations={m.citations} />
                  )}

                  {/* Suggestion Chips on Welcome Message */}
                  {i === 0 && messages.length === 1 && (
                    <div className="mt-[6px] flex flex-col gap-[6px]">
                      <p className="m-0 text-[12px] font-medium text-olake-muted">Suggested questions:</p>
                      {isDocsPage && pageTitle && (
                        <button
                          type="button"
                          onClick={() => sendQuestion(`What does the "${pageTitle}" page cover?`)}
                          className="flex items-center gap-[6px] rounded-[8px] border border-solid border-olake-blue bg-olake-surface px-[10px] py-[6px] text-left text-[12.5px] text-olake-blue transition-colors hover:bg-olake-blue hover:text-olake-on-blue cursor-pointer"
                        >
                          <PiSparkle size={13} />
                          <span>Ask about this page: {pageTitle}</span>
                        </button>
                      )}
                      {SUGGESTIONS.map((sug, sugIdx) => (
                        <button
                          key={sugIdx}
                          type="button"
                          onClick={() => sendQuestion(sug)}
                          className="rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[10px] py-[6px] text-left text-[12.5px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Citation Source Chips with source type badges */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-[4px] flex flex-wrap gap-[6px] border-0 border-t border-solid border-olake-line pt-[8px]">
                      {m.citations.map((c, ci) => {
                        const src = inferSourceType(c.section_url || c.url, c.source_type)
                        const Icon = src.icon
                        return (
                          <a
                            key={ci}
                            href={c.section_url || c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={c.title}
                            className="inline-flex items-center gap-[4px] rounded-full border border-solid border-olake-line bg-olake-surface px-[8px] py-[2px] text-[11.5px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue"
                          >
                            <span className="font-semibold text-olake-blue">[{c.n}]</span>
                            <Icon size={11} className="text-olake-muted" />
                            <span className="text-[10px] font-medium text-olake-muted">{src.label}</span>
                            <span className="max-w-[160px] truncate">{formatCitationTitle(c.title)}</span>
                          </a>
                        )
                      })}
                    </div>
                  )}

                  {/* Escalation buttons after IDK answers */}
                  {m.role === 'assistant' &&
                    !m.isStreaming &&
                    m.content &&
                    isIdkAnswer(m.content) &&
                    isLastAssistantMessage(i) && (
                      <div className="mt-[4px] flex flex-wrap gap-[6px] border-0 border-t border-solid border-olake-line pt-[8px]">
                        <a
                          href="https://olake.io/slack/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-[5px] rounded-[7px] border border-solid border-olake-line bg-olake-surface px-[10px] py-[5px] text-[12px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue"
                        >
                          <PiSlackLogo size={14} className="text-olake-muted" />
                          <span>Ask in Slack</span>
                        </a>
                        <a
                          href={`https://github.com/datazip-inc/olake/issues/new?title=${encodeURIComponent(messages[i - 1]?.content || 'Question')}&body=${encodeURIComponent('I asked AskOlake but it could not find the answer.\n\n**Question:** ' + (messages[i - 1]?.content || '') + '\n\n**Expected:** (describe what you need)')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-[5px] rounded-[7px] border border-solid border-olake-line bg-olake-surface px-[10px] py-[5px] text-[12px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue"
                        >
                          <PiGithubLogo size={14} className="text-olake-muted" />
                          <span>Open Issue</span>
                        </a>
                      </div>
                    )}

                  {/* Feedback Row for Assistant Answers */}
                  {m.role === 'assistant' && m.id && !m.isStreaming && (
                    <div className="mt-[4px] flex items-center justify-between border-0 border-t border-solid border-olake-line pt-[6px] text-[11.5px] text-olake-muted">
                      {m.feedback ? (
                        <span className="text-olake-blue">Thanks for your feedback!</span>
                      ) : (
                        <div className="flex items-center gap-[6px]">
                          <span>Helpful?</span>
                          <button
                            type="button"
                            onClick={() => submitFeedback(m.id!, 1)}
                            className="flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-blue cursor-pointer"
                            title="Helpful"
                            aria-label="Helpful"
                          >
                            <PiThumbsUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveFeedbackId(activeFeedbackId === m.id ? null : m.id!)}
                            className="flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-danger cursor-pointer"
                            title="Not helpful"
                            aria-label="Not helpful"
                          >
                            <PiThumbsDown size={13} />
                          </button>
                        </div>
                      )}
                      {/* Copy full answer */}
                      {m.id && (
                        <button
                          type="button"
                          onClick={() => copyAnswer(m.content, m.id!)}
                          className="flex items-center gap-[3px] rounded-[4px] border-0 bg-transparent px-[4px] py-[2px] text-[11px] text-olake-muted hover:text-olake-ink cursor-pointer"
                          title="Copy answer"
                          aria-label="Copy answer"
                        >
                          {copiedAnswerId === m.id ? (
                            <><PiCheck size={12} className="text-olake-blue" /><span className="text-olake-blue">Copied</span></>
                          ) : (
                            <><PiCopy size={12} /><span>Copy</span></>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feedback Details Modal / Dropdown */}
                  {activeFeedbackId === m.id && (
                    <div className="flex flex-col gap-[6px] rounded-[8px] border border-solid border-olake-line bg-olake-surface p-[8px] text-[12px]">
                      <span className="font-medium text-olake-ink">What was the issue?</span>
                      <div className="flex flex-wrap gap-[4px]">
                        {FEEDBACK_CATEGORIES.map((cat, catIdx) => (
                          <button
                            key={catIdx}
                            type="button"
                            onClick={() => submitFeedback(m.id!, -1, cat)}
                            className="rounded-[6px] border border-solid border-olake-line bg-olake-surface-alt px-[8px] py-[3px] text-olake-ink hover:border-olake-blue hover:text-olake-blue cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Suggestions */}
                  {m.role === 'assistant' &&
                    !m.isStreaming &&
                    m.suggestions &&
                    m.suggestions.length > 0 &&
                    isLastAssistantMessage(i) && (
                      <div className="mt-[4px] flex flex-col gap-[5px]">
                        <p className="m-0 text-[11.5px] font-medium text-olake-muted">Follow-up:</p>
                        {m.suggestions.map((sug, si) => (
                          <button
                            key={si}
                            type="button"
                            onClick={() => sendQuestion(sug)}
                            className="flex items-center gap-[5px] rounded-[7px] border border-solid border-olake-line bg-olake-surface px-[9px] py-[5px] text-left text-[12px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue cursor-pointer"
                          >
                            <PiArrowRight size={11} className="shrink-0 text-olake-muted" />
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="self-start rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt px-[12px] py-[8px] text-[13px] text-olake-muted">
                  <span className="inline-flex items-center gap-[6px]">
                    <PiSparkle className="animate-spin text-olake-blue" size={14} />
                    Searching OLake documentation...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={e => {
              e.preventDefault()
              sendQuestion(question)
            }}
            className="flex shrink-0 flex-col gap-[0px] border-0 border-t border-solid border-olake-line"
          >
            <div className="flex items-center gap-[8px] p-[12px]">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about connectors, CDC, Iceberg, Fusion..."
                aria-label="Ask a question"
                disabled={isLoading}
                maxLength={4000}
                className="h-[38px] flex-1 rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface px-[12px] text-[13.5px] text-olake-ink outline-none focus:border-olake-blue focus:shadow-none focus-visible:outline-none"
              />
              <button
                type="submit"
                aria-label="Send question"
                disabled={isLoading || !question.trim()}
                className="lk-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue text-olake-on-blue transition-colors hover:bg-olake-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PiPaperPlaneRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center justify-between px-[14px] pb-[8px] text-[10.5px] text-olake-muted">
              <span>
                {!isMobile && (
                  <>
                    <kbd className="rounded-[3px] border border-solid border-olake-line bg-olake-surface px-[4px] py-[1px] font-mono text-[10px]">
                      {shortcutLabel}
                    </kbd>{' '}
                    to open ·{' '}
                  </>
                )}
                <kbd className="rounded-[3px] border border-solid border-olake-line bg-olake-surface px-[4px] py-[1px] font-mono text-[10px]">Esc</kbd> to close
              </span>
              <a
                href="https://olake.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-olake-muted hover:text-olake-blue"
              >
                Powered by OLake
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Floating Action Button — always visible including mobile */}
      {(!isOpen || !isMobile) && (
        <button
          type="button"
          aria-label="Open AskOlake"
          className={BUTTON}
          onClick={isOpen ? close : open}
        >
          <PiChatCircleDots size={24} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
