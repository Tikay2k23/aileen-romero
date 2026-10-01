// Jumps to a part of the home page ("#" for the top, otherwise a section's id like "#about") the way the header's
// nav links do. The header registers how (components/ui/hero-01-utils/header.tsx): the jump goes through the
// smooth scrolling, and the header steps out of the way of the section's top.

type SectionNavigator = (href: string) => void;

let registered: SectionNavigator | null = null;

export function setSectionNavigator(navigator: SectionNavigator | null) {
  registered = navigator;
}

export function goToSection(href: string) {
  if (registered) registered(href);
  else if (href === "#") window.scrollTo(0, 0);
  else document.querySelector(href)?.scrollIntoView();
}
