import Image from "next/image";
import PageGlow from "@/components/page-glow";
import { PhoneScrollHero } from "@/components/ui/phone-scroll-hero";

// The phone's screen: a lead-capture landing page in miniature, the kind of page this service builds
function LandingPageScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-background pt-9 text-left">
      <div className="flex items-center justify-between px-4">
        <span className="text-[0.7rem] font-bold tracking-tight">yourbrand.</span>
        <span aria-hidden className="flex flex-col gap-[3px]">
          <span className="h-px w-3.5 bg-foreground" />
          <span className="h-px w-3.5 bg-foreground" />
        </span>
      </div>

      <div className="relative mx-3 mt-3 aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80&auto=format&fit=crop"
          alt=""
          fill
          sizes="17rem"
          className="object-cover"
        />
      </div>

      <div className="px-4 pt-4">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Free strategy call
        </p>
        <p className="mt-1.5 text-[0.95rem] font-bold leading-tight tracking-tight">
          Grow your business with a site that sells
        </p>
        <div aria-hidden className="mt-2.5 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-muted" />
          <div className="h-1.5 w-4/5 rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-auto space-y-2 px-4 pb-7">
        <div className="rounded-lg border border-border px-3 py-2 text-[0.6rem] text-muted-foreground">
          you@company.com
        </div>
        <div className="rounded-lg bg-foreground py-2 text-center text-[0.65rem] font-semibold text-background">
          Book a call
        </div>
      </div>
    </div>
  );
}

// Hero for the Digital work page: the phone straightens and climbs over the headline as the page scrolls
export default function DigitalHero() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-8 md:top-28" />
      <PhoneScrollHero
        titleComponent={
          <>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Websites · Landing pages · Funnels
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
              Websites that convert,
              <br />
              <span className="mt-1 block text-5xl font-bold leading-none tracking-tight md:text-[6rem]">
                on every screen
              </span>
            </h1>
          </>
        }
      >
        <LandingPageScreen />
      </PhoneScrollHero>
    </div>
  );
}
