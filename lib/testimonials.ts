import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getImageProps } from "next/image";
import { fileNumber, imagesIn } from "@/lib/image-folder";

export type ClientTestimonial = {
  quote: string;
  name: string;
  // Role and company
  designation: string;
  src: string;
  srcSet?: string;
};

const FOLDER = path.join(process.cwd(), "public", "testimonials");

type Block = { number: number; name: string; role: string; quote: string };
type Field = "name" | "role" | "quote";

// testimonials.txt: a block per client, its number on a line of its own, then "Name:", "Role:" and "Quote:" lines
// (a quote can run on over the next lines). Lines starting with # are notes.
function readBlocks() {
  let text: string;
  try {
    text = fs.readFileSync(path.join(FOLDER, "testimonials.txt"), "utf8");
  } catch {
    return [];
  }
  const blocks: Block[] = [];
  let block: Block | null = null;
  let field: Field | null = null;
  for (const line of text.split(/\r?\n/).map((l) => l.trim())) {
    if (!line || line.startsWith("#")) continue;
    if (/^\d+$/.test(line)) {
      block = { number: Number(line), name: "", role: "", quote: "" };
      blocks.push(block);
      field = null;
      continue;
    }
    if (!block) continue;
    const match = /^(name|role|quote)\s*:\s*(.*)$/i.exec(line);
    if (match) {
      field = match[1].toLowerCase() as Field;
      block[field] = match[2];
    } else if (field) {
      block[field] = `${block[field]} ${line}`;
    }
  }
  return blocks
    .map((b) => ({ ...b, quote: b.quote.trim().replace(/^["“](.*)["”]$/, "$1") }))
    .filter((b) => b.name && b.quote)
    .sort((a, b) => a.number - b.number);
}

const escapeXml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

// A client without a photo: their initials on the site's purple, rather than a stranger's face
function initialsImage(name: string) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><title>${escapeXml(name)}</title>` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c084fc"/>` +
    `<stop offset="1" stop-color="#7e22ce"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="system-ui, sans-serif" font-size="150" ` +
    `font-weight="600" fill="#fff">${escapeXml(initials)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// "What Clients Say" (components/testimonials-section.tsx) from public/testimonials/: the clients written in
// testimonials.txt in their numbered order, each with the photo whose name starts with the same number (resized for
// the carousel), or their initials. Nothing written yet: null, and the section keeps its placeholders. Read when the
// home page is built, and on every reload in development.
export function readTestimonials(): ClientTestimonial[] | null {
  const blocks = readBlocks();
  if (!blocks.length) return null;
  const photos = new Map(imagesIn(FOLDER).map((file) => [fileNumber(file), file]));
  return blocks.map(({ number, name, role, quote }) => {
    const file = photos.get(number);
    if (!file) return { quote, name, designation: role, src: initialsImage(name) };
    const { props } = getImageProps({
      src: `/testimonials/${encodeURIComponent(file)}`,
      alt: name,
      width: 420,
      height: 384,
    });
    return { quote, name, designation: role, src: props.src, srcSet: props.srcSet };
  });
}
