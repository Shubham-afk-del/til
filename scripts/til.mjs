// Adds today's note, refreshes the README, commits and pushes.
//
//   ./til "what I learned today"
//   ./til            (prints today's notes so far)

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRIES = join(ROOT, "entries");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();

const now = new Date();
const part = (opts) => now.toLocaleDateString("en-GB", { timeZone: "Europe/London", ...opts });
const day = part({ day: "numeric", month: "short", year: "numeric" }); // 13 Oct 2026
const month = `${part({ year: "numeric" })}-${part({ month: "2-digit" })}`; // 2026-10
const file = join(ENTRIES, `${month}.md`);
const heading = `## ${day}`;

const note = process.argv.slice(2).join(" ").trim();
if (!note) {
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const today = text.split(heading)[1]?.split("\n## ")[0]?.trim();
  console.log(today ? `${heading}\n\n${today}` : `Nothing yet for ${day}. Add one with: ./til "what you learned"`);
  process.exit(0);
}

try {
  git("pull", "--quiet", "--rebase");
} catch {
  console.warn("Could not pull first; carrying on with the local copy.");
}

// Append under today's heading (newest day first in each month's file).
mkdirSync(ENTRIES, { recursive: true });
const title = `# ${part({ month: "long", year: "numeric" })}\n`;
let text = existsSync(file) ? readFileSync(file, "utf8") : title;
const bullet = `- ${note.replace(/\s+/g, " ")}`;
if (text.includes(`${heading}\n`)) {
  const at = text.indexOf(`${heading}\n`) + heading.length + 1;
  const rest = text.slice(at);
  const end = rest.search(/\n## /);
  const block = end < 0 ? rest : rest.slice(0, end);
  text = `${text.slice(0, at)}${block.trimEnd()}\n${bullet}\n${end < 0 ? "" : rest.slice(end)}`;
} else {
  const body = text.slice(title.length).trimStart();
  text = `${title}\n${heading}\n\n${bullet}\n${body ? `\n${body}` : ""}`;
}
writeFileSync(file, text.replace(/\n{3,}/g, "\n\n"));

// README: the five latest notes, newest first.
const latest = [];
for (const name of readdirSync(ENTRIES).filter((n) => n.endsWith(".md")).sort().reverse()) {
  const days = readFileSync(join(ENTRIES, name), "utf8").split("\n## ").slice(1);
  for (const block of days) {
    const [date, ...lines] = block.split("\n");
    for (const ln of lines.filter((l) => l.startsWith("- "))) latest.push(`- ${date.trim()}: ${ln.slice(2)}`);
    if (latest.length >= 5) break;
  }
  if (latest.length >= 5) break;
}
const readmePath = join(ROOT, "README.md");
const readme = readFileSync(readmePath, "utf8").replace(
  /<!-- LATEST:START -->[\s\S]*?<!-- LATEST:END -->/,
  `<!-- LATEST:START -->\n${latest.slice(0, 5).join("\n")}\n<!-- LATEST:END -->`,
);
writeFileSync(readmePath, readme);

git("add", "entries", "README.md");
git("commit", "--quiet", "-m", `TIL: ${note.length > 60 ? `${note.slice(0, 59)}…` : note}`);
try {
  git("push", "--quiet");
  console.log(`Saved under ${day} and pushed.`);
} catch {
  console.log(`Saved under ${day}. The push failed; run "git push" in ${ROOT} when you're online.`);
}
