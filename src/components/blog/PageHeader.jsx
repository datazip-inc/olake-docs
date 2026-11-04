import React from 'react'

/** Title block for blog list, tag, author, archive and tag-index pages: a real h1, left aligned. */
export default function PageHeader({ title, description, children }) {
  return (
    <header className='ob-header'>
      <h1 className='ob-title'>{title}</h1>
      {description && <p className='ob-lede'>{description}</p>}
      {children}
    </header>
  )
}
