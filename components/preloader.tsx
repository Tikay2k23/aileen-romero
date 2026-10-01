"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import IntroAnimation from "@/components/ui/scroll-morph-hero";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The intro belongs to the home page: landing directly on a work page skips it.
  // Only the first page load decides; the layout (and this state) persists across client navigation.
  const [visible, setVisible] = useState(() => !pathname.startsWith("/work/"));

  // Keep the page behind from scrolling while the intro plays
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
      window.scrollTo(0, 0);
    };
  }, [visible]);

  return (
    <>
      {/* Remount on reveal so the page's entrance animations play as the intro fades */}
      <Fragment key={visible ? "intro" : "revealed"}>{children}</Fragment>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="preloader"
            // Stop Lenis smooth scroll from moving the page behind the intro
            data-lenis-prevent
            className="fixed inset-0 z-[60]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <IntroAnimation onComplete={() => setVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
