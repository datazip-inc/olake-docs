import React, { useState, type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import { cn } from '@site/src/lib/utils'
import useGetReleases from '@site/src/hooks/useGetReleases'
import {
  NAV_ENTRIES,
  MOBILE_LINKS,
  PRICING_LINK,
  GITHUB_REPO_URL,
  FUSION_GITHUB_REPO_URL,
  SLACK_URL,
  CTA,
  isFlyout,
  isMobileGroup,
  type NavEntry,
  type NavLink as NavLinkType,
  type NavFlyout
} from './navData'

/** Formats 4231 -> "4.2k", matching the design's star pill. */
function formatStars(n: number): string {
  if (!n) return '—'
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

/** The design's outlined star. */
const StarMark = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='#10173A'
    strokeWidth='1.8'
    strokeLinejoin='round'
    style={{ flexShrink: 0 }}
    aria-hidden
  >
    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
  </svg>
)

const StarPill = ({
  stars,
  repoUrl,
  showCount
}: {
  stars: string
  repoUrl: string
  showCount: boolean
}) => (
  <a
    href={repoUrl}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={showCount ? `GitHub — ${stars} stars` : 'GitHub'}
    className={cn('olake-nav-stars', !showCount && 'olake-nav-stars--icon-only')}
  >
    <img src='/img/landing/shared/github-icon.webp' alt='' width={28} height={29} />
    {showCount && (
      <>
        <StarMark /> {stars}
      </>
    )}
  </a>
)

const SlackLink = () => (
  <a
    href={SLACK_URL}
    aria-label='Slack'
    target='_blank'
    rel='noopener noreferrer'
    className='olake-nav-slack'
  >
    {/* the design uses the Slack artwork here, not an icon font */}
    <img src='/img/landing/shared/slack-icon.webp' alt='' width={35} height={34} />
  </a>
)

/** A submenu opening to the side of its parent panel — the design's `▸` row. */
function Flyout({ flyout }: { flyout: NavFlyout }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className='olake-nav-flyout'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <div
        className='olake-nav-panel-link olake-nav-flyout-trigger'
        role='button'
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
      >
        {flyout.label}
        <span className='olake-nav-flyout-caret'>▸</span>
      </div>
      <div className={cn('olake-nav-panel olake-nav-panel--side', open && 'is-open')}>
        {flyout.items.map((item) => (
          <Link key={item.href} to={item.href} className='olake-nav-panel-link'>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Dropdown({ entry }: { entry: NavEntry }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className='olake-nav-item'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <div
        className='olake-nav-trigger'
        role='button'
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup='true'
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
      >
        {entry.label}
        <span className='olake-nav-caret'>▾</span>
      </div>
      {/* Always rendered so the links are crawlable and work without JS; only visibility toggles. */}
      <div className={cn('olake-nav-panel', open && 'is-open')}>
        {entry.items!.map((item) =>
          isFlyout(item) ? (
            <Flyout key={item.label} flyout={item} />
          ) : (
            <Link key={item.href} to={(item as NavLinkType).href} className='olake-nav-panel-link'>
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  )
}

/** A drawer row that expands in place instead of navigating — the drawer's Docs entry. */
function MobileAccordion({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='olake-nav-mobile-accordion'>
      <button
        type='button'
        className='olake-nav-mobile-link olake-nav-mobile-accordion-trigger'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {entry.label}
        <span className={cn('olake-nav-mobile-accordion-caret', open && 'is-open')}>▾</span>
      </button>
      {open && (
        <div className='olake-nav-mobile-accordion-panel'>
          {entry.items!.map((item) => (
            <Link
              key={(item as NavLinkType).href}
              to={(item as NavLinkType).href}
              className='olake-nav-mobile-sublink'
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface SiteNavbarProps {
  /** Optional extra content at the far right, after the CTA. */
  trailing?: ReactNode
  /**
   * Hands the burger over to Docusaurus' mobile sidebar instead of this
   * component's own drawer. Set when rendered as the theme navbar: that
   * sidebar is what carries the docs secondary menu.
   */
  mobileSidebar?: { shown: boolean; toggle: () => void }
}

/**
 * The site-wide navbar, following the v2 homepage design. Rendered through the
 * `@theme/Navbar/Content` swizzle. Keeps its own drawer for standalone use (no
 * `mobileSidebar` prop); inside the theme it defers to Docusaurus' sidebar.
 */
export default function SiteNavbar({ trailing, mobileSidebar }: SiteNavbarProps) {
  const { stargazersCount } = useGetReleases()
  const stars = formatStars(stargazersCount)
  const [ownOpen, setOwnOpen] = useState(false)
  const isFusion = useLocation().pathname.startsWith('/olake-fusion')
  const repoUrl = isFusion ? FUSION_GITHUB_REPO_URL : GITHUB_REPO_URL

  const mobileOpen = mobileSidebar ? mobileSidebar.shown : ownOpen
  const toggleMobile = mobileSidebar ? mobileSidebar.toggle : () => setOwnOpen((o) => !o)

  return (
    <div className='olake-nav'>
      <div className='olake-nav-inner'>
        <div className='olake-nav-left'>
          <Link to='/' className='olake-nav-logo'>
            <img src='/img/landing/shared/olake-logo.svg' alt='OLake' width={126} height={32} />
            <span className='olake-nav-tagline'>Open Source · Apache 2.0 Licensed</span>
          </Link>
          <div className='olake-nav-links'>
            {NAV_ENTRIES.map((entry) =>
              entry.items ? (
                <Dropdown key={entry.label} entry={entry} />
              ) : (
                <Link key={entry.label} to={entry.href!} className='olake-nav-plain'>
                  {entry.label}
                </Link>
              )
            )}
            <Link to={PRICING_LINK.href} className='olake-nav-plain'>
              {PRICING_LINK.label}
            </Link>
          </div>
        </div>

        <div className='olake-nav-right'>
          <StarPill stars={stars} repoUrl={repoUrl} showCount={!isFusion} />
          {/* Below the breakpoint the design drops the count and shows the mark
              alone; the full pill moves into the drawer. */}
          <a
            href={repoUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'
            className='olake-nav-gh-mobile'
          >
            <img src='/img/landing/shared/github-icon.webp' alt='' width={30} height={30} />
          </a>
          <SlackLink />
          <Link to={CTA.href} className='olake-nav-cta'>
            {CTA.label}
          </Link>
          {trailing}
          <button
            type='button'
            className='olake-nav-burger'
            aria-label='Toggle navigation menu'
            aria-expanded={mobileOpen}
            onClick={toggleMobile}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Skipped when Docusaurus' sidebar is in charge; that renders the same
          links via the MobileSidebar/PrimaryMenu swizzle, plus the docs menu. */}
      {!mobileSidebar && mobileOpen && (
        <div className='olake-nav-mobile'>
          {MOBILE_LINKS.map((link) =>
            isMobileGroup(link) ? (
              <MobileAccordion key={link.label} entry={link} onNavigate={() => setOwnOpen(false)} />
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className='olake-nav-mobile-link'
                onClick={() => setOwnOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <div className='olake-nav-mobile-social'>
            <StarPill stars={stars} repoUrl={repoUrl} showCount={!isFusion} />
            <SlackLink />
          </div>
        </div>
      )}
    </div>
  )
}
