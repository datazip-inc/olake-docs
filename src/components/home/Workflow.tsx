import React from "react";
import { motion } from "framer-motion";

const Workflow: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <div className="text-primary-blue font-medium mb-3">
            The Fundamental
          </div>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-3">
            Experience the most
            <br />
            <span className="text-gray-700 dark:text-gray-300">
              seamless
            </span>{" "}
            workflow
          </h2>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap justify-center items-center text-center gap-4 mb-10">
            <motion.div
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sources
              </span>
            </motion.div>

            <motion.div
              className="w-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />

            <motion.div
              className="px-4 py-2 bg-primary-blue text-white rounded-full flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="inline-block w-5 h-5 bg-blue-600 rounded-sm"></span>
              <span className="text-sm font-medium">OLake</span>
            </motion.div>

            <motion.div
              className="w-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />

            <motion.div
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="inline-block w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Destinations
              </span>
            </motion.div>

            <motion.div
              className="w-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />

            <motion.div
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className="inline-block w-5 h-5 bg-blue-400 rounded-sm"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Iceberg Catalogs
              </span>
            </motion.div>

            <motion.div
              className="w-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.8 }}
            />

            <motion.div
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="inline-block w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Query Engines
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {/* Sources Box */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Sources
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Access databases, files, APIs, plugins, or even from third party
                systems.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                130+ Fast & Secure Connectors
              </div>
            </motion.div>

            {/* OLake Box */}
            <motion.div
              className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-lg flex flex-col justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-primary-blue">
                  OLake
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Managed Lakehouse
                </p>
              </div>
            </motion.div>

            {/* Destinations Box */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Destinations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-500 font-bold">IC</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-500">AWS</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-500">Hive</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-500">JDBC</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Query Engines Box */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Query Engines
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-orange-500">Spark</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-500">Athena</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-purple-500">Trino</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-yellow-500">Duck DB</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                And many more
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
