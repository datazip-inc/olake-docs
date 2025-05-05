import React from "react";
import { motion } from "framer-motion";

const ContactForm: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                OLake
                <br />
                Interested?
                <br />
                Register Now.
              </h2>

              <div className="space-y-6 max-w-md mx-auto md:mx-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-xl mb-1 text-white">
                      Iceberg Native
                    </h3>
                    <p className="text-blue-100">
                      Instead of directly transforming data from Databases
                      during extraction, we first pull it in its native format.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-blue-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-xl mb-1 text-white">
                      Faster & More Efficient
                    </h3>
                    <p className="text-blue-100">
                      Instead of directly transforming data from Databases
                      during extraction, we first pull it in its native format.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl"
            >
              <div id="olake-product-form"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
