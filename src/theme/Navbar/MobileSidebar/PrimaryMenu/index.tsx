import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import { cn } from '@site/src/lib/utils'
import {
  MOBILE_LINKS,
  isMobileGroup,
  isFlyout,
  type NavEntry,
  type NavFlyout
} from '@site/src/components/landing/Navbar/navData'

// A row that expands in place, mirroring the desktop Docs dropdown. Uses
// Infima's own collapsible classes, so it picks up dark mode for free.
// Recurses for nested groups (e.g. Resources > Community).
function MenuGroupItem({
  entry,
  onNavigate
}: {
  entry: NavEntry | NavFlyout
  onNavigate: () => void
}) {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <li className={cn('menu__list-item', collapsed && 'menu__list-item--collapsed')}>
      <div className='menu__list-item-collapsible'>
        <a
          className='menu__link menu__link--sublist menu__link--sublist-caret'
          role='button'
          href='#'
          aria-expanded={!collapsed}
          onClick={(e) => {
            e.preventDefault()
            setCollapsed((c) => !c)
          }}
        >
          {entry.label}
        </a>
      </div>
      <ul className='menu__list' style={{ display: collapsed ? 'none' : 'block' }}>
        {entry.items!.map((item) =>
          isFlyout(item) ? (
            <MenuGroupItem key={item.label} entry={item} onNavigate={onNavigate} />
          ) : (
            <li key={item.href} className='menu__list-item'>
              <Link
                className='menu__link olake-nav-sidebar-link'
                to={item.href}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </li>
  )
}

// Upstream renders themeConfig.navbar.items; those describe the old navbar.
// Only the primary menu is replaced — the docs secondary menu is untouched.
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar()

  return (
    <ul className='menu__list olake-nav-sidebar-list'>
      {MOBILE_LINKS.map((link) =>
        isMobileGroup(link) ? (
          <MenuGroupItem key={link.label} entry={link} onNavigate={() => mobileSidebar.toggle()} />
        ) : (
          <li key={link.href} className='menu__list-item'>
            <Link
              className='menu__link olake-nav-sidebar-link'
              to={link.href}
              onClick={() => mobileSidebar.toggle()}
            >
              {link.label}
            </Link>
          </li>
        )
      )}
    </ul>
  )
}
