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
      className='text-[14px] text-[#8a8a8a] transition-colors hover:text-[#202020]'
    >
      {label}
    </a>
  ) : (
    <Link to={href} className='text-[14px] text-[#8a8a8a] transition-colors hover:text-[#202020]'>
      {label}
    </Link>
  )

export default function LakesideFooter() {
  return (
    <footer className='lakeside-footer relative overflow-hidden border-0 border-t border-solid border-[#e7e7e7] bg-white pt-[56px] lg:pt-[72px]'>
      <div className='relative z-10 mx-auto w-full max-w-[1016px] px-[32px] pb-[180px] lg:px-0 lg:pb-[260px]'>
        <p className='text-[15px] font-medium text-[#0029ce]'>{FOOTER_WORDMARK.eyebrow}</p>
        <p className='mt-[10px] text-[30px] leading-[1.1] tracking-[-0.01em] text-[#202020] lg:text-[44px]'>
          {FOOTER_WORDMARK.headline}
        </p>

        <div className='mt-[40px] grid grid-cols-1 gap-[32px] sm:grid-cols-3 lg:mt-[56px] lg:gap-[64px]'>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className='text-[14px] font-medium text-[#202020]'>{col.title}</p>
              <div className='mt-[16px] flex flex-col gap-[12px]'>
                {col.links.map((link) => (
                  <FooterLinkItem key={link.href} {...link} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-[40px] flex items-center gap-[18px] lg:mt-[56px]'>
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
                className='text-[#9b9b9b] transition-colors hover:text-[#0029ce]'
              >
                {content}
              </a>
            ) : (
              <Link
                key={social.label}
                to={social.href}
                aria-label={social.label}
                className='text-[#9b9b9b] transition-colors hover:text-[#0029ce]'
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
        className='pointer-events-none absolute inset-x-0 bottom-0 h-[280px] lg:h-[360px]'
        style={{
          background:
            'linear-gradient(to top, rgba(30,58,224,0.85) 0%, rgba(86,110,236,0.55) 32%, rgba(174,187,247,0.28) 65%, rgba(255,255,255,0) 100%)'
        }}
      />
    </footer>
  )
}
