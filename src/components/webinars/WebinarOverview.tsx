import React from 'react';
import { FaCalendarAlt, FaClock, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

type WebinarOverviewProps = {
  date?: string;
  time?: string;
  duration?: string;
  summary?: string;
  bulletPoints?: string[];
};

const WebinarOverview: React.FC<WebinarOverviewProps> = ({ date, time, duration, summary, bulletPoints }) => {
  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-lg  mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {/* Webinar Details */}
        <div className='ml-7 mt-4'>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Webinar Details</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <FaCalendarAlt className="text-blue-600 dark:text-blue-400 mr-3" aria-label="Date Icon" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                <p className="text-gray-600 dark:text-gray-400">{date}</p>
              </div>
            </li>
            <li className="flex items-center">
              <FaClock className="text-blue-600 dark:text-blue-400 mr-3" aria-label="Time Icon" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                <p className="text-gray-600 dark:text-gray-400">{time}</p>
              </div>
            </li>
            <li className="flex items-center">
              <FaHourglassHalf className="text-blue-600 dark:text-blue-400 mr-3" aria-label="Duration Icon" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                <p className="text-gray-600 dark:text-gray-400">{duration}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Webinar Summary */}
        <div className='md:-ml-8'>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{summary}</p>
          <ul className="list-disc list-inside space-y-2">
            {bulletPoints?.map((point, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1" aria-label="Bullet Point Icon" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WebinarOverview;
