// Suppress the "ResizeObserver loop completed with undelivered notifications." browser error.
// It is benign: Chrome prints it whenever a ResizeObserver callback causes a reflow that triggers
// another ResizeObserver notification in the same frame. It confuses developers (and shows in
// webpack-dev-server's overlay) without breaking anything.
//
// Two mechanisms, both for exactly the ResizeObserver messages and nothing else:
//   1. stop the global `error` event from propagating, and
//   2. drop matching console.error calls.
// (This file replaces the former suppress-resize-observer.js, which did the same job.)
if (typeof window !== 'undefined') {
  const isResizeObserverNoise = (msg) =>
    typeof msg === 'string' &&
    (msg.includes('ResizeObserver loop completed with undelivered notifications') ||
      msg.includes('ResizeObserver loop limit exceeded'))

  window.addEventListener('error', (e) => {
    if (isResizeObserverNoise(e && e.message)) {
      e.stopImmediatePropagation()
    }
  })

  const originalConsoleError = console.error
  console.error = function (...args) {
    if (isResizeObserverNoise(args[0])) return
    originalConsoleError.apply(console, args)
  }
}
