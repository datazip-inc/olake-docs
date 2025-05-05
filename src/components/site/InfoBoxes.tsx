import React from 'react';

interface SourcesBoxProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

const SourcesBox: React.FC<SourcesBoxProps> = ({
    title = 'Sources',
    description = 'Access databases, files, web pages, or even real-time data streams',
    icon
}) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                120+ Fast & Secure Connectors
            </h3>
            <div className="mt-8 mb-6">
                <img src="/img/sources-icons.svg" alt="Database sources" className="w-64 h-auto" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                {description}
            </p>
        </div>
    );
};

interface OLakeBoxProps {
    title?: string;
    subtitle?: string;
}

const OLakeBox: React.FC<OLakeBoxProps> = ({
    title = 'OLake',
    subtitle = 'Managed Lakehouse'
}) => {
    return (
        <div className="bg-gradient-to-b from-blue-100/80 to-blue-400/30 dark:from-blue-900/20 dark:to-blue-800/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
                {subtitle}
            </p>
        </div>
    );
};

interface DestinationBoxProps {
    title?: string;
    items?: Array<{ name: string; logo: string }>;
}

const DestinationBox: React.FC<DestinationBoxProps> = ({
    title = 'Destinations',
    items = [
        { name: 'AWS Glue', logo: '/img/aws-glue.svg' },
        { name: 'Hive', logo: '/img/hive.svg' },
        { name: 'Rest Catalog', logo: '/img/rest-catalog.svg' },
        { name: 'JDBC', logo: '/img/jdbc.svg' }
    ]
}) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <div className="flex items-center">
                    <img src="/img/iceberg-icon.svg" alt="Iceberg" className="w-5 h-5 mr-2" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Iceberg Catalogs</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
                        <img src={item.logo} alt={item.name} className="w-10 h-10 mb-2" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface QueryEnginesBoxProps {
    title?: string;
    engines?: Array<{ name: string; logo: string }>;
    moreText?: string;
}

const QueryEnginesBox: React.FC<QueryEnginesBoxProps> = ({
    title = 'Query Engines',
    engines = [
        { name: 'Spark', logo: '/img/spark.svg' },
        { name: 'AWS Athena', logo: '/img/aws-athena.svg' },
        { name: 'Trino', logo: '/img/trino.svg' },
        { name: 'Duck DB', logo: '/img/duckdb.svg' }
    ],
    moreText = 'And many more'
}) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {engines.map((engine, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
                        <img src={engine.logo} alt={engine.name} className="w-10 h-10 mb-2" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{engine.name}</span>
                    </div>
                ))}
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                {moreText}
            </p>
        </div>
    );
};

const InfoBoxes: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <SourcesBox />
            <OLakeBox />
            <DestinationBox />
            <QueryEnginesBox />
        </div>
    );
};

export default InfoBoxes; 