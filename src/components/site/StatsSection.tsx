import React from 'react';
import Link from '@docusaurus/Link';

interface StatItemProps {
    value: string;
    label: string;
    isLast?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, isLast = false }) => (
    <div className={`flex flex-col items-center md:items-start text-center md:text-left py-6 px-4 md:px-6 ${!isLast ? 'border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700' : ''}`}>
        <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">{value}</div>
        <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">{label}</div>
    </div>
);

interface StatsSectionProps {
    title?: string;
    linkText?: string;
    linkUrl?: string;
    stats?: Array<{ value: string; label: string }>;
}

const StatsSection: React.FC<StatsSectionProps> = ({
    title = 'Get the OLake Advantage',
    linkText = 'View all Performance Benchmarks',
    linkUrl = '/benchmarks',
    stats = [
        { value: '3X', label: 'Faster' },
        { value: '70%', label: 'Savings' },
        { value: '3x', label: 'Less CPU' },
    ],
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
                    {title}
                </h2>
                <Link
                    to={linkUrl}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                    {linkText}
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between border-t md:border-b border-gray-300 dark:border-gray-700">
                {stats.map((stat, index) => (
                    <StatItem
                        key={index}
                        value={stat.value}
                        label={stat.label}
                        isLast={index === stats.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default StatsSection; 