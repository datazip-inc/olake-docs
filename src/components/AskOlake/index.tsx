// Ask OLake: the documentation assistant's floating button.
//
// This file is deliberately small because it is part of every page (it is mounted in
// src/theme/Root). The chat panel and the Markdown renderer live in ChatPanel.tsx, which is
// fetched the first time someone opens the assistant.
//
// Other parts of the site can open it with `window.AskOLake.open()`, `.close()` or
// `.ask(question)`.

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PiChatCircleDots } from 'react-icons/pi'

const loadChatPanel = () => lazy(() => import('./ChatPanel'))

// The panel is a separate file that can fail to load: the visitor is offline, or the page has
// been open since before a deploy that replaced the file. That must not take the docs page
// down with it, so the failure is caught here and the button goes back to its closed state.
class PanelBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

const BUTTON =
  'lk-press flex h-[52px] w-[52px] items-center justify-center rounded-[999px] border border-solid ' +
  'border-olake-btn-border bg-olake-blue text-olake-on-blue shadow-[var(--olake-shadow-menu)] ' +
  'transition-all hover:bg-olake-blue-hover hover:scale-105 active:scale-95'

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

export default function AskOlake() {
  const { siteConfig } = useDocusaurusContext()
  const apiUrl = (siteConfig.customFields?.askOlakeApiUrl as string) || ''

  const [isOpen, setIsOpen] = useState(false)
  // The panel is mounted on first open and then kept, so a conversation survives closing it.
  const [hasOpened, setHasOpened] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const open = useCallback(() => {
    setHasOpened(true)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const ask = useCallback(
    (question: string) => {
      open()
      if (question && question.trim()) setPendingQuestion(question.trim())
    },
    [open]
  )
  const clearPendingQuestion = useCallback(() => setPendingQuestion(null), [])

  // React keeps a failed lazy component failed, so a fresh one is made for the next click.
  const [ChatPanel, setChatPanel] = useState(loadChatPanel)
  const onPanelError = useCallback(() => {
    setIsOpen(false)
    setHasOpened(false)
    setPendingQuestion(null)
    setChatPanel(loadChatPanel)
  }, [])

  // Closing the panel hands keyboard focus back to the button that opened it.
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !isOpen) buttonRef.current?.focus()
    wasOpen.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!apiUrl) return
    ;(window as any).AskOLake = { open, close, ask }
    return () => {
      delete (window as any).AskOLake
    }
  }, [apiUrl, open, close, ask])

  // Without a backend to talk to, the assistant is not shown at all.
  if (!apiUrl) return null

  return (
    <div
      className={clsx(
        'fixed print:hidden',
        // Closed, the button stays under the navbar, the mobile menu and the search overlay
        // (z-index 200 and 201). Open, the panel has to cover the navbar on short screens.
        isOpen ? 'z-[9999]' : 'z-[199]',
        isMobile ? 'right-[16px] bottom-[16px]' : 'right-[20px] bottom-[20px]',
        !isMobile && 'flex flex-col items-end gap-[12px]'
      )}
    >
      {/* The docs "back to top" button uses this same corner, so it is lifted above the button. */}
      <style>{'button.theme-back-to-top-button { bottom: 84px; }'}</style>

      {hasOpened && (
        <PanelBoundary onError={onPanelError}>
          <Suspense fallback={null}>
            <ChatPanel
              apiUrl={apiUrl}
              isOpen={isOpen}
              isMobile={isMobile}
              onClose={close}
              pendingQuestion={pendingQuestion}
              onPendingQuestionHandled={clearPendingQuestion}
            />
          </Suspense>
        </PanelBoundary>
      )}

      {/* Floating button: hidden on mobile while the full-screen panel is open */}
      {(!isOpen || !isMobile) && (
        <button
          ref={buttonRef}
          type='button'
          aria-label={isOpen ? 'Close AskOlake' : 'Open AskOlake'}
          aria-expanded={isOpen}
          className={BUTTON}
          onClick={isOpen ? close : open}
        >
          <PiChatCircleDots size={24} aria-hidden='true' />
        </button>
      )}
    </div>
  )
}
