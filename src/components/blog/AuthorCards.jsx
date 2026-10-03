import React from 'react'
import Link from '@docusaurus/Link'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import AuthorSocials from './AuthorSocials'

/** Author bio cards at the end of a post: avatar, name (links to the author page), role, socials. */
export default function AuthorCards() {
  const { metadata, assets } = useBlogPost()
  const { authors } = metadata
  if (!authors || authors.length === 0) return null

  return (
    <ul className='ob-bios'>
      {authors.map((author, idx) => {
        const imageURL = assets.authorsImageUrls[idx] ?? author.imageURL
        const link = author.page?.permalink || author.url || undefined
        const name = (
          <span className='ob-bio__name' translate='no'>
            {author.name}
          </span>
        )
        return (
          <li key={author.key || author.name || idx} className='ob-bio'>
            {imageURL && (
              <img className='ob-bio__photo' src={imageURL} alt='' width='48' height='48' loading='lazy' decoding='async' />
            )}
            <div className='ob-bio__text'>
              <p className='ob-bio__label'>Written by</p>
              <p className='ob-bio__row'>
                {author.name && (link ? <Link to={link}>{name}</Link> : name)}
                <AuthorSocials author={author} />
              </p>
              {author.title && <p className='ob-bio__role'>{author.title}</p>}
              {author.description && <p className='ob-bio__about'>{author.description}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
