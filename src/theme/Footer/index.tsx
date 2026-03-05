import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import Link from '@docusaurus/Link'
import { PiLinkedinLogo, PiYoutubeLogo, PiXLogo, PiRedditLogo, PiSlackLogo } from 'react-icons/pi'

interface LinkItem {
  label: string
  href: string
}

interface SocialLinkItem {
  icon: 'linkedin' | 'youtube' | 'slack' | 'reddit' | 'twitter'
  href: string
  ariaLabel: string
  IconComponent: React.ElementType
}

const Footer: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDarkTheme = colorMode === 'dark'

  const companyLinks: LinkItem[] = [
    { label: 'About us', href: '/about-us' },
    { label: 'Contact us', href: '/contact' },
    { label: 'Branding', href: '/branding' },
    { label: 'Terms of Use', href: '/terms-of-use' },
    { label: 'Privacy Policy', href: '/privacy-policy' }
  ]

  const resourceLinks: LinkItem[] = [
    { label: 'Blogs', href: '/blog' },
    { label: 'Docs', href: '/docs' },
    { label: 'Search', href: '/search' }
    // { label: 'Slack Archive', href: '/slack-archive' },
  ]

  const topReadLinks: LinkItem[] = [
    { label: 'Issues with Debezium', href: '/blog/issues-debezium-kafka' },
    { label: 'OLake Architecture', href: '/blog/olake-architecture' }
  ]

  const socialLinks: SocialLinkItem[] = [
    {
      icon: 'linkedin',
      href: 'https://www.linkedin.com/company/datazipio/',
      ariaLabel: 'LinkedIn',
      IconComponent: PiLinkedinLogo
    },
    {
      icon: 'youtube',
      href: 'https://www.youtube.com/@olakeio',
      ariaLabel: 'YouTube',
      IconComponent: PiYoutubeLogo
    },
    {
      icon: 'slack',
      href: 'https://olake.io/slack',
      ariaLabel: 'Slack',
      IconComponent: PiSlackLogo
    },
    {
      icon: 'reddit',
      href: 'https://reddit.com/r/olake',
      ariaLabel: 'Reddit',
      IconComponent: PiRedditLogo
    },
    {
      icon: 'twitter',
      href: 'https://x.com/_olake',
      ariaLabel: 'X (Twitter)',
      IconComponent: PiXLogo
    }
  ]

  return (
    <footer className='relative h-[62vh] overflow-hidden bg-neutral-100 py-8 dark:bg-gray-900 md:h-[72vh] xl:py-12 2xl:h-[62vh]'>
      {/* Large OLake Watermark - smaller on mobile, positioned to not overlap */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[36%] select-none bg-[linear-gradient(180deg,#EAEAEA_27.62%,rgba(255,255,255,0)_70.27%)] font-space text-[clamp(133px,25vw,420px)] font-medium leading-[1.2] opacity-80 dark:bg-[linear-gradient(180deg,rgba(50,50,50,1)_27.62%,rgba(50,50,50,0)_70.27%)] xl:translate-y-[36%] xl:bg-[linear-gradient(180deg,#EAEAEA_27.62%,rgba(255,255,255,0)_70.27%)] xl:text-[clamp(200px,30vw,572px)] xl:dark:bg-[linear-gradient(180deg,rgba(50,50,50,1)_27.62%,rgba(50,50,50,0)_70.27%)]'
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        OLake
      </div>

      <div className='container relative z-10 mx-auto px-4 xl:px-0'>
        {/* Mobile Layout */}
        <div className='xl:hidden'>
          {/* Logo Section - Mobile */}
          <div className='mb-4'>
            <Link
              to='/'
              className='font-space text-xs font-medium leading-tight text-blue-600 dark:text-blue-400'
            >
              OLake
            </Link>
            <h2 className='mt-2 font-space text-3xl font-normal leading-tight text-gray-800 dark:text-white'>
              Fastest <span className='font-medium'>Data Replication</span>
            </h2>
          </div>

          {/* Social Icons - Mobile (10px) */}
          <div className='mb-6 flex space-x-3'>
            {socialLinks.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                aria-label={social.ariaLabel}
                className='flex items-center justify-center'
                target='_blank'
                rel='noopener noreferrer'
              >
                <social.IconComponent
                  className='my-1 size-2.5 text-gray-700 dark:text-white md:size-3'
                  aria-hidden
                />
              </a>
            ))}
          </div>

          {/* Link Sections - 3 column grid on mobile */}
          <div className='grid grid-cols-3 gap-4'>
            {/* Company Links */}
            <div className='font-sans'>
              <h3 className='mb-2 text-[8px] font-normal uppercase leading-normal tracking-wider text-brand-black dark:text-white md:text-xs'>
                COMPANY
              </h3>
              <ul className='list-none space-y-0.5 p-0'>
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='font-sans text-[8px] leading-3 tracking-[0.01em] text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300 md:text-xs'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className='font-sans'>
              <h3 className='mb-2 text-[8px] font-normal uppercase leading-normal tracking-wider text-brand-black dark:text-white md:text-xs'>
                RESOURCES
              </h3>
              <ul className='list-none space-y-0.5 p-0'>
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='font-sans text-[8px] leading-3 tracking-[0.01em] text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300 md:text-xs'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Reads Links */}
            <div className='font-sans'>
              <h3 className='mb-2 text-[8px] font-normal uppercase leading-normal tracking-wider text-brand-black dark:text-white md:text-xs'>
                TOP READS
              </h3>
              <ul className='list-none space-y-0.5 p-0'>
                {topReadLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='font-sans text-[8px] leading-3 tracking-[0.01em] text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300 md:text-xs'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden xl:block'>
          <div className='grid grid-cols-2 gap-8 xl:grid-cols-10'>
            {/* Logo and Social Links Section */}
            <div className='col-span-1 xl:col-span-7'>
              <div className='mb-6'>
                <Link to='/' className='text-2xl font-medium text-blue-600 dark:text-blue-400'>
                  OLake
                </Link>
                <h2 className='mb-6 mt-6 text-[56px] font-extralight text-gray-800 dark:text-white'>
                  Fastest <span className='font-medium'>Data Replication</span>
                </h2>
              </div>

              <div className='flex space-x-4'>
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    aria-label={social.ariaLabel}
                    className='flex h-10 w-10 items-center justify-center'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <social.IconComponent
                      className='h-5 w-5 text-gray-700 dark:text-white'
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links Section */}
            <div className='col-span-1 font-sans'>
              <h3 className='mb-4 text-base font-normal tracking-wider text-brand-black dark:text-white'>
                COMPANY
              </h3>
              <ul className='list-none space-y-3 p-0'>
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links Section */}
            <div className='col-span-1 font-sans'>
              <h3 className='mb-4 text-base font-normal tracking-wider text-brand-black dark:text-white'>
                RESOURCES
              </h3>
              <ul className='list-none space-y-3 p-0'>
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Reads Links Section */}
            <div className='col-span-1 font-sans'>
              <h3 className='mb-4 text-base font-normal tracking-wider text-brand-black dark:text-white'>
                TOP READS
              </h3>
              <ul className='list-none space-y-3 p-0'>
                {topReadLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='text-brand-gray-450 transition-colors hover:text-blue-500 dark:text-gray-300'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section - Desktop only, positioned relative to footer */}
      <div className='absolute bottom-8 left-12 hidden text-brand-gray-450 xl:block'>
        By Datazip
      </div>
    </footer>
  )
}

export default Footer
