import React from 'react'
import Link from '@docusaurus/Link'

// Query Engine Advertisement Component
function QueryEngineAdvertisement() {
  return (
    <div className="mx-auto max-w-8xl mb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 shadow-lg">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div> */}

        <div className="relative px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Content Section */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Query Engines Hub
              </div>

              {/* Main Heading */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Explore Iceberg
                <span className="block text-blue-600 dark:text-blue-400">Query Engines</span>
              </h3>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Discover comprehensive guides for Apache Spark, Trino, Flink, DuckDB, and more. 
                Compare features, capabilities, and find the perfect engine for your data workloads.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {[
                  'Feature Comparison Matrix',
                  'Performance Benchmarks',
                  'Configuration Examples',
                  'Best Practices & Tips'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="lg:col-span-4 space-y-4">
              {/* Engine Icons */}
              <div className="grid grid-cols-4 gap-2 mb-6 lg:mb-8">
                {['Spark', 'Trino', 'Flink', 'More'].map((engine, index) => (
                  <div key={index} className="aspect-square bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 p-2 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                      {engine}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main CTA Button */}
              <Link
                to="/iceberg/query-engine"
                className="group inline-flex w-full sm:w-auto lg:w-full items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <span>Explore Query Engines</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Secondary Link */}
              <Link
                to="/iceberg/query-engine"
                className="inline-flex w-full sm:w-auto lg:w-full items-center justify-center gap-2 px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Feature Matrix
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default QueryEngineAdvertisement