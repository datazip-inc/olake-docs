import React, { useState, useEffect, useRef } from 'react';
import styles from './ReleasesBellNotification.module.css';

interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
}

const ReleasesBellNotification: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch latest releases from GitHub
    const fetchReleases = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/datazip-inc/olake/releases?per_page=3'
        );
        const data = await response.json();
        setReleases(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching releases:', error);
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    const cleanText = text.replace(/[#*\[\]]/g, '').trim();
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.bellContainer} ref={dropdownRef}>
      <button
        className={styles.bellButton}
        onClick={toggleDropdown}
        aria-label="View latest releases"
      >
        <svg
          className={styles.bellIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {releases.length > 0 && <span className={styles.notificationBadge}>{releases.length}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3 className={styles.dropdownTitle}>Latest Releases</h3>
          </div>
          
          {loading ? (
            <div className={styles.loading}>Loading releases...</div>
          ) : releases.length > 0 ? (
            <>
              <div className={styles.releasesList}>
                {releases.map((release) => (
                  <a
                    key={release.tag_name}
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.releaseItem}
                  >
                    <div className={styles.releaseHeader}>
                      <span className={styles.releaseTag}>{release.tag_name}</span>
                      <span className={styles.releaseDate}>{formatDate(release.published_at)}</span>
                    </div>
                    <div className={styles.releaseName}>{release.name || release.tag_name}</div>
                    <div className={styles.releaseBody}>
                      {truncateText(release.body, 100)}
                    </div>
                  </a>
                ))}
              </div>
              
              <div className={styles.dropdownFooter}>
                <a
                  href="https://github.com/datazip-inc/olake/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewMoreLink}
                >
                  View More Releases →
                </a>
              </div>
            </>
          ) : (
            <div className={styles.noReleases}>No releases found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReleasesBellNotification;

