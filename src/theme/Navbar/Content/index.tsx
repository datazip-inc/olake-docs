import React from 'react'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'
import NavbarSearch from '@theme/Navbar/Search'
import SearchBar from '@theme/SearchBar'
import SiteNavbar from '@site/src/components/landing/Navbar/SiteNavbar'
import '@site/src/components/landing/Navbar/SiteNavbar.css'

// Swizzled at Content, not at @theme/Navbar: the root owns NavbarMobileSidebar,
// the only thing rendering the docs sidebar below 1279px.
export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar()

  return (
    <SiteNavbar
      mobileSidebar={mobileSidebar}
      trailing={
        <>
          <NavbarColorModeToggle className='olake-nav-colormode' />
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
        </>
      }
    />
  )
}
