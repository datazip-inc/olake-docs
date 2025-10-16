/**
 * Docusaurus Plugin: Trailing Slash Redirect
 * 
 * This plugin handles client-side redirects for URLs with trailing slashes.
 * It redirects /path/ to /path (without trailing slash) to maintain consistency
 * and improve SEO by ensuring a single canonical URL format.
 */

module.exports = function trailingSlashRedirectPlugin(context, options) {
  return {
    name: 'trailing-slash-redirect-plugin',
    
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: `
              (function() {
                // Check if current URL has a trailing slash (but not root /)
                var path = window.location.pathname;
                var hash = window.location.hash;
                var search = window.location.search;
                
                // Only redirect if:
                // 1. Path ends with /
                // 2. Path is not just "/" (root)
                if (path !== '/' && path.endsWith('/')) {
                  // Remove trailing slash and redirect
                  var newPath = path.slice(0, -1);
                  var newUrl = newPath + search + hash;
                  window.location.replace(newUrl);
                }
              })();
            `,
          },
        ],
      };
    },

    // Add global data for debugging
    async loadContent() {
      return {
        redirects: 'Trailing slash redirects enabled',
      };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
};

