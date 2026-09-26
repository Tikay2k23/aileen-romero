"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsSmallScreen } from "@/hooks/use-is-small-screen";

const CARDS = [
  {
    src: "https://cdn.21st.dev/assets/mirror/ed/edd19d13042044af90896aa49454fd94633be73d902f850bd80ff53fe9159fc0.jpg",
    alt: "Friends",
    rotate: -22,
    delay: 0.9,
    z: 10,
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/45/45f4b5aacc49de8658492182ce5cffa21e90cf0b1868442839ecbbf4693674e4.jpg",
    alt: "Woman portrait",
    rotate: -11,
    delay: 0.75,
    z: 20,
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/9c/9c9c1151f81291748bccb80f58590233532232cdc39b898c4aab39f6f251cac5.jpg",
    alt: "Man portrait",
    rotate: 0,
    delay: 0.6,
    z: 30,
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/43/439e3c68fb4bbed585233d79d1dc5486deb32f2327499891fa2304041e507120.jpg",
    alt: "Portrait",
    rotate: 11,
    delay: 0.75,
    z: 20,
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/dc/dc8074c97db7347ac21eb4779f03d4f4041b6ae9e87e32c3c2fd364781259c9e.jpg",
    alt: "Street style",
    rotate: 22,
    delay: 0.9,
    z: 10,
  },
];

// Mid-page section: entrance animations wait until it scrolls into view instead of playing on mount
const inView = { once: true, amount: 0.3 } as const;

// Horizontal gap between fanned cards; tighter on phones, paired with the smaller mobile card size
const CARD_SPACING = 120;
const CARD_SPACING_SMALL = 50;

const HeroSectionwithCards: React.FC = () => {
  const cardSpacing = useIsSmallScreen() ? CARD_SPACING_SMALL : CARD_SPACING;

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center pt-10 pb-0 text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white max-w-2xl leading-tight tracking-tight"
        >
          Create{" "}
          <em className="font-bold italic text-zinc-700 dark:text-zinc-300">
            Social Content
          </em>
          <br />
          that&apos;s ready to perform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.5, delay: 0.38, ease: "easeOut" }}
          className="mt-5 text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed"
        >
          Create, schedule, and optimize your entire social strategy in minutes,
          not hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.4, delay: 0.52 }}
          className="mt-8"
        >
          <Button className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer">
            <span className="relative z-10 transition-all duration-500">
              Try it Free
            </span>
            <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Button>
        </motion.div>

        <div className="relative mt-10 flex h-[300px] w-full items-end justify-center sm:h-[380px]">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: card.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-0 origin-bottom"
              style={{
                rotate: card.rotate,
                zIndex: card.z,
                translateX: `${(i - 2) * cardSpacing}px`,
              }}
            >
              <Card className="w-36 h-56 sm:w-48 sm:h-72 md:w-56 md:h-80 p-0 overflow-hidden shadow-xl ring-2 ring-white/60 dark:ring-zinc-700/60 border-0 rounded-2xl">
                <CardContent className="p-0 w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionwithCards;
