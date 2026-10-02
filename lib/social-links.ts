import type { Brand } from "@/components/ui/brand-icons";

// Aileen's profiles: the footer's social buttons and the ones in the phone menu (they open in a new tab).
// WhatsApp's link is https://wa.me/ and the number with its country code, digits only.
export const SOCIAL_LINKS: { title: string; brand: Brand; href: string }[] = [
  { title: "Facebook", brand: "facebook", href: "https://www.facebook.com/aileen.romero.58906" },
  { title: "GitHub", brand: "github", href: "https://github.com/AileenRomero95" },
  { title: "Instagram", brand: "instagram", href: "https://www.instagram.com/aileenromero14324/" },
  { title: "LinkedIn", brand: "linkedin", href: "https://www.linkedin.com/in/aileen-romero-174645219" },
  { title: "WhatsApp", brand: "whatsapp", href: "https://wa.me/639936376452" },
];
