import React from "react";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "What is OLake?",
    answer: "OLake is an open-source data replication tool that helps you move data from databases to data lakes efficiently. It's designed to be fast, reliable, and easy to use."
  },
  {
    question: "How does OLake work?",
    answer: "OLake uses a combination of parallel processing, change data capture (CDC), and efficient data storage to replicate your data. It supports multiple source databases and destinations."
  },
  {
    question: "What databases does OLake support?",
    answer: "OLake currently supports MongoDB as a source database, with plans to add more database connectors in the future."
  },
  {
    question: "Is OLake free to use?",
    answer: "Yes, OLake is completely open-source and free to use. You can find it on GitHub and contribute to its development."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <div className="text-primary-blue font-medium mb-3">FAQ</div>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
