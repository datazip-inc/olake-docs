/**
 * Non-blocking Font Loader
 * Loads fonts AFTER initial render to prevent blocking
 */
(function() {
  'use strict';
  
  // Load font stylesheet asynchronously after page renders
  function loadFontStylesheet() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
    link.media = 'all';
    
    // Add to head
    document.head.appendChild(link);
    
    // Listen for load event
    link.onload = function() {
      // Font stylesheet loaded, now wait for fonts to be available
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() {
          document.documentElement.classList.add('fonts-loaded');
        });
      } else {
        // Fallback for older browsers
        setTimeout(function() {
          document.documentElement.classList.add('fonts-loaded');
        }, 100);
      }
    };
  }
  
  // Load fonts after DOM content is loaded but don't block initial render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Small delay to ensure critical render path is not blocked
      setTimeout(loadFontStylesheet, 100);
    });
  } else {
    // DOM already loaded
    setTimeout(loadFontStylesheet, 100);
  }
  
})();
