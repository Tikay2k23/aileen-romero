import "server-only";
import path from "node:path";
import { imagesIn } from "@/lib/image-folder";
import { toolIconSrc } from "@/components/ui/tool-icons";

export type StackIcon = { src: string; name: string };

// "my fav tool stack" (components/ui/text-scroll-animation.tsx): GoHighLevel first, from the logo dropped into
// public/tool-stack/ (no free icon set carries its mark; until there's one it sits out), then Meta Ads, CapCut, Canva
// and WordPress. Read when the home page is built, and on every reload in development.
export function toolStack(): StackIcon[] {
  const ghlLogo = imagesIn(path.join(process.cwd(), "public", "tool-stack"))[0];
  return [
    ...(ghlLogo ? [{ src: `/tool-stack/${encodeURIComponent(ghlLogo)}`, name: "GoHighLevel" }] : []),
    { src: toolIconSrc("meta"), name: "Meta Ads" },
    { src: toolIconSrc("capcut"), name: "CapCut" },
    { src: toolIconSrc("canva"), name: "Canva" },
    { src: toolIconSrc("wordpress"), name: "WordPress" },
  ];
}
