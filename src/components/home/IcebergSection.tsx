import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Schema evolution",
    description:
      "Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new fields.",
    id: "schema-evolution",
  },
  {
    title: "Schema datatype changes",
    description:
      "Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new fields.",
    id: "schema-datatype",
  },
  {
    title: "Partitioning and partition evolution",
    description:
      "Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new fields.",
    id: "partitioning",
  },
];

const IcebergSection: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-blue-100 dark:bg-blue-900/20">
      {/* Badge */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-blue-900 rounded-full shadow-md">
          <div className="mr-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">
            Exclusively for Apache Iceberg
          </span>
        </div>
      </div>

      <div className="container relative z-10 pt-10">
        <div className="text-center mb-16">
          <motion.h2
            className="heading-lg text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Built on Iceberg.
            <br />
            Born for Scale.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>

              <div className="flex space-x-4 items-start mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Schema
                  </div>
                </div>
                <div className="w-8 text-center">
                  <svg
                    width="20"
                    height="8"
                    viewBox="0 0 20 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                      fill="#3B82F6"
                    />
                  </svg>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Schema
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Iceberg image background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 mix-blend-multiply"></div>

      </div>
    </section>
  );
};

export default IcebergSection;
