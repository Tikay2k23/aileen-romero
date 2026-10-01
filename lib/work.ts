// The six areas of work: listed on the home page ("Ideas Turned Into Systems.") and each given its own page at
// /work/[slug]

export type WorkProject = {
  title: string;
  link: string;
  thumbnail: string;
};

export type WorkArea = {
  slug: string;
  name: string;
  // One-liner shown under the name in the home page list
  summary: string;
  // Image that follows the cursor when it's hovered in the home page list
  image: string;
  headline: string;
  description: string;
  // The hero shown above the cards: the workflow builder (components/automation-hero.tsx), the interactive 3D
  // robot (components/ui/robot-hero.tsx), the scroll-driven cinematic card
  // (components/ui/cinematic-landing-hero.tsx), the phone that climbs over the headline
  // (components/digital-hero.tsx), the floating image collage (components/creative-hero.tsx) or the terminal
  // that types out a deployment (components/engineering-hero.tsx)
  hero: "workflow" | "robot" | "cinematic" | "phone" | "collage" | "terminal";
  // Parallax cards on its page: three rows of five. Images in public/work/<slug>/ replace the placeholder photos
  // (lib/work-images.ts)
  projects: WorkProject[];
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

// Every card leads to the "Let's work together" panel on the home page
const project = (title: string, photoId: string): WorkProject => ({
  title,
  link: "/#contact",
  thumbnail: unsplash(photoId),
});

export const WORK_AREAS: WorkArea[] = [
  {
    slug: "automation",
    name: "Automation",
    summary: "CRM systems, workflows, funnels, and automated customer journeys.",
    image: unsplash("1460925895917-afdab827c52f"),
    headline: "Workflows that follow up, so you don't have to",
    description:
      "I build CRM systems, workflows, funnels, and automated customer journeys that capture leads, book appointments, and keep every client moving forward.",
    hero: "workflow",
    projects: [
      project("Workflow Architecture", "1531403009284-440f080d1e12"),
      project("Lead Routing", "1544197150-b99a580bb7a8"),
      project("Pipeline Automation", "1611224923853-80b023f02d71"),
      project("Appointment Booking", "1563986768609-322da13575f3"),
      project("Email Automation", "1486312338219-ce68d2c6f44d"),
      project("SMS Follow-Up", "1512941937669-90a1b58e7e9c"),
      project("Lead Nurturing", "1533750349088-cd871a92f312"),
      project("Client Onboarding", "1600880292203-757bb62b4baf"),
      project("Reminder Systems", "1434030216411-0b793f4b4173"),
      project("Re-engagement Campaigns", "1516321318423-f06f85e504b3"),
      project("Internal Notifications", "1553877522-43269d4ea984"),
      project("Webhooks & API Integrations", "1451187580459-43490279c0fa"),
      project("Custom Fields & Data Mapping", "1454165804606-c3d57bc86b40"),
      project("Customer Journeys", "1552664730-d307ca884978"),
      project("Payment Workflows", "1563013544-824ae1b704d3"),
    ],
  },
  {
    slug: "intelligence",
    name: "Intelligence",
    summary: "AI-powered workflows, APIs, webhooks, and connected systems.",
    image: unsplash("1677442136019-21780ecad995"),
    headline: "AI that actually connects to your operations",
    description:
      "AI-powered workflows, APIs, webhooks, and connected systems that qualify leads, process data, and update your CRM without anyone lifting a finger.",
    hero: "robot",
    projects: [
      project("AI Appointment Setters", "1485827404703-89b55fcc595e"),
      project("AI Lead Qualification", "1535378620166-273708d44e4c"),
      project("Conversational AI", "1620712943543-bcc4688e7485"),
      project("AI Follow-Up", "1655720828018-edd2daec9349"),
      project("AI Content Workflows", "1677442136019-21780ecad995"),
      project("Automated Data Processing", "1526374965328-7f61d4dc18c5"),
      project("AI Recommendation Systems", "1639322537228-f710d846310a"),
      project("Webhook-Based AI Workflows", "1604869515882-4d10fa4b0492"),
      project("CRM + AI Integrations", "1550751827-4bd374c3f58b"),
      project("Form → AI → CRM Workflows", "1518770660439-4636190af475"),
      project("AI-Assisted Development", "1531297484001-80022131f5a1"),
      project("AI Chat Assistants", "1535303311164-664fc9ec6532"),
      project("API Integrations", "1558494949-ef010cbdcc31"),
      project("Connected Systems", "1573164713988-8665fc963095"),
      project("AI Reporting Insights", "1526628953301-3e589a6a8b74"),
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    summary: "Meta Ads, Google Ads, tracking, optimization, and lead generation.",
    image: unsplash("1551288049-bebda4e38f71"),
    headline: "Campaigns built to capture, track, and convert",
    description:
      "Meta Ads, Google Ads, tracking, and optimization that turn ad spend into measurable leads, booked calls, and real revenue.",
    hero: "cinematic",
    projects: [
      project("Meta Ads Campaigns", "1611926653458-09294b3142bf"),
      project("Google Ads Campaigns", "1556155092-490a1ba16284"),
      project("Conversion Tracking", "1504868584819-f8e8b4b6d7e3"),
      project("Pixel & Event Setup", "1559526324-593bc073d938"),
      project("Lead Generation", "1557838923-2985c318be48"),
      project("Retargeting Funnels", "1519389950473-47ba0277781c"),
      project("Campaign Optimization", "1591696205602-2f950c417cb9"),
      project("Attribution Reporting", "1551650975-87deedd944c3"),
      project("Analytics Dashboards", "1551288049-bebda4e38f71"),
      project("A/B Testing", "1512486130939-2c4f79935e4f"),
      project("Audience Targeting", "1522071820081-009f0129c71c"),
      project("Budget & Bid Strategy", "1460925895917-afdab827c52f"),
      project("Growth Strategy", "1542744173-8e7e53415bb0"),
      project("Local Lead Generation", "1556742049-0cfed4f6a45d"),
      project("Performance Reviews", "1557804506-669a67965ba0"),
    ],
  },
  {
    slug: "digital",
    name: "Digital",
    summary: "Conversion-focused websites, landing pages, and digital experiences.",
    image: unsplash("1547658719-da2b51169166"),
    headline: "Websites and funnels designed to convert",
    description:
      "Conversion-focused websites, landing pages, and digital experiences wired directly into your CRM, automation, and analytics.",
    hero: "phone",
    projects: [
      project("Landing Pages", "1559028012-481c04fa702d"),
      project("Sales Funnels", "1432888498266-38ffec3eaf0a"),
      project("Lead Generation Pages", "1593642632559-0c6d3fc62b89"),
      project("Appointment Funnels", "1558655146-9f40138edfeb"),
      project("Application Funnels", "1586717791821-3f44a563fa4c"),
      project("Webinar Pages", "1467232004584-a241de8bcf5d"),
      project("Service Websites", "1609921212029-bb5a28e60960"),
      project("Responsive Design", "1547658719-da2b51169166"),
      project("Forms & Surveys", "1522542550221-31fd19575a2d"),
      project("Conversion CTAs", "1581291518857-4e27b48ff24e"),
      project("CRM-Connected Sites", "1603468620905-8de7d86b781e"),
      project("Site Architecture", "1600132806370-bf17e65e942f"),
      project("Webflow Builds", "1543286386-713bdd548da4"),
      project("WordPress & Elementor", "1498050108023-c5249f4df085"),
      project("GoHighLevel Websites", "1559136555-9303baea8ebd"),
    ],
  },
  {
    slug: "creative",
    name: "Creative",
    summary: "Video editing, graphic design, content creation, and marketing visuals.",
    image: unsplash("1574717024653-61fd2cf4d44d"),
    headline: "Visuals that stop the scroll",
    description:
      "Video editing, graphic design, content creation, and marketing visuals that give every campaign a polished, on-brand look.",
    hero: "collage",
    projects: [
      project("Video Editing", "1574717024653-61fd2cf4d44d"),
      project("Short-Form Content", "1492619375914-88005aa9e8fb"),
      project("Promo Videos", "1485846234645-a62644f84728"),
      project("Cinematic Edits", "1478720568477-152d9b164e26"),
      project("Motion Graphics", "1579165466741-7f35e4755660"),
      project("Graphic Design", "1561070791-2526d30994b5"),
      project("Brand Identity", "1611532736597-de2d4265fba3"),
      project("Social Media Graphics", "1618005182384-a83a8bd57fbe"),
      project("Ad Creatives", "1614850523459-c2f4c699c52e"),
      project("Content Creation", "1492691527719-9d1e07e534b4"),
      project("Photography", "1516035069371-29a1b244cc32"),
      project("Presentation Design", "1556761175-5973dc0f32e7"),
      project("Brochures & Print", "1553484771-371a605b060b"),
      project("Audio Editing", "1598488035139-bdbb2231ce04"),
      project("AI Avatar Videos", "1535223289827-42f1e9919769"),
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    summary: "Full-stack applications, databases, and scalable digital solutions.",
    image: unsplash("1555066931-4365d14bab8c"),
    headline: "Full-stack systems built to scale",
    description:
      "Full-stack applications, databases, and scalable digital solutions engineered around the way your business actually works.",
    hero: "terminal",
    projects: [
      project("Full-Stack Web Apps", "1555066931-4365d14bab8c"),
      project("Client Portals", "1573495627361-d9b87960b12d"),
      project("Admin Dashboards", "1580894894513-541e068a3e2b"),
      project("REST APIs", "1627398242454-45a1465c2479"),
      project("Database Design", "1605379399642-870262d3d051"),
      project("Authentication & Access", "1629654297299-c8506221ca97"),
      project("Payment Integrations", "1515879218367-8466d910aaa4"),
      project("Internal Tools", "1544256718-3bcf237f3974"),
      project("Data Migrations", "1542831371-29b0f74f9713"),
      project("Cloud Deployment", "1488590528505-98d2b5aba04b"),
      project("Scalable Architecture", "1581092580497-e0d23cbdf1dc"),
      project("Front-End Interfaces", "1633356122544-f134324a6cee"),
      project("Scripting & Integrations", "1624953587687-daf255b6b80a"),
      project("Performance Tuning", "1607799279861-4dd421887fb3"),
      project("Testing & QA", "1629904853716-f0bc54eea481"),
    ],
  },
];

export const workHref = (slug: string) => `/work/${slug}`;

export const getWorkArea = (slug: string) => WORK_AREAS.find((area) => area.slug === slug);
