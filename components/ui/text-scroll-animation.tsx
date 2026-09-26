"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import "lenis/dist/lenis.css";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { InteractiveHoverLinks } from "@/components/ui/interactive-hover-links";
import { CircularCarousel, type CarouselItem } from "@/components/ui/circular-carousel";
import HeroSectionwithCards from "@/components/ui/hero-with-cards";
import AboutBento from "@/components/ui/about-bento";
import PageGlow from "@/components/page-glow";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};


const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-[0.27em]")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};


const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};


const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-Math.abs(distanceFromCenter) * 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  );
};

const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: targetRef2 });
  const { scrollYProgress: scrollYProgress3 } = useScroll({ target: targetRef3 });


  const text = "see more from Aileen";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);
  // Letters are grouped per word so a line can only wrap between words
  const words = text.split(" ");
  const wordStarts = words.map((_, w) => (w === 0 ? 0 : words.slice(0, w).join(" ").length + 1));


  const macIcon = [
    "https://cdn.21st.dev/assets/mirror/1d/1d364b72c9eaf1fe37d17ca88cd8fb541308dc0f3b09e2ab3b824f380b3493d5.svg",
    "https://cdn.21st.dev/assets/mirror/2f/2f86fca501dfed321a62f28743f29d9dd738dac91668eac5260ab746d1ef8840.svg",
    "https://cdn.21st.dev/assets/mirror/c6/c6c80c9ba890e199e94d35340fb4cf2d5790f339d9846800d68283e3e58e6031.svg",
    "https://cdn.21st.dev/assets/mirror/3b/3bf8cceead820aec50d4ee825a3fd02c5a1cd6665cc9cf4cbf3d9c8861a204bb.svg",
    "https://cdn.21st.dev/assets/mirror/66/6698757ee85997e8167b2eacaff8395d6987954185488f2e90b88ef387fec6c7.svg",
    "https://cdn.21st.dev/assets/mirror/b1/b17d2a2b592a06252efef522d5205f0c7a958f748d40df1011ed081417e42f85.svg",

  ];
  const iconCenterIndex = Math.floor(macIcon.length / 2);

  const services: CarouselItem[] = [
    {
      id: "lead-generation",
      title: "Lead Generation System",
      description:
        "I connect ads, landing pages, forms, CRM, follow-ups, and appointment booking into one automated lead system.",
    },
    {
      id: "ai-appointment",
      title: "AI Appointment System",
      description:
        "I build AI systems that qualify leads, collect details, check availability, book appointments, and update the CRM.",
    },
    {
      id: "client-intake",
      title: "Client Intake System",
      description:
        "I automate applications, data processing, CRM updates, pipeline movement, notifications, and follow-ups.",
    },
    {
      id: "sales-pipeline",
      title: "Automated Sales Pipeline",
      description:
        "I create sales pipelines that qualify leads, manage opportunities, automate follow-ups, and move prospects toward conversion.",
    },
    {
      id: "customer-onboarding",
      title: "Customer Onboarding System",
      description:
        "I automate payments, CRM updates, account setup, welcome sequences, internal tasks, and client access.",
    },
    {
      id: "reporting",
      title: "Reporting System",
      description:
        "I connect ads, analytics, CRM, attribution, and dashboards to track marketing and sales performance.",
    },
  ];

  const portfolioLinks = [
    {
      heading: "Automation",
      subheading: "CRM systems, workflows, funnels, and automated customer journeys.",
      imgSrc:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
    {
      heading: "Intelligence",
      subheading: "AI-powered workflows, APIs, webhooks, and connected systems.",
      imgSrc:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
    {
      heading: "Growth",
      subheading: "Meta Ads, Google Ads, tracking, optimization, and lead generation.",
      imgSrc:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
    {
      heading: "Digital",
      subheading: "Conversion-focused websites, landing pages, and digital experiences.",
      imgSrc:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
    {
      heading: "Creative",
      subheading: "Video editing, graphic design, content creation, and marketing visuals.",
      imgSrc:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
    {
      heading: "Engineering",
      subheading: "Full-stack applications, databases, and scalable digital solutions.",
      imgSrc:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop",
      href: "#",
    },
  ];

  return (
    <ReactLenis root>
      <section className="w-full">
        {/* Block 1 — text */}
        <div
          ref={targetRef}
          className="relative isolate box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
        >
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <div
            className="font-geist w-full max-w-4xl text-center text-[clamp(1.5rem,7vw,3.75rem)] leading-none font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {words.map((word, w) => (
              <React.Fragment key={w}>
                {w > 0 && (
                  <CharacterV1
                    char=" "
                    index={wordStarts[w] - 1}
                    centerIndex={centerIndex}
                    scrollYProgress={scrollYProgress}
                  />
                )}
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, i) => (
                    <CharacterV1
                      key={i}
                      char={char}
                      index={wordStarts[w] + i}
                      centerIndex={centerIndex}
                      scrollYProgress={scrollYProgress}
                    />
                  ))}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Block 2 — icons */}
        <div
          ref={targetRef2}
          className="relative isolate -mt-[100vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
        >
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <p className="font-geist flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-12 text-black" />
            <span className="font-geist font-medium">my fav tech stack</span>
            <Bracket className="h-12 scale-x-[-1] text-black" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {macIcon.map((char, index) => (
              <CharacterV2
                key={index}
                char={char}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress2}
              />
            ))}
          </div>
        </div>

        {/* Block 3 — icons (rotating variant) */}
        <div
          ref={targetRef3}
          className="relative isolate -mt-[95vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden p-[2vw]"
        >
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <p className="font-geist flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <Bracket className="h-12 text-black" />
            <span className="font-geist font-medium">my fav tech stack</span>
            <Bracket className="h-12 scale-x-[-1] text-black" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8" style={{ perspective: "500px" }}>
            {macIcon.map((char, index) => (
              <CharacterV3
                key={index}
                char={char}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress3}
              />
            ))}
          </div>
        </div>

        {/* Block 4 — about bento grid, pulled up over Block 3's trailing scroll space */}
        <div className="relative isolate -mt-[85vh]">
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <AboutBento />
        </div>

        {/* Block 5 — fanned photo cards */}
        <div className="relative isolate">
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <HeroSectionwithCards />
        </div>

        {/* Block 6 — services carousel.
            Clipped horizontally so the outer cards can't cause side-scroll on narrow screens */}
        <div className="relative isolate overflow-x-clip px-4 py-16 md:py-24">
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-medium tracking-tight text-balance md:text-6xl">
              Systems I Can Build From End to End
            </h2>
            <p className="text-base text-muted-foreground">
              Ways I can help bring your brand to life, from first sketch to final launch.
            </p>
          </div>
          <CircularCarousel items={services} className="mt-16" />
        </div>

        {/* Block 7 — hover links */}
        <div className="relative isolate">
          <PageGlow className="absolute top-1/2 -translate-y-1/2" />
          <InteractiveHoverLinks links={portfolioLinks} />
        </div>
      </section>
    </ReactLenis>
  );
};

export { CharacterV1, CharacterV2, CharacterV3, Skiper31 };

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
      <path
        fill="#000"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      />
    </svg>
  );
};
