import React from 'react';

// Blog data structure
interface BlogPost {
    id: string;
    title: string;
    description: string;
    readTime: string;
    bgColor: string;
    icon: React.ReactNode;
}

const BlogShowcase: React.FC = () => {
    // Sample blog data
    const blogPosts: BlogPost[] = [
        {
            id: 'debezium-kafka',
            title: 'Common Challenges Using Debezium and Kafka Connect for CDC',
            description: 'Uncover the key challenges of extracting, transforming, and loading data from MongoDB into a data lakehouse. Learn be...',
            readTime: '14 Min Read',
            bgColor: 'bg-blue-50 dark:bg-blue-900/10',
            icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 16C33.1 16 34 16.9 34 18C34 19.1 33.1 20 32 20C30.9 20 30 19.1 30 18C30 16.9 30.9 16 32 16Z" fill="#2563EB" />
                    <path d="M32 30C33.1 30 34 30.9 34 32C34 33.1 33.1 34 32 34C30.9 34 30 33.1 30 32C30 30.9 30.9 30 32 30Z" fill="#2563EB" />
                    <path d="M32 44C33.1 44 34 44.9 34 46C34 47.1 33.1 48 32 48C30.9 48 30 47.1 30 46C30 44.9 30.9 44 32 44Z" fill="#2563EB" />
                    <path d="M46 30C47.1 30 48 30.9 48 32C48 33.1 47.1 34 46 34C44.9 34 44 33.1 44 32C44 30.9 44.9 30 46 30Z" fill="#2563EB" />
                    <path d="M18 30C19.1 30 20 30.9 20 32C20 33.1 19.1 34 18 34C16.9 34 16 33.1 16 32C16 30.9 16.9 30 18 30Z" fill="#2563EB" />
                    <path d="M39 23C40.1 23 41 23.9 41 25C41 26.1 40.1 27 39 27C37.9 27 37 26.1 37 25C37 23.9 37.9 23 39 23Z" fill="#2563EB" />
                    <path d="M25 39C26.1 39 27 39.9 27 41C27 42.1 26.1 43 25 43C23.9 43 23 42.1 23 41C23 39.9 23.9 39 25 39Z" fill="#2563EB" />
                    <path d="M32 34V30M32 20V16M32 48V44M46 34H44M18 30H20M39 27L37 25M25 39L23 41" stroke="#2563EB" strokeWidth="2" />
                    <path d="M32 34V48M32 16V30M18 34H46M25 43L39 23" stroke="#2563EB" strokeWidth="2" />
                </svg>
            )
        },
        {
            id: 'mongodb-etl',
            title: 'Four Critical MongoDB ETL Challenges and Ho...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '14 Min Read',
            bgColor: 'bg-sky-50 dark:bg-sky-900/10',
            icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 22L32 12L42 22L32 32L22 22Z" stroke="#3B82F6" strokeWidth="2" />
                    <path d="M12 32L22 22L32 32L22 42L12 32Z" stroke="#3B82F6" strokeWidth="2" />
                    <path d="M32 32L42 22L52 32L42 42L32 32Z" stroke="#3B82F6" strokeWidth="2" />
                    <path d="M22 42L32 32L42 42L32 52L22 42Z" stroke="#3B82F6" strokeWidth="2" />
                </svg>
            )
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting Common Issues and Solutions to Mo...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '08 Min Read',
            bgColor: 'bg-green-50 dark:bg-green-900/10',
            icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 12C33.6569 12 35 13.3431 35 15V40C35 41.6569 33.6569 43 32 43C30.3431 43 29 41.6569 29 40V15C29 13.3431 30.3431 12 32 12Z" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="2" />
                    <path d="M32 43V52" stroke="#22C55E" strokeWidth="2" />
                    <path d="M24 24H40" stroke="#22C55E" strokeWidth="2" />
                    <path d="M20 32H44" stroke="#22C55E" strokeWidth="2" />
                </svg>
            )
        },
        {
            id: 'debezium-problems',
            title: 'Problems with Debezium and How we (OLake, Open...',
            description: 'Uncover the key challenges of extracting, transforming, and loading data fr...',
            readTime: '18 Min Read',
            bgColor: 'bg-gray-50 dark:bg-gray-800/20',
            icon: (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="12" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="27" y="12" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="42" y="12" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="12" y="27" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="27" y="27" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="42" y="27" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="12" y="42" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="27" y="42" width="10" height="10" rx="2" fill="#111827" />
                    <rect x="42" y="42" width="10" height="10" rx="2" fill="#111827" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <div className="text-blue-600 font-medium mb-3">Blogs</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                Stay ahead,<br />
                                with our latest reads
                            </h2>
                        </div>
                        <a
                            href="/blog"
                            className="flex items-center text-blue-600 font-medium mt-6 md:mt-0"
                        >
                            View all Blogs
                            <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    {/* Featured Blog Post */}
                    <div className="mb-8">
                        <div className="rounded-2xl shadow-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-8 flex justify-center items-center md:w-1/3">
                                    {blogPosts[0].icon}
                                </div>
                                <div className="p-8 bg-white dark:bg-gray-800 md:w-2/3">
                                    <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-4">
                                        {blogPosts[0].title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        {blogPosts[0].description}
                                    </p>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                                        {blogPosts[0].readTime}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other Blog Posts */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.slice(1).map((post) => (
                            <div key={post.id} className="rounded-2xl shadow-lg overflow-hidden">
                                <div className={`${post.bgColor} p-6 flex justify-center items-center aspect-[2/1]`}>
                                    {post.icon}
                                </div>
                                <div className="p-6 bg-white dark:bg-gray-800">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                        {post.description}
                                    </p>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                                        {post.readTime}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogShowcase; 