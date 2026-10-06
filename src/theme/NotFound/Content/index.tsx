import React from 'react'
import Link from '@docusaurus/Link'
import '@site/src/components/pages-misc/pages-misc.css'

/**
 * The 404 page. The theme's default copy asks the visitor to contact the owner of the site that
 * linked them, which does not help anyone; this one says what happened and offers three ways on.
 * Markup keeps the `.olake-notfound` hooks used by pages-misc.css; the h1 uses the shared title style.
 */
export default function NotFoundContent(): React.ReactElement {
  return (
    <div className='olake-notfound'>
      <main>
        <h1 className='hero__title'>Page not found</h1>
        <p>We could not find this page. It may have moved, or the link may have a typo.</p>
        <p>Try the home page, the docs or the blog, or use the search in the top bar.</p>
      </main>
      <nav aria-label='Pages to try instead' className='olake-notfound__links'>
        <Link to='/' className='olake-notfound__btn olake-notfound__btn--primary'>
          Back to home
        </Link>
        <Link to='/docs/' className='olake-notfound__btn'>
          Read the docs
        </Link>
        <Link to='/blog/' className='olake-notfound__btn'>
          Visit the blog
        </Link>
      </nav>
    </div>
  )
}
