import "server-only";
import path from "node:path";
import { imagesIn, titleFromFileName } from "@/lib/image-folder";
import type { CardPhoto } from "@/components/ui/hero-with-cards";

// The five photos fanned out under "Download My CV" (components/ui/hero-with-cards.tsx): images dropped into
// public/photo-cards/ fill the cards in file-name order, described by their file names (a name that's only a number
// leaves the photo undescribed, as decoration). Cards still without one keep their placeholder photo. Read when the
// home page is built, and on every reload in development.
export function photoCards(): CardPhoto[] {
  return imagesIn(path.join(process.cwd(), "public", "photo-cards"))
    .slice(0, 5)
    .map((file) => ({ src: `/photo-cards/${encodeURIComponent(file)}`, alt: titleFromFileName(file) }));
}
