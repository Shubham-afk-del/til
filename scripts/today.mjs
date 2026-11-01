// What did I work on since the last note? Compares my learning folders with
// a snapshot taken after the previous note and prints only my own changes:
// new or edited code, and notebook cells (their source, never their outputs).
// An edited file is shown the way `git diff` shows it, each change with a few
// unchanged lines around it, so the code reads as it really is.
// In a git clone of someone else's course, only files git sees as changed
// locally count, so a `git pull` of new course material is never "my work".
//
//   node scripts/today.mjs          report changes since the snapshot
//   node scripts/today.mjs --save   take a new snapshot (after filing a note)
//
// Folders come from ~/.config/til/sources.json (a JSON array of paths), or
// default to ~/Documents/DSA and ~/projects/agents.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

const HOME = homedir();
const CONFIG = join(HOME, ".config", "til", "sources.json");
const SNAPSHOT = join(HOME, ".cache", "til", "snapshot.json");
const KEEP = /\.(py|ipynb|md|js|ts|java|cpp|c|txt)$/i;
const SKIP = new Set([".git", ".venv", "venv", "node_modules", "__pycache__", ".ipynb_checkpoints", ".DS_Store"]);
const CONTEXT = 3; // unchanged lines shown around each change
const MAX_LINES = 150; // per file, so one big notebook cannot flood the report

const sources = existsSync(CONFIG)
  ? JSON.parse(readFileSync(CONFIG, "utf8")).map((p) => p.replace(/^~/, HOME))
  : [join(HOME, "Documents", "DSA"), join(HOME, "projects", "agents")];

/** The text that matters in a file: notebook cell sources, or the file itself. */
function contentOf(path) {
  if (statSync(path).size > 2_000_000) return null;
  const raw = readFileSync(path, "utf8");
  if (!path.endsWith(".ipynb")) return raw;
  try {
    return JSON.parse(raw)
      .cells.map((c) => `[${c.cell_type}]\n${Array.isArray(c.source) ? c.source.join("") : c.source}`)
      .join("\n\n");
  } catch {
    return null;
  }
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, out);
    else if (KEEP.test(name)) out.push(path);
  }
  return out;
}

/** In a git clone, only files I changed or added myself; otherwise every file. */
function myFiles(root) {
  if (!existsSync(join(root, ".git"))) return walk(root);
  const status = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: root }).toString();
  return status
    .split("\n")
    .filter(Boolean)
    .map((line) => join(root, line.slice(3).replace(/^"|"$/g, "")))
    .filter((p) => KEEP.test(p) && existsSync(p) && statSync(p).isFile());
}

/**
 * Line diff of two texts: a list of [" ", line] (unchanged), ["-", line]
 * (removed) and ["+", line] (added). Common lines at the start and end are
 * skipped first; the rest is a longest-common-subsequence diff.
 */
function diffLines(a, b) {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) endA--, endB--;
  const x = a.slice(start, endA);
  const y = b.slice(start, endB);
  const middle = [];
  if (x.length * y.length > 4_000_000) {
    // Too big to compare line by line: show the old part as removed, the new as added.
    middle.push(...x.map((l) => ["-", l]), ...y.map((l) => ["+", l]));
  } else {
    const lcs = Array.from({ length: x.length + 1 }, () => new Uint32Array(y.length + 1));
    for (let i = x.length - 1; i >= 0; i--)
      for (let j = y.length - 1; j >= 0; j--)
        lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    let i = 0;
    let j = 0;
    while (i < x.length || j < y.length) {
      if (i < x.length && j < y.length && x[i] === y[j]) middle.push([" ", y[j++]]), i++;
      else if (j === y.length || (i < x.length && lcs[i + 1][j] >= lcs[i][j + 1])) middle.push(["-", x[i++]]);
      else middle.push(["+", y[j++]]);
    }
  }
  return [...a.slice(0, start).map((l) => [" ", l]), ...middle, ...a.slice(endA).map((l) => [" ", l])];
}

/** The changed parts of a diff, each with CONTEXT unchanged lines around it; "@@" marks lines left out. */
function changedParts(diff) {
  const near = (k) => diff.slice(Math.max(0, k - CONTEXT), k + CONTEXT + 1).some(([op]) => op !== " ");
  const lines = [];
  let skipped = false;
  diff.forEach(([op, line], k) => {
    if (!near(k)) return void (skipped = true);
    if (skipped) lines.push("@@");
    skipped = false;
    lines.push(`${op} ${line}`);
  });
  if (skipped) lines.push("@@");
  return lines;
}

const current = {};
for (const root of sources.filter((p) => existsSync(p))) {
  for (const path of myFiles(root)) {
    const text = contentOf(path);
    if (text !== null) current[path] = text;
  }
}

if (process.argv.includes("--save")) {
  mkdirSync(join(HOME, ".cache", "til"), { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(current));
  console.log(`Snapshot saved: ${Object.keys(current).length} files.`);
  process.exit(0);
}

if (!existsSync(SNAPSHOT)) {
  console.log("No snapshot yet. Run with --save once to start tracking.");
  process.exit(0);
}

const before = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const hash = (s) => createHash("sha1").update(s).digest("hex");
let changes = 0;
for (const [path, text] of Object.entries(current)) {
  const old = before[path];
  if (old !== undefined && hash(old) === hash(text)) continue;
  changes += 1;
  const root = sources.find((s) => path.startsWith(s)) ?? HOME;
  console.log(`\n=== ${old === undefined ? "NEW" : "CHANGED"}: ${relative(join(root, ".."), path)}`);
  const diff = old === undefined ? null : diffLines(old.split("\n"), text.split("\n"));
  const kept = diff ? diff.filter(([op, l]) => op === " " && l.trim()).length : 0;
  let lines;
  if (diff && kept * 2 >= text.split("\n").filter((l) => l.trim()).length) {
    console.log("(+ added, - removed, unmarked lines unchanged, @@ unchanged lines left out)");
    lines = changedParts(diff);
  } else {
    // A new file, or one rewritten for a new exercise: show the new version whole.
    if (diff) console.log("(rewritten: the whole new version follows)");
    lines = text.replace(/\s+$/, "").split("\n");
  }
  console.log(lines.slice(0, MAX_LINES).join("\n"));
  if (lines.length > MAX_LINES) console.log(`(${lines.length - MAX_LINES} more lines)`);
}
if (changes === 0) console.log("NO CHANGES since the last note.");
