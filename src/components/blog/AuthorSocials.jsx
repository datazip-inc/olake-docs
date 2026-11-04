import React from 'react'
import {
  PiLinkedinLogo,
  PiGithubLogo,
  PiXLogo,
  PiTwitterLogo,
  PiYoutubeLogo,
  PiLink
} from 'react-icons/pi'

const PLATFORMS = {
  linkedin: { Icon: PiLinkedinLogo, label: 'LinkedIn' },
  github: { Icon: PiGithubLogo, label: 'GitHub' },
  x: { Icon: PiXLogo, label: 'X' },
  twitter: { Icon: PiTwitterLogo, label: 'Twitter' },
  youtube: { Icon: PiYoutubeLogo, label: 'YouTube' }
}

/**
 * An author's social links as small Phosphor outline icons (the same set as the footer) with a 24px click target with a 24px click target. `name` makes the
 * accessible label specific ("LinkedIn profile of Jane Doe"). Renders nothing without socials.
 */
export default function AuthorSocials({ author }) {
  const entries = Object.entries(author.socials || {})
  if (entries.length === 0) return null
  return (
    <span className='ob-socials'>
      {entries.map(([platform, href]) => {
        const { Icon, label } = PLATFORMS[platform] || { Icon: PiLink, label: platform }
        return (
          <a
            key={platform}
            className='ob-socials__link'
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={author.name ? `${label} profile of ${author.name}` : label}
            title={label}
          >
            <Icon size={16} aria-hidden='true' />
          </a>
        )
      })}
    </span>
  )
}
