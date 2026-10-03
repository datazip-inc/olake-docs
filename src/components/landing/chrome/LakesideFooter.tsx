import React from 'react'
import Link from '@docusaurus/Link'
import { PiLinkedinLogo, PiYoutubeLogo, PiXLogo, PiSlackLogo } from 'react-icons/pi'
import { FOOTER_COLUMNS, FOOTER_SOCIALS, FOOTER_WORDMARK } from './footerLinks'

const ICONS = {
  linkedin: PiLinkedinLogo,
  youtube: PiYoutubeLogo,
  x: PiXLogo,
  slack: PiSlackLogo
}

const FooterLinkItem = ({ href, label }: { href: string; label: string }) =>
  href.startsWith('http') ? (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-[14px] text-olake-muted transition-colors hover:text-olake-ink'
    >
      {label}
    </a>
  ) : (
    <Link to={href} className='text-[14px] text-olake-muted transition-colors hover:text-olake-ink'>
      {label}
    </Link>
  )

export default function LakesideFooter() {
  return (
    <footer className='lakeside-footer relative overflow-hidden border-0 border-t border-solid border-olake-line-rule bg-olake-surface pt-[56px] lg:pt-[72px]'>
      <div className='relative z-10 mx-auto w-full max-w-[1016px] px-[32px] pb-[180px] lg:px-0 lg:pb-[260px]'>
        <p className='text-[15px] font-medium text-olake-blue dark:text-olake-blue-on-dark'>{FOOTER_WORDMARK.eyebrow}</p>
        <p className='mt-[10px] text-[30px] leading-[1.1] tracking-[-0.01em] text-olake-ink lg:text-[44px]'>
          {FOOTER_WORDMARK.headline}
        </p>

        <nav
          aria-label='Footer'
          className='mt-[40px] grid grid-cols-1 gap-[32px] sm:grid-cols-3 lg:mt-[56px] lg:gap-[64px]'
        >
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className='text-[14px] font-medium text-olake-ink'>{col.title}</p>
              <div className='mt-[16px] flex flex-col gap-[12px]'>
                {col.links.map((link) => (
                  <FooterLinkItem key={link.href} {...link} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div
          role='group'
          aria-label='OLake on social media'
          className='mt-[40px] flex items-center gap-[18px] lg:mt-[56px]'
        >
          {FOOTER_SOCIALS.map((social) => {
            const Icon = ICONS[social.icon]
            const content = <Icon size={18} aria-hidden='true' />
            return social.href.startsWith('http') ? (
              <a
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.label}
                className='text-olake-muted transition-colors hover:text-olake-blue'
              >
                {content}
              </a>
            ) : (
              <Link
                key={social.label}
                to={social.href}
                aria-label={social.label}
                className='text-olake-muted transition-colors hover:text-olake-blue'
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      {/* The design's blue wash bleeding up from the bottom edge. */}
      <div
        aria-hidden='true'
        className='lakeside-footer-wash pointer-events-none absolute inset-x-0 bottom-0 h-[280px] lg:h-[360px]'
      />
    </footer>
  )
}
