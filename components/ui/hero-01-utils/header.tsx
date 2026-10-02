"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BrandIcon } from "@/components/ui/brand-icons";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/hero-01-utils/logo";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight } from "lucide-react";
import { openProjectInquiry } from "@/lib/project-inquiry";
import { setSectionNavigator } from "@/lib/section-nav";

// The header's height (h-20). It always shows this close to the top of the page.
const HEADER_HEIGHT = 80;
// Hidden, it sits this far up: past its own height, so the pill's shadow goes too
const HIDDEN_Y = -HEADER_HEIGHT * 1.5;

export type NavigationSection = {
  title: string;
  // "#" for the top of the page, otherwise a section's id, e.g. "#about"
  href: string;
};

// The nav item to highlight: the section furthest down the page whose top has come up past 40% of the screen, or
// the item for the top of the page ("#") above all of them
function findActiveHref(navigationData: NavigationSection[]) {
  const line = window.innerHeight * 0.4;
  let activeHref = "#";
  let activeSection: HTMLElement | null = null;
  for (const { href } of navigationData) {
    const section = href.length > 1 && href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    if (!section || section.getBoundingClientRect().top > line) continue;
    // Furthest down wins, whatever order the nav lists them in
    if (!activeSection || activeSection.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) {
      activeHref = href;
      activeSection = section;
    }
  }
  return activeHref;
}

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const CollaborateButton = ({ className, onClick }: { className?: string; onClick: () => void }) => (
  <Button onClick={onClick} className={cn("relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden", className, "cursor-pointer")}>
    <span className="relative z-10 transition-all duration-500">
      Let&apos;s Collaborate
    </span>
    <span className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
      <ArrowUpRight size={16} />
    </span>
  </Button>
);

const Header = ({ navigationData, className }: HeaderProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Slid up out of view while the page scrolls down, back as soon as it scrolls up
  const [hidden, setHidden] = useState(false);
  // The highlighted nav item follows the section in view
  const [activeHref, setActiveHref] = useState("#");
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();
  // The page's smooth scrolling (components/smooth-scroll.tsx); undefined until it starts
  const lenis = useLenis();
  // A section of the page picked in the mobile menu: the menu closes first, then the page goes there (it can't
  // scroll while the menu is open)
  const pendingSection = useRef<string | null>(null);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setSticky(y >= 50);
    setActiveHref(findActiveHref(navigationData));
    if (y < HEADER_HEIGHT) setHidden(false);
    else if (y > lastScrollY.current) setHidden(true);
    else if (y < lastScrollY.current) setHidden(false);
    lastScrollY.current = y;
  }, [navigationData]);

  // A nav link's jump to its section ("#" for the top of the page). That isn't the visitor scrolling up, so
  // whichever way the page moved, the header stays out of the way of the section's top.
  const goToSection = useCallback(
    (section: string) => {
      const toTop = section === "#";
      const target = toTop ? null : document.querySelector(section);
      if (!toTop && !target) return;
      // The address names the section; the top of the page goes without
      const hash = toTop ? "" : section;
      if (location.hash !== hash) history.pushState(null, "", hash || location.pathname);
      const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
      // Through the smooth scrolling when it's running: a jump made behind its back is undone by a glide still in
      // progress, or forgotten by its next scroll
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo(0, top);
      lastScrollY.current = window.scrollY;
      setHidden(window.scrollY >= HEADER_HEIGHT);
    },
    [lenis],
  );

  // Links elsewhere on the page (the footer's) jump the same way
  useEffect(() => {
    setSectionNavigator(goToSection);
    return () => setSectionNavigator(null);
  }, [goToSection]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <>
      {/* Holds the header's room at the top of the hero: the header itself is fixed, so it stays with the visitor
          through every section */}
      <div aria-hidden className="h-20" />
      <motion.header
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: hidden ? HIDDEN_Y : 0 }}
        transition={{
          opacity: { duration: 0.7, ease: "easeInOut" },
          y: { duration: reduceMotion ? 0 : 0.4, ease: "easeInOut" },
        }}
        // Tabbing into the hidden header brings it back
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) setHidden(false);
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-4 flex items-center justify-center h-20",
          className,
        )}
      >
        <div
          className={cn(
            "w-full max-w-6xl flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
            sticky
              ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
              : "bg-transparent border-transparent",
          )}
        >
          {/* Logo */}
          <div>
            <a href="#">
              <Logo className="gap-3" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div>
            <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
              <NavigationMenuList className="flex gap-0">
                {navigationData.map((navItem) => (
                  <NavigationMenuItem key={navItem.title}>
                    <NavigationMenuLink
                      href={navItem.href}
                      aria-current={navItem.href === activeHref ? "location" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        goToSection(navItem.href);
                      }}
                      className={cn("px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal", navItem.href === activeHref ? "bg-background text-foreground" : "")}
                    >
                      {navItem.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop CTA */}
          <div className="flex gap-4">
            <CollaborateButton
              className="hidden lg:flex"
              onClick={() => openProjectInquiry("lets-collaborate")}
            />

            <div className="lg:hidden">
              <Sheet
                open={isOpen}
                onOpenChange={setIsOpen}
                onOpenChangeComplete={(open) => {
                  const section = pendingSection.current;
                  if (open || !section) return;
                  pendingSection.current = null;
                  goToSection(section);
                }}
              >
                <SheetTrigger id="mobile-menu-trigger">
                  <span className="rounded-full border border-border p-2 block">
                    <Menu
                      width={20}
                      height={20}
                    />
                    <span className="sr-only">Menu</span>
                  </span>
                </SheetTrigger>

                <SheetContent
                  showCloseButton={false}
                  side="right"
                  data-lenis-prevent
                  className="p-0 data-[side=right]:w-full data-[side=right]:sm:w-96 data-[side=right]:border-l-0"
                >
                  <div className="flex items-center justify-between p-6">
                    <a href="#">
                      <Logo className="gap-2" />
                    </a>
                    <SheetClose id="mobile-menu-close">
                      <span className="rounded-full border border-border p-2.5 block">
                        <X width={16} height={16} />
                      </span>
                    </SheetClose>
                  </div>

                  <div className="flex flex-col gap-12 px-6 pb-6 overflow-y-auto">
                    <div className="flex flex-col gap-8">
                      <SheetTitle className="sr-only">Menu</SheetTitle>
                      <NavigationMenu
                        orientation="vertical"
                        className="items-start flex-none"
                      >
                        <NavigationMenuList className="flex flex-col items-start gap-3">
                          {navigationData.map((item) => (
                            <NavigationMenuItem key={item.title}>
                              <NavigationMenuLink
                                href={item.href}
                                aria-current={item.href === activeHref ? "location" : undefined}
                                onClick={(event) => {
                                  event.preventDefault();
                                  pendingSection.current = item.href;
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  "group/nav flex items-center text-2xl font-semibold tracking-tight transition-all p-0 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                                  item.href === activeHref
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:translate-x-2",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-0.5 bg-primary transition-all duration-300 overflow-hidden",
                                    item.href === activeHref
                                      ? "w-4 mr-2 opacity-100"
                                      : "w-0 opacity-0 group-hover/nav:w-4 group-hover/nav:mr-2 group-hover/nav:opacity-100",
                                  )}
                                />
                                {item.title}
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          ))}
                        </NavigationMenuList>
                      </NavigationMenu>

                      <div className="w-fit">
                        <CollaborateButton
                          onClick={() => {
                            // The menu closes first, so the form isn't opened on top of it
                            setIsOpen(false);
                            openProjectInquiry("lets-collaborate");
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                      {/* The same profiles as the footer (lib/social-links.ts) */}
                      <div className="flex gap-3">
                        {SOCIAL_LINKS.map((link) => (
                          <a
                            key={link.title}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.title}
                            className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                          >
                            <BrandIcon brand={link.brand} className="size-4" />
                          </a>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        © 2026 Aileen Romero
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
