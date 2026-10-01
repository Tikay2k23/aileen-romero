// Opens GoHighLevel's floating chat (components/ghl-chat-widget.tsx) from our own buttons, through the API the
// widget puts on window. The widget loads when the page is idle, or on the first interaction, so a click that
// comes first waits for it, for up to 10 seconds.

type GhlChatWidgetApi = { openWidget?: () => void; isLoaded?: boolean };

export function openGhlChat() {
  const giveUpAt = Date.now() + 10_000;
  const tryToOpen = () => {
    const chat = (window as Window & { leadConnector?: { chatWidget?: GhlChatWidgetApi } }).leadConnector
      ?.chatWidget;
    if (chat?.openWidget && chat.isLoaded !== false) chat.openWidget();
    else if (Date.now() < giveUpAt) setTimeout(tryToOpen, 200);
  };
  tryToOpen();
}
