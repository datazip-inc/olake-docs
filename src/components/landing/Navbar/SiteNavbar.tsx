import React, { useEffect, useState, type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { NAV_DROPDOWNS, PRICING_LINK, GITHUB_REPO_URL, SLACK_URL, CTA, type NavDropdown } from './navData'

/** Formats 4231 -> "4.2k", matching the design's star pill. */
function formatStars(n: number): string {
  if (!n) return '—'
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

/**
 * Live GitHub star count. The designs hardcode this (and disagree — 1.3k on
 * the Go page, 4.2k on the others), so it goes stale. Mirrors the fetch the
 * site already does in src/hooks/useGetReleases.ts.
 */
function useStarCount(): string {
  const [stars, setStars] = useState<number>(0)
  useEffect(() => {
    let alive = true
    fetch('https://api.github.com/repos/datazip-inc/olake')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.stargazers_count) setStars(d.stargazers_count)
      })
      .catch(() => {
        /* offline or rate-limited: pill just stays blank rather than lying */
      })
    return () => {
      alive = false
    }
  }, [])
  return formatStars(stars)
}

function Dropdown({ dropdown }: { dropdown: NavDropdown }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='olake-nav-item' onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className='olake-nav-trigger'>
        {dropdown.label}
        <span className='olake-nav-caret'>▾</span>
      </div>
      {/* Always rendered so the links are crawlable and work without JS; only visibility toggles. */}
      <div className={`olake-nav-panel${open ? ' is-open' : ''}`}>
        {dropdown.items.map((item) => (
          <Link key={item.href} to={item.href} className='olake-nav-panel-link'>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

interface SiteNavbarProps {
  /** Optional extra content at the far right, after the CTA. */
  trailing?: ReactNode
}

/**
 * The navbar shared by the three landing pages, following the v2 homepage
 * design. Those routes hide Docusaurus' own navbar (see custom.css), so this
 * carries its own mobile menu — without it there would be no navigation
 * below the 1279px breakpoint.
 */
export default function SiteNavbar({ trailing }: SiteNavbarProps) {
  const stars = useStarCount()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className='olake-nav'>
      <div className='olake-nav-inner'>
        <div className='olake-nav-left'>
          <Link to='/' className='olake-nav-logo'>
            <img src='/img/landing/shared/olake-logo.svg' alt='OLake' />
          </Link>
          <div className='olake-nav-links'>
            {NAV_DROPDOWNS.map((d) => (
              <Dropdown key={d.label} dropdown={d} />
            ))}
            <Link to={PRICING_LINK.href} className='olake-nav-plain'>
              {PRICING_LINK.label}
            </Link>
          </div>
        </div>

        <div className='olake-nav-right'>
          <a href={GITHUB_REPO_URL} target='_blank' rel='noopener noreferrer' aria-label='GitHub stars' className='olake-nav-stars'>
            <img src='/img/landing/shared/github-icon.webp' alt='' />
            <span>
              <span className='olake-nav-star-mark'>★</span> {stars}
            </span>
          </a>
          <a href={SLACK_URL} aria-label='Slack' className='olake-nav-slack'>
            {/* the design uses the Slack artwork here, not an icon font */}
            <img src='/img/landing/shared/slack-icon.webp' alt='Slack' />
          </a>
          <Link to={CTA.href} className='olake-nav-cta'>
            {CTA.label}
          </Link>
          {trailing}
          <button
            type='button'
            className='olake-nav-burger'
            aria-label='Toggle navigation menu'
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className='olake-nav-mobile'>
          {NAV_DROPDOWNS.map((d) => (
            <div key={d.label} className='olake-nav-mobile-group'>
              <div className='olake-nav-mobile-heading'>{d.label}</div>
              {d.items.map((item) => (
                <Link key={item.href} to={item.href} className='olake-nav-mobile-link' onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <Link to={PRICING_LINK.href} className='olake-nav-mobile-link' onClick={() => setMobileOpen(false)}>
            {PRICING_LINK.label}
          </Link>
          <Link to={CTA.href} className='olake-nav-mobile-cta' onClick={() => setMobileOpen(false)}>
            {CTA.label}
          </Link>
        </div>
      )}
    </div>
  )
}
