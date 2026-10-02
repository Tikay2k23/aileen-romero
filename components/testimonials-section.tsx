import PageGlow from "@/components/page-glow";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import { readTestimonials } from "@/lib/testimonials";

// Placeholders until public/testimonials/testimonials.txt has real ones (lib/testimonials.ts), which then replace
// them all. Kept obviously generic on purpose so nothing reads as a real endorsement.
const PLACEHOLDERS = [
  {
    quote:
      "Add a client testimonial here: the problem they had, the system you built, and the result it delivered.",
    name: "Client Name",
    designation: "Role, Company",
    src: "https://cdn.21st.dev/assets/mirror/02/0204be31ac91de05dc9a78ea3438dda481ff3deaaffa40cb28e3bc1822ba3650.jpg",
  },
  {
    quote:
      "A short quote about working together, such as communication, speed, and how smoothly the project ran.",
    name: "Client Name",
    designation: "Role, Company",
    src: "https://cdn.21st.dev/assets/mirror/bb/bb5e69602eca31b29b15db66d5f95f5d6e1534037d1cc2c06e8cbb22cafb3a8f.jpg",
  },
  {
    quote:
      "Results land well here too, like hours saved each week or leads followed up automatically.",
    name: "Client Name",
    designation: "Role, Company",
    src: "https://cdn.21st.dev/assets/mirror/b1/b1e3120d49307c1e99ec979e6d05e79f67d7ecea727b27eb716a2b7bff5fe0bb.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    // overflow-x-clip: the side photos peek past the edges on narrow screens
    <div className="relative isolate flex flex-col items-center overflow-x-clip py-16 md:py-24">
      <PageGlow className="absolute top-1/2 -translate-y-1/2" />
      {/* mb-12 leaves room for the side photos, which sit raised above the main one */}
      <h2 className="mb-12 max-w-3xl px-4 text-center text-4xl font-medium tracking-tight text-balance md:text-6xl">
        What Clients Say
      </h2>
      <CircularTestimonials
        testimonials={readTestimonials() ?? PLACEHOLDERS}
        autoplay
        colors={{
          name: "var(--foreground)",
          designation: "var(--muted-foreground)",
          testimony: "var(--foreground)",
          arrowBackground: "var(--primary)",
          arrowForeground: "var(--primary-foreground)",
          // Hover turns them white with a black arrow, like the site's other buttons
          arrowHoverBackground: "var(--background)",
          arrowHoverForeground: "var(--foreground)",
        }}
        fontSizes={{ name: "28px", designation: "20px", quote: "20px" }}
      />
    </div>
  );
}
