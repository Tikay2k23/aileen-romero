import "server-only";
import path from "node:path";
import { imagesIn, titleFromFileName } from "@/lib/image-folder";
import type { AvatarList } from "@/components/ui/hero-01-utils/hero";

// The small client photos beside "Trusted by 15+ clients" in the hero (components/ui/hero-01-utils/hero.tsx):
// images dropped into public/client-avatars/ in file-name order, the first four, named by their file names (a name
// that's only a number leaves the photo unnamed, as decoration). Read when the home page is built, and on every
// reload in development.
export function clientAvatars(): AvatarList[] {
  return imagesIn(path.join(process.cwd(), "public", "client-avatars"))
    .slice(0, 4)
    .map((file) => ({ image: `/client-avatars/${encodeURIComponent(file)}`, alt: titleFromFileName(file) }));
}
