import React from 'react';

interface BenchmarkRowProps {
    metric: string;
    olakeValue: React.ReactNode;
    airbyteValue: React.ReactNode;
    debeziumValue: React.ReactNode;
}

const BenchmarkRow: React.FC<BenchmarkRowProps> = ({
    metric,
    olakeValue,
    airbyteValue,
    debeziumValue,
}) => {
    return (
        <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700">
            <div className="p-5 md:p-6 font-medium text-gray-700 dark:text-gray-300">
                {metric}
            </div>
            <div className="p-5 md:p-6 bg-green-50/70 dark:bg-green-900/10 font-medium text-green-600 dark:text-green-400 text-center">
                {olakeValue}
            </div>
            <div className="p-5 md:p-6 text-gray-600 dark:text-gray-400 text-center">
                {airbyteValue}
            </div>
            <div className="p-5 md:p-6 text-gray-600 dark:text-gray-400 text-center">
                {debeziumValue}
            </div>
        </div>
    );
};

interface AdvantageRowProps {
    advantage: React.ReactNode;
    isVisible?: boolean;
}

const AdvantageRow: React.FC<AdvantageRowProps> = ({
    advantage,
    isVisible = true
}) => {
    if (!isVisible) {
        return <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-700"></div>;
    }

    return (
        <div className="p-5 md:p-6 font-bold text-blue-600 dark:text-blue-400 text-center border-b border-gray-200 dark:border-gray-700">
            {advantage}
        </div>
    );
};

const BenchmarkHeader: React.FC = () => {
    return (
        <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="p-5 md:p-6 font-medium text-gray-700 dark:text-gray-300">
                Metrics
            </div>
            <div className="p-5 md:p-6">
                <div className="bg-green-50/70 dark:bg-green-900/10 p-3 rounded-lg text-center">
                    <div className="font-semibold text-gray-800 dark:text-white">OLake</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6v12M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-gray-800 dark:text-white text-sm">Airbyte Open Source</span>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6v12M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-gray-800 dark:text-white text-sm">Debezium + Kafka Connect</span>
                </div>
            </div>
        </div>
    );
};

const AdvantageHeader: React.FC = () => {
    return (
        <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
            <div className="text-gray-800 dark:text-white">
                <div className="text-sm font-medium">The</div>
                <div className="font-semibold">OLake</div>
                <div className="text-sm font-medium">Advantage</div>
            </div>
        </div>
    );
};

const BenchmarkSection: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 md:mb-16">
                        <div className="text-blue-600 font-medium mb-3">Benchmarks</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                            Get the <span className="text-blue-600">best</span>
                            <br className="hidden md:block" />
                            <span className="md:ml-2">of OLake</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        {/* Main comparison table */}
                        <div className="w-full md:w-4/5 border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-r-none overflow-hidden shadow-sm">
                            <BenchmarkHeader />

                            <BenchmarkRow
                                metric="Initial Load Time"
                                olakeValue="3.2 Hours"
                                airbyteValue="10+ Hours"
                                debeziumValue="10+ Hours"
                            />

                            <BenchmarkRow
                                metric="CDC Latency"
                                olakeValue="<3 seconds"
                                airbyteValue="5-10 seconds"
                                debeziumValue="5-10 seconds"
                            />

                            <BenchmarkRow
                                metric="CPU Usage"
                                olakeValue="30%"
                                airbyteValue="90% +"
                                debeziumValue="90% +"
                            />

                            <BenchmarkRow
                                metric="Memory Usage"
                                olakeValue="1.5 GB"
                                airbyteValue="4GB +"
                                debeziumValue="4GB +"
                            />

                            <BenchmarkRow
                                metric="Infrastructure Cost"
                                olakeValue="$"
                                airbyteValue="$$$"
                                debeziumValue="$$$"
                            />
                        </div>

                        {/* Advantage column */}
                        <div className="w-full md:w-1/5 border border-gray-200 dark:border-gray-700 md:border-l-0 rounded-lg md:rounded-l-none overflow-hidden shadow-sm">
                            <AdvantageHeader />

                            <AdvantageRow advantage="3X Faster" />
                            <AdvantageRow advantage="Lowest Latency" />
                            <AdvantageRow advantage="3X less CPU" />
                            <AdvantageRow advantage="Lightweight" />
                            <AdvantageRow advantage="70% Savings" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenchmarkSection; 