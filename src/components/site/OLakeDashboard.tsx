import React from 'react';


const OLakeDashboard: React.FC = () => {


    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
                <div className="flex items-center">
                    <span className="h-6 w-6 bg-blue-600 rounded text-white flex items-center justify-center mr-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1.333c-3.667 0-6.667 3-6.667 6.667s3 6.667 6.667 6.667 6.667-3 6.667-6.667-3-6.667-6.667-6.667zm0 12c-2.933 0-5.333-2.4-5.333-5.333s2.4-5.333 5.333-5.333 5.333 2.4 5.333 5.333-2.4 5.333-5.333 5.333z" />
                            <path d="M8.667 4h-1.333v5.333l4.667 2.8.667-1.067-4-2.4v-4.666z" />
                        </svg>
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">OLake</span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center mb-2 md:mb-0">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gray-800 dark:text-gray-200">
                            <path d="M19 5h-7V3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H5V5h7v2h7v14z" fill="currentColor" />
                        </svg>
                        <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">Jobs</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">A list of all your jobs stacked at one</span>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-800 mb-4">
                    <div className="flex flex-wrap space-x-2 md:space-x-8">
                        <button className="pb-2 px-1 font-medium text-blue-600 border-b-2 border-blue-600">
                            Active jobs
                        </button>
                        <button className="pb-2 px-1 font-medium text-gray-600 dark:text-gray-400">
                            Inactive jobs
                        </button>
                        <button className="pb-2 px-1 font-medium text-gray-600 dark:text-gray-400">
                            S
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2"
                            placeholder="Search Jobs"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-3 md:px-6 py-3">Actions</th>
                                <th scope="col" className="px-3 md:px-6 py-3">Job Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                                <td className="px-3 md:px-6 py-4">...</td>
                                <td className="px-3 md:px-6 py-4">Table_name_1</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-900">
                                <td className="px-3 md:px-6 py-4">...</td>
                                <td className="px-3 md:px-6 py-4">Table_name_2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OLakeDashboard; 