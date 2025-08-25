import React, { useState, useEffect } from 'react';

interface GitHubStarsProps {
  repository?: string;
  className?: string;
}

const GitHubStars: React.FC<GitHubStarsProps> = ({ 
  repository = 'datazip-inc/olake',
  className = ''
}) => {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for dark theme
    const checkTheme = () => {
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(isDarkTheme);
    };

    // Check for mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkTheme();
    checkMobile();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Listen for screen resize
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repository}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OLake-Docs'
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            console.warn('GitHub API rate limited, hiding component');
            setStarCount(null);
            return;
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
        setStarCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStars();
  }, [repository]);

  // Don't render if loading failed or no stars
  if (!isLoading && (starCount === null || starCount === 0)) {
    return null;
  }

  return (
    <div className={`flex items-center h-full ${isMobile ? 'mr-2' : 'mr-3'} ${className}`}>
      <a
        href={`https://github.com/${repository}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center no-underline transition-opacity duration-200 rounded-md overflow-hidden cursor-pointer
          ${isMobile ? 'h-7' : 'h-8'}
          ${isDark 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }
          border hover:opacity-80
        `}
      >
        {/* Left section with icon and text */}
        <div className={`flex items-center h-full ${isMobile ? 'px-2 gap-1.5' : 'px-3 gap-2'}`}>
          <div 
            className={`bg-cover bg-center bg-no-repeat ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
            style={{
              backgroundImage: `url('/img/logo/github-${isDark ? 'dark' : 'light'}.svg')`
            }}
          />
          <span className={`
            font-semibold whitespace-nowrap font-sans
            ${isMobile ? 'text-xs' : 'text-sm'}
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Star
          </span>
        </div>
        
        {/* Separator */}
        <div className={`
          w-px mx-px
          ${isMobile ? 'h-3.5' : 'h-4'}
          ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
        `} />
        
        {/* Right section with count */}
        <div className={`flex items-center h-full ${isMobile ? 'px-2' : 'px-3'}`}>
          <span className={`
            font-semibold whitespace-nowrap font-sans
            ${isMobile ? 'text-xs' : 'text-sm'}
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            {isLoading ? '...' : starCount?.toLocaleString()}
          </span>
        </div>
      </a>
    </div>
  );
};

export default GitHubStars;