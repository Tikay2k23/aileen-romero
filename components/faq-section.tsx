import PageGlow from "@/components/page-glow";
import { FAQChatAccordion, type FAQItem } from "@/components/ruixen/faq-chat-accordion";

// Draft answers built from the site's own services copy; edit to taste
const FAQS: FAQItem[] = [
  {
    question: "What kind of systems do you build?",
    answer:
      "Connected marketing and sales systems: CRM pipelines, automated follow-ups, funnels, AI appointment setters, and the integrations that tie them together.",
  },
  {
    question: "Which platforms do you work with?",
    answer:
      "Mostly GoHighLevel, plus HubSpot, n8n, Make and Zapier for automation, and Webflow, WordPress, Elementor, Wix or GoDaddy for websites.",
  },
  {
    question: "Can you connect the tools I already use?",
    answer:
      "Yes. I link existing tools through native integrations, webhooks and APIs, and can migrate your CRM data when it's time to switch.",
  },
  {
    question: "Do you build AI into your systems?",
    answer:
      "Where it helps, yes: AI appointment setters, lead qualification, conversational AI and follow-ups that plug straight into your CRM.",
  },
  {
    question: "Do you also run ads and create content?",
    answer:
      "Yes. I set up and optimize Meta and Google Ads with proper tracking, and handle video editing, graphic design and marketing visuals.",
  },
];

export default function FaqSection() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      <FAQChatAccordion title="Have questions?" items={FAQS} />
    </div>
  );
}
