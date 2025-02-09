module.exports = function tailwindPlugin(context, options) {
  return {
    name: 'tailwind-plugin',
    // corePlugins: {
    //   preflight: false,
    // },
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer')
      ]
      return postcssOptions
    }
  }
}
