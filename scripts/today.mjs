// What did I work on since the last note? Compares my learning folders with
// a snapshot taken after the previous note and prints only my own changes:
// new or edited code, and notebook cells (their source, never their outputs).
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
  // Print only lines that were not there before (order-preserving).
  const seen = new Set((old ?? "").split("\n"));
  const added = text.split("\n").filter((l) => l.trim() && !seen.has(l));
  console.log(added.slice(0, 120).join("\n") || "(only removals or reordering)");
}
if (changes === 0) console.log("NO CHANGES since the last note.");
