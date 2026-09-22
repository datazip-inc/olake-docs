import React, { useEffect, useRef, useState } from 'react'
import Link from '@docusaurus/Link'
import { PiGithubLogo, PiSlackLogo } from 'react-icons/pi'
import { cn } from '@site/src/lib/utils'
import useGetReleases from '@site/src/hooks/useGetReleases'
import {
  LAKESIDE_NAV,
  LAKESIDE_CTA,
  LAKESIDE_GITHUB,
  LAKESIDE_SLACK,
  type LakesideNavEntry,
  type LakesideNavLink
} from './navItems'

/** 4231 -> "4.2k", matching the design's "1.4k+" pill. */
function formatStars(n: number): string {
  if (!n) return '—'
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k+` : String(n)
}

const Chevron = () => (
  <svg width='10' height='6' viewBox='0 0 10 6' fill='none' aria-hidden='true'>
    <path d='M1 1L5 5L9 1' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round' />
  </svg>
)

/** The design uses Phosphor's outlined marks, the same set the footer uses. */
const GithubMark = () => <PiGithubLogo size={17} aria-hidden='true' />

const SlackMark = () => <PiSlackLogo size={18} aria-hidden='true' />

const StarMark = () => (
  <svg width='13' height='13' viewBox='0 0 14 14' fill='none' aria-hidden='true'>
    <path
      d='M7 1.5l1.64 3.32 3.67.54-2.65 2.58.62 3.65L7 9.87l-3.28 1.72.62-3.65L1.69 5.36l3.67-.54L7 1.5Z'
      stroke='currentColor'
      strokeWidth='1.1'
      strokeLinejoin='round'
    />
  </svg>
)

const Burger = ({ open }: { open: boolean }) => (
  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
    {open ? (
      <path
        d='M5 5l10 10M15 5L5 15'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    ) : (
      <path
        d='M3 6h14M3 10h14M3 14h14'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    )}
  </svg>
)

const NavAnchor = ({
  link,
  className,
  children
}: {
  link: LakesideNavLink
  className?: string
  children?: React.ReactNode
}) =>
  link.external ? (
    <a href={link.href} target='_blank' rel='noopener noreferrer' className={className}>
      {children ?? link.label}
    </a>
  ) : (
    <Link to={link.href} className={className}>
      {children ?? link.label}
    </Link>
  )

/** A desktop entry: a plain link, or a label that opens a dropdown panel. */
function DesktopEntry({ entry, active }: { entry: LakesideNavEntry; active: boolean }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const tone = active ? 'text-[#202020]' : 'text-[#9b9b9b] hover:text-[#202020]'

  if (!entry.items) {
    return (
      <Link to={entry.href!} className={cn('text-[14px] transition-colors', tone)}>
        {entry.label}
      </Link>
    )
  }

  return (
    <div
      ref={wrap}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex cursor-pointer items-center gap-[6px] border-none bg-transparent p-0 text-[14px] transition-colors',
          tone
        )}
      >
        {entry.label}
        <Chevron />
      </button>
      {open && (
        <div className='absolute left-0 top-full z-20 pt-[10px]'>
          <div className='min-w-[204px] rounded-[12px] border border-solid border-[#ececec] bg-white p-[6px] shadow-[0_12px_30px_-12px_rgba(16,24,64,0.24)]'>
            {entry.items.map((item) => (
              <NavAnchor
                key={item.href}
                link={item}
                className='block rounded-[8px] px-[12px] py-[9px] text-[14px] text-[#393939] transition-colors hover:bg-[#f5f6fa] hover:text-[#0029ce]'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export interface LakesideNavbarProps {
  /** Route the navbar should mark as current, e.g. "/". */
  activePath?: string
}

export default function LakesideNavbar({ activePath = '/' }: LakesideNavbarProps) {
  const { stargazersCount } = useGetReleases()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <header className='sticky top-0 z-40 w-full px-[16px] pt-[16px] lg:px-[24px] lg:pt-[26px]'>
      <nav
        aria-label='Main'
        className='mx-auto flex h-[52px] w-full max-w-[1016px] items-center justify-between rounded-[16px] bg-white px-[16px] shadow-[0_8px_24px_-16px_rgba(16,24,64,0.35)] lg:h-[56px] lg:px-[24px]'
      >
        <div className='flex items-center gap-2 lg:gap-7'>
          <button
            type='button'
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className='flex cursor-pointer items-center border-none bg-transparent p-0 text-[#202020] lg:hidden'
            style={{ margin: 0, padding: 0, minWidth: '20px', width: '20px', height: '20px' }}
          >
            <Burger open={drawerOpen} />
          </button>
          <Link 
            to='/' 
            className='text-[16px] font-medium text-[#0029ce] leading-none'
            style={{ margin: 0, padding: 0 }}
          >
            OLake
          </Link>
          <div className='hidden items-center gap-[24px] lg:flex'>
            {LAKESIDE_NAV.map((entry) => (
              <DesktopEntry
                key={entry.label}
                entry={entry}
                active={!!entry.href && entry.href === activePath}
              />
            ))}
          </div>
        </div>

        <div className='flex items-center gap-[14px]'>
          <Link
            to={LAKESIDE_SLACK.href}
            aria-label={LAKESIDE_SLACK.label}
            className='hidden items-center text-[#202020] transition-colors hover:text-[#0029ce] lg:flex'
          >
            <SlackMark />
          </Link>
          <a
            href={LAKESIDE_GITHUB.href}
            target='_blank'
            rel='noopener noreferrer'
            className='hidden items-center gap-[6px] text-[13px] text-[#717171] transition-colors hover:text-[#202020] lg:flex'
            aria-label={`OLake on GitHub, ${formatStars(stargazersCount)} stars`}
          >
            <GithubMark />
            <span>{formatStars(stargazersCount)}</span>
            <StarMark />
          </a>
          <Link
            to={LAKESIDE_CTA.href}
            className='inline-flex h-[34px] items-center rounded-[8px] border border-solid border-[rgba(150,171,254,0.6)] bg-[#0029ce] px-[14px] text-[13px] font-medium text-[#e7e7e0] shadow-[0_2px_2px_0_rgba(16,24,64,0.14)] transition-all hover:bg-[#0021a3] hover:text-white'
          >
            {LAKESIDE_CTA.label}
          </Link>
        </div>
      </nav>

      {drawerOpen && (
        <div className='mx-auto mt-[8px] w-full max-w-[1016px] rounded-[16px] border border-solid border-[#ececec] bg-white p-[10px] shadow-[0_16px_40px_-20px_rgba(16,24,64,0.4)] lg:hidden'>
          {LAKESIDE_NAV.map((entry) =>
            entry.items ? (
              <div key={entry.label}>
                <button
                  type='button'
                  aria-expanded={openGroup === entry.label}
                  onClick={() => setOpenGroup((g) => (g === entry.label ? null : entry.label))}
                  className='flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-[12px] py-[11px] text-left text-[15px] text-[#202020]'
                >
                  {entry.label}
                  <Chevron />
                </button>
                {openGroup === entry.label && (
                  <div className='pb-[6px] pl-[12px]'>
                    {entry.items.map((item) => (
                      <NavAnchor
                        key={item.href}
                        link={item}
                        className='block px-[12px] py-[9px] text-[14px] text-[#5d5d5d]'
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={entry.label}
                to={entry.href!}
                className='block px-[12px] py-[11px] text-[15px] text-[#202020]'
              >
                {entry.label}
              </Link>
            )
          )}
          <div className='mt-[6px] flex items-center gap-[10px] border-0 border-t border-solid border-[#ececec] px-[12px] pt-[12px]'>
            <a
              href={LAKESIDE_GITHUB.href}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex h-[34px] items-center gap-[6px] rounded-[8px] border border-solid border-[#bfbfbf] px-[12px] text-[13px] text-[#717171]'
            >
              <GithubMark />
              {formatStars(stargazersCount)}
            </a>
            <Link
              to={LAKESIDE_SLACK.href}
              aria-label={LAKESIDE_SLACK.label}
              className='inline-flex h-[34px] items-center justify-center rounded-[8px] border border-solid border-[#bfbfbf] px-[10px] text-[#717171]'
            >
              <SlackMark />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
