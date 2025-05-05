import React from "react";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-8">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-medium text-blue-600 dark:text-blue-400">
                Now Supporting <span className="text-iceberg">ICEBERG</span>
              </div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Fastest way to replicate your data from
                <br />
                <span className="text-gray-900 dark:text-white">Data </span>
                <span className="text-primary-blue">Warehouse</span>
                <span className="text-primary-blue">→</span>
                <span className="text-primary-blue">Data Lakes</span>
              </motion.h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                OLake makes data replication faster by parallelizing full loads,
                leveraging change streams for real-time sync, and storing data
                efficiently.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center md:justify-start">
                <Button size="lg">Talk to us</Button>
                <Button
                  variant="outline"
                  size="lg"
                  href="https://github.com/olake"
                  isExternal
                  className="flex items-center gap-2"
                >
                  <FaGithub className="text-lg" />
                  <span>Live on Github, Contribute</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-primary-blue"
                    >
                      <path d="M10 0L20 7.5L10 15L0 7.5L10 0Z" />
                    </svg>
                    <span className="text-sm font-medium text-primary-blue">
                      OLake
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-blue">&rarr;</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Jobs
                    </span>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-blue">&rarr;</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Sources
                    </span>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-blue">&rarr;</span>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Destinations
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-40 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/4"></div>
    </section>
  );
};

export default Hero;
