import React from 'react'
import { outerLink } from '../../../utils/functions'
import SectionHeader from '../SectionHeader'

const BlogList = [
  {
    tag: 'New Release',
    heading: 'Four Critical Challenges in MongoDB ETL and How to tackle them for your Data Lake',
    content:
      'Uncover the key challenges of extracting, transforming, and loading data from MongoDB into a data lakehouse. Learn best practices and common pitfalls to ensure seamless data integration and unlock valuable insights.',
    link: 'https://olake.io/blog/mongodb-etl-challenges',
    image: '/img/olake/blog-image-1.svg'
  },
  {
    tag: 'New Release',
    heading: 'Troubleshooting Common Issues and Solutions to MongoDB ETL Errors',
    content:
      'Explore practical solutions to common MongoDB ETL errors in our troubleshooting guide. Learn how to address issues like schema mismatches, data type conflicts, and performance bottlenecks to streamline your ETL processes and ensure smooth data integration.',
    link: 'https://olake.io/blog/troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors',
    image: '/img/olake/blog-image-2.svg'
  }
]

const OLakeBlogList = () => {
  return (
    <div className='mx-auto flex w-full flex-col items-center md:max-w-[90%] md:px-4 md:py-8'>
      <SectionHeader heading={<>Read more from our blogs</>} />

      {/* Blog list container using grid for responsive layout */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {BlogList.map((blog, index) => (
          <div
            key={index}
            onClick={() => outerLink(blog.link)}
            className='flex cursor-pointer flex-col gap-2 rounded-lg bg-gray-100 p-6 transition-transform dark:bg-[#202020]'
          >
            <img
              src={blog.image}
              alt={blog.heading}
              className='mb-4 h-auto w-full object-contain'
              loading="lazy" decoding="async"
            />
            {/* Tag */}
            <div className='mt-4 flex items-center justify-center self-start rounded-full bg-gray-300 px-3 text-[12px] font-medium text-gray-900 dark:bg-[#333] dark:text-white'>
              {blog.tag}
            </div>
            {/* Heading */}
            <div className='mt-2 text-[20px] font-bold leading-[28px] tracking-[-0.72px] text-gray-900 dark:text-white'>
              {blog.heading}
            </div>
            {/* Content */}
            <div className='mt-2 text-[14px] font-normal leading-[22px] text-gray-800 dark:text-gray-200'>
              {blog.content}
            </div>
            {/* Read More Link */}
            <a
              href={blog.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 text-[16px] font-semibold leading-[16px] text-gray-900 dark:text-white'
            >
              Read more
              <img src='/img/olake/ArrowSquareOut.svg' alt='arrow right' className='ml-1 h-4 w-4' loading="lazy" decoding="async" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OLakeBlogList
