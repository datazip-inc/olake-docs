// static/message-listener.js
window.addEventListener("message", (event) => {
    if (event.data?.theme) {
      document.documentElement.setAttribute("data-theme", event.data.theme);
      console.log("Theme changed to:", event.data.theme);
    }
  });
  