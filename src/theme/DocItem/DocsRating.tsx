import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

interface DocsRatingProps {
  label: string;
}

const DocsRating: React.FC<DocsRatingProps> = ({ label }) => {
  // Prevent rendering on the server side
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  const location = useLocation();

  // Slack Invite, open GitHub issue, enhancement request
  const slackInviteURL =
    "https://olake.io/slack";
  const openDocIssueURL =
    "https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template=---doc-error-report.md&title=Issue with olake.io" +
    location.pathname;
  const docEnhancementURL =
    "https://github.com/datazip-inc/olake-docs/issues/new?assignees=&labels=&template=---doc-site-enhancement-request.md&title=Doc enhancement request for olake.io" +
    location.pathname;

  const [haveVoted, setHaveVoted] = useState(false);
  const [liked, setLiked] = useState(false);

  // Google Analytics event
  const giveFeedback = (value: number) => {
    // Check if gtag is available (only in production)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag("event", "feedback", {
        event_category: "button",
        event_label: label,
        value: value,
      });
    }
    setLiked(value === 1);
    setHaveVoted(true);
  };

  return (
    <div className="mx-auto mt-10 max-w-xl">
      {haveVoted ? (
        !liked ? (
          <div className="rounded p-4 shadow text-left text-gray-800 dark:text-gray-200 ">
            <p className="mb-2">
              Thanks for letting us know! If you have a specific question about how
              to use OLake, ask it on our{" "}
              <a href={slackInviteURL} className="text-blue-600 dark:text-blue-400 underline">
                Slack Channel
              </a>.
            </p>
            <p>
              Open an issue in the GitHub repo if you want to{" "}
              <a href={openDocIssueURL} className="text-blue-600 dark:text-blue-400 underline">
                report a problem
              </a>{" "}
              or{" "}
              <a href={docEnhancementURL} className="text-blue-600 dark:text-blue-400 underline">
                suggest an improvement
              </a>.
            </p>
          </div>
        ) : (
          <div className="rounded p-4 shadow text-center  text-gray-800 dark:text-gray-200">
            Thanks for letting us know!
          </div>
        )
      ) : (
        <div className="text-center p-2 rounded ">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Was this topic helpful?
          </h3>
          <div className="flex justify-center space-x-4">
            {/* Yes Button */}
            <button
              onClick={() => giveFeedback(1)}
              className="
                flex items-center justify-center
                h-10 w-20 
                text-xs
                rounded-md 
                bg-green-600 text-white 
                dark:bg-green-700
                hover:opacity-90
                transition
                border-none
              "
            >
              <svg
                className="mr-1 h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 81.13 89.76"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.9 6a18.57 18.57 0 002.67 8.4 25.72 25.72 0 008.65 7.66c3.86 2 8.67 7.13 13.51 11 3.86 3.11 8.57 7.11 11.54 8.45s13.59.26 14.64 1.17c1.88 1.63 1.55 9-.11 15.25-1.61 5.86-5.96 10.55-6.48 16.86-.4 4.83-2.7 4.88-10.93 4.88h-1.35c-3.82 0-8.24 2.93-12.92 3.62a68 68 0 01-9.73.5c-3.57 0-7.86-.08-13.25-.08-3.56 0-4.71-1.83-4.71-4.48h8.42a3.51 3.51 0 000-7H12.28a2.89 2.89 0 01-2.88-2.88 1.91 1.91 0 01.77-1.78h16.46a3.51 3.51 0 000-7H12.29c-3.21 0-4.84-1.83-4.84-4a6.41 6.41 0 011.17-3.78h19.06a3.5 3.5 0 100-7H9.75A3.51 3.51 0 016 42.27a3.45 3.45 0 013.75-3.48h13.11c5.61 0 7.71-3 5.71-5.52-4.43-4.74-10.84-12.62-11-18.71-.15-6.51 2.6-7.83 5.36-8.56m0-6a6.18 6.18 0 00-1.53.2c-6.69 1.77-10 6.65-9.82 14.5.08 5.09 2.99 11.18 8.52 18.09H9.74a9.52 9.52 0 00-6.23 16.9 12.52 12.52 0 00-2.07 6.84 9.64 9.64 0 003.65 7.7 7.85 7.85 0 00-1.7 5.13 8.9 8.9 0 005.3 8.13 6 6 0 00-.26 1.76c0 6.37 4.2 10.48 10.71 10.48h13.25a73.75 73.75 0 0010.6-.56 35.89 35.89 0 007.58-2.18 17.83 17.83 0 014.48-1.34h1.35c4.69 0 7.79 0 10.5-1 3.85-1.44 6-4.59 6.41-9.38.2-2.46 1.42-4.85 2.84-7.62a41.3 41.3 0 003.42-8.13 48 48 0 001.59-10.79c.1-5.13-1-8.48-3.35-10.55-2.16-1.87-4.64-1.87-9.6-1.88a46.86 46.86 0 01-6.64-.29c-1.92-.94-5.72-4-8.51-6.3l-1.58-1.28c-1.6-1.3-3.27-2.79-4.87-4.23-3.33-3-6.47-5.79-9.61-7.45a20.2 20.2 0 01-6.43-5.53 12.44 12.44 0 01-1.72-5.36 6 6 0 00-6-5.86z" />
              </svg>
              Yes
            </button>

            {/* No Button */}
            <button
              onClick={() => giveFeedback(0)}
              className="
                flex items-center justify-center
                h-10 w-20
                rounded-md 
                bg-red-600 text-white 
                dark:bg-red-700
                hover:opacity-90
                transition
                border-none
              "
            >
              <svg
                className="mr-1 h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 81.13 89.76"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* We flip the same path vertically with transform */}
                <g transform="translate(0,89.76) scale(1,-1)">
                  <path d="M22.9 6a18.57 18.57 0 002.67 8.4 25.72 25.72 0 008.65 7.66c3.86 2 8.67 7.13 13.51 11 3.86 3.11 8.57 7.11 11.54 8.45s13.59.26 14.64 1.17c1.88 1.63 1.55 9-.11 15.25-1.61 5.86-5.96 10.55-6.48 16.86-.4 4.83-2.7 4.88-10.93 4.88h-1.35c-3.82 0-8.24 2.93-12.92 3.62a68 68 0 01-9.73.5c-3.57 0-7.86-.08-13.25-.08-3.56 0-4.71-1.83-4.71-4.48h8.42a3.51 3.51 0 000-7H12.28a2.89 2.89 0 01-2.88-2.88 1.91 1.91 0 01.77-1.78h16.46a3.51 3.51 0 000-7H12.29c-3.21 0-4.84-1.83-4.84-4a6.41 6.41 0 011.17-3.78h19.06a3.5 3.5 0 100-7H9.75A3.51 3.51 0 016 42.27a3.45 3.45 0 013.75-3.48h13.11c5.61 0 7.71-3 5.71-5.52-4.43-4.74-10.84-12.62-11-18.71-.15-6.51 2.6-7.83 5.36-8.56m0-6a6.18 6.18 0 00-1.53.2c-6.69 1.77-10 6.65-9.82 14.5.08 5.09 2.99 11.18 8.52 18.09H9.74a9.52 9.52 0 00-6.23 16.9 12.52 12.52 0 00-2.07 6.84 9.64 9.64 0 003.65 7.7 7.85 7.85 0 00-1.7 5.13 8.9 8.9 0 005.3 8.13 6 6 0 00-.26 1.76c0 6.37 4.2 10.48 10.71 10.48h13.25a73.75 73.75 0 0010.6-.56 35.89 35.89 0 007.58-2.18 17.83 17.83 0 014.48-1.34h1.35c4.69 0 7.79 0 10.5-1 3.85-1.44 6-4.59 6.41-9.38.2-2.46 1.42-4.85 2.84-7.62a41.3 41.3 0 003.42-8.13 48 48 0 001.59-10.79c.1-5.13-1-8.48-3.35-10.55-2.16-1.87-4.64-1.87-9.6-1.88a46.86 46.86 0 01-6.64-.29c-1.92-.94-5.72-4-8.51-6.3l-1.58-1.28c-1.6-1.3-3.27-2.79-4.87-4.23-3.33-3-6.47-5.79-9.61-7.45a20.2 20.2 0 01-6.43-5.53 12.44 12.44 0 01-1.72-5.36 6 6 0 00-6-5.86z" />
                </g>
              </svg>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsRating;
