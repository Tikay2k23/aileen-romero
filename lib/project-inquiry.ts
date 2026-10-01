// The project inquiry form (components/ui/project-inquiry-modal.tsx): what it asks, how buttons open it, and
// where a finished inquiry goes

// Which button the visitor used to open the form
export type InquirySource = "lets-collaborate" | "get-started" | "contact-me" | "build-your-system";

export const PROJECT_TYPES = ["Automation", "AI", "Paid Ads", "Development", "Creative", "Systems"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const TIMELINES = ["ASAP", "Within 2–4 weeks", "Within 1–2 months", "Just exploring"] as const;
export const BUDGETS = ["Under $500", "$500–$1,000", "$1,000–$2,500", "$2,500+", "Not sure yet"] as const;

export const DESCRIPTION_MAX_LENGTH = 500;

export type ProjectInquiry = {
  projectTypes: ProjectType[];
  description: string;
  fullName: string;
  email: string;
  // The optional answers are empty strings when skipped
  company: string;
  website: string;
  timeline: string;
  budget: string;
  source?: InquirySource;
};

// Whether the form is open, and from which button. One form serves the whole site (components/project-inquiry.tsx
// renders it in the root layout), so this lives outside React for any button to reach.
type InquiryModalState = { open: boolean; source?: InquirySource };

const CLOSED: InquiryModalState = { open: false };
let modalState = CLOSED;
const listeners = new Set<() => void>();

function setModalState(next: InquiryModalState) {
  modalState = next;
  listeners.forEach((listener) => listener());
}

// Opens the form. `source` records which button was used and is sent along with the inquiry.
export function openProjectInquiry(source?: InquirySource) {
  setModalState({ open: true, source });
}

export function closeProjectInquiry() {
  // The source stays, so an inquiry sent while the form is closing still carries it
  setModalState({ ...modalState, open: false });
}

// For useSyncExternalStore
export const projectInquiryModal = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => modalState,
  getServerSnapshot: () => CLOSED,
};

// Sends a finished inquiry. NOT CONNECTED YET: this resolves without sending or storing the answers anywhere.
//
// To connect GoHighLevel, replace the body with a request to a route of this site, for example
//
//   const response = await fetch("/api/project-inquiry", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(inquiry),
//   });
//   if (!response.ok) throw new Error("The inquiry could not be sent");
//
// and have that route (app/api/project-inquiry/route.ts) forward the inquiry to a GoHighLevel inbound webhook,
// reading the webhook URL from a server-side environment variable so it never reaches the browser.
// Throwing here makes the form show an error and keep the visitor's answers.
export async function submitProjectInquiry(inquiry: ProjectInquiry): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.info("Project inquiry (not sent anywhere yet):", inquiry);
  }
}
