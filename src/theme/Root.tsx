import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import GitHubStars from '@site/src/components/GitHubStars';

// This component wraps the entire app and allows us to run initialization code
export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to try mounting the GitHub stars component
    const tryMount = () => {
      const container = document.getElementById('github-stars-react-container');
      if (container && !container.hasChildNodes()) {
        const root = createRoot(container);
        root.render(<GitHubStars />);
      }
    };

    // Try mounting immediately
    tryMount();

    // Set up an observer to watch for the container to appear
    const observer = new MutationObserver(() => {
      tryMount();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}