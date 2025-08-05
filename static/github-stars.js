// GitHub Stars Component Script
(function() {
  'use strict';

  // Wait for DOM to be ready
  function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Create GitHub Stars Component
  function createGitHubStars() {
    const container = document.createElement('div');
    container.className = 'github-stars-container';
    
    const link = document.createElement('a');
    link.href = 'https://github.com/datazip-inc/olake';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'github-stars-link';
    
    const iconBox = document.createElement('div');
    iconBox.className = 'github-icon-box';
    
    const icon = document.createElement('div');
    icon.className = 'github-icon';
    
    const starsSection = document.createElement('div');
    starsSection.className = 'stars-section';
    
    const starEmoji = document.createElement('span');
    starEmoji.className = 'star-emoji';
    starEmoji.textContent = '⭐';
    
    const countSpan = document.createElement('span');
    countSpan.className = 'stars-count';
    countSpan.textContent = '...';
    
    iconBox.appendChild(icon);
    starsSection.appendChild(starEmoji);
    starsSection.appendChild(countSpan);
    link.appendChild(iconBox);
    link.appendChild(starsSection);
    container.appendChild(link);
    
    return { container, countSpan };
  }

  // Fetch GitHub stars
  async function fetchGitHubStars() {
    try {
      const response = await fetch('https://api.github.com/repos/datazip-inc/olake', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'OLake-Docs'
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('GitHub API rate limited, showing fallback');
          return null;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.stargazers_count;
    } catch (err) {
      console.error('Failed to fetch GitHub stars:', err);
      return null;
    }
  }

  // Initialize GitHub Stars
  async function initGitHubStars() {
    try {
      const targetContainer = await waitForElement('#github-stars-container');
      if (!targetContainer) return;
      
      const { container, countSpan } = createGitHubStars();
      targetContainer.appendChild(container);
      
      // Fetch and update star count
      const starCount = await fetchGitHubStars();
      if (starCount !== null && starCount > 0) {
        countSpan.textContent = starCount.toLocaleString();
      } else {
        // Hide stars section if no stars or error
        const starsSection = container.querySelector('.stars-section');
        if (starsSection) {
          starsSection.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('Failed to initialize GitHub stars:', err);
    }
  }

  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGitHubStars);
  } else {
    initGitHubStars();
  }
})(); 