import React from 'react';

// Blog data structure
interface BlogPost {
    id: string;
    title: string;
    description: string;
    readTime: string;
    bgColor: string;
    imageSrc: string;
}

const BlogShowcase: React.FC = () => {
    // Sample blog data
    const blogPosts: BlogPost[] = [
        {
            id: 'issues-debezium-kafka',
            title: 'Common Challenges Using Debezium and Kafka Connect for CDC',
            description: 'Uncover the key challenges of extracting, transforming, and loading data from MongoDB into a data lakehouse. Learn be...',
            readTime: '14 Min Read',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            imageSrc: '/img/site/blog-1.svg'
        },
        {
            id: 'mongodb-etl-challenges',
            title: 'Four Critical MongoDB ETL Challenges and Ho...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '14 Min Read',
            bgColor: 'bg-sky-50 dark:bg-sky-900/20',
            imageSrc: '/img/site/blog-2.svg'
        },
        {
            id: 'troubleshooting-common-issues-and-solutions-to-mongodb-etl-errors',
            title: 'Troubleshooting Common Issues and Solutions to Mo...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '08 Min Read',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            imageSrc: '/img/site/blog-3.svg'
        },
        {
            id: 'debezium-vs-olake',
            title: 'Problems with Debezium and How we (OLake, Open...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '18 Min Read',
            bgColor: 'bg-gray-50 dark:bg-gray-800/30',
            imageSrc: '/img/site/blog-4.svg'
        }
    ];

    return (
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-white dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Main section with heading on right, featured post on left */}
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
                        {/* Featured Blog Post - Left side on desktop */}
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <a href={`https://olake.io/blog/${blogPosts[0].id}`} className="block h-full">
                                <div className="rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg dark:shadow-gray-800/10 overflow-hidden h-full transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex justify-center items-center">
                                        <img
                                            src={blogPosts[0].imageSrc}
                                            alt={blogPosts[0].title}
                                            width={80}
                                            height={80}
                                            className="w-full h-48 sm:h-72 md:h-86 object-contain"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 flex flex-col justify-center">
                                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white mb-2 sm:mb-4">
                                            {blogPosts[0].title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                                            {blogPosts[0].description}
                                        </p>
                                        <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-auto">
                                            {blogPosts[0].readTime}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Heading section - Right side on desktop */}
                        <div className="w-full p-8 lg:w-1/2 flex flex-col justify-center order-1 lg:order-2 mb-6 lg:mb-0">
                            <div className="text-blue-600 dark:text-blue-400 font-medium mb-2 sm:mb-3">Blogs</div>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-normal text-gray-900 dark:text-white mb-6 sm:mb-8">
                                Stay ahead,<br />
                                with our latest reads
                            </h2>
                            <a
                                href="/blog"
                                className="flex items-center text-blue-600 dark:text-blue-400 font-medium w-fit hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                                View all Blogs
                                <img
                                    src="/img/site/external.svg"
                                    alt="external link"
                                    width={18}
                                    height={18}
                                    className="ml-3"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Other Blog Posts in a row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
                        {blogPosts.slice(1).map((post) => (
                            <a key={post.id} href={`https://olake.io/blog/${post.id}`} className="block h-full">
                                <div className="rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg dark:shadow-gray-800/10 overflow-hidden h-full transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex justify-center rounded-t-xl sm:rounded-t-2xl items-center">
                                        <img
                                            src={post.imageSrc}
                                            alt={post.title}
                                            width={64}
                                            height={64}
                                            className="w-full md:-mt-8 h-56 sm:h-48 md:h-48 object-contain"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 flex flex-col h-full">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-3">
                                            {post.description}
                                        </p>
                                        <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                            {post.readTime}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogShowcase; 