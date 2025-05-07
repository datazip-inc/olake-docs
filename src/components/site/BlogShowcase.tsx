import React from 'react'

// Blog data structure
interface BlogPost {
  id: string
  title: string
  description: string
  readTime: string
  bgColor: string
  imageSrc: string
}

const BlogShowcase: React.FC = () => {
  // Sample blog data
  const blogPosts: BlogPost[] = [
    {
      id: 'issues-debezium-kafka',
      title: 'Common Challenges Using Debezium and Kafka Connect for CDC',
      description:
        'Uncover the key challenges of extracting, transforming, and loading data from MongoDB into a data lakehouse. Learn be...',
      readTime: '14 Min Read',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      imageSrc: '/img/site/blog-1.svg'
    },
    {
      id: 'mongodb-etl-challenges',
      title: 'Four Critical MongoDB ETL Challenges and Ho...',
      description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
      readTime: '14 Min Read',
      bgColor: 'bg-sky-50 dark:bg-sky-900/10',
      imageSrc: '/img/site/blog-2.svg'
    },
    {
      id: 'troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors',
      title: 'Troubleshooting Common Issues and Solutions to Mo...',
      description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
      readTime: '08 Min Read',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      imageSrc: '/img/site/blog-3.svg'
    },
    {
      id: 'debezium-vs-olake',
      title: 'Problems with Debezium and How we (OLake, Open...',
      description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
      readTime: '18 Min Read',
      bgColor: 'bg-gray-50 dark:bg-gray-800/20',
      imageSrc: '/img/site/blog-4.svg'
    }
  ]

  return (
    <section className='bg-white py-16 dark:bg-gray-900 md:py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mx-auto max-w-6xl'>
          {/* Main section with heading on right, featured post on left */}
          <div className='mb-12 flex flex-col gap-8 lg:flex-row'>
            {/* Featured Blog Post - Left side on desktop */}
            <div className='order-2 w-full rounded-2xl lg:order-1 lg:w-1/2'>
              <a
                href={`https://olake.io/blog/${blogPosts[0].id}`}
                className='block h-full rounded-2xl'
                style={{
                  boxShadow: '2px 3px 20px 1px rgba(0,0,0,0.08)'
                }}
              >
                <div className='h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1'>
                  <div className='flex h-full flex-col'>
                    <div className='flex items-center justify-center rounded-tl-2xl rounded-tr-2xl dark:bg-gray-800'>
                      <img
                        src={blogPosts[0].imageSrc}
                        alt={blogPosts[0].title}
                        width={80}
                        height={80}
                        className='h-auto w-full object-contain p-2'
                      />
                    </div>
                    <div className='flex flex-col justify-center bg-white p-6 dark:bg-gray-800 md:p-8'>
                      <h3 className='mb-4 text-xl font-bold text-gray-900 dark:text-white md:text-2xl'>
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
            <div className='order-1 flex w-full flex-col justify-center lg:order-2 lg:w-1/2'>
              <div className='mb-3 text-lg font-medium tracking-wider text-[#203fdd]'>Blogs</div>
              <h2 className='mb-8 text-4xl font-bold tracking-wider text-[#333333] dark:text-white md:text-5xl'>
                Stay ahead,
                <br />
                with our latest reads
              </h2>
              <a href='/blog' className='flex w-fit items-center font-medium text-[#203fdd]'>
                View all Blogs
                <svg className='ml-2 h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Other Blog Posts in a row */}
          <div className='grid gap-6 rounded-2xl md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
            {blogPosts.slice(1).map((post) => (
              <a
                key={post.id}
                href={`https://olake.io/blog/${post.id}`}
                className='block h-full rounded-3xl'
                style={{
                  boxShadow: '2px 3px 20px 1px rgba(0,0,0,0.08)'
                }}
              >
                <div className='h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1'>
                  <div className='flex items-center justify-center rounded-tl-2xl rounded-tr-2xl dark:bg-gray-800'>
                    <img
                      src={post.imageSrc}
                      alt={post.title}
                      width={64}
                      height={64}
                      className='h-56 w-full object-contain px-2 md:h-48'
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
        </div>
      </div>
    </section>
  )
}

export default BlogShowcase
