import "./enhance-v5-utm-compat.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const tag = '<link rel="stylesheet" href="/top-block-hotfix.css?v=1">';
let checked = 0;
let changed = 0;

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

for (const target of walk(root)) {
  const relative = path.relative(root, target).replace(/\\/g, "/");
  const before = fs.readFileSync(target, "utf8");
  if (before.includes("data-legacy-redirect") || /^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  checked += 1;
  if (before.includes(tag)) continue;
  const html = before.replace("</head>", `${tag}\n</head>`);
  if (html === before) throw new Error(`${relative}: missing closing head tag`);
  fs.writeFileSync(target, html);
  changed += 1;
  try { execFileSync("git", ["update-index", "--assume-unchanged", `tuyen-tho-mo/${relative}`], { stdio: "ignore" }); } catch (_) {}
}

if (checked < 110) throw new Error(`Top-block hotfix expected at least 110 pages, got ${checked}`);
if (changed < 110) throw new Error(`Top-block hotfix expected at least 110 changed pages, got ${changed}`);

console.log(JSON.stringify({
  status: "enhanced",
  hotfix: "top-block-clean",
  html_checked: checked,
  html_changed: changed,
}, null, 2));
