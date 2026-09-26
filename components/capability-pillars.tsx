"use client";

import type { CSSProperties } from "react";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import PageGlow from "@/components/page-glow";
import { LetsWorkTogether } from "@/components/ui/lets-work-section";
import { cn } from "@/lib/utils";

// Each panel needs a solid background: the next pillar swings in over the pinned one
type Tone = "orange" | "dark" | "light";

const TONES: Record<
  Tone,
  { style: CSSProperties; rule: string; muted: string; chip: string; highlightChip: string }
> = {
  orange: {
    style: { backgroundColor: "var(--color-orange-500)", color: "#fff" },
    rule: "border-white/30",
    // labels stay full white here: dimming them would cut contrast on orange further
    muted: "text-white",
    chip: "border-white/35 bg-white/10",
    highlightChip: "border-white/60 bg-white/20",
  },
  dark: {
    style: { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" },
    rule: "border-white/15",
    muted: "text-white/60",
    chip: "border-white/15 bg-white/5",
    highlightChip: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  },
  light: {
    style: { backgroundColor: "var(--background)", color: "var(--foreground)" },
    rule: "border-black/10",
    muted: "text-muted-foreground",
    chip: "border-border bg-white/70",
    highlightChip: "border-orange-500/40 bg-orange-500/10",
  },
};

type Group = {
  label: string;
  items: string[];
  // chips: capability tags; tools: platforms/technologies set in larger type
  kind: "chips" | "tools";
  highlight?: boolean;
};

type Pillar = {
  number: string;
  category: string;
  heading: string;
  // statement: a full sentence in the heading slot, set smaller and not uppercased
  headingStyle?: "display" | "statement";
  tone: Tone;
  columns: "wide-narrow" | "even";
  groups: Group[];
};

const PILLARS: Pillar[] = [
  {
    number: "01",
    category: "Marketing Automation",
    heading: "GoHighLevel Automation & Marketing Systems",
    tone: "orange",
    columns: "wide-narrow",
    groups: [
      {
        label: "Capabilities",
        kind: "chips",
        items: [
          "Workflow Architecture",
          "Triggers & Actions",
          "Conditional Logic",
          "If/Else Routing",
          "Lead Routing",
          "Tags",
          "Custom Fields",
          "Opportunities",
          "Pipeline Automation",
          "Appointment Automation",
          "Email Automation",
          "SMS Automation",
          "Lead Nurturing",
          "Client Onboarding",
          "Reminder Systems",
          "Re-engagement Campaigns",
          "Internal Notifications",
          "Automated Follow-Up",
          "AI Appointment Setters",
          "Webhooks",
          "API Integrations",
          "JSON/Data Mapping",
        ],
      },
      {
        label: "Platforms",
        kind: "tools",
        items: ["GoHighLevel", "n8n", "Make", "Zapier"],
      },
    ],
  },
  {
    number: "02",
    category: "CRM Architecture",
    heading: "CRM Systems Built Around the Customer Journey",
    tone: "dark",
    columns: "even",
    groups: [
      {
        label: "Skills",
        kind: "chips",
        items: [
          "GoHighLevel CRM",
          "HubSpot",
          "Pipeline Architecture",
          "Opportunity Management",
          "Lifecycle Management",
          "Lead Segmentation",
          "Custom Fields",
          "Contact Management",
          "Tags",
          "Lead Assignment",
          "Automated Lead Routing",
          "Appointment Pipelines",
          "Sales Pipelines",
          "Client Intake Systems",
          "Client Onboarding Systems",
          "CRM Data Organization",
          "CRM Migration",
          "Database Structuring",
        ],
      },
      {
        label: "GoHighLevel Infrastructure",
        kind: "chips",
        highlight: true,
        items: [
          "Sub-accounts",
          "Snapshots",
          "SaaS Configurator",
          "SaaS Plans",
          "Stripe Rebilling",
          "Calendars",
          "Forms",
          "Surveys",
          "Memberships",
          "Courses",
          "Funnels",
          "Websites",
          "LC Phone",
          "A2P / 10DLC",
          "Email Deliverability",
          "SPF",
          "DKIM",
          "DMARC",
          "AI Chat",
          "Conversation AI",
        ],
      },
    ],
  },
  {
    number: "03",
    category: "Conversion-Focused Web Experiences",
    heading:
      "I build websites and funnels designed to connect directly with CRM, automation and analytics systems.",
    headingStyle: "statement",
    tone: "light",
    columns: "wide-narrow",
    groups: [
      {
        label: "Capabilities",
        kind: "chips",
        items: [
          "Landing Pages",
          "Sales Funnels",
          "Lead Generation Pages",
          "Appointment Funnels",
          "Application Funnels",
          "Webinar Pages",
          "Service Websites",
          "Responsive Design",
          "Forms",
          "Conversion CTAs",
          "CRM Integration",
          "Analytics Integration",
          "Automation Integration",
        ],
      },
      {
        label: "Platforms",
        kind: "tools",
        items: ["GoHighLevel", "Webflow", "WordPress", "Elementor", "Wix", "GoDaddy"],
      },
    ],
  },
  {
    number: "04",
    category: "AI-Augmented Systems",
    heading: "AI That Actually Connects to Business Operations",
    tone: "orange",
    columns: "wide-narrow",
    groups: [
      {
        label: "Capabilities",
        kind: "chips",
        items: [
          "AI Appointment Setters",
          "AI Lead Qualification",
          "Conversational AI",
          "AI Follow-Up",
          "AI Content Workflows",
          "Automated Data Processing",
          "AI Recommendation Systems",
          "AI-Assisted Development",
          "Webhook-Based AI Workflows",
          "CRM + AI Integrations",
          "Form → AI → CRM Workflows",
        ],
      },
      {
        label: "Technologies",
        kind: "tools",
        items: ["GoHighLevel AI", "Claude", "Codex", "Lovable", "HeyGen", "n8n", "Make", "Zapier"],
      },
    ],
  },
];

// Keep GSAP's pins in step with Lenis smooth scrolling: update on the same frame as each scroll
const syncScrollTrigger = () => ScrollTrigger.update();

export default function CapabilityPillars() {
  useLenis(syncScrollTrigger);

  return (
    <FlowArt aria-label="Capability pillars">
      {PILLARS.map((pillar) => {
        const tone = TONES[pillar.tone];
        return (
          <FlowSection
            key={pillar.number}
            aria-label={`Pillar ${pillar.number} — ${pillar.category}`}
            style={tone.style}
          >
            {pillar.tone === "light" && <PageGlow className="absolute top-1/2 -translate-y-1/2" />}

            <div className="flex flex-col gap-6 md:gap-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                Pillar {pillar.number} — {pillar.category}
              </p>
              <hr className={cn("border-0 border-t", tone.rule)} />
              <h2
                className={cn(
                  "font-bold tracking-tight text-balance",
                  pillar.headingStyle === "statement"
                    ? "max-w-5xl text-[clamp(1.75rem,4vw,4rem)] leading-[1.05]"
                    : "text-[clamp(2.25rem,6vw,6.5rem)] uppercase leading-[0.9]",
                )}
              >
                {pillar.heading}
              </h2>
            </div>

            <div className="flex flex-col gap-8 md:gap-10">
              <hr className={cn("border-0 border-t", tone.rule)} />
              <div
                className={cn(
                  "grid gap-10 lg:gap-16",
                  pillar.columns === "even" ? "lg:grid-cols-2" : "lg:grid-cols-[2fr_1fr]",
                )}
              >
                {pillar.groups.map((group) => (
                  <div key={group.label}>
                    <h3 className={cn("mb-4 text-sm font-bold uppercase tracking-wider", tone.muted)}>
                      {group.label}
                    </h3>
                    {group.kind === "chips" ? (
                      <ul className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-sm",
                              group.highlight ? tone.highlightChip : tone.chip,
                            )}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[clamp(1.25rem,2.2vw,2rem)] font-semibold tracking-tight">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FlowSection>
        );
      })}

      {/* Closing panel: swings in over the last pillar like the others */}
      <FlowSection aria-label="Let's work together" style={TONES.light.style}>
        <PageGlow className="absolute top-1/2 -translate-y-1/2" />
        <LetsWorkTogether className="min-h-0 flex-1" />
      </FlowSection>
    </FlowArt>
  );
}
