import React from "react";
import Section from "./Section";

const columns = [
    {
        label: "OLake Open Source",
        icon: (
            <span className="inline-block w-4 h-4 mr-1 align-middle">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            </span>
        ),
        highlight: true,
        sub: "Open Source",
    },
    {
        label: "Airbyte Open Source",
        icon: (
            <span className="inline-block w-4 h-4 mr-1 align-middle">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
            </span>
        ),
        highlight: false,
        sub: "",
    },
    {
        label: "Debezium + Kafka Connect",
        icon: (
            <span className="inline-block w-4 h-4 mr-1 align-middle">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            </span>
        ),
        highlight: false,
        sub: "",
    },
];

const rows = [
    {
        metric: "Initial Load Time",
        values: [
            <span className="text-green-600 font-semibold">3.2 Hours</span>,
            "10+ Hours",
            "10+ Hours",
        ],
    },
    {
        metric: "CDC Latency",
        values: [
            <span className="text-green-600 font-semibold">&lt;3 seconds</span>,
            "5-10 seconds",
            "5-10 seconds",
        ],
    },
    {
        metric: "CDC Latency",
        values: [
            <span className="text-green-600 font-semibold">30%</span>,
            "90% +",
            "90% +",
        ],
    },
    {
        metric: "CDC Latency",
        values: [
            <span className="text-green-600 font-semibold">1.5 GB</span>,
            "4GB +",
            "4GB +",
        ],
    },
    {
        metric: "Infrastructure Cost",
        values: [
            <span className="text-green-600 font-semibold">$</span>,
            "$$$",
            "$$$",
        ],
    },
];

const advantages = [
    { text: "3X Faster", color: "text-blue-600" },
    { text: "Lowest Latency", color: "text-blue-600" },
    { text: "3X less CPU", color: "text-blue-600" },
    { text: "Lightweight", color: "text-blue-600" },
    { text: "70% Savings", color: "text-blue-600" },
];

const BenchmarksSection: React.FC = () => {
    return (
        <Section className="relative py-20 bg-white overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
                {/* Table and Heading */}
                <div className="flex-1 min-w-[400px]">
                    <div className="mb-8">
                        <div className="text-blue-600 font-medium text-sm mb-2">Benchmarks</div>
                        <h2 className="text-4xl font-light text-gray-900 mb-2">
                            Get the <span className="font-bold text-blue-600">best</span><br />of OLake
                        </h2>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-4 px-4 font-semibold text-gray-500 text-base border-b border-gray-100 bg-white">Metrics</th>
                                    {columns.map((col, i) => (
                                        <th
                                            key={col.label}
                                            className={`py-4 px-4 font-semibold text-gray-700 text-base border-b border-gray-100 ${col.highlight ? "bg-green-50 border-l-2 border-green-300" : "bg-white"}`}
                                        >
                                            <div className="flex items-center">
                                                {col.icon}
                                                <span>{col.label}</span>
                                            </div>
                                            {col.sub && <div className="text-xs text-gray-400 font-normal mt-1">{col.sub}</div>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={row.metric} className="border-b border-gray-50 last:border-b-0">
                                        <td className="py-4 px-4 text-gray-700 font-medium whitespace-nowrap">{row.metric}</td>
                                        {row.values.map((val, j) => (
                                            <td
                                                key={j}
                                                className={`py-4 px-4 whitespace-nowrap ${columns[j].highlight ? "bg-green-50 border-l-2 border-green-300" : "bg-white"}`}
                                            >
                                                {val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Advantage List */}
                <div className="w-full md:w-72 flex flex-col items-center justify-start bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow p-8 mt-8 md:mt-0">
                    <div className="text-gray-700 font-semibold mb-6 text-lg text-center">The<br />OLake Advantage</div>
                    <ul className="space-y-4 w-full">
                        {advantages.map((adv, i) => (
                            <li key={i} className={`text-xl font-bold ${adv.color} text-right w-full`}>{adv.text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
};

export default BenchmarksSection; 