// Adds today's note, refreshes the README, then sends it to main through a
// pull request that has to pass scripts/check.mjs before it merges.
//
//   ./til "what I learned today"
//   ./til --direct "..."   (commit straight to main, as the issue workflow does)
//   ./til                  (prints today's notes so far)

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { latest } from "./notes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRIES = join(ROOT, "entries");
const run = (cmd, ...args) => execFileSync(cmd, args, { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
const git = (...args) => run("git", ...args);
const gh = (...args) => run("gh", ...args);

const now = new Date();
const part = (opts) => now.toLocaleDateString("en-GB", { timeZone: "Europe/London", ...opts });
const day = part({ day: "numeric", month: "short", year: "numeric" }); // 13 Oct 2026
const month = `${part({ year: "numeric" })}-${part({ month: "2-digit" })}`; // 2026-10
const file = join(ENTRIES, `${month}.md`);
const heading = `## ${day}`;

const args = process.argv.slice(2);
const direct = args[0] === "--direct" || process.env.GITHUB_ACTIONS === "true";
const note = (args[0] === "--direct" ? args.slice(1) : args).join(" ").trim();
if (!note) {
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const today = text.split(heading)[1]?.split("\n## ")[0]?.trim();
  console.log(today ? `${heading}\n\n${today}` : `Nothing yet for ${day}. Add one with: ./til "what you learned"`);
  process.exit(0);
}
if (/[–—]/.test(note)) {
  console.error("Use a comma or a full stop instead of a long dash.");
  process.exit(1);
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
const readmePath = join(ROOT, "README.md");
const readme = readFileSync(readmePath, "utf8").replace(
  /<!-- LATEST:START -->[\s\S]*?<!-- LATEST:END -->/,
  `<!-- LATEST:START -->\n${latest(ENTRIES).join("\n")}\n<!-- LATEST:END -->`,
);
writeFileSync(readmePath, readme);

try {
  run("node", join(ROOT, "scripts", "check.mjs"));
} catch {
  console.error(`The note is written but not committed: fix the files above in ${ROOT}, then run ./til again.`);
  process.exit(1);
}

// The bold topic label reads well on the page but not in a commit title.
const plain = note.replace(/\*\*/g, "");
const subject = `TIL: ${plain.length > 60 ? `${plain.slice(0, 59)}…` : plain}`;
const hasGh = () => {
  try {
    execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

if (direct || !hasGh()) {
  git("add", "entries", "README.md");
  git("commit", "--quiet", "-m", subject);
  try {
    git("push", "--quiet");
    console.log(`Saved under ${day} and pushed.`);
  } catch {
    console.log(`Saved under ${day}. The push failed; run "git push" in ${ROOT} when you're online.`);
  }
  process.exit(0);
}

// A branch and a pull request for the note; it merges once the check passes.
const iso = `${month}-${part({ day: "2-digit" })}`;
const branch = `til/${iso}-${Date.now().toString(36).slice(-5)}`;
git("switch", "--quiet", "-c", branch);
git("add", "entries", "README.md");
git("commit", "--quiet", "-m", subject);
git("push", "--quiet", "-u", "origin", branch);
const url = gh("pr", "create", "--base", "main", "--head", branch, "--title", subject, "--body", `Today's note, filed with \`./til\`. It merges once the format check passes.`);
const number = url.split("/").pop();

let outcome = "pending";
for (const deadline = Date.now() + 5 * 60 * 1000; Date.now() < deadline; ) {
  await sleep(6000);
  let buckets = "";
  try {
    buckets = gh("pr", "checks", number, "--json", "bucket", "--jq", '[.[].bucket] | join(",")');
  } catch (error) {
    buckets = error.stdout?.toString().trim() ?? ""; // gh exits non-zero while checks are pending
  }
  if (!buckets) continue;
  if (/fail|cancel/.test(buckets)) {
    outcome = "failed";
    break;
  }
  if (!/pending/.test(buckets)) {
    outcome = "passed";
    break;
  }
}

if (outcome !== "passed") {
  git("switch", "--quiet", "main");
  console.log(`Saved under ${day} in ${url}, but the check ${outcome === "failed" ? "failed" : "did not finish"}; it stays open until that's sorted.`);
  process.exit(1);
}
gh("pr", "merge", number, "--squash", "--delete-branch");
git("switch", "--quiet", "main");
git("pull", "--quiet", "--rebase");
console.log(`Saved under ${day} and pushed, merged in #${number}.`);
