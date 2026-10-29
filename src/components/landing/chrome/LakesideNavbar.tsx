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
  lakesideCta,
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

/** The full OLake logo (static/img/landing/shared/olake-logo.svg), inlined so it follows the link's color in dark mode. */
const OLakeLogo = ({ className }: { className?: string }) => (
  <svg viewBox='0 0 1761 530' fill='currentColor' aria-hidden='true' className={className}>
    <path d='M442.411 38.7949H0V283.637C184.052 263.744 441.726 258.771 315.518 328.397C230.036 375.556 288.643 392.955 339.954 408.189C373.348 418.102 403.651 427.099 389.139 442.783C359.584 474.728 418.17 487.436 442.411 491.205V38.7949Z' />
    <path d='M699.214 377.42C678.023 377.42 659.325 372.626 643.12 363.038C627.122 353.237 614.553 339.707 605.412 322.449C596.478 304.977 592.011 284.736 592.011 261.724C592.011 238.926 596.478 218.898 605.412 201.639C614.553 184.168 627.122 170.531 643.12 160.73C659.325 150.929 678.023 146.028 699.214 146.028C721.029 146.028 739.934 150.929 755.932 160.73C772.137 170.531 784.706 184.168 793.64 201.639C802.573 218.898 807.04 238.926 807.04 261.724C807.04 284.736 802.573 304.977 793.64 322.449C784.706 339.707 772.137 353.237 755.932 363.038C739.934 372.626 721.029 377.42 699.214 377.42ZM699.526 353.77C715.523 353.77 729.547 350.148 741.597 342.903C753.854 335.446 763.307 324.899 769.955 311.263C776.811 297.413 780.239 280.9 780.239 261.724C780.239 242.548 776.811 226.142 769.955 212.506C763.307 198.656 753.854 188.109 741.597 180.865C729.547 173.621 715.523 169.999 699.526 169.999C683.529 169.999 669.401 173.621 657.143 180.865C645.093 188.109 635.64 198.656 628.784 212.506C622.136 226.142 618.812 242.548 618.812 261.724C618.812 280.9 622.136 297.413 628.784 311.263C635.64 324.899 645.093 335.446 657.143 342.903C669.401 350.148 683.529 353.77 699.526 353.77Z' />
    <path d='M842.681 373.585V149.864H880.077V343.543H977.308V373.585H842.681Z' />
    <path d='M1064.82 377.42C1051.94 377.42 1041.24 375.183 1032.73 370.709C1024.21 366.234 1017.87 360.268 1013.72 352.811C1009.56 345.354 1007.48 337.257 1007.48 328.521C1007.48 318.294 1009.98 309.452 1014.96 301.994C1020.16 294.537 1027.74 288.784 1037.71 284.736C1047.68 280.474 1059.94 278.344 1074.48 278.344H1114.06C1114.06 269.821 1112.92 262.79 1110.63 257.25C1108.35 251.497 1104.82 247.236 1100.04 244.466C1095.26 241.696 1089.13 240.311 1081.65 240.311C1073.13 240.311 1065.86 242.335 1059.84 246.383C1053.81 250.219 1050.07 256.185 1048.62 264.281H1011.85C1013.09 252.775 1016.83 242.974 1023.06 234.878C1029.3 226.568 1037.5 220.176 1047.68 215.702C1058.07 211.014 1069.39 208.67 1081.65 208.67C1096.4 208.67 1108.97 211.334 1119.36 216.66C1129.75 221.774 1137.64 229.231 1143.04 239.033C1148.65 248.621 1151.46 260.233 1151.46 273.869V373.585H1119.67L1115.93 347.697C1113.85 351.959 1111.15 355.9 1107.83 359.523C1104.71 363.145 1101.08 366.341 1096.92 369.111C1092.77 371.668 1087.99 373.692 1082.59 375.183C1077.39 376.675 1071.47 377.42 1064.82 377.42ZM1073.24 347.058C1079.26 347.058 1084.56 345.993 1089.13 343.862C1093.91 341.518 1097.96 338.322 1101.29 334.274C1104.82 330.013 1107.52 325.325 1109.39 320.212C1111.26 315.098 1112.5 309.665 1113.13 303.912V303.273H1078.54C1071.26 303.273 1065.24 304.231 1060.46 306.149C1055.68 307.854 1052.25 310.41 1050.18 313.82C1048.1 317.229 1047.06 321.17 1047.06 325.645C1047.06 330.119 1048.1 333.954 1050.18 337.15C1052.25 340.346 1055.27 342.797 1059.21 344.501C1063.16 346.206 1067.84 347.058 1073.24 347.058Z' />
    <path d='M1292.7 373.585L1223.2 285.375L1285.53 212.506H1330.09L1252.5 301.035V271.312L1339.44 373.585H1292.7ZM1191.42 373.585V143.472H1228.81V373.585H1191.42Z' />
    <path d='M1425.65 377.42C1410.07 377.42 1396.36 374.011 1384.51 367.193C1372.67 360.162 1363.43 350.361 1356.78 337.79C1350.13 325.219 1346.81 310.73 1346.81 294.324C1346.81 277.278 1350.03 262.364 1356.47 249.579C1363.11 236.795 1372.36 226.781 1384.2 219.537C1396.25 212.293 1410.17 208.67 1425.96 208.67C1441.33 208.67 1454.74 212.186 1466.16 219.217C1477.59 226.248 1486.42 235.73 1492.65 247.662C1498.88 259.381 1502 272.591 1502 287.293C1502 289.423 1502 291.767 1502 294.324C1502 296.881 1501.79 299.544 1501.38 302.314H1373.61V277.704H1464.29C1463.88 265.986 1460.03 256.824 1452.76 250.219C1445.49 243.4 1436.45 239.991 1425.65 239.991C1417.96 239.991 1410.9 241.802 1404.46 245.425C1398.02 249.047 1392.93 254.48 1389.19 261.724C1385.45 268.756 1383.58 277.704 1383.58 288.571V297.839C1383.58 307.854 1385.34 316.483 1388.88 323.727C1392.62 330.971 1397.6 336.511 1403.83 340.346C1410.28 343.969 1417.44 345.78 1425.34 345.78C1434.06 345.78 1441.23 343.862 1446.84 340.027C1452.66 336.192 1456.92 331.078 1459.62 324.686H1497.64C1494.73 334.7 1489.95 343.756 1483.3 351.852C1476.65 359.736 1468.45 366.021 1458.68 370.709C1448.92 375.183 1437.91 377.42 1425.65 377.42Z' />
    <path d='M1628.49 74.6533V95.0118H1587.77V196.804H1567.41V95.0118H1526.7V74.6533H1628.49ZM1648.85 74.6533H1674.29L1704.83 127.545L1735.37 74.6533H1760.82V196.804H1740.46V106.545L1704.83 168.261L1669.2 106.565V196.804H1648.85V74.6533Z' />
  </svg>
)

/** The OLake mark alone (static/img/landing/shared/olake-mark-mono.svg), for bars too narrow for the full logo. */
const OLakeMark = ({ className }: { className?: string }) => (
  <svg width='20' height='20' viewBox='0 0 42 42' fill='none' aria-hidden='true' className={className}>
    <path
      fill='currentColor'
      d='M41.785 0H0v22.548c17.383-1.832 41.72-2.29 29.8 4.123-8.074 4.343-2.538 5.945 2.308 7.348 3.154.913 6.016 1.741 4.645 3.186-2.791 2.942 2.742 4.112 5.032 4.459z'
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
  const cta = lakesideCta(currentPath)

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
            className='flex shrink-0 items-center text-olake-blue leading-none dark:text-olake-blue-on-dark'
            style={{ margin: 0, padding: 0 }}
          >
            {/* Below 360px the bar cannot fit the full logo beside search and the CTA, so only the mark shows */}
            <OLakeLogo className={cn('h-[22px] w-auto shrink-0 sm:h-[26px] lg:h-[32px]', isBar && 'max-[359px]:hidden')} />
            {isBar && <OLakeMark className='hidden shrink-0 max-[359px]:block' />}
            <span className='sr-only'>OLake</span>
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

        <div className='flex items-center gap-[8px] sm:gap-[14px]'>
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
          <Button href={cta.href} size='sm' className='shrink-0 whitespace-nowrap'>
            {cta.label}
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
