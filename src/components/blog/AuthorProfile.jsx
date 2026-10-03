import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import AuthorSocials from './AuthorSocials'

/**
 * Avatar, name, role, post count and social icons of one author, for the author page (name is
 * the h1) and the authors list (name is an h2 that links to the author's page). Replaces the stock
 * Author component, whose CSS module sizes cannot be overridden from the site CSS.
 */
export default function AuthorProfile({ as: Heading = 'h2', author, count: postCount, link = false }) {
  // An author without posts in this blog shows no count ("0 posts" reads like an error)
  const count = postCount > 0 ? postCount : undefined
  const photo = useBaseUrl(author.imageURL || '')
  const name = <span translate='no'>{author.name}</span>
  const href = author.page?.permalink

  return (
    <div className={`ob-author ob-author--${Heading}`}>
      {author.imageURL && (
        <img className='ob-author__photo' src={photo} alt='' width='72' height='72' />
      )}
      <div className='ob-author__info'>
        <Heading className='ob-author__name'>{link && href ? <Link to={href}>{name}</Link> : name}</Heading>
        {(author.title || count !== undefined) && (
          <p className='ob-author__role'>
            {author.title}
            {author.title && count !== undefined && <span aria-hidden='true'> · </span>}
            {count !== undefined && `${count} ${count === 1 ? 'post' : 'posts'}`}
          </p>
        )}
        <AuthorSocials author={author} />
      </div>
    </div>
  )
}
