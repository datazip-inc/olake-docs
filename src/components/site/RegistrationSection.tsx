import React from 'react';

const RegistrationSection: React.FC = () => {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background image placeholder - this will be replaced later */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-900 z-0">
                {/* Placeholder for the actual image that will be added later */}
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left side - Registration Form Card (will be replaced with HubSpot embed) */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-10">
                            <div className="mb-8">
                                <h3 className="text-blue-600 font-bold text-xl mb-2">OLake</h3>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Register for Pilot Program
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Set up your account to get started
                                </p>
                            </div>

                            {/* Form placeholder - will be replaced with HubSpot embed */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email ID</label>
                                    <input
                                        type="email"
                                        placeholder="Email ID"
                                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                    <div className="text-xs text-right mt-1 text-gray-500">0 / 20</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    />
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                    Talk to us
                                </button>
                            </div>

                            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                                OLake makes data replication faster by parallelising full loads, leveraging change
                                streams for real-time sync, and pulling data in a lake house
                            </div>
                        </div>

                        {/* Right side - Feature Text */}
                        <div className="text-white">
                            <div className="mb-2">
                                <h3 className="text-2xl font-medium mb-3">OLake</h3>
                                <h2 className="text-4xl md:text-6xl font-bold mb-10">
                                    Interested?<br />
                                    Register Now.
                                </h2>
                            </div>

                            <div className="space-y-10">
                                {/* Feature 1 */}
                                <div>
                                    <div className="flex items-center mb-3">
                                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 7L12 3L4 7L12 11L20 7ZM20 7V17L12 21L4 17V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="text-xl md:text-2xl font-semibold">Iceberg Native</h3>
                                    </div>
                                    <p className="text-gray-100">
                                        Instead of directly transforming data from Databases during extraction,
                                        we first pull it in its native format.
                                    </p>
                                </div>

                                {/* Feature 2 */}
                                <div>
                                    <div className="flex items-center mb-3">
                                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <h3 className="text-xl md:text-2xl font-semibold">Faster & More Efficient</h3>
                                    </div>
                                    <p className="text-gray-100">
                                        Instead of directly transforming data from Databases during extraction,
                                        we first pull it in its native format.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationSection; 