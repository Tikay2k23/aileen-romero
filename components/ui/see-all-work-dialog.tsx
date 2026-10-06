"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppleCardCarousel from "@/components/ui/carousel-08";
import { WorkPreviewDialog, type PreviewProject } from "@/components/ui/work-preview-dialog";

type SeeAllWorkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: PreviewProject[];
  // The area of work ("Digital"), on each card and in the heading
  category: string;
  // Above the heading ("Work — Digital")
  eyebrow?: string;
  // The page's words for the preview's link button ("Visit the site")
  linkLabel: string;
};

// "See all" on a work page (components/ui/hero-parallax.tsx): every card of the page at once, in a pop-up over it. A
// card opens the same preview as on the page, on top of this one.
export function SeeAllWorkDialog({ open, onOpenChange, cards, category, eyebrow, linkLabel }: SeeAllWorkDialogProps) {
  // The card being previewed stays selected while its preview closes, so the content doesn't vanish mid-fade
  const [selected, setSelected] = useState<PreviewProject | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Over GoHighLevel's chat like the other pop-ups; data-lenis-prevent: the smooth scrolling leaves the
            wheel alone here */}
        <Dialog.Backdrop
          data-lenis-prevent
          className="fixed inset-0 z-[100000000] bg-black/60 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:fade-in-0 data-closed:fade-out-0 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        />
        <Dialog.Popup
          data-lenis-prevent
          className="fixed inset-0 z-[100000000] flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground outline-none duration-300 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out sm:inset-4 sm:rounded-2xl sm:shadow-2xl sm:shadow-black/10 sm:ring-1 sm:ring-foreground/10"
        >
          {/* Centered on tall screens; scrolls when the screen is shorter than the cards' smallest size */}
          <div className="my-auto w-full py-10">
            {/* Header */}
            <div className="mb-8 px-4 pr-16 sm:px-8 sm:pr-20">
              {eyebrow && (
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{eyebrow}</p>
              )}
              <Dialog.Title className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                All {category} work
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground sm:text-base">
                {cards.length} projects. Drag or use the arrows to see them all.
              </Dialog.Description>
            </div>

            <AppleCardCarousel
              cards={cards}
              category={category}
              onSelect={(card) => {
                setSelected(card);
                setPreviewOpen(true);
              }}
            />
          </div>

          <Dialog.Close
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm sm:top-6 sm:right-6"
              />
            }
          >
            <X aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Inside this pop-up, so it opens on top of it and closing it comes back here */}
          <WorkPreviewDialog
            project={selected}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            eyebrow={eyebrow}
            linkLabel={linkLabel}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
