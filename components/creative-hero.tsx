import PageGlow from "@/components/page-glow";
import { HeroCollage, type HeroCollageImage } from "@/components/ui/modern-hero-section";

// An Unsplash photo cropped to the given size
const photo = (id: string, width: number, height: number, alt: string): HeroCollageImage => ({
  src: `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&q=80&auto=format&fit=crop`,
  alt,
  width,
  height,
});

// The kinds of work this service covers. The first sits in the middle of the collage; the rest go
// top-left, top-right, bottom-right, far right, bottom-left and far left.
const IMAGES = [
  photo("1554080353-a576cf803bda", 600, 800, "Photographer framing a shot in a city at dusk"),
  photo("1598899134739-24c46f58b8c0", 480, 360, "Clapperboard on a yellow backdrop"),
  photo("1572044162444-ad60f128bdea", 400, 400, "Designer sketching on a graphics tablet beside color swatches"),
  photo("1558470598-a5dda9640f68", 480, 360, "Cloud of rainbow-colored ink"),
  photo("1618005198919-d3d4b5a92ead", 440, 550, "Pastel 3D render of a sphere"),
  photo("1535016120720-40c646be5580", 480, 360, "Film projector casting a beam of light"),
  photo("1545235617-9465d2a55698", 440, 550, "App designs on a laptop and a phone"),
];

// The three sides of the work, shown where this hero was designed to show headline numbers
const PILLARS = [
  { value: "Video", label: "Editing, short-form & motion graphics" },
  { value: "Design", label: "Brand identity, presentations & print" },
  { value: "Content", label: "Photography, social & ad creatives" },
];

// Hero for the Creative work page: a floating collage of the kinds of visuals this work produces
export default function CreativeHero() {
  return (
    <div className="relative isolate">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      <HeroCollage
        // Transparent, so the page's glow shows through. Only a little space at the bottom: the cards below
        // bring their own lead-in.
        className="bg-transparent pb-10 sm:pb-10"
        title={
          <>
            {/* Kept whole, so a narrow screen breaks the line before the phrase instead of inside it */}
            Your brand, <span className="whitespace-nowrap text-purple-500">in full color</span>
          </>
        }
        subtitle="From short-form edits to ad creatives and brand identity, I turn raw footage and rough ideas into visuals people remember."
        stats={PILLARS}
        images={IMAGES}
      />
    </div>
  );
}
