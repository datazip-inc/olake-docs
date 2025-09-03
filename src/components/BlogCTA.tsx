import React from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const BlogCTA = () => {
  return (
    <div className="bg-white dark:bg-black/70 rounded-2xl p-8 max-w-3xl w-full shadow-lg text-center transition-colors">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        OLake
      </h1>
      <p className="text-lg font-light text-gray-700 dark:text-gray-300 mb-8">
        Achieve 5x speed data replication to Lakehouse format with OLake, our open source platform for efficient, quick and scalable big data ingestion for real-time analytics.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <a
          href="https://calendly.com/d/ckr6-g82-p9y/olake_discussion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-lg font-medium text-white bg-black dark:bg-white dark:text-black rounded-full px-6 py-3 transition transform hover:-translate-y-1 hover:opacity-90 min-w-[150px]"
        >
          <FaExternalLinkAlt className="mr-2 text-white dark:text-black" />
          <span className='text-white text-xs dark:text-black'>Schedule a meet</span>
        </a>

        <a
          href="https://olake.io/#olake-form-product"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-lg font-medium text-white bg-black dark:bg-white dark:text-black rounded-full px-6 py-3 transition transform hover:-translate-y-1 hover:opacity-90 min-w-[150px]"
        >
          <FaExternalLinkAlt className="mr-2 text-white dark:text-black" />
          <span className='text-white text-xs  dark:text-black'>Signup</span>
        </a>

        <a
          href="https://github.com/datazip-inc/olake"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-lg font-medium text-white bg-black dark:bg-white dark:text-black rounded-full px-6 py-3 transition transform hover:-translate-y-1 hover:opacity-90 min-w-[150px]"
        >
          <FaGithub className="mr-2 text-white dark:text-black" />

          <span className='text-white text-xs dark:text-black'>Explore OLake GitHub</span>
        </a>

      </div>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Contact us at <strong>hello@olake.io</strong>
      </div>
    </div>
  );
};


// https://olake.io/#olake-form-product)


export default BlogCTA;