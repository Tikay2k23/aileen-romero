"use client";

import { useState } from "react";
import Script from "next/script";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

// GoHighLevel's booking calendar, from its embed code: the widget's address and the frame's id are public
// identifiers, not credentials. GoHighLevel's embed script sizes the frame to the calendar as it changes, and passes
// the page's query string (UTM tags) and a known visitor's details on to it.
const BOOKING_WIDGET_SRC = "https://api.leadconnectorhq.com/widget/booking/7yRI7pgSbj1dqm9AJWKI";
const BOOKING_FRAME_ID = "7yRI7pgSbj1dqm9AJWKI_1791208657845";
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";

type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// "Book a call" (components/ui/lets-work-section.tsx): the calendar in a pop-up over the page
export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  // The calendar loads the first time the pop-up opens, then stays loaded while it's closed, so reopening it is
  // instant and a booking half done isn't lost
  const [opened, setOpened] = useState(false);
  if (open && !opened) setOpened(true);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal keepMounted={opened}>
        {/* data-lenis-prevent: the home page's smooth scrolling leaves the wheel alone over the calendar */}
        <Dialog.Backdrop
          data-lenis-prevent
          className="fixed inset-0 z-[100000000] bg-black/40 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:fade-in-0 data-closed:fade-out-0 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        />
        <Dialog.Popup
          data-lenis-prevent
          className="fixed top-1/2 left-1/2 z-[100000000] flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-background text-foreground shadow-2xl shadow-black/10 ring-1 ring-foreground/10 outline-none duration-300 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 motion-safe:data-open:animate-in motion-safe:data-closed:animate-out"
        >
          <div className="border-b border-border px-6 py-5 pr-16 md:px-8">
            <Dialog.Title className="text-xl font-semibold tracking-tight md:text-2xl">
              Book a call
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              Pick a time that suits you for a 15-minute intro call.
            </Dialog.Description>
          </div>

          {/* Scrolls inside the pop-up when the calendar is taller than the screen. Its minimum height keeps the
              pop-up its size while GoHighLevel's script holds the frame back until the calendar is ready. */}
          <div className="relative min-h-[min(36rem,calc(100dvh-9rem))] flex-1 overflow-y-auto overscroll-contain">
            {/* Under the frame until the calendar has loaded over it */}
            <p className="absolute inset-x-0 top-16 text-center text-sm text-muted-foreground">
              Loading the calendar…
            </p>
            {opened && (
              <>
                <iframe
                  id={BOOKING_FRAME_ID}
                  src={BOOKING_WIDGET_SRC}
                  title="Book a call with Aileen Romero"
                  allow="payment"
                  scrolling="no"
                  className="relative block min-h-[36rem] w-full border-none"
                  style={{ overflow: "hidden" }}
                />
                {/* After the frame, as in the embed code: the script takes up the frames already on the page when
                    it loads */}
                <Script src={EMBED_SCRIPT_SRC} strategy="afterInteractive" />
              </>
            )}
          </div>

          <Dialog.Close
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm"
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
