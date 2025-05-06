import React, { useState } from 'react'
import { TOOLS } from '../../data/benchmarkData'

interface BenchmarkData {
    metric: string
    olake: string
    airbyte: string
    fivetran: string
    debezium: string
    estuary: string
}

interface MobileBenchmarkCardsProps {
    data: BenchmarkData[]
    isFullLoad: boolean
}

// UI Option 1: Accordion-style expandable metrics
const AccordionView: React.FC<{ data: BenchmarkData[] }> = ({ data }) => {
    const [expandedMetric, setExpandedMetric] = useState<string | null>(data[0]?.metric || null);

    return (
        <div className="space-y-3">
            {data.map((row) => (
                <div
                    key={row.metric}
                    className="overflow-hidden rounded-xl shadow-sm"
                >
                    <button
                        className={`flex w-full items-center justify-between border-0 px-4 py-3 text-left font-medium transition-all ${expandedMetric === row.metric
                            ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700/80'
                            }`}
                        onClick={() => setExpandedMetric(expandedMetric === row.metric ? null : row.metric)}
                    >
                        <span className="text-sm font-medium">{row.metric}</span>
                        <svg
                            className={`h-5 w-5 transform transition-transform duration-200 ${expandedMetric === row.metric ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {expandedMetric === row.metric && (
                        <div className="bg-white px-4 py-3 dark:bg-gray-800">
                            <div className="overflow-hidden rounded-lg border-0 shadow-sm">
                                <div className="bg-green-50/70 p-3 dark:bg-green-900/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{TOOLS.olake.name}</span>
                                            <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">{TOOLS.olake.description}</span>
                                        </div>
                                        <div className="font-medium text-green-600 dark:text-green-400">{row.olake}</div>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{TOOLS.airbyte.name}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.airbyte}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{TOOLS.fivetran.name}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.fivetran}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{TOOLS.debezium.name}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.debezium}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{TOOLS.estuary.name}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.estuary}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// UI Option 2: Simplified responsive table
const ResponsiveTableView: React.FC<{ data: BenchmarkData[] }> = ({ data }) => {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
            {data.map((row, idx) => (
                <div key={row.metric} className={idx !== 0 ? "border-t border-gray-200 dark:border-gray-700" : ""}>
                    <div className="bg-gray-50 px-4 py-2.5 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {row.metric}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 p-2">
                        <div className="rounded-lg bg-green-50/70 p-2.5 dark:bg-green-900/20">
                            <div className="mb-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                {TOOLS.olake.name}
                            </div>
                            <div className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                                {row.olake}
                            </div>
                        </div>

                        <div className="space-y-2 py-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{TOOLS.airbyte.name}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{row.airbyte}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{TOOLS.fivetran.name}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{row.fivetran}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{TOOLS.debezium.name}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{row.debezium}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{TOOLS.estuary.name}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{row.estuary}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// UI Option 3: Feature comparison view
const FeatureComparisonView: React.FC<{ data: BenchmarkData[] }> = ({ data }) => {
    const [selectedCompetitor, setSelectedCompetitor] = useState<'airbyte' | 'fivetran' | 'debezium' | 'estuary'>('airbyte');

    const getCompetitorValue = (row: BenchmarkData) => {
        switch (selectedCompetitor) {
            case 'airbyte': return row.airbyte;
            case 'fivetran': return row.fivetran;
            case 'debezium': return row.debezium;
            case 'estuary': return row.estuary;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                {(Object.keys(TOOLS) as Array<keyof typeof TOOLS>)
                    .filter(key => key !== 'olake')
                    .map(key => (
                        <button
                            key={key}
                            className={`rounded-xl border-0 px-3 py-1.5 text-xs font-medium transition-all ${selectedCompetitor === key
                                ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                }`}
                            onClick={() => setSelectedCompetitor(key as any)}
                        >
                            {TOOLS[key].name}
                        </button>
                    ))
                }
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <div>Metric</div>
                    <div>{TOOLS.olake.name}</div>
                    <div>{TOOLS[selectedCompetitor].name}</div>
                </div>
                <div>
                    {data.map((row, idx) => (
                        <div
                            key={row.metric}
                            className={`grid grid-cols-3 gap-4 px-4 py-3 ${idx !== data.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                                }`}
                        >
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.metric}</div>
                            <div className="text-sm font-medium text-green-600 dark:text-green-400">{row.olake}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{getCompetitorValue(row)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MobileBenchmarkCards: React.FC<MobileBenchmarkCardsProps> = ({ data, isFullLoad }) => {
    const [viewType, setViewType] = useState<'accordion' | 'table' | 'comparison'>('table');

    if (!data || data.length === 0) {
        return <div className="mt-4 text-center text-gray-500 dark:text-gray-400">No benchmark data available.</div>
    }

    return (
        <div className="mt-5 space-y-5">
            {/* View Switcher Tabs */}
            <div className="flex justify-center">
                <div className="inline-flex gap-2 overflow-hidden rounded-lg">
                    <button
                        className={`rounded-xl border-0 px-6 py-2.5 text-sm font-medium transition-all ${viewType === 'table'
                            ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        onClick={() => setViewType('table')}
                    >
                        Table
                    </button>
                    <button
                        className={`rounded-xl border-0 px-6 py-2.5 text-sm font-medium transition-all ${viewType === 'accordion'
                            ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        onClick={() => setViewType('accordion')}
                    >
                        Dropdown
                    </button>
                    <button
                        className={`rounded-xl border-0 px-6 py-2.5 text-sm font-medium transition-all ${viewType === 'comparison'
                            ? 'bg-[#E8EBFD] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        onClick={() => setViewType('comparison')}
                    >
                        Compare
                    </button>
                </div>
            </div>

            {/* View Content */}
            <div>
                {viewType === 'accordion' && <AccordionView data={data} />}
                {viewType === 'table' && <ResponsiveTableView data={data} />}
                {viewType === 'comparison' && <FeatureComparisonView data={data} />}
            </div>
        </div>
    )
}

export default MobileBenchmarkCards 