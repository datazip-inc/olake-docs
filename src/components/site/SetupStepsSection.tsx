import React, { useState } from 'react'

const SetupStepsSection: React.FC = () => {
  const [selectedConnector, setSelectedConnector] = useState('postgres')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const connectors = [
    { id: 'mongodb', name: 'MongoDB', color: 'bg-gray-100', icon: '/img/site/mongodb.svg' },
    { id: 'postgres', name: 'PostgreSQL', color: 'bg-gray-100', icon: '/img/site/postgres.svg' },
    { id: 'mysql', name: 'MySQL', color: 'bg-gray-100', icon: '/img/site/mysql.svg' }
  ]

  const getConnectorUrl = () => {
    return `https://olake.io/docs/connectors/${selectedConnector}/overview`
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleConnectorSelect = (connectorId: string) => {
    setSelectedConnector(connectorId)
    setDropdownOpen(false)
  }

  const getSelectedConnector = () => {
    return connectors.find((connector) => connector.id === selectedConnector)
  }

  return (
    <section className='py-16 dark:bg-gray-900 md:py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2'>
          {/* Left Side - Steps */}
          <div>
            <div className='mb-3 text-xl font-semibold tracking-wide text-[#203FDD]'>
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
                  {/* <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#203FDD]'> */}
                  <div className='z-40 h-2 w-2 rounded-full bg-white outline outline-2 outline-[#e5e5e5]'></div>
                  {/* </div> */}
                  <div className='h-20 w-0.5 bg-[#e5e5e5]'></div>
                </div>
                {/* <div className='pb-10'> */}
                <div className='flex flex-col'>
                  <div className='mb-1 text-sm text-[#8A8A8A]'>Step I</div>
                  <div className='text-2xl font-bold text-gray-900'>Source</div>
                </div>
                {/* </div> */}
              </div>

              {/* Step 2 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-2 w-2 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-white outline outline-2 outline-[#e5e5e5]'></div>
                  </div>
                  <div className='h-20 w-0.5 bg-[#e5e5e5]'></div>
                </div>

                <div className='flex flex-col'>
                  <div className='mb-1 text-sm text-[#8A8A8A]'>Step II</div>
                  <div className='text-2xl font-bold text-gray-900'>Destination</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-2 w-2 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-white outline outline-2 outline-[#e5e5e5]'></div>
                  </div>
                  <div className='h-20 w-0.5 bg-[#e5e5e5]'></div>
                </div>
                <div className='flex flex-col'>
                  <div className='mb-1 text-sm text-[#8A8A8A]'>Step III</div>
                  <div className='text-2xl font-bold text-gray-900'>Schema</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className='-mt-2 flex'>
                <div className='mr-4 flex flex-col items-center'>
                  <div className='flex h-2 w-2 items-center justify-center rounded-full border-2 border-gray-300'>
                    <div className='h-2 w-2 rounded-full bg-white outline outline-2 outline-[#e5e5e5]'></div>
                  </div>
                </div>
                <div>
                  <div className='mb-1 text-sm text-[#8A8A8A]'>Step IV</div>
                  <div className='text-2xl font-bold text-gray-900'>Job Config</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className='rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8'>
            <div className='mb-6 flex items-center sm:mb-8'>
              <svg
                className='mr-2 h-5 w-5'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  width='18'
                  height='18'
                  x='3'
                  y='3'
                  rx='2'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <path
                  d='M9 9h6M9 12h6M9 15h6'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              <span className='text-base font-semibold sm:text-lg'>Setup Source</span>
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium'>Connector</label>
              <div className='relative'>
                <div
                  className='group flex cursor-pointer items-center rounded-lg border-2 border-gray-300 p-2.5 transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                  onClick={toggleDropdown}
                  aria-haspopup='listbox'
                  aria-expanded={dropdownOpen}
                  role='button'
                >
                  <div
                    className={`mr-3 flex h-7 w-7 items-center justify-center overflow-hidden rounded-md text-white ${getSelectedConnector()?.color}`}
                  >
                    <img
                      src={getSelectedConnector()?.icon}
                      alt={getSelectedConnector()?.name}
                      className='h-5 w-5'
                    />
                  </div>
                  <span className='text-sm'>{getSelectedConnector()?.name}</span>
                  <svg
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300 ${dropdownOpen ? 'rotate-180 transform' : ''}`}
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div
                    className='absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
                    role='listbox'
                  >
                    {connectors.map((connector) => (
                      <div
                        key={connector.id}
                        className='flex cursor-pointer items-center p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700'
                        onClick={() => handleConnectorSelect(connector.id)}
                        role='option'
                        aria-selected={selectedConnector === connector.id}
                      >
                        <div
                          className={`mr-3 flex h-7 w-7 items-center justify-center overflow-hidden rounded-md text-white ${connector.color}`}
                        >
                          <img src={connector.icon} alt={connector.name} className='h-5 w-5' />
                        </div>
                        <span className='text-sm'>{connector.name}</span>
                        {selectedConnector === connector.id && (
                          <svg
                            className='ml-auto h-4 w-4 text-blue-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                Click to select a database connector
              </p>
            </div>

            <div className='mb-5'>
              <label className='mb-2 block text-sm font-medium'>Name of your source</label>
              <input
                type='text'
                placeholder='Source Name'
                className='w-full rounded-lg border border-none border-gray-300 bg-gray-100 p-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800'
              />
            </div>

            <a
              href={getConnectorUrl()}
              className='inline-block w-full rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700 hover:text-gray-100 sm:text-base'
            >
              Connect Source
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SetupStepsSection
