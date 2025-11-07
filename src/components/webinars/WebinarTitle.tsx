import React from 'react';
import { FaMicrophone, FaBlog, FaFileAlt, FaChess, FaUsers } from 'react-icons/fa';

type TagType = 'Webinar' | 'Blog' | 'Whitepaper' | 'Event' | 'Community Meetup' | string;

type WebinarTitleProps = {
  title: string;
  tag?: TagType;
};

const getTagStyles = (tag: TagType) => {
  switch (tag) {
    case 'Webinar':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200',
        icon: <FaMicrophone className="w-4 h-4 mr-1" />,
      };
    case 'Blog':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        icon: <FaBlog className="w-4 h-4 mr-1" />,
      };
    case 'Event':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        icon: <FaChess className="w-4 h-4 mr-1" />,
      };
    case 'Whitepaper':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-200',
        icon: <FaFileAlt className="w-4 h-4 mr-1" />,
      };
    case 'Community Meetup':
      return {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-200',
        icon: <FaUsers className="w-4 h-4 mr-1" />,
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-800 dark:text-gray-200',
        icon: null,
      };
  }
};

const WebinarTitle: React.FC<WebinarTitleProps> = ({ title, tag }) => {
  const tagStyles = tag ? getTagStyles(tag) : null;

  return (
    <div className="mb-6">
      {tag && (
        <span
          className={`
            ${tagStyles?.bg} 
            ${tagStyles?.text}
            inline-flex items-center
            px-3 py-1
            rounded-full
            text-sm
            font-medium
            mb-2
          `}
        >
          {tagStyles?.icon}
          {tag}
        </span>
      )}
      <h1 className="text-4xl font-extralight lg:text-6xl lg:leading-[5rem] text-gray-800 dark:text-white">
        {title}
      </h1>
    </div>
  );
};

export default WebinarTitle;
