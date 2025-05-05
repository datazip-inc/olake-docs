import React from 'react';

const SetupStepsSection: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                    {/* Left Side - Steps */}
                    <div>
                        <div className="text-blue-600 font-medium mb-3">The Olake Experience</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-16">
                            Fast & Efficient<br />
                            That is Olake
                        </h2>

                        <div className="flex flex-col space-y-10">
                            {/* Step 1 */}
                            <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700 mt-1"></div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Step I</div>
                                    <div className="font-bold text-2xl text-gray-900 dark:text-white">Source</div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                    <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700 mt-1"></div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Step II</div>
                                    <div className="font-bold text-2xl text-gray-900 dark:text-white">Destination</div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                    <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700 mt-1"></div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Step III</div>
                                    <div className="font-bold text-2xl text-gray-900 dark:text-white">Schema</div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Step IV</div>
                                    <div className="font-bold text-2xl text-gray-900 dark:text-white">Job Config</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg">
                        <div className="flex items-center mb-8">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M9 9h6M9 12h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-lg font-semibold">Capture information</span>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm mb-2">Connector</label>
                            <div className="relative">
                                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white">
                                        M
                                    </div>
                                    <span>Mongo DB</span>
                                    <svg className="ml-auto w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm mb-2">Name of your source</label>
                            <input
                                type="text"
                                placeholder="Source Name"
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            />
                        </div>

                        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center">
                            Connect Source
                            <div className="relative ml-2 w-4 h-4">
                                <div className="absolute w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SetupStepsSection; 