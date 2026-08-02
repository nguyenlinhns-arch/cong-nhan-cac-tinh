import "./enhance-v5-v4-compat.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const campaign = "lan_toa_nghe_mo_2026";
const bareTarget = "/kiem-tra-dieu-kien/#dang-ky";
const changedFiles = [];
let linksUpdated = 0;

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function contentKey(relative) {
  const clean = relative
    .replace(/\\/g, "/")
    .replace(/\/index\.html$/i, "")
    .replace(/\.html$/i, "")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return `v5_${clean || "home"}`.slice(0, 100);
}

for (const target of walk(root)) {
  const relative = path.relative(root, target).replace(/\\/g, "/");
  const before = fs.readFileSync(target, "utf8");
  if (before.includes("data-legacy-redirect")) continue;
  let html = before;
  const isConditionPage = relative === "kiem-tra-dieu-kien/index.html";
  const replacement = isConditionPage
    ? "#dang-ky"
    : `/kiem-tra-dieu-kien/?utm_source=website&utm_medium=internal&utm_campaign=${campaign}&utm_content=${contentKey(relative)}#dang-ky`;

  const matches = html.split(`href="${bareTarget}"`).length - 1;
  if (matches > 0) {
    html = html.replaceAll(`href="${bareTarget}"`, `href="${replacement}"`);
    linksUpdated += matches;
  }
  const singleMatches = html.split(`href='${bareTarget}'`).length - 1;
  if (singleMatches > 0) {
    html = html.replaceAll(`href='${bareTarget}'`, `href='${replacement}'`);
    linksUpdated += singleMatches;
  }

  if (html !== before) {
    fs.writeFileSync(target, html);
    changedFiles.push(`tuyen-tho-mo/${relative}`);
    try { execFileSync("git", ["update-index", "--assume-unchanged", `tuyen-tho-mo/${relative}`], { stdio: "ignore" }); } catch (_) {}
  }
}

let bareRemaining = 0;
let attributedLinks = 0;
for (const target of walk(root)) {
  const relative = path.relative(root, target).replace(/\\/g, "/");
  const html = fs.readFileSync(target, "utf8");
  if (html.includes("data-legacy-redirect")) continue;
  bareRemaining += (html.match(/href=["']\/kiem-tra-dieu-kien\/#dang-ky["']/g) || []).length;
  if (relative !== "kiem-tra-dieu-kien/index.html") {
    for (const match of html.matchAll(/href=["']([^"']*\/kiem-tra-dieu-kien\/[^"']*#dang-ky)["']/g)) {
      const url = new URL(match[1].replaceAll("&amp;", "&"), "https://thaylinhtuyenthomo.vn/");
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
        if (!url.searchParams.get(key)) throw new Error(`${relative}: V5 condition link is missing ${key}`);
      }
      attributedLinks += 1;
    }
  }
}

if (bareRemaining) throw new Error(`V5 still has ${bareRemaining} bare condition links`);
if (attributedLinks < 100) throw new Error(`V5 expected at least 100 attributed condition links, got ${attributedLinks}`);

console.log(JSON.stringify({
  target: "V5 condition links",
  links_updated: linksUpdated,
  attributed_links: attributedLinks,
  self_page_links: "fragment_only",
  bare_remaining: bareRemaining,
  changed_files: changedFiles.length,
  campaign,
}, null, 2));
