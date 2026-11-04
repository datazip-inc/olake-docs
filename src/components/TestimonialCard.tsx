import React from 'react'
import { PiLinkedinLogo, PiQuotesFill } from 'react-icons/pi'

interface Author {
  name: string
  title: string
  imageSrc?: string
  imageAlt?: string
  linkedinUrl?: string
}

interface TestimonialCardProps {
  quote: string
  // Either pass a single author via flat props...
  name?: string
  title?: string
  imageSrc?: string
  imageAlt?: string
  linkedinUrl?: string
  // ...or pass multiple via the authors array.
  authors?: Author[]
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

function AuthorBadge({ author }: { author: Author }) {
  return (
    <div className='flex items-center gap-[12px]'>
      {author.imageSrc ? (
        <img
          src={author.imageSrc}
          alt={author.imageAlt || author.name}
          width={48}
          height={48}
          loading='lazy'
          decoding='async'
          data-no-zoom=''
          className='m-0! block h-[48px]! w-[48px]! max-w-none! rounded-full! border border-solid border-olake-line object-cover shadow-none!'
        />
      ) : (
        <div className='flex h-[48px] w-[48px] items-center justify-center rounded-full border border-solid border-olake-line bg-olake-surface text-[15px] font-medium text-olake-ink'>
          {getInitials(author.name)}
        </div>
      )}
      <div className='min-w-0'>
        <p className='m-0! flex items-center gap-[6px] text-[15px] font-medium leading-[1.3] text-olake-ink'>
          {author.linkedinUrl ? (
            <a
              href={author.linkedinUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-[6px] text-olake-ink! no-underline hover:text-olake-blue!'
            >
              {author.name}
              <PiLinkedinLogo size={15} aria-hidden='true' className='text-olake-muted' />
              <span className='sr-only'>(LinkedIn)</span>
            </a>
          ) : (
            author.name
          )}
        </p>
        <p className='m-0! mt-[2px]! text-[13px] leading-[1.4] text-olake-muted'>{author.title}</p>
      </div>
    </div>
  )
}

/**
 * A customer quote in the story pages: a quiet brand-tinted card with the quote in regular ink and
 * the people behind it below a hairline. Tokens only, so it follows light and dark mode.
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authors,
  name,
  title,
  imageSrc,
  imageAlt,
  linkedinUrl
}) => {
  const list: Author[] =
    authors ?? (name && title ? [{ name, title, imageSrc, imageAlt, linkedinUrl }] : [])

  return (
    <figure className='mx-auto my-[32px] max-w-[800px] rounded-[16px] border border-solid border-olake-line bg-olake-blue-tint p-[24px] lg:p-[32px]'>
      <PiQuotesFill size={28} aria-hidden='true' className='text-olake-blue dark:text-olake-blue-on-dark' />
      <p className='m-0! mt-[12px]! text-[18px] leading-[1.6] text-olake-ink lg:text-[20px]'>
        &ldquo;{quote.replace(/^["“]|["”]$/g, '')}&rdquo;
      </p>
      {list.length > 0 && (
        <figcaption className='mt-[24px] flex flex-wrap items-center gap-x-[32px] gap-y-[16px] border-0 border-t border-solid border-olake-line pt-[20px]'>
          {list.map((author, i) => (
            <AuthorBadge key={i} author={author} />
          ))}
        </figcaption>
      )}
    </figure>
  )
}

export default TestimonialCard
