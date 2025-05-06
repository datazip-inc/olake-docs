import React, { useState } from 'react';

const SetupStepsSection: React.FC = () => {
    const [selectedConnector, setSelectedConnector] = useState('mongodb');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const connectors = [
        { id: 'mongodb', name: 'MongoDB', color: 'bg-gray-100', icon: '/img/site/mongodb.svg' },
        { id: 'postgres', name: 'PostgreSQL', color: 'bg-gray-100', icon: '/img/site/postgres.svg' },
        { id: 'mysql', name: 'MySQL', color: 'bg-gray-100', icon: '/img/site/mysql.svg' }
    ];

    const getConnectorUrl = () => {
        return `https://olake.io/docs/connectors/${selectedConnector}/overview`;
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleConnectorSelect = (connectorId: string) => {
        setSelectedConnector(connectorId);
        setDropdownOpen(false);
    };

    const getSelectedConnector = () => {
        return connectors.find(connector => connector.id === selectedConnector);
    };

    return (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                    {/* Left Side - Steps */}
                    <div>
            <div className='mb-3 text-xl font-semibold tracking-widest text-[#203FDD]'>
              The OLake Experience
            </div>
            <h2 className='mb-16 text-4xl font-bold tracking-wider text-gray-900 dark:text-white md:text-5xl'>
              Fast & Efficient
              <br />
              That is OLake
            </h2>

            <div className='flex flex-col'>
              {/* Step 1 */}
              <div className='flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#203FDD]'>
                    <div className='h-4 w-4 rounded-full bg-white'></div>
                  </div>
                  <div className='h-16 w-0.5 bg-gray-300'></div>
                </div>
                <div className='pb-10'>
                  <div className='mb-1 text-sm text-gray-500'>Step I</div>
                  <div className='text-2xl font-bold text-gray-900'>Source</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-gray-300'></div>
                  </div>
                  <div className='h-16 w-0.5 bg-gray-300'></div>
                </div>
                <div className='pb-10'>
                  <div className='mb-1 text-sm text-gray-500'>Step II</div>
                  <div className='text-2xl font-bold text-gray-900'>Destination</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-gray-300'></div>
                  </div>
                  <div className='h-16 w-0.5 bg-gray-300'></div>
                </div>
                <div className='pb-10'>
                  <div className='mb-1 text-sm text-gray-500'>Step III</div>
                  <div className='text-2xl font-bold text-gray-900'>Schema</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-gray-300'></div>
                  </div>
                </div>
                <div>
                  <div className='mb-1 text-sm text-gray-500'>Step IV</div>
                  <div className='text-2xl font-bold text-gray-900'>Job Config</div>
                </div>
              </div>
            </div>
          </div>








                    {/* Right Side - Form */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg">
                        <div className="flex items-center mb-6 sm:mb-8">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M9 9h6M9 12h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-base sm:text-lg font-semibold">Capture information</span>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">Connector</label>
                            <div className="relative">
                                <div
                                    className="flex items-center p-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors group"
                                    onClick={toggleDropdown}
                                    aria-haspopup="listbox"
                                    aria-expanded={dropdownOpen}
                                    role="button"
                                >
                                    <div className={`w-7 h-7 rounded-md overflow-hidden mr-3 flex items-center justify-center text-white ${getSelectedConnector()?.color}`}>
                                        <img src={getSelectedConnector()?.icon} alt={getSelectedConnector()?.name} className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm">{getSelectedConnector()?.name}</span>
                                    <svg
                                        className={`ml-auto w-4 h-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300 ${dropdownOpen ? 'transform rotate-180' : ''}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {dropdownOpen && (
                                    <div
                                        className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
                                        role="listbox"
                                    >
                                        {connectors.map((connector) => (
                                            <div
                                                key={connector.id}
                                                className="flex items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => handleConnectorSelect(connector.id)}
                                                role="option"
                                                aria-selected={selectedConnector === connector.id}
                                            >
                                                <div className={`w-7 h-7 rounded-md overflow-hidden mr-3 flex items-center justify-center text-white ${connector.color}`}>
                                                    <img src={connector.icon} alt={connector.name} className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm">{connector.name}</span>
                                                {selectedConnector === connector.id && (
                                                    <svg className="ml-auto w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Click to select a database connector</p>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2">Name of your source</label>
                            <input
                                type="text"
                                placeholder="Source Name"
                                className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-none "
                            />
                        </div>

                        <a
                            href={getConnectorUrl()}
                            className="inline-block bg-blue-600 text-white py-2.5 px-6 rounded-lg hover:bg-blue-700 transition w-full text-center font-medium text-sm sm:text-base"
                        >
                            Connect Source
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SetupStepsSection; 