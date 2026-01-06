const blogPluginExports = require('@docusaurus/plugin-content-blog')

// import { useBlogMetadata } from '@docusaurus/plugin-content-blog/client'

const defaultBlogPlugin = blogPluginExports.default

async function blogPluginExtended(...pluginArgs) {
  const blogPluginInstance = await defaultBlogPlugin(...pluginArgs)
  const pluginOptions = pluginArgs[1]

  return {
    // Add all properties of the default blog plugin so existing functionality is preserved
    ...blogPluginInstance,
    /**
     * Override the default `contentLoaded` hook to access blog posts data
     */
    contentLoaded: async function (params) {
      const { content, actions } = params


      async function createRecentPostModule(blogPost, index) {
        return {
          // Inject the metadata you need for each recent blog post
          blogData: await actions.createData(
            `home-page-recent-post-metadata-${index}.json`,
            JSON.stringify({
              metadata: blogPost.metadata
            })
          ),

          // Inject the MDX excerpt as a JSX component prop
          // (what's above the <!-- truncate --> marker)
          Preview: {
            __import: true,
            // The markdown file for the blog post will be loaded by webpack
            path: blogPost.metadata.source,
            query: {
              truncated: true
            }
          }
        }
      }

      // Call the default overridden `contentLoaded` implementation
      return blogPluginInstance.contentLoaded(params)
    },
    /**
     * Add custom routes for customer stories at /customers/... 
     */
    onRoutes: async function (routes) {
      if (pluginOptions.id === 'olake-blog') {
        const customerStorySlugs = [
          'customer-stories/cordial-real-time-data-sync',
          'customer-stories/astro-talk-lakehouse-transformation'
        ]

        // Find routes for customer stories and duplicate them at /customers/...
        routes.forEach((route) => {
          if (route.path && route.path.startsWith('/blog/customer-stories/')) {
            const storyName = route.path.split('/').pop()
            const customerRoute = `/customers/${storyName}`
            
            // Add duplicate route at /customers/...
            routes.push({
              ...route,
              path: customerRoute,
            })
          }
        })
      }
    }
  }
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginExtended
}
