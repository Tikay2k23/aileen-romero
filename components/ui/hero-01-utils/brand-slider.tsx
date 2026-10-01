"use client";
import { Marquee } from "@/components/ui/hero-01-utils/marquee";
import { motion } from "motion/react";
import { ToolIcon, TOOL_NAMES, type Tool } from "@/components/ui/tool-icons";

function BrandSlider({ tools }: { tools: Tool[] }) {
  return (
    <section>
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            className="flex flex-col gap-3"
          >
            <div className="flex justify-center text-center py-3 md:py-4 relative">
              <div className="flex items-center justify-center gap-4">
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-l from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
                {/* The marks are the tools themselves, not clients: the line says so */}
                <p className="text-sm font-normal sm:px-2 px-10 text-muted-foreground text-center">
                  The tools I connect into one system
                </p>
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-r from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
              </div>
            </div>
            {tools.length > 0 && (
              // The same tiles as the floating icons in "Ready to Connect Your Tools?"
              // (components/contact-cta-section.tsx), solid rather than blurred since they never stop moving.
              // Room above and below for their shadows; the ends fade out.
              <Marquee pauseOnHover className="[--duration:30s] [--gap:1.5rem] px-0 py-4 mask-x-from-90%">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    title={TOOL_NAMES[tool]}
                    className="flex size-14 items-center justify-center rounded-2xl border border-border/10 bg-card p-3 shadow-lg md:size-16"
                  >
                    <ToolIcon tool={tool} className="size-7 text-foreground md:size-8" />
                    <span className="sr-only">{TOOL_NAMES[tool]}</span>
                  </div>
                ))}
              </Marquee>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
