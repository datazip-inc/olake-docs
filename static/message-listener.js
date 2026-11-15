// static/message-listener.js
// Embedded in the OLake UI docs panel (an iframe), the UI scrolls this page to a source form section by
// changing the #hash. Animate those jumps there only; prefers-reduced-motion still forces 'auto'.
if (window.self !== window.top) {
  document.documentElement.style.scrollBehavior = 'smooth'
}

// When the site is embedded in an iframe, the parent window can switch the theme by posting
// { theme: 'light' | 'dark' }. Only those two values are accepted: the message can come from any
// origin, so it must not be able to write arbitrary text into the data-theme attribute.
window.addEventListener('message', (event) => {
  const theme = event.data && event.data.theme
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme)
  }
})
