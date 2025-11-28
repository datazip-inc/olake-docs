import React from 'react';
import { createRoot } from 'react-dom/client';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ReleasesBellNotification from '../components/ReleasesBellNotification';

function mountReleasesBell() {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  // Wait for navbar to be available
  const checkAndMount = () => {
    const navbar = document.querySelector('.navbar__items--right');
    
    if (!navbar) {
      // Retry after a short delay
      setTimeout(checkAndMount, 100);
      return;
    }

    // Check if already mounted
    if (document.getElementById('releases-bell-container')) {
      return;
    }

    // Find the GitHub link to insert before the "Talk to us" button
    const githubLink = navbar.querySelector('.header-github-link');
    
    if (githubLink) {
      // Create container for our bell
      const bellContainer = document.createElement('div');
      bellContainer.id = 'releases-bell-container';
      bellContainer.style.display = 'flex';
      bellContainer.style.alignItems = 'center';
      
      // Insert after GitHub link
      githubLink.parentNode?.insertBefore(bellContainer, githubLink.nextSibling);
      
      // Mount React component
      const root = createRoot(bellContainer);
      root.render(<ReleasesBellNotification />);
    }
  };

  checkAndMount();
}

export function onRouteDidUpdate() {
  mountReleasesBell();
}

// Also mount on initial load
if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('load', mountReleasesBell);
  // Try immediately as well
  mountReleasesBell();
}

