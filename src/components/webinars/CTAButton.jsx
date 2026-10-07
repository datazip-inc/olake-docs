// components/CTAButton.jsx

import React from 'react'
import PropTypes from 'prop-types'
import Link from '@docusaurus/Link'

const BASE =
  'inline-flex items-center justify-center gap-[10px] rounded-[8px] border border-solid transition-all h-[38px] px-[18px] text-[14px] lg:h-[40px] lg:px-[20px] lg:text-[15px]'

const VARIANTS = {
  primary:
    'border-olake-blue-ring bg-olake-blue text-olake-on-blue shadow-[var(--olake-shadow-btn)] hover:border-olake-blue-hover hover:bg-olake-blue-hover hover:text-white',
  secondary:
    'border-olake-btn-border bg-olake-surface text-olake-btn-secondary transition-colors hover:bg-olake-surface-alt hover:text-olake-ink',
  outline:
    'border-olake-btn-border bg-olake-surface text-olake-btn-secondary transition-colors hover:bg-olake-surface-alt hover:text-olake-ink'
}

/** Link-styled-as-button with an optional heading above it and an optional icon. */
const CTAButton = ({
  title = '',
  buttonText,
  icon: Icon = undefined,
  href = '#',
  onClick = undefined,
  variant = 'primary',
  className = ''
}) => {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`
  // A link inside the site (e.g. back to /webinar/) is a normal in-tab link; only an outside URL
  // (a registration form, a meeting room) opens in a new tab.
  const isInternal = href.startsWith('/') && !href.startsWith('//')
  const content = (
    <>
      {Icon && <Icon aria-hidden='true' />}
      <span>{buttonText}</span>
    </>
  )
  return (
    <div className='flex flex-col items-center gap-[10px]'>
      {title && <h3 className='text-[16px] font-normal text-olake-ink'>{title}</h3>}
      {isInternal ? (
        <Link to={href} onClick={onClick} className={classes}>
          {content}
        </Link>
      ) : (
        <a
          href={href}
          onClick={onClick}
          target='_blank'
          rel='noopener noreferrer'
          className={classes}
        >
          {content}
        </a>
      )}
    </div>
  )
}

CTAButton.propTypes = {
  /** Optional title displayed above the button */
  title: PropTypes.string,
  /** Text displayed inside the button */
  buttonText: PropTypes.string.isRequired,
  /** Icon component from react-icons or similar */
  icon: PropTypes.elementType,
  /** URL or path the button links to */
  href: PropTypes.string,
  /** Optional click handler */
  onClick: PropTypes.func,
  /** Variant of the button */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  /** Additional Tailwind CSS classes */
  className: PropTypes.string
}

export default CTAButton
