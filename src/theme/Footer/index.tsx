import React from 'react'
import Link from '@docusaurus/Link'
import { PiLinkedinLogo, PiYoutubeLogo, PiXLogo, PiSlackLogo } from 'react-icons/pi'
import './styles.css'

const SOCIAL_BOX: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '8px',
  border: '1px solid #DADEEA',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5B6484'
}

const COL_HEAD: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '12px',
  letterSpacing: '0.08em',
  fontWeight: 700,
  color: '#10173A',
  marginBottom: '18px'
}

const COL_LINKS: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  fontSize: '15px',
  color: '#8890A8'
}

const LINK_COLOR: React.CSSProperties = { color: '#8890A8' }

const COLUMNS: { title: string; style: React.CSSProperties; links: [string, string][] }[] = [
  {
    title: 'COMPANY',
    style: COL_LINKS,
    links: [
      ['About us', '/about-us'],
      ['Contact us', '/contact'],
      ['Branding', '/branding'],
      ['Terms of Use', '/terms-of-use'],
      ['Privacy Policy', '/privacy-policy']
    ]
  },
  {
    title: 'RESOURCES',
    style: COL_LINKS,
    links: [
      ['Blogs', '/blog'],
      ['Docs', '/docs'],
      ['Search', '/search'],
      ['Community Slack Archive', '/slack-archive']
    ]
  },
  {
    title: 'TOP READS',
    style: { ...COL_LINKS, maxWidth: '180px' },
    links: [
      ['Issues with Debezium', '/blog/issues-debezium-kafka'],
      ['OLake Architecture', '/blog/olake-architecture']
    ]
  }
]

const SOCIALS = [
  { href: 'https://www.linkedin.com/company/datazipio/', label: 'LinkedIn', Icon: PiLinkedinLogo },
  { href: 'https://www.youtube.com/@olakeio', label: 'YouTube', Icon: PiYoutubeLogo },
  { href: '/slack', label: 'Slack', Icon: PiSlackLogo },
  { href: 'https://x.com/_olake', label: 'X', Icon: PiXLogo }
]

const Footer: React.FC = () => (
  <footer
    className='olake-footer footer-wrap'
    style={{
      background: '#F7F8FA',
      padding: '64px 64px 0',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div>
        <div
          className='olake-footer-brand'
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '24px',
            color: '#3D4FF0',
            marginBottom: '20px'
          }}
        >
          OLake
        </div>
        <h2
          className='footer-hero'
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '38px',
            lineHeight: '1.15',
            color: '#10173A',
            maxWidth: '480px'
          }}
        >
          Fastest <span style={{ fontWeight: 800 }}>Data Replication</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '28px' }}>
          {SOCIALS.map(({ href, label, Icon }) =>
            href.startsWith('/') ? (
              <Link
                key={label}
                className='olake-footer-social'
                to={href}
                aria-label={label}
                style={SOCIAL_BOX}
              >
                <Icon size={17} aria-hidden />
              </Link>
            ) : (
              <a
                key={label}
                className='olake-footer-social'
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={label}
                style={SOCIAL_BOX}
              >
                <Icon size={17} aria-hidden />
              </a>
            )
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className='olake-footer-colhead' style={COL_HEAD}>
              {col.title}
            </div>
            <div style={col.style}>
              {col.links.map(([label, href]) => (
                <Link key={href} className='olake-footer-link' to={href} style={LINK_COLOR}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div
      className='olake-footer-byline'
      style={{
        maxWidth: '1280px',
        margin: '40px auto 0',
        position: 'relative',
        zIndex: 1,
        fontSize: '13px',
        color: '#AEB4C4',
        paddingBottom: '24px'
      }}
    >
      By Datazip
    </div>
    <div
      className='footer-watermark'
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: '260px',
        lineHeight: '1',
        color: '#EDEFF4',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        userSelect: 'none'
      }}
    >
      OLake
    </div>
  </footer>
)

export default Footer
