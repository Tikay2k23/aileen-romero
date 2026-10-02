import "server-only";
import fs from "node:fs";
import path from "node:path";

// Folders you drop images into (the work pages' cards, the photo cards under "Download My CV"): the shared rules
// for which files count and in what order.

// Formats browsers show everywhere (iPhone .heic photos need converting first)
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// The images in a folder in file-name order (01, 02 … 10 sorts after 9); none when the folder is missing
export function imagesIn(folder: string) {
  try {
    return fs
      .readdirSync(folder)
      .filter((file) => !file.startsWith(".") && IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch {
    return [];
  }
}

// "01 Lead Routing.png" → "Lead Routing": the order number in front is dropped, dashes and underscores read as
// spaces. A name that's only a number comes out empty.
export function titleFromFileName(file: string) {
  return path
    .parse(file)
    .name.replace(/^\d+\s*[-_.)]?\s*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
