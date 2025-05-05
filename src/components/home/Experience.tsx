import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "I",
    title: "Source",
    description:
      "Connect to any data source with our extensive library of connectors.",
  },
  {
    number: "II",
    title: "Destination",
    description:
      "Choose where to send your data, whether it's a data lake, warehouse, or other storage system.",
  },
  {
    number: "III",
    title: "Schema",
    description:
      "Define or infer your data schema, with support for evolution and changes over time.",
  },
  {
    number: "IV",
    title: "Job Config",
    description:
      "Configure how your data replication jobs should run - batch, streaming, or hybrid.",
  },
];

const Experience: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <div className="mb-8">
              <div className="text-primary-blue font-medium mb-3">
                The OLake Experience
              </div>
              <h2 className="heading-lg text-gray-900 dark:text-white">
                Fast & Efficient
                <br />
                That is OLake
              </h2>
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900 z-10 relative">
                      <div className="text-sm font-medium text-primary-blue">
                        {step.number}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-blue-100 dark:bg-blue-900/50"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      Step {step.number}
                    </h3>
                    <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-md w-full">
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                    Capture information
                  </h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Connector
                    </label>
                    <div className="relative">
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option>Mongo DB</option>
                        <option>MySQL</option>
                        <option>PostgreSQL</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M7 7l3 3 3-3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name of your source
                    </label>
                    <input
                      type="text"
                      placeholder="Source Name"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <button className="w-full bg-primary-blue text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Connect Source
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
