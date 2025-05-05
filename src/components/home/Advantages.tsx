import React from "react";
import { motion } from "framer-motion";

const advantageData = [
  {
    title: "3X",
    subtitle: "Faster",
    description: "Process data 3 times faster than traditional solutions",
    color: "bg-gradient-to-r from-blue-500 to-blue-700",
  },
  {
    title: "70%",
    subtitle: "Savings",
    description: "Reduce your infrastructure costs significantly",
    color: "bg-gradient-to-r from-green-500 to-green-700",
  },
  {
    title: "3x",
    subtitle: "Less CPU",
    description: "More efficient resource utilization for your workloads",
    color: "bg-gradient-to-r from-purple-500 to-purple-700",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Advantages: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
            Get the OLake Advantage
          </h2>
          <a
            href="/benchmarks"
            className="text-primary-blue hover:text-blue-700 dark:hover:text-blue-400 font-medium flex items-center justify-center"
          >
            View all Performance Benchmarks
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {advantageData.map((advantage, index) => (
            <motion.div
              key={index}
              className="text-center p-8 rounded-lg"
              variants={item}
            >
              <h3 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2">
                {advantage.title}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {advantage.subtitle}
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm max-w-xs mx-auto">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Advantages;
