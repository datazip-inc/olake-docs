import React from "react";
import { motion } from "framer-motion";

const benchmarkData = [
  {
    metric: "Initial Load Time",
    olake: "3.2 Hours",
    airbyte: "10+ Hours",
    debezium: "10+ Hours",
    advantage: "3X Faster",
  },
  {
    metric: "CDC Latency",
    olake: "<3 seconds",
    airbyte: "5-10 seconds",
    debezium: "5-10 seconds",
    advantage: "Lowest Latency",
  },
  {
    metric: "CDC CPU",
    olake: "30%",
    airbyte: "90% +",
    debezium: "90% +",
    advantage: "3X less CPU",
  },
  {
    metric: "CDC Memory",
    olake: "1.5 GB",
    airbyte: "4GB +",
    debezium: "4GB +",
    advantage: "Lightweight",
  },
  {
    metric: "Infrastructure Cost",
    olake: "$",
    airbyte: "$$$",
    debezium: "$$$",
    advantage: "70% Savings",
  },
];

const Benchmarks: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3">
            <div className="sticky top-20">
              <div className="text-primary-blue font-medium mb-3">
                Benchmarks
              </div>
              <h2 className="heading-lg text-gray-900 dark:text-white mb-6">
                Get the <span className="text-primary-blue">best</span>
                <br />
                of OLake
              </h2>
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  The
                  <br />
                  OLake
                  <br />
                  Advantage
                </h3>
                <div className="space-y-4">
                  <div className="font-semibold text-primary-blue">
                    3X Faster
                  </div>
                  <div className="font-semibold text-primary-blue">
                    Lowest Latency
                  </div>
                  <div className="font-semibold text-primary-blue">
                    3X less CPU
                  </div>
                  <div className="font-semibold text-primary-blue">
                    Lightweight
                  </div>
                  <div className="font-semibold text-primary-blue">
                    70% Savings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700">
                <div className="bg-gray-100 dark:bg-gray-900 p-4">
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    Metrics
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      OLake
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Open Source
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Airbyte Open Source
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Debezium + Kafka Connect
                    </div>
                  </div>
                </div>
              </div>

              {benchmarkData.map((row, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-4 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {row.metric}
                  </div>
                  <div className="p-4 text-center font-medium text-green-600 dark:text-green-400">
                    {row.olake}
                  </div>
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    {row.airbyte}
                  </div>
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    {row.debezium}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benchmarks;
