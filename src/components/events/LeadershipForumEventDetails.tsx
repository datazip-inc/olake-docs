// components/LeadershipForumEventDetails.jsx

import React from 'react';
import {
    FaCalendarAlt,
    FaUsers,
    FaLightbulb,
    FaHandshake,
    FaChartLine,
    FaRegCalendarAlt,
} from 'react-icons/fa';
import { MdOutlineEvent } from 'react-icons/md';
import CTAButton from '../webinars/CTAButton';

const LeadershipForumEventDetails = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8 rounded-lg max-w-4xl mx-auto ">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <MdOutlineEvent className="mx-auto mb-4 text-4xl text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">About the Leadership Forum</h1>
                {/* <p className="text-lg text-gray-700 dark:text-gray-300">
                    Join us for an intensive session bringing together senior data engineers and ML practitioners. We'll explore the intersection of modern data architecture and ML operations, focusing on building scalable platforms that serve both analytics and machine learning needs.
                </p> */}
            </div>

            {/* Event Highlights */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <FaChartLine className="mr-2 text-blue-600 dark:text-blue-400" />
                    Event Highlights
                </h2>
                <div className="space-y-6">
                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">11:00 - 11:15 AM | Welcome & Introduction</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Current state of data & ML platforms</li>
                                <li>Key challenges in serving both analytics and ML workloads</li>
                            </ul>
                        </div>
                    </div>

                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaLightbulb className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">11:15 AM - 12:00 PM | Keynote Session: Unified Data Platforms</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Data lakehouse architectures for ML workloads</li>
                                <li>Feature store implementation patterns</li>
                                <li>Bridging the gap between data engineering and ML pipelines</li>
                            </ul>
                        </div>
                    </div>

                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">12:00 - 12:45 PM | Expert Panel: Production Data & ML Systems</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>CDC and real-time feature engineering</li>
                                <li>ML model monitoring and data quality</li>
                                <li>Building reliable data pipelines for both BI and ML</li>
                                <li>Data versioning and experiment tracking</li>
                            </ul>
                        </div>
                    </div>

                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaHandshake className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">12:45 - 1:15 PM | Connect with Peers</h3>
                            <p>Enjoy refreshments while networking with like-minded professionals.</p>
                        </div>
                    </div>

                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">1:15 - 1:45 PM | Interactive Breakout Discussions</h3>
                            <p>Choose from focused sessions on:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Unified metrics layer implementation</li>
                                <li>MLOps pipeline automation</li>
                                <li>Data mesh and feature democratization</li>
                                <li>Performance optimization for ML workloads</li>
                            </ul>
                        </div>
                    </div>

                    {/* Highlight Item */}
                    <div className="flex">
                        <div className="mr-4 mt-1">
                            <FaChartLine className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">1:45 - 2:00 PM | Closing Session</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Emerging trends in data platforms and MLOps</li>
                                <li>Building collaborative data and ML teams</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who Should Attend */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FaUsers className="mr-2 text-blue-600 dark:text-blue-400" />
                    Who Should Attend
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Senior Data Engineers</li>
                    <li>ML Platform Engineers</li>
                    <li>Data Platform Architects</li>
                    <li>MLOps Engineers</li>
                    <li>Principal Engineers working on data/ML systems</li>
                </ul>
            </div>

            {/* Why Attend */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FaLightbulb className="mr-2 text-blue-600 dark:text-blue-400" />
                    Why Attend
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Learn how leading companies build unified data and ML platforms</li>
                    <li>Discover patterns for scaling ML in production</li>
                    <li>Network with practitioners solving similar challenges</li>
                    <li>Stay ahead of data platform evolution</li>
                </ul>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center items-center p-10 bg-gray-100 dark:bg-gray-800">
                <CTAButton
                    title=""
                    buttonText="Registrations Over"
                    icon={FaRegCalendarAlt}
                    href="https://lu.ma/z80xycc7"
                    variant="primary"
                />
            </div>
        </div>
    );
};

export default LeadershipForumEventDetails;
