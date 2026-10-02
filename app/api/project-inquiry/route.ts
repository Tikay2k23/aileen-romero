import { sendInquiryToGhl } from "@/lib/ghl";
import {
  BUDGETS,
  DESCRIPTION_MAX_LENGTH,
  INQUIRY_SOURCES,
  PROJECT_TYPES,
  TIMELINES,
  type ProjectInquiry,
} from "@/lib/project-inquiry";

// The form's rules (components/ui/project-inquiry-modal.tsx), checked again here since anyone can post to this
// route, plus a cap on the short answers, which the form leaves open
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ANSWER_MAX_LENGTH = 500;

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

// The inquiry in a request, or undefined when it isn't one the form could have sent
function inquiryIn(body: unknown): ProjectInquiry | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const sent = body as Record<string, unknown>;
  const text = (key: keyof ProjectInquiry) => {
    const value = sent[key];
    return typeof value === "string" ? value.trim() : "";
  };

  const types = sent.projectTypes;
  if (!Array.isArray(types) || !types.length || !types.every((type) => isOneOf(PROJECT_TYPES, type))) {
    return undefined;
  }
  const inquiry: ProjectInquiry = {
    projectTypes: PROJECT_TYPES.filter((type) => types.includes(type)),
    description: text("description"),
    fullName: text("fullName"),
    email: text("email"),
    company: text("company"),
    website: text("website"),
    timeline: text("timeline"),
    budget: text("budget"),
    source: isOneOf(INQUIRY_SOURCES, sent.source) ? sent.source : undefined,
  };

  const valid =
    inquiry.description.length > 0 &&
    inquiry.description.length <= DESCRIPTION_MAX_LENGTH &&
    inquiry.fullName.length > 0 &&
    EMAIL_FORMAT.test(inquiry.email) &&
    [inquiry.fullName, inquiry.email, inquiry.company, inquiry.website].every(
      (answer) => answer.length <= ANSWER_MAX_LENGTH,
    ) &&
    (!inquiry.timeline || isOneOf(TIMELINES, inquiry.timeline)) &&
    (!inquiry.budget || isOneOf(BUDGETS, inquiry.budget));
  return valid ? inquiry : undefined;
}

// A finished project inquiry from the form (submitProjectInquiry in lib/project-inquiry.ts), passed on to
// GoHighLevel (lib/ghl.ts)
export async function POST(request: Request) {
  const inquiry = inquiryIn(await request.json().catch(() => undefined));
  if (!inquiry) return Response.json({ error: "That isn't a complete project inquiry." }, { status: 400 });

  try {
    await sendInquiryToGhl(inquiry);
  } catch (error) {
    console.error("[project inquiry] not sent to GoHighLevel:", error);
    return Response.json({ error: "The inquiry couldn't be sent. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
