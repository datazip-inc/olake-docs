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
    ];

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Main section with heading on right, featured post on left */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-12">
                        {/* Featured Blog Post - Left side on desktop */}
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <a href={`https://olake.io/blog/${blogPosts[0].id}`} className="block h-full">
                                <div className="rounded-2xl shadow-lg overflow-hidden h-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-center items-center">
                                            <img
                                                src={blogPosts[0].imageSrc}
                                                alt={blogPosts[0].title}
                                                width={80}
                                                height={80}
                                                className="w-full h-64 object-contain"
                                            />
                                        </div>
                                        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 flex flex-col justify-center">
                                            <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-4">
                                                {blogPosts[0].title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                                {blogPosts[0].description}
                                            </p>
                                            <div className="text-gray-500 dark:text-gray-400 text-sm mt-auto">
                                                {blogPosts[0].readTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Heading section - Right side on desktop */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center order-1 lg:order-2">
                            <div className="text-blue-600 font-medium mb-3">Blogs</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                                Stay ahead,<br />
                                with our latest reads
                            </h2>
                            <a
                                href="/blog"
                                className="flex items-center text-blue-600 font-medium w-fit"
                            >
                                View all Blogs
                                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Other Blog Posts in a row */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 rounded-2xl gap-6 md:gap-8">
                        {blogPosts.slice(1).map((post) => (
                            <a key={post.id} href={`https://olake.io/blog/${post.id}`} className="block h-full">
                                <div className="rounded-2xl shadow-lg overflow-hidden h-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex justify-center rounded-2xl items-center">
                                        <img
                                            src={post.imageSrc}
                                            alt={post.title}
                                            width={64}
                                            height={64}
                                            className="w-full h-48 object-contain"
                                        />
                                    </div>
                                    <div className="p-6 bg-white dark:bg-gray-800 flex flex-col h-full">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                            {post.description}
                                        </p>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm mt-auto">
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