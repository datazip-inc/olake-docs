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
/** Icon or product tile, title and subtitle of a mega menu column. `linked` adds the hover arrow. */
function ColumnHeader({ col, linked = false }: { col: MegaColumn; linked?: boolean }) {
  return (
    <>
      {col.icon === 'go' || col.icon === 'fusion' ? (
        <ProductTile product={col.icon} />
      ) : (
        <span className='flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-olake-surface-muted text-olake-ink'>
          {MEGA_ICON[col.icon]}
        </span>
      )}
      <span>
        <span className='flex items-center gap-[4px] text-[14px] font-medium leading-[1.3] text-olake-ink group-hover:text-olake-blue dark:group-hover:text-olake-blue-on-dark'>
          {col.title}
          {linked && (
            <PiArrowUpRight
              size={13}
              aria-hidden='true'
              className='opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'
            />
          )}
        </span>
        <span className='block text-[13px] leading-[1.4] text-olake-muted'>{col.subtitle}</span>
      </span>
    </>
  )
}

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
              <div className='mb-[8px] border-0 border-b border-solid border-olake-line pb-[12px]'>
                {col.href ? (
                  <NavAnchor
                    link={{ label: col.title, href: col.href }}
                    onClick={onNavigate}
                    className='group -m-[6px] flex items-start gap-[10px] rounded-[10px] p-[6px] no-underline transition-colors hover:bg-olake-blue-tint hover:no-underline'
                  >
                    <ColumnHeader col={col} linked />
                  </NavAnchor>
                ) : (
                  <div className='flex items-start gap-[10px]'>
                    <ColumnHeader col={col} />
                  </div>
                )}
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

/** A desktop panel's blue card, set as the first block of the menu's group. */
function MenuFeature({
  feature,
  className,
  onNavigate
}: {
  feature: NonNullable<MegaMenu['feature']>
  className?: string
  onNavigate: () => void
}) {
  return (
    <div
      className={cn(
        'lk-mega-feature flex flex-col justify-between rounded-[12px] p-[16px]',
        className
      )}
    >
      <div>
        <p className='mb-0 text-[18px] leading-[1.3] text-olake-on-blue'>{feature.title}</p>
        {feature.text && (
          <p className='mt-[8px] mb-0 text-[14px] leading-[1.5] text-olake-on-blue/85'>
            {feature.text}
          </p>
        )}
      </div>
      <NavAnchor
        link={feature.cta}
        onClick={onNavigate}
        className='mt-[22px] inline-flex items-center gap-[6px] text-[15px] font-medium text-olake-on-blue hover:text-white'
      >
        {feature.cta.label}
        <PiArrowUpRight size={14} aria-hidden='true' />
      </NavAnchor>
    </div>
  )
}

/** A desktop panel's column: its header, a rule, then its links (two to a row on phones). */
function MenuColumn({
  col,
  divided,
  onNavigate
}: {
  col: MegaColumn
  divided: boolean
  onNavigate: () => void
}) {
  const header = 'flex items-start gap-[12px]'
  return (
    <div
      className={cn(
        'mx-[8px] md:mx-0',
        divided && 'md:border-0 md:border-l md:border-solid md:border-olake-line md:pl-[8px]'
      )}
    >
      <div className='border-0 border-b border-solid border-olake-line pb-[14px]'>
        {col.href ? (
          <NavAnchor
            link={{ label: col.title, href: col.href }}
            onClick={onNavigate}
            className={cn(header, 'group no-underline hover:no-underline')}
          >
            <ColumnHeader col={col} linked />
          </NavAnchor>
        ) : (
          <div className={header}>
            <ColumnHeader col={col} />
          </div>
        )}
      </div>
      <ul className='m-0 grid list-none grid-cols-2 p-0 pt-[5px] md:grid-cols-1'>
        {col.links.map((link) => (
          <li key={link.href} className='m-0 p-0'>
            <NavAnchor
              link={link}
              onClick={onNavigate}
              className='flex h-[44px] items-center text-[16px] text-olake-text transition-colors hover:text-olake-blue'
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * An opened group of the phone and tablet menu: the same feature card, columns and help band as
 * its desktop panel. Phones stack them; tablets set two columns beside the card (Products) or three
 * under it (Resources).
 */
function MenuGroup({ mega, onNavigate }: { mega: MegaMenu; onNavigate: () => void }) {
  const beside = mega.columns.length <= 2
  return (
    <div className='pb-[16px]'>
      <div
        className={cn(
          'grid gap-[24px] md:gap-x-[16px]',
          beside ? 'md:grid-cols-[249px_1fr_1fr]' : 'md:grid-cols-3'
        )}
      >
        {mega.feature && (
          <MenuFeature
            feature={mega.feature}
            className={beside ? undefined : 'md:col-span-3'}
            onNavigate={onNavigate}
          />
        )}
        {mega.columns.map((col, i) => (
          <MenuColumn key={col.title} col={col} divided={i > 0} onNavigate={onNavigate} />
        ))}
      </div>
      <div className='mt-[16px] flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-solid border-olake-line bg-olake-surface-alt px-[16px] py-[14px]'>
        <div>
          <span className='block text-[15px] font-medium text-olake-ink'>{mega.band.title}</span>
          <span className='block text-[13px] text-olake-muted'>{mega.band.text}</span>
        </div>
        <NavAnchor
          link={mega.band.cta}
          onClick={onNavigate}
          className='inline-flex h-[44px] shrink-0 items-center gap-[8px] rounded-[10px] border border-solid border-olake-btn-border bg-olake-surface px-[16px] text-[15px] font-medium text-olake-ink transition-colors hover:bg-olake-surface-alt'
        >
          {BAND_ICON[mega.band.icon]}
          {mega.band.cta.label}
        </NavAnchor>
      </div>
    </div>
  )
}

const MENU_FOOT_BUTTON =
  'inline-flex h-[44px] items-center justify-center gap-[8px] rounded-[10px] border border-solid border-olake-btn-border bg-olake-surface text-[15px] font-medium text-olake-ink transition-colors hover:bg-olake-surface-alt'

/**
 * The phone and tablet menu, a panel under the pill: the navbar's entries as an accordion, one group
 * open at a time. On phones the community links and the call to action sit in a footer pinned to
 * the panel's bottom (tablets keep them in the pill), and a long group scrolls inside the panel.
 */
function MobileMenu({ stars, onNavigate }: { stars: string; onNavigate: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const entries = LAKESIDE_NAV.filter((entry) => !entry.mobileOnly)
  return (
    <div
      id='lk-mobile-menu'
      className='lk-drawer absolute inset-x-[12px] top-[80px] z-40 mx-auto flex max-h-[calc(100dvh-92px)] max-w-[1016px] flex-col overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface shadow-[var(--olake-shadow-card-hover)] md:inset-x-[20px] md:max-h-[calc(100dvh-100px)] lg:hidden'
    >
      <ul className='m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain px-[13px] py-[6px] md:px-[15px]'>
        {entries.map((entry, i) => {
          const open = openGroup === entry.label
          const groupId = `lk-menu-${entry.label.toLowerCase()}`
          const row =
            'mx-[8px] flex h-[52px] w-[calc(100%-16px)] items-center justify-between text-[17px] text-olake-ink md:text-[18px]'
          return (
            <li
              key={entry.label}
              className={cn(
                'relative m-0 p-0',
                i < entries.length - 1 &&
                  "after:absolute after:inset-x-[8px] after:bottom-0 after:h-px after:bg-olake-line after:content-['']"
              )}
            >
              {entry.mega ? (
                <>
                  <button
                    type='button'
                    aria-expanded={open}
                    aria-controls={groupId}
                    onClick={() => setOpenGroup(open ? null : entry.label)}
                    className={cn(row, 'cursor-pointer border-none bg-transparent p-0 text-left')}
                  >
                    {entry.label}
                    <span className={cn('flex transition-transform', open && 'rotate-180')}>
                      <Chevron />
                    </span>
                  </button>
                  <div id={groupId} hidden={!open}>
                    <MenuGroup mega={entry.mega} onNavigate={onNavigate} />
                  </div>
                </>
              ) : (
                <Link
                  to={entry.href!}
                  onClick={onNavigate}
                  className={cn(row, 'hover:text-olake-blue')}
                >
                  {entry.label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      <div className='shrink-0 border-0 border-t border-solid border-olake-line bg-olake-surface-alt p-[12px] md:hidden'>
        <div className='grid grid-cols-2 gap-[10px]'>
          <Link to={LAKESIDE_SLACK.href} onClick={onNavigate} className={MENU_FOOT_BUTTON}>
            <SlackMark />
            Slack
          </Link>
          <a
            href={LAKESIDE_GITHUB.href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`Star ${stars} on GitHub`}
            className={MENU_FOOT_BUTTON}
          >
            <GithubMark />
            Star
            <span className='font-normal text-olake-muted'>{stars}</span>
          </a>
        </div>
        <Button
          href={LAKESIDE_CTA.href}
          className='mt-[10px] h-[48px] w-full rounded-[10px] text-[16px] font-medium'
        >
          {LAKESIDE_CTA.label}
        </Button>
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
  const burgerRef = useRef<HTMLButtonElement>(null)
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
  // Slack and GitHub: the pill shows them from tablets up (its phone menu has them in its footer).
  const wideFlex = isBar ? 'hidden lg:flex' : 'hidden md:flex'

  // While the pill's menu is open: the page behind stays put, and Escape, a route change or growing
  // to the desktop layout (where the menu is hidden) closes it.
  useEffect(() => {
    if (!showOwnDrawer) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Escape hands focus back to the menu button, since the menu it was in goes away.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOwnDrawerOpen(false)
      burgerRef.current?.focus()
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onDesktop = () => desktop.matches && setOwnDrawerOpen(false)
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [showOwnDrawer])
  useEffect(() => setOwnDrawerOpen(false), [pathname])

  const burger = (
    <button
      ref={burgerRef}
      type='button'
      aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={drawerOpen}
      aria-controls={showOwnDrawer ? 'lk-mobile-menu' : undefined}
      onClick={() => setDrawerOpen((v) => !v)}
      className={cn('flex cursor-pointer items-center border-none bg-transparent p-0 text-olake-ink', burgerCls)}
      style={{ margin: 0, padding: 0, minWidth: '20px', width: '20px', height: '20px' }}
    >
      <Burger open={drawerOpen} />
    </button>
  )

  return (
    <header
      className={cn(
        'w-full px-[16px] lg:px-[24px]',
        isBar
          ? 'olake-bar pb-[12px] pt-[16px] lg:pt-[20px]'
          : 'sticky top-0 z-40 px-[12px] pt-[12px] md:px-[20px] lg:pt-[26px]'
      )}
    >
      <NavLandmark
        isBar={isBar}
        className={cn(
          'relative z-40 mx-auto flex w-full items-center justify-between bg-olake-surface px-[16px]',
          'max-w-[1016px] rounded-[16px] shadow-[var(--olake-shadow-nav)] lg:h-[56px] lg:px-[24px]',
          isBar ? 'h-[52px] border border-solid border-olake-line' : 'h-[56px] px-[18px] md:px-[24px]'
        )}
      >
        <div className='flex items-center gap-2 lg:gap-7'>
          {isBar && burger}
          <Link
            to='/'
            className={cn(
              'font-medium text-olake-blue leading-none dark:text-olake-blue-on-dark',
              isBar ? 'text-[16px]' : 'text-[20px] lg:text-[16px]'
            )}
            style={{ margin: 0, padding: 0 }}
          >
            OLake
          </Link>
          <div className='hidden items-center gap-[24px] lg:flex'>
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
          {/* On phones the open menu carries the call to action in its footer */}
          <Button href={LAKESIDE_CTA.href} size='sm' className={!isBar && drawerOpen ? 'max-md:hidden' : undefined}>
            {LAKESIDE_CTA.label}
          </Button>
          {!isBar && burger}
        </div>
      </NavLandmark>

      {showOwnDrawer && (
        <>
          <div
            className='lk-backdrop fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden'
            onClick={() => setDrawerOpen(false)}
            aria-hidden='true'
          />
          <MobileMenu stars={formatStars(stargazersCount)} onNavigate={() => setDrawerOpen(false)} />
        </>
      )}
    </header>
  )
}
