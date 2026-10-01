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

// The cards on a work page. Images dropped into public/work/<slug>/ go on the cards in file-name order (01, 02 …
// 10 sorts after 9), titled by their file names; a name that's only a number keeps the card's own title. Cards
// still without one keep their placeholder photo. Read when the page is built, and on every reload in development.
export function workCards(area: WorkArea): WorkProject[] {
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(path.join(process.cwd(), "public", "work", area.slug))
      .filter((file) => !file.startsWith(".") && IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch {
    // No folder: the placeholders only
  }

  // Titles key the cards: an image named like another card (yours or a placeholder still showing) gets numbered
  const used = new Set(area.projects.slice(files.length).map((project) => project.title));
  return area.projects.map((project, index) => {
    const file = files[index];
    if (!file) return project;
    const base = titleFromFileName(file) || project.title;
    let title = base;
    for (let n = 2; used.has(title); n++) title = `${base} (${n})`;
    used.add(title);
    return { ...project, title, thumbnail: `/work/${area.slug}/${encodeURIComponent(file)}` };
  });
}
