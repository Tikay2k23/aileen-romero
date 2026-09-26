import HeroOne from "@/components/ui/hero-01";
import { Skiper31 } from "@/components/ui/text-scroll-animation";
import CapabilityPillars from "@/components/capability-pillars";
import FaqSection from "@/components/faq-section";
import { MinimalFooter } from "@/components/ui/minimal-footer";

export default function Home() {
  return (
    <>
      <HeroOne />
      <Skiper31 />
      <CapabilityPillars />
      <FaqSection />
      <MinimalFooter />
    </>
  );
}
