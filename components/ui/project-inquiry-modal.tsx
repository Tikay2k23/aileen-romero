"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  CodeXml,
  Cpu,
  Layers,
  Settings,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  BUDGETS,
  DESCRIPTION_MAX_LENGTH,
  PROJECT_TYPES,
  TIMELINES,
  submitProjectInquiry,
  type InquirySource,
  type ProjectInquiry,
  type ProjectType,
} from "@/lib/project-inquiry";
import { cn } from "@/lib/utils";

const PROJECT_TYPE_ICONS: Record<ProjectType, React.ComponentType<{ className?: string }>> = {
  Automation: Settings,
  AI: Cpu,
  "Paid Ads": ChartNoAxesColumnIncreasing,
  Development: CodeXml,
  Creative: Video,
  Systems: Layers,
};

type FormValues = Omit<ProjectInquiry, "source">;

const EMPTY: FormValues = {
  projectTypes: [],
  description: "",
  fullName: "",
  email: "",
  company: "",
  website: "",
  timeline: "",
  budget: "",
};

// The answers the form insists on, in the order it asks for them
const REQUIRED = ["projectTypes", "description", "fullName", "email"] as const;
type RequiredField = (typeof REQUIRED)[number];
type FormErrors = Partial<Record<RequiredField, string>>;

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// What is still missing on each step
function projectErrors(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.projectTypes.length === 0) errors.projectTypes = "Select at least one.";
  if (!values.description.trim()) errors.description = "Tell me a little about your project.";
  return errors;
}

function contactErrors(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!EMAIL_FORMAT.test(values.email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}

// Shared by the text inputs, the dropdowns and the textarea. 16px text on phones keeps iOS from zooming in
// when a field is tapped.
const CONTROL =
  "w-full rounded-lg border border-border bg-background px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-foreground/40 focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 sm:text-sm";

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {children}
    </p>
  );
}

function TextField({
  label,
  note,
  error,
  ...input
}: { label: string; note?: string; error?: string } & React.ComponentProps<"input">) {
  const errorId = `${input.id}-error`;

  return (
    <div>
      <label htmlFor={input.id} className="text-xs font-medium">
        {label}
        {input.required && <span aria-hidden> *</span>}
        {note && <span className="font-normal text-muted-foreground"> ({note})</span>}
      </label>
      <input
        {...input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(CONTROL, "mt-1.5 h-11")}
      />
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  options,
  ...select
}: { label: string; placeholder: string; options: readonly string[] } & React.ComponentProps<"select">) {
  return (
    <div>
      <label htmlFor={select.id} className="text-xs font-medium">
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          {...select}
          // Greyed like a placeholder until something is chosen
          className={cn(
            CONTROL,
            "h-11 cursor-pointer appearance-none pr-10 [&>option]:text-foreground",
            !select.value && "text-muted-foreground"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}

export interface ProjectInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Which button opened the form; sent along with the inquiry
  source?: InquirySource;
}

// The project inquiry form, as a pop-up: two steps, then a confirmation.
// Above GoHighLevel's chat launcher (z-index 99999999), which would otherwise sit on top of the form.
export function ProjectInquiryModal({ open, onOpenChange, source }: ProjectInquiryModalProps) {
  const id = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"editing" | "submitting" | "failed" | "submitted">("editing");
  const submitted = status === "submitted";

  // Changing step, or reaching the confirmation, replaces what is on screen. Bring the form back to its top
  // (on a phone that means scrolling past the introduction above it) and take keyboard and screen reader focus
  // to the new heading.
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const formPaneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: formPaneRef.current?.offsetTop ?? 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, submitted]);

  // The control to go to when an answer is missing (the first project type stands for the whole group)
  const fieldIds: Record<RequiredField, string> = {
    projectTypes: `${id}-type`,
    description: `${id}-description`,
    fullName: `${id}-name`,
    email: `${id}-email`,
  };

  const set = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // An answer that is being changed is no longer reported as missing
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleProjectType = (type: ProjectType) => {
    const selected = values.projectTypes.includes(type);
    set(
      "projectTypes",
      PROJECT_TYPES.filter((each) => (each === type ? !selected : values.projectTypes.includes(each)))
    );
  };

  // Shows what is missing and goes to the first of it. True when nothing is.
  const passes = (found: FormErrors) => {
    setErrors(found);
    const firstMissing = REQUIRED.find((field) => found[field]);
    if (firstMissing) document.getElementById(fieldIds[firstMissing])?.focus();
    return !firstMissing;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      if (passes(projectErrors(values))) setStep(2);
      return;
    }

    if (!passes(contactErrors(values))) return;

    setStatus("submitting");
    try {
      await submitProjectInquiry({
        ...values,
        description: values.description.trim(),
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        website: values.website.trim(),
        source,
      });
      setStatus("submitted");
    } catch {
      setStatus("failed");
    }
  };

  const reset = () => {
    setStep(1);
    setValues(EMPTY);
    setErrors({});
    setStatus("editing");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      // A sent inquiry is cleared once the form has closed. An unfinished one is kept, so closing the form by
      // accident loses nothing.
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen && submitted) reset();
      }}
    >
      <Dialog.Portal>
        {/* data-lenis-prevent: the home page's smooth scrolling leaves the wheel alone over the form */}
        <Dialog.Backdrop
          data-lenis-prevent
          className="fixed inset-0 z-[100000000] bg-black/40 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:fade-in-0 data-closed:fade-out-0 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        />
        <Dialog.Popup
          ref={popupRef}
          // On narrow screens the avatar and introduction sit above the form. Focusing the pop-up itself there
          // (what Base UI does for touch) keeps the browser from scrolling past them to the first control.
          initialFocus={() => (window.matchMedia("(min-width: 48rem)").matches ? true : popupRef.current)}
          data-lenis-prevent
          className="fixed top-1/2 left-1/2 z-[100000000] flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background text-foreground shadow-2xl shadow-black/10 ring-1 ring-foreground/10 outline-none duration-300 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        >
          {/* Scrolls inside the pop-up when the screen is shorter than the form */}
          <div ref={scrollerRef} className="relative grid overflow-y-auto overscroll-contain md:grid-cols-[5fr_7fr]">
            <div className="flex flex-col gap-3 border-b border-border bg-muted/60 p-6 pr-14 md:justify-between md:gap-10 md:border-r md:border-b-0 md:p-8">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Project inquiry
              </p>
              {/* The avatar takes the room between the label and the heading on wide screens, and a set height
                  on phones. It is drawn as the largest square that fits that room, so it is never cropped or
                  stretched, and it adds nothing to the panel's height. Multiplying drops the picture's white
                  background into the panel's own, so no rectangle shows around it. */}
              <div className="-mr-8 flex h-36 items-end justify-center mix-blend-multiply [container-type:size] md:-my-6 md:mr-0 md:h-auto md:min-h-0 md:flex-1">
                <Image
                  src="/my-avatar.png"
                  alt="Portrait of Aileen Romero"
                  width={512}
                  height={512}
                  sizes="(min-width: 768px) 23rem, 9rem"
                  // The mask fades the artwork out before the bottom edge, where the picture is cut off
                  className="size-[min(100cqw,100cqh)] mask-b-from-78% mask-b-to-96% duration-500 fade-in-0 motion-safe:animate-in"
                />
              </div>
              <div>
                <Dialog.Title className="text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
                  <span className="block">Let&apos;s Build Something</span>
                  <span className="block">That Works.</span>
                </Dialog.Title>
                <Dialog.Description className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Tell me a little about your project, and I&apos;ll get back to you with the next steps.
                </Dialog.Description>
              </div>
            </div>

            {/* On wide screens, tall enough for the longer step with its error messages showing, so the pop-up
                keeps its size from one step to the next */}
            <div ref={formPaneRef} className="flex flex-col p-6 md:min-h-[37rem] md:p-8">
              {submitted ? (
                <div
                  role="status"
                  className="flex flex-1 flex-col items-start justify-center gap-5 py-6 duration-300 fade-in-0 motion-safe:animate-in"
                >
                  <span
                    aria-hidden
                    className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10"
                  >
                    <Check className="size-5" />
                  </span>
                  <div>
                    <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none">
                      Project received.
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      Thanks for reaching out. I&apos;ll review your project details and get back to you with the next
                      steps.
                    </p>
                  </div>
                  <Dialog.Close render={<Button variant="outline" className="h-11 gap-2 rounded-full px-5" />}>
                    Back to Portfolio
                    <ArrowRight aria-hidden />
                  </Dialog.Close>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col">
                  {/* Kept clear of the close button, which sits over this corner on wide screens and whenever a
                      phone has scrolled the form to the top */}
                  <div className="flex items-center gap-4 pr-10">
                    <p className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Step 0{step} / 02
                    </p>
                    <div aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-out motion-reduce:transition-none"
                        style={{ width: `${step * 50}%` }}
                      />
                    </div>
                  </div>

                  {/* Keyed, so each step fades in */}
                  <div
                    key={step}
                    className="mt-6 flex flex-1 flex-col duration-300 fade-in-0 motion-safe:animate-in"
                  >
                    {step === 1 ? (
                      <>
                        <div
                          role="group"
                          aria-labelledby={`${id}-types-heading`}
                          aria-describedby={errors.projectTypes ? `${id}-types-error` : undefined}
                        >
                          <h3
                            id={`${id}-types-heading`}
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-tight outline-none"
                          >
                            What are you looking to build?
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>

                          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                            {PROJECT_TYPES.map((type, index) => {
                              const Icon = PROJECT_TYPE_ICONS[type];
                              const selected = values.projectTypes.includes(type);

                              return (
                                <label key={type} className="relative cursor-pointer">
                                  <input
                                    id={index === 0 ? fieldIds.projectTypes : undefined}
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => toggleProjectType(type)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={cn(
                                      "flex h-[4.5rem] flex-col items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40",
                                      selected
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-border bg-background hover:border-foreground/30"
                                    )}
                                  >
                                    <Icon aria-hidden className="size-4" />
                                    {type}
                                  </span>
                                  {selected && (
                                    <span
                                      aria-hidden
                                      className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-background text-foreground"
                                    >
                                      <Check className="size-2.5" strokeWidth={3} />
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                          {errors.projectTypes && (
                            <ErrorText id={`${id}-types-error`}>{errors.projectTypes}</ErrorText>
                          )}
                        </div>

                        <div className="mt-6">
                          <label htmlFor={fieldIds.description} className="text-base font-semibold tracking-tight">
                            Tell me about your project
                          </label>
                          <p id={`${id}-description-hint`} className="mt-0.5 text-sm text-muted-foreground">
                            What are you trying to build, improve, or automate?
                          </p>
                          <textarea
                            id={fieldIds.description}
                            name="description"
                            rows={3}
                            required
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            value={values.description}
                            onChange={(event) => set("description", event.target.value)}
                            placeholder="Example: I need help setting up automations in GoHighLevel for lead follow-up and appointment booking..."
                            aria-invalid={errors.description ? true : undefined}
                            aria-describedby={[
                              `${id}-description-hint`,
                              `${id}-description-count`,
                              errors.description && `${id}-description-error`,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            className={cn(CONTROL, "mt-3 block resize-none py-3")}
                          />
                          <div className="flex items-start justify-between gap-4">
                            {errors.description ? (
                              <ErrorText id={`${id}-description-error`}>{errors.description}</ErrorText>
                            ) : (
                              <span />
                            )}
                            <p
                              id={`${id}-description-count`}
                              className="mt-1.5 text-xs text-muted-foreground tabular-nums"
                            >
                              <span className="sr-only">Characters used: </span>
                              {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                            </p>
                          </div>
                        </div>

                        <Button type="submit" className="mt-5 h-12 w-full gap-2 rounded-lg md:mt-auto">
                          Continue
                          <ArrowRight aria-hidden />
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3
                          ref={headingRef}
                          tabIndex={-1}
                          className="text-xl font-semibold tracking-tight outline-none"
                        >
                          Where can I reach you?
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Share your details so I can get back to you.
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <TextField
                            id={fieldIds.fullName}
                            name="name"
                            label="Full Name"
                            placeholder="Your name"
                            autoComplete="name"
                            required
                            value={values.fullName}
                            onChange={(event) => set("fullName", event.target.value)}
                            error={errors.fullName}
                          />
                          <TextField
                            id={fieldIds.email}
                            name="email"
                            type="email"
                            label="Work Email"
                            placeholder="you@company.com"
                            autoComplete="email"
                            required
                            value={values.email}
                            onChange={(event) => set("email", event.target.value)}
                            error={errors.email}
                          />
                          <TextField
                            id={`${id}-company`}
                            name="organization"
                            label="Company / Business"
                            placeholder="Your company name"
                            autoComplete="organization"
                            value={values.company}
                            onChange={(event) => set("company", event.target.value)}
                          />
                          <TextField
                            id={`${id}-website`}
                            name="url"
                            type="url"
                            label="Current Website"
                            note="Optional"
                            placeholder="https://yourwebsite.com"
                            autoComplete="url"
                            value={values.website}
                            onChange={(event) => set("website", event.target.value)}
                          />
                          <SelectField
                            id={`${id}-timeline`}
                            name="timeline"
                            label="Project Timeline"
                            placeholder="Select a timeline"
                            options={TIMELINES}
                            value={values.timeline}
                            onChange={(event) => set("timeline", event.target.value)}
                          />
                          <SelectField
                            id={`${id}-budget`}
                            name="budget"
                            label="Estimated Budget"
                            placeholder="Select a budget"
                            options={BUDGETS}
                            value={values.budget}
                            onChange={(event) => set("budget", event.target.value)}
                          />
                        </div>

                        {status === "failed" && (
                          <p role="alert" className="mt-4 text-sm text-destructive">
                            Something went wrong and your project wasn&apos;t sent. Please try again.
                          </p>
                        )}

                        <div className="mt-6 flex gap-2.5 md:mt-auto">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="h-12 gap-2 rounded-lg px-4"
                          >
                            <ArrowLeft aria-hidden />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={status === "submitting"}
                            className="h-12 flex-1 gap-2 rounded-lg"
                          >
                            {status === "submitting" ? (
                              "Sending…"
                            ) : (
                              <>
                                Submit Project
                                <ArrowRight aria-hidden />
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          <Dialog.Close
            // Stays in the corner while the form scrolls beneath it
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm"
              />
            }
          >
            <X aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
