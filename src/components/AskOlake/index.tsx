// Ask OLake: the documentation assistant's floating button.
//
// This file is deliberately small because it is part of every page (it is mounted in
// src/theme/Root). The chat panel, the Kapa SDK and the Markdown renderer live in ChatPanel.tsx,
// which is fetched the first time someone opens the assistant.
//
// Other parts of the site can open it with `window.AskOLake.open()`, `.close()` or
// `.ask(question)`.

import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PiChatCircleDots } from 'react-icons/pi'

const ChatPanel = lazy(() => import('./ChatPanel'))

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
  const integrationId = (siteConfig.customFields?.kapaIntegrationId as string) || ''

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

  useEffect(() => {
    if (!integrationId) return
    ;(window as any).AskOLake = { open, close, ask }
    return () => {
      delete (window as any).AskOLake
    }
  }, [integrationId, open, close, ask])

  if (!integrationId) return null

  return (
    <div
      className={clsx(
        'fixed z-[9999]',
        isMobile ? 'right-[16px] bottom-[16px]' : 'right-[20px] bottom-[20px]',
        !isMobile && 'flex flex-col items-end gap-[12px]'
      )}
    >
      {hasOpened && (
        <Suspense fallback={null}>
          <ChatPanel
            integrationId={integrationId}
            isOpen={isOpen}
            isMobile={isMobile}
            onClose={close}
            pendingQuestion={pendingQuestion}
            onPendingQuestionHandled={clearPendingQuestion}
          />
        </Suspense>
      )}

      {/* Floating button: hidden on mobile while the full-screen panel is open */}
      {(!isOpen || !isMobile) && (
        <button
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
