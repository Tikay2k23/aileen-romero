import Script from "next/script";

// GoHighLevel's floating chat (Conversation AI answers inside it), on every page. Rendered once in the root
// layout, so it loads with the first page and stays put across client-side navigation. The widget ID is the
// public identifier from the embed code, not a credential. Open it from code with openGhlChat (lib/ghl-chat.ts).
export default function GhlChatWidget() {
  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6abbd92ef1b243568a7da205"
      // Loads once the page is idle, so it never delays the intro or first paint
      strategy="lazyOnload"
    />
  );
}
