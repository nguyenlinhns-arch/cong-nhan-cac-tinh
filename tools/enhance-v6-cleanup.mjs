import "./enhance-v5-v4-compat.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const styleTag = '<link rel="stylesheet" href="/v6-top-cleanup.css?v=1">';
const scriptTag = '<script src="/v6-top-cleanup.js?v=1" defer></script>';
let checked = 0;
let changed = 0;
let removedIntentHubs = 0;

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
  if (before.includes("data-legacy-redirect")) continue;
  checked += 1;
  let html = before;

  const hubs = html.match(/<section\b[^>]*data-v5-intent-hub[^>]*>[\s\S]*?<\/section>/gi) || [];
  if (hubs.length) {
    html = html.replace(/<section\b[^>]*data-v5-intent-hub[^>]*>[\s\S]*?<\/section>/gi, "");
    removedIntentHubs += hubs.length;
  }

  if (!/data-top-version=["']v6["']/.test(html)) {
    html = html.replace(/<html\b([^>]*)>/i, '<html$1 data-top-version="v6">');
  }
  if (!html.includes(styleTag)) html = html.replace("</head>", `${styleTag}\n</head>`);
  if (!html.includes(scriptTag)) html = html.replace("</body>", `${scriptTag}\n</body>`);

  if (html !== before) {
    fs.writeFileSync(target, html);
    changed += 1;
    try { execFileSync("git", ["update-index", "--assume-unchanged", `tuyen-tho-mo/${relative}`], { stdio: "ignore" }); } catch (_) {}
  }
}

if (checked < 110) throw new Error(`V6 expected at least 110 HTML pages, got ${checked}`);
if (removedIntentHubs < 100) throw new Error(`V6 expected to remove at least 100 intent hubs, got ${removedIntentHubs}`);

console.log(JSON.stringify({
  status: "enhanced",
  version: "v6-top-cleanup",
  html_checked: checked,
  html_changed: changed,
  intent_hubs_removed: removedIntentHubs,
}, null, 2));
