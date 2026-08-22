import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];
const stats = {
  checked: 0,
  changed: 0,
  manualOpeners: 0,
  evidenceListsConverted: 0,
  timelinesConverted: 0,
  seoResidueRemoved: 0,
};

const profilesRoot = path.resolve(projectRoot, "content", "editorial-prose-v4");
const manualProfiles = Object.assign({}, ...fs.readdirSync(profilesRoot)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(fs.readFileSync(path.join(profilesRoot, file), "utf8"))));

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function visible(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lowerFirst(value = "") {
  return String(value).replace(/^([“"'‘’(]*)(\p{Lu})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleLowerCase("vi")}`);
}

function cleanSentence(value = "") {
  return visible(value).replace(/[.;:!?\s]+$/u, "").trim();
}

function addArticleClass(html, className) {
  return html.replace(/<article\b([^>]*)class="([^"]*\barticle-body\b[^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
    const all = new Set(classes.split(/\s+/).filter(Boolean));
    all.add(className);
    return `<article${before}class="${[...all].join(" ")}"${after}>`;
  });
}

function replaceLead(html, lead) {
  const encoded = escapeHtml(lead);
  let output = html.replace(/<p\b([^>]*)class="([^"]*\blead\b[^"]*)"([^>]*)>[\s\S]*?<\/p>/i, `<p$1class="$2"$3>${encoded}</p>`);
  output = output.replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${encoded}">`);
  output = output.replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${encoded}">`);
  return output;
}

function replaceOpening(html, paragraphs) {
  const rendered = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  return html.replace(
    /(<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>\s*(?:<figure\b[\s\S]*?<\/figure>\s*)?)(?:<p\b(?![^>]*class="[^"]*(?:article-genre-label|article-byline))[^>]*>[\s\S]*?<\/p>\s*){2}/i,
    `$1${rendered}`,
  );
}

function replaceHeadings(html, headings = {}) {
  let output = html;
  for (const [before, after] of Object.entries(headings)) {
    output = output.replace(new RegExp(`<h2>${escapeRegExp(before)}<\\/h2>`, "g"), `<h2>${after}</h2>`);
  }
  return output;
}

function replaceConclusion(html, conclusion) {
  return html.replace(/<p\b([^>]*)class="([^"]*\barticle-conclusion\b[^"]*)"([^>]*)>[\s\S]*?<\/p>/i,
    `<p$1class="$2"$3>${escapeHtml(conclusion)}</p>`);
}

function listItems(fragment = "") {
  return [...String(fragment).matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => visible(match[1]))
    .filter(Boolean);
}

function sentencesFromItems(items = []) {
  const transitions = ["Trước hết,", "Tiếp đó,", "Cùng với đó,", "Cuối cùng,"];
  return items.map((item, index) => `${transitions[Math.min(index, transitions.length - 1)]} ${lowerFirst(cleanSentence(item))}.`);
}

function convertEvidenceLists(html, manualEvidence = "") {
  let converted = 0;
  const output = html.replace(/<ul\b[^>]*class="[^"]*\bevidence-list\b[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi, (_match, body) => {
    converted += 1;
    if (manualEvidence) return `<div class="article-prose-points"><p>${escapeHtml(manualEvidence)}</p></div>`;
    const items = listItems(body);
    const sentences = sentencesFromItems(items);
    if (!sentences.length) return "";
    const midpoint = sentences.length > 2 ? Math.ceil(sentences.length / 2) : sentences.length;
    const paragraphs = [sentences.slice(0, midpoint), sentences.slice(midpoint)].filter((group) => group.length);
    return `<div class="article-prose-points">${paragraphs.map((group) => `<p>${escapeHtml(group.join(" "))}</p>`).join("")}</div>`;
  });
  return {output, converted};
}

function convertTimelines(html) {
  let converted = 0;
  const output = html.replace(/<ol\b[^>]*class="[^"]*\btimeline\b[^"]*"[^>]*>([\s\S]*?)<\/ol>/gi, (_match, body) => {
    const items = [...body.matchAll(/<li\b[^>]*>[\s\S]*?<strong>([\s\S]*?)<\/strong>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<\/li>/gi)]
      .map((match) => ({title: visible(match[1]), description: visible(match[2])}))
      .filter((item) => item.title && item.description);
    if (!items.length) return _match;
    converted += 1;
    const transitions = ["Trước hết", "Tiếp đó", "Trong quá trình thực hiện", "Cuối cùng"];
    const sentences = items.map((item, index) => `${transitions[Math.min(index, transitions.length - 1)]}, <strong>${escapeHtml(item.title)}</strong>: ${escapeHtml(lowerFirst(cleanSentence(item.description)))}.`);
    const midpoint = sentences.length > 2 ? Math.ceil(sentences.length / 2) : sentences.length;
    const groups = [sentences.slice(0, midpoint), sentences.slice(midpoint)].filter((group) => group.length);
    return `<div class="article-prose-sequence">${groups.map((group) => `<p>${group.join(" ")}</p>`).join("")}</div>`;
  });
  return {output, converted};
}

function removeSeoResidue(html) {
  let removed = 0;
  const output = html.replace(/<p\b[^>]*class="[^"]*(?:article-seo-line|keyword-summary|article-editor-note)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, () => {
    removed += 1;
    return "";
  });
  return {output, removed};
}

function slugFromFile(file) {
  return path.basename(path.dirname(file));
}

function applyManualProfile(html, profile) {
  let output = replaceLead(html, profile.lead);
  output = replaceOpening(output, profile.intro);
  output = replaceHeadings(output, profile.headings);
  output = replaceConclusion(output, profile.conclusion);
  return output;
}

for (const directory of ["bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(before)) continue;
    if (!/<article\b[^>]*class="[^"]*\barticle-body\b/i.test(before)) continue;
    stats.checked += 1;
    const slug = slugFromFile(file);
    const profile = manualProfiles[slug];
    let html = addArticleClass(before, "article-body--prose-v4");
    if (profile) {
      html = applyManualProfile(html, profile);
      stats.manualOpeners += 1;
    }
    const evidence = convertEvidenceLists(html, profile?.evidence || "");
    html = evidence.output;
    stats.evidenceListsConverted += evidence.converted;
    const timelines = convertTimelines(html);
    html = timelines.output;
    stats.timelinesConverted += timelines.converted;
    const seo = removeSeoResidue(html);
    html = seo.output;
    stats.seoResidueRemoved += seo.removed;
    if (html === before) continue;
    fs.writeFileSync(file, html);
    changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  let tracked = new Set();
  try {
    tracked = new Set(execFileSync("git", ["ls-files", "-z"], {cwd: projectRoot, encoding: "utf8"}).split("\0").filter(Boolean));
  } catch {}
  const files = changed.filter((file) => tracked.has(file));
  for (let index = 0; index < files.length; index += 50) {
    const chunk = files.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

stats.changed = changed.length;
console.log(JSON.stringify({
  status: "editorial-prose-v4-complete",
  ...stats,
  sample: changed.slice(0, 20),
}, null, 2));
