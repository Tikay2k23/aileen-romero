import "server-only";
import path from "node:path";
import { getImageProps } from "next/image";
import { imagesIn } from "@/lib/image-folder";

// The intro's cards (components/ui/scroll-morph-hero.tsx, played by components/preloader.tsx): images dropped into
// public/intro/ in file-name order, resized for the cards, which are at most about 108 x 153 (60 x 85 scaled up to
// 1.8 in the arc). None: undefined, and the intro keeps its stock images. Read when the site is built, and on every
// reload in development.
export function introImages(): string[] | undefined {
  const files = imagesIn(path.join(process.cwd(), "public", "intro"));
  if (!files.length) return undefined;
  return files.map(
    (file) => getImageProps({ src: `/intro/${encodeURIComponent(file)}`, alt: "", width: 108, height: 153 }).props.src,
  );
}
