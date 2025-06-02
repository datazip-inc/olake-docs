import React from "react";

type WebinarContentSectionProps = {
  title: string;
  content: string[];
};

const WebinarContentSection: React.FC<WebinarContentSectionProps> = ({ title, content }) => {
  return (
    <div className="container mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <ul className="list-disc pl-6 space-y-4">
        {content.map((item, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebinarContentSection;
