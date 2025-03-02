import React from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaHourglassHalf,
  FaCheckCircle
} from 'react-icons/fa';

type WebinarOverviewProps = {
  date?: string;
  time?: string;
  duration?: string;
  summary?: string;
  bulletPoints?: string[];
};

const WebinarOverview: React.FC<WebinarOverviewProps> = ({
  date,
  time,
  duration,
  summary,
  bulletPoints
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 px-6 py-8 md:px-8 md:py-10 rounded-lg mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        {/* Webinar Details */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Webinar Details
          </h2>
          <ul className="flex flex-col">
            <li className="flex">
              <FaCalendarAlt
                className="text-blue-600 dark:text-blue-400 mr-3 mt-1"
                aria-label="Date Icon"
              />
              <div className=''>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Date:
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{date}</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaClock
                className="text-blue-600 dark:text-blue-400 mr-3 mt-1"
                aria-label="Time Icon"
              />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Time:
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{time}</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaHourglassHalf
                className="text-blue-600 dark:text-blue-400 mr-3 mt-1"
                aria-label="Duration Icon"
              />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Duration:
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{duration}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Webinar Summary */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5">{summary}</p>
          <ul className="space-y-3">
            {bulletPoints?.map((point, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 text-sm dark:text-gray-400"
              >
                {/* <FaCheckCircle
                  className="text-green-500 mr-2 mt-2"
                  aria-label="Bullet Point Icon"
                /> */}
                <span>✅ {point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WebinarOverview;
