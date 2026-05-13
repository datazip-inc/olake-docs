import React from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const FusionBlogCTA = () => {
  return (
    <div className="bg-white dark:bg-black/70 rounded-2xl p-8 max-w-3xl w-full shadow-lg text-center transition-colors">
      <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        OLake Fusion
      </h2>
      <p className="text-lg font-light text-gray-700 dark:text-gray-300 mb-8">
        Open-source lakehouse maintenance for Apache Iceberg tables. 50% cheaper (2x faster) compaction than Vanilla Spark.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <a
          href="https://getolake.slack.com/ssb/redirect"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-lg font-medium text-white bg-black dark:bg-white dark:text-black rounded-full px-6 py-3 transition transform hover:-translate-y-1 hover:opacity-90 min-w-[150px]"
        >
          <FaExternalLinkAlt className="mr-2 text-white dark:text-black" />
          <span className='text-white text-xs dark:text-black'>Slack</span>
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
          href="https://github.com/datazip-inc/olake-fusion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-lg font-medium text-white bg-black dark:bg-white dark:text-black rounded-full px-6 py-3 transition transform hover:-translate-y-1 hover:opacity-90 min-w-[150px]"
        >
          <FaGithub className="mr-2 text-white dark:text-black" />
          <span className='text-white text-xs dark:text-black'>Explore OLake Fusion GitHub</span>
        </a>
      </div>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Contact us at <strong>hello@olake.io</strong>
      </div>
    </div>
  );
};

export default FusionBlogCTA;
