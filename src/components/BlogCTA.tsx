import React from 'react'
import { FaExternalLinkAlt, FaGithub, FaSlack } from 'react-icons/fa'

const BlogCTA = () => {
  return (
    <div className='w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-lg transition-colors dark:bg-black/70'>
      <h2 className='mb-4 text-4xl font-bold text-gray-800 dark:text-white'>OLake Go</h2>
      <p className='mb-8 text-lg font-light text-gray-700 dark:text-gray-300'>
        Replicate databases, Kafka, and S3 into Apache Iceberg with OLake Go, an open source EL
        engine built for Iceberg from the ground up.
      </p>

      <div className='flex flex-col justify-center gap-4 md:flex-row'>
        <a
          href='https://olake.io/slack'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex min-w-[150px] transform items-center justify-center rounded-full bg-black px-6 py-3 text-lg font-medium text-white transition hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-black'
        >
          <FaSlack className='mr-2 text-white dark:text-black' />
          <span className='text-xs text-white dark:text-black'>Join Slack</span>
        </a>

        <a
          href='/contact'
          className='inline-flex min-w-[150px] transform items-center justify-center rounded-full bg-black px-6 py-3 text-lg font-medium text-white transition hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-black'
        >
          <FaExternalLinkAlt className='mr-2 text-white dark:text-black' />
          <span className='text-xs text-white dark:text-black'>Signup</span>
        </a>

        <a
          href='https://github.com/datazip-inc/olake'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex min-w-[150px] transform items-center justify-center rounded-full bg-black px-6 py-3 text-lg font-medium text-white transition hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-black'
        >
          <FaGithub className='mr-2 text-white dark:text-black' />

          <span className='text-xs text-white dark:text-black'>Explore OLake GitHub</span>
        </a>
      </div>

      <div className='mt-6 text-sm text-gray-600 dark:text-gray-400'>
        Contact us at <strong>hello@olake.io</strong>
      </div>
    </div>
  )
}

export default BlogCTA
