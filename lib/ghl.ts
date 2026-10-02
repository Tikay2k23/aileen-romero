import "server-only";
import type { InquirySource, ProjectInquiry } from "@/lib/project-inquiry";

// GoHighLevel (LeadConnector API v2), called only from the server: the private integration token is GHL_PRIVATE_TOKEN
// and the sub-account GHL_LOCATION_ID, in .env.local here and in the Vercel project's environment variables live.
const API = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

// Where a portfolio inquiry lands: the tag that marks the lead as coming from the portfolio, the pipeline whose
// first stage its opportunity opens in, and the contact custom fields (folder "Portfolio Project Inquiry") for
// the form's answers, by field key
const LEAD_TAG = "portfolio";
const LEAD_SOURCE = "Portfolio website";
const PIPELINE_NAME = "Portfolio Form";
const FIELD_KEYS = {
  projectTypes: "contact.project_types",
  description: "contact.project_description",
  timeline: "contact.project_timeline",
  budget: "contact.estimated_budget",
} as const;
type FormField = keyof typeof FIELD_KEYS;

// The button the visitor opened the form with, in words, for the note on the contact
const SOURCE_BUTTONS: Record<InquirySource, string> = {
  "lets-collaborate": "Let's Collaborate",
  "get-started": "Get Started",
  "contact-me": "Contact Me",
  "build-your-system": "Build Your System",
  "work-preview": "Start a project like this",
};

function settings() {
  const token = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) throw new Error("GHL_PRIVATE_TOKEN and GHL_LOCATION_ID are not set");
  return { token, locationId };
}

async function ghl<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${settings().token}`,
      Version: API_VERSION,
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GoHighLevel ${path}: ${response.status} ${(await response.text()).slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

// The custom field ids and the pipeline's first stage, looked up by key and name on each inquiry, so fields or a
// pipeline recreated in GoHighLevel under the same names keep working
async function locationSetup(locationId: string) {
  const [{ customFields }, { pipelines }] = await Promise.all([
    ghl<{ customFields: { id: string; fieldKey: string }[] }>(`/locations/${locationId}/customFields`),
    ghl<{ pipelines: { id: string; name: string; stages: { id: string }[] }[] }>(
      `/opportunities/pipelines?locationId=${locationId}`,
    ),
  ]);
  const fieldIds = Object.fromEntries(
    Object.entries(FIELD_KEYS).map(([field, key]) => [field, customFields.find((f) => f.fieldKey === key)?.id]),
  ) as Partial<Record<FormField, string>>;
  const pipeline = pipelines.find((p) => p.name.trim().toLowerCase() === PIPELINE_NAME.toLowerCase());
  return { fieldIds, pipelineId: pipeline?.id, stageId: pipeline?.stages[0]?.id };
}

// Everything the visitor wrote, kept on the contact: the custom fields hold only their latest answers
function note(inquiry: ProjectInquiry) {
  const button = inquiry.source ? SOURCE_BUTTONS[inquiry.source] : undefined;
  const answered = [
    ["Timeline", inquiry.timeline],
    ["Budget", inquiry.budget],
    ["Company", inquiry.company],
    ["Website", inquiry.website],
  ].filter(([, answer]) => answer);
  return [
    `Portfolio project inquiry${button ? `, sent from the "${button}" button` : ""}`,
    "",
    `Looking to build: ${inquiry.projectTypes.join(", ")}`,
    ...answered.map(([question, answer]) => `${question}: ${answer}`),
    "",
    "About the project:",
    inquiry.description,
  ].join("\n");
}

// A project inquiry into GoHighLevel: the contact (created, or updated when the email is already there) with the
// form's answers in its custom fields, then the portfolio tag, an opportunity in the Portfolio Form pipeline and a
// note with the whole inquiry. Throws when the contact can't be saved; the rest is logged if it fails, since the lead
// itself is in.
export async function sendInquiryToGhl(inquiry: ProjectInquiry) {
  const { locationId } = settings();
  const { fieldIds, pipelineId, stageId } = await locationSetup(locationId);

  const answers: Record<FormField, string | string[]> = {
    projectTypes: inquiry.projectTypes,
    description: inquiry.description,
    timeline: inquiry.timeline,
    budget: inquiry.budget,
  };
  const customFields = (Object.keys(answers) as FormField[])
    .filter((field) => fieldIds[field] && answers[field].length > 0)
    .map((field) => ({ id: fieldIds[field], field_value: answers[field] }));

  const [firstName, ...otherNames] = inquiry.fullName.split(/\s+/);
  const { contact } = await ghl<{ contact: { id: string } }>("/contacts/upsert", {
    locationId,
    firstName,
    lastName: otherNames.join(" ") || undefined,
    email: inquiry.email,
    companyName: inquiry.company || undefined,
    website: inquiry.website || undefined,
    source: LEAD_SOURCE,
    customFields,
  });

  const extras = await Promise.allSettled([
    // Its own call: tags sent with the contact would replace the ones a returning contact already has
    ghl(`/contacts/${contact.id}/tags`, { tags: [LEAD_TAG] }),
    ghl(`/contacts/${contact.id}/notes`, { body: note(inquiry) }),
    pipelineId && stageId
      ? ghl("/opportunities/", {
          locationId,
          pipelineId,
          pipelineStageId: stageId,
          contactId: contact.id,
          name: `${inquiry.fullName} (${inquiry.projectTypes.join(", ")})`,
          status: "open",
        })
      : Promise.reject(new Error(`No pipeline named "${PIPELINE_NAME}" in GoHighLevel`)),
  ]);
  for (const result of extras) {
    if (result.status === "rejected") console.error("[project inquiry] saved the contact, but:", result.reason);
  }
}
