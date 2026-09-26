"use client";

import { useMotionValue, motion, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface InteractiveHoverLinksProps {
  links?: typeof INTERACTIVE_LINKS;
}

export function InteractiveHoverLinks({ links = INTERACTIVE_LINKS,
}: InteractiveHoverLinksProps) {
  return (
    <section className="p-4 md:px-8 md:py-16 w-full">
      <div className="mx-auto max-w-5xl">
        {links.map((link) => (
          <Link key={link.heading} {...link} />
        ))}
      </div>
    </section>
  );
};

interface LinkProps {
  heading: string;
  imgSrc: string;
  subheading: string;
  href: string;
}

function Link({ heading, imgSrc, subheading, href }: LinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "40%"]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const rect = ref.current!.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b-2 border-muted py-4 transition-colors duration-500 hover:border-foreground md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-10 block text-4xl font-bold text-muted-foreground transition-colors duration-500 group-hover:text-foreground md:text-6xl"
        >
          {/* Letters grouped per word: a lone space in its own inline-block collapses to nothing,
              so words get real spaces between them and can only wrap at those spaces */}
          {heading.split(" ").map((word, w, words) => (
            <React.Fragment key={w}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((l, i) => (
                  <motion.span
                    variants={{
                      initial: { x: 0 },
                      whileHover: { x: 16 },
                    }}
                    transition={{ type: "spring" }}
                    className="inline-block"
                    key={i}
                  >
                    {l}
                  </motion.span>
                ))}
              </span>
              {w < words.length - 1 && " "}
            </React.Fragment>
          ))}
        </motion.span>
        <span className="relative z-10 mt-2 block text-base text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-10%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg" },
          whileHover: { scale: 1, rotate: "12.5deg" },
        }}
        transition={{ type: "spring" }}
        src={imgSrc}
        className="absolute z-0 h-24 w-32 rounded-lg object-cover shadow-lg md:h-48 md:w-64"
        alt={`Image representing ${heading}`}
      />
      <div className="overflow-hidden">
        <motion.div
          variants={{
            initial: {
              x: "100%",
              opacity: 0,
            },
            whileHover: {
              x: "0%",
              opacity: 1,
            },
          }}
          transition={{ type: "spring" }}
          className="relative z-10 p-4"
        >
          <ArrowRight className="size-8 text-foreground md:size-12" />
        </motion.div>
      </div>
    </motion.a>
  );
};

export const INTERACTIVE_LINKS = [
  {
    heading: "Services",
    subheading: "Discover what we offer",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/6a/6a8dafee634763ec77f3660430e416b605bc385b48a93106a5960c37f36d782a.jpg",
    href: "#",
  },
  {
    heading: "Team",
    subheading: "Meet the amazing people behind it",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/f3/f306e609793c7aee5e89377d8af8325e3cf2117da7a6b8713587bdc7116b8884.jpg",
    href: "#",
  },
  {
    heading: "Projects",
    subheading: "Explore our recent work",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/18/18b91c11d5e76aef735bb1ed896ac562c4058dfaaf6a110219cea15088942569.jpg",
    href: "#",
  },
  {
    heading: "Careers",
    subheading: "Join our growing team",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/8b/8bd175d566cc60ee871979454d299f373bf1423c52ea503aa5e9d27be674db1b.jpg",
    href: "#",
  },
  {
    heading: "Playground",
    subheading: "Fun experiments and side projects",
    imgSrc:
      "https://cdn.21st.dev/assets/mirror/82/82c9d1289f610153dcba6e3ba8f8e5a1a3f4978043303a5d1df36d50079dc2cf.jpg",
    href: "#",
  },
];
