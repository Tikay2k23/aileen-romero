import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { WorkArea, WorkProject } from "@/lib/work";

// Formats browsers show everywhere (iPhone .heic photos need converting first)
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// "01 Lead Routing.png" → "Lead Routing": the order number in front is dropped, dashes and underscores read as
// spaces. A name that's only a number comes out empty.
function titleFromFileName(file: string) {
  return path
    .parse(file)
    .name.replace(/^\d+\s*[-_.)]?\s*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// The number a file name starts with ("07 Agency Site.png" → 7): how links.txt points at an image
function fileNumber(file: string) {
  const match = /^\d+/.exec(file);
  return match ? Number(match[0]) : null;
}

type CardLink = Pick<WorkProject, "link" | "linkLabel">;

// links.txt next to the images: a line per card with its image's number, the web address, and optionally " | "
// and the button's own words. Lines starting with # are notes; anything but an http(s) address is skipped.
//   07 https://example.com
//   08 https://youtu.be/abc | Watch the video
function readLinks(folder: string) {
  const links = new Map<number, CardLink>();
  let text: string;
  try {
    text = fs.readFileSync(path.join(folder, "links.txt"), "utf8");
  } catch {
    return links;
  }
  for (const line of text.split(/\r?\n/).map((l) => l.trim())) {
    if (!line || line.startsWith("#")) continue;
    const match = /^(\d+)\s*[-:=.)]?\s*(\S+)\s*(?:\|\s*(.*))?$/.exec(line);
    if (!match) continue;
    let url: URL;
    try {
      url = new URL(match[2]);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    links.set(Number(match[1]), { link: url.href, linkLabel: match[3]?.trim() || undefined });
  }
  return links;
}

// The cards on a work page. Images dropped into public/work/<slug>/ go on the cards in file-name order (01, 02 …
// 10 sorts after 9), titled by their file names; a name that's only a number keeps the card's own title. Cards
// still without one keep their placeholder photo. links.txt in the same folder gives cards their preview button.
// Read when the page is built, and on every reload in development.
export function workCards(area: WorkArea): WorkProject[] {
  const folder = path.join(process.cwd(), "public", "work", area.slug);
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(folder)
      .filter((file) => !file.startsWith(".") && IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch {
    // No folder: the placeholders only
  }
  const links = readLinks(folder);

  // Titles key the cards: an image named like another card (yours or a placeholder still showing) gets numbered
  const used = new Set(area.projects.slice(files.length).map((project) => project.title));
  return area.projects.map((project, index) => {
    const file = files[index];
    if (!file) return project;
    const base = titleFromFileName(file) || project.title;
    let title = base;
    for (let n = 2; used.has(title); n++) title = `${base} (${n})`;
    used.add(title);
    const number = fileNumber(file);
    return {
      ...project,
      title,
      thumbnail: `/work/${area.slug}/${encodeURIComponent(file)}`,
      ...(number === null ? undefined : links.get(number)),
    };
  });
}
