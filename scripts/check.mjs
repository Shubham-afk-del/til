// Checks the notes before they reach main: one month per file, days newest
// first with none repeated or empty, no long dashes, and a README that lists
// the five latest notes.
//
//   node scripts/check.mjs

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { days, latest } from "./notes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRIES = join(ROOT, "entries");
const problems = [];

for (const file of readdirSync(ENTRIES).filter((n) => n.endsWith(".md"))) {
  if (!/^\d{4}-\d{2}\.md$/.test(file)) problems.push(`${file}: month files are named like 2026-10.md`);
}

const all = days(ENTRIES);
const seen = new Set();
let previous = null;
for (const { file, date, notes } of all) {
  // The heading must be exactly what ./til writes, such as "14 Oct 2026".
  const when = new Date(`${date} 12:00 UTC`);
  const written = Number.isNaN(when.getTime())
    ? ""
    : when.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  if (written !== date) {
    problems.push(`${file}: "${date}" is not a date like 14 Oct 2026`);
    continue;
  }
  const month = `${when.getUTCFullYear()}-${String(when.getUTCMonth() + 1).padStart(2, "0")}.md`;
  if (month !== file) problems.push(`${file}: ${date} belongs in ${month}`);
  if (seen.has(date)) problems.push(`${file}: ${date} appears twice`);
  if (previous?.file === file && when >= previous.when) problems.push(`${file}: ${date} should come before ${previous.date}`);
  seen.add(date);
  previous = { file, date, when };
  if (notes.length === 0) problems.push(`${file}: ${date} has no notes`);
  for (const note of notes) {
    if (!note.trim()) problems.push(`${file}: ${date} has an empty note`);
    if (/[–—]/.test(note)) problems.push(`${file}: ${date}: use a comma or a full stop instead of a long dash`);
  }
}

const block = readFileSync(join(ROOT, "README.md"), "utf8").match(/<!-- LATEST:START -->\n([\s\S]*?)\n<!-- LATEST:END -->/);
if (!block) problems.push("README.md: the LATEST block is missing");
else if (block[1] !== latest(ENTRIES).join("\n")) problems.push("README.md: the LATEST list does not match the newest notes");

if (problems.length) {
  console.error(problems.map((p) => `- ${p}`).join("\n"));
  process.exit(1);
}
console.log(`${all.length} days of notes, all in order.`);
