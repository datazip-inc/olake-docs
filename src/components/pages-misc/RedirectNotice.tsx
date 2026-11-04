import React from 'react'

/**
 * The fallback shown while a redirect-only page (/slack, /slack-archive) forwards the visitor.
 * Plain tokens, so it follows the visitor's light or dark theme.
 */
export default function RedirectNotice({ title, href }: { title: string; href: string }) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-olake-surface px-[24px] text-center font-sans'>
      <h1 className='olake-h1 mb-0'>{title}</h1>
      <p className='mb-0 mt-[12px] text-[15px] text-olake-text-2'>
        If you're not redirected automatically,{' '}
        <a
          href={href}
          className='rounded-[4px] text-olake-blue underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olake-blue dark:text-olake-blue-on-dark'
        >
          click here
        </a>
        .
      </p>
    </main>
  )
}
