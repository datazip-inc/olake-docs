import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import { cn } from '@site/src/lib/utils'
import { LAKESIDE_NAV, LAKESIDE_CTA } from '@site/src/components/landing/chrome/navItems'

// Group rows expand in place with Infima's collapsible classes, so they pick up dark mode.
// Upstream renders themeConfig.navbar.items; the real menu lives in chrome/navItems.ts.
// Only the primary menu is replaced: the docs secondary menu is untouched.
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar()
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const close = () => mobileSidebar.toggle()

  return (
    <nav aria-label='Mobile menu'>
      <ul className='menu__list olake-nav-sidebar-list'>
        {LAKESIDE_NAV.map((entry) =>
          entry.items ? (
            <li
              key={entry.label}
              className={cn('menu__list-item', openGroup !== entry.label && 'menu__list-item--collapsed')}
            >
              <div className='menu__list-item-collapsible'>
                <a
                  className='menu__link menu__link--sublist menu__link--sublist-caret'
                  role='button'
                  href='#'
                  aria-expanded={openGroup === entry.label}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenGroup((g) => (g === entry.label ? null : entry.label))
                  }}
                >
                  {entry.label}
                </a>
              </div>
              <ul
                className='menu__list'
                style={{ display: openGroup === entry.label ? 'block' : 'none' }}
              >
                {entry.items.map((item) => (
                  <li key={item.href} className='menu__list-item'>
                    <Link className='menu__link olake-nav-sidebar-link' to={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={entry.label} className='menu__list-item'>
              <Link className='menu__link olake-nav-sidebar-link' to={entry.href!} onClick={close}>
                {entry.label}
              </Link>
            </li>
          )
        )}
        <li className='menu__list-item'>
          <Link className='menu__link olake-nav-sidebar-link' to={LAKESIDE_CTA.href} onClick={close}>
            {LAKESIDE_CTA.label}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
