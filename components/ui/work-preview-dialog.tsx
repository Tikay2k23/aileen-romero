"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { openProjectInquiry } from "@/lib/project-inquiry";
import { cn } from "@/lib/utils";

export type PreviewProject = {
  title: string;
  thumbnail: string;
  link?: string;
  linkLabel?: string;
};

type WorkPreviewDialogProps = {
  project: PreviewProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Above the title ("Work — Digital")
  eyebrow?: string;
  // The page's words for the link button ("Visit the site"); a project's own linkLabel wins
  linkLabel: string;
};

// The whole image, not cropped like on the card: its frame takes the image's own shape once it has loaded (16:10
// holds the place until then), up to a height cap that taller images are fitted inside. Gives way first on short
// screens.
function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [ratio, setRatio] = useState(16 / 10);
  return (
    <div className="relative max-h-[min(60dvh,36rem)] min-h-40 w-full shrink bg-muted" style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 56rem) 56rem, 100vw"
        className="object-contain"
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight);
        }}
      />
    </div>
  );
}

// A work page card opened large: the whole image, its title, a button out to the live project when it has a link,
// and a way to start one like it
export function WorkPreviewDialog({ project, open, onOpenChange, eyebrow, linkLabel }: WorkPreviewDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Over GoHighLevel's chat like the project form; data-lenis-prevent: the smooth scrolling leaves the wheel
            alone here */}
        <Dialog.Backdrop
          data-lenis-prevent
          className="fixed inset-0 z-[100000000] bg-black/60 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:fade-in-0 data-closed:fade-out-0 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        />
        <Dialog.Popup
          data-lenis-prevent
          className="fixed top-1/2 left-1/2 z-[100000000] flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background text-foreground shadow-2xl shadow-black/10 ring-1 ring-foreground/10 outline-none duration-300 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        >
          {project && (
            <>
              <PreviewImage key={project.thumbnail} src={project.thumbnail} alt={project.title} />
              <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
                <div className="min-w-0">
                  {eyebrow && (
                    <p className="mb-1.5 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
                  )}
                  <Dialog.Title className="text-xl leading-tight font-semibold tracking-tight text-balance md:text-2xl">
                    {project.title}
                  </Dialog.Title>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants(), "h-11 gap-2 rounded-full px-5")}
                    >
                      {project.linkLabel ?? linkLabel}
                      <ArrowUpRight aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    className="h-11 rounded-full px-5"
                    onClick={() => {
                      // The preview steps aside for the project form
                      onOpenChange(false);
                      openProjectInquiry("work-preview");
                    }}
                  >
                    Start a project like this
                  </Button>
                </div>
              </div>
            </>
          )}
          <Dialog.Close
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
