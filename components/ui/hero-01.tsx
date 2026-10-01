import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider from "@/components/ui/hero-01-utils/brand-slider";
import type { Tool } from "@/components/ui/tool-icons";
import type { AvatarList } from "@/components/ui/hero-01-utils/hero";

export default function AgencyHeroSection() {
  const avatarList: AvatarList[] = [
    {
      image:
        "https://cdn.21st.dev/assets/localized/59a2b5a0dfc1531e2d1ea42d71ae8615f37582e1f8a17e4a1b1aff9afc7ef878.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/c7097eeb66ad097b6e5f9dbb95ae857cd6b55c0ad398c1ea84f3ab90a02c631e.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/c70d48e47d3a2d79ad07d16bff3aa3cff686580be031b6102cad73a15b47d8fd.jpg",
    },
    {
      image:
        "https://cdn.21st.dev/assets/localized/51c9ed392f6e7fce7fd85a78648e3e06bfdcd91999ab5fa48485888231589abf.jpg",
    },
  ];

  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      // Highlighted until the page reaches About; after that the highlight follows the section in view
      href: "#",
    },
    {
      title: "About",
      // The About cards after "my fav tech stack" (components/ui/text-scroll-animation.tsx)
      href: "#about",
    },
    {
      title: "Services",
      // The capability pillars (components/capability-pillars.tsx)
      href: "#services",
    },
    {
      title: "Work",
      // The "My Work" list below the pillars (components/capability-pillars.tsx)
      href: "#work",
    },
    {
      title: "Contact",
      // The "Let's work together" panel after the pillars (components/capability-pillars.tsx)
      href: "#contact",
    },
  ];

  // The marquee under the hero: the same tool marks as "Ready to Connect Your Tools?", grouped by kind
  // (automation, CRM, AI, ads and analytics, payments, websites)
  const tools: Tool[] = [
    "n8n",
    "zapier",
    "make",
    "hubspot",
    "claude",
    "openai",
    "meta",
    "googleads",
    "googleanalytics",
    "stripe",
    "wordpress",
    "webflow",
    "elementor",
    "wix",
    "godaddy",
  ];

  return (
    <div className="relative">
      <Header navigationData={navigationData} />
      <main>
        <HeroSection avatarList={avatarList} />
        <BrandSlider tools={tools} />
      </main>
    </div>
  );
}
