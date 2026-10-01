// Inline script for the root layout (app/layout.tsx), run before any Next.js code.
//
// A bug in GoHighLevel's chat (seen September 2026): it calls scrollToBottom() before its first message is in the
// list, which throws "Cannot read properties of undefined (reading 'tagName')". Nothing breaks, since there's
// nothing to scroll yet, so this keeps that one known error from surfacing as a crash: the Next.js error overlay
// in development, an "Uncaught (in promise)" console error in production. Every other error still gets through.
//
// Listeners on window run in the order they were added, so this has to be registered before Next.js adds its own,
// which is why it can't live inside the chat component.
export const ignoreKnownGhlWidgetBug = `window.addEventListener("unhandledrejection", function (event) {
  var reason = event.reason;
  var stack = (reason && reason.stack) || "";
  if (
    reason instanceof TypeError &&
    reason.message.indexOf("'tagName'") !== -1 &&
    stack.indexOf("scrollToBottom") !== -1 &&
    stack.indexOf("widgets.leadconnectorhq.com") !== -1
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});`;
