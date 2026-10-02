"use client";

import type * as React from "react";
import PageGlow from "@/components/page-glow";
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from "@/components/ui/floating-icons-hero-section";
import { ToolIcon, type Tool } from "@/components/ui/tool-icons";
import { openProjectInquiry } from "@/lib/project-inquiry";

// The floating icons take a component: one per tool
function toolIcon(tool: Tool) {
  const Icon = (props: React.SVGProps<SVGSVGElement>) => <ToolIcon tool={tool} {...props} />;
  Icon.displayName = `ToolIcon(${tool})`;
  return Icon;
}

// Positions from the original component, minus the one that sat on top of the text.
// Smaller screens show fewer icons (7 → 9 → 12 → 15) so none collide with the text or each
// other; the always-visible slots hold the core tools.
const ICONS: FloatingIconsHeroProps["icons"] = [
  { id: 1, icon: toolIcon("n8n"), className: "top-[10%] left-[10%]" },
  { id: 2, icon: toolIcon("zapier"), className: "top-[5%] left-[30%]" },
  { id: 3, icon: toolIcon("make"), className: "top-[5%] left-[55%]" },
  { id: 4, icon: toolIcon("hubspot"), className: "top-[14%] right-[18%]" },
  { id: 5, icon: toolIcon("claude"), className: "top-[80%] left-[10%]" },
  { id: 6, icon: toolIcon("webflow"), className: "bottom-[10%] right-[10%]" },
  { id: 7, icon: toolIcon("meta"), className: "bottom-[5%] right-[45%]" },
  { id: 8, icon: toolIcon("wordpress"), className: "hidden md:block bottom-[8%] left-[25%]" },
  { id: 9, icon: toolIcon("googleads"), className: "hidden md:block top-[75%] right-[25%]" },
  { id: 10, icon: toolIcon("openai"), className: "hidden lg:block top-[20%] right-[8%]" },
  { id: 11, icon: toolIcon("stripe"), className: "hidden lg:block top-[50%] right-[5%]" },
  { id: 12, icon: toolIcon("elementor"), className: "hidden lg:block top-[55%] left-[5%]" },
  { id: 13, icon: toolIcon("googleanalytics"), className: "hidden xl:block top-[5%] right-[30%]" },
  { id: 14, icon: toolIcon("wix"), className: "hidden xl:block top-[40%] left-[15%]" },
  // Anchored to the bottom (was top-[90%]) so it can't be cut off on shorter screens
  { id: 15, icon: toolIcon("godaddy"), className: "hidden xl:block bottom-[2%] left-[70%]" },
];

export default function ContactCtaSection() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      <FloatingIconsHero
        title="Ready to Connect Your Tools?"
        subtitle="I connect GoHighLevel, n8n, Make, Zapier, HubSpot and the rest of your stack into one system that runs your marketing and sales."
        ctaText="Contact Me"
        // Without JavaScript: the "Let's work together" panel, from the home page or a work page
        ctaHref="/#contact"
        onCtaClick={() => openProjectInquiry("contact-me")}
        icons={ICONS}
      />
    </div>
  );
}
