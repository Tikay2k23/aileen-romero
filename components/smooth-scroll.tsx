"use client";

import ReactLenis from "lenis/react";
import type { LenisOptions } from "lenis";
import "lenis/dist/lenis.css";

const OPTIONS: LenisOptions = {
  // Steps aside inside GoHighLevel's chat (components/ghl-chat-widget.tsx), so its messages scroll
  prevent: (node) => node.nodeName === "CHAT-WIDGET",
  // Something that scrolls on its own, like the Automation page's workflow canvas, keeps the wheel while it can
  allowNestedScroll: true,
  // A click through to another page stops a glide still in progress, so it can't carry on over the new page
  stopInertiaOnNavigate: true,
};

// Smooth scrolling for the page it's rendered on (the home page and the work pages). Other components reach it
// with useLenis() from "lenis/react".
export default function SmoothScroll() {
  return <ReactLenis root options={OPTIONS} />;
}
