import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { RobotHero } from "@/components/ui/robot-hero";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import AutomationHero from "@/components/automation-hero";
import DigitalHero from "@/components/digital-hero";
import CreativeHero from "@/components/creative-hero";
import EngineeringHero from "@/components/engineering-hero";
import BackToHome from "@/components/back-to-home";
import PageGlow from "@/components/page-glow";
import SmoothScroll from "@/components/smooth-scroll";
import ContactCtaSection from "@/components/contact-cta-section";
import { StickyFooter } from "@/components/ui/sticky-footer";
import { WORK_AREAS, getWorkArea } from "@/lib/work";
import { workCards } from "@/lib/work-images";
import { cn } from "@/lib/utils";

// Only the six areas of work exist: any other slug is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return WORK_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = getWorkArea(slug);
  if (!area) return {};

  return {
    title: `${area.name} — Aileen Romero`,
    description: area.summary,
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const area = getWorkArea(slug);
  if (!area) notFound();

  return (
    <>
      <main>
        <SmoothScroll />

        {area.hero === "robot" ? (
          // Its navbar carries the back button
          <RobotHero backgroundText={area.name.toUpperCase()} />
        ) : (
          <BackToHome className="fixed top-5 left-4 z-50 md:left-8" />
        )}

        {area.hero === "workflow" && <AutomationHero />}
        {area.hero === "cinematic" && <CinematicHero brandName={area.name} />}
        {area.hero === "phone" && <DigitalHero />}
        {area.hero === "collage" && <CreativeHero />}
        {area.hero === "terminal" && <EngineeringHero />}

        {/* The phone hero ends in the open space its scroll animation needs: start the cards inside it */}
        <div className={cn("relative isolate", area.hero === "phone" && "-mt-24 md:-mt-64")}>
          <PageGlow className="absolute top-40" />
          <HeroParallax
            eyebrow={`Work — ${area.name}`}
            title={area.headline}
            description={area.description}
            // Your images from public/work/<slug>/ where there are any (lib/work-images.ts)
            products={workCards(area)}
            linkLabel={area.linkLabel}
          />
        </div>
        {/* The cards fade out at the bottom instead of being cut off where the next section begins */}
        <div
          aria-hidden
          className="pointer-events-none relative z-10 -mt-40 h-40 bg-linear-to-b from-transparent to-background"
        />

        {/* The same close as the home page: "Ready to Connect Your Tools?", then the footer */}
        <ContactCtaSection />
      </main>
      <StickyFooter />
    </>
  );
}
