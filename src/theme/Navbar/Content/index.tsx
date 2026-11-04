import React from 'react'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'
import NavbarSearch from '@theme/Navbar/Search'
import SearchBar from '@theme/SearchBar'
import LakesideNavbar from '@site/src/components/landing/chrome/LakesideNavbar'
import '@site/src/components/landing/chrome/chrome.css'

// Swizzled at Content, not at @theme/Navbar: the root owns NavbarMobileSidebar,
// the only thing rendering the docs sidebar below 1279px.
export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar()

  return (
    <LakesideNavbar
      variant='bar'
      mobileSidebar={mobileSidebar}
      trailing={
        <>
          <NavbarColorModeToggle className='olake-bar-colormode' />
          <NavbarSearch className='olake-bar-search'>
            <SearchBar />
          </NavbarSearch>
        </>
      }
    />
  )
}
