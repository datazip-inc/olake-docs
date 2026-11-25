// Ask OLake: the chat panel. Loaded on demand by index.tsx.
//
// Answers come from Kapa (https://docs.kapa.ai/dev/sdk/) through its React SDK, which runs in
// the browser and needs no backend of ours: Kapa hosts the index of the OLake docs and
// repositories, generates the answers, keeps each conversation as a thread so follow-up
// questions have context, and protects the endpoint with a captcha and rate limits. The SDK
// also saves finished conversations in the visitor's localStorage.

import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Highlight, themes } from 'prism-react-renderer'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  KapaProvider,
  useChat,
  useConversationHistory,
  type FeedbackComment,
  type Source
} from '@kapaai/react-sdk'
import {
  PiCheck,
  PiCopy,
  PiPaperPlaneRight,
  PiStopFill,
  PiArrowClockwise,
  PiX,
  PiThumbsUp,
  PiThumbsDown,
  PiSparkle,
  PiSlackLogo,
  PiGithubLogo,
  PiBookOpen,
  PiGitBranch,
  PiChatCircle
} from 'react-icons/pi'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUGGESTIONS = [
  'How do I set up CDC for Postgres on RDS?',
  'Which Iceberg catalogs does OLake support?',
  'What does OLake Fusion compaction do?'
]

const WELCOME =
  "Hi! I'm **AskOlake**. Ask me anything about database CDC, Iceberg replication, connectors, " +
  'or OLake Fusion table maintenance — I answer from the official documentation and cite my sources.'

// Shown when Kapa reports a failure without a message of its own.
const ERROR_MESSAGE = "Couldn't reach AskOlake right now. Please try again in a moment."

// What each thumbs-down reason sends to Kapa.
const FEEDBACK_CATEGORIES: Array<{ label: string; comment: FeedbackComment }> = [
  { label: 'Wrong Answer', comment: { incorrect: true, issue: 'Wrong answer' } },
  { label: 'Incorrect Code', comment: { incorrect: true, issue: 'Incorrect code' } },
  { label: 'Outdated Info', comment: { incorrect: true, issue: 'Outdated info' } },
  { label: 'Missing Steps', comment: { unaddressed: true, issue: 'Missing steps' } },
  { label: 'Other', comment: { issue: 'Other' } }
]

// When "Restart chat" was last pressed. A conversation older than this is not brought back on
// the next page load.
const RESET_KEY = 'ask-olake-reset-at'

const KAPA_CALLBACKS = {}

// Questions are stored by Kapa, and people paste connection strings and config files into them.
// Obvious credentials are masked in the browser before the question is sent.
const SECRET_PATTERNS: Array<[RegExp, string]> = [
  // user:password@host in a connection string
  [/(\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+):[^\s@/]+@/gi, '$1:[redacted]@'],
  // PASSWORD=value, "api_key": "value", token = 'value'
  [
    /((?<![a-z])(?:pass(?:word|wd)?|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key)["']?\s*(?:=\s*["']?|:\s*["']))[^\s"',;]{3,}/gi,
    '$1[redacted]'
  ],
  // AWS access key IDs, GitHub, OpenAI-style and Slack tokens, JSON Web Tokens
  [
    /\b(?:AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{20,}|xox[abpr]-[A-Za-z0-9-]{10,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
    '[redacted]'
  ]
]

function redactSecrets(text: string): string {
  return SECRET_PATTERNS.reduce(
    (out, [pattern, replacement]) => out.replace(pattern, replacement),
    text
  )
}

function readResetAt(): number {
  try {
    return Number(localStorage.getItem(RESET_KEY)) || 0
  } catch {
    return 0
  }
}

function writeResetAt(): void {
  try {
    localStorage.setItem(RESET_KEY, String(Date.now()))
  } catch {
    // private mode or storage disabled
  }
}

// ---------------------------------------------------------------------------
// Source type, inferred from the source URL
// ---------------------------------------------------------------------------

const SOURCE_TYPE_MAP: Array<{ pattern: RegExp; label: string; icon: typeof PiBookOpen }> = [
  { pattern: /olake\.io\/docs\//, label: 'Docs', icon: PiBookOpen },
  { pattern: /olake\.io\/blog\//, label: 'Blog', icon: PiBookOpen },
  { pattern: /olake\.io\/compare\//, label: 'Compare', icon: PiBookOpen },
  { pattern: /olake\.io\/learn\//, label: 'Learn', icon: PiBookOpen },
  { pattern: /github\.com\/.*\/(issues|discussions|pull)\//, label: 'Issue', icon: PiChatCircle },
  { pattern: /github\.com\//, label: 'Repo', icon: PiGitBranch }
]

function inferSourceType(url: string): { label: string; icon: typeof PiBookOpen } {
  for (const { pattern, label, icon } of SOURCE_TYPE_MAP) {
    if (pattern.test(url)) return { label, icon }
  }
  return { label: 'Docs', icon: PiBookOpen }
}

// ---------------------------------------------------------------------------
// Markdown rendering
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

// The panel is mounted in Root, outside the theme's colour-mode provider, so the current theme
// is read from the <html data-theme> attribute that Docusaurus keeps up to date.
function useSiteTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const root = document.documentElement
    const read = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

function copyText(text: string, onCopied: () => void): void {
  navigator.clipboard
    ?.writeText(text)
    .then(onCopied)
    .catch(() => {})
}

function CodeSnippet({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const prismTheme = useSiteTheme() === 'dark' ? themes.vsDark : themes.vsLight
  const resolvedLang = LANG_ALIASES[lang.toLowerCase()] || lang.toLowerCase() || 'text'

  const onCopy = () =>
    copyText(code, () => {
      window.clearTimeout(timer.current)
      setCopied(true)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    })

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div className='olake-code my-[8px] overflow-hidden rounded-[8px] border border-solid border-olake-line'>
      <div className='flex items-center justify-between border-0 border-b border-solid border-olake-line bg-olake-surface-muted px-[10px] py-[6px] text-[11px] text-olake-muted'>
        <span className='font-mono uppercase'>{lang || 'text'}</span>
        <button
          type='button'
          onClick={onCopy}
          className='flex cursor-pointer items-center gap-[4px] rounded-[4px] border-0 bg-transparent px-[6px] py-[2px] text-olake-muted hover:text-olake-ink'
          aria-label='Copy code'
        >
          {copied ? <PiCheck size={13} className='text-olake-blue' /> : <PiCopy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <Highlight theme={prismTheme} code={code} language={resolvedLang}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className='m-0 overflow-x-auto p-[10px] font-mono text-[12.5px] leading-[1.6]'
            style={{ ...style, backgroundColor: 'transparent' }}
          >
            {tokens.map((line, li) => (
              <div key={li} {...getLineProps({ line })}>
                {line.map((token, ti) => (
                  <span key={ti} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

const MARKDOWN_COMPONENTS = {
  p: ({ children, node: _node, ...props }: any) => (
    <p className='m-0 mb-[6px] leading-[1.55]' {...props}>
      {children}
    </p>
  ),
  li: ({ children, node: _node, ...props }: any) => (
    <li className='mb-[3px] leading-[1.5]' {...props}>
      {children}
    </li>
  ),
  ul: ({ children, node: _node, ...props }: any) => (
    <ul className='m-0 mb-[6px] list-disc pl-[18px]' {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, node: _node, ...props }: any) => (
    <ol className='m-0 mb-[6px] list-decimal pl-[18px]' {...props}>
      {children}
    </ol>
  ),
  strong: ({ children, node: _node, ...props }: any) => (
    <strong className='font-semibold text-olake-ink' {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, node: _node, ...props }: any) => (
    <a
      {...props}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-olake-blue hover:underline'
    >
      {children}
    </a>
  ),
  code: ({ className, children, node: _node, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const isBlock = match || (typeof children === 'string' && children.includes('\n'))
    if (isBlock) {
      return <CodeSnippet lang={match?.[1] || ''} code={String(children).replace(/\n$/, '')} />
    }
    return (
      <code
        className='rounded-[4px] bg-olake-surface-muted px-[4px] py-[1px] font-mono text-[12.5px] text-olake-ink'
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: any) => <>{children}</>,
  h3: ({ children, node: _node, ...props }: any) => (
    <h3 className='m-0 mt-[8px] mb-[4px] text-[13.5px] font-semibold text-olake-ink' {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, node: _node, ...props }: any) => (
    <h4 className='m-0 mt-[6px] mb-[3px] text-[13px] font-semibold text-olake-ink' {...props}>
      {children}
    </h4>
  ),
  table: ({ children, node: _node, ...props }: any) => (
    <div className='my-[8px] overflow-x-auto rounded-[8px] border border-solid border-olake-line'>
      <table className='m-0 table w-full border-collapse text-[12.5px]' {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, node: _node, ...props }: any) => (
    <th
      className='border-0 border-b border-solid border-olake-line bg-olake-surface-muted px-[10px] py-[6px] text-left text-[12px] font-semibold'
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, node: _node, ...props }: any) => (
    <td className='border-0 border-b border-solid border-olake-line px-[10px] py-[5px]' {...props}>
      {children}
    </td>
  ),
  hr: () => <hr className='my-[10px] border-0 border-t border-solid border-olake-line' />
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {text}
    </Markdown>
  )
}

// ---------------------------------------------------------------------------
// Sizing and page context
// ---------------------------------------------------------------------------

const DEFAULT_SIZE = { w: 400, h: 560 }
const EXPANDED_SIZE = { w: 720, h: 720 }
const MIN_SIZE = { w: 320, h: 360 }

function clampSize(w: number, h: number) {
  const maxW = Math.max(MIN_SIZE.w, window.innerWidth - 40)
  const maxH = Math.max(MIN_SIZE.h, window.innerHeight - 104)
  return {
    w: Math.round(Math.min(maxW, Math.max(MIN_SIZE.w, w))),
    h: Math.round(Math.min(maxH, Math.max(MIN_SIZE.h, h)))
  }
}

// Title of the docs, blog, compare or learn page being read, for the "Ask about this page" chip.
function usePageTitle(): string {
  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    const update = () => {
      const path = window.location.pathname
      const onContentPage = ['/docs', '/blog', '/compare', '/learn'].some((p) => path.startsWith(p))
      if (!onContentPage) {
        setPageTitle('')
        return
      }
      setPageTitle(
        (document.title || '')
          .replace(/\s*[|·—]\s*[Oo][Ll]ake.*$/, '')
          .replace(/\s*[|·—]\s*olake\.io.*$/, '')
          .trim()
      )
    }
    update()
    // Docusaurus navigates with pushState, which fires no popstate. The <title> changes on
    // every route change, so it is observed as well.
    window.addEventListener('popstate', update)
    const titleEl = document.querySelector('title')
    let observer: MutationObserver | undefined
    if (titleEl) {
      observer = new MutationObserver(update)
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true })
    }
    return () => {
      window.removeEventListener('popstate', update)
      observer?.disconnect()
    }
  }, [])

  return pageTitle
}

// ---------------------------------------------------------------------------
// Pieces of a message
// ---------------------------------------------------------------------------

const ASSISTANT_BUBBLE =
  'flex flex-col gap-[8px] rounded-[12px] px-[14px] py-[10px] text-[13.5px] self-start border ' +
  'border-solid border-olake-line bg-olake-surface-alt max-w-[92%]'

const CHIP_LINK =
  'inline-flex items-center gap-[5px] rounded-[7px] border border-solid border-olake-line ' +
  'bg-olake-surface px-[10px] py-[5px] text-[12px] text-olake-ink transition-colors ' +
  'hover:border-olake-blue hover:text-olake-blue'

// The pages an answer links to, in the order they are cited. Kapa's SDK also returns a source
// list, but it only keeps the sources already cited in the part of the answer that had been
// written when the list arrived, so links near the end were dropped. Reading the finished
// answer gives every cited page; the SDK's list is used for the page titles where it has them.
function citedSources(answer: string, sources: Source[]): Array<{ url: string; title: string }> {
  const titles = new Map(sources.map((source) => [source.source_url, source.title]))
  const cited = new Map<string, string>()
  const prose = answer.replace(/```[\s\S]*?```/g, '')
  for (const [, label, url] of prose.matchAll(/\[([^[\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
    if (!cited.has(url)) cited.set(url, titles.get(url) || label)
  }
  return [...cited].map(([url, title]) => ({ url, title }))
}

function SourceChips({ answer, sources }: { answer: string; sources: Source[] }) {
  const cited = citedSources(answer, sources)
  if (!cited.length) return null
  return (
    <div className='mt-[4px] flex flex-wrap gap-[6px] border-0 border-t border-solid border-olake-line pt-[8px]'>
      {cited.map(({ url, title }, i) => {
        const { label, icon: Icon } = inferSourceType(url)
        return (
          <a
            key={url}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            title={title}
            className='inline-flex items-center gap-[4px] rounded-full border border-solid border-olake-line bg-olake-surface px-[8px] py-[2px] text-[11.5px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue'
          >
            <span className='font-semibold text-olake-blue'>[{i + 1}]</span>
            <Icon size={11} className='text-olake-muted' />
            <span className='text-[10px] font-medium text-olake-muted'>{label}</span>
            <span className='max-w-[160px] truncate'>{title}</span>
          </a>
        )
      })}
    </div>
  )
}

function EscalationLinks({ question }: { question: string }) {
  const issueUrl =
    'https://github.com/datazip-inc/olake-go/issues/new?title=' +
    encodeURIComponent(question || 'Question') +
    '&body=' +
    encodeURIComponent(
      'I asked AskOlake but it could not find the answer.\n\n**Question:** ' +
        question +
        '\n\n**Expected:** (describe what you need)'
    )
  return (
    <div className='mt-[4px] flex flex-wrap gap-[6px] border-0 border-t border-solid border-olake-line pt-[8px]'>
      <a
        href='https://olake.io/slack/'
        target='_blank'
        rel='noopener noreferrer'
        className={CHIP_LINK}
      >
        <PiSlackLogo size={14} className='text-olake-muted' />
        <span>Ask in Slack</span>
      </a>
      <a href={issueUrl} target='_blank' rel='noopener noreferrer' className={CHIP_LINK}>
        <PiGithubLogo size={14} className='text-olake-muted' />
        <span>Open Issue</span>
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

type PanelProps = {
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
  pendingQuestion: string | null
  onPendingQuestionHandled: () => void
}

function Panel({
  isOpen,
  isMobile,
  onClose,
  pendingQuestion,
  onPendingQuestionHandled
}: PanelProps) {
  const {
    conversation,
    submitQuery,
    isGeneratingAnswer,
    isPreparingAnswer,
    error,
    resetConversation,
    stopGeneration,
    addFeedback
  } = useChat()
  const history = useConversationHistory()
  const isLoading = isGeneratingAnswer || isPreparingAnswer

  const [question, setQuestion] = useState('')
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null)
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  const [size, setSize] = useState(DEFAULT_SIZE)
  const drag = useRef<{ x: number; y: number; w: number; h: number; moved: boolean } | null>(null)
  const dragged = useRef(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pageTitle = usePageTitle()

  // After a page reload, bring back the last conversation unless "Restart chat" ended it.
  const restoreChecked = useRef(false)
  useEffect(() => {
    if (restoreChecked.current) return
    restoreChecked.current = true
    const latest = history.threads[0]
    if (latest && conversation.length === 0 && latest.updatedAt > readResetAt()) {
      history.restoreThread(latest.threadId)
    }
  }, [history, conversation.length])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversation, isLoading, error, isOpen])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  // A question handed over by window.AskOLake.ask().
  useEffect(() => {
    if (!pendingQuestion || isLoading) return
    submitQuery(redactSecrets(pendingQuestion))
    onPendingQuestionHandled()
  }, [pendingQuestion, isLoading, submitQuery, onPendingQuestionHandled])

  const sendQuestion = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    if (submitQuery(redactSecrets(trimmed))) setQuestion('')
  }

  const resetChat = () => {
    stopGeneration()
    resetConversation()
    writeResetAt()
    setQuestion('')
    setActiveFeedbackId(null)
    setCopiedAnswerId(null)
    inputRef.current?.focus()
  }

  const copyAnswer = (text: string, id: string) => {
    // Drop the ``` fence lines so pasted code is runnable as is.
    const stripped = text.replace(/```[\w]*\n[\s\S]*?```/g, (match) =>
      match.split('\n').slice(1, -1).join('\n')
    )
    copyText(stripped, () => {
      window.clearTimeout(copyTimer.current)
      setCopiedAnswerId(id)
      copyTimer.current = window.setTimeout(() => setCopiedAnswerId(null), 2000)
    })
  }

  const onResizeStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h, moved: false }
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
    setSize((prev) => (prev.w >= expanded.w && prev.h >= expanded.h ? DEFAULT_SIZE : expanded))
  }

  const panelStyle = useMemo(
    () =>
      isMobile
        ? { position: 'fixed' as const, inset: 0, width: '100%', height: '100%' }
        : { width: size.w, height: size.h },
    [isMobile, size]
  )

  if (!isOpen) return null

  const latest = conversation.length ? conversation[conversation.length - 1] : undefined
  const isWaitingForFirstToken = isLoading && !latest?.answer

  return (
    <div
      role='dialog'
      aria-label='AskOlake'
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      style={panelStyle}
      className={
        isMobile
          ? 'z-[10000] flex flex-col overflow-hidden bg-olake-surface'
          : 'relative flex max-h-[calc(100vh-104px)] max-w-[calc(100vw-40px)] flex-col ' +
            'overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface ' +
            'shadow-[var(--olake-shadow-menu)] transition-shadow'
      }
    >
      {/* Resize gripper (desktop only) */}
      {!isMobile && (
        <button
          type='button'
          aria-label='Resize chat (drag, or click to toggle expanded view)'
          title='Drag to resize, click to expand'
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
          onPointerCancel={onResizeEnd}
          onClick={onResizeClick}
          className='absolute top-0 left-0 z-[1] h-[22px] w-[22px] cursor-nwse-resize touch-none border-0 bg-transparent p-0 text-olake-muted hover:text-olake-ink'
        >
          <svg viewBox='0 0 22 22' width='22' height='22' aria-hidden='true' className='block'>
            <path
              d='M6 14 L14 6 M6 10 L10 6'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className='flex shrink-0 items-center justify-between border-0 border-b border-solid border-olake-line bg-olake-surface-alt py-[10px] pr-[14px] pl-[26px]'>
        <div className='flex items-center gap-[6px]'>
          <PiSparkle className='text-olake-blue' size={16} />
          <p className='m-0 text-[14px] font-semibold text-olake-ink'>AskOlake</p>
        </div>
        <div className='flex items-center gap-[4px]'>
          <button
            type='button'
            onClick={resetChat}
            className='flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-ink'
            title='Restart chat'
            aria-label='Restart chat'
          >
            <PiArrowClockwise size={16} />
          </button>
          <button
            type='button'
            onClick={onClose}
            className='flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-ink'
            title='Close assistant'
            aria-label='Close assistant'
          >
            <PiX size={16} />
          </button>
        </div>
      </div>

      {/* Message log */}
      <div
        ref={scrollRef}
        aria-live='polite'
        className='flex-1 overflow-y-auto px-[16px] py-[14px]'
      >
        <div className='flex flex-col gap-[14px]'>
          {/* Welcome message, with suggested questions until the first one is asked */}
          <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-text')}>
            <MarkdownContent text={WELCOME} />
            {conversation.length === 0 && (
              <div className='mt-[6px] flex flex-col gap-[6px]'>
                <p className='m-0 text-[12px] font-medium text-olake-muted'>Suggested questions:</p>
                {pageTitle && (
                  <button
                    type='button'
                    onClick={() => sendQuestion(`What does the "${pageTitle}" page cover?`)}
                    className='flex cursor-pointer items-center gap-[6px] rounded-[8px] border border-solid border-olake-blue bg-olake-surface px-[10px] py-[6px] text-left text-[12.5px] text-olake-blue transition-colors hover:bg-olake-blue hover:text-olake-on-blue'
                  >
                    <PiSparkle size={13} />
                    <span>Ask about this page: {pageTitle}</span>
                  </button>
                )}
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type='button'
                    onClick={() => sendQuestion(suggestion)}
                    className='cursor-pointer rounded-[8px] border border-solid border-olake-line bg-olake-surface px-[10px] py-[6px] text-left text-[12.5px] text-olake-ink transition-colors hover:border-olake-blue hover:text-olake-blue'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {conversation.map((qa, i) => {
            const isLast = i === conversation.length - 1
            const answerId = qa.status === 'streaming' ? null : qa.id
            const isUncertain = qa.status !== 'streaming' && qa.metadata.is_uncertain
            return (
              <React.Fragment key={i}>
                <div className='flex max-w-[85%] flex-col gap-[8px] self-end rounded-[12px] bg-olake-blue px-[14px] py-[10px] text-[13.5px] text-olake-on-blue'>
                  <p className='m-0 leading-[1.5]'>{qa.question}</p>
                </div>

                {qa.answer && (
                  <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-text')}>
                    <MarkdownContent text={qa.answer} />

                    {answerId && <SourceChips answer={qa.answer} sources={qa.sources} />}

                    {/* Where to go next when the docs did not have the answer */}
                    {isUncertain && isLast && <EscalationLinks question={qa.question} />}

                    {answerId && (
                      <div className='mt-[4px] flex items-center justify-between border-0 border-t border-solid border-olake-line pt-[6px] text-[11.5px] text-olake-muted'>
                        {qa.reaction ? (
                          <span className='text-olake-blue'>Thanks for your feedback!</span>
                        ) : (
                          <div className='flex items-center gap-[6px]'>
                            <span>Helpful?</span>
                            <button
                              type='button'
                              onClick={() => addFeedback(answerId, 'upvote')}
                              className='flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-blue'
                              title='Helpful'
                              aria-label='Helpful'
                            >
                              <PiThumbsUp size={13} />
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                setActiveFeedbackId(activeFeedbackId === answerId ? null : answerId)
                              }
                              className='flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-danger'
                              title='Not helpful'
                              aria-label='Not helpful'
                            >
                              <PiThumbsDown size={13} />
                            </button>
                          </div>
                        )}
                        <button
                          type='button'
                          onClick={() => copyAnswer(qa.answer, answerId)}
                          className='flex cursor-pointer items-center gap-[3px] rounded-[4px] border-0 bg-transparent px-[4px] py-[2px] text-[11px] text-olake-muted hover:text-olake-ink'
                          title='Copy answer'
                          aria-label='Copy answer'
                        >
                          {copiedAnswerId === answerId ? (
                            <>
                              <PiCheck size={12} className='text-olake-blue' />
                              <span className='text-olake-blue'>Copied</span>
                            </>
                          ) : (
                            <>
                              <PiCopy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {answerId && activeFeedbackId === answerId && !qa.reaction && (
                      <div className='flex flex-col gap-[6px] rounded-[8px] border border-solid border-olake-line bg-olake-surface p-[8px] text-[12px]'>
                        <span className='font-medium text-olake-ink'>What was the issue?</span>
                        <div className='flex flex-wrap gap-[4px]'>
                          {FEEDBACK_CATEGORIES.map(({ label, comment }) => (
                            <button
                              key={label}
                              type='button'
                              onClick={() => {
                                addFeedback(answerId, 'downvote', comment)
                                setActiveFeedbackId(null)
                              }}
                              className='cursor-pointer rounded-[6px] border border-solid border-olake-line bg-olake-surface-alt px-[8px] py-[3px] text-olake-ink hover:border-olake-blue hover:text-olake-blue'
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          })}

          {isWaitingForFirstToken && (
            <div className='self-start rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt px-[12px] py-[8px] text-[13px] text-olake-muted'>
              <span className='inline-flex items-center gap-[6px]'>
                <PiSparkle className='animate-spin text-olake-blue' size={14} />
                Searching OLake documentation...
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-danger')}>
              <p className='m-0 leading-[1.5]'>{error.trim() || ERROR_MESSAGE}</p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendQuestion(question)
        }}
        className='flex shrink-0 flex-col gap-[0px] border-0 border-t border-solid border-olake-line'
      >
        <div className='flex items-center gap-[8px] p-[12px]'>
          <input
            ref={inputRef}
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Ask about connectors, CDC, Iceberg, Fusion...'
            aria-label='Ask a question'
            disabled={isLoading}
            maxLength={4000}
            className='h-[38px] flex-1 rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface px-[12px] text-[13.5px] text-olake-ink outline-none focus:border-olake-blue focus:shadow-none focus-visible:outline-none'
          />
          {isLoading ? (
            <button
              type='button'
              onClick={stopGeneration}
              aria-label='Stop answering'
              title='Stop answering'
              className='lk-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue text-olake-on-blue transition-colors hover:bg-olake-blue-hover'
            >
              <PiStopFill size={16} aria-hidden='true' />
            </button>
          ) : (
            <button
              type='submit'
              aria-label='Send question'
              disabled={!question.trim()}
              className='lk-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue text-olake-on-blue transition-colors hover:bg-olake-blue-hover disabled:cursor-not-allowed disabled:opacity-50'
            >
              <PiPaperPlaneRight size={16} aria-hidden='true' />
            </button>
          )}
        </div>
        <div className='flex items-center justify-between gap-[8px] px-[14px] pb-[8px] text-[10.5px] text-olake-muted'>
          <span>AI answers can be wrong. Check the sources.</span>
          {/* Kapa's terms require this attribution to stay visible. */}
          <a
            href='https://kapa.ai'
            target='_blank'
            rel='noopener noreferrer'
            className='shrink-0 text-olake-muted hover:text-olake-blue'
          >
            Powered by kapa.ai
          </a>
        </div>
        {/* Google requires this notice wherever the reCAPTCHA badge is hidden (see ChatPanel below). */}
        <p className='m-0 px-[14px] pb-[8px] text-[10px] leading-[1.4] text-olake-muted'>
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href='https://policies.google.com/privacy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-olake-muted underline hover:text-olake-blue'
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href='https://policies.google.com/terms'
            target='_blank'
            rel='noopener noreferrer'
            className='text-olake-muted underline hover:text-olake-blue'
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </form>
    </div>
  )
}

export default function ChatPanel({
  integrationId,
  ...panelProps
}: PanelProps & { integrationId: string }) {
  return (
    <KapaProvider integrationId={integrationId} callbacks={KAPA_CALLBACKS}>
      {/* Kapa's bot protection adds Google's floating reCAPTCHA badge in the same corner as the
          Ask OLake button. It is hidden here and replaced by the notice in the panel footer. */}
      <style>{'.grecaptcha-badge { visibility: hidden; }'}</style>
      <Panel {...panelProps} />
    </KapaProvider>
  )
}
