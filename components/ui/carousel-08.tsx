"use client";

import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import type { PreviewProject } from "@/components/ui/work-preview-dialog";

// The cards' sizes from the design (280 x 460, 320 x 520, 370 x 600), each capped to the screen's height less the
// "See all" pop-up's heading and arrows, so a whole card shows without scrolling
const CARD_SIZE =
  "aspect-[37/60] h-[min(28.75rem,calc(100dvh-22rem))] min-h-72 sm:h-[min(32.5rem,calc(100dvh-22rem))] lg:h-[min(37.5rem,calc(100dvh-22rem))]";
const CARD_IMAGE_SIZES = "(min-width: 1024px) 370px, (min-width: 640px) 320px, 280px";

type AppleCardCarouselProps = {
  cards: PreviewProject[];
  // Above each card's title ("Digital")
  category: string;
  onSelect: (card: PreviewProject) => void;
};

// Every card of a work page in a strip that drags sideways, with arrows under it: "See all"
// (components/ui/see-all-work-dialog.tsx). From 21st.dev's carousel-08, with the page's work on the cards. The
// screenshots are mostly wider than the cards, so each shows whole, between its title and its arrow, over a blurred
// copy of itself instead of being cropped.
const AppleCardCarousel = ({ cards, category, onSelect }: AppleCardCarouselProps) => {
  return (
    <div className="w-full">
      {/* Card Strip */}
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-6 px-4 py-4 sm:px-8">
          {cards.map((card) => (
            <CarouselItem key={card.title} className="basis-auto pl-6">
              {/* Opens the card's preview */}
              <button
                type="button"
                onClick={() => onSelect(card)}
                aria-label={`Preview: ${card.title}`}
                className={`group relative flex ${CARD_SIZE} cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border bg-neutral-900 p-6 text-left transition-transform duration-300 outline-none hover:scale-102 focus-visible:ring-4 focus-visible:ring-ring/50 sm:p-8`}
              >
                <Image
                  src={card.thumbnail}
                  alt=""
                  fill
                  sizes={CARD_IMAGE_SIZES}
                  className="scale-110 object-cover blur-2xl brightness-50"
                />
                <div className="relative z-10 flex flex-col gap-3 text-white sm:gap-4">
                  <p className="text-sm font-medium sm:text-base">{category}</p>
                  <p className="line-clamp-3 text-2xl leading-tight font-medium tracking-tight sm:text-3xl">{card.title}</p>
                </div>

                <div className="relative my-5 min-h-0 flex-1">
                  <Image src={card.thumbnail} alt={card.title} fill sizes={CARD_IMAGE_SIZES} className="object-contain" />
                </div>

                <div className="relative z-10 flex justify-end">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs transition-colors group-hover:bg-white/80"
                  >
                    <ArrowUpRight className="h-4 w-4 text-black transition-transform duration-300 will-change-transform group-hover:rotate-45" />
                  </span>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Controls />
      </Carousel>
    </div>
  );
};

// Bottom-right controls, inside the carousel so they share its state
const Controls = () => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  return (
    <div className="mt-6 flex justify-end gap-2 px-4 sm:px-8">
      <Button
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="h-10 w-10 rounded-full bg-background shadow-xs"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous projects</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="h-10 w-10 rounded-full bg-background shadow-xs"
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next projects</span>
      </Button>
    </div>
  );
};

export default AppleCardCarousel;
