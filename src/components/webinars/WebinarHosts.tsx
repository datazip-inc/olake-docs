// components/webinars/WebinarHosts.tsx

import React from "react";
import Image from '@theme/IdealImage'
import { FaLinkedin } from 'react-icons/fa';


type Host = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
};

type WebinarHostsProps = {
  hosts: Host[];
};

const WebinarHosts: React.FC<WebinarHostsProps> = ({ hosts }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Hosted By
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {hosts.map((host, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-100 dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-96"
          >


            {/* Image */}
            <div className="relative w-24 h-24 mb-4">
              <Image
                img={host.image}
                alt={`${host.name}'s profile picture`}
                loading="lazy"
                decoding="async"
                className="rounded-full border-2 border-blue-600"
              />
            </div>

            <a
              href={host.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className=" text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
              aria-label={`${host.name}'s LinkedIn`}
            >
              <FaLinkedin size={24} />
            </a>

            {/* Name and Role */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {host.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {host.role}
              </p>
            </div>


            {/* Bio */}
            <p className="mt-4 text-gray-700  dark:text-gray-200 text-sm">
              {host.bio}
            </p>

            {/* LinkedIn Icon */}

          </div>
        ))}
      </div>
    </section>
  );
};

export default WebinarHosts;
