import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Faster Parallel & Full Load",
    description:
      "Full load performance is improved by splitting large collections into smaller virtual chunks, processed in parallel.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" fill="#3B82F6" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="#3B82F6" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="#3B82F6" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    title: "Stay updated with ingestion logs",
    description:
      "Instead of directly transforming data from databases during extraction, we first pull it in its native format (JSON, MongoDB's native data format), which stores JSON-like documents more efficiently.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4l10 6v8l-10 6-10-6v-8l10-6z"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
        />
        <path d="M3 10l9 6 9-6" stroke="#3B82F6" strokeWidth="2" fill="none" />
        <path d="M12 4v6" stroke="#3B82F6" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "CDC Cursor Preservation",
    description:
      "When you add new big tables after a long time of setting up the ETL, we do full load for it, in parallel to already running incremental sync. So CDC cursors are never lost. We manage overhead of data ingestion order and deduplication.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Fast & Stable Connectors",
    description:
      "Using Databases change stream logs (binlogs for MySQL, oplogs for mongoDB, WAL logs for Postgres), OLake enables parallel updates for each collection. This method facilitates rapid synchronization and ensures that data is consistently updated with near real-time updates.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M3 15v4a2 2 0 002 2h4m-6-6h6m0-10v6m0-6h6m0 0v6m4 4v4a2 2 0 01-2 2h-4m6-6h-6m0 0v6m0-6h-6"
          stroke="#3B82F6"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <div className="text-primary-blue font-medium mb-3">Why OLake?</div>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-6">
            We know how to stand out
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row gap-6 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-primary-blue">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
