import React, { useState, useRef } from 'react';

// --- UI Sub-Components (Included for Portability) ---
// These are included directly in this file so you don't need to create separate files for them.

/**
 * A basic Card component for wrapping content.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - The content of the card.
 */
const Card = ({ className = '', children }) => {
  // Docusaurus applies dark/light mode classes to the <html> element.
  // The `dark:` variants from Tailwind CSS will work automatically.
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

/**
 * A reusable circular progress component.
 * @param {object} props - Component props.
 * @param {number} props.size - The width and height of the circle.
 * @param {number} props.strokeWidth - The width of the progress ring.
 * @param {number} props.percentage - The progress percentage (0-100).
 * @param {string} props.color - The color of the progress ring.
 */
const CircularProgress = ({ size, strokeWidth, percentage, color }) => {
  const viewBox = `0 0 ${size} ${size}`;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (percentage * circumference) / 100;

  return (
    <svg width={size} height={size} viewBox={viewBox} className="-rotate-90">
      {/* Background circle */}
      <circle
        className="text-gray-200 dark:text-gray-600"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className="transition-all duration-500 ease-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - dash}
        strokeLinecap="round"
        stroke={color}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};


// --- Main Contributor Card Component ---
// This is the component you will import into your pages.

export interface ContributorProps {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const ContributorCard: React.FC<{ contributor: ContributorProps }> = ({ contributor }) => {
  // State for PR data, loading status, and popup visibility
  const [prs, setPrs] = useState<{title: string, url: string}[]>([]);
  const [isLoadingPRs, setIsLoadingPRs] = useState(false);
  const [showPRs, setShowPRs] = useState(false);
  const hidePopupTimer = useRef<NodeJS.Timeout | null>(null);


  // Constants for the progress bar
  const size = 80;
  const strokeWidth = 6;
  const progressColor = '#0582f6';
  const maxContributions = 50; // A more realistic max for percentage calculation
  const percentage = Math.min((contributor.contributions / maxContributions) * 100, 100);

  // Function to fetch pull requests for the contributor
  const fetchPRs = async () => {
    if (prs.length > 0) return; // Avoid re-fetching
    setIsLoadingPRs(true);
    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=is:pr+repo:datazip-inc/olake+author:${contributor.login}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch from GitHub API');
      }
      const data = await response.json();
      const prItems = data.items?.map((pr: any) => ({ title: pr.title, url: pr.html_url })) || [];
      setPrs(prItems);
    } catch (error) {
      console.error('Error fetching PRs:', error);
      setPrs([]); // Clear PRs on error
    } finally {
      setIsLoadingPRs(false);
    }
  };

  // Handlers for showing and hiding the PR popup with a delay
  const handleMouseEnter = () => {
    if (hidePopupTimer.current) {
      clearTimeout(hidePopupTimer.current);
    }
    setShowPRs(true);
    fetchPRs();
  };

  const handleMouseLeave = () => {
    hidePopupTimer.current = setTimeout(() => {
      setShowPRs(false);
    }, 200); // 200ms delay before hiding
  };

  return (
    <Card className="relative flex flex-col items-center p-6 space-y-4 text-center transform hover:scale-105 duration-300">
      {/* Avatar and Progress Circle */}
      <div className="relative" style={{ width: size, height: size }}>
        <CircularProgress
          percentage={percentage}
          size={size}
          strokeWidth={strokeWidth}
          color={progressColor}
        />
        <div className="absolute inset-0 flex items-center justify-center p-1">
            <img
              src={contributor.avatar_url || 'https://placehold.co/80x80/e2e8f0/e2e8f0?text=A'}
              alt={`${contributor.login}'s avatar`}
              className="rounded-full object-cover w-full h-full"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/80x80/e2e8f0/e2e8f0?text=A'; }}
            />
        </div>
      </div>
      
      {/* Contributor Name */}
      <a
        href={contributor.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
      >
        {contributor.login}
      </a>
      
      {/* Contributions Text - Triggers PR Popup */}
      <div 
        className="relative" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          {contributor.contributions} {contributor.contributions === 1 ? 'contribution' : 'contributions'}
        </p>
        
        {/* PRs Popup Card */}
        {showPRs && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl z-50 text-left">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              Recent Pull Requests
            </h4>
            {isLoadingPRs ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            ) : prs.length > 0 ? (
              <ul className="space-y-2">
                {prs.slice(0, 5).map((pr, index) => (
                  <li key={index} className="truncate text-sm">
                    <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {pr.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent PRs found.</p>
            )}
            {/* Arrow pointing down */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 transform rotate-45 bg-white dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-700"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContributorCard;
