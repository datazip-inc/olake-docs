import React from 'react'
import Link from '@docusaurus/Link'
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal'
import {translate} from '@docusaurus/Translate'
import IconClose from '@theme/Icon/Close'

// Same wordmark as the navbar (components/landing/chrome/LakesideNavbar) instead of the old logo
// image; the color-mode toggle already sits in the navbar.
export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar()
  return (
    <div className='navbar-sidebar__brand'>
      <Link
        to='/'
        onClick={() => mobileSidebar.toggle()}
        className='text-[16px] font-medium leading-none text-olake-blue dark:text-olake-blue-on-dark'
      >
        OLake
      </Link>
      <button
        type='button'
        aria-label={translate({
          id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
          message: 'Close navigation bar',
          description: 'The ARIA label for close button of mobile sidebar'
        })}
        className='clean-btn navbar-sidebar__close'
        onClick={() => mobileSidebar.toggle()}
      >
        <IconClose color='var(--ifm-color-emphasis-600)' />
      </button>
    </div>
  )
}
