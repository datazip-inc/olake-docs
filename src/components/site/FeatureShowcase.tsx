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
        <div className={`${bgColor} rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col h-full`}>
            <div className="mb-4 sm:mb-6 flex-shrink-0">
                {illustration}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {title}
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm md:text-base">
                {description}
            </p>
        </div>
    );
};

const FeatureShowcase: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <div className="text-blue-600 font-medium mb-2 sm:mb-3">Why OLake?</div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            We know how to stand out
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        <FeatureCard
                            title="Faster Parallel & Full Load"
                            description="Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel."
                            illustration={
                                <div className="h-24 sm:h-28 md:h-32 w-full flex items-center justify-center">
                                    <img
                                        src="/img/site/why-olake-1.svg"
                                        alt="Faster Parallel & Full Load"
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                            }
                            bgColor="bg-blue-100 dark:bg-blue-900/20"
                        />

                        <FeatureCard
                            title="Stay updated with ingestion logs"
                            description="Instead of directly transforming data from Databases during extraction, we first pull it in its native format (BSON, MongoDB's native data format, which stores JSON-like documents more efficiently). Once we have the data, we decode it on the ETL side"
                            illustration={
                                <div className="h-24 sm:h-28 md:h-32 w-full flex items-center justify-center">
                                    <img
                                        src="/img/site/why-olake-2.svg"
                                        alt="Stay updated with ingestion logs"
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                            }
                            bgColor="bg-indigo-100 dark:bg-indigo-900/20"
                        />

                        <FeatureCard
                            title="CDC Cursor Preservation"
                            description="When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication."
                            illustration={
                                <div className="h-24 sm:h-28 md:h-32 w-full flex items-center justify-center">
                                    <img
                                        src="/img/site/why-olake-3.svg"
                                        alt="CDC Cursor Preservation"
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                            }
                            bgColor="bg-indigo-100 dark:bg-indigo-900/20"
                        />

                        <FeatureCard
                            title="Fast & Stable Connectors"
                            description="Using Databases change stream logs (binglogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronization and ensures that data is consistently updated with near real-time updates."
                            illustration={
                                <div className="h-24 sm:h-28 md:h-32 w-full flex items-center justify-center">
                                    <img
                                        src="/img/site/why-olake-4.svg"
                                        alt="Fast & Stable Connectors"
                                        className="h-full w-auto max-w-full object-contain"
                                    />
                                </div>
                            }
                            bgColor="bg-blue-100 dark:bg-blue-900/20"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureShowcase; 