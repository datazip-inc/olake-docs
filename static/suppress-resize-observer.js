// Suppress ResizeObserver warnings
window.addEventListener('error', function(e) {
  if (e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    e.stopImmediatePropagation();
    return false;
  }
});

// Alternative approach: Override console.error for ResizeObserver warnings
const originalError = console.error;
console.error = function(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
    return; // Suppress this specific error
  }
  originalError.apply(console, args);
}; 