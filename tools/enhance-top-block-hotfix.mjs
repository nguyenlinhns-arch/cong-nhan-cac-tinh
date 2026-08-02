import "./enhance-v5-utm-compat.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const STYLE_TAG = '<link rel="stylesheet" href="/site-shell-20260803.css?v=1">';
const SCRIPT_TAG = '<script src="/site-shell-20260803.js?v=1" defer></script>';
let checked = 0;
let changed = 0;
let withShell = 0;

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function stripOldShellAssets(html) {
  return html
    .replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/top-block-hotfix\.css(?:\?[^"']*)?["']\s*\/?>/gi, "")
    .replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/site-shell-[^"']+\.css(?:\?[^"']*)?["']\s*\/?>/gi, "")
    .replace(/\s*<script\s+src=["']\/site-shell-[^"']+\.js(?:\?[^"']*)?["'][^>]*><\/script>/gi, "");
}

for (const target of walk(root)) {
  const relative = path.relative(root, target).replace(/\\/g, "/");
  const before = fs.readFileSync(target, "utf8");
  if (before.includes("data-legacy-redirect") || /^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  checked += 1;

  let html = stripOldShellAssets(before);
  if (!html.includes("</head>") || !html.includes("</body>")) throw new Error(`${relative}: thiếu thẻ đóng head/body`);
  html = html.replace("</head>", `${STYLE_TAG}\n</head>`);
  html = html.replace("</body>", `${SCRIPT_TAG}\n</body>`);

  if (html.includes(STYLE_TAG) && html.includes(SCRIPT_TAG)) withShell += 1;
  if (html === before) continue;

  fs.writeFileSync(target, html);
  changed += 1;
  try { execFileSync("git", ["update-index", "--assume-unchanged", `tuyen-tho-mo/${relative}`], { stdio: "ignore" }); } catch (_) {}
}

if (checked < 110) throw new Error(`Site shell expected at least 110 pages, got ${checked}`);
if (withShell !== checked) throw new Error(`Site shell chỉ có trên ${withShell}/${checked} trang`);

console.log(JSON.stringify({
  status: "enhanced",
  shell: "site-shell-20260803",
  html_checked: checked,
  html_changed: changed,
  navigation_cleanup: "css-and-runtime",
  html_with_shell: withShell,
}, null, 2));
