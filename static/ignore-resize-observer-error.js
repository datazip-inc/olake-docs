// Suppress the "ResizeObserver loop completed with undelivered notifications." browser error
// This error is benign, but Chrome prints it whenever a ResizeObserver callback
// causes a reflow that in turn triggers another synchronous ResizeObserver event.
// It tends to appear frequently during development (e.g. in webpack-dev-server's
// overlay) and can confuse developers even though it does not break anything.
//
// We listen for the global `error` event and stop the propagation for this
// specific ResizeObserver message so that it never reaches the console.
// ------------------------------
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    const msg = e?.message
    if (
      msg === 'ResizeObserver loop completed with undelivered notifications.' ||
      msg === 'ResizeObserver loop limit exceeded'
    ) {
      // Prevent the message from showing in the console
      e.stopImmediatePropagation()
    }
  })
}
