import React from 'react';

const FeatureCard = ({
    title,
    description,
    illustration,
    bgColor
}: {
    title: string;
    description: string;
    illustration: React.ReactNode;
    bgColor: string;
}) => {
    return (
        <div className={`${bgColor} rounded-2xl p-8 md:p-10 flex flex-col h-full`}>
            <div className="mb-6 flex-shrink-0">
                {illustration}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base">
                {description}
            </p>
        </div>
    );
};

const DataLakeIllustration = () => (
    <div className="relative h-32 w-full">
        <div className="absolute top-4 left-6">
            <div className="bg-white dark:bg-gray-800 py-1 px-3 rounded-full inline-flex items-center shadow-sm">
                <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z" stroke="currentColor" fill="currentColor" />
                    <path d="M4 13a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3z" stroke="currentColor" fill="currentColor" opacity="0.7" />
                </svg>
                <span className="text-xs font-medium">Schema</span>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-2 absolute left-4 top-16">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className={`w-8 h-8 rounded ${[1, 2, 6, 7, 8, 11].includes(i)
                            ? 'bg-blue-200 dark:bg-blue-800/50'
                            : 'bg-blue-400 dark:bg-blue-600'
                        }`}
                />
            ))}
        </div>

        <div className="absolute bottom-0 right-4 bg-white dark:bg-gray-800 py-1 px-3 rounded-full text-xs shadow-sm">
            Connecting Data Lake
        </div>
    </div>
);

const LogsIllustration = () => (
    <div className="h-32 flex flex-col space-y-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">26/02/2025 · 00:07:23</div>
            <div className="text-sm font-medium">Ingestion Logs</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center">
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded mr-2">Error</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">An error has occurred...</span>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="flex items-center">
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs rounded mr-2">Warning</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">An error has occurred...</span>
            </div>
        </div>
    </div>
);

const CDCIllustration = () => (
    <div className="h-32 flex flex-col justify-center">
        <div className="relative">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-indigo-300 dark:bg-indigo-600 rounded my-2 mr-12"
                    style={{
                        opacity: 0.6 + (i * 0.1),
                        width: `${65 + (i * 5)}%`
                    }} />
            ))}

            <div className="absolute top-4 right-0 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[180px]">
                <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 9h6M9 12h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-semibold">Capture information</span>
                </div>

                <div className="flex space-x-3 mb-2">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-600 mr-1 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-xs">Set up a new source</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ConnectorsIllustration = () => (
    <div className="h-32 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 mb-3">
            <div className="text-xs font-semibold mb-2">Capture information</div>
            <div className="text-xs mb-1">Connector:</div>

            <div className="flex items-center p-1 border border-gray-200 dark:border-gray-700 rounded">
                <div className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">
                    M
                </div>
                <span className="text-xs">Mongo DB</span>
                <svg className="ml-auto w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>

            <div className="mt-3">
                <div className="text-xs mb-1">Name of your source:</div>
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded px-3 flex items-center">
                    <span className="text-xs text-gray-400">Source Name...</span>
                </div>
            </div>
        </div>
    </div>
);

const FeatureShowcase: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="text-blue-600 font-medium mb-3">Why OLake?</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            We know how to stand out
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <FeatureCard
                            title="Faster Parallel & Full Load"
                            description="Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel."
                            illustration={<DataLakeIllustration />}
                            bgColor="bg-blue-100 dark:bg-blue-900/20"
                        />

                        <FeatureCard
                            title="Stay updated with ingestion logs"
                            description="Instead of directly transforming data from Databases during extraction, we first pull it in its native format (BSON, MongoDB's native data format, which stores JSON-like documents more efficiently). Once we have the data, we decode it on the ETL side"
                            illustration={<LogsIllustration />}
                            bgColor="bg-indigo-100 dark:bg-indigo-900/20"
                        />

                        <FeatureCard
                            title="CDC Cursor Preservation"
                            description="When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication."
                            illustration={<CDCIllustration />}
                            bgColor="bg-indigo-100 dark:bg-indigo-900/20"
                        />

                        <FeatureCard
                            title="Fast & Stable Connectors"
                            description="Using Databases change stream logs (binglogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronization and ensures that data is consistently updated with near real-time updates."
                            illustration={<ConnectorsIllustration />}
                            bgColor="bg-blue-100 dark:bg-blue-900/20"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureShowcase; 