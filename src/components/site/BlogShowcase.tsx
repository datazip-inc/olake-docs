import React from 'react'
import { PiArrowSquareOut, PiArrowSquareOutBold } from 'react-icons/pi'

// Blog data structure
interface BlogPost {
  title: string
  description: string
  readTime: string
  bgColor: string
  imageSrc: string
  url: string
}

const BlogShowcase: React.FC = () => {
  // Sample blog data
  const blogPosts: BlogPost[] = [
    {
      title: 'All about Iceberg Partitioning and Partitioning Writing Strategies',
      description:
        'Ever wondered how partitioning in big table formats like Apache Iceberg works out? And what partitioned writing strategies Iceberg can assist...',
      readTime: '9 Min Read',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      imageSrc: '/img/blog/cover/iceberg-partitioning-and-writing-strategies-cover.webp',
      url: '/iceberg/iceberg-partitioning-and-writing-strategies/'
    },
    {
      title: 'Data Lake vs. Data Lakehouse – Architecting the Modern Stack',
      description:
        'Discover how Data Lakehouses revolutionize data architecture by bringing ACID transactions, schema enforcement, and governance to cloud object storage...',
      readTime: '31 Min Read',
      bgColor: 'bg-sky-50 dark:bg-sky-900/10',
      imageSrc: '/img/blog/cover/data-lakehouse-cover.webp',
      url: '/blog/data-lake-vs-data-lakehouse-modern-stack/'
    },
    {
      title: 'OLake — now an Arrow-based Iceberg Ingestion Tool',
      description:
        "Discover how OLake's new Arrow-based architecture delivers 1.75x faster ingestion performance.",
      readTime: '9 Min Read',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      imageSrc: '/img/blog/2025/26/arrow_olake.webp',
      url: '/blog/olake-arrow-based-iceberg-ingestion/'
    },
    {
      title:
        "Bridging the Gap: Making OLake's MOR Iceberg Tables Compatible with Databrick's Query Engine",
      description:
        "Learn how to make OLake's Merge-on-Read (MOR) Iceberg tables compatible with Databricks using an automated MOR to COW write script...",
      readTime: '30 Min Read',
      bgColor: 'bg-gray-50 dark:bg-gray-800/20',
      imageSrc: '/img/blog/2025/12/snowflake_cow.webp',
      url: '/blog/olake-mor-cow-databricks/'
    }
  ]

  return (
    <section className='bg-white py-16 dark:bg-gray-900 md:py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mx-auto max-w-6xl'>
          {/* Heading section - shown first on mobile */}
          <div className='mb-8 flex flex-col justify-center md:hidden'>
            {/* "Blogs" label - mobile: 12px Space Grotesk Medium centered */}
            <div className='mb-3 text-center font-space text-xs font-medium text-[#203fdd]'>
              Blogs
            </div>
            {/* "Stay ahead..." heading - mobile: 20px, line-height 120% (-5% from 125%), letter-spacing -0.05em */}
            <h2 className='font-space text-xl font-medium leading-tight tracking-tighter text-[#333333] dark:text-white'>
              Stay ahead, with our latest reads
            </h2>
          </div>

          {/* Mobile: Horizontal scrollable blog cards */}
          <div className='-mx-4 px-4 md:hidden'>
            <div className='flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4'>
              {blogPosts.map((post) => (
                <a
                  key={post.url}
                  href={post.url}
                  className='block w-[280px] flex-shrink-0 snap-start rounded-2xl shadow-lg'
                >
                  <div className='h-full overflow-hidden rounded-2xl'>
                    <div className='flex h-full flex-col'>
                      <div className='flex items-center justify-center rounded-tl-2xl rounded-tr-2xl dark:bg-gray-800'>
                        <img
                          src={post.imageSrc}
                          alt={post.title}
                          width={64}
                          height={64}
                          loading='lazy'
                          decoding='async'
                          className='h-40 w-full object-contain p-2'
                        />
                      </div>
                      <div className='flex flex-col bg-white p-4 dark:bg-gray-800'>
                        {/* Blog title - mobile: text-sm (14px vs 13.79px = +0.21px) leading-5 (20px vs 18.39px = +1.61px) */}
                        <h3 className='mb-2 font-space text-sm font-bold leading-5 text-gray-900 dark:text-white'>
                          {post.title}
                        </h3>
                        {/* Blog description - mobile: text-[9px] (10px vs 9.2px = +0.8px) leading-4 (16px vs 13.79px = +2.21px) */}
                        <p className='mb-3 font-sans text-[9px] font-normal leading-4 text-gray-600 dark:text-gray-300'>
                          {post.description}
                        </p>
                        {/* Read time - mobile: text-[9px] (10px vs 9.2px = +0.8px) leading-4 (16px vs 13.79px = +2.21px) */}
                        <div className='font-sans text-[9px] font-normal leading-4 text-gray-500 dark:text-gray-400'>
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: Main section with heading on right, featured post on left */}
          <div className='mb-12 hidden flex-col gap-8 md:flex lg:flex-row'>
            {/* Featured Blog Post - Left side on desktop */}
            <div className='w-full rounded-2xl lg:w-1/2'>
              <a href={blogPosts[0].url} className='block h-full rounded-2xl shadow-lg'>
                <div className='h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1'>
                  <div className='flex h-full flex-col'>
                    <div className='flex items-center justify-center rounded-tl-2xl rounded-tr-2xl dark:bg-gray-800'>
                      <img
                        src={blogPosts[0].imageSrc}
                        alt={blogPosts[0].title}
                        width={80}
                        height={80}
                        loading='lazy'
                        decoding='async'
                        className='h-auto w-full object-contain p-2'
                      />
                    </div>
                    <div className='flex flex-col justify-center bg-white p-8 dark:bg-gray-800'>
                      <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                        {blogPosts[0].title}
                      </h3>
                      <p className='mb-6 text-gray-600 dark:text-gray-300'>
                        {blogPosts[0].description}
                      </p>
                      <div className='mt-auto text-sm text-gray-500 dark:text-gray-400'>
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Heading section - Right side on desktop */}
            <div className='flex w-full flex-col justify-center lg:w-1/2'>
              <div className='mb-3 font-space text-2xl font-medium tracking-wider text-[#203fdd]'>
                Blogs
              </div>
              <h2 className='mb-8 font-space text-5xl font-medium tracking-wider text-[#333333] dark:text-white'>
                Stay ahead,
                <br />
                with our latest reads
              </h2>
              <a
                href='/blog'
                className='flex w-fit items-center gap-x-2 font-medium text-[#203fdd]'
              >
                View all Blogs
                <PiArrowSquareOutBold className='size-4' />
              </a>
            </div>
          </div>

          {/* Desktop: Other Blog Posts in a grid */}
          <div className='hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {blogPosts.slice(1).map((post) => (
              <a key={post.url} href={post.url} className='block h-full rounded-3xl shadow-lg'>
                <div className='h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1'>
                  <div className='flex items-center justify-center rounded-tl-2xl rounded-tr-2xl dark:bg-gray-800'>
                    <img
                      src={post.imageSrc}
                      alt={post.title}
                      width={64}
                      height={64}
                      loading='lazy'
                      decoding='async'
                      className='h-48 w-full object-contain px-2'
                    />
                  </div>
                  <div className='flex h-full flex-col bg-white p-6 dark:bg-gray-800'>
                    <h3 className='mb-3 text-lg font-bold text-gray-900 dark:text-white'>
                      {post.title}
                    </h3>
                    <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>
                      {post.description}
                    </p>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>{post.readTime}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* "View all Blogs" button - mobile only, centered at bottom */}
          <div className='mt-8 flex justify-center md:hidden'>
            <a
              href='/blog'
              className='flex items-center gap-x-2 font-sans text-base font-medium text-[#203fdd]'
            >
              View all Blogs
              <PiArrowSquareOutBold className='size-4' />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogShowcase
