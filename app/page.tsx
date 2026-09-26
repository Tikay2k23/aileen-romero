import HeroOne from "@/components/ui/hero-01";
import { Skiper31 } from "@/components/ui/text-scroll-animation";
import CapabilityPillars from "@/components/capability-pillars";
import FaqSection from "@/components/faq-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactCtaSection from "@/components/contact-cta-section";
import { MinimalFooter } from "@/components/ui/minimal-footer";

export default function Home() {
  return (
    <>
      <HeroOne />
      <Skiper31 />
      <CapabilityPillars />
      <FaqSection />
      <TestimonialsSection />
      <ContactCtaSection />
      <MinimalFooter />
    </>
  );
}
