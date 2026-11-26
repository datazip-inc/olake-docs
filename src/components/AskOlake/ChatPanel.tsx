// Ask OLake: the chat panel. Loaded on demand by index.tsx.
// The conversation and the calls to the backend live in useAskOlake.ts.

import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Highlight, themes } from 'prism-react-renderer'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { IconContext } from 'react-icons'
import {
  PiCheck,
  PiCopy,
  PiPaperPlaneRight,
  PiStopFill,
  PiClockCounterClockwise,
  PiPlus,
  PiTrash,
  PiX,
  PiThumbsUp,
  PiThumbsDown,
  PiSparkle,
  PiSlackLogo,
  PiGithubLogo,
  PiBookOpen,
  PiGitBranch,
  PiLink,
  PiChatCircle
} from 'react-icons/pi'
import { useAskOlake, type Source } from './useAskOlake'
// Shared with the backend, which masks credentials a second time.
import { redactSecrets } from '../../../ask-olake/src/redact'

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

const FEEDBACK_REASONS = [
  'Wrong Answer',
  'Incorrect Code',
  'Outdated Info',
  'Missing Steps',
  'Other'
]

const MAX_QUESTION_CHARS = 4000

const HEADER_BUTTON =
  'flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] border-0 ' +
  'bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-ink'

/** When a saved conversation was last used, in a few words. */
function ago(time: number): string {
  const minutes = Math.round((Date.now() - time) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h ago`
  return new Date(time).toLocaleDateString()
}

// Every icon in the panel sits next to visible text or inside a labelled button.
const DECORATIVE_ICONS = { attr: { 'aria-hidden': true } }

// ---------------------------------------------------------------------------
// Source type, inferred from the source URL
// ---------------------------------------------------------------------------

const SOURCE_TYPES: Array<{ pattern: RegExp; label: string; icon: typeof PiBookOpen }> = [
  { pattern: /olake\.io\/docs\//, label: 'Docs', icon: PiBookOpen },
  { pattern: /olake\.io\/blog\//, label: 'Blog', icon: PiBookOpen },
  { pattern: /olake\.io\/compare\//, label: 'Compare', icon: PiBookOpen },
  { pattern: /olake\.io\/learn\//, label: 'Learn', icon: PiBookOpen },
  { pattern: /github\.com\/.*\/(issues|discussions|pull)\//, label: 'Issue', icon: PiChatCircle },
  { pattern: /github\.com\//, label: 'Repo', icon: PiGitBranch }
]

function sourceType(url: string): { label: string; icon: typeof PiBookOpen } {
  return SOURCE_TYPES.find(({ pattern }) => pattern.test(url)) ?? { label: 'Link', icon: PiLink }
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

// react-markdown passes the syntax-tree `node` to every component. It is dropped here so it
// does not end up as an attribute on the DOM element.
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
  // Infima makes tables display:block, which stops w-full from stretching the columns.
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
      setPageTitle(
        onContentPage
          ? (document.title || '').replace(/\s*[|·—]\s*(?:olake\.io|olake).*$/i, '').trim()
          : ''
      )
    }
    update()
    // Docusaurus navigates with pushState, which fires no popstate. The <title> changes on
    // every route change, so it is observed as well.
    window.addEventListener('popstate', update)
    const titleEl = document.querySelector('title')
    const observer = titleEl ? new MutationObserver(update) : undefined
    if (titleEl) observer?.observe(titleEl, { childList: true, characterData: true, subtree: true })
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

function SourceChips({ sources }: { sources: Source[] }) {
  // Only web links: a source URL is never trusted as anything else.
  const links = sources.filter((source) => /^https?:\/\//i.test(source.url))
  if (!links.length) return null
  return (
    <div className='mt-[4px] flex flex-wrap gap-[6px] border-0 border-t border-solid border-olake-line pt-[8px]'>
      {links.map(({ url, title }, i) => {
        const { label, icon: Icon } = sourceType(url)
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
            <span className='max-w-[160px] truncate'>{title || url}</span>
          </a>
        )
      })}
    </div>
  )
}

function EscalationLinks({ question }: { question: string }) {
  // Cut to keep the link well under GitHub's URL length limit.
  const issueUrl =
    'https://github.com/datazip-inc/olake-go/issues/new?title=' +
    encodeURIComponent(question.slice(0, 120) || 'Question') +
    '&body=' +
    encodeURIComponent(
      'I asked AskOlake but it could not find the answer.\n\n**Question:** ' +
        question.slice(0, 1500) +
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

type ChatPanelProps = {
  apiUrl: string
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
  /** A question handed over by `window.AskOLake.ask()`. */
  pendingQuestion: string | null
  onPendingQuestionHandled: () => void
}

function Panel({
  apiUrl,
  isOpen,
  isMobile,
  onClose,
  pendingQuestion,
  onPendingQuestionHandled
}: ChatPanelProps) {
  // Opened with a question from the page: start a new conversation, do not continue the old one.
  const [restore] = useState(!pendingQuestion)
  const { turns, isLoading, error, ask, stop, vote, conversations, newChat, open, remove } =
    useAskOlake(apiUrl, restore)

  const [question, setQuestion] = useState('')
  // The list of saved conversations, shown in place of the messages.
  const [showHistory, setShowHistory] = useState(false)
  const [feedbackOpenFor, setFeedbackOpenFor] = useState<string | null>(null)
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  const [size, setSize] = useState(DEFAULT_SIZE)
  const drag = useRef<{ x: number; y: number; w: number; h: number; moved: boolean } | null>(null)
  const dragged = useRef(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pageTitle = usePageTitle()

  // Follow new text only while the reader is at the bottom, so scrolling up to read is not undone
  // by the next streamed words. A new question always jumps to the bottom.
  const stickToBottom = useRef(true)
  const turnCount = useRef(0)
  const onLogScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const asked = turns.length > turnCount.current
    turnCount.current = turns.length
    if (asked || stickToBottom.current) {
      el.scrollTop = el.scrollHeight
      stickToBottom.current = true
    }
  }, [turns, isLoading, error, isOpen, showHistory])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const sendQuestion = (text: string): boolean => {
    const cleaned = redactSecrets(text.trim()).slice(0, MAX_QUESTION_CHARS)
    if (!cleaned || isLoading) return false
    setShowHistory(false)
    ask(cleaned)
    return true
  }

  useEffect(() => {
    if (pendingQuestion && sendQuestion(pendingQuestion)) onPendingQuestionHandled()
    // sendQuestion is recreated on every render; isLoading is what decides when to retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion, isLoading])

  /** Shows a saved conversation, or starts a new one. The one on screen stays saved. */
  const switchTo = (conversationId?: string) => {
    if (conversationId) open(conversationId)
    else newChat()
    setShowHistory(false)
    setQuestion('')
    setFeedbackOpenFor(null)
    setCopiedAnswerId(null)
    inputRef.current?.focus()
  }

  const copyAnswer = (text: string, id: string) => {
    // Drop the ``` fence lines so pasted code is runnable as is.
    const stripped = text.replace(/```[^\n]*\n[\s\S]*?```/g, (match) =>
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

  const isWaitingForFirstWords = isLoading && !turns[turns.length - 1]?.answer

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
            onClick={() => switchTo()}
            className={HEADER_BUTTON}
            title='New chat'
            aria-label='New chat'
          >
            <PiPlus size={16} />
          </button>
          <button
            type='button'
            onClick={() => setShowHistory(!showHistory)}
            className={clsx(HEADER_BUTTON, showHistory && 'bg-olake-surface text-olake-ink')}
            title='Chat history'
            aria-label='Chat history'
            aria-pressed={showHistory}
          >
            <PiClockCounterClockwise size={16} />
          </button>
          <button
            type='button'
            onClick={onClose}
            className={HEADER_BUTTON}
            title='Close assistant'
            aria-label='Close assistant'
          >
            <PiX size={16} />
          </button>
        </div>
      </div>

      {/* Saved conversations */}
      {showHistory && (
        <div className='flex-1 overflow-y-auto px-[16px] py-[14px]'>
          <p className='m-0 mb-[10px] text-[12px] text-olake-muted'>
            {conversations.length
              ? 'Your chats, saved in this browser only.'
              : 'No saved chats yet. Chats are saved in this browser only.'}
          </p>
          <ul className='m-0 flex list-none flex-col gap-[6px] p-0'>
            {conversations.map(({ id, updated, turns: saved }) => (
              <li
                key={id}
                className='flex items-center gap-[4px] rounded-[8px] border border-solid border-olake-line bg-olake-surface transition-colors hover:border-olake-blue'
              >
                <button
                  type='button'
                  onClick={() => switchTo(id)}
                  className='flex min-w-0 flex-1 cursor-pointer flex-col gap-[2px] border-0 bg-transparent px-[10px] py-[7px] text-left'
                >
                  <span className='truncate text-[13px] text-olake-ink'>{saved[0].question}</span>
                  <span className='text-[11px] text-olake-muted'>
                    {saved.length} {saved.length === 1 ? 'question' : 'questions'} · {ago(updated)}
                  </span>
                </button>
                <button
                  type='button'
                  onClick={() => remove(id)}
                  className='mr-[6px] flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent text-olake-muted hover:text-olake-danger'
                  title='Delete chat'
                  aria-label={`Delete chat: ${saved[0].question}`}
                >
                  <PiTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message log. aria-busy holds screen readers back until an answer is complete. */}
      <div
        ref={scrollRef}
        onScroll={onLogScroll}
        aria-live='polite'
        aria-busy={isLoading}
        className={clsx('flex-1 overflow-y-auto px-[16px] py-[14px]', showHistory && 'hidden')}
      >
        <div className='flex flex-col gap-[14px]'>
          {/* Welcome message, with suggested questions until the first one is asked */}
          <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-text')}>
            <MarkdownContent text={WELCOME} />
            {turns.length === 0 && (
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

          {turns.map((turn, i) => (
            <React.Fragment key={i}>
              <div className='flex max-w-[85%] flex-col gap-[8px] self-end rounded-[12px] bg-olake-blue px-[14px] py-[10px] text-[13.5px] text-olake-on-blue'>
                <p className='m-0 leading-[1.5]'>{turn.question}</p>
              </div>

              {turn.answer && (
                <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-text')}>
                  <MarkdownContent text={turn.answer} />

                  {turn.id && <SourceChips sources={turn.sources} />}

                  {/* Where to go next when the docs did not have the answer */}
                  {turn.uncertain && i === turns.length - 1 && (
                    <EscalationLinks question={turn.question} />
                  )}

                  {turn.id && (
                    <div className='mt-[4px] flex items-center justify-between border-0 border-t border-solid border-olake-line pt-[6px] text-[11.5px] text-olake-muted'>
                      {turn.vote ? (
                        <span className='text-olake-blue'>Thanks for your feedback!</span>
                      ) : (
                        <div className='flex items-center gap-[6px]'>
                          <span>Helpful?</span>
                          <button
                            type='button'
                            onClick={() => vote(turn.id!, 1)}
                            className='flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent text-olake-muted hover:bg-olake-surface hover:text-olake-blue'
                            title='Helpful'
                            aria-label='Helpful'
                          >
                            <PiThumbsUp size={13} />
                          </button>
                          <button
                            type='button'
                            onClick={() =>
                              setFeedbackOpenFor(feedbackOpenFor === turn.id ? null : turn.id)
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
                        onClick={() => copyAnswer(turn.answer, turn.id!)}
                        className='flex cursor-pointer items-center gap-[3px] rounded-[4px] border-0 bg-transparent px-[4px] py-[2px] text-[11px] text-olake-muted hover:text-olake-ink'
                        title='Copy answer'
                        aria-label='Copy answer'
                      >
                        {copiedAnswerId === turn.id ? (
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

                  {turn.id && feedbackOpenFor === turn.id && !turn.vote && (
                    <div className='flex flex-col gap-[6px] rounded-[8px] border border-solid border-olake-line bg-olake-surface p-[8px] text-[12px]'>
                      <span className='font-medium text-olake-ink'>What was the issue?</span>
                      <div className='flex flex-wrap gap-[4px]'>
                        {FEEDBACK_REASONS.map((reason) => (
                          <button
                            key={reason}
                            type='button'
                            onClick={() => {
                              vote(turn.id!, -1, reason)
                              setFeedbackOpenFor(null)
                            }}
                            className='cursor-pointer rounded-[6px] border border-solid border-olake-line bg-olake-surface-alt px-[8px] py-[3px] text-olake-ink hover:border-olake-blue hover:text-olake-blue'
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}

          {isWaitingForFirstWords && (
            <div className='self-start rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt px-[12px] py-[8px] text-[13px] text-olake-muted'>
              <span className='inline-flex items-center gap-[6px]'>
                <PiSparkle className='animate-spin text-olake-blue' size={14} />
                Searching OLake documentation...
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className={clsx(ASSISTANT_BUBBLE, 'text-olake-danger')}>
              <p className='m-0 leading-[1.5]'>{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (sendQuestion(question)) setQuestion('')
        }}
        className='flex shrink-0 flex-col border-0 border-t border-solid border-olake-line'
      >
        <div className='flex items-center gap-[8px] p-[12px]'>
          {/* readOnly, not disabled, while an answer is written: the input keeps keyboard focus. */}
          <input
            ref={inputRef}
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Ask about connectors, CDC, Iceberg, Fusion...'
            aria-label='Ask a question'
            readOnly={isLoading}
            maxLength={MAX_QUESTION_CHARS}
            className='h-[38px] flex-1 rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface px-[12px] text-[13.5px] text-olake-ink outline-none focus:border-olake-blue focus:shadow-none focus-visible:outline-none'
          />
          {isLoading ? (
            <button
              type='button'
              onClick={stop}
              aria-label='Stop answering'
              title='Stop answering'
              className='lk-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue text-olake-on-blue transition-colors hover:bg-olake-blue-hover'
            >
              <PiStopFill size={16} />
            </button>
          ) : (
            <button
              type='submit'
              aria-label='Send question'
              disabled={!question.trim()}
              className='lk-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-olake-blue text-olake-on-blue transition-colors hover:bg-olake-blue-hover disabled:cursor-not-allowed disabled:opacity-50'
            >
              <PiPaperPlaneRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function ChatPanel(props: ChatPanelProps) {
  return (
    <IconContext.Provider value={DECORATIVE_ICONS}>
      <Panel {...props} />
    </IconContext.Provider>
  )
}
