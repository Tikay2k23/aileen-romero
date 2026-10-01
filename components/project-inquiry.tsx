"use client";

import { useSyncExternalStore } from "react";
import { ProjectInquiryModal } from "@/components/ui/project-inquiry-modal";
import { closeProjectInquiry, projectInquiryModal } from "@/lib/project-inquiry";

// The site's one project inquiry form. Rendered once in the root layout, so every page has it; a button opens
// it with openProjectInquiry (lib/project-inquiry.ts).
export default function ProjectInquiry() {
  const { open, source } = useSyncExternalStore(
    projectInquiryModal.subscribe,
    projectInquiryModal.getSnapshot,
    projectInquiryModal.getServerSnapshot
  );

  return (
    <ProjectInquiryModal
      open={open}
      source={source}
      onOpenChange={(next) => {
        if (!next) closeProjectInquiry();
      }}
    />
  );
}
