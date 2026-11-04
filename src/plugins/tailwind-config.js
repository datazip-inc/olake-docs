// Tailwind CSS v4 through PostCSS. The theme, sources and plugins are declared in src/css/custom.css
// (CSS-first config). Vendor prefixing is handled by @tailwindcss/postcss, so autoprefixer is gone.
module.exports = function tailwindPlugin() {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [require('@tailwindcss/postcss')]
      return postcssOptions
    }
  }
}
