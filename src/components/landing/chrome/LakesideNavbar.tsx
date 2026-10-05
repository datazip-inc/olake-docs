import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import {
  PiArrowRightBold,
  PiArrowUpRight,
  PiBookOpenText,
  PiGithubLogo,
  PiSlackLogo,
  PiStackBold,
  PiUsersThree,
  PiChatsCircle
} from 'react-icons/pi'
import { cn } from '@site/src/lib/utils'
import useGetReleases from '@site/src/hooks/useGetReleases'
import Button from '../ui/Button'
import {
  LAKESIDE_NAV,
  LAKESIDE_CTA,
  LAKESIDE_GITHUB,
  LAKESIDE_SLACK,
  type LakesideNavEntry,
  type LakesideNavLink,
  type MegaColumn,
  type MegaMenu
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
  children,
  onClick
}: {
  link: LakesideNavLink
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}) =>
  link.external ? (
    <a href={link.href} target='_blank' rel='noopener noreferrer' className={className} onClick={onClick}>
      {children ?? link.label}
    </a>
  ) : (
    <Link to={link.href} className={className} onClick={onClick}>
      {children ?? link.label}
    </Link>
  )

/** Whether the current path belongs to a nav entry (its own href or one of its children). */
function entryIsActive(entry: LakesideNavEntry, pathname: string): boolean {
  const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p)
  const path = norm(pathname)
  const hit = (href: string) => {
    const h = norm(href)
    return h === '/' ? path === '/' : path === h || path.startsWith(`${h}/`)
  }
  if (entry.href && hit(entry.href)) return true
  return !!entry.items?.some((item) => hit(item.href))
}

const MEGA_ICON: Partial<Record<MegaColumn['icon'], ReactNode>> = {
  learn: <PiBookOpenText size={18} aria-hidden='true' />,
  customers: <PiUsersThree size={18} aria-hidden='true' />,
  community: <PiChatsCircle size={18} aria-hidden='true' />
}

/**
 * Product tile: the OLake mark on the brand blue with a small badge that says which product it is
 * (an arrow for OLake Go's replication, stacked layers for OLake Fusion's table maintenance).
 */
function ProductTile({ product }: { product: 'go' | 'fusion' }) {
  const Glyph = product === 'go' ? PiArrowRightBold : PiStackBold
  return (
    <span
      aria-hidden='true'
      className='relative flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-olake-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
    >
      <img src='/img/landing/shared/olake-mark-small.svg' alt='' width={22} height={22} />
      <span className='absolute -bottom-[5px] -right-[5px] flex h-[16px] w-[16px] items-center justify-center rounded-full border-[1.5px] border-solid border-olake-blue bg-olake-surface text-olake-blue dark:border-olake-blue-on-dark dark:text-olake-blue-on-dark'>
        <Glyph size={10} />
      </span>
    </span>
  )
}

const BAND_ICON: Record<MegaMenu['band']['icon'], ReactNode> = {
  slack: <PiSlackLogo size={16} aria-hidden='true' />,
  github: <PiGithubLogo size={16} aria-hidden='true' />,
  arrow: <PiArrowUpRight size={16} aria-hidden='true' />
}

/** Wide panel under the pill: featured card, link columns, help band. */
function MegaPanel({ mega, onNavigate }: { mega: MegaMenu; onNavigate: () => void }) {
  return (
    <div className='overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface shadow-[var(--olake-shadow-menu)]'>
      <div
        className={cn(
          'grid gap-[8px] p-[8px]',
          mega.feature && 'grid-cols-[232px_1fr]'
        )}
      >
        {mega.feature && (
          <div className='lk-mega-feature flex flex-col justify-between rounded-[12px] p-[20px]'>
          <div>
            {mega.feature.eyebrow && (
              <span className='text-[12px] font-medium uppercase tracking-[0.06em] text-olake-on-blue/80'>{mega.feature.eyebrow}</span>
            )}
            <p className='mb-0 mt-[8px] text-[20px] leading-[1.25] text-olake-on-blue'>{mega.feature.title}</p>
            {mega.feature.text && (
              <p className='mb-0 mt-[8px] text-[14px] leading-[1.5] text-olake-on-blue/85'>{mega.feature.text}</p>
            )}
          </div>
          <NavAnchor
            link={mega.feature.cta}
            onClick={onNavigate}
            className='mt-[24px] inline-flex items-center gap-[6px] text-[14px] font-medium text-olake-on-blue hover:text-white'
          >
            {mega.feature.cta.label}
            <PiArrowUpRight size={14} aria-hidden='true' />
          </NavAnchor>
        </div>
        )}
        <div
          className={cn(
            'grid px-[12px] pb-[8px] pt-[12px]',
            mega.columns.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
            !mega.feature && 'px-[16px] pt-[16px]'
          )}
        >
          {mega.columns.map((col, i) => (
            <div
              key={col.title}
              className={cn(
                'px-[12px]',
                i > 0 && 'border-0 border-l border-solid border-olake-line'
              )}
            >
              <div className='mb-[8px] flex items-start gap-[10px] border-0 border-b border-solid border-olake-line pb-[12px]'>
                {col.icon === 'go' || col.icon === 'fusion' ? (
                  <ProductTile product={col.icon} />
                ) : (
                  <span className='flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-olake-surface-muted text-olake-ink'>
                    {MEGA_ICON[col.icon]}
                  </span>
                )}
                <span>
                  <span className='block text-[14px] font-medium leading-[1.3] text-olake-ink'>{col.title}</span>
                  <span className='block text-[13px] leading-[1.4] text-olake-muted'>{col.subtitle}</span>
                </span>
              </div>
              <ul className='m-0 list-none p-0'>
                {col.links.map((link) => (
                  <li key={link.href} className='m-0 p-0'>
                    <NavAnchor
                      link={link}
                      onClick={onNavigate}
                      className='block rounded-[8px] px-[8px] py-[7px] text-[14px] text-olake-text transition-colors hover:bg-olake-blue-tint hover:text-olake-blue'
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-between gap-[16px] border-0 border-t border-solid border-olake-line bg-olake-surface-alt px-[24px] py-[14px]'>
        <div>
          <span className='block text-[14px] font-medium text-olake-ink'>{mega.band.title}</span>
          <span className='block text-[13px] text-olake-muted'>{mega.band.text}</span>
        </div>
        <NavAnchor
          link={mega.band.cta}
          onClick={onNavigate}
          className='inline-flex h-[34px] shrink-0 items-center gap-[6px] rounded-[8px] border border-solid border-olake-btn-border bg-olake-surface px-[12px] text-[13px] font-medium text-olake-btn-secondary transition-colors hover:bg-olake-surface-alt hover:text-olake-ink'
        >
          {BAND_ICON[mega.band.icon]}
          {mega.band.cta.label}
        </NavAnchor>
      </div>
    </div>
  )
}

/** A desktop entry: a plain link, or a label that opens a dropdown panel. */
function DesktopEntry({ entry, active }: { entry: LakesideNavEntry; active: boolean }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hover intent: the panel opens at once and closes 140ms after the pointer leaves, so moving
  // diagonally toward it (or across the gap) never makes it flicker shut.
  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

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

  const tone = active ? 'text-olake-ink' : 'text-olake-muted hover:text-olake-ink'

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
      className={entry.mega ? undefined : 'relative'}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
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
      {/* Always mounted (crawlable); fades and rises in, visibility flips after the fade out */}
      <div
        className={cn(
          'absolute top-full z-20 pt-[10px] transition-[opacity,transform,visibility] duration-[160ms] ease-[var(--olake-ease-out)] motion-reduce:transition-none',
          entry.mega ? 'inset-x-0' : 'left-0',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-[4px] opacity-0'
        )}
      >
        {entry.mega ? (
          <div className='lk-mega'><MegaPanel mega={entry.mega} onNavigate={() => setOpen(false)} /></div>
        ) : (
          <div className='min-w-[204px] rounded-[12px] border border-solid border-olake-line bg-olake-surface p-[6px] shadow-[var(--olake-shadow-menu)]'>
            {entry.items.map((item) => (
              <NavAnchor
                key={item.href}
                link={item}
                onClick={() => setOpen(false)}
                className='block rounded-[8px] px-[12px] py-[9px] text-[14px] text-olake-text transition-colors hover:bg-olake-blue-tint hover:text-olake-blue'
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * The pill is the page's "Main" navigation landmark. The bar variant already sits inside the
 * theme's own `<nav aria-label='Main'>` (Navbar/Layout), so a second nav there would nest two
 * landmarks with the same name; it renders a plain div instead.
 */
function NavLandmark({
  isBar,
  className,
  children
}: {
  isBar: boolean
  className: string
  children: ReactNode
}) {
  return isBar ? (
    <div className={`olake-nav-card ${className}`}>{children}</div>
  ) : (
    <nav aria-label='Main' className={className}>
      {children}
    </nav>
  )
}

export interface LakesideNavbarProps {
  /** Route the navbar should mark as current, e.g. "/". Defaults to the live location in the bar variant. */
  activePath?: string
  /**
   * `pill` is the floating card used over the landing hero. `bar` is the full-width sticky bar the
   * theme renders on docs, blog and every other page (inside Docusaurus' `.navbar` wrapper).
   */
  variant?: 'pill' | 'bar'
  /** Extra controls before the CTA in the bar variant: search and the color-mode toggle. */
  trailing?: ReactNode
  /** Bar variant: the burger drives Docusaurus' mobile sidebar (it also carries the docs menu). */
  mobileSidebar?: { shown: boolean; toggle: () => void }
}

export default function LakesideNavbar({
  activePath,
  variant = 'pill',
  trailing,
  mobileSidebar
}: LakesideNavbarProps) {
  const { stargazersCount } = useGetReleases()
  const [ownDrawerOpen, setOwnDrawerOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const { pathname } = useLocation()
  const isBar = variant === 'bar'
  const currentPath = activePath ?? pathname

  const drawerOpen = mobileSidebar ? mobileSidebar.shown : ownDrawerOpen
  const setDrawerOpen = (next: boolean | ((v: boolean) => boolean)) => {
    if (mobileSidebar) mobileSidebar.toggle()
    else setOwnDrawerOpen(next)
  }
  // The theme's sidebar renders its own menu; only the pill keeps an in-component drawer.
  const showOwnDrawer = !mobileSidebar && drawerOpen
  // Docusaurus keeps the docs sidebar in the burger drawer up to 1279px, so the themed navbar keeps
  // the burger until xl even though the links already show from lg.
  const burgerCls = isBar ? 'xl:hidden' : 'lg:hidden'
  const wideFlex = 'hidden lg:flex'

  return (
    <header
      className={cn(
        'w-full px-[16px] lg:px-[24px]',
        isBar
          ? 'olake-bar pb-[12px] pt-[16px] lg:pt-[20px]'
          : 'sticky top-0 z-40 pt-[16px] lg:pt-[26px]'
      )}
    >
      <NavLandmark
        isBar={isBar}
        className={cn(
          'relative z-40 mx-auto flex w-full items-center justify-between bg-olake-surface px-[16px]',
          'h-[52px] max-w-[1016px] rounded-[16px] shadow-[var(--olake-shadow-nav)] lg:h-[56px] lg:px-[24px]',
          isBar && 'border border-solid border-olake-line'
        )}
      >
        <div className='flex items-center gap-2 lg:gap-7'>
          <button
            type='button'
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className={cn('flex cursor-pointer items-center border-none bg-transparent p-0 text-olake-ink', burgerCls)}
            style={{ margin: 0, padding: 0, minWidth: '20px', width: '20px', height: '20px' }}
          >
            <Burger open={drawerOpen} />
          </button>
          <Link
            to='/'
            className='text-[16px] font-medium text-olake-blue leading-none dark:text-olake-blue-on-dark'
            style={{ margin: 0, padding: 0 }}
          >
            OLake
          </Link>
          <div className={cn('items-center gap-[24px]', wideFlex)}>
            {LAKESIDE_NAV.filter((entry) => !entry.mobileOnly).map((entry) => (
              <DesktopEntry
                key={entry.label}
                entry={entry}
                active={entryIsActive(entry, currentPath)}
              />
            ))}
          </div>
        </div>

        <div className='flex items-center gap-[14px]'>
          <Link
            to={LAKESIDE_SLACK.href}
            aria-label={LAKESIDE_SLACK.label}
            className={cn('items-center text-olake-ink transition-colors hover:text-olake-blue', wideFlex)}
          >
            <SlackMark />
          </Link>
          <a
            href={LAKESIDE_GITHUB.href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn('items-center gap-[6px] text-[13px] text-olake-text-2 transition-colors hover:text-olake-ink', wideFlex)}
            aria-label={`OLake on GitHub, ${formatStars(stargazersCount)} stars`}
          >
            <GithubMark />
            <span>{formatStars(stargazersCount)}</span>
            <StarMark />
          </a>
          {isBar && trailing}
          <Button href={LAKESIDE_CTA.href} size='sm'>
            {LAKESIDE_CTA.label}
          </Button>
        </div>
      </NavLandmark>

      {showOwnDrawer && (
        <>
          <div 
            className='lk-backdrop fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden' 
            onClick={() => setDrawerOpen(false)} 
            aria-hidden='true'
          />
          <div className='lk-drawer absolute left-[16px] right-[16px] top-[76px] z-40 mx-auto max-w-[1016px] rounded-[16px] border border-solid border-olake-line bg-olake-surface p-[10px] shadow-[var(--olake-shadow-card-hover)] lg:hidden'>
            {LAKESIDE_NAV.map((entry) =>
            entry.items ? (
              <div key={entry.label}>
                <button
                  type='button'
                  aria-expanded={openGroup === entry.label}
                  onClick={() => setOpenGroup((g) => (g === entry.label ? null : entry.label))}
                  className='flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-[12px] py-[11px] text-left text-[15px] text-olake-ink'
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
                        className='block px-[12px] py-[9px] text-[14px] text-olake-text-2'
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={entry.label}
                to={entry.href!}
                className='block px-[12px] py-[11px] text-[15px] text-olake-ink'
              >
                {entry.label}
              </Link>
            )
          )}
          <div className='mt-[6px] flex items-center gap-[10px] border-0 border-t border-solid border-olake-line px-[12px] pt-[12px]'>
            <a
              href={LAKESIDE_GITHUB.href}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex h-[34px] items-center gap-[6px] rounded-[8px] border border-solid border-olake-btn-border px-[12px] text-[13px] text-olake-text-2 transition-colors hover:bg-olake-surface-alt'
            >
              <GithubMark />
              {formatStars(stargazersCount)}
            </a>
            <Link
              to={LAKESIDE_SLACK.href}
              aria-label={LAKESIDE_SLACK.label}
              className='inline-flex h-[34px] items-center justify-center rounded-[8px] border border-solid border-olake-btn-border px-[10px] text-olake-text-2 transition-colors hover:bg-olake-surface-alt'
            >
              <SlackMark />
            </Link>
          </div>
        </div>
        </>
      )}
    </header>
  )
}
