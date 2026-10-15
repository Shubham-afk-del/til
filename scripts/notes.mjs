// Reads the notes back: every day with its bullets, newest first, and the
// latest few for the README.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Every day in entries/, newest file first and in file order within it. */
export function days(entries) {
  const out = [];
  for (const file of readdirSync(entries).filter((n) => n.endsWith(".md")).sort().reverse()) {
    for (const block of readFileSync(join(entries, file), "utf8").split("\n## ").slice(1)) {
      const [date, ...lines] = block.split("\n");
      out.push({ file, date: date.trim(), notes: lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2)) });
    }
  }
  return out;
}

/** The newest notes as README lines: "- 14 Oct 2026: ...". */
export function latest(entries, count = 5) {
  return days(entries)
    .flatMap((d) => d.notes.map((note) => `- ${d.date}: ${note}`))
    .slice(0, count);
}
