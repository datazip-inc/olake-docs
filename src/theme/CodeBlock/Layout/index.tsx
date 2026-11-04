import React, { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { translate } from '@docusaurus/Translate'
import { useCodeBlockContext } from '@docusaurus/theme-common/internal'
import Container from '@theme/CodeBlock/Container'
import Content from '@theme/CodeBlock/Content'
import WordWrapButton from '@theme/CodeBlock/Buttons/WordWrapButton'
import { PiCheck, PiCopy } from 'react-icons/pi'

// Swizzled at Layout (the first level that can add a header row for every block). Docusaurus' own
// header only exists for blocks with a title. Everything else (highlighting, line numbers, magic
// comments, word wrap) still comes from the stock Container, Content and WordWrapButton.
//
// Rows: [language label or title] ........ [word wrap toggle] [Copy]. Styles: src/css/code-search.css.

// Fence names that read better under another name. Names not listed here are shown as written.
const LANGUAGE_LABELS: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  'shell-session': 'bash',
  yml: 'yaml',
  py: 'python',
  js: 'javascript',
  ts: 'typescript',
  dockerfile: 'docker',
  'docker-compose': 'docker compose',
  md: 'markdown',
}

// Fences that mean "no language".
const NO_LANGUAGE = new Set(['text', 'txt', 'plain', 'plaintext', 'none'])

function languageLabel(language?: string): string | undefined {
  if (!language) return undefined
  const key = language.toLowerCase()
  if (NO_LANGUAGE.has(key)) return undefined
  return LANGUAGE_LABELS[key] ?? key
}

async function copyToClipboard(text: string) {
  // The clipboard API only exists in secure contexts (HTTPS, localhost); fall back otherwise.
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  const { default: copy } = await import('copy-text-to-clipboard')
  copy(text)
}

function CopyButton() {
  const {
    metadata: { code }
  } = useCodeBlockContext()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const onCopy = useCallback(() => {
    copyToClipboard(code)
      .then(() => {
        window.clearTimeout(timer.current)
        setCopied(true)
        timer.current = window.setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => setCopied(false))
  }, [code])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copyLabel = translate({ id: 'theme.CodeBlock.copy', message: 'Copy' })
  const copiedLabel = translate({ id: 'theme.CodeBlock.copied', message: 'Copied' })

  return (
    <>
      <button
        type='button'
        className={clsx('olake-code__btn olake-code__copy', copied && 'is-copied')}
        onClick={onCopy}
        aria-label={translate({
          id: 'theme.CodeBlock.copyButtonAriaLabel',
          message: 'Copy code to clipboard'
        })}
      >
        {copied ? <PiCheck aria-hidden='true' /> : <PiCopy aria-hidden='true' />}
        <span aria-hidden='true'>{copied ? copiedLabel : copyLabel}</span>
      </button>
      <span className='olake-code__sr' role='status' aria-live='polite'>
        {copied ? copiedLabel : ''}
      </span>
    </>
  )
}

export default function CodeBlockLayout({ className }: { className?: string }) {
  const { metadata } = useCodeBlockContext()
  const label = metadata.title ? undefined : languageLabel(metadata.language)

  return (
    <Container as='div' className={clsx(className, metadata.className, 'olake-code')}>
      <div className='olake-code__header'>
        {metadata.title ? (
          <span className='olake-code__title'>{metadata.title}</span>
        ) : (
          label && <span className='olake-code__lang'>{label}</span>
        )}
        {/* Buttons are client-only (like the stock ones): an SSR button would do nothing until
            hydration. The header height is fixed, so nothing shifts when they appear. */}
        <BrowserOnly>
          {() => (
            <div className='olake-code__actions'>
              <WordWrapButton className='olake-code__btn olake-code__wrap' />
              <CopyButton />
            </div>
          )}
        </BrowserOnly>
      </div>
      <div className='olake-code__body'>
        <Content />
      </div>
    </Container>
  )
}
