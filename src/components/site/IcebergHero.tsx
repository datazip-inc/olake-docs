import React from 'react';

interface IcebergBadgeProps {
    text?: string;
}

const IcebergBadge: React.FC<IcebergBadgeProps> = ({
    text = 'Exclusively for Apache Iceberg'
}) => {
    return (
        <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-md">
            <img src="/img/iceberg-icon.svg" alt="Iceberg" className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium text-gray-800">{text}</span>
        </div>
    );
};

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden h-full">
            <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6 flex justify-center items-center">
                    <img src={image} alt={title} className="h-32 md:h-40 w-auto object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                    {description}
                </p>
            </div>
        </div>
    );
};

const IcebergHero: React.FC = () => {
    // Background URL
    const bgUrl = '/img/iceberg-hero-bg.jpg';

    return (
        <section className="relative py-20 md:py-32 overflow-hidden rounded-t-3xl">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-blue-600/40 dark:bg-blue-900/70" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 md:mb-28">
                    <div className="mb-8">
                        <IcebergBadge />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        Built on Iceberg.
                        <br />
                        Born for Scale.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                    <FeatureCard
                        title="Schema evolution"
                        description="Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new columns, renaming fields, or changing data types."
                        image="/img/schema-evolution.svg"
                    />
                    <FeatureCard
                        title="Schema datatype changes"
                        description="Schema evolution allows you to safely change data types of your fields without data loss or downtime. Upgrade from smaller to larger types as your data needs evolve while maintaining backward compatibility."
                        image="/img/schema-datatype.svg"
                    />
                    <FeatureCard
                        title="Partitioning and partition evolution"
                        description="Schema evolution allows you to modify your partitioning strategy over time. Easily add, remove, or transform partition fields to optimize performance based on your evolving query patterns."
                        image="/img/partitioning.svg"
                    />
                </div>
            </div>
        </section>
    );
};

export default IcebergHero; 