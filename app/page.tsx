import HeroOne from "@/components/ui/hero-01";
import { Skiper31 } from "@/components/ui/text-scroll-animation";
import CapabilityPillars from "@/components/capability-pillars";
import FaqSection from "@/components/faq-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactCtaSection from "@/components/contact-cta-section";
import { StickyFooter } from "@/components/ui/sticky-footer";
import SmoothScroll from "@/components/smooth-scroll";
import { photoCards } from "@/lib/photo-cards";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <HeroOne />
      <Skiper31 photos={photoCards()} />
      <CapabilityPillars />
      <FaqSection />
      <TestimonialsSection />
      <ContactCtaSection />
      <StickyFooter />
    </>
  );
}
