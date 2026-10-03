import React, { useEffect, useRef, useState } from 'react'
import { PiCheck, PiCopy } from 'react-icons/pi'
import Card from '../ui/Card'
import { cn } from '@site/src/lib/utils'
import type { Swatch } from '@site/src/data/landing/branding'

/** Copies with the async Clipboard API, falling back to a hidden textarea where it is unavailable. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

export default function ColorSwatch({ swatch }: { swatch: Swatch }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    if (!(await copyText(swatch.hex))) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Card as='li' className='flex flex-col'>
      <div
        aria-hidden='true'
        onClick={copy}
        className='h-[88px] cursor-pointer border-0 border-b border-solid border-olake-line lg:h-[104px]'
        style={{ backgroundColor: swatch.hex }}
      />
      <div className='flex flex-1 flex-col px-[18px] pb-[18px] pt-[16px]'>
        <h4 className='mb-0 text-[16px] font-medium leading-[1.3] text-olake-ink'>{swatch.name}</h4>
        <p className='mb-0 mt-[6px] flex-1 text-[13px] leading-[1.6] text-olake-text-2'>{swatch.usage}</p>
        <dl className='m-0 mt-[14px] grid grid-cols-[auto_1fr] items-center gap-x-[12px] gap-y-[6px] text-[12px]'>
          <dt className='text-olake-muted'>HEX</dt>
          <dd className='m-0'>
            <button
              type='button'
              onClick={copy}
              aria-label={`Copy hex ${swatch.hex}`}
              className={cn(
                'inline-flex cursor-pointer items-center gap-[6px] rounded-[6px] border border-solid px-[8px] py-[3px] font-mono text-[12px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue',
                copied
                  ? 'border-olake-success-text bg-olake-success-bg text-olake-success-text'
                  : 'border-olake-line bg-olake-surface-alt text-olake-ink hover:border-olake-blue hover:text-olake-blue'
              )}
            >
              {copied ? <PiCheck size={13} aria-hidden='true' /> : <PiCopy size={13} aria-hidden='true' />}
              <span>{copied ? 'Copied' : swatch.hex}</span>
            </button>
            <span role='status' aria-live='polite' className='sr-only'>
              {copied ? `Copied ${swatch.hex}` : ''}
            </span>
          </dd>
          <dt className='text-olake-muted'>RGB</dt>
          <dd className='m-0 font-mono text-olake-text'>{swatch.rgb}</dd>
          <dt className='text-olake-muted'>HSL</dt>
          <dd className='m-0 font-mono text-olake-text'>{swatch.hsl}</dd>
        </dl>
      </div>
    </Card>
  )
}
