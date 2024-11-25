import { message as webixMessage } from "webix";

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.error('Unhandled rejection:', event.reason);
  webixMessage(event.reason, "error", 5000)
});

window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global error caught:", { message, source, lineno, colno, error });
  webixMessage(message, "error", 5000)
};
