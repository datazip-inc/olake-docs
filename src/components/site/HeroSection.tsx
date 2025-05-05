import React from 'react';

import Link from '@docusaurus/Link';
import OLakeDashboard from './OLakeDashboard';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    showIcebergBadge?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title = 'Fastest way to replicate your data from',
    subtitle = 'Data Warehouse→Data Lakes',
    showIcebergBadge = true,
}) => {


    return (
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
                {showIcebergBadge && (
                    <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 mb-6">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Now Supporting</span>
                        <span className="flex items-center ml-2">
                            <img src="/img/iceberg-logo.svg" alt="Iceberg" className="h-5 w-5 mr-1" />
                            <span className="text-sm font-bold uppercase text-gray-800 dark:text-gray-200">ICEBERG</span>
                        </span>
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                </h1>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                    <span className="text-gray-800 dark:text-gray-200">Data</span>
                    <span className="text-blue-600"> Warehouse</span>
                    <span className="text-blue-600">→</span>
                    <span className="text-blue-600">Data Lakes</span>
                </h2>

                <div className="flex flex-wrap gap-4 mt-8">
                    <Link
                        to="#talk-to-us"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                    >
                        Talk to us
                    </Link>
                    <Link
                        to="https://github.com/olakeio/olake"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                        </svg>
                        Live on Github. Contribute
                    </Link>
                </div>
            </div>

            <div className="w-full lg:w-2/5">
                <div className="relative">
                    <OLakeDashboard />
                </div>
            </div>
        </div>
    );
};

export default HeroSection; 