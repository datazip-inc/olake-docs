const path = require('path')

/**
 * Docusaurus plugin that aliases the internal useWindowSize hook
 * so the navbar mobile/desktop breakpoint becomes 1279px (Tailwind xl)
 * instead of the default 996px.
 */
module.exports = function navbarBreakpointPlugin() {
  return {
    name: 'navbar-breakpoint',

    configureWebpack() {
      return {
        resolve: {
          alias: {
            // Redirect the compiled hook to our custom version
            [path.resolve(
              __dirname,
              '../../../node_modules/@docusaurus/theme-common/lib/hooks/useWindowSize.js'
            )]: path.resolve(__dirname, 'useWindowSize.js')
          }
        }
      }
    }
  }
}
